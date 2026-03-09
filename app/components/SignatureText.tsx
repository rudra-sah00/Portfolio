"use client";

import { Great_Vibes } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

export default function SignatureText() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        overflow: "hidden",
        maxWidth: revealed ? "500px" : "0px",
        transition: "max-width 4.5s cubic-bezier(0.16, 1, 0.3, 1)",
        paddingTop: "0.4em",
        paddingBottom: "0.1em",
      }}
    >
      <span className={`${greatVibes.className} text-6xl text-white/60 whitespace-nowrap block`}>
        Rudra Sahoo
      </span>
    </div>
  );
}
