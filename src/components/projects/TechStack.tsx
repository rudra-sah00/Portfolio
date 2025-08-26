import React from 'react';
import styles from './TechStack.module.css';
import { 
  SiJavascript, 
  SiTypescript, 
  SiPython, 
  SiCplusplus, 
  SiC, 
  SiHtml5, 
  SiCss3, 
  SiPhp, 
  SiRuby, 
  SiGo, 
  SiRust, 
  SiSwift, 
  SiKotlin, 
  SiDart, 
  SiVuedotjs, 
  SiReact, 
  SiShell, 
  SiDocker,
  SiNodedotjs,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiGit,
  SiLinux,
  SiMacos,
  SiGithub,
  SiExpress,
  SiNextdotjs,
  SiTailwindcss,
  SiBootstrap,
  SiSass,
  SiWebpack,
  SiVite,
  SiNpm,
  SiYarn,
  SiJest,
  SiCypress,
  SiStorybook,
  SiFigma,
  SiAdobe,
  SiCanva
} from 'react-icons/si';
import { IoLogoAndroid, IoLogoApple } from 'react-icons/io';
import { FaCode, FaJava } from 'react-icons/fa';
import { DiWindows } from 'react-icons/di';
import { VscCode } from 'react-icons/vsc';

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

  // Use compact layout for 4 or more languages to prevent overlap
  const isCompactLayout = languagePercentages.length >= 4;

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

  const getLanguageIcon = (language: string) => {
    const iconProps = { size: 18, className: styles.icon };
    
    const icons: Record<string, React.ReactElement> = {
      JavaScript: <SiJavascript {...iconProps} />,
      TypeScript: <SiTypescript {...iconProps} />,
      Python: <SiPython {...iconProps} />,
      Java: <FaJava {...iconProps} />,
      'C++': <SiCplusplus {...iconProps} />,
      C: <SiC {...iconProps} />,
      HTML: <SiHtml5 {...iconProps} />,
      CSS: <SiCss3 {...iconProps} />,
      PHP: <SiPhp {...iconProps} />,
      Ruby: <SiRuby {...iconProps} />,
      Go: <SiGo {...iconProps} />,
      Rust: <SiRust {...iconProps} />,
      Swift: <SiSwift {...iconProps} />,
      Kotlin: <SiKotlin {...iconProps} />,
      Dart: <SiDart {...iconProps} />,
      Vue: <SiVuedotjs {...iconProps} />,
      React: <SiReact {...iconProps} />,
      Shell: <SiShell {...iconProps} />,
      PowerShell: <VscCode {...iconProps} />,
      Dockerfile: <SiDocker {...iconProps} />,
      'Node.js': <SiNodedotjs {...iconProps} />,
      MongoDB: <SiMongodb {...iconProps} />,
      MySQL: <SiMysql {...iconProps} />,
      PostgreSQL: <SiPostgresql {...iconProps} />,
      Redis: <SiRedis {...iconProps} />,
      Git: <SiGit {...iconProps} />,
      Linux: <SiLinux {...iconProps} />,
      macOS: <SiMacos {...iconProps} />,
      Windows: <DiWindows {...iconProps} />,
      'VS Code': <VscCode {...iconProps} />,
      GitHub: <SiGithub {...iconProps} />,
      Express: <SiExpress {...iconProps} />,
      'Next.js': <SiNextdotjs {...iconProps} />,
      Tailwind: <SiTailwindcss {...iconProps} />,
      Bootstrap: <SiBootstrap {...iconProps} />,
      Sass: <SiSass {...iconProps} />,
      Webpack: <SiWebpack {...iconProps} />,
      Vite: <SiVite {...iconProps} />,
      npm: <SiNpm {...iconProps} />,
      Yarn: <SiYarn {...iconProps} />,
      Jest: <SiJest {...iconProps} />,
      Cypress: <SiCypress {...iconProps} />,
      Storybook: <SiStorybook {...iconProps} />,
      Figma: <SiFigma {...iconProps} />,
      Adobe: <SiAdobe {...iconProps} />,
      Canva: <SiCanva {...iconProps} />,
      Android: <IoLogoAndroid {...iconProps} />,
      iOS: <IoLogoApple {...iconProps} />
    };
    
    return icons[language] || <FaCode {...iconProps} />;
  };

  return (
    <div className={`${styles.techStack} ${isCompactLayout ? styles.compact : ''}`}>
      <h4 className={styles.title}>Tech Stack</h4>
      <div className={styles.list}>
        {languagePercentages.map(({ language, percentage }) => (
          <div key={language} className={styles.item}>
            <div className={styles.info}>
              <div className={styles.iconWrapper}>
                {getLanguageIcon(language)}
              </div>
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
