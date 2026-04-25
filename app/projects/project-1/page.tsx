import Image from "next/image";
import Link from "next/link";
import FeatureSection from "@/app/components/FeatureSection";
import { STREAMING } from "@/lib/assets";

const latestReleaseUrl = "https://github.com/rudra-sah00/nightwatch/releases/latest";

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

type ReleaseResponse = {
  html_url: string;
  assets: ReleaseAsset[];
};

type DownloadLinkSet = {
  release: string;
  macos: string;
  windows: string;
  linux: string;
  hasWindowsAsset: boolean;
};

async function getLatestDownloads(): Promise<DownloadLinkSet> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/rudra-sah00/nightwatch/releases/latest",
      { next: { revalidate: 1800 } }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const release = (await response.json()) as ReleaseResponse;

    const findAsset = (predicate: (asset: ReleaseAsset) => boolean) =>
      release.assets.find(predicate)?.browser_download_url;

    const macos =
      findAsset((asset) => asset.name.endsWith(".dmg") && !asset.name.endsWith(".blockmap")) ??
      findAsset((asset) => asset.name.includes("mac") && asset.name.endsWith(".zip")) ??
      release.html_url;

    const windows =
      findAsset((asset) => asset.name.endsWith(".exe")) ??
      findAsset((asset) => asset.name.endsWith(".msi")) ??
      release.html_url;

    const linux =
      findAsset((asset) => asset.name.endsWith(".AppImage")) ??
      findAsset((asset) => asset.name.endsWith(".deb")) ??
      release.html_url;

    return {
      release: release.html_url,
      macos,
      windows,
      linux,
      hasWindowsAsset: windows !== release.html_url,
    };
  } catch {
    return {
      release: latestReleaseUrl,
      macos: latestReleaseUrl,
      windows: latestReleaseUrl,
      linux: latestReleaseUrl,
      hasWindowsAsset: false,
    };
  }
}

const features = [
  {
    index: "01",
    title: "Continue Watching",
    subtitle: "Pick Up Right Where You Left Off",
    description:
      "Never lose your place again. The platform remembers exactly where you stopped — whether it was mid-episode on your phone or halfway through a movie on your TV. One tap and you're back in the story.",
    image: STREAMING.continueWatching,
    gradient: "from-violet-500/20 to-transparent",
    accent: "text-violet-400",
  },
  {
    index: "02",
    title: "Live Streaming",
    subtitle: "Every Game. Every Moment. Real-Time.",
    description:
      "Watch live football, cricket, basketball, and more — streaming in real-time with zero delay. Go solo for focused viewing or fire up a watch party and experience the thrill together with friends.",
    image: STREAMING.livestream,
    gradient: "from-red-500/20 to-transparent",
    accent: "text-red-400",
  },
  {
    index: "03",
    title: "Watchlist",
    subtitle: "Save It. Don't Forget It.",
    description:
      "Spotted something interesting but not in the mood right now? Add it to your watchlist with a single tap. Your curated queue of what's next — always waiting, never forgotten.",
    image: STREAMING.watchlist,
    gradient: "from-amber-500/20 to-transparent",
    accent: "text-amber-400",
  },
  {
    index: "04",
    title: "Profile & Analytics",
    subtitle: "Your Viewing Habits, Visualized.",
    description:
      "A GitHub-style activity graph for your watch time. See daily logs, streaks, genre breakdowns, and time-spent analytics. Understand your habits with beautiful graphs that track every minute of your entertainment journey.",
    image: STREAMING.profile,
    gradient: "from-emerald-500/20 to-transparent",
    accent: "text-emerald-400",
  },
  {
    index: "05",
    title: "Multiple Servers",
    subtitle: "Switch Servers. Zero Interruption.",
    description:
      "Buffering? Lag? Not anymore. Choose from multiple servers to find the fastest stream for your region. Switch seamlessly mid-playback — your experience, your control.",
    image: STREAMING.servers,
    gradient: "from-sky-500/20 to-transparent",
    accent: "text-sky-400",
  },
  {
    index: "06",
    title: "Watch Party",
    subtitle: "Together, Anywhere.",
    description:
      "Watch with unlimited friends in a single room — fully synced playback with host controls. But it doesn't stop there: a built-in sketchboard, soundboard, live chat, and video/audio calling make every session feel like you're in the same room.",
    video: STREAMING.watchPartyVideo,
    gradient: "from-purple-500/20 to-transparent",
    accent: "text-purple-400",
    tags: [
      "Synced Playback",
      "Host Controls",
      "Sketchboard",
      "Soundboard",
      "Live Chat",
      "Video & Audio Call",
    ],
  },
];

export default async function StreamingProject() {
  const downloads = await getLatestDownloads();
  const downloadOptions = [
    { label: "macOS", href: downloads.macos },
    { label: "Windows", href: downloads.windows },
    { label: "Linux", href: downloads.linux },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6">
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
              className="transition-transform group-hover:-translate-x-1"
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

        {/* Legal Disclaimer */}
        <div className="mt-4 mb-8 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white/40 leading-relaxed">
          <span className="text-white/60 font-medium">Disclaimer:</span> This is a personal design
          &amp; development project built for portfolio purposes only. I do not host, distribute, or
          stream any copyrighted content. This project is not intended for public use. Hosted at{" "}
          <a
            href="https://nightwatch.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
          >
            nightwatch.in
          </a>
          .
        </div>

        {/* Hero */}
        <header className="pt-4 pb-8 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {["UI/UX", "Full-Stack", "Streaming"].map((tag) => (
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
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              01
            </span>
          </h1>

          <p className="text-muted-foreground mt-4 text-lg max-w-lg leading-relaxed">
            Netflix · Hotstar · HBO · Disney+ — reimagined with watch parties, smart features, and a
            focus on what truly matters: the experience.
          </p>

          <div className="mt-6 space-y-3">
            <p className="text-sm text-white/60">Download the desktop app</p>
            <div className="flex flex-wrap gap-3">
              {downloadOptions.map((option) => (
                <a
                  key={option.label}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-white/[0.08]"
                >
                  {option.label}
                </a>
              ))}

              <a
                href={downloads.release}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-purple-400/35 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-200 no-underline transition-colors hover:bg-purple-500/20"
              >
                Latest on GitHub
              </a>
            </div>
            <p className="text-xs text-white/45">
              {downloads.hasWindowsAsset
                ? "Downloads are always pulled from the latest GitHub release."
                : "Windows builds are published on the latest GitHub release page."}
            </p>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/[0.06] mb-24 animate-fade-in-up">
          <div className="aspect-[16/9] relative bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
            <Image
              src={STREAMING.hero}
              alt="Streaming Platforms Reimagined"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>

        {/* Features */}
        <div className="space-y-20 pb-20 sm:space-y-32 sm:pb-32">
          {features.map((feature) => (
            <FeatureSection key={feature.index} feature={feature} />
          ))}
        </div>

        {/* Tech Stack */}
        <section className="mt-16 mb-16">
          <h2 className="text-xl font-bold text-white mb-8">Under the Hood</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Next.js 16", sub: "Framework" },
              { label: "React 19", sub: "UI Library" },
              { label: "TypeScript", sub: "Language" },
              { label: "Tailwind CSS 4", sub: "Styling" },
              { label: "Socket.io", sub: "Watch Party" },
              { label: "Framer Motion", sub: "Animations" },
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
          <p className="text-sm text-muted-foreground mb-4">Interested in a full walkthrough?</p>
          <Link href="/" className="btn btn-outline">
            Get in Touch
          </Link>
        </footer>
      </main>
    </div>
  );
}
