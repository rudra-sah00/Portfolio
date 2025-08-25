import React from 'react';
import { GitHubRepo } from '@/types';

interface GitHubButtonProps {
  repositories: GitHubRepo[];
  loading: boolean;
}

const GitHubButton: React.FC<GitHubButtonProps> = ({ repositories, loading }) => {
  if (loading || repositories.length === 0) return null;

  return (
    <div className="tabs_left-bottom">
      <a 
        href={repositories[0]?.html_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="button is-grey is-secondary"
      >
        <div className="button-text">View on GitHub</div>
        <div className="button-circle-wrapper">
          <div className="button-icon _1 w-embed">
            <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.66699 11.3332L11.3337 4.6665" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M4.66699 4.6665H11.3337V11.3332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <div className="button-icon _2 w-embed">
            <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.66699 11.3332L11.3337 4.6665" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M4.66699 4.6665H11.3337V11.3332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
        </div>
        <div className="button-circlee background-color-grey"></div>
      </a>
    </div>
  );
};

export default GitHubButton;
