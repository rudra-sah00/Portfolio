'use client';

import { useEffect } from 'react';
import { GitHubRepo } from '@/types';
import { useScrollAnimation } from '@/hooks';
import { ProjectInfo, GitHubButton, ReadmeSection } from './projects';

interface ProjectsSectionProps {
  repositories: GitHubRepo[];
  loading: boolean;
}

const ProjectsSection = ({ repositories, loading }: ProjectsSectionProps) => {

  // Prevent scrolling until projects are loaded
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading]);

  // Use the scroll animation hook
  useScrollAnimation(repositories);

  if (loading) {
    return (
      <section className="section_tabs">
        <div className="padding-section-large">
          <div className="tabs_height min-h-screen flex items-center justify-center">
            <div className="loading-container">
              {/* Animated Loading Spinner */}
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              
              {/* Loading Text */}
              <div className="loading-text">
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  Loading Projects
                </h3>
                <p className="text-gray-500 animate-pulse">
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
            height: repositories.length > 0 
              ? `${repositories.length * 150}vh` // 150vh per repository for smooth scrolling
              : '550vh' // Default height while loading
          }}
        >
          <div className="tabs_sticky-wrapper">
            <div className="tabs_container">
              <div className="tabs_component">
                <div className="tabs_left">
                  <ProjectInfo repositories={repositories} loading={loading} />
                  <GitHubButton repositories={repositories} loading={loading} />
                </div>
                <ReadmeSection repositories={repositories} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
