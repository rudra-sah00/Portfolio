import Image from "next/image";
import Link from "next/link";
import { COSMIC_WATCH, STREAMING } from "@/lib/assets";

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  gradient: string;
  image: string;
  href: string;
}

const projects: Project[] = [
  {
    title: "Project 1",
    subtitle: "Netflix · Hotstar · HBO · Disney+",
    description:
      "A complete reimagination of streaming platforms — with watch parties, smart recommendations, unified libraries, and much more.",
    tags: ["UI/UX", "Full-Stack", "Streaming"],
    gradient: "from-purple-950 via-purple-900 to-indigo-950",
    image: STREAMING.hero,
    href: "/projects/project-1",
  },
  {
    title: "Project 2",
    subtitle: "NASA API · Real-Time Space Monitoring",
    description:
      "A sophisticated platform for monitoring Near-Earth Objects, powered by a Python scientific risk engine and real-time NASA data feeds.",
    tags: ["UI/UX", "Python", "Space"],
    gradient: "from-blue-950 via-indigo-950 to-slate-950",
    image: COSMIC_WATCH.hero,
    href: "/projects/project-2",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="pb-16 px-5 sm:pb-24 sm:px-6">
      {/* Section Header */}
      <div className="mb-10">
        <span className="section-label">Projects</span>
      </div>

      {/* Project Cards */}
      <div className="flex flex-col gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.href} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.href}
      className={`
        block relative group overflow-hidden rounded-2xl
        bg-gradient-to-br ${project.gradient}
        cursor-pointer transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-purple-500/10
        ring-1 ring-white/[0.04] no-underline
      `}
    >
      {/* Content area */}
      <div className="relative z-10 p-5 pb-0 sm:p-8 sm:pb-0">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/[0.08] text-white/60 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-semibold text-white tracking-tight sm:text-2xl">
          {project.title}
        </h3>
        <p className="text-sm text-white/50 mt-1 font-medium">{project.subtitle}</p>
        <p className="text-sm text-white/40 mt-3 max-w-sm leading-relaxed">{project.description}</p>
      </div>

      {/* Hero Image */}
      <div className="relative mt-6 mx-3 mb-0 overflow-hidden rounded-t-xl sm:mt-8 sm:mx-6">
        <div className="aspect-[16/9] relative">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="
              object-cover object-top
              transition-transform duration-700 ease-out
              group-hover:scale-[1.03]
            "
          />
        </div>
      </div>

      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Link>
  );
}
