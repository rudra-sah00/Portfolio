import Image from "next/image";
import Link from "next/link";
import { COSMIC_WATCH, STREAMING, TRADING_CHART } from "@/lib/assets";

interface Project {
  number: string;
  title: string;
  subtitle: string;
  tags: string[];
  gradient: string;
  image: string;
  href: string;
}

const projects: Project[] = [
  {
    number: "01",
    title: "Streaming Platform",
    subtitle: "Netflix · Hotstar · HBO · Disney+",
    tags: ["Full-Stack", "Streaming"],
    gradient: "from-purple-950 via-purple-900 to-indigo-950",
    image: STREAMING.hero,
    href: "/projects/project-1",
  },
  {
    number: "02",
    title: "Cosmic Watch",
    subtitle: "NASA API · Real-Time Space Monitoring",
    tags: ["Python", "Space"],
    gradient: "from-blue-950 via-indigo-950 to-slate-950",
    image: COSMIC_WATCH.hero,
    href: "/projects/project-2",
  },
  {
    number: "03",
    title: "Trading ChartPro",
    subtitle: "Professional Financial Charting · Open Source Package",
    tags: ["Open Source", "TypeScript", "Finance"],
    gradient: "from-emerald-950 via-teal-950 to-cyan-950",
    image: TRADING_CHART.hero,
    href: "/projects/project-3",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="pb-16 px-5 sm:pb-24 sm:px-6">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <span className="section-label">Projects</span>
        <Link
          href="/projects"
          className="text-[12px] text-white/30 hover:text-white/60 transition-colors no-underline flex items-center gap-1.5 group"
        >
          View all
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
        </Link>
      </div>

      {/* Project Teasers */}
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectTeaser key={project.href} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectTeaser({ project }: { project: Project }) {
  const isExternal = project.href.startsWith("http");
  return (
    <Link
      href={project.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`
        flex items-center gap-4 p-4 rounded-xl overflow-hidden
        bg-gradient-to-r ${project.gradient}
        ring-1 ring-white/[0.05] hover:ring-white/[0.09]
        no-underline group transition-all duration-300
        hover:shadow-lg hover:shadow-black/30
      `}
    >
      {/* Thumbnail */}
      {project.image ? (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 sm:w-20 sm:h-14">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-lg shrink-0 sm:w-20 sm:h-14 bg-white/[0.05] flex items-center justify-center">
          <span className="text-[11px] font-mono text-white/20">{project.number}</span>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-mono text-white/25">{project.number}</span>
          <h3 className="text-sm font-semibold text-white truncate">{project.title}</h3>
        </div>
        <p className="text-[12px] text-white/40 truncate">{project.subtitle}</p>
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/[0.07] text-white/40"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        className="text-white/20 group-hover:text-white/50 shrink-0 group-hover:translate-x-0.5 transition-all duration-300"
      >
        <path
          d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
