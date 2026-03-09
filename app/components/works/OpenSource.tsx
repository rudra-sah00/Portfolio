"use client";

import { useState } from "react";

interface PR {
  number: number;
  title: string;
  type: string;
  date: string;
  url: string;
}

const adminPRs: PR[] = [
  {
    number: 6392,
    title: "btn alignment issue fixed",
    type: "fix",
    date: "Jan 14, 2026",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/6392",
  },
  {
    number: 5964,
    title: "fix: convert empty optional fields to undefined in createOrganization",
    type: "fix",
    date: "Jan 1, 2026",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/5964",
  },
  {
    number: 5182,
    title: "Implement short-lived JWT token communication between the API and Admin apps",
    type: "feat",
    date: "Dec 22, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/5182",
  },
  {
    number: 4965,
    title: "improve test coverage for UsersTableItem.tsx",
    type: "test",
    date: "Dec 9, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4965",
  },
  {
    number: 4937,
    title: "test: improve test coverage for manager.ts",
    type: "test",
    date: "Dec 3, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4937",
  },
  {
    number: 4519,
    title: "test: improve AdvertisementEntry test coverage to 100%",
    type: "test",
    date: "Oct 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4519",
  },
  {
    number: 4451,
    title: "fix: Migrate EventListCardPreviewModal tests from Jest to Vitest",
    type: "fix",
    date: "Oct 16, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4451",
  },
  {
    number: 4290,
    title: "Improve test coverage for EventRegistrantsModal to 100%",
    type: "test",
    date: "Oct 11, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4290",
  },
  {
    number: 4268,
    title: "feat: Add PostgreSQL venue support to organization dashboard",
    type: "feat",
    date: "Oct 9, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4268",
  },
  {
    number: 4214,
    title: "feat: update i18next to v25.0.2",
    type: "chore",
    date: "Sep 28, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4214",
  },
  {
    number: 4135,
    title: "feat: upgrade babel-plugin-transform-import-meta to v2.3.3",
    type: "chore",
    date: "Sep 14, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4135",
  },
  {
    number: 4125,
    title: "fix: upgrade react-bootstrap from 2.10.5 to 2.10.10",
    type: "chore",
    date: "Aug 29, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4125",
  },
  {
    number: 4118,
    title: "chore(deps): bump sanitize-html from 2.13.0 to 2.17.0",
    type: "chore",
    date: "Aug 28, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-admin/pull/4118",
  },
];

const apiPRs: PR[] = [
  {
    number: 3970,
    title: "feat: implement refresh token support for authentication (Stage 1)",
    type: "feat",
    date: "Dec 16, 2025",
    url: "https://github.com/PalisadoesFoundation/talawa-api/pull/3970",
  },
];

const typeStyle: Record<string, string> = {
  feat: "text-emerald-400 bg-emerald-400/10",
  fix: "text-amber-400 bg-amber-400/10",
  test: "text-sky-400 bg-sky-400/10",
  chore: "text-white/30 bg-white/[0.04]",
};

function RepoAccordion({ repo, prs }: { repo: string; prs: PR[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <div className="flex flex-col items-center" style={{ width: 20, marginRight: 10 }}>
        <div className="flex items-center" style={{ height: 24 }}>
          <div style={{ width: 10, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>
        {open && <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.1)" }} />}
      </div>

      <div className="flex-1">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="group flex items-center gap-2 w-full text-left mb-0"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
            className="text-white/25 shrink-0"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="text-[13px] text-white/55 group-hover:text-white/80 transition-colors">
            PalisadoesFoundation / <span className="text-white/75">{repo}</span>
          </span>
          <span className="text-[10px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded-full ml-1">
            {prs.length} merged
          </span>
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            className="text-white/20 ml-auto transition-transform duration-200"
            aria-hidden="true"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            <path
              d="M4.5 2.5L8 6L4.5 9.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          style={{
            maxHeight: open ? `${prs.length * 52}px` : "0px",
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="mt-1">
            {prs.map((pr, i) => {
              const isLast = i === prs.length - 1;
              return (
                <div key={pr.number} className="flex">
                  <div
                    className="flex flex-col items-center"
                    style={{ width: 20, marginRight: 10 }}
                  >
                    <div className="flex items-center" style={{ height: 26 }}>
                      <div style={{ width: 10, height: 1, background: "rgba(255,255,255,0.1)" }} />
                    </div>
                    {!isLast && (
                      <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.1)" }} />
                    )}
                  </div>
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-1 flex items-center gap-2 py-1.5 no-underline"
                  >
                    <span
                      className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${typeStyle[pr.type]}`}
                    >
                      {pr.type}
                    </span>
                    <span className="flex-1 text-[12px] text-white/45 group-hover:text-white/80 transition-colors leading-snug truncate">
                      {pr.title}
                    </span>
                    <span className="shrink-0 text-[11px] font-mono text-white/20 hidden sm:block">
                      #{pr.number}
                    </span>
                    <span className="shrink-0 text-[11px] text-white/20 hidden sm:block">
                      {pr.date}
                    </span>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-white/15 group-hover:text-white/40 transition-colors"
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OpenSource() {
  return (
    <div className="flex flex-col gap-3">
      <RepoAccordion repo="talawa-admin" prs={adminPRs} />
      <RepoAccordion repo="talawa-api" prs={apiPRs} />
    </div>
  );
}
