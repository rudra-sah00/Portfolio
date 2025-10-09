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
});
