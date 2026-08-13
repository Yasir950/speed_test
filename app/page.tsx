import Image from "next/image";
import SpeedTest from "@/components/SpeedTest";
import NetworkInfo from "@/components/NetworkInfo";
import HowItWorks from "@/components/HowItWorks";

const faqItems = [
  {
    question: "How do I check my internet speed?",
    answer:
      "To check your internet speed, open SpeedoTest and start the speed test. The test measures your download speed, upload speed, ping, and jitter so you can see how your internet connection is performing.",
  },
  {
    question: "What is a good internet speed?",
    answer:
      "The internet speed you need depends on how you use the internet and how many devices share your connection. Basic browsing requires less bandwidth than HD or 4K streaming, video calls, gaming, large downloads, and households with many connected devices.",
  },
  {
    question: "What is download speed?",
    answer:
      "Download speed measures how quickly data can be transferred from the internet to your device. It affects activities such as browsing websites, streaming videos, downloading files, and loading online content.",
  },
  {
    question: "What is upload speed?",
    answer:
      "Upload speed measures how quickly data can be sent from your device to the internet. It is important for uploading files, sending photos and videos, cloud backups, video calls, live streaming, and other activities that send data.",
  },
  {
    question: "What is ping or latency?",
    answer:
      "Ping, also called latency, measures the response time between your device and a server. It is measured in milliseconds. Lower latency is generally better for online gaming, video calls, remote work, and other interactive applications.",
  },
  {
    question: "What is jitter?",
    answer:
      "Jitter measures how much your network latency changes over time. High jitter can cause inconsistent performance during video calls, voice calls, online gaming, and other real-time applications.",
  },
  {
    question: "Why is my internet speed slower than expected?",
    answer:
      "Slow speed test results can be caused by weak Wi-Fi signal, distance from your router, network congestion, background downloads, other connected devices, VPNs, router limitations, wireless interference, or limitations of your internet service.",
  },
  {
    question: "Does Wi-Fi affect my internet speed test?",
    answer:
      "Yes. Wi-Fi performance can be affected by distance from the router, walls, interference, router hardware, wireless standards, and other devices using the network. For the most consistent comparison, you can also test using a wired Ethernet connection when available.",
  },
  {
    question: "How accurate is an internet speed test?",
    answer:
      "An internet speed test provides a measurement of your connection under the conditions present during the test. Results can vary because of network congestion, Wi-Fi conditions, server location, background traffic, and other factors. Running several tests at different times can give you a better picture of your typical performance.",
  },
  {
    question: "Should I run an internet speed test more than once?",
    answer:
      "Yes. Running multiple tests can help determine whether a slow result is temporary or consistent. Testing at different times can also reveal whether your connection becomes slower during periods of network congestion.",
  },
  {
    question: "Can I test my internet speed on my phone?",
    answer:
      "Yes. SpeedoTest works in a modern web browser, so you can use it on compatible smartphones, tablets, laptops, and desktop computers. Your result can vary depending on whether you are connected through Wi-Fi or mobile data.",
  },
  {
    question: "Is SpeedoTest free?",
    answer:
      "Yes. SpeedoTest is a free browser-based internet speed test. You can use it to measure download speed, upload speed, ping, and jitter without installing a separate application.",
  },
];

const speedGuide = [
  {
    activity: "Basic browsing",
    speed: "5–10 Mbps",
    description:
      "Suitable for websites, email, messaging, and everyday browsing.",
  },
  {
    activity: "HD video streaming",
    speed: "10–25 Mbps",
    description:
      "A reasonable range for HD streaming and common online activities.",
  },
  {
    activity: "4K streaming",
    speed: "25–50+ Mbps",
    description:
      "Higher bandwidth is useful for high-resolution streaming and multiple devices.",
  },
  {
    activity: "Online gaming",
    speed: "25+ Mbps",
    description:
      "Gaming also depends heavily on ping, jitter, stability, and packet loss.",
  },
  {
    activity: "Multiple users",
    speed: "100+ Mbps",
    description:
      "Higher speeds can help when several people stream, work, study, or game simultaneously.",
  },
];

const slowInternetReasons = [
  "Weak Wi-Fi signal",
  "Being far away from the router",
  "Walls or physical obstacles",
  "Too many connected devices",
  "Background downloads or uploads",
  "Cloud backups and synchronization",
  "Video streaming on other devices",
  "Network congestion",
  "Old or limited router hardware",
  "Wireless interference",
  "VPN usage",
  "Internet service provider limitations",
];

