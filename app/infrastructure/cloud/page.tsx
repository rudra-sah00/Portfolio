import Image from "next/image";
import Link from "next/link";
import { INFRA } from "@/lib/assets";

const cloudFeatures = [
  {
    title: "Home Dashboard",
    desc: "A centralized hub to start the day. Integrates calendar events, active tasks, unread notes, and recent files in a single, unified view.",
    image: INFRA.cloud.dashboard,
    icon: "🏠",
  },
  {
    title: "Encrypted File System",
    desc: "End-to-end encrypted storage for all personal and professional documents. Features version control and smart folder management.",
    image: INFRA.cloud.folders,
    icon: "📁",
  },
  {
    title: "Digital Workspace (Deck)",
    desc: "Kanban-style project management for tracking personal sprints, work deadlines, and long-term goals. Integrated with the cloud ecosystem.",
    image: INFRA.cloud.deck,
    icon: "📋",
  },
  {
    title: "Meetings & Collaboration",
    desc: "Self-hosted video conferencing and screen sharing. This screenshot highlights recent meeting summaries and upcoming collaboration slots.",
    image: INFRA.cloud.meeting,
    icon: "🤝",
  },
  {
    title: "Personal Knowledge Base",
    desc: "A markdown-based note system for quick captures and long-form writing. Syncs across all devices with zero third-party access.",
    image: INFRA.cloud.notes,
    icon: "📝",
  },
  {
    title: "Task Management",
    desc: "Intuitive task tracking. Manage sub-tasks, set reminders, and sync with the global calendar to stay on top of the schedule.",
    image: INFRA.cloud.tasks,
    icon: "✅",
  },
  {
    title: "Integrated Calendar",
    desc: "A private scheduling system. Syncs across mobile and desktop, handling both personal appointments and professional deadlines.",
    image: INFRA.cloud.calendar,
    icon: "🗓️",
  },
  {
    title: "Photo Hub",
    desc: "Ownership of every memory. A performance-optimized media gallery with automatic mobile backup and AI-assisted search.",
    image: INFRA.cloud.photos,
    icon: "📸",
  },
  {
    title: "Address Book",
    desc: "Completely private contact management. Syncs securely with mobile devices using CardDAV protocols.",
    image: INFRA.cloud.contacts,
    icon: "📇",
  },
  {
    title: "Activity Stream",
    desc: "A security-first audit log. Tracks file changes, login attempts, and system events to ensure the integrity of the entire cloud stack.",
    image: INFRA.cloud.activity,
    icon: "📈",
  },
];

export default function CloudDetail() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 no-underline group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="rotate-180 transition-transform group-hover:translate-x-1"
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

        <header className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/[0.06] text-muted-foreground">
              Infrastructure
            </span>
            <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/[0.06] text-muted-foreground">
              Productivity Suite
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight sm:text-4xl">
            Private Cloud Suite
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Powered by Nextcloud
            </span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl leading-relaxed">
            A fully self-hosted ecosystem for file storage, productivity, and real-time
            collaboration. No third-party data collection — 100% digital sovereignty.
          </p>
          <div className="mt-8">
            <a
              href="https://cloud.rudrasahoo.live"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Open Cloud Instance
            </a>
          </div>
        </header>

        <div className="space-y-16 sm:space-y-32">
          {cloudFeatures.map((feature) => (
            <section key={feature.title} className="animate-fade-in-up">
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-lg">{feature.icon}</span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{feature.title}</h2>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl">
                  {feature.desc}
                </p>
              </div>

              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/[0.06] bg-white/[0.02]">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={1200}
                  height={675}
                  className="object-cover w-full h-auto transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
            </section>
          ))}
        </div>

        <footer className="py-12 border-t border-border mt-16 text-center sm:py-24 sm:mt-32">
          <p className="text-sm text-muted-foreground mb-4">Digital sovereignty at its finest.</p>
          <Link
            href="/"
            className="text-sm text-white/40 hover:text-white/60 transition-colors no-underline"
          >
            ← Back to all projects
          </Link>
        </footer>
      </main>
    </div>
  );
}
