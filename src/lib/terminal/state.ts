import { TerminalState } from "./types";

export const createInitialState = (): TerminalState => ({
  isRoot: false,
  currentPath: "~",
  prompt: "rudra@portfolio",
  theme: {
    promptColor: "text-green-400",
    textColor: "text-white",
    errorColor: "text-red-400",
    successColor: "text-green-400",
  },
  chatSession: undefined,
  isTyping: false,
});

export const getRootState = (): Partial<TerminalState> => ({
  isRoot: true,
  currentPath: "/",
  prompt: "root@portfolio",
  theme: {
    promptColor: "text-red-400",
    textColor: "text-white",
    errorColor: "text-red-400",
    successColor: "text-green-400",
  },
});

export const getUserState = (): Partial<TerminalState> => ({
  isRoot: false,
  currentPath: "~",
  prompt: "rudra@portfolio",
  theme: {
    promptColor: "text-green-400",
    textColor: "text-white",
    errorColor: "text-red-400",
    successColor: "text-green-400",
  },
});

export const getGeminiChatState = (): Partial<TerminalState> => ({
  prompt: "Rudra-B",
  currentPath: "",
  theme: {
    promptColor: "text-purple-400",
    textColor: "text-white",
    errorColor: "text-red-400",
    successColor: "text-green-400",
  },
});
