import { Command, CommandResult, TerminalState, ContactForm } from "./types";
import { createInitialState, getRootState } from "./state";
import {
  rootCommand,
  helpCommand,
  resumeCommand,
  codeCommand,
  clearCommand,
  aiChatCommand,
  homeCommand,
  byeCommand,
  contactCommand,
  exitContactCommand,
  playCommand,
  scheduleCommand,
  projectsCommand,
} from "./commands";
import { GeminiAPI } from "./chat/gemini";
import { GitHubRepo } from "@/types";

// Initialize Gemini API (keys are handled server-side)
const geminiAPI = new GeminiAPI();

export class TerminalEngine {
  private commands: Map<string, Command> = new Map();
  private state: TerminalState;
  public repositories: GitHubRepo[] = [];

  constructor() {
    this.state = createInitialState();
    this.registerCommands();
  }

  public setRepositories(repos: GitHubRepo[]): void {
    this.repositories = repos;
  }

  public getRepositories(): GitHubRepo[] {
    return this.repositories;
  }

  private registerCommands(): void {
    const commands = [
      rootCommand,
      helpCommand,
      resumeCommand,
      codeCommand,
      clearCommand,
      aiChatCommand,
      homeCommand,
      byeCommand,
      contactCommand,
      exitContactCommand,
      playCommand,
      scheduleCommand,
      projectsCommand,
    ];
    commands.forEach((cmd) => {
      this.commands.set(cmd.name, cmd);
    });
  }

  private handlePasswordPrompt(
    trimmedInput: string
  ): CommandResult | undefined {
    if (!this.state.passwordPrompt || !this.state.passwordPrompt.isActive) {
      return undefined;
    }

    const prompt = this.state.passwordPrompt;

    if (trimmedInput === prompt.expectedPassword) {
      // Password correct
      if (prompt.command === "root") {
        this.state.passwordPrompt = undefined;
        const result = {
          output: [
            '<span class="text-green-400">✅ Authentication successful</span>',
            "Switching to root user...",
            "⚠️  You now have root privileges",
          ],
          newState: getRootState(),
        };
        this.state = { ...this.state, ...result.newState };
        return result;
      }
    } else {
      // Password incorrect
      this.state.passwordPrompt = undefined;
      return {
        output: [
          '<span class="text-red-400">❌ Authentication failed</span>',
          '<span class="text-red-300">su: Authentication failure</span>',
          '<span class="text-gray-400">Incorrect password</span>',
        ],
      };
    }
  }

  private async handleContactFormStep(
    trimmedInput: string,
    args: string[]
  ): Promise<CommandResult | undefined> {
    if (!this.state.contactForm) {
      return undefined;
    }

    // Check if user wants to exit
    if (trimmedInput === "exit") {
      const command = this.commands.get("exit");
      if (command) {
        const result = await command.execute(args, this.state);
        if (result.newState) {
          this.state = { ...this.state, ...result.newState };
        }
        return result;
      }
    }

    const contactForm = this.state.contactForm;

    if (contactForm.step === 1) {
      return this.handleContactStep1(trimmedInput, contactForm);
    } else if (contactForm.step === 2) {
      return this.handleContactStep2(trimmedInput, contactForm);
    } else if (contactForm.step === 3) {
      return this.handleContactStep3(trimmedInput, contactForm);
    } else if (contactForm.step === 4) {
      return this.handleContactStep4(trimmedInput, contactForm);
    }
  }

  private handleContactStep1(
    trimmedInput: string,
    contactForm: ContactForm
  ): CommandResult {
    this.state.contactForm = {
      ...contactForm,
      name: trimmedInput,
      step: 2,
    };

    return {
      output: [
        `<span class="text-green-400">✓</span> <span class="text-cyan-300">Name:</span> <span class="text-white">${trimmedInput}</span>`,
        "",
        '<span class="text-cyan-300">Step 2/4: What is your preferred contact method?</span>',
        '<span class="text-yellow-200">  (e.g., email, LinkedIn, phone, WhatsApp)</span>',
        "",
      ],
    };
  }

  private handleContactStep2(
    trimmedInput: string,
    contactForm: ContactForm
  ): CommandResult {
    this.state.contactForm = {
      ...contactForm,
      contactOption: trimmedInput,
      step: 3,
    };

    const contactPrompt = this.getContactPrompt(trimmedInput);

    return {
      output: [
        `<span class="text-green-400">✓</span> <span class="text-cyan-300">Contact Method:</span> <span class="text-white">${trimmedInput}</span>`,
        "",
        `<span class="text-cyan-300">Step 3/4: ${contactPrompt}</span>`,
        '<span class="text-yellow-200">  (Please share your contact details)</span>',
        "",
      ],
    };
  }

