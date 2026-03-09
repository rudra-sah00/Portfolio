const certs = [
  {
    title: "Google Devs Sprint 2K25 — Winner",
    issuer: "Google Developer Group · VIT-AP",
    href: "https://credsverse.com/credentials/f9be82cd-6c2f-4fd2-a945-6c44c6aaa079",
    accent: "text-amber-400",
  },
  {
    title: "OCI 2025 Generative AI Professional",
    issuer: "Oracle · Sep 2025",
    href: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=1C9B4DC70AE9A0B2E8D007E74B6D17EC5F9F629C09087BE18852CFB24E922C9E",
    accent: "text-white/70",
  },
  {
    title: "AWS Academy Cloud Architecting",
    issuer: "Amazon Web Services",
    href: "https://www.credly.com/badges/92e3d305-a435-4eed-abe7-16b914b76b23/linked_in_profile",
    accent: "text-white/70",
  },
  {
    title: "AWS Academy Cloud Foundations",
    issuer: "Amazon Web Services",
    href: "https://www.credly.com/badges/797c743a-9559-4f8b-9869-c2ef018ce72c/linked_in_profile",
    accent: "text-white/70",
  },
  {
    title: "HackVerse — Participant",
    issuer: "Milestone Club & Bulls & Bears Club · SRM AP",
    href: "https://credsverse.com/credentials/6ece76d3-7a38-424d-b3c6-b6d6534f134b",
    accent: "text-white/70",
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="pb-16 px-5 sm:pb-24 sm:px-6">
      <div className="mb-6">
        <span className="section-label">Certifications</span>
      </div>

      <div className="flex flex-col divide-y divide-white/[0.05]">
        {certs.map((cert) => (
          <a
            key={cert.title}
            href={cert.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 py-3.5 no-underline"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                className={`text-sm font-medium ${cert.accent} group-hover:opacity-80 transition-opacity leading-snug`}
              >
                {cert.title}
              </span>
              <span className="text-[12px] text-white/30">{cert.issuer}</span>
            </div>
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              className="text-white/20 group-hover:text-white/50 shrink-0 transition-colors"
              aria-hidden="true"
            >
              <path
                d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}
