"use client";

import { useEffect, useRef, useState } from "react";

const navItems = [
  {
    id: "hero",
    label: "Home",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "work",
    label: "Work",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const [active, setActive] = useState("hero");
  // null = hidden (initial), true = visible, false = hidden (scrolled away)
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    // Fade in after mount
    const t = setTimeout(() => setVisible(true), 400);

    function update() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // Only hide when within 120px of the absolute bottom (footer territory)
      const nearBottom = scrollY + winHeight >= docHeight - 120;
      setVisible(!nearBottom);

      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        requestAnimationFrame(update);
        ticking.current = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // Active section: use getBoundingClientRect for true absolute document offsets
    function updateActive() {
      const ids = navItems.map((n) => n.id);
      const mid = window.scrollY + window.innerHeight * 0.4;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= mid) current = id;
        }
      }
      setActive(current);
    }

    function onScrollActive() {
      requestAnimationFrame(updateActive);
    }

    window.addEventListener("scroll", onScrollActive, { passive: true });
    updateActive();

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollActive);
    };
  }, []);

  function handleClick(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Page navigation"
      className={`
        fixed bottom-6 left-1/2 z-50 -translate-x-1/2
        flex items-center gap-0.5
        px-2.5 py-2.5
        rounded-full
        bg-[#111111]/85 backdrop-blur-2xl
        border border-white/[0.08]
        shadow-2xl shadow-black/60
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleClick(item.id)}
          aria-label={item.label}
          className={`
            relative flex items-center justify-center w-10 h-10 rounded-full
            transition-all duration-200 ease-out
            ${
              active === item.id
                ? "text-white bg-white/[0.10]"
                : "text-white/30 hover:text-white/65 hover:bg-white/[0.05]"
            }
          `}
        >
          {item.icon}
          {active === item.id && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50" />
          )}
        </button>
      ))}
    </nav>
  );
}
