import React from 'react';
import { GitHubRepo } from '@/types';
import TechStack from './TechStack';
import styles from './ProjectInfo.module.css';

interface ProjectInfoProps {
  repositories: GitHubRepo[];
  loading: boolean;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ repositories, loading }) => {
  return (
    <div className="tabs_left-top">
      {loading ? (
        <div className="tabs_let-content is-1">
          <h2 className="heading-style-h4 text-color-gray100">
            Loading repositories...
          </h2>
        </div>
      ) : (
        repositories.map((repo) => (
          <div key={repo.id} className="tabs_let-content">
            <div className={styles.projectHeader}>
              <h2 className="heading-style-h4 text-color-gray100">
                {repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h2>
              {repo.isOrganizationRepo && (
                <div className={styles.organizationBadge}>
                  <span className={styles.orgName}>{repo.owner?.login}</span>
                </div>
              )}
            </div>
            <div className="tabs_line"></div>
            <p className="text-size-small text-color-gray400">
              {repo.description || 'No description available for this repository.'}
            </p>
            <TechStack languages={repo.languages || {}} />
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectInfo;