  private getContactPrompt(input: string): string {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("email")) {
      return "Please provide your email address:";
    } else if (lowerInput.includes("linkedin")) {
      return "Please provide your LinkedIn profile URL or username:";
    } else if (lowerInput.includes("phone")) {
      return "Please provide your phone number:";
    } else if (lowerInput.includes("whatsapp")) {
      return "Please provide your WhatsApp number:";
    }
    return `Please provide your ${input} details:`;
  }

  private handleContactStep3(
    trimmedInput: string,
    contactForm: ContactForm
  ): CommandResult {
    this.state.contactForm = {
      ...contactForm,
      contactDetails: trimmedInput,
      step: 4,
    };

    return {
      output: [
        `<span class="text-green-400">✓</span> <span class="text-cyan-300">Contact Details:</span> <span class="text-white">${trimmedInput}</span>`,
        "",
        '<span class="text-cyan-300">Step 4/4: What\'s your message?</span>',
        '<span class="text-yellow-200">  (Tell me what you\'d like to discuss)</span>',
        "",
      ],
    };
  }

  private handleContactStep4(
    trimmedInput: string,
    contactForm: ContactForm
  ): CommandResult {
    const submittingAnimation = [
      `<span class="text-green-400">✓</span> <span class="text-cyan-300">Message:</span> <span class="text-white">${trimmedInput}</span>`,
      "",
      '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
      '<span class="text-cyan-400">║</span>                    <span class="text-yellow-300 font-bold">SUBMITTING CONTACT</span>                        <span class="text-cyan-400">║</span>',
      '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
      "",
      '<span class="text-green-400">📤 Processing your contact request...</span>',
      "",
      '<span class="text-blue-300">┌─────────────────────────────────────────────────────────────┐</span>',
      '<span class="text-blue-300">│</span> <span class="text-yellow-300">Status:</span> <span class="text-yellow-400">Preparing submission...</span>                      <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span>                                                             <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span> <span class="text-gray-500">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span>     <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">│</span> <span class="text-yellow-400">0%</span> <span class="text-gray-400">Initializing...</span>                                    <span class="text-blue-300">│</span>',
      '<span class="text-blue-300">└─────────────────────────────────────────────────────────────┘</span>',
      "",
    ];

    const completedForm = {
      ...contactForm,
      message: trimmedInput,
    };

    this.state.contactForm = undefined;
    this.state.completedContactForm = completedForm;
    this.sendContactEmail(completedForm);

    return {
      output: submittingAnimation,
      startSubmitting: true,
    };
  }

  private async handleChatMessage(
    trimmedInput: string
  ): Promise<CommandResult> {
    if (this.state.chatSession?.agent.id === "rudra-b") {
      try {
        const response = await geminiAPI.sendMessage(
          trimmedInput,
          this.repositories
        );

        this.state.chatSession.messages.push(
          {
            role: "user",
            content: trimmedInput,
            timestamp: new Date(),
          },
          {
            role: "assistant",
            content: response,
            timestamp: new Date(),
          }
        );

        return {
          output: [`🤖 Rudra-B: ${response}`],
        };
      } catch {
        return {
          output: [
            "Sorry, I encountered an error while processing your request.",
            "Please try again.",
          ],
        };
      }
    }
    return { output: [] };
  }

  public async executeCommand(input: string): Promise<CommandResult> {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return { output: [] };
    }

    const parts = trimmedInput.split(" ");
    const commandName = parts[0];
    const args = parts.slice(1);

    // Handle password prompt
    const passwordResult = this.handlePasswordPrompt(trimmedInput);
    if (passwordResult) {
      return passwordResult;
    }

    // Handle contact form flow
    const contactResult = await this.handleContactFormStep(trimmedInput, args);
    if (contactResult) {
      return contactResult;
    }

    // Check if we're in chat mode and it's not a special command
    if (
      this.state.chatSession &&
      this.state.chatSession.isActive &&
      !trimmedInput.startsWith("/") &&
      !trimmedInput.startsWith("!") &&
      commandName !== "clear" &&
      commandName !== "bye"
    ) {
      return this.handleChatMessage(trimmedInput);
    }

    const command = this.commands.get(commandName);

    // If in chat mode, check if it's the bye command first
    if (this.state.chatSession && this.state.chatSession.isActive) {
      if (commandName === "bye") {
        // Execute bye command to exit chat mode
        if (command) {
          const result = await command.execute(args, this.state);
          if (result.newState) {
            this.state = { ...this.state, ...result.newState };
          }
          return result;
        }
      } else if (commandName !== "clear") {
        // For any other command except clear, show chat mode warning
        return {
          output: [
            '<span class="text-yellow-400">⚠️  Chat mode is active!</span>',
            '<span class="text-cyan-300">• Send direct messages to chat with Rudra-B</span>',
            '<span class="text-cyan-300">• Type <span class="text-red-400">bye</span> to exit chat and use other commands</span>',
            "",
          ],
        };
      }
    }

    if (!command) {
      return {
        output: [
          `Command not found: ${commandName}`,
          "Type help for available commands.",
        ],
      };
    }

    // Pass repositories to projects command
    const result =
      commandName === "projects"
        ? await command.execute(args, this.state, this.repositories)
        : await command.execute(args, this.state);

    // Update state if provided
    if (result.newState) {
      this.state = { ...this.state, ...result.newState };
    }

    return result;
  }

  public getState(): TerminalState {
    return { ...this.state };
  }

  public resetState(): void {
    this.state = createInitialState();
  }

  public getPrompt(): string {
    return `${this.state.prompt}:${this.state.currentPath}$`;
  }

  public getPromptColor(): string {
    return this.state.theme.promptColor;
  }

  private async sendContactEmail(contactForm: ContactForm): Promise<void> {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactForm.name,
          contactOption: contactForm.contactOption,
          contactDetails: contactForm.contactDetails,
          message: contactForm.message,
        }),
      });

      if (!response.ok) {
        console.error("Failed to send contact email:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending contact email:", error);
    }
  }
}
