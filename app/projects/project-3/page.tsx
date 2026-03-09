import Image from "next/image";
import Link from "next/link";
import { TRADING_CHART } from "@/lib/assets";

const features = [
  {
    index: "01",
    title: "30+ Technical Indicators",
    subtitle: "Trend · Momentum · Volume · Volatility",
    description:
      "Built-in professional indicators: MA, EMA, BOLL, MACD, RSI, KDJ, CCI, ATR, OBV, and many more — each with fully configurable parameters and styling.",
    accent: "text-emerald-400",
    gradient: "from-emerald-500/15 to-transparent",
    tags: ["MA / EMA / BOLL", "MACD / RSI / KDJ", "ATR / OBV / MFI"],
  },
  {
    index: "02",
    title: "Drawing Tools",
    subtitle: "Lines · Shapes · Fibonacci · Wave Analysis",
    description:
      "25+ drawing overlays for technical analysis — trend lines, rectangles, circles, Fibonacci retracement & extension, Elliott Wave (3/5/8-wave), ABCD & XABCD harmonic patterns, Gann Box, and more.",
    accent: "text-teal-400",
    gradient: "from-teal-500/15 to-transparent",
    tags: ["Fibonacci Tools", "Elliott Wave", "Harmonic Patterns"],
  },
  {
    index: "03",
    title: "Option Chain Modal",
    subtitle: "Fully Customizable Options Data Viewer",
    description:
      "A first-class Option Chain component with real-time updates, strike-price filtering, Greeks display, and complete styling control — ready to plug into any trading application.",
    accent: "text-cyan-400",
    gradient: "from-cyan-500/15 to-transparent",
    tags: ["Real-Time Updates", "Greeks Display", "Custom Datafeed"],
  },
  {
    index: "04",
    title: "Real-Time Streaming",
    subtitle: "WebSocket · Candle Aggregation · Datafeed Interface",
    description:
      "A clean Datafeed abstraction for both historical data and live WebSocket streams. Subscribe to real-time ticks, auto-aggregate candles, and handle reconnect logic — all via a single interface.",
    accent: "text-sky-400",
    gradient: "from-sky-500/15 to-transparent",
    tags: ["WebSocket Streaming", "Candle Aggregation", "Historical Data"],
  },
  {
    index: "05",
    title: "Theme & Styling System",
    subtitle: "Dark / Light · Custom Colors · Responsive",
    description:
      "Deep theme support with CSS variable overrides for every element — candles, backgrounds, gridlines, indicators, and UI chrome. Ships with dark and light presets. Fully responsive on mobile.",
    accent: "text-violet-400",
    gradient: "from-violet-500/15 to-transparent",
    tags: ["Dark / Light Modes", "CSS Variable API", "Mobile Responsive"],
  },
  {
    index: "06",
    title: "TypeScript First",
    subtitle: "Full Type Safety · Plugin System · Custom Indicators",
    description:
      "Written entirely in TypeScript with complete type definitions exported. Extend the library by building custom indicators, drawing tools, and UI plugins — with full IntelliSense support.",
    accent: "text-indigo-400",
    gradient: "from-indigo-500/15 to-transparent",
    tags: ["Type Definitions", "Custom Indicators", "Plugin API"],
  },
];

export default function TradingChartProject() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-3xl px-4 pb-32 sm:px-6">
        {/* Nav */}
        <nav className="pt-8 pb-2 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors no-underline group"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Projects
          </Link>
        </nav>

        {/* Hero */}
        <header className="pt-12 pb-14">
          <div className="flex flex-wrap gap-2 mb-5">
            {["Open Source", "TypeScript", "Finance"].map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/[0.07] text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight sm:text-4xl">
            Trading ChartPro
          </h1>
          <p className="mt-3 text-base text-white/50 font-medium">
            Professional Financial Charting · Open Source Package
          </p>
          <p className="mt-4 text-[15px] text-white/35 leading-relaxed max-w-xl">
            A professional-grade financial charting library built on top of KLineChart. Ships with
            30+ technical indicators, 25+ drawing tools, a fully customizable Option Chain modal,
            real-time WebSocket streaming, and complete TypeScript support.
          </p>

          {/* Links */}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://rudra-sah00.github.io/trading-chart/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-sm font-medium text-emerald-300
                bg-emerald-500/10 hover:bg-emerald-500/15
                ring-1 ring-emerald-500/20 hover:ring-emerald-500/30
                transition-all duration-200 no-underline
              "
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8.5L13 8.5M13 8.5L9.5 5M13 8.5L9.5 12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Live Docs
            </a>
            <a
              href="https://github.com/rudra-sah00/trading-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-sm font-medium text-white/40
                bg-white/[0.04] hover:bg-white/[0.07]
                ring-1 ring-white/[0.06] hover:ring-white/[0.1]
                transition-all duration-200 no-underline
              "
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.003 10.003 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://rudra-sah00.github.io/trading-chart/examples/basic"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-sm font-medium text-white/40
                bg-white/[0.04] hover:bg-white/[0.07]
                ring-1 ring-white/[0.06] hover:ring-white/[0.1]
                transition-all duration-200 no-underline
              "
            >
              Live Demo
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </header>

        {/* Hero image */}
        <div className="mb-14 overflow-hidden rounded-2xl ring-1 ring-white/[0.06]">
          <div className="relative aspect-[16/9]">
            <Image
              src={TRADING_CHART.hero}
              alt="Trading ChartPro"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        {/* Install snippet */}
        <div className="mb-14 p-4 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06]">
          <p className="text-[11px] uppercase tracking-widest text-white/20 mb-2 font-medium">
            Installation
          </p>
          <code className="text-sm text-emerald-400/80 font-mono break-all">
            pnpm add trading-chart@github:rudra-sah00/trading-chart
          </code>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-10">
          {features.map((feature) => (
            <div
              key={feature.index}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${feature.gradient} ring-1 ring-white/[0.05] p-6 sm:p-8`}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[12px] font-mono text-white/20">{feature.index}</span>
                <h2 className={`text-lg font-semibold tracking-tight ${feature.accent}`}>
                  {feature.title}
                </h2>
              </div>
              <p className="text-sm text-white/40 font-medium mb-3">{feature.subtitle}</p>
              <p className="text-sm text-white/35 leading-relaxed mb-5">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/[0.06] text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 pt-10 border-t border-white/[0.06] text-center">
          <p className="text-sm text-white/25 mb-5">Built on KLineChart · Apache 2.0 License</p>
          <a
            href="https://rudra-sah00.github.io/trading-chart/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl
              text-sm font-medium text-emerald-300
              bg-emerald-500/10 hover:bg-emerald-500/15
              ring-1 ring-emerald-500/20 hover:ring-emerald-500/30
              transition-all duration-200 no-underline
            "
          >
            Explore the full docs
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </main>
    </div>
  );
}
