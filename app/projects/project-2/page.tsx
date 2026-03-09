import Image from "next/image";
import Link from "next/link";
import { ImageScrollCarousel } from "@/app/components/ImageScrollCarousel";
import { COSMIC_WATCH } from "@/lib/assets";

interface ImageStackItem {
  src: string;
  alt: string;
}

function ImageStack({ images }: { images: ImageStackItem[] }) {
  return (
    <div className="grid gap-4">
      {images.map((img) => (
        <div
          key={img.src}
          className="relative rounded-2xl overflow-hidden ring-1 ring-white/[0.06] bg-white/[0.02]"
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={1200}
            height={675}
            className="object-cover w-full h-auto transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      ))}
    </div>
  );
}

const sections = [
  {
    index: "01",
    title: "Home Dashboard",
    subtitle: "Real-Time Space Activity at a Glance",
    description:
      "The main dashboard gives a live overview of near-Earth space activity — today's asteroid count, number of hazardous objects, closest approach distance, and maximum speed recorded. Sourced from NASA NeoWs and JPL CNEOS datasets, it's the launchpad to the 3D orbit explorer and every other monitoring tool on the platform.",
    accent: "text-blue-400",
    images: [{ src: COSMIC_WATCH.dashboard, alt: "Cosmic Watch Dashboard" }],
  },
  {
    index: "02",
    title: "NEO Feed",
    subtitle: "Near-Earth Object Tracking",
    description:
      "Pulls live data from NASA's NeoWs API to display every asteroid tracked within a selected date range. Swipe to move from the full list to a detailed object view.",
    accent: "text-cyan-400",
    accentBg: "bg-cyan-400",
    carousel: [
      {
        src: COSMIC_WATCH.neoFeed1,
        alt: "NEO Feed — Asteroid List",
        caption:
          "Asteroid List — Date-ranged feed of Near-Earth Objects from NASA NeoWs, showing estimated diameter, miss distance, relative velocity, and potentially-hazardous classification for each tracked object.",
      },
      {
        src: COSMIC_WATCH.neoFeed2,
        alt: "NEO Feed — Object Detail",
        caption:
          "Object Detail — Full profile of a selected asteroid: estimated size range, all recorded close approach data, hazard status, orbital elements, and risk indicators computed by the platform's analysis engine.",
      },
    ],
  },
  {
    index: "03",
    title: "Risk Analysis Engine",
    subtitle: "Python Scientific Computing",
    description:
      "A standalone FastAPI microservice built with astropy, NumPy, and SciPy. Scores every asteroid on a 0–100 scale using six scientific factors, then maps it to Torino and Palermo scales. Swipe between the ranked list and the full per-asteroid breakdown.",
    accent: "text-red-400",
    accentBg: "bg-red-400",
    carousel: [
      {
        src: COSMIC_WATCH.riskAnalysis1,
        alt: "Risk Analysis — Scored List",
        caption:
          "Scored List — Scientific risk scoring of all tracked asteroids using diameter, velocity, miss distance, hazard flag, kinetic energy, and orbital uncertainty. Each object gets a 0–100 composite score for fast prioritization.",
      },
      {
        src: COSMIC_WATCH.riskAnalysis2,
        alt: "Risk Analysis — Full Breakdown",
        caption:
          "Full Breakdown — Complete risk profile for a single asteroid: Torino scale, Palermo scale, kinetic energy in megatons of TNT, relative size comparisons against real-world reference objects, and data sourced from NASA NeoWs and the JPL Small Body Database.",
      },
    ],
  },
  {
    index: "04",
    title: "CNEOS Monitor",
    subtitle: "NASA Center for Near-Earth Object Studies",
    description:
      "Four live views directly into JPL's CNEOS data streams — from configurable close approach alerts to full Sentry impact simulations and atmospheric fireball detections. Scroll through each monitor.",
    accent: "text-amber-400",
    accentBg: "bg-amber-400",
    carousel: [
      {
        src: COSMIC_WATCH.cneosMonitor1,
        alt: "CNEOS — Close Approaches",
        caption:
          "Close Approaches — Asteroids approaching Earth within a configurable distance threshold, sourced from ssd-api.jpl.nasa.gov/cad.api. Displays miss distance, velocity, approach date, and estimated diameter for each event.",
      },
      {
        src: COSMIC_WATCH.cneosMonitor2,
        alt: "CNEOS — Sentry Impact Monitoring",
        caption:
          "Sentry Impact Monitoring — Objects listed on NASA's Sentry risk table with a non-zero chance of future Earth impact. Shows cumulative impact probability, Palermo scale score, and the range of possible impact years.",
      },
      {
        src: COSMIC_WATCH.cneosMonitor3,
        alt: "CNEOS — Sentry Object Detail",
        caption:
          "Sentry Object Detail — Deep-dive into a single impact-monitored asteroid: all virtual impactor scenarios, individual probability ranges, estimated impact energy in megatons, and full simulation metadata.",
      },
      {
        src: COSMIC_WATCH.cneosMonitor4,
        alt: "CNEOS — Fireball Events",
        caption:
          "Fireball Events — Meteor bolide detections from NASA's Fireball Data API, showing event time, altitude, impact coordinates, and total energy released in the atmosphere.",
      },
    ],
  },
  {
    index: "05",
    title: "Space Weather",
    subtitle: "Solar Activity from NASA DONKI",
    description:
      "Four live monitors powered by the NASA DONKI API, tracking the solar events that directly affect satellites, power grids, and communication systems on Earth. Scroll through each feed.",
    accent: "text-orange-400",
    accentBg: "bg-orange-400",
    carousel: [
      {
        src: COSMIC_WATCH.spaceWeather1,
        alt: "Space Weather — Coronal Mass Ejections",
        caption:
          "Coronal Mass Ejections (CME) — Solar plasma clouds erupting from the Sun tracked via NASA DONKI /CME. Shows ejection time, speed, direction, and estimated arrival at Earth's magnetosphere.",
      },
      {
        src: COSMIC_WATCH.spaceWeather2,
        alt: "Space Weather — Solar Flares",
        caption:
          "Solar Flares — Recent flare events from NASA DONKI /FLR, categorized by intensity class (X, M, C). Displays peak time, duration, active region, and associated radio blackout risk.",
      },
      {
        src: COSMIC_WATCH.spaceWeather3,
        alt: "Space Weather — Geomagnetic Storms",
        caption:
          "Geomagnetic Storms — Earth-impacting storms caused by solar activity, sourced from NASA DONKI /GST. Shows Kp index, storm onset and recovery times, and potential impact on infrastructure.",
      },
      {
        src: COSMIC_WATCH.spaceWeather4,
        alt: "Space Weather — Alerts & Notifications",
        caption:
          "Space Weather Alerts — Official alerts and reports from NASA and NOAA published via NASA DONKI /notifications, covering radiation storms, radio blackouts, and geomagnetic disturbances.",
      },
    ],
  },
  {
    index: "06",
    title: "3D Orbital Explorer",
    subtitle: "Interactive Asteroid Visualization",
    description:
      "An immersive 3D environment that renders live asteroid orbits relative to Earth using actual orbital parameters. Accessible directly from the dashboard, it gives a tangible sense of scale and proximity for any tracked NEO.",
    accent: "text-purple-400",
    video: COSMIC_WATCH.explorer3d,
  },
  {
    index: "07",
    title: "Astronomy Picture of the Day",
    subtitle: "Daily Cosmic Imagery from NASA",
    description:
      "Displays NASA's daily APOD image with full scientific explanation and credit metadata. Sourced from the NASA APOD API — a daily window into the universe alongside every asteroid monitoring tool on the platform.",
    accent: "text-emerald-400",
    images: [{ src: COSMIC_WATCH.apod, alt: "Astronomy Picture of the Day" }],
  },
  {
    index: "08",
    title: "Asteroid Watchlist",
    subtitle: "Personal Tracking & Custom Alerts",
    description:
      "Authenticated users can watch and unwatch specific asteroids, set custom distance alert thresholds, and receive notifications whenever a tracked object approaches Earth. Full risk tracking per object in one place.",
    accent: "text-sky-400",
    images: [{ src: COSMIC_WATCH.watchlist, alt: "Asteroid Watchlist" }],
  },
  {
    index: "09",
    title: "Notification Center",
    subtitle: "Real-Time Alerts",
    description:
      "Centralised alert feed triggered by close asteroid approaches, hazard detections, and space weather events related to the user's watchlist. Supports unread counts and batch read operations.",
    accent: "text-rose-400",
    images: [{ src: COSMIC_WATCH.alerts, alt: "Notification Center" }],
  },
  {
    index: "10",
    title: "Live Chat",
    subtitle: "Real-Time Asteroid Discussions",
    description:
      "WebSocket-powered chat built on Socket.io where users discuss asteroid observations, risk events, and space weather in real time. Supports topic channels and live collaboration across 12 bidirectional events.",
    accent: "text-violet-400",
    images: [{ src: COSMIC_WATCH.liveChat, alt: "Live Chat Interface" }],
  },
];

export default function CosmicWatchProject() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-3xl px-6">
        {/* Navigation */}
        <nav className="pt-8 pb-4 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-1"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </Link>
        </nav>

        {/* Hero */}
        <header className="pt-12 pb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            {["Full-Stack", "Python", "NASA API", "WebSocket"].map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full bg-white/[0.06] text-white/50 border border-white/[0.06]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Project
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              01
            </span>
          </h1>

          <p className="text-muted-foreground mt-4 text-lg max-w-lg leading-relaxed">
            A full-stack platform for real-time Near-Earth Object monitoring. Powered by a Python
            scientific risk engine, 33 REST endpoints, and 12 WebSocket events.
          </p>

          <div className="flex gap-3 mt-6">
            <a
              href="https://github.com/rudra-sah00/cosmic-watch-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-4 py-2 rounded-full border border-white/[0.08] hover:border-white/20 bg-white/[0.03]"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Frontend
            </a>
            <a
              href="https://github.com/rudra-sah00/cosmic-watch-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-4 py-2 rounded-full border border-white/[0.08] hover:border-white/20 bg-white/[0.03]"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Backend
            </a>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/[0.06] mb-32 animate-fade-in-up">
          <div className="aspect-[16/9] relative bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950">
            <Image
              src={COSMIC_WATCH.hero}
              alt="Cosmic Watch Platform"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>

        {/* Feature Sections */}
        <div className="space-y-40">
          {sections.map((section) => (
            <section key={section.index} className="animate-fade-in-up">
              {/* Section Header */}
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className={`text-sm font-mono font-bold ${section.accent}`}>
                    {section.index}
                  </span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{section.title}</h2>
                </div>
                <p className={`text-sm font-medium ${section.accent} mb-3`}>{section.subtitle}</p>
                <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl">
                  {section.description}
                </p>
              </div>

              {/* Media */}
              {"video" in section && section.video ? (
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/[0.06] bg-white/[0.02]">
                  <video
                    src={section.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto"
                  />
                </div>
              ) : "carousel" in section && section.carousel ? (
                <ImageScrollCarousel
                  items={section.carousel}
                  accentBg={("accentBg" in section ? section.accentBg : "bg-white") as string}
                />
              ) : "images" in section && section.images ? (
                <ImageStack images={section.images} />
              ) : null}
            </section>
          ))}
        </div>

        {/* Tech Stack */}
        <section className="mt-40 mb-32">
          <h2 className="text-xl font-bold text-white mb-8">Under the Hood</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Node.js 22", sub: "Runtime" },
              { label: "Express 5", sub: "Framework" },
              { label: "PostgreSQL 18", sub: "Database" },
              { label: "Prisma 7", sub: "ORM" },
              { label: "FastAPI", sub: "Risk Engine" },
              { label: "Socket.io", sub: "Real-Time" },
              { label: "Astropy 7", sub: "Physics" },
              { label: "NumPy + SciPy", sub: "Scientific" },
              { label: "Docker", sub: "Deployment" },
            ].map((tech) => (
              <div
                key={tech.label}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <p className="text-sm font-semibold text-white">{tech.label}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  {tech.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            33 REST endpoints · 12 WebSocket events · Python scientific engine
          </p>
          <Link href="/" className="btn btn-outline">
            Back to All Projects
          </Link>
        </footer>
      </main>
    </div>
  );
}
