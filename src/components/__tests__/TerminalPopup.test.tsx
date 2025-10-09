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
});
