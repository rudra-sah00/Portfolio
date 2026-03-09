import Link from "next/link";

const services = [
  {
    name: "Private Cloud Suite",
    platform: "Nextcloud",
    description:
      "My personal office suite for files, photos, meetings, and collaboration. Fully encrypted and self-hosted on private hardware.",
    url: "https://cloud.rudrasahoo.live",
    href: "/infrastructure/cloud",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-5 h-5"
      >
        <path d="M17.5 19c.7 0 1.3-.2 1.8-.7s.7-1.1.7-1.8c0-.7-.2-1.3-.7-1.8s-1.1-.7-1.8-.7c-.5 0-1 .1-1.4.4-.1-.8-.5-1.5-1.1-2.1s-1.4-.8-2.2-.8c-1.1 0-2.1.4-2.8 1.2-.4-.3-.9-.4-1.4-.4-1.1 0-2 .9-2 2s.9 2 2 2h1.6" />
        <path d="M12 12v9" />
        <path d="m9 18 3 3 3-3" />
      </svg>
    ),
  },
];

export default function Infrastructure() {
  return (
    <section className="pb-16 px-6">
      <div className="mb-8">
        <span className="section-label">Infrastructure</span>
        <p className="mt-3 text-sm text-muted-foreground max-w-md">
          Self-hosted infrastructure powering my professional and personal life.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <Link
            key={service.name}
            href={service.href}
            className="group flex flex-col p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 no-underline"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white/[0.05] text-white/70 group-hover:text-purple-400 transition-colors">
                {service.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white leading-none">{service.name}</h3>
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1.5 block">
                  {service.platform} · Self-Hosted
                </span>
              </div>
            </div>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-lg">
              {service.description}
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-widest">
              Explore Suite Details
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="w-3 h-3"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
