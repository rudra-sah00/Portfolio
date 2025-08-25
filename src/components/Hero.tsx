'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compare } from '@/components/ui/compare';
import { ContainerTextFlip } from '@/components/ui/container-text-flip';
import TerminalPopup from './TerminalPopup';

const Hero = () => {
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

  const handleTerminalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTerminalOpen(true);
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
                <div className="flex justify-center mb-8">
                  <Compare
                    firstImage="/IMG_8178.jpg"
                    secondImage="/IMG-8276.jpg"
                    firstImageClassName="object-cover object-center"
                    secondImageClassname="object-cover object-center"
                    className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] lg:w-[260px] lg:h-[260px] rounded-full shadow-2xl border-4 border-gray-200/30"
                    slideMode="hover"
                    initialSliderPercentage={70}
                  />
                </div>
                
                {/* Text Content - Centered */}
                <div className="space-y-8">
                  {/* Main Heading - Single Line */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light tracking-tight whitespace-nowrap px-4">
                    <span className="font-thin italic text-gray-600">Hey,</span>{" "}
                    <span className="font-bold italic text-gray-800">I'm</span>{" "}
                    <span className="font-black italic bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent pr-3">Rudra</span>
                    <span className="text-teal-500 font-bold italic">.</span>
                  </h1>
                  
                  {/* Subtitle with animated text - Single line */}
                  <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl lg:text-3xl text-gray-700 px-4">
                    <span className="font-semibold italic pr-2">I'm a</span>
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
                      className="!bg-gray-800 !shadow-lg !border !border-gray-600 !text-lg sm:!text-xl lg:!text-2xl px-6 py-3 whitespace-nowrap !text-center flex items-center justify-center"
                      textClassName="!text-white font-black italic !text-lg sm:!text-xl lg:!text-2xl text-center"
                      animationDuration={800}
                    />
                  </div>

                  {/* Flip Button */}
                  <div className="flex justify-center mt-8 ml-8">
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
        onClose={() => setIsTerminalOpen(false)} 
      />
    </>
  );
};

export default Hero;
