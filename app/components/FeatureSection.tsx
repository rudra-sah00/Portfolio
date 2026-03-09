"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Feature {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  video?: string;
  gradient: string;
  accent: string;
  tags?: string[];
}

export default function FeatureSection({ feature }: { feature: Feature }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-1000 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
    >
      {/* Index & Title */}
      <div className="mb-8">
        <span className={`text-sm font-mono font-medium ${feature.accent} opacity-70`}>
          {feature.index}
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight mt-2 leading-tight sm:text-3xl sm:font-bold md:text-4xl">
          {feature.title}
        </h2>
        <p className={`text-lg font-medium mt-2 ${feature.accent}`}>{feature.subtitle}</p>
      </div>

      {/* Description */}
      <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl mb-8">
        {feature.description}
      </p>

      {/* Tags (for watch party) */}
      {feature.tags && (
        <div className="flex flex-wrap gap-2 mb-8">
          {feature.tags.map((tag) => (
            <span
              key={tag}
              className={`
                text-xs font-medium px-3 py-1.5 rounded-full
                border border-white/[0.08] bg-white/[0.03]
                text-white/60
                hover:bg-white/[0.06] hover:text-white/80
                transition-colors cursor-default
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Screenshot */}
      <div
        className={`
          relative rounded-2xl overflow-hidden
          ring-1 ring-white/[0.06]
          bg-gradient-to-br ${feature.gradient} bg-[#0d0d0d]
          transition-transform duration-700 ease-out
          hover:scale-[1.01]
        `}
      >
        {feature.video ? (
          <video src={feature.video} autoPlay loop muted playsInline className="w-full h-auto" />
        ) : (
          <div className="aspect-[16/9] relative">
            <Image
              src={feature.image ?? ""}
              alt={feature.title}
              fill
              className="object-cover object-top"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
