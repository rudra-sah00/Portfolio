import { Command, CommandResult, TerminalState } from "../types";
import { getRootState, getUserState, getGeminiChatState } from "../state";
import { getAgentById, ChatSession } from "../chat/types";
import { GitHubRepo } from "../../../types";

export const rootCommand: Command = {
  name: "root",
  description: "Switch to root user",
  execute: (args: string[], state: TerminalState): CommandResult => {
    if (state.isRoot) {
      return {
        output: ["Already in root mode"],
        newState: getRootState(),
      };
    }

    return {
      output: ["Switching to root user...", "⚠️  You now have root privileges"],
      newState: getRootState(),
    };
  },
};

export const helpCommand: Command = {
  name: "help",
  description: "Show available commands",
  execute: (args: string[], state: TerminalState): CommandResult => {
    const commands = [
      '<span class="text-cyan-400 font-bold">Available commands:</span>',
      "",
      '  <span class="text-yellow-300">help</span>      - <span class="text-gray-300">Show this help message</span>',
      '  <span class="text-yellow-300">projects</span>  - <span class="text-gray-300">List all GitHub projects</span>',
      '  <span class="text-yellow-300">resume</span>    - <span class="text-gray-300">Download resume PDF</span>',
      '  <span class="text-yellow-300">code</span>      - <span class="text-gray-300">Download project files</span>',
      '  <span class="text-yellow-300">chat</span>      - <span class="text-gray-300">Start chat with Rudra-B</span>',
      '  <span class="text-yellow-300">contact</span>   - <span class="text-gray-300">Contact form to reach out</span>',
      '  <span class="text-yellow-300">home</span>      - <span class="text-gray-300">Return to home directory</span>',
      '  <span class="text-yellow-300">root</span>      - <span class="text-gray-300">Switch to root user</span>',
      '  <span class="text-yellow-300">clear</span>     - <span class="text-gray-300">Clear terminal</span>',
    ];

    // Add root-only commands if user is in root mode
    if (state.isRoot) {
      commands.push(
        "",
        '<span class="text-red-400 font-bold">Root-only commands:</span>',
        '  <span class="text-red-300">play</span>       - <span class="text-orange-300">🚧 Coming soon...</span>',
        '  <span class="text-red-300">schedule</span>   - <span class="text-orange-300">🚧 Coming soon...</span>'
      );
    }

    commands.push(
      "",
      '<span class="text-purple-400">Navigation:</span>',
      '  <span class="text-green-300">↑/↓</span>       - <span class="text-gray-300">Command history</span>'
    );

    return {
      output: commands,
    };
  },
};

export const codeCommand: Command = {
  name: "code",
  description: "Download project files automatically",
  execute: (): CommandResult => {
    const files = [
      "New Doc X.txt",
      "New Text 1.txt",
      "New Text 2.txt",
      "New Text.txt",
    ];

    const downloadingAnimation = [
      '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
      '<span class="text-cyan-400">║</span>                  <span class="text-yellow-300 font-bold">AUTO DOWNLOAD FILES</span>                         <span class="text-cyan-400">║</span>',
      '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
      "",
      '<span class="text-green-400">📦 Initializing automatic file download...</span>',
      "",
      '<span class="text-blue-300">┌─────────────────────────────────────────────────────────────┐</span>',
      '<span class="text-blue-300">│</span> <span class="text-yellow-300">Target:</span> <span class="text-white">New Folder/</span>                                     <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span> <span class="text-cyan-300">Files:</span> <span class="text-white">' +
        files.length +
        ' files</span>                                             <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span> <span class="text-cyan-300">Status:</span> <span class="text-yellow-400">Preparing download...</span>                        <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span>                                                             <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span> <span class="text-gray-500">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span>     <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span> <span class="text-yellow-400">0%</span> <span class="text-gray-400">Connecting to server...</span>                          <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">└─────────────────────────────────────────────────────────────┘</span>',
      "",
      '<span class="text-purple-300">📋 Files to download:</span>',
      ...files.map(
        (file) =>
          `   <span class="text-green-400">✓</span> <span class="text-white">${file}</span>`
      ),
      "",
      '<span class="text-gray-400">💡 Files will be downloaded to your Downloads folder</span>',
      "",
    ];

    return {
      output: downloadingAnimation,
      startDownload: true,
    };
  },
};

