import Image from "next/image";
import Link from "next/link";
import { COSMIC_WATCH, MYCHESS, STREAMING, TRADING_CHART } from "@/lib/assets";

interface Project {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  gradient: string;
  image: string;
  href: string;
  year: string;
  status: "live" | "wip" | "coming-soon";
}

const projects: Project[] = [
  {
    number: "01",
    title: "Streaming Platform",
    subtitle: "Netflix · Hotstar · HBO · Disney+",
    description:
      "A complete reimagination of streaming platforms — with watch parties, smart recommendations, unified libraries, and much more. Built with Next.js, React, TypeScript, Socket.io.",
    tags: ["UI/UX", "Full-Stack", "Streaming"],
    gradient: "from-purple-950 via-purple-900 to-indigo-950",
    image: STREAMING.hero,
    href: "/projects/project-1",
    year: "2025",
    status: "live",
  },
  {
    number: "02",
    title: "Cosmic Watch",
    subtitle: "NASA API · Real-Time Space Monitoring",
    description:
      "A full-stack platform for real-time Near-Earth Object monitoring. Powered by a Python scientific risk engine, 33 REST endpoints, and 12 WebSocket events.",
    tags: ["Full-Stack", "Python", "Space"],
    gradient: "from-blue-950 via-indigo-950 to-slate-950",
    image: COSMIC_WATCH.hero,
    href: "/projects/project-2",
    year: "2025",
    status: "live",
  },
  {
    number: "03",
    title: "Trading ChartPro",
    subtitle: "Professional Financial Charting · Open Source Package",
    description:
      "A fully customizable financial charting library built on KLineChart. Ships with 30+ technical indicators, drawing tools (Fibonacci, wave analysis), Option Chain modal, WebSocket streaming, and full TypeScript support.",
    tags: ["Open Source", "TypeScript", "Finance"],
    gradient: "from-emerald-950 via-teal-950 to-cyan-950",
    image: TRADING_CHART.hero,
    href: "/projects/project-3",
    year: "2025",
    status: "live",
  },
  {
    number: "04",
    title: "MyChess",
    subtitle: "Full-Stack Real-Time Chess · Socket.IO · Server-Authoritative",
    description:
      "A full-stack real-time chess platform. Server-authoritative move validation, rooms with time controls, bot gameplay, matchmaking, Firebase auth, match history, and game persistence with reconnection handling — built with Node.js, TypeScript, and Socket.IO.",
    tags: ["Full-Stack", "TypeScript", "Real-Time"],
    gradient: "from-amber-950 via-orange-950 to-red-950",
    image: MYCHESS.hero,
    href: "/projects/project-4",
    year: "2025",
    status: "live",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-2xl px-5 pb-32 sm:px-6">
        {/* Nav */}
        <nav className="pt-8 pb-2 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
          <Link
            href="/"
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
            Back
          </Link>
        </nav>

        {/* Header */}
        <header className="pt-10 pb-12">
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/25 mb-3 block">
            Selected work
          </span>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Projects</h1>
          <p className="mt-3 text-[15px] text-white/40 leading-relaxed max-w-md">
            A collection of things I&apos;ve built — full walkthroughs available on calls.
          </p>
        </header>

        {/* Projects list */}
        <div className="flex flex-col gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.number} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const isComingSoon = project.status === "coming-soon";
  const isExternal = project.href.startsWith("http");

  return (
    <Link
      href={project.href}
      aria-disabled={isComingSoon}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={isComingSoon ? (e) => e.preventDefault() : undefined}
      className={`
        block relative group overflow-hidden rounded-2xl
        bg-gradient-to-br ${project.gradient}
        ring-1 ring-white/[0.05] no-underline
        transition-all duration-500 ease-out
        ${isComingSoon ? "cursor-default opacity-50" : "hover:shadow-2xl hover:shadow-black/40 hover:ring-white/[0.09]"}
      `}
    >
      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/[0.07] text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Index + Title */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-[13px] font-mono text-white/20">{project.number}</span>
          <h2 className="text-xl font-semibold text-white tracking-tight sm:text-2xl">
            {project.title}
          </h2>
        </div>
        <p className="text-sm text-white/40 font-medium mb-3">{project.subtitle}</p>
        <p className="text-sm text-white/35 leading-relaxed max-w-sm">{project.description}</p>

        {!isComingSoon && (
          <div className="mt-5 flex items-center gap-1.5 text-xs text-white/25 group-hover:text-white/55 transition-colors">
            {isExternal ? "View docs" : "View case study"}
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <path
                d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Hero image — only for live projects */}
      {project.image && (
        <div className="relative mx-4 mb-0 overflow-hidden rounded-t-xl sm:mx-6">
          <div className="aspect-[16/9] relative">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Link>
  );
}
