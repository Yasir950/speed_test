import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F7FB",
        paperDim: "#ECEEF5",
        surface: "#FFFFFF",
        ink: "#0F1424",
        inkSoft: "#5B6478",
        inkFaint: "#9AA2B4",
        line: "#E2E5EE",
        signal: "#4F46E5",
        signalDeep: "#3730A3",
        cyan: "#06B6D4",
        violet: "#8B5CF6",
        amber: "#F59E0B",
        good: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,20,36,0.04), 0 8px 24px -12px rgba(15,20,36,0.10)",
        raised: "0 4px 12px rgba(79,70,229,0.18)",
      },
      keyframes: {
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.85)", opacity: "0.9" },
          "70%": { transform: "scale(1.15)", opacity: "0" },
          "100%": { transform: "scale(1.15)", opacity: "0" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        sweep: "sweep 2.4s linear infinite",
        pulseRing: "pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
        rise: "rise 0.5s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
      backgroundImage: {
        "grad-signal": "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
        "grad-violet": "linear-gradient(135deg, #8B5CF6 0%, #4F46E5 100%)",
        "grad-amber": "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
        "grad-good": "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
