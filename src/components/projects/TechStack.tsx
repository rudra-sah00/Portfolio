import React from 'react';
import styles from './TechStack.module.css';

interface TechStackProps {
  languages: Record<string, number>;
}

const TechStack: React.FC<TechStackProps> = ({ languages }) => {
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <div className={styles.techStack}>
        <p className="text-size-small text-color-gray400">No language data available</p>
      </div>
    );
  }

  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  const languagePercentages = Object.entries(languages)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: ((bytes / total) * 100).toFixed(1)
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5); // Show top 5 languages

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      HTML: '#e34c26',
      CSS: '#563d7c',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#fa7343',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB',
      Vue: '#4FC08D',
      React: '#61DAFB',
      Shell: '#89e051',
      PowerShell: '#012456',
      Dockerfile: '#384d54'
    };
    return colors[language] || '#61ffc9';
  };

  return (
    <div className={styles.techStack}>
      <h4 className={styles.title}>Tech Stack</h4>
      <div className={styles.list}>
        {languagePercentages.map(({ language, percentage }) => (
          <div key={language} className={styles.item}>
            <div className={styles.info}>
              <span 
                className={styles.dot}
                style={{ backgroundColor: getLanguageColor(language) }}
              ></span>
              <span className={styles.name}>{language}</span>
              <span className={styles.percentage}>{percentage}%</span>
            </div>
            <div className={styles.bar}>
              <div 
                className={styles.progress}
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: getLanguageColor(language)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
