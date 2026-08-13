import type { Metadata, Viewport } from "next";

import "./globals.css";

const display = { variable: "--font-display" };

const body = { variable: "--font-body" };

const mono = { variable: "--font-mono" };

// Replace with your real production domain before deploying.
const SITE_URL = "https://www.speedotest.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Internet Speed Test — Check Download, Upload & Ping | SpeedoTest",
    template: "%s | SpeedoTest Speed Test",
  },
  icons: {
    icon: "/pwa-icon.svg",
  },
  description:
    "Free internet speed test. Instantly measure your download speed, upload speed, ping, and jitter with a server-based test built for accuracy — no sign-up required.",
  keywords: [
    "internet speed test",
    "speed test",
    "check internet speed",
    "download speed test",
    "upload speed test",
    "ping test",
    "broadband speed test",
    "wifi speed test",
    "bandwidth test",
  ],
  authors: [{ name: "SpeedoTest" }],
  creator: "SpeedoTest",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "SpeedoTest",
    title: "Internet Speed Test — Check Download, Upload & Ping",
    description:
      "Free, accurate internet speed test. Measure download speed, upload speed, ping, and jitter in seconds.",
    locale: "en_US",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SpeedoTest — Internet Speed Test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Internet Speed Test — Check Download, Upload & Ping",
    description:
      "Free, accurate internet speed test. Measure download speed, upload speed, ping, and jitter in seconds.",
    images: ["/og-image.svg"],
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0B5FFF",
  width: "device-width",
  initialScale: 1,
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SpeedoTest",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (runs in browser)",
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free browser-based internet speed test measuring download speed, upload speed, ping, and jitter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9086432794955952"
          crossOrigin="anonymous"
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppJsonLd),
          }}
        />
      </head>
      <body className="font-body antialiased min-h-screen">{children}</body>
    </html>
  );
}
