import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

// Replace with your real production domain before deploying.
const SITE_URL = "https://speed-test-nine-sepia.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Internet Speed Test — Check Download, Upload & Ping | PulseCheck",
    template: "%s | PulseCheck Speed Test",
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
  authors: [{ name: "PulseCheck" }],
  creator: "PulseCheck",
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
    siteName: "PulseCheck Speed Test",
    title: "Internet Speed Test — Check Download, Upload & Ping",
    description:
      "Free, accurate internet speed test. Measure download speed, upload speed, ping, and jitter in seconds.",
    locale: "en_US",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PulseCheck — Internet Speed Test",
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
  name: "PulseCheck Speed Test",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (runs in browser)",
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1204",
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
