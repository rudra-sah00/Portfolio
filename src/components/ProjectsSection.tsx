"use client";

import { useEffect } from "react";
import { GitHubRepo } from "@/types";
import { useScrollAnimation } from "@/hooks";
import { ProjectInfo, GitHubButton, ReadmeSection } from "./projects";

interface ProjectsSectionProps {
  repositories: GitHubRepo[];
  loading: boolean;
}

const ProjectsSection = ({ repositories, loading }: ProjectsSectionProps) => {
  // Prevent scrolling until projects are loaded
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [loading]);

  // Use the scroll animation hook
  useScrollAnimation(repositories);

  if (loading) {
    return (
      <section className="section_tabs">
        <div className="padding-section-large">
          <div className="tabs_height flex min-h-screen items-center justify-center">
            <div className="loading-container">
              {/* Animated Loading Spinner */}
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>

              {/* Loading Text */}
              <div className="loading-text">
                <h3 className="mb-2 text-2xl font-semibold text-gray-700">
                  Loading Projects
                </h3>
                <p className="animate-pulse text-gray-500">
                  Fetching repositories from GitHub...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Styles */}
        <style jsx>{`
          .loading-container {
            text-align: center;
            padding: 2rem;
          }

          .loading-spinner {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 2rem;
          }

          .spinner-ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-top: 3px solid #10b981;
            border-radius: 50%;
            animation: spin 1.2s linear infinite;
          }

          .spinner-ring:nth-child(2) {
            animation-delay: -0.4s;
            border-top-color: #059669;
          }

          .spinner-ring:nth-child(3) {
            animation-delay: -0.8s;
            border-top-color: #047857;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .loading-text {
            animation: fadeInUp 0.6s ease-out;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="section_tabs">
      <div className="padding-section-large">
        <div
          className="tabs_height"
          style={{
            height:
              repositories.length > 0
                ? `${repositories.length * 150}vh` // 150vh per repository for smooth scrolling
                : "550vh", // Default height while loading
          }}
        >
          <div className="tabs_sticky-wrapper">
            <div className="tabs_container">
              <div className="tabs_component flex flex-col gap-4 lg:flex-row lg:gap-8">
                <div className="tabs_left w-full lg:w-auto lg:max-w-[500px] lg:min-w-[400px]">
                  <ProjectInfo repositories={repositories} loading={loading} />
                  <GitHubButton repositories={repositories} loading={loading} />
                </div>
                <div className="readme_section w-full min-w-0 lg:flex-1">
                  <ReadmeSection
                    repositories={repositories}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        .tabs_component {
          overflow-x: hidden;
          word-wrap: break-word;
          hyphens: auto;
        }

        .tabs_left {
          flex-shrink: 0;
        }

        .readme_section {
          overflow-wrap: break-word;
          word-break: break-word;
        }

        /* Small laptop adjustments */
        @media (max-width: 1366px) and (min-width: 1024px) {
          .tabs_component {
            padding: 0 1rem;
            gap: 1rem !important;
          }

          .tabs_left {
            min-width: 300px !important;
            max-width: 400px !important;
          }

          .readme_section {
            font-size: 0.9rem;
            line-height: 1.5;
          }
        }

        /* Extra small laptops (14 inch and below) */
        @media (max-width: 1280px) and (min-width: 1024px) {
          .tabs_component {
            flex-direction: column !important;
            gap: 2rem !important;
          }

          .tabs_left {
            width: 100% !important;
            max-width: none !important;
            min-width: auto !important;
          }

          .readme_section {
            width: 100% !important;
            margin-top: 1rem;
          }
        }

        /* Tablet and mobile */
        @media (max-width: 1023px) {
          .tabs_component {
            flex-direction: column !important;
            padding: 0 0.5rem;
            gap: 1.5rem !important;
          }

          .tabs_left,
          .readme_section {
            width: 100% !important;
            max-width: none !important;
            min-width: auto !important;
          }
        }

        /* Mobile specific */
        @media (max-width: 768px) {
          .tabs_component {
            padding: 0 0.25rem;
            gap: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;
