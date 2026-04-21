import Image from "next/image";
import Link from "next/link";
import { SSH_CLIENT } from "@/lib/assets";

const techStack = [
  { label: "Flutter", sub: "Framework" },
  { label: "Dart", sub: "Language" },
  { label: "dartssh2", sub: "SSH Protocol" },
  { label: "xterm", sub: "Terminal UI" },
  { label: "Riverpod", sub: "State" },
  { label: "FlexColorScheme", sub: "Theming" },
  { label: "Secure Storage", sub: "Encryption" },
  { label: "Freezed", sub: "Models" },
];

const features = [
  {
    index: "01",
    title: "Multi-Session Terminal",
    accent: "text-neutral-400",
    description:
      "Full PTY terminal emulator with JetBrains Mono font. Run multiple SSH sessions simultaneously — switch between them, keep them alive in background. Mobile control bar with Ctrl, Alt, Esc, Tab, arrows, F-keys, and a keyboard dismiss button.",
  },
  {
    index: "02",
    title: "Auto-Reconnect",
    accent: "text-zinc-400",
    description:
      "When the app goes to background and the SSH socket dies, it auto-reconnects on resume using the same terminal instance — your scrollback history is preserved. If tmux is running on the server, it automatically reattaches your session.",
  },
  {
    index: "03",
    title: "SFTP File Browser",
    accent: "text-stone-400",
    description:
      "Browse remote file systems, view text files, rename, delete, and create folders. File type icons, human-readable sizes, and breadcrumb navigation — all over a secure SFTP connection.",
  },
  {
    index: "04",
    title: "SSH Tunneling",
    accent: "text-neutral-400",
    description:
      "Local and remote port forwarding with a live tunnel management UI. Create tunnels, monitor them, and stop when done. Supports both local-to-remote and remote-to-local forwarding.",
  },
  {
    index: "05",
    title: "Secure by Design",
    accent: "text-zinc-400",
    description:
      "All credentials encrypted with platform keychain (iOS) and keystore (Android). Password and private key authentication. Pure client-side — no data ever leaves your device, no backend, no tracking.",
  },
];

export default function SSHProject() {
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
            {["Flutter", "Mobile", "SSH"].map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/[0.07] text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight sm:text-4xl">SSH</h1>
          <p className="mt-3 text-base text-white/50 font-medium">
            Mobile SSH Client · Terminal · SFTP · Tunneling
          </p>
          <p className="mt-4 text-[15px] text-white/35 leading-relaxed max-w-xl">
            A production-ready mobile SSH client for iOS and Android. Multi-session terminal with
            auto-reconnect and tmux reattach, SFTP file browser, SSH tunneling, snippet manager, and
            secure credential storage. Built with Flutter, dartssh2, and xterm. Pure client-side —
            no backend required.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://github.com/rudra-sah00/ssh-client"
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
              src={SSH_CLIENT.hero}
              alt="SSH Client"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: "Multi", label: "Sessions" },
            { value: "Auto", label: "Reconnect" },
            { value: "SFTP", label: "File Browser" },
            { value: "Tunnel", label: "Port Forward" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] text-center"
            >
              <p className="text-sm font-semibold text-neutral-400">{stat.value}</p>
              <p className="text-[11px] text-white/30 uppercase tracking-wide mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="flex flex-col gap-14">
          {features.map((f) => (
            <div key={f.index} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-mono text-white/20">{f.index}</span>
                <h2 className={`text-lg font-semibold ${f.accent}`}>{f.title}</h2>
              </div>
              <p className="text-[15px] text-white/35 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-20">
          <h2 className="text-xs font-mono uppercase tracking-widest text-white/20 mb-6">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {techStack.map((t) => (
              <div
                key={t.label}
                className="p-4 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06]"
              >
                <p className="text-sm font-medium text-white/70">{t.label}</p>
                <p className="text-[11px] text-white/25 mt-0.5">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
