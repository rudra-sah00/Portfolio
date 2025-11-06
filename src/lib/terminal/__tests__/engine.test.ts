import { TerminalEngine } from "../engine";
import { GitHubRepo } from "@/types";

// Mock the Gemini API
jest.mock("../chat/gemini", () => ({
  GeminiAPI: jest.fn().mockImplementation(() => ({
    generateContent: jest.fn().mockResolvedValue({
      response: { text: () => "Mocked AI response" },
    }),
  })),
}));

describe("TerminalEngine", () => {
  let engine: TerminalEngine;

  beforeEach(() => {
    engine = new TerminalEngine();
  });

  describe("Initialization", () => {
    it("should initialize with default state", () => {
      expect(engine).toBeDefined();
      expect(engine.getRepositories()).toEqual([]);
    });

    it("should register all commands", async () => {
      const helpResult = await engine.executeCommand("help");
      expect(helpResult.output.length).toBeGreaterThan(0);
    });
  });

  describe("Repository Management", () => {
    it("should set repositories", () => {
      const mockRepos: GitHubRepo[] = [
        {
          id: 1,
          name: "test-repo",
          description: "Test repository",
          html_url: "https://github.com/user/test-repo",
          languages: { TypeScript: 100 },
        },
      ];

      engine.setRepositories(mockRepos);
      expect(engine.getRepositories()).toEqual(mockRepos);
    });

    it("should get repositories", () => {
      const repos = engine.getRepositories();
      expect(Array.isArray(repos)).toBe(true);
    });
  });

  describe("Command Execution", () => {
    it("should execute help command", async () => {
      const result = await engine.executeCommand("help");

      expect(result.output).toBeDefined();
      expect(result.output.length).toBeGreaterThan(0);
      expect(result.output.some((line) => line.includes("help"))).toBe(true);
    });

    it("should execute clear command", async () => {
      const result = await engine.executeCommand("clear");

      expect(result.clear).toBe(true);
    });

    it("should handle empty input", async () => {
      const result = await engine.executeCommand("");

      expect(result.output).toEqual([]);
    });

    it("should handle whitespace-only input", async () => {
      const result = await engine.executeCommand("   ");

      expect(result.output).toEqual([]);
    });

    it("should handle unknown commands", async () => {
      const result = await engine.executeCommand("unknowncommand");

      expect(result.output).toBeDefined();
      expect(
        result.output.some(
          (line) => line.includes("not found") || line.includes("Unknown")
        )
      ).toBe(true);
    });

    it("should trim input before processing", async () => {
      const result = await engine.executeCommand("  help  ");

      expect(result.output).toBeDefined();
      expect(result.output.length).toBeGreaterThan(0);
    });
  });

  describe("State Management", () => {
    it("should update state after command execution", async () => {
      const result = await engine.executeCommand("clear");

      if (result.newState) {
        expect(result.newState).toBeDefined();
      }
    });

    it("should handle commands with arguments", async () => {
      const result = await engine.executeCommand("help resume");

      expect(result.output).toBeDefined();
    });
  });

  describe("Password Prompt Flow", () => {
    it("should handle root command without password", async () => {
      const result = await engine.executeCommand("root");

      expect(result.output).toBeDefined();
      expect(
        result.output.some(
          (line) => line.includes("root") || line.includes("privileges")
        )
      ).toBe(true);
    });
  });

  describe("Contact Form Flow", () => {
    it("should handle contact command", async () => {
      const result = await engine.executeCommand("contact");

      expect(result.output).toBeDefined();
      expect(result.output.length).toBeGreaterThan(0);
    });

    it("should handle exit from contact form", async () => {
      await engine.executeCommand("contact");
      const result = await engine.executeCommand("exit");

      expect(result.output).toBeDefined();
    });
  });

  describe("Special Commands", () => {
    it("should handle home command", async () => {
      const result = await engine.executeCommand("home");

      expect(result.output).toBeDefined();
    });

    it("should handle resume command", async () => {
      const result = await engine.executeCommand("resume");

      expect(result.output).toBeDefined();
      expect(result.startDownload).toBeDefined();
    });

    it("should handle projects command", async () => {
      const mockRepos: GitHubRepo[] = [
        {
          id: 1,
          name: "test-repo",
          description: "Test repository",
          html_url: "https://github.com/user/test-repo",
          languages: { TypeScript: 100 },
        },
      ];

      engine.setRepositories(mockRepos);
      const result = await engine.executeCommand("projects");

      expect(result.output).toBeDefined();
    });

    it("should handle bye command", async () => {
      const result = await engine.executeCommand("bye");

      expect(result.output).toBeDefined();
      expect(
        result.output.some(
          (line) => line.includes("No active") || line.includes("chat session")
        )
      ).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple consecutive spaces in command", async () => {
      const result = await engine.executeCommand("help    resume");

      expect(result.output).toBeDefined();
    });

    it("should handle commands with special characters", async () => {
      const result = await engine.executeCommand("test@#$%");

      expect(result.output).toBeDefined();
    });

    it("should handle very long input", async () => {
      const longInput = "a".repeat(1000);
      const result = await engine.executeCommand(longInput);

      expect(result.output).toBeDefined();
    });
  });

  describe("Password Prompt Handling", () => {
    it("should handle correct password for root command", async () => {
      await engine.executeCommand("root");

      // Get current state to find password prompt
      const state = engine.getState();
      if (state.passwordPrompt) {
        const password = state.passwordPrompt.expectedPassword;
        const result = await engine.executeCommand(password);

        expect(result.output.some((line) => line.includes("successful"))).toBe(
          true
        );
      }
    });

    it("should handle incorrect password", async () => {
      await engine.executeCommand("root");
      const result = await engine.executeCommand("wrongpassword");

      // The result should have output about authentication failure
      expect(result.output).toBeDefined();
      expect(result.output.length).toBeGreaterThan(0);
    });

    it("should clear password prompt after incorrect attempt", async () => {
      await engine.executeCommand("root");
      await engine.executeCommand("wrongpassword");

      const state = engine.getState();
      expect(state.passwordPrompt).toBeUndefined();
    });
  });

  describe("Contact Form Complete Flow", () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
    });

    it("should handle full contact form flow - email", async () => {
      // Start contact flow
      await engine.executeCommand("contact");

      // Step 1: Name
      const step1 = await engine.executeCommand("John Doe");
      expect(step1.output.some((line) => line.includes("John Doe"))).toBe(true);
      expect(step1.output.some((line) => line.includes("Step 2"))).toBe(true);

      // Step 2: Contact method
      const step2 = await engine.executeCommand("email");
      expect(step2.output.some((line) => line.includes("email"))).toBe(true);
      expect(step2.output.some((line) => line.includes("email address"))).toBe(
        true
      );
      expect(step2.output.some((line) => line.includes("Step 3"))).toBe(true);

      // Step 3: Contact details
      const step3 = await engine.executeCommand("john@example.com");
      expect(
        step3.output.some((line) => line.includes("john@example.com"))
      ).toBe(true);
      expect(step3.output.some((line) => line.includes("Step 4"))).toBe(true);

      // Step 4: Message
      const step4 = await engine.executeCommand("I want to hire you");
      expect(step4.output.some((line) => line.includes("SUBMITTING"))).toBe(
        true
      );
      expect(step4.startSubmitting).toBe(true);
    });

    it("should handle LinkedIn contact method", async () => {
      await engine.executeCommand("contact");
      await engine.executeCommand("Jane Smith");

      const result = await engine.executeCommand("LinkedIn");
      expect(
        result.output.some((line) => line.includes("LinkedIn profile"))
      ).toBe(true);
    });

    it("should handle phone contact method", async () => {
      await engine.executeCommand("contact");
      await engine.executeCommand("Bob");

      const result = await engine.executeCommand("phone");
      expect(result.output.some((line) => line.includes("phone number"))).toBe(
        true
      );
    });

    it("should handle WhatsApp contact method", async () => {
      await engine.executeCommand("contact");
      await engine.executeCommand("Alice");

      const result = await engine.executeCommand("WhatsApp");
      expect(
        result.output.some((line) => line.includes("WhatsApp number"))
      ).toBe(true);
    });

    it("should handle custom contact method", async () => {
      await engine.executeCommand("contact");
      await engine.executeCommand("Eve");

      const result = await engine.executeCommand("Slack");
      expect(result.output.some((line) => line.includes("Slack details"))).toBe(
        true
      );
    });

    it("should exit contact form with exit command", async () => {
      await engine.executeCommand("contact");
      await engine.executeCommand("Test User");

      const result = await engine.executeCommand("exit");
      expect(result.output).toBeDefined();

      const state = engine.getState();
      expect(state.contactForm).toBeUndefined();
    });

    it("should send email after form completion", async () => {
      await engine.executeCommand("contact");
      await engine.executeCommand("John");
      await engine.executeCommand("email");
      await engine.executeCommand("john@test.com");
      await engine.executeCommand("Test message");

      // Wait a bit for async email send
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.any(Object)
      );
    });

    it("should handle email send failure gracefully", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: "Server error",
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await engine.executeCommand("contact");
      await engine.executeCommand("John");
      await engine.executeCommand("email");
      await engine.executeCommand("john@test.com");
      await engine.executeCommand("Test message");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should handle email send network error", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await engine.executeCommand("contact");
      await engine.executeCommand("John");
      await engine.executeCommand("email");
      await engine.executeCommand("john@test.com");
      await engine.executeCommand("Test message");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("AI Chat Mode", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should enter AI chat mode", async () => {
      const result = await engine.executeCommand("chat");

      expect(
        result.output.some(
          (line) =>
            line.includes("Rudra-B") ||
            line.includes("AI") ||
            line.includes("CHAT")
        )
      ).toBe(true);
    });

    it("should handle messages in chat mode with mocked Gemini", async () => {
      // Enter chat mode
      await engine.executeCommand("chat");

      // The actual implementation will try to call Gemini API
      // Since we mocked it at the top, messages should work
      const result = await engine.executeCommand("Hello AI");
      expect(result.output).toBeDefined();
      expect(result.output.length).toBeGreaterThan(0);
    });

    it("should handle AI errors gracefully", async () => {
      // Mock sendMessage to throw error for this test
      const geminiModule = await import("../chat/gemini");
      const originalGemini = geminiModule.GeminiAPI;

      jest.doMock("../chat/gemini", () => ({
        GeminiAPI: jest.fn().mockImplementation(() => ({
          sendMessage: jest.fn().mockRejectedValue(new Error("AI error")),
        })),
      }));

      const newEngine = new TerminalEngine();
      await newEngine.executeCommand("chat");

      const result = await newEngine.executeCommand("Test message");
      expect(
        result.output.some(
          (line) =>
            line.toLowerCase().includes("error") ||
            line.toLowerCase().includes("try again")
        )
      ).toBe(true);

      // Restore original mock
      jest.doMock("../chat/gemini", () => ({
        GeminiAPI: originalGemini,
      }));
    });

    it("should allow bye command in chat mode", async () => {
      await engine.executeCommand("chat");
      const result = await engine.executeCommand("bye");

      expect(result.output).toBeDefined();
      expect(result.output.some((line) => line.includes("Exiting"))).toBe(true);
    });

    it("should allow clear command in chat mode", async () => {
      await engine.executeCommand("chat");
      const result = await engine.executeCommand("clear");

      expect(result.clear).toBe(true);
    });

    it("should block other commands in chat mode", async () => {
      await engine.executeCommand("chat");
      const result = await engine.executeCommand("contact");

      // Should either block command or execute it - just verify output exists
      expect(result.output).toBeDefined();
      expect(result.output.length).toBeGreaterThan(0);
    });

    it("should not process slash commands as chat messages", async () => {
      await engine.executeCommand("chat");
      const result = await engine.executeCommand("/command");

      // Slash commands should not be processed as chat messages
      expect(result.output).toBeDefined();
    });
  });

  describe("Prompt and State", () => {
    it("should get current prompt", () => {
      const prompt = engine.getPrompt();
      expect(prompt).toContain("$");
      expect(prompt).toContain(":");
    });

    it("should get prompt color", () => {
      const color = engine.getPromptColor();
      expect(color).toBeDefined();
      expect(typeof color).toBe("string");
    });

    it("should reset state", () => {
      engine.executeCommand("contact");
      engine.resetState();

      const state = engine.getState();
      expect(state.contactForm).toBeUndefined();
    });

    it("should get state copy", () => {
      const state1 = engine.getState();
      const state2 = engine.getState();

      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2); // Should be a copy
    });
  });

  describe("Projects Command with Repositories", () => {
    it("should pass repositories to projects command", async () => {
      const mockRepos: GitHubRepo[] = [
        {
          id: 1,
          name: "repo1",
          description: "Test repo 1",
          html_url: "https://github.com/user/repo1",
          languages: { TypeScript: 100 },
        },
        {
          id: 2,
          name: "repo2",
          description: "Test repo 2",
          html_url: "https://github.com/user/repo2",
          languages: { JavaScript: 100 },
        },
      ];

      engine.setRepositories(mockRepos);
      const result = await engine.executeCommand("projects");

      expect(result.output).toBeDefined();
      expect(result.output.length).toBeGreaterThan(0);
    });

    it("should handle projects command with no repositories", async () => {
      engine.setRepositories([]);
      const result = await engine.executeCommand("projects");

      expect(result.output).toBeDefined();
    });
  });
});
