'use client';

import { useEffect, useState } from 'react';
import { GitHubRepo } from '@/types';
import { fetchGitHubRepositories } from '@/lib/api';
import { useScrollAnimation } from '@/hooks';
import { ProjectInfo, GitHubButton, ReadmeSection } from './projects';

const ProjectsSection = () => {
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔧 Change this to any GitHub username to fetch their public repositories
  const username = 'rudra-sah00'; // Try: 'octocat', 'torvalds', 'gaearon', etc.

  // Fetch repositories and their README files
  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const repos = await fetchGitHubRepositories(username);
        setRepositories(repos);
        setLoading(false);
      } catch (error) {
        console.error('Error loading repositories:', error);
        setLoading(false);
      }
    };

    loadRepositories();
  }, [username]);

  // Use the scroll animation hook
  useScrollAnimation(repositories);

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