export const resumeCommand: Command = {
  name: "resume",
  description: "Download resume PDF",
  execute: (): CommandResult => {
    const downloadingAnimation = [
      '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
      '<span class="text-cyan-400">║</span>                    <span class="text-yellow-300 font-bold">RESUME DOWNLOAD</span>                           <span class="text-cyan-400">║</span>',
      '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
      "",
      '<span class="text-green-400">📄 Initializing download...</span>',
      "",
      '<span class="text-blue-300">┌─────────────────────────────────────────────────────────────┐</span>',
      '<span class="text-blue-300">│</span> <span class="text-yellow-300">File:</span> <span class="text-white">resume_rns.pdf</span>                                      <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span> <span class="text-cyan-300">Status:</span> <span class="text-yellow-400">Connecting...</span>                               <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span>                                                             <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span> <span class="text-gray-500">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span>     <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span> <span class="text-yellow-400">0%</span> <span class="text-gray-400">Preparing...</span>                                        <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">└─────────────────────────────────────────────────────────────┘</span>',
      "",
    ];

    return {
      output: downloadingAnimation,
      startDownload: true,
    };
  },
};

export const clearCommand: Command = {
  name: "clear",
  description: "Clear terminal screen",
  execute: (): CommandResult => {
    return {
      output: [],
      clear: true,
    };
  },
};

export const aiChatCommand: Command = {
  name: "chat",
  description: "Start chat with Rudra-B",
  execute: (): CommandResult => {
    const agent = getAgentById("rudra-b");

    if (!agent) {
      return {
        output: ["Error: AI not available"],
      };
    }

    const chatSession: ChatSession = {
      agent,
      messages: [],
      isActive: true,
    };

    const welcomeMessage = [
      '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
      '<span class="text-cyan-400">║</span>                      <span class="text-yellow-300 font-bold">RUDRA-B CHAT</span>                             <span class="text-cyan-400">║</span>',
      '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
      "",
      '<span class="text-green-400">🤖 Rudra-B is now online and ready to discuss my portfolio!</span>',
      "",
      '<span class="text-cyan-300">💬 What you can ask about:</span>',
      '<span class="text-yellow-200">  • My technical skills and experience</span>',
      '<span class="text-yellow-200">  • Projects I\'ve worked on</span>',
      '<span class="text-yellow-200">  • Education and background</span>',
      '<span class="text-yellow-200">  • Professional journey and goals</span>',
      '<span class="text-yellow-200">  • Type bye to exit chat session</span>',
      "",
      '<span class="text-purple-300">What would you like to know about Rudra Narayana Sahoo?</span>',
      "",
    ];

    return {
      output: welcomeMessage,
      newState: {
        ...getGeminiChatState(),
        chatSession,
      },
    };
  },
};

export const homeCommand: Command = {
  name: "home",
  description: "Return to home directory",
  execute: (args: string[], state: TerminalState): CommandResult => {
    if (state.currentPath === "~" && !state.isRoot) {
      return {
        output: ["Already in home directory"],
      };
    }

    return {
      output: ["Returning to home directory...", "🏠 Welcome back home!"],
      newState: getUserState(),
    };
  },
};

export const byeCommand: Command = {
  name: "bye",
  description: "Exit current chat session",
  execute: (args: string[], state: TerminalState): CommandResult => {
    if (!state.chatSession || !state.chatSession.isActive) {
      return {
        output: ["No active chat session to exit."],
      };
    }

    return {
      output: [
        `<span class="text-yellow-300">👋</span> <span class="text-red-300">Exiting chat with ${state.chatSession.agent.name}</span>`,
        '<span class="text-blue-300">Returning to home directory...</span>',
        '<span class="text-green-400">🏠 Welcome back home!</span>',
      ],
      newState: {
        ...getUserState(),
        chatSession: undefined,
      },
    };
  },
};

export const contactCommand: Command = {
  name: "contact",
  description: "Contact form to reach out to Rudra",
  execute: (args: string[], state: TerminalState): CommandResult => {
    const welcomeMessage = [
      '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
      '<span class="text-cyan-400">║</span>                      <span class="text-yellow-300 font-bold">CONTACT FORM</span>                             <span class="text-cyan-400">║</span>',
      '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
      "",
      "<span class=\"text-green-400\">📧 I'd love to hear from you! Let's get in touch.</span>",
      "",
      '<span class="text-purple-300">Please provide the following information:</span>',
      '<span class="text-yellow-200">  • Type "exit" anytime to cancel the contact form</span>',
      "",
      '<span class="text-cyan-300">Step 1/4: What is your name?</span>',
      "",
    ];

    return {
      output: welcomeMessage,
      newState: {
        ...state,
        contactForm: {
          step: 1,
          name: "",
          contactOption: "",
          contactDetails: "",
          message: "",
        },
      },
    };
  },
};

