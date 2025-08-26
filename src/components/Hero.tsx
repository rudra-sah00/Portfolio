'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compare } from '@/components/ui/compare';
import { ContainerTextFlip } from '@/components/ui/container-text-flip';
import { GitHubRepo } from '@/types';
import TerminalPopup from './TerminalPopup';

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
      pinSpacing: false
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Cleanup effect to restore scrolling on unmount
  useEffect(() => {
    return () => {
      // Restore scrolling when component unmounts
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleTerminalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTerminalOpen(true);
    // Prevent scrolling when terminal is opened
    document.body.style.overflow = 'hidden';
  };

  const handleTerminalClose = () => {
    setIsTerminalOpen(false);
    // Only restore scrolling if not overridden by other components
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <>
      <div className="intro-wrapper">
        <div className="intro">
          <div 
            className="hero-content flex items-center justify-center min-h-screen" 
            id="js-pin"
          >
            <div className="w-full max-w-4xl mx-auto px-4">
              <div className="text-center space-y-8">
                {/* Profile Image Compare - Centered */}
                <div className="flex justify-center mb-6 md:mb-8">
                  <Compare
                    firstImage="/IMG_8178.jpg"
                    secondImage="/IMG-8276.jpg"
                    firstImageClassName="object-cover object-center"
                    secondImageClassname="object-cover object-center"
                    className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] xl:w-[260px] xl:h-[260px] rounded-full shadow-2xl border-4 border-gray-200/30"
                    slideMode="hover"
                    initialSliderPercentage={70}
                  />
                </div>
                
                {/* Text Content - Centered */}
                <div className="space-y-4 md:space-y-6 lg:space-y-8">
                  {/* Main Heading - Responsive */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-tight px-2">
                    <span className="font-thin italic text-gray-600">Hey,</span>{" "}
                    <span className="font-bold italic text-gray-800">I&apos;m</span>{" "}
                    <span className="font-black italic bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent pr-2">Rudra</span>
                    <span className="text-teal-500 font-bold italic">.</span>
                  </h1>
                  
                  {/* Subtitle with animated text - Responsive */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-700 px-2">
                    <span className="font-semibold italic">I&apos;m a</span>
                    <ContainerTextFlip
                      words={[
                        "Tech Enthusiast",
                        "Full Stack Developer", 
                        "Startup Enthusiast",
                        "DevOps Expert",
                        "Problem Solver",
                        "Tech Innovator"
                      ]}
                      interval={2500}
                      className="!bg-gray-800 !shadow-lg !border !border-gray-600 !text-sm sm:!text-lg md:!text-xl lg:!text-2xl px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 whitespace-nowrap !text-center flex items-center justify-center"
                      textClassName="!text-white font-black italic !text-sm sm:!text-lg md:!text-xl lg:!text-2xl text-center"
                      animationDuration={800}
                    />
                  </div>

                  {/* Flip Button */}
                  <div className="flex justify-center mt-6 md:mt-8">
                    <a 
                      href="#" 
                      className="btn-flip" 
                      data-back="Terminal" 
                      data-front="!help"
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
