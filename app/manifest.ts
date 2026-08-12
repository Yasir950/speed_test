import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PulseCheck Speed Test",
    short_name: "PulseCheck",
    description:
      "Free internet speed test measuring download speed, upload speed, ping, and jitter.",
    start_url: "/",
    display: "standalone",
    background_color: "#EEF1F4",
    theme_color: "#0B5FFF",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
