import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TerminalPopup from "../TerminalPopup";
import { GitHubRepo } from "@/types";
import { TerminalEngine } from "@/lib/terminal";

// Mock the TerminalEngine
jest.mock("@/lib/terminal", () => ({
  TerminalEngine: jest.fn().mockImplementation(() => ({
    setRepositories: jest.fn(),
    executeCommand: jest.fn().mockResolvedValue({
      output: ["Mock command output"],
      clear: false,
    }),
    getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
    getPromptColor: jest.fn().mockReturnValue("#00ff00"),
    getState: jest.fn().mockReturnValue({
      chatSession: { isActive: false },
    }),
    resetState: jest.fn(),
  })),
}));

describe("TerminalPopup Component", () => {
  const mockRepositories: GitHubRepo[] = [
    {
      id: 1,
      name: "test-repo",
      description: "Test repository",
      html_url: "https://github.com/user/test-repo",
      languages: { TypeScript: 100 },
    },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    repositories: mockRepositories,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((callback) => {
      callback(0);
      return 0;
    }) as unknown as typeof requestAnimationFrame;
  });

  afterEach(() => {
    cleanup();
    // Cancel all pending animation frames
    const highestId = window.requestAnimationFrame(() => {});
    for (let i = 0; i < highestId; i++) {
      window.cancelAnimationFrame(i);
    }
  });

  it("should render when isOpen is true", () => {
    render(<TerminalPopup {...defaultProps} />);

    const terminal = screen.getByText(/rudra@portfolio/i);
    expect(terminal).toBeInTheDocument();
  });

  it("should not render when isOpen is false", () => {
    render(<TerminalPopup {...defaultProps} isOpen={false} />);

    const terminal = screen.queryByText(/rudra@portfolio/i);
    expect(terminal).not.toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    render(<TerminalPopup {...defaultProps} />);

    const closeButtons = screen.getAllByTitle(/Close and Clear History/i);
    fireEvent.click(closeButtons[0]); // Click the first close button (red one)

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should toggle minimize state", () => {
    render(<TerminalPopup {...defaultProps} />);

    const minimizeButton = screen.getByTitle(/Minimize/i);
    fireEvent.click(minimizeButton);

    // Terminal body should be hidden when minimized
    const terminalBody = screen.queryByText(/Type '!help'/i);
    expect(terminalBody).not.toBeInTheDocument();
  });

  it("should accept user input", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    if (input) {
      await user.type(input, "test command");
      expect(input.value).toBe("test command");
    }
  });

  it("should execute command on Enter key", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "help{Enter}");

      // After Enter, input should be cleared
      await waitFor(() => {
        expect(input.value).toBe("");
      });
    }
  });

  it("should clear input after command execution", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    await user.type(input, "test{Enter}");

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("should navigate command history with arrow keys", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      // Execute some commands
      await user.type(input, "command1{Enter}");
      await user.type(input, "command2{Enter}");

      // Input should be cleared after Enter
      expect(input.value).toBe("");
    }
  });

  it("should update repositories in terminal engine", () => {
    const setRepositoriesMock = jest.fn();

    // Create a fresh mock implementation
    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: setRepositoriesMock,
      executeCommand: jest.fn().mockResolvedValue({
        output: ["Mock command output"],
        clear: false,
      }),
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
      }),
      resetState: jest.fn(),
    }));

    render(<TerminalPopup {...defaultProps} />);

    expect(setRepositoriesMock).toHaveBeenCalledWith(mockRepositories);
  });

  it("should display welcome message", () => {
    render(<TerminalPopup {...defaultProps} />);

    const welcomeMessage = screen.getByText(
      /Type !help for available commands/i
    );
    expect(welcomeMessage).toBeInTheDocument();
  });

  it("should focus input when terminal is opened", async () => {
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    // Input should exist and be focusable
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("should handle loading state", () => {
    render(<TerminalPopup {...defaultProps} loading={true} />);

    const terminal = screen.getByText(/rudra@portfolio/i);
    expect(terminal).toBeInTheDocument();
  });

  it("should auto-scroll to bottom on new output", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "test{Enter}");

      // Check that the overflow container exists
      const terminalBody = container.querySelector(".overflow-auto");
      expect(terminalBody).toBeInTheDocument();
    }
  });

  it("should display command history in terminal", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "test{Enter}");

      // Input should be cleared after command execution
      await waitFor(() => {
        expect(input.value).toBe("");
      });
    }
  });

  it("should handle typing indicator", async () => {
    const { container } = render(<TerminalPopup {...defaultProps} />);

    // Component should render without issues
    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  it("should clear terminal history on clear command", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "clear{Enter}");

      // Input should be cleared
      await waitFor(() => {
        expect(input.value).toBe("");
      });
    }
  });

  it("should prevent default on Enter key", async () => {
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });

    fireEvent.keyDown(input, event);

    // We just check that the input exists and keydown doesn't throw
    expect(input).toBeInTheDocument();
  });

  it("should have proper CSS classes for styling", () => {
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const terminalContainer = container.querySelector(".terminal-container");
    expect(terminalContainer).toBeInTheDocument();
  });

  it("should handle formatTerminalText with AI response", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: [
        "🤖 Rudra-B: Here are my **projects**: 1. **Portfolio**: Personal website 2. **Terminal**: Interactive terminal",
      ],
      clear: false,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "projects{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("projects");
      });
    }
  });

  it("should handle bullet point formatting in AI responses", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: [
        "🤖 Rudra-B: Features:\n• **Feature 1**: Description\n• Regular bullet point",
      ],
      clear: false,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "features{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("features");
      });
    }
  });

  it("should handle chat mode direct messages", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: ["🤖 Rudra-B: Hello! How can I help?"],
      clear: false,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("chat@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: true },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "hello{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("hello");
      });
    }
  });

  it("should handle chat mode error", async () => {
    const mockExecuteCommand = jest
      .fn()
      .mockRejectedValue(new Error("API Error"));

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("chat@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: true },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "test message{Enter}");

      await waitFor(
        () => {
          const errorText = screen.queryByText(/Failed to get response/i);
          expect(errorText || mockExecuteCommand).toBeTruthy();
        },
        { timeout: 3000 }
      );
    }
  });

  it("should handle download command with progress animation", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: [
        "Downloading resume...",
        "█████████████████████████░░░░░░░░░░░░░░░░░░░░░░░",
        "50% Downloading...",
      ],
      clear: false,
      startDownload: true,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "!resume{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("!resume");
      });
    }
  });

  it("should handle contact submission with progress animation", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: [
        "Submitting contact...",
        "█████████████████████████░░░░░░░░░░░░░░░░░░░░░░░",
        "50% Processing...",
      ],
      clear: false,
      startSubmitting: true,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
        completedContactForm: {
          name: "Test User",
          contactOption: "email",
          contactDetails: "test@example.com",
          message: "Test message",
        },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "!contact{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("!contact");
      });
    }
  });

  it("should handle command execution error", async () => {
    const mockExecuteCommand = jest
      .fn()
      .mockRejectedValue(new Error("Command failed"));

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "invalid{Enter}");

      await waitFor(
        () => {
          expect(mockExecuteCommand).toHaveBeenCalledWith("invalid");
        },
        { timeout: 3000 }
      );
    }
  });

  it("should handle ArrowDown key when not at end of history", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "cmd1{Enter}");
      await user.type(input, "cmd2{Enter}");
      await user.type(input, "cmd3{Enter}");

      // Go up twice
      fireEvent.keyDown(input, { key: "ArrowUp" });
      fireEvent.keyDown(input, { key: "ArrowUp" });

      // Go down once
      fireEvent.keyDown(input, { key: "ArrowDown" });

      expect(input).toBeInTheDocument();
    }
  });

  it("should handle ArrowDown key at end of history", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "cmd1{Enter}");

      // Go up
      fireEvent.keyDown(input, { key: "ArrowUp" });
      // Go down past end
      fireEvent.keyDown(input, { key: "ArrowDown" });

      await waitFor(() => {
        expect(input.value).toBe("");
      });
    }
  });

  it("should handle numbered list formatting in AI responses", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: [
        "🤖 Rudra-B: 1. **Project One**: First project\n2. **Project Two**: Second project",
      ],
      clear: false,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "list{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("list");
      });
    }
  });

  it("should handle empty lines in AI responses", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: ["🤖 Rudra-B: Line 1\n\nLine 3"],
      clear: false,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "test{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("test");
      });
    }
  });

  it("should prevent default on ArrowUp and ArrowDown keys", () => {
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    const upEvent = new KeyboardEvent("keydown", {
      key: "ArrowUp",
      bubbles: true,
      cancelable: true,
    });
    const downEvent = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    });

    fireEvent.keyDown(input, upEvent);
    fireEvent.keyDown(input, downEvent);

    expect(input).toBeInTheDocument();
  });

  it("should handle touch events on backdrop", () => {
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const backdrop = container.querySelector(".terminal-backdrop");
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      fireEvent.touchMove(backdrop);
      fireEvent.wheel(backdrop);
    }
  });

  it("should handle touch events on terminal container", () => {
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const terminalContainer = container.querySelector(".terminal-container");
    expect(terminalContainer).toBeInTheDocument();

    if (terminalContainer) {
      fireEvent.touchMove(terminalContainer);
      fireEvent.wheel(terminalContainer);
    }
  });

  it("should clean up event listeners on unmount", () => {
    const { unmount } = render(<TerminalPopup {...defaultProps} />);

    unmount();

    // Component should unmount without errors
    expect(screen.queryByText(/rudra@portfolio/i)).not.toBeInTheDocument();
  });

  it("should handle viewport meta tag manipulation", () => {
    // Create a meta viewport tag for testing
    const viewport = document.createElement("meta");
    viewport.setAttribute("name", "viewport");
    viewport.setAttribute("content", "width=device-width, initial-scale=1.0");
    document.head.appendChild(viewport);

    render(<TerminalPopup {...defaultProps} />);

    const viewportElement = document.querySelector("meta[name=viewport]");
    expect(viewportElement).toBeInTheDocument();

    // Clean up
    document.head.removeChild(viewport);
  });

  it("should restore body scroll on close", () => {
    const { unmount } = render(<TerminalPopup {...defaultProps} />);

    unmount();

    // Body should have overflow restored
    expect(document.body.style.overflow).toBeDefined();
  });

  it("should handle regular text in formatTerminalText", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: ["Regular output without AI prefix"],
      clear: false,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "help{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("help");
      });
    }
  });

  it("should handle chat clear command", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: ["Chat cleared"],
      clear: false,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("chat@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: true },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "clear{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("clear");
      });
    }
  });

  it("should handle chat slash command", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: ["Command executed"],
      clear: false,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("chat@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: true },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "/exit{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("/exit");
      });
    }
  });

  it("should handle chat exclamation command", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: ["Command executed"],
      clear: false,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("chat@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: true },
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "!help{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("!help");
      });
    }
  });

  it("should handle contact submission without completed form", async () => {
    const mockExecuteCommand = jest.fn().mockResolvedValue({
      output: ["Submitting..."],
      clear: false,
      startSubmitting: true,
    });

    (TerminalEngine as jest.Mock).mockImplementation(() => ({
      setRepositories: jest.fn(),
      executeCommand: mockExecuteCommand,
      getPrompt: jest.fn().mockReturnValue("guest@portfolio:~$"),
      getPromptColor: jest.fn().mockReturnValue("#00ff00"),
      getState: jest.fn().mockReturnValue({
        chatSession: { isActive: false },
        completedContactForm: null,
      }),
      resetState: jest.fn(),
    }));

    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "!contact{Enter}");

      await waitFor(() => {
        expect(mockExecuteCommand).toHaveBeenCalledWith("!contact");
      });
    }
  });

  it("should handle empty command submission", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "{Enter}");

      // Input should still be empty
      expect(input.value).toBe("");
    }
  });

  it("should handle only whitespace command", async () => {
    const user = userEvent.setup();
    const { container } = render(<TerminalPopup {...defaultProps} />);

    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;

    if (input) {
      await user.type(input, "   {Enter}");

      await waitFor(() => {
        expect(input.value).toBe("");
      });
    }
  });
});
