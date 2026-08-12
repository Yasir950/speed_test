import { Zap } from "lucide-react";
import SpeedTest from "@/components/SpeedTest";
import NetworkInfo from "@/components/NetworkInfo";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <>
      <header className="border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display font-semibold text-lg tracking-tight text-ink flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-lg bg-grad-signal flex items-center justify-center">
              <Zap size={15} className="text-white" fill="white" />
            </span>
            Pulse<span className="text-signal">Check</span>
          </span>
          <nav aria-label="Primary">
            <ul className="flex gap-6 text-sm text-inkSoft font-body">
              <li>
                <a href="#test" className="hover:text-ink transition-colors">
                  Speed test
                </a>
              </li>
              <li>
                <a
                  href="#how-heading"
                  className="hover:text-ink transition-colors"
                >
                  How it works
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="bg-mesh">
        <section id="test" className="max-w-5xl mx-auto px-6 pt-16 pb-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink text-balance leading-tight">
              Check your internet speed in seconds
            </h1>
            <p className="mt-4 text-inkSoft text-base sm:text-lg text-balance">
              Real server-based measurement of download speed, upload speed,
              ping, and jitter — free, no sign-up, no app to install.
            </p>
          </div>

          <div className="w-full lg:w-auto flex justify-center rounded-2xl border border-line bg-surface shadow-card px-6 py-10 sm:px-12">
            <SpeedTest />
          </div>
        </section>

        <HowItWorks />
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-inkFaint">
          <p>
            &copy; {new Date().getFullYear()} PulseCheck. Not affiliated with
            any ISP.
          </p>
          <p>Built with Next.js.</p>
        </div>
      </footer>
    </>
  );
}
