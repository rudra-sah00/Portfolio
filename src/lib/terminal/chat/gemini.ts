import { GitHubRepo } from "@/types";

export class GeminiAPI {
  private apiRoute = "/api/chat"; // Use server-side API route

  constructor(_apiKey?: string, _fallbackApiKey?: string) {
    // API keys are now handled server-side for security
    console.log("Gemini API client initialized - using server-side API route");
  }

  private generateTechStackAnalysis(repositories: GitHubRepo[]): string {
    if (!repositories || repositories.length === 0) {
      return `Tech Stack & Skills Analysis:
• Frontend: React, Next.js, TypeScript, JavaScript, HTML, CSS, TailwindCSS, Flutter (Dart)
• Backend: Node.js, Golang (Gin), Python, Express.js
• Databases: PostgreSQL, MongoDB, MySQL, Firebase, Redis
• Cloud & DevOps: Google Cloud Run, AWS, Azure, Firebase, Docker, CI/CD
• AI/ML: TensorFlow, YOLOv8, Computer Vision, Prompt Engineering
• Mobile: Flutter (Android/iOS cross-platform)
• Tools: Git, VS Code, Postman, Docker`;
    }

    // Analyze languages from all repositories
    const languageStats: Record<string, number> = {};
    const totalRepos = repositories.length;

    repositories.forEach((repo) => {
      if (repo.languages) {
        Object.keys(repo.languages).forEach((lang) => {
          languageStats[lang] = (languageStats[lang] || 0) + 1;
        });
      }
    });

    // Calculate percentages and sort by usage
    const sortedLanguages = Object.entries(languageStats)
      .map(([lang, count]) => ({
        language: lang,
        percentage: Math.round((count / totalRepos) * 100),
        count,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const topLanguages = sortedLanguages.slice(0, 8);

    const techStackSection = `Tech Stack & Skills Analysis (Based on ${totalRepos} GitHub Projects):

Primary Languages & Frameworks:
${topLanguages
  .map(
    ({ language, percentage, count }) =>
      `• ${language}: ${percentage}% proficiency (used in ${count}/${totalRepos} projects)`
  )
  .join("\n")}

Technology Categories:
• Frontend: React, Next.js, TypeScript, JavaScript, HTML, CSS, TailwindCSS, Flutter
• Backend: Node.js, Golang, Python, Express.js, API Development
• Mobile: Flutter (Android/iOS cross-platform development)
• Databases: PostgreSQL, MongoDB, MySQL, Firebase, Redis
• Cloud & DevOps: Google Cloud Run, AWS, Azure, Firebase, Docker, CI/CD
• AI/ML: TensorFlow, YOLOv8, Computer Vision, Prompt Engineering
• Tools: Git, VS Code, Postman, Docker, Terminal/CLI`;

    return techStackSection;
  }

  private generateProjectsSection(repositories: GitHubRepo[]): string {
    if (!repositories || repositories.length === 0) {
      return `Projects:
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
   • Backend: Python inference engine + APIs.`;
    }

    const projectsList = repositories
      .map((repo, index) => {
        const languages = repo.languages
          ? Object.keys(repo.languages).join(", ")
          : "Not specified";
        const description = repo.description || "No description available";

        return `${index + 1}. ${repo.name}
   • ${description}
   • Languages: ${languages}
   • GitHub: ${repo.html_url}`;
      })
      .join("\n\n");

    return `Projects:\n${projectsList}`;
  }

  private findProjectByName(
    repositories: GitHubRepo[],
    projectName: string
  ): GitHubRepo | null {
    if (!repositories || repositories.length === 0) return null;

    const searchTerm = projectName.toLowerCase();
    return (
      repositories.find(
        (repo) =>
          repo.name.toLowerCase().includes(searchTerm) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchTerm))
      ) || null
    );
  }

  private generateProjectDetails(repo: GitHubRepo): string {
    const languages = repo.languages
      ? Object.keys(repo.languages).join(", ")
      : "Not specified";
    const readmePreview = repo.readme_content
      ? repo.readme_content.substring(0, 1500) +
        (repo.readme_content.length > 1500 ? "..." : "")
      : "No README available";

    return `
DETAILED PROJECT INFORMATION FOR: ${repo.name}

Description: ${repo.description || "No description available"}
Languages/Tech Stack: ${languages}
GitHub URL: ${repo.html_url}

README Content:
${readmePreview}

Use this detailed information to provide comprehensive answers about this specific project.`;
  }

  async sendMessage(
    message: string,
    repositories: GitHubRepo[] = []
  ): Promise<string> {
    try {
      // Check if the user is asking about a specific project
      let specificProjectDetails = "";
      if (repositories && repositories.length > 0) {
        const messageWords = message.toLowerCase().split(/\s+/);

        // Check for exact matches first
        for (const repo of repositories) {
          if (
            messageWords.some(
              (word) =>
                repo.name.toLowerCase().includes(word) ||
                word.includes(repo.name.toLowerCase())
            )
          ) {
            specificProjectDetails = this.generateProjectDetails(repo);
            break;
          }
        }

        // Also check for partial matches with project names
        if (!specificProjectDetails) {
          for (const repo of repositories) {
            const repoWords = repo.name.toLowerCase().split(/[-_\s]+/);
            if (
              repoWords.some((repoWord) =>
                messageWords.some(
                  (msgWord) =>
                    msgWord.includes(repoWord) || repoWord.includes(msgWord)
                )
              )
            ) {
              specificProjectDetails = this.generateProjectDetails(repo);
              break;
            }
          }
        }
      }

      const projectsSection = this.generateProjectsSection(repositories);
      const techStackAnalysis = this.generateTechStackAnalysis(repositories);

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

${projectsSection}

${techStackAnalysis}

${specificProjectDetails}

Languages:
English, Odia, Hindi

Hobbies:
Coding, Gaming, Music, Reading, Hiking, Travelling

Instructions:
• You are Rudra-B, representing Rudra Narayana Sahoo in this portfolio terminal.
• ONLY answer questions about Rudra's professional background, skills, projects, education, experience, or career.
• When asked about skills, tech stack, or programming languages, use the detailed Tech Stack Analysis provided above which shows real data from GitHub repositories.
• When asked about tech stack percentages or which languages/technologies I'm good at, refer to the percentage data in the Tech Stack Analysis.
• If asked about projects, education, certificates, or experience — respond factually from the information above.
• If asked about hobbies or personal interests, use the provided details above.
• When discussing specific projects and detailed project information is available, use the README content and project details to provide comprehensive, technical explanations.
• If someone asks about downloading resume, tell them: "You can download my resume by typing 'resume' in the terminal - it will show a download animation and save the PDF to your computer!"
• If someone asks about available commands, tell them: "You can type 'help' to see all available commands, or 'bye' to exit this chat and use other terminal commands."
• For ANY question outside of Rudra's portfolio/resume (like general programming help, tutorials, explanations of concepts, or non-portfolio topics), respond with: "I'm Rudra-B, here to discuss Rudra Narayana Sahoo's portfolio and background. Please ask me about his skills, projects, experience, or professional journey."
• Keep responses professional, concise, and confident, as if Rudra is presenting in an interview or portfolio Q&A.
• Do not provide general advice, tutorials, or help with topics outside of Rudra's portfolio.`;

      // Call server-side API route
      const response = await fetch(this.apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          systemPrompt,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || `API request failed: ${response.status}`
        );
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Gemini API error:", error);
      return "Sorry, I encountered an error while processing your request. Please try again.";
    }
  }
}
