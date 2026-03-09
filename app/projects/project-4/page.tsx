import Image from "next/image";
import Link from "next/link";
import { MYCHESS } from "@/lib/assets";

const sections = [
  {
    index: "01",
    title: "Home Dashboard",
    subtitle: "Your Game Hub at a Glance",
    description:
      "The home screen gives everything a player needs at once — quick access to start a new game, jump back into an active session, view recent match history, and track overall stats. Clean navigation leads to every mode: play vs bot, create or join a room, or enter matchmaking.",
    accent: "text-amber-400",
    image: MYCHESS.dashboard,
    imageAlt: "MyChess Home Dashboard",
  },
  {
    index: "02",
    title: "Play with Bot",
    subtitle: "Solo Training · AI Opponent",
    description:
      "Challenge the built-in AI at any time — no opponent needed. The bot game is fully server-managed: move validation, clock tracking, and game persistence all run server-side. Disconnect and reconnect, your game is still there.",
    accent: "text-orange-400",
    image: MYCHESS.playWithBot,
    imageAlt: "MyChess Play with Bot",
  },
  {
    index: "03",
    title: "Live Player vs Player",
    subtitle: "Server-Authoritative Chess Engine",
    description:
      "Real games happen here. Every move is validated server-side through chess.js — the server owns the board state, clocks, turn enforcement, and piece ownership. Illegal moves, wrong-turn attempts, and spoofed states are all rejected. Both players get instant broadcast via Socket.IO on every accepted move.",
    accent: "text-red-400",
    image: MYCHESS.playerPage,
    imageAlt: "MyChess Live Player vs Player",
  },
  {
    index: "04",
    title: "Match History",
    subtitle: "Every Game Recorded · Win · Loss · Draw",
    description:
      "Every completed game is persisted to PostgreSQL via Prisma — result, opponent, PGN, winner, timestamps all recorded. Your full rated match history in one place, with ELO rating tracked across games.",
    accent: "text-yellow-400",
    image: MYCHESS.matchHistory,
    imageAlt: "MyChess Match History",
  },
];

const techStack = [
  { label: "Node.js", sub: "Runtime" },
  { label: "TypeScript", sub: "Language" },
  { label: "Socket.IO", sub: "Real-Time" },
  { label: "Express", sub: "HTTP Server" },
  { label: "chess.js", sub: "Move Engine" },
  { label: "PostgreSQL", sub: "Database" },
  { label: "Prisma", sub: "ORM" },
  { label: "Redis", sub: "Game State" },
  { label: "JWT + bcrypt", sub: "Auth" },
  { label: "Winston", sub: "Logging" },
  { label: "Docker", sub: "Deployment" },
];

export default function MyChessProject() {
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
            {["Full-Stack", "TypeScript", "Real-Time"].map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/[0.07] text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight sm:text-4xl">MyChess</h1>
          <p className="mt-3 text-base text-white/50 font-medium">
            Full-Stack Real-Time Chess · Socket.IO · Server-Authoritative Engine
          </p>
          <p className="mt-4 text-[15px] text-white/35 leading-relaxed max-w-xl">
            A complete chess platform built from scratch. The backend handles everything
            authoritatively — move validation, clock management, rooms, matchmaking, bot games, and
            full game persistence with a 1-minute reconnection window. Built with Node.js,
            TypeScript, Socket.IO, chess.js, PostgreSQL, and Redis.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://github.com/rudra-sah00/mychess-backend"
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
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-16 overflow-hidden rounded-2xl ring-1 ring-white/[0.06]">
          <div className="relative aspect-[16/9]">
            <Image
              src={MYCHESS.hero}
              alt="MyChess"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        {/* Architecture callout */}
        <div className="mb-16 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: "Server", label: "Authoritative" },
            { value: "Socket.IO", label: "Real-Time" },
            { value: "1-min", label: "Reconnect Window" },
            { value: "Postgres", label: "Persistence" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-center"
            >
              <p className="text-sm font-semibold text-amber-400">{stat.value}</p>
              <p className="text-[11px] text-white/30 uppercase tracking-wide mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Feature sections */}
        <div className="flex flex-col gap-16">
          {sections.map((section) => (
            <div key={section.index} className="flex flex-col gap-6">
              {/* Text */}
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-[13px] font-mono text-white/20">{section.index}</span>
                  <h2 className={`text-lg font-semibold tracking-tight ${section.accent}`}>
                    {section.title}
                  </h2>
                </div>
                <p className="text-white/60 text-[13px] font-medium mb-2">{section.subtitle}</p>
                <p className="text-[15px] text-white/35 leading-relaxed">{section.description}</p>
              </div>
              {/* Image */}
              <div className="overflow-hidden rounded-2xl ring-1 ring-white/[0.06] bg-white/[0.02]">
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  width={1200}
                  height={675}
                  className="object-cover w-full h-auto transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-white mb-8 tracking-tight">Tech Stack</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.label}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <p className="text-sm font-semibold text-white">{tech.label}</p>
                <p className="text-[11px] text-white/30 uppercase tracking-wider mt-0.5">
                  {tech.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 mt-8 border-t border-white/[0.06] text-center">
          <p className="text-sm text-white/30 mb-4">
            Server-authoritative · PostgreSQL + Redis · JWT auth
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 bg-white/[0.04] hover:bg-white/[0.07] ring-1 ring-white/[0.06] transition-all duration-200 no-underline"
          >
            Back to Projects
          </Link>
        </footer>
      </main>
    </div>
  );
}
