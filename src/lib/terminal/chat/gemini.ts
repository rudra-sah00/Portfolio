import { fetchGitHubRepositories } from '@/lib/api/github';
import { GitHubRepo } from '@/types';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiAPI {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  private cachedProjects: GitHubRepo[] | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 300000; // 5 minutes
  private lastDiscussedProject: GitHubRepo | null = null; // Track last discussed project

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async getProjects(): Promise<GitHubRepo[]> {
    const now = Date.now();
    
    // Return cached projects if they're still fresh
    if (this.cachedProjects && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cachedProjects;
    }

    try {
      this.cachedProjects = await fetchGitHubRepositories('rudra-sah00');
      this.lastFetch = now;
      return this.cachedProjects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Return empty array if fetch fails
      return [];
    }
  }

  private formatProjectsForAI(projects: GitHubRepo[]): string {
    const personalProjects = projects.filter(p => !p.isOrganizationRepo);
    const orgProjects = projects.filter(p => p.isOrganizationRepo);
    
    let result = '';
    
    if (personalProjects.length > 0) {
      result += '\n**PERSONAL PROJECTS:**\n';
      personalProjects.forEach(project => {
        const languages = project.languages ? Object.keys(project.languages).join(', ') : 'Language info pending';
        result += `
• **${project.name}**: ${project.description || 'No description available'}
  - **Technologies:** ${languages}
  - **GitHub:** ${project.html_url}`;
      });
    }
    
    if (orgProjects.length > 0) {
      result += '\n\n**ORGANIZATION/PROFESSIONAL PROJECTS:**\n';
      orgProjects.forEach(project => {
        const languages = project.languages ? Object.keys(project.languages).join(', ') : 'Language info pending';
        result += `
• **${project.name}**: ${project.description || 'No description available'}
  - **Technologies:** ${languages}
  - **GitHub:** ${project.html_url}
  - **Organization:** ${project.owner?.login || 'Unknown'}`;
      });
    }
    
    return result;
  }

  private findProjectByName(projects: GitHubRepo[], projectName: string): GitHubRepo | null {
    const normalizedSearchName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // First, try exact matches (normalized)
    let project = projects.find(project => 
      project.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearchName
    );
    
    if (project) return project;
    
    // Second, try partial matches (contains) - both directions
    project = projects.find(project => {
      const normalizedProjectName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedProjectName.includes(normalizedSearchName) || 
             normalizedSearchName.includes(normalizedProjectName);
    });
    
    if (project) return project;
    
    // Third, try similarity matching for typos (Levenshtein-like)
    project = projects.find(project => {
      const normalizedProjectName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return this.calculateSimilarity(normalizedProjectName, normalizedSearchName) > 0.7;
    });
    
    if (project) return project;
    
    // Fourth, try word-by-word matching for multi-word projects
    const searchWords = projectName.toLowerCase().split(/[\s\-_]+/);
    project = projects.find(project => {
      const projectWords = project.name.toLowerCase().split(/[\s\-_]+/);
      const matchedWords = searchWords.filter(searchWord => 
        projectWords.some(projectWord => 
          projectWord.includes(searchWord) || searchWord.includes(projectWord)
        )
      );
      return matchedWords.length >= Math.min(searchWords.length, projectWords.length) * 0.6;
    });
    
    if (project) return project;
    
    // Finally, try description matching
    project = projects.find(project => 
      project.description && 
      project.description.toLowerCase().includes(projectName.toLowerCase())
    );
    
    return project || null;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    
    const distance = this.levenshteinDistance(str1, str2);
    return (maxLength - distance) / maxLength;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitution = matrix[j - 1][i - 1] + (str1[i - 1] === str2[j - 1] ? 0 : 1);
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          substitution              // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private getDetailedProjectInfo(project: GitHubRepo): string {
    const languages = project.languages ? Object.keys(project.languages) : [];
    const languagesList = languages.length > 0 ? languages.join(', ') : 'Language information pending';
    
    // Extract key information from README
    const readme = project.readme_content || '';
    const features = this.extractFeaturesFromReadme(readme);
    const techStack = this.extractTechStackFromReadme(readme, languages);
    
    return `\n\n**PROJECT ANALYSIS FOR "${project.name.toUpperCase()}"** (Live GitHub Data)

**📋 PROJECT OVERVIEW:**
- **Name:** ${project.name}
- **Description:** ${project.description || 'No description available'}
- **Type:** ${project.isOrganizationRepo ? 'Professional/Organization Project' : 'Personal Project'}
- **GitHub:** ${project.html_url}

**🛠️ TECHNOLOGY STACK:**
${techStack}

**✨ KEY FEATURES & HIGHLIGHTS:**
${features}

**💻 DETECTED LANGUAGES:**
${languages.length > 0 ? languages.map(lang => `• ${lang}`).join('\n') : '• Language detection pending...'}

**📖 README INSIGHTS:**
${readme.length > 0 ? readme.substring(0, 800) + '...\n\n*Visit GitHub for complete documentation.*' : 'No README content available.'}

*This information is fetched live from GitHub API and analyzed in real-time.*`;
  }

  private extractTechStackFromReadme(readme: string, detectedLanguages: string[]): string {
    const techKeywords = {
      'Frontend': ['react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'tailwind', 'bootstrap', 'css', 'html', 'typescript', 'javascript'],
      'Backend': ['node.js', 'express', 'fastapi', 'django', 'flask', 'spring', 'golang', 'gin', 'chi', 'fiber'],
      'Database': ['mongodb', 'mysql', 'postgresql', 'redis', 'firebase', 'supabase', 'sqlite'],
      'Cloud & DevOps': ['aws', 'azure', 'google cloud', 'vercel', 'netlify', 'docker', 'kubernetes', 'ci/cd'],
      'AI/ML': ['tensorflow', 'pytorch', 'yolo', 'opencv', 'ollama', 'openai', 'gemini', 'machine learning'],
      'Mobile': ['flutter', 'react native', 'swift', 'kotlin', 'dart', 'android', 'ios']
    };
    
    const foundTech: { [category: string]: string[] } = {};
    const readmeLower = readme.toLowerCase();
    
    // Extract from README content
    Object.entries(techKeywords).forEach(([category, keywords]) => {
      const found = keywords.filter(keyword => readmeLower.includes(keyword.toLowerCase()));
      if (found.length > 0) {
        foundTech[category] = found;
      }
    });
    
    // Add detected languages to appropriate categories
    detectedLanguages.forEach(lang => {
      const langLower = lang.toLowerCase();
      if (['javascript', 'typescript', 'html', 'css'].includes(langLower)) {
        if (!foundTech['Frontend']) foundTech['Frontend'] = [];
        if (!foundTech['Frontend'].includes(lang)) foundTech['Frontend'].push(lang);
      } else if (['python', 'golang', 'java', 'c++', 'c#'].includes(langLower)) {
        if (!foundTech['Backend']) foundTech['Backend'] = [];
        if (!foundTech['Backend'].includes(lang)) foundTech['Backend'].push(lang);
      }
    });
    
    if (Object.keys(foundTech).length === 0) {
      return `• **Primary Languages:** ${detectedLanguages.join(', ') || 'Detection pending...'}`;
    }
    
    return Object.entries(foundTech)
      .map(([category, techs]) => `• **${category}:** ${techs.join(', ')}`)
      .join('\n');
  }

  private extractFeaturesFromReadme(readme: string): string {
    const featurePatterns = [
      /(?:features?|functionality|capabilities)[\s\S]*?(?=\n\n|\n#|$)/i,
      /(?:•|-)[\s]*([^\n]+)/g,
      /(?:\d+\.)[\s]*([^\n]+)/g
    ];
    
    const features: string[] = [];
    
    featurePatterns.forEach(pattern => {
      const matches = readme.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleaned = match.replace(/^[•\-\d\.]\s*/, '').trim();
          if (cleaned.length > 10 && cleaned.length < 200) {
            features.push(cleaned);
          }
        });
      }
    });
    
    if (features.length === 0) {
      return '• Feature analysis pending - check GitHub repository for detailed information';
    }
    
    return features.slice(0, 5).map(feature => `• ${feature}`).join('\n');
  }

  private isProjectQuery(message: string): boolean {
    const projectKeywords = [
      'project', 'projects', 'repository', 'repositories', 'repo', 'repos',
      'code', 'github', 'work', 'built', 'created', 'developed'
    ];
    const messageWords = message.toLowerCase().split(/\s+/);
    return projectKeywords.some(keyword => messageWords.includes(keyword));
  }

  private isSpecificProjectQuery(message: string): string | null {
    // Look for phrases like "tell me about [project]", "more about [project]", etc.
    const aboutPatterns = [
      /(?:tell me about|more about|details about|about|explain|describe)\s+([a-zA-Z0-9\-_\.\s]+?)(?:\s+project|\s+repo|\?|$)/i,
      /(?:what is|what's)\s+([a-zA-Z0-9\-_\.\s]+?)(?:\s+project|\s+repo|\?|$)/i,
      /([a-zA-Z0-9\-_\.\s]+?)\s+(?:project|repository|repo)(?:\s|$)/i,
      /(?:show me|show)\s+([a-zA-Z0-9\-_\.\s]+?)(?:\s+project|\s+repo|\?|$)/i,
      /(?:info on|information about)\s+([a-zA-Z0-9\-_\.\s]+?)(?:\s+project|\s+repo|\?|$)/i,
      /(?:detail about|details of)\s+([a-zA-Z0-9\-_\.\s]+?)(?:\s+project|\s+repo|\?|$)/i,
      // Pattern for just mentioning a project name (like "DuckBuck-AI-Walkie-Talkie this one")
      /^([a-zA-Z0-9\-_]+(?:\-[a-zA-Z0-9\-_]+)*)\s+(?:this one|that one|this|that)$/i,
      // Pattern for project names that look like GitHub repository names
      /^([a-zA-Z0-9](?:[a-zA-Z0-9\-_]*[a-zA-Z0-9])?)(?:\s+(?:this|that|one))?$/i,
      // Add patterns for follow-up questions
      /(?:what are the|what is the|tell me the)\s+(?:tech stack|technologies|tech|languages|stack)\s+(?:used in|in|for|of)\s+(?:it|that|this|the project)?/i,
      /(?:which|what)\s+(?:technologies|languages|tech stack|frameworks)\s+(?:are used|used|does it use)/i,
      /(?:tech stack|technologies|languages)\s+(?:used|in it|for it)/i
    ];

    for (const pattern of aboutPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        const projectName = match[1].trim();
        // Filter out common words that aren't project names
        const commonWords = ['your', 'my', 'the', 'this', 'that', 'projects', 'work', 'code', 'github', 'more', 'detail', 'hello', 'hi', 'hey'];
        if (!commonWords.includes(projectName.toLowerCase()) && projectName.length > 2) {
          return projectName;
        }
      }
    }
    
    // Check if the entire message looks like a project name (for GitHub-style names)
    const projectNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9\-_]*[a-zA-Z0-9]$/;
    if (projectNamePattern.test(message.trim()) && message.trim().length > 3) {
      return message.trim();
    }
    
    // Check for follow-up questions about tech stack without explicit project name
    const followUpPatterns = [
      /(?:what are the|what is the|tell me the)\s+(?:tech stack|technologies|tech|languages|stack)/i,
      /(?:which|what)\s+(?:technologies|languages|tech stack|frameworks)/i,
      /(?:tech stack|technologies|languages)\s+(?:used|in it)/i
    ];
    
    for (const pattern of followUpPatterns) {
      if (pattern.test(message)) {
        return 'FOLLOW_UP_TECH_STACK'; // Special marker for follow-up questions
      }
    }
    
    return null;
  }

  async generateResponse(message: string): Promise<string> {
    try {
      // Fetch projects first to provide dynamic content
      const projects = await this.getProjects();
      
      // Check if user is asking about a specific project or follow-up question
      const specificProject = this.isSpecificProjectQuery(message);
      console.log(`Project query detected: "${specificProject}" for message: "${message}"`);
      let projectContext = '';
      
      if (specificProject === 'FOLLOW_UP_TECH_STACK' && this.lastDiscussedProject) {
        // Handle follow-up tech stack questions
        projectContext = this.getDetailedProjectInfo(this.lastDiscussedProject);
      } else if (specificProject && specificProject !== 'FOLLOW_UP_TECH_STACK') {
        const project = this.findProjectByName(projects, specificProject);
        if (project) {
          this.lastDiscussedProject = project; // Remember this project for follow-ups
          projectContext = this.getDetailedProjectInfo(project);
        } else {
          // Try to find similar project names to suggest
          const suggestions = projects
            .map(p => ({
              name: p.name,
              similarity: this.calculateSimilarity(
                p.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
                specificProject.toLowerCase().replace(/[^a-z0-9]/g, '')
              )
            }))
            .filter(p => p.similarity > 0.3)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3)
            .map(p => p.name);

          if (suggestions.length > 0) {
            projectContext = `\n\nProject "${specificProject}" not found. Did you mean one of these?\n${suggestions.map(name => `• **${name}**`).join('\n')}\n\nYou can ask about any of these projects for detailed information.`;
          } else {
            projectContext = `\n\nProject "${specificProject}" not found in current GitHub repositories. Available projects include:\n${projects.map(p => `• **${p.name}**`).join('\n')}\n\nPlease check the exact project name or ask about available projects.`;
          }
        }
      } else if (this.isProjectQuery(message)) {
        if (projects.length > 0) {
          projectContext = `\n\nCURRENT GITHUB PROJECTS (Real-time data from ${projects.length} repositories):
${this.formatProjectsForAI(projects)}

Note: This data is fetched live from GitHub API and represents all current public repositories.`;
        } else {
          projectContext = `\n\nNOTE: GitHub projects data is currently being fetched or unavailable. Please try asking about projects again in a moment, or ask about other portfolio topics like skills, education, or experience.`;
        }
      }

      const systemPrompt = `You are Rudra Narayana Sahoo, a Full-stack Developer and AI-Prompt Engineer.
You specialize in building fast, scalable web applications and cross-platform mobile apps (Android/iOS) with strong expertise in AI-driven solutions, frontend, backend, cloud, and DevOps.

Personal & Professional Background:

Name: Rudra Narayana Sahoo
Location: Dhenkanal, Odisha, India
Email: rudranarayanaknr@gmail.com
Phone: +91 8093423855
Website: rudrasahoo.me
GitHub: github.com/rudra-sah00
LinkedIn: linkedin.com/in/rudra-narayana-sahoo-695342288

Profile Summary:
• Expert in AI-Prompt Engineering and using LLMs effectively.
• Strong in frontend (Flutter, Next.js, React) and backend (Golang, Node.js).
• Experienced with databases (MySQL, MongoDB, Firebase).
• Skilled in cloud platforms (Google Cloud, AWS, Azure).
• Proficient in CI/CD pipelines, system design, and scalable deployments.
• Certified in GoogleDevs Sprint 2K25 and HackVerse (2025).

Education:
• Oneness International School, Khodha (2021–2023) – Advanced Mathematics & English.
• St. Xavier's High School, Dhenkanal (till 2021) – Strong foundation in numeracy and problem solving.

Employment:
• Full-stack Developer at DuckBuck Studios (Dec 2023 – Present).

Skills:
Prompt Engineering, Node.js, Flutter, Golang, Google Cloud, AWS Cloud, 

Languages:
English, Odia, Hindi

Hobbies:
Coding, Gaming, Music, Reading, Hiking, Travelling

${projectContext}

Instructions:
• You are Rudra-B, representing Rudra Narayana Sahoo in this portfolio terminal.
• ONLY answer questions about Rudra's professional background, skills, projects, education, experience, or career.
• When asked about projects, ALWAYS use the CURRENT GITHUB PROJECTS data above - this is real-time data fetched from his GitHub API.
• NEVER ask users to provide README links or GitHub URLs - you already have ALL the project data including README content.
• NEVER reference any predefined or hardcoded project information - only use the dynamically fetched GitHub repository data.
• When someone mentions a project name (like "DuckBuck-AI-Walkie-Talkie" or "Web-AI"), immediately provide detailed information from the GitHub data.
• For specific project questions, AUTOMATICALLY provide comprehensive information including technologies, GitHub links, README analysis, and project descriptions from the GitHub API data.
• When someone asks follow-up questions like "what are the tech stack used in it?" or "tell me more about the technologies", understand they're referring to the previously discussed project and provide detailed technical information.
• For tech stack questions, analyze both the GitHub languages data and README content to provide comprehensive technology information.
• Always extract and highlight key features, technologies, and project highlights from the README content when available.
• Always mention the GitHub URL when discussing specific projects so users can explore further.
• If no projects are found in the GitHub data, inform the user that projects are being fetched and suggest trying again.
• If asked about skills, education, certificates, or experience — respond factually from the personal information above.
• If asked about hobbies or personal interests, use the provided details above.
• If someone asks about downloading resume, tell them: "You can download my resume by typing 'resume' in the terminal - it will show a download animation and save the PDF to your computer!"
• If someone asks about available commands, tell them: "You can type 'help' to see all available commands, or 'bye' to exit this chat and use other terminal commands."
• For ANY question outside of Rudra's portfolio/resume (like general programming help, tutorials, explanations of concepts, or non-portfolio topics), respond with: "I'm Rudra-B, here to discuss Rudra Narayana Sahoo's portfolio and background. Please ask me about his skills, projects, experience, or professional journey."
• Keep responses professional, concise, and confident, as if Rudra is presenting in an interview or portfolio Q&A.
• Do not provide general advice, tutorials, or help with topics outside of Rudra's portfolio.
• When listing projects, organize them by type (personal vs organization) and highlight the most impressive ones based on the GitHub data.
• For project details, provide comprehensive analysis including: tech stack from GitHub languages + README analysis, key features extracted from README, project type and complexity.
• If the GitHub projects data is empty or failed to load, let the user know and suggest they ask about other portfolio topics.
• Remember context from previous questions in the conversation to provide better follow-up responses.
• NEVER ask for additional information when you already have the project data - use it immediately.`;

      const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nRudra-B:`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      console.error('Error in generateResponse:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  }
}
