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
    return projects.map(project => {
      const languages = project.languages ? Object.keys(project.languages).join(', ') : 'Not specified';
      return `
**${project.name}**
- Description: ${project.description || 'No description available'}
- Technologies: ${languages}
- GitHub URL: ${project.html_url}
- Owner: ${project.owner?.login || 'Unknown'} (${project.isOrganizationRepo ? 'Organization' : 'Personal'})`;
    }).join('\n');
  }

  private findProjectByName(projects: GitHubRepo[], projectName: string): GitHubRepo | null {
    const normalizedName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // First, try exact matches
    let project = projects.find(project => 
      project.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedName
    );
    
    if (project) return project;
    
    // Then try partial matches (contains)
    project = projects.find(project => 
      project.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalizedName) ||
      normalizedName.includes(project.name.toLowerCase().replace(/[^a-z0-9]/g, ''))
    );
    
    if (project) return project;
    
    // Finally, try description matching
    project = projects.find(project => 
      project.description && 
      project.description.toLowerCase().includes(projectName.toLowerCase())
    );
    
    return project || null;
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
      /(?:tell me about|more about|details about|about|explain|describe)\s+([a-zA-Z0-9\-_\.]+)/i,
      /(?:what is|what's)\s+([a-zA-Z0-9\-_\.]+)/i,
      /([a-zA-Z0-9\-_\.]+)\s+(?:project|repository|repo)/i,
      /(?:show me|show)\s+([a-zA-Z0-9\-_\.]+)/i,
      /(?:info on|information about)\s+([a-zA-Z0-9\-_\.]+)/i
    ];

    for (const pattern of aboutPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        // Filter out common words that aren't project names
        const commonWords = ['your', 'my', 'the', 'this', 'that', 'projects', 'work', 'code', 'github'];
        if (!commonWords.includes(match[1].toLowerCase())) {
          return match[1];
        }
      }
    }
    return null;
  }

  async generateResponse(message: string): Promise<string> {
    try {
      // Fetch projects first to provide dynamic content
      const projects = await this.getProjects();
      
      // Check if user is asking about a specific project
      const specificProject = this.isSpecificProjectQuery(message);
      let projectContext = '';
      
      if (specificProject) {
        const project = this.findProjectByName(projects, specificProject);
        if (project) {
          const languages = project.languages ? Object.keys(project.languages).join(', ') : 'Not specified';
          projectContext = `\n\nDETAILED PROJECT INFO FOR "${project.name}":
- Full Name: ${project.name}
- Description: ${project.description || 'No description available'}
- GitHub URL: ${project.html_url}
- Technologies Used: ${languages}
- Owner: ${project.owner?.login || 'Unknown'} (${project.isOrganizationRepo ? 'Organization Repository' : 'Personal Repository'})
- Project Type: ${project.isOrganizationRepo ? 'Professional/Organization Work' : 'Personal Project'}

README CONTENT:
${project.readme_content ? project.readme_content.substring(0, 1500) + '...' : 'No README available'}`;
        }
      } else if (this.isProjectQuery(message)) {
        projectContext = `\n\nCURRENT GITHUB PROJECTS (${projects.length} repositories):
${this.formatProjectsForAI(projects)}`;
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

Key Notable Projects:
1. DuckBuck Studios Full-Stack Cloud Application
   • Backend: Golang (Gin), PostgreSQL, Redis.
   • Frontend: Flutter (Dart).
   • CI/CD pipelines for automation.
   • Cloud: Google Cloud Run, Firebase, Azure services.
   • Full end-to-end ownership (architecture → release).

2. Personal Portfolio Website – rudrasahoo.me

3. A.AI: Smart Surveillance (Hackathon – Andhra Pradesh Govt.)
   • YOLOv8-based Gunny Bag Counter.
   • AI Attendance System with TensorFlow + CCTV.
   • Authorized entry detection (YOLOv8 + TensorFlow).
   • Frontend: TypeScript dashboard.
   • Backend: Python inference engine + APIs.

Skills:
Prompt Engineering, Node.js, Flutter, Golang, Google Cloud

Languages:
English, Odia, Hindi

Hobbies:
Coding, Gaming, Music, Reading, Hiking, Travelling

${projectContext}

Instructions:
• You are Rudra-B, representing Rudra Narayana Sahoo in this portfolio terminal.
• ONLY answer questions about Rudra's professional background, skills, projects, education, experience, or career.
• When asked about projects, use the CURRENT GITHUB PROJECTS data above to provide accurate, up-to-date information.
• For specific project questions, provide detailed information including technologies, GitHub links, and project descriptions.
• If someone asks about a specific project by name, provide comprehensive details including the README content and tech stack.
• Always mention the GitHub URL when discussing specific projects so users can explore further.
• If asked about skills, projects, education, certificates, or experience — respond factually from the information above.
• If asked about hobbies or personal interests, use the provided details above.
• If someone asks about downloading resume, tell them: "You can download my resume by typing 'resume' in the terminal - it will show a download animation and save the PDF to your computer!"
• If someone asks about available commands, tell them: "You can type 'help' to see all available commands, or 'bye' to exit this chat and use other terminal commands."
• For ANY question outside of Rudra's portfolio/resume (like general programming help, tutorials, explanations of concepts, or non-portfolio topics), respond with: "I'm Rudra-B, here to discuss Rudra Narayana Sahoo's portfolio and background. Please ask me about his skills, projects, experience, or professional journey."
• Keep responses professional, concise, and confident, as if Rudra is presenting in an interview or portfolio Q&A.
• Do not provide general advice, tutorials, or help with topics outside of Rudra's portfolio.
• When listing projects, organize them by type (personal vs organization) and highlight the most impressive ones.
• For project details, always include the technology stack and briefly explain what the project does.`;

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
