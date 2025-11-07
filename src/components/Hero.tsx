"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compare } from "@/components/ui/compare";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { GitHubRepo } from "@/types";
import TerminalPopup from "./TerminalPopup";

interface HeroProps {
  repositories: GitHubRepo[];
  loading: boolean;
}

const Hero = ({ repositories, loading }: HeroProps) => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Pin the intro text section
    ScrollTrigger.create({
      trigger: ".intro-wrapper",
      start: "top top",
      end: "bottom top",
      pin: ".hero-content",
      pinSpacing: false,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Cleanup effect to restore scrolling on unmount
  useEffect(() => {
    return () => {
      // Restore scrolling when component unmounts
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleTerminalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTerminalOpen(true);
    // Prevent scrolling when terminal is opened
    document.body.style.overflow = "hidden";
  };

  const handleTerminalClose = () => {
    setIsTerminalOpen(false);
    // Only restore scrolling if not overridden by other components
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "unset";
    }
  };

  return (
    <>
      <div className="intro-wrapper">
        <div className="intro">
          <div
            className="hero-content flex min-h-screen items-center justify-center"
            id="js-pin"
          >
            <div className="mx-auto w-full max-w-4xl px-4">
              <div className="space-y-8 text-center">
                {/* Profile Image Compare - Centered */}
                <div className="mb-6 flex justify-center md:mb-8">
                  <Compare
                    firstImage="/IMG_8178.jpg"
                    secondImage="/IMG-8276.jpg"
                    firstImageClassName="object-cover object-center"
                    secondImageClassname="object-cover object-center"
                    className="h-[140px] w-[140px] rounded-full border-4 border-gray-200/30 shadow-2xl sm:h-[160px] sm:w-[160px] md:h-[200px] md:w-[200px] lg:h-[240px] lg:w-[240px] xl:h-[260px] xl:w-[260px]"
                    slideMode="hover"
                    initialSliderPercentage={70}
                  />
                </div>

                {/* Text Content - Centered */}
                <div className="space-y-4 md:space-y-6 lg:space-y-8">
                  {/* Main Heading - Responsive */}
                  <h1 className="px-2 text-2xl leading-tight font-light tracking-tight sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl">
                    <span className="font-thin text-gray-600 italic">Hey,</span>{" "}
                    <span className="font-bold text-gray-800 italic">
                      I&apos;m
                    </span>{" "}
                    <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text pr-2 font-black text-transparent italic">
                      Rudra
                    </span>
                    <span className="font-bold text-teal-500 italic">.</span>
                  </h1>

                  {/* Subtitle with animated text - Responsive */}
                  <div className="flex flex-col items-center justify-center gap-2 px-2 text-sm text-gray-700 sm:flex-row sm:gap-3 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    <span className="font-semibold italic">I&apos;m a</span>
                    <ContainerTextFlip
                      words={[
                        "Tech Enthusiast",
                        "Full Stack Developer",
                        "Startup Enthusiast",
                        "DevOps Expert",
                        "Problem Solver",
                        "Tech Innovator",
                      ]}
                      interval={2500}
                      className="flex items-center justify-center !border !border-gray-600 !bg-gray-800 px-3 py-2 !text-center !text-sm whitespace-nowrap !shadow-lg sm:px-4 sm:py-2.5 sm:!text-lg md:px-6 md:py-3 md:!text-xl lg:!text-2xl"
                      textClassName="!text-white font-black italic !text-sm sm:!text-lg md:!text-xl lg:!text-2xl text-center"
                      animationDuration={800}
                    />
                  </div>

                  {/* Flip Button */}
                  <div className="mt-6 flex justify-center md:mt-8">
                    <a
                      href="#"
                      className="btn-flip"
                      data-back="Terminal"
                      data-front="help"
                      onClick={handleTerminalClick}
                    ></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Popup */}
      <TerminalPopup
        isOpen={isTerminalOpen}
        onClose={handleTerminalClose}
        repositories={repositories}
        loading={loading}
      />
    </>
  );
};

export default Hero;
