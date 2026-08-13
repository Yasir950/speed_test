# PulseCheck — Internet Speed Test (Next.js)

## v4 — fixed flickering UI (found via deployed-site inspection)

**Root cause, confirmed by reading the actual installed package source:**
Cloudflare's *default* measurement plan doesn't run latency, then download,
then upload as separate blocks — it interleaves them (latency → download →
latency → download → latency → upload → latency → **packetLoss via WebRTC**
→ upload → download → upload → download...) for its own diagnostic
dashboard. The UI's phase indicator (the gauge's color/label) was following
that raw signal directly, so it was genuinely flipping between ping/
download/upload dozens of times over the course of one test — that's the
flicker, not a rendering bug.

Fixed in `lib/speedtest.ts`:

- **Custom, non-interleaved measurement config** — all latency samples,
  then all download rounds, then all upload rounds, as one clean block
  each. The self-limiting behavior that keeps test time reasonable on slow
  connections (`bandwidthFinishRequestDuration`) is untouched.
- **Dropped the WebRTC/TURN-based packet-loss step** entirely — it's not a
  metric this app displays, it requires an ICE/TURN handshake that can hang
  for many seconds on networks that restrict WebRTC, and removing it also
  removes one interleaving source.
- **Throttled UI updates** to ~150ms intervals during bandwidth phases
  (the engine can report new samples many times a second; re-rendering the
  gauge that often reads as flicker even without a phase change). Phase
  *changes* still render immediately and bypass the throttle, so the UI
  feels responsive at transitions.
- **Hard 40s timeout** — if Cloudflare's network is reachable but unusually
  degraded and the test stalls, the app now falls back to its own server
  rather than leaving the UI stuck indefinitely.
- **Reduced the fallback server's max payload** from 100MB to 25MB per
  request — large enough to measure accurately, small enough to stay well
  within typical serverless function duration limits (e.g. Vercel Hobby's
  default 10s), which could otherwise silently truncate a download mid-test
  on a slow connection.

## v3 — switched to Cloudflare's public speed test network

**The core problem with v1/v2:** every measurement ran against this app's
own server. If that server isn't geographically close to the visitor, or
doesn't have serious bandwidth behind it, results will be meaningfully off
from Speedtest.net/fast.com — those services work well specifically
*because* they auto-select from large networks of nearby servers.

