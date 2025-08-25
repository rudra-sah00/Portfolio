import React from 'react';
import { GitHubRepo } from '@/types';
import ReadmeViewer from './ReadmeViewer';

interface ReadmeSectionProps {
  repositories: GitHubRepo[];
  loading: boolean;
}

const ReadmeSection: React.FC<ReadmeSectionProps> = ({ repositories, loading }) => {
  return (
    <div className="tabs_right">
      {loading ? (
        <div className="tabs_video is-1 readme-content">
          <div className="readme-container">
            <p className="text-color-gray100">Loading README...</p>
          </div>
        </div>
      ) : (
        repositories.map((repo, index) => (
          <div key={`readme-${repo.id}`} className="tabs_video readme-content">
            <ReadmeViewer 
              content={repo.readme_content || '# No README available'} 
              repoName={repo.name}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ReadmeSection;
