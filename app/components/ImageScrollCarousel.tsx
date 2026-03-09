"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface CarouselItem {
  src: string;
  alt: string;
  caption: string;
}

export function ImageScrollCarousel({
  items,
  accentBg,
}: {
  items: CarouselItem[];
  accentBg: string;
}) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = itemRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { threshold: 0.55 }
      );
      obs.observe(el);
      return obs;
    });
    return () => {
      for (const obs of observers) obs?.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Scroll row */}
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
        {items.map((item, i) => (
          <div
            key={item.src}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="flex-none w-[80vw] max-w-[640px] relative rounded-2xl overflow-hidden ring-1 ring-white/[0.06] bg-white/[0.02] snap-start"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={1200}
              height={675}
              className="object-cover w-full h-auto"
            />
          </div>
        ))}
      </div>

      {/* Dot indicators + live caption */}
      <div className="mt-4 flex items-start gap-3">
        {/* Dots */}
        <div className="flex gap-1.5 mt-[5px] shrink-0">
          {items.map((item, i) => (
            <div
              key={item.src}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? `w-5 ${accentBg}` : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Caption — fades between slides */}
        <p
          key={active}
          className="text-[13px] text-muted-foreground leading-relaxed animate-fade-in"
        >
          {items[active].caption}
        </p>
      </div>
    </div>
  );
}
