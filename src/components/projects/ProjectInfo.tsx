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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className={styles.orgIcon}>
                    <path d="M1.5 14.25c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v12.5ZM1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.75.75 0 1 1 .832-1.248l1.055.703c.487.325.779.87.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-2.5a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75h-8.5Z"/>
                    <path d="M6 5.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 6 5.25ZM6 8a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 6 8Zm.75 2.25a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z"/>
                  </svg>
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