const improvementTips = [
  {
    title: "Move closer to your router",
    description:
      "A stronger Wi-Fi signal can improve wireless performance. Try testing from different locations to see how much signal strength affects your results.",
  },
  {
    title: "Use Ethernet when possible",
    description:
      "A wired Ethernet connection can provide a more stable connection and can help determine whether Wi-Fi is limiting your internet performance.",
  },
  {
    title: "Pause heavy downloads",
    description:
      "Large downloads, cloud backups, software updates, and streaming can consume bandwidth while you are testing your connection.",
  },
  {
    title: "Restart your router",
    description:
      "Restarting your router can sometimes resolve temporary connectivity or performance problems.",
  },
  {
    title: "Test at different times",
    description:
      "Running speed tests throughout the day can help you identify whether your connection slows down during busy periods.",
  },
  {
    title: "Check your internet plan",
    description:
      "Compare your measured results with the speed advertised by your internet service provider. Keep in mind that actual performance can vary.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Check Your Internet Speed",
  description:
    "Use SpeedoTest to measure your download speed, upload speed, ping, and jitter.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Open SpeedoTest",
      text: "Open SpeedoTest in a modern web browser.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Start the internet speed test",
      text: "Start the speed test and allow it to measure your connection.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Wait for the test",
      text: "Allow the download, upload, ping, and jitter measurements to complete.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Review your results",
      text: "Review your internet speed test results and compare them with your expected connection performance.",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToJsonLd),
        }}
      />

      <header className="border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            aria-label="SpeedoTest home"
            className="font-display font-bold text-xl tracking-tight text-ink flex items-center"
          >
            <span className="w-7 h-7 flex items-center justify-center mr-2">
              <Image
                src="/pwa-icon.svg"
                alt="SpeedoTest"
                width={28}
                height={28}
                priority
              />
            </span>
            Speedo<span className="text-signal">Test</span>
          </a>

          <nav aria-label="Primary navigation">
            <ul className="flex gap-6 text-sm text-inkSoft font-body">
              <li>
                <a href="#test" className="hover:text-ink transition-colors">
                  Speed test
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-ink transition-colors"
                >
                  How it works
                </a>
              </li>

              <li className="hidden sm:block">
                <a href="#faq" className="hover:text-ink transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="bg-mesh">
        {/* ============================================================ */}
        {/* HERO / SPEED TEST */}
        {/* ============================================================ */}

        <section
          id="test"
          aria-labelledby="speed-test-heading"
          className="max-w-5xl mx-auto px-6 pt-16 pb-14"
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-signal mb-3">
              Free Internet Speed Test
            </p>

            <h1
              id="speed-test-heading"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink text-balance leading-tight"
            >
              Internet Speed Test – Check Your Internet Speed
            </h1>

            <p className="mt-5 text-inkSoft text-base sm:text-lg text-balance leading-8">
              Test your internet connection in seconds. Measure download speed,
              upload speed, ping, and jitter with a free browser-based internet
              speed test. No sign-up and no app installation required.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            <div className="w-full lg:w-auto flex justify-center rounded-2xl border border-line bg-surface shadow-card px-6 py-10 sm:px-12">
              <SpeedTest />
            </div>

            <aside
              className="w-full lg:w-80 lg:mt-1"
              aria-label="Network information"
            >
              <NetworkInfo />
            </aside>
          </div>

          <p className="mt-8 text-center text-sm text-inkFaint max-w-2xl mx-auto">
            For more consistent results, pause large downloads, uploads,
            streaming, VPNs, and other bandwidth-heavy activities before
            starting the test.
          </p>
        </section>

        {/* ============================================================ */}
        {/* INTRODUCTION */}
        {/* ============================================================ */}

        <section
          aria-labelledby="internet-speed-test-heading"
          className="max-w-5xl mx-auto px-6 py-16"
        >
          <div className="max-w-3xl mx-auto">
            <h2
              id="internet-speed-test-heading"
              className="font-display text-2xl sm:text-3xl font-semibold text-ink"
            >
              Free Online Internet Speed Test
            </h2>

            <div className="mt-6 space-y-5 text-inkSoft leading-8">
              <p>
                SpeedoTest is a free online internet speed test that helps you
                check how fast your internet connection is performing. Run a
                test to measure important connection metrics including download
                speed, upload speed, ping, and jitter.
              </p>

              <p>
                Whether you use fiber, broadband, cable, DSL, Wi-Fi, or mobile
                internet, checking your connection can help you understand
                whether you are receiving the performance you expect.
              </p>

              <p>
                If websites are loading slowly, videos are buffering, online
                games feel delayed, or video calls keep experiencing problems,
                an internet speed test can provide useful information about your
                connection.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* WHAT WE MEASURE */}
        {/* ============================================================ */}

        <section
          aria-labelledby="measurements-heading"
          className="border-y border-line bg-surface/60"
        >
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="max-w-3xl">
              <h2
                id="measurements-heading"
                className="font-display text-2xl sm:text-3xl font-semibold text-ink"
              >
                What Does a Speed Test Measure?
              </h2>

              <p className="mt-4 text-inkSoft leading-8">
                Internet performance is more than just download speed. Your
                connection can also be affected by upload performance, latency,
                and network stability.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
              <article className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Download Speed
                </h3>

                <p className="mt-3 text-sm leading-7 text-inkSoft">
                  Shows how quickly data can travel from the internet to your
                  device. It affects streaming, browsing, downloads, and other
                  activities that receive data.
                </p>
              </article>

              <article className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Upload Speed
                </h3>

                <p className="mt-3 text-sm leading-7 text-inkSoft">
                  Shows how quickly your device can send data to the internet.
                  Upload speed matters for cloud backups, file uploads,
                  livestreaming, and video calls.
                </p>
              </article>

              <article className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Ping
                </h3>

                <p className="mt-3 text-sm leading-7 text-inkSoft">
                  Measures network response time in milliseconds. Lower latency
                  is generally better for gaming, calls, and interactive
                  applications.
                </p>
              </article>

              <article className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Jitter
                </h3>

                <p className="mt-3 text-sm leading-7 text-inkSoft">
                  Measures variation in network latency. High jitter can make
                  real-time applications feel unstable or inconsistent.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* HOW IT WORKS */}
        {/* ============================================================ */}

        <section id="how-it-works" aria-labelledby="how-heading">
          <HowItWorks />
        </section>

        {/* ============================================================ */}
        {/* HOW TO CHECK */}
        {/* ============================================================ */}

        <section
          aria-labelledby="how-to-check-heading"
          className="max-w-5xl mx-auto px-6 py-16"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2
                id="how-to-check-heading"
                className="font-display text-2xl sm:text-3xl font-semibold text-ink"
              >
                How to Check Your Internet Speed
              </h2>

              <div className="mt-6 space-y-5 text-inkSoft leading-8">
                <p>
                  Checking your internet speed is simple. You do not need to
                  install software or create an account. Open SpeedoTest, start
                  the test, and wait for the measurements to finish.
                </p>

                <p>
                  Once the test is complete, review your download speed, upload
                  speed, ping, and jitter. If your results are consistently
                  below what you expect, you can investigate your Wi-Fi, router,
                  devices, or internet service.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  number: "1",
                  title: "Open SpeedoTest",
                  description:
                    "Open the free internet speed test in your browser.",
                },
                {
                  number: "2",
                  title: "Start the test",
                  description:
                    "Start the test and allow SpeedoTest to measure your connection.",
                },
                {
                  number: "3",
                  title: "Wait for the results",
                  description:
                    "Allow the download and upload measurements to complete.",
                },
                {
                  number: "4",
                  title: "Review your results",
                  description:
                    "Check your download speed, upload speed, ping, and jitter.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="flex gap-4 rounded-2xl border border-line bg-surface p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal text-white font-semibold">
                    {step.number}
                  </span>

                  <div>
                    <h3 className="font-semibold text-ink">{step.title}</h3>

                    <p className="mt-1 text-sm leading-6 text-inkSoft">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* DOWNLOAD / UPLOAD */}
        {/* ============================================================ */}

        <section className="border-y border-line bg-surface/60">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-8">
              <article>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  What Is Download Speed?
                </h2>

                <div className="mt-5 space-y-4 text-inkSoft leading-8">
                  <p>
                    Download speed is the rate at which information travels from
                    the internet to your device. It is usually measured in Mbps,
                    or megabits per second.
                  </p>

                  <p>
                    A higher download speed can make large downloads faster and
                    provide more bandwidth for activities such as streaming
                    video, browsing websites, and downloading applications.
                  </p>
                </div>
              </article>

              <article>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  What Is Upload Speed?
                </h2>

                <div className="mt-5 space-y-4 text-inkSoft leading-8">
                  <p>
                    Upload speed is the rate at which information travels from
                    your device to the internet.
                  </p>

                  <p>
                    It is important when uploading files, sharing photos and
                    videos, using cloud storage, making video calls, and
                    livestreaming.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PING AND JITTER */}
        {/* ============================================================ */}

        <section
          aria-labelledby="ping-jitter-heading"
          className="max-w-5xl mx-auto px-6 py-16"
        >
          <h2
            id="ping-jitter-heading"
            className="font-display text-2xl sm:text-3xl font-semibold text-ink"
          >
            Ping, Latency, and Jitter Explained
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <article>
              <h3 className="font-display text-xl font-semibold text-ink">
                What is Ping?
              </h3>

              <p className="mt-4 text-inkSoft leading-8">
                Ping is a measurement of network response time. It is normally
                displayed in milliseconds (ms). Lower latency generally means
                that your connection responds more quickly, which can be
                especially important for online gaming, video conferencing,
                remote work, and other interactive services.
              </p>
            </article>

            <article>
              <h3 className="font-display text-xl font-semibold text-ink">
                What is Jitter?
              </h3>

              <p className="mt-4 text-inkSoft leading-8">
                Jitter describes changes in latency over time. A connection with
                inconsistent latency can cause interruptions or unstable
                performance in applications that depend on a steady flow of
                network packets.
              </p>
            </article>
          </div>
        </section>

        {/* ============================================================ */}
        {/* GOOD INTERNET SPEED */}
        {/* ============================================================ */}

        <section
          aria-labelledby="good-speed-heading"
          className="border-y border-line bg-surface/60"
        >
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="max-w-3xl">
              <h2
                id="good-speed-heading"
                className="font-display text-2xl sm:text-3xl font-semibold text-ink"
              >
                What Is a Good Internet Speed?
              </h2>

              <p className="mt-5 text-inkSoft leading-8">
                The right internet speed depends on what you do online, how many
                devices are connected, and how many people use the connection at
                the same time. The following ranges are general guidelines
                rather than strict requirements.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="divide-y divide-line">
                {speedGuide.map((item) => (
                  <div
                    key={item.activity}
                    className="grid sm:grid-cols-[1fr_auto] gap-3 p-5 sm:p-6"
                  >
                    <div>
                      <h3 className="font-semibold text-ink">
                        {item.activity}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-inkSoft">
                        {item.description}
                      </p>
                    </div>

                    <span className="font-semibold text-signal whitespace-nowrap">
                      {item.speed}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SLOW INTERNET */}
        {/* ============================================================ */}

        <section
          aria-labelledby="slow-internet-heading"
          className="max-w-5xl mx-auto px-6 py-16"
        >
          <div className="max-w-3xl">
            <h2
              id="slow-internet-heading"
              className="font-display text-2xl sm:text-3xl font-semibold text-ink"
            >
              Why Is My Internet So Slow?
            </h2>

            <p className="mt-5 text-inkSoft leading-8">
              If your internet speed test produces a result that is lower than
              expected, there may be several possible causes. Your internet plan
              is only one part of your overall connection performance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {slowInternetReasons.map((reason) => (
              <div
                key={reason}
                className="rounded-xl border border-line bg-surface p-4 text-sm text-inkSoft"
              >
                {reason}
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* IMPROVEMENT TIPS */}
        {/* ============================================================ */}

        <section
          aria-labelledby="improve-speed-heading"
          className="border-y border-line bg-surface/60"
        >
          <div className="max-w-5xl mx-auto px-6 py-16">
            <h2
              id="improve-speed-heading"
              className="font-display text-2xl sm:text-3xl font-semibold text-ink"
            >
              How to Improve Your Internet Speed
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-10">
              {improvementTips.map((tip) => (
                <article
                  key={tip.title}
                  className="rounded-2xl border border-line bg-surface p-6"
                >
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {tip.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-inkSoft">
                    {tip.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* WIFI VS WIRED */}
        {/* ============================================================ */}

        <section
          aria-labelledby="wifi-heading"
          className="max-w-5xl mx-auto px-6 py-16"
        >
          <div className="max-w-3xl">
            <h2
              id="wifi-heading"
              className="font-display text-2xl sm:text-3xl font-semibold text-ink"
            >
              Wi-Fi Speed Test vs Wired Internet Speed Test
            </h2>

            <div className="mt-6 space-y-5 text-inkSoft leading-8">
              <p>
                Wi-Fi can affect the speed that reaches your device. Distance
                from the router, walls, interference, wireless technology,
                router hardware, and other connected devices can all influence
                your results.
              </p>

              <p>
                If you have access to an Ethernet connection, comparing a wired
                test with a Wi-Fi speed test can help you determine whether
                wireless connectivity is limiting your performance.
              </p>

              <p>
                For mobile devices, your result can also vary depending on
                whether you are connected to Wi-Fi or a cellular network.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MOBILE */}
        {/* ============================================================ */}

        <section className="border-y border-line bg-surface/60">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
                Check Internet Speed on Your Phone
              </h2>

              <div className="mt-6 space-y-5 text-inkSoft leading-8">
                <p>
                  SpeedoTest works directly in a modern web browser, allowing
                  you to check your internet speed from a smartphone, tablet,
                  laptop, or desktop computer.
                </p>

                <p>
                  When testing mobile internet, keep in mind that signal
                  strength, network congestion, location, and the cellular
                  technology available in your area can affect the result.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ACCURACY */}
        {/* ============================================================ */}

        <section
          aria-labelledby="accuracy-heading"
          className="max-w-5xl mx-auto px-6 py-16"
        >
          <div className="max-w-3xl">
            <h2
              id="accuracy-heading"
              className="font-display text-2xl sm:text-3xl font-semibold text-ink"
            >
              How Accurate Is an Internet Speed Test?
            </h2>

            <div className="mt-6 space-y-5 text-inkSoft leading-8">
              <p>
                An internet speed test measures your connection under the
                conditions present at the time you run it. Because network
                conditions change, two tests performed at different times may
                produce different results.
              </p>

              <p>
                For a more consistent test, close unnecessary applications,
                pause downloads and uploads, stop video streaming on other
                devices, and avoid bandwidth-heavy activity while testing.
              </p>

              <p>
                If you are troubleshooting a connection problem, run several
                tests at different times and compare the results rather than
                relying on one measurement.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}

        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="border-y border-line bg-surface/60"
        >
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="text-center">
              <h2
                id="faq-heading"
                className="font-display text-2xl sm:text-3xl font-semibold text-ink"
              >
                Frequently Asked Questions About Internet Speed Tests
              </h2>

              <p className="mt-4 text-inkSoft leading-7">
                Answers to common questions about checking internet speed,
                download and upload performance, ping, jitter, Wi-Fi, and
                connection troubleshooting.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-line bg-surface p-6"
                >
                  <summary className="cursor-pointer list-none font-semibold text-ink">
                    <span className="flex items-center justify-between gap-4">
                      {item.question}

                      <span
                        aria-hidden="true"
                        className="text-xl text-inkFaint group-open:rotate-45 transition-transform"
                      >
                        +
                      </span>
                    </span>
                  </summary>

                  <p className="mt-4 text-sm leading-7 text-inkSoft">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FINAL CTA */}
        {/* ============================================================ */}

        <section
          aria-labelledby="final-cta-heading"
          className="max-w-5xl mx-auto px-6 py-16"
        >
          <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12 text-center shadow-card">
            <h2
              id="final-cta-heading"
              className="font-display text-2xl sm:text-3xl font-semibold text-ink"
            >
              Ready to Check Your Internet Speed?
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-inkSoft leading-7">
              Run a free internet speed test and find out how your connection
              performs. Check download speed, upload speed, ping, and jitter in
              seconds.
            </p>

            <a
              href="#test"
              className="inline-flex items-center justify-center mt-7 rounded-xl bg-signal px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Check Internet Speed
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-inkFaint">
            <p>
              © {new Date().getFullYear()} SpeedoTest. Free Internet Speed Test.
            </p>

            <nav aria-label="Footer navigation">
              <a href="#test" className="hover:text-ink transition-colors">
                Internet Speed Test
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
