import type { Metadata, Viewport } from "next";

import "./globals.css";

const display = { variable: "--font-display" };
const body = { variable: "--font-body" };
const mono = { variable: "--font-mono" };

const SITE_URL = "https://www.speedotest.online";

const SITE_NAME = "SpeedoTest";

const SITE_DESCRIPTION =
  "Free internet speed test to check your download speed, upload speed, ping, and jitter. Test your internet connection instantly from your browser with SpeedoTest.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Internet Speed Test – Check Your Internet Speed | SpeedoTest",
    template: "%s | SpeedoTest",
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  keywords: [
    "internet speed test",
    "check internet speed",
    "speed test",
    "internet speed checker",
    "internet speed test online",
    "free internet speed test",
    "wifi speed test",
    "WiFi speed test",
    "download speed test",
    "upload speed test",
    "ping test",
    "jitter test",
    "broadband speed test",
    "network speed test",
    "internet connection test",
    "check wifi speed",
    "test internet speed",
  ],

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  category: "technology",

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/pwa-icon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/pwa-icon.svg",
    apple: "/pwa-icon.svg",
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,

    title: "Internet Speed Test – Check Your Internet Speed | SpeedoTest",

    description:
      "Check your internet speed instantly. Measure download speed, upload speed, ping, and jitter with SpeedoTest.",

    locale: "en_US",

    images: [
      {
        url: `${SITE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "SpeedoTest – Free Internet Speed Test",
        type: "image/svg+xml",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Internet Speed Test – Check Your Internet Speed | SpeedoTest",

    description:
      "Free online internet speed test. Check download speed, upload speed, ping, and jitter in seconds.",

    images: [`${SITE_URL}/og-image.svg`],
  },

  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  themeColor: "#0B5FFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* -------------------------------------------------------------------------- */
/* Structured Data                                                            */
/* -------------------------------------------------------------------------- */

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/pwa-icon.svg`,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  inLanguage: "en-US",
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE_URL}/#webapplication`,
  name: "SpeedoTest Internet Speed Test",
  url: SITE_URL,

  applicationCategory: "UtilitiesApplication",

  operatingSystem: "Any",

  browserRequirements: "Requires JavaScript",

  isAccessibleForFree: true,

  description:
    "Free browser-based internet speed test for measuring download speed, upload speed, ping, and jitter.",

  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },

  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },

  featureList: [
    "Internet speed test",
    "Download speed test",
    "Upload speed test",
    "Ping test",
    "Jitter test",
    "WiFi speed test",
    "Broadband speed test",
  ],
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
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9086432794955952"
          crossOrigin="anonymous"
        />

        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        {/* Website structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />

        {/* Web Application structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationJsonLd),
          }}
        />
      </head>

      <body className="font-body antialiased min-h-screen">{children}</body>
    </html>
  );
}