export const exitContactCommand: Command = {
  name: "exit",
  description: "Exit contact form",
  execute: (args: string[], state: TerminalState): CommandResult => {
    if (!state.contactForm) {
      return {
        output: ["No contact form to exit."],
      };
    }

    return {
      output: [
        '<span class="text-yellow-300">❌ Contact form cancelled.</span>',
        '<span class="text-blue-300">Returning to home directory...</span>',
        '<span class="text-green-400">🏠 Welcome back home!</span>',
      ],
      newState: {
        ...getUserState(),
        contactForm: undefined,
      },
    };
  },
};

export const playCommand: Command = {
  name: "play",
  description: "Root-only entertainment features",
  execute: (args: string[], state: TerminalState): CommandResult => {
    if (!state.isRoot) {
      return {
        output: [
          '<span class="text-red-400">❌ Access denied</span>',
          '<span class="text-yellow-400">This command requires root privileges</span>',
          '<span class="text-gray-400">Use root to switch to root user</span>',
        ],
      };
    }

    return {
      output: [
        '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
        '<span class="text-cyan-400">║</span>                      <span class="text-yellow-300 font-bold">PLAY COMMAND</span>                              <span class="text-cyan-400">║</span>',
        '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
        "",
        '<span class="text-orange-300">🚧 This feature is coming soon!</span>',
        "",
        '<span class="text-purple-300">Planned features:</span>',
        '<span class="text-yellow-200">  • Terminal games</span>',
        '<span class="text-yellow-200">  • Interactive demos</span>',
        '<span class="text-yellow-200">  • Easter eggs</span>',
        "",
        '<span class="text-gray-400">Stay tuned for updates...</span>',
        "",
      ],
    };
  },
};

export const scheduleCommand: Command = {
  name: "schedule",
  description: "Root-only scheduling features",
  execute: (args: string[], state: TerminalState): CommandResult => {
    if (!state.isRoot) {
      return {
        output: [
          '<span class="text-red-400">❌ Access denied</span>',
          '<span class="text-yellow-400">This command requires root privileges</span>',
          '<span class="text-gray-400">Use root to switch to root user</span>',
        ],
      };
    }

    return {
      output: [
        '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
        '<span class="text-cyan-400">║</span>                    <span class="text-yellow-300 font-bold">SCHEDULE COMMAND</span>                           <span class="text-cyan-400">║</span>',
        '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
        "",
        '<span class="text-orange-300">🚧 This feature is coming soon!</span>',
        "",
        '<span class="text-purple-300">Planned features:</span>',
        '<span class="text-yellow-200">  • Meeting scheduler</span>',
        '<span class="text-yellow-200">  • Calendar integration</span>',
        '<span class="text-yellow-200">  • Availability checker</span>',
        "",
        '<span class="text-gray-400">Stay tuned for updates...</span>',
        "",
      ],
    };
  },
};

export const projectsCommand: Command = {
  name: "projects",
  description: "List all GitHub projects",
  execute: (
    args: string[],
    state: TerminalState,
    repositories?: GitHubRepo[]
  ): CommandResult => {
    if (!repositories || repositories.length === 0) {
      return {
        output: [
          '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
          '<span class="text-cyan-400">║</span>                      <span class="text-yellow-300 font-bold">MY PROJECTS</span>                             <span class="text-cyan-400">║</span>',
          '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
          "",
          '<span class="text-orange-300">🔄 Loading projects from GitHub...</span>',
          '<span class="text-gray-400">Please wait while repositories are being fetched.</span>',
          "",
        ],
      };
    }

    const projectsList = repositories
      .map((repo, index) => {
        const languages = repo.languages
          ? Object.keys(repo.languages).slice(0, 3).join(", ")
          : "N/A";
        const description = repo.description || "No description available";

        return [
          `<span class="text-green-400">${index + 1}. ${repo.name}</span>`,
          `   <span class="text-gray-300">${description}</span>`,
          `   <span class="text-blue-300">Languages:</span> <span class="text-yellow-200">${languages}</span>`,
          `   <span class="text-blue-300">GitHub:</span> <span class="text-purple-300">${repo.html_url}</span>`,
          "",
        ];
      })
      .flat();

    return {
      output: [
        '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
        '<span class="text-cyan-400">║</span>                      <span class="text-yellow-300 font-bold">MY PROJECTS</span>                             <span class="text-cyan-400">║</span>',
        '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
        "",
        `<span class="text-green-300">📊 Found ${repositories.length} repositories:</span>`,
        "",
        ...projectsList,
        '<span class="text-gray-400">💡 Ask Rudra-B about any specific project by typing "!chat" first!</span>',
        "",
      ],
    };
  },
};
