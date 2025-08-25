import { useEffect } from 'react';
import { GitHubRepo } from '@/types';

export const useScrollAnimation = (repositories: GitHubRepo[]) => {
  useEffect(() => {
    const handleScroll = () => {
      if (repositories.length === 0) return;

      let scrollPosition = window.scrollY;
      // Calculate window height based on number of repositories for smooth transitions
      let windowHeight = window.innerHeight + (repositories.length > 5 ? 400 : 550);
      let sections = document.querySelectorAll('.tabs_let-content');
      let readmeContents = document.querySelectorAll('.readme-content');
      let lastSectionIndex = sections.length - 1;
      let currentActiveIndex = 0;

      sections.forEach((section, index) => {
        const sectionStart = index * windowHeight;
        const sectionEnd = (index + 1) * windowHeight;
        
        if (scrollPosition >= sectionStart && scrollPosition < sectionEnd) {
          section.classList.add('is-1');
          readmeContents[index]?.classList.add('is-1');
          currentActiveIndex = index;
        } else {
          // Remove is-1 class from all sections except the last one
          if (index !== lastSectionIndex) {
            section.classList.remove('is-1');
            readmeContents[index]?.classList.remove('is-1');
          }
        }
      });

      // Keep is-1 class on the last section until user scrolls past it
      if (scrollPosition > (lastSectionIndex * windowHeight)) {
        sections[lastSectionIndex]?.classList.add('is-1');
        readmeContents[lastSectionIndex]?.classList.add('is-1');
        currentActiveIndex = lastSectionIndex;
      } else {
        sections[lastSectionIndex]?.classList.remove('is-1');
        readmeContents[lastSectionIndex]?.classList.remove('is-1');
      }

      // Update the GitHub button link
      const githubButton = document.querySelector('.button.is-green.is-secondary') as HTMLAnchorElement;
      if (githubButton && repositories[currentActiveIndex]) {
        githubButton.href = repositories[currentActiveIndex].html_url;
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [repositories]);

  // Set the first repository as active when repositories are loaded
  useEffect(() => {
    if (repositories.length > 0) {
      setTimeout(() => {
        const firstSection = document.querySelector('.tabs_let-content');
        const firstReadme = document.querySelector('.readme-content');
        firstSection?.classList.add('is-1');
        firstReadme?.classList.add('is-1');
      }, 100);
    }
  }, [repositories]);
};
