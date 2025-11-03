import { ChatSession } from "./chat/types";
import { GitHubRepo } from "../../types";

export interface ContactForm {
  step: number;
  name: string;
  contactOption: string;
  contactDetails: string;
  message: string;
}

export interface PasswordPrompt {
  isActive: boolean;
  command: string;
  expectedPassword: string;
}

export interface TerminalState {
  isRoot: boolean;
  currentPath: string;
  prompt: string;
  theme: {
    promptColor: string;
    textColor: string;
    errorColor: string;
    successColor: string;
  };
  chatSession?: ChatSession;
  contactForm?: ContactForm;
  completedContactForm?: ContactForm;
  passwordPrompt?: PasswordPrompt;
  isTyping: boolean;
}

export interface CommandResult {
  output: string[];
  newState?: Partial<TerminalState>;
  clear?: boolean;
  startTyping?: boolean;
  startDownload?: boolean;
  startSubmitting?: boolean;
  delayedOutput?: {
    content: string[];
    delay: number;
  };
}

export interface Command {
  name: string;
  description: string;
  execute: (
    args: string[],
    state: TerminalState,
    repositories?: GitHubRepo[]
  ) => CommandResult | Promise<CommandResult>;
}