**The fix:** this version uses [`@cloudflare/speedtest`](https://github.com/cloudflare/speedtest),
Cloudflare's own official, MIT-licensed npm package — the same engine
that powers speed.cloudflare.com. It measures directly from the visitor's
browser against Cloudflare's edge network (300+ cities), auto-selecting the
nearest one, with no API key and no backend involvement. This is the same
category of "public API" as Speedtest.net's or fast.com's own
infrastructure — a real, independently-operated network, not something we
built.

- Primary engine: `lib/speedtest.ts` → `runCloudflareSpeedTest()`
- Automatic fallback: if Cloudflare's domains are blocked on a given
  network (some corporate firewalls block third-party speed-test traffic),
  the app transparently falls back to testing against its own `/api/*`
  routes instead — see `runFallbackSpeedTest()` in the same file. The UI
  shows which engine actually ran after each test.
- The `/api/ping`, `/api/download`, `/api/upload` routes are **kept** for
  this fallback path — they're no longer the primary measurement path, but
  removing them would mean the tool breaks entirely on networks that block
  Cloudflare's test domains.

Expect results now to track much closer to Speedtest.net/fast.com. They
still won't be identical — different providers land on different servers
and network paths — but the days of 1000+ Mbps on a 25 Mbps connection are
over as long as you're testing over a real internet connection (see below
for the one case that's still not fixable in code).

## v2 changes

- **Redesigned** with an icon-based, indigo/violet/amber color system
  (`tailwind.config.ts`) instead of the flat gray v1 palette.
- **FAQ section removed** (component deleted, no FAQ JSON-LD left behind).
- **Network Info panel** now hides ISP/location fields entirely when they
  can't be resolved (no more "Unavailable" placeholders) instead of always
  showing them.
- **Localhost detection**: if `/api/ip-info` resolves to a loopback/private
  address, the UI now shows an explicit warning explaining why results will
  be wildly inflated — see "Why results look exaggerated" below.
- Fixed a real TypeScript build error in `lib/speedtest.ts` (XHR `.send()`
  type mismatch) surfaced during the production build.

## Why results look exaggerated on localhost

If you test this on `localhost` (i.e. `npm run dev` and open
`http://localhost:3000` in the same browser), your IP will resolve to a
loopback address (`::1` or `127.0.0.1`). That means the "download" and
"upload" never leave your machine — they never touch your router, your ISP,
or the internet at all. You're measuring your OS's internal network stack
speed, which is effectively RAM speed, not internet speed. That's why you
can see numbers like 1000+ Mbps down / 400+ Mbps up on a connection that
Ookla/Speedtest.net reports as 27 Mbps down / 31 Mbps up — those two tests
are not measuring the same thing.

This is not a bug specific to this project — it's true of any speed test
architecture. The fix is to **deploy the site to a real server** (Vercel,
a VPS, anywhere with a public URL) and test from there. Once traffic
actually has to leave your device and travel your real ISP connection,
the numbers will be meaningful — and this version now includes parallel
multi-connection transfers (matching how Ookla/Speedtest.net measure) so
they'll be as accurate as a single-server test can be.


A real, server-based internet speed test built with Next.js 15 (App Router) +
TypeScript + Tailwind CSS. Measures download speed, upload speed, ping, and
jitter, plus IP/ISP/location lookup — with SEO built in from the ground up.

## What's actually real here (important)

Every number this site shows is a genuine measurement:

- **Ping / jitter / download / upload** — measured against Cloudflare's
  public edge network via `@cloudflare/speedtest` (see "v3" above), with
  this app's own `/api/ping`, `/api/download`, `/api/upload` routes as an
  automatic fallback if that network is unreachable.
- **IP / ISP / location** — read from request headers + a third-party geo
  API (`ipapi.co`, free tier, no key needed).

**One thing this site does *not* do, on purpose: show how many devices are
on your Wi-Fi.** No website can. Browsers are sandboxed away from your local
network/router for security reasons — any speed test claiming to show
connected-device counts is either faking it or asking for your router login.
Instead, the "Network Info" panel tells users how to check that for real
(their router's admin page), and shows what a browser *can* honestly report
(connection type via the Network Information API, which is Chromium-only and
approximate).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Before deploying to production

1. **Set your real domain.** Replace `https://www.pulsecheck-speedtest.com`
   in these three files with your actual domain:
   - `app/layout.tsx` (`SITE_URL`)
   - `app/sitemap.ts`
   - `app/robots.ts`

2. **Geo API rate limits.** `/api/ip-info` uses ipapi.co's free tier
   (~1,000 requests/day, no key). If you expect meaningful traffic, swap it
   for a paid provider (ipinfo.io, MaxMind GeoIP2, IP2Location) or self-host
   a GeoLite2 database — the free tier will start returning errors under
   load, which the route already handles gracefully (falls back to
   IP-only, no location).

3. **Deploy.** This is a standard Next.js app — deploys cleanly to Vercel,
   Netlify, or any Node host. On Vercel: push to a Git repo, import it at
   vercel.com/new, no config needed.
   - The download/upload test endpoints are dynamic API routes (not
     serverless-edge by default here — they use `runtime = "nodejs"` for
     reliable streaming). This works on Vercel's standard Node functions.

4. **Custom domain + HTTPS.** Speed tests should always run over HTTPS —
   browsers throttle/deprioritize insecure connections and some APIs used
   here (Network Information API) behave inconsistently over HTTP.

## SEO — what's already implemented, and what you still have to do

### Already in the code
- Per-page `<title>` / meta description via Next.js Metadata API, keyword-
  targeted for "internet speed test", "download speed test", "ping test",
  etc. (`app/layout.tsx`)
- Open Graph + Twitter Card tags with a share image (`public/og-image.svg`)
- `SoftwareApplication` and `FAQPage` JSON-LD structured data — the FAQ
  schema is what makes FAQ accordions eligible for rich results in Google
  search
- Auto-generated `sitemap.xml` and `robots.txt` (`app/sitemap.ts`,
  `app/robots.ts`)
- Semantic HTML: single `<h1>`, proper heading hierarchy, `<nav>`,
  `<details>/<summary>` for FAQs (crawlable without JS)
- Real, substantial on-page content (How It Works + FAQ sections) — thin
  pages with just a widget and no text rank poorly; search engines need
  text to match against queries
- Fast by default: no heavy client libraries, system-level font loading via
  `next/font` (self-hosted, no render-blocking Google Fonts request),
  static generation for every page except the four API routes
- `no-store` caching on API routes so test results are never served stale
  from a CDN cache

### You still need to do (no code can do this for you)
Ranking "at the top" for a competitive term like "internet speed test" is
not primarily a code problem — it's an authority/content/time problem.
Realistically:

1. **Submit to Google Search Console and Bing Webmaster Tools** the moment
   you deploy. Submit your sitemap URL there.
2. **Backlinks matter more than on-page code** for a query this
   competitive. Existing players (Speedtest.net/Ookla, fast.com,
   speedcheck.org) have years of domain authority and thousands of
   backlinks. Expect this to take months of content + outreach, not days.
3. **Write more content**, not just the test itself: guides like "why is my
   internet slow," "Mbps vs MBps explained," "best internet speed for
   gaming," etc. — each targeting a specific long-tail search query — will
   do more for ranking than any additional meta tag.
4. **Core Web Vitals in the real world**: run Lighthouse / PageSpeed
   Insights against your live deployed URL (not localhost) once it's
   deployed, since real-world network/CDN behavior affects these scores.
5. **Get the favicon/OG image right**: `public/icon.svg` and
   `public/og-image.svg` are placeholder SVGs matching the site's design
   tokens — swap in a raster PNG favicon set if you want maximum
   compatibility across old browsers/platforms (favicon.ico, apple-touch-
   icon.png, etc.).

## Project structure

```
app/
  api/
    ping/route.ts       ping/latency endpoint
    download/route.ts   streams randomized bytes for download throughput
    upload/route.ts     consumes uploaded bytes for upload throughput
    ip-info/route.ts    IP + ISP + location lookup
  layout.tsx             root layout, all SEO metadata + JSON-LD
  page.tsx               home page
  sitemap.ts             sitemap.xml
  robots.ts              robots.txt
  manifest.ts            PWA manifest
  globals.css
components/
  SpeedTest.tsx          orchestrates the ping -> download -> upload flow
  SignalGauge.tsx         the radial "signal sweep" visualization
  ResultCard.tsx          metric display cards
  NetworkInfo.tsx         IP/ISP/location + honest device-count explainer
  HowItWorks.tsx
  FaqSection.tsx
lib/
  speedtest.ts            all measurement logic (framework-agnostic)
```

## Design notes

Palette and type are defined as design tokens in `tailwind.config.ts`
(`paper`, `ink`, `signal`, `amber`, `good`). Display face is Space Grotesk,
body is Inter, data readouts use JetBrains Mono. The signature visual is the
`SignalGauge` — a radar-style sweep with pulsing rings, used instead of a
generic dial/speedometer to tie the visual language to networking/pings
rather than car dashboards.
