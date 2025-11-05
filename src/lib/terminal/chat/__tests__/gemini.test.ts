import { GeminiAPI } from "../gemini";
import { GitHubRepo } from "@/types";

// Mock fetch
global.fetch = jest.fn();

describe("GeminiAPI - Server-Side API Route", () => {
  let geminiAPI: GeminiAPI;

  const mockRepos: GitHubRepo[] = [
    {
      id: 1,
      name: "test-repo",
      description: "A test TypeScript repository",
      html_url: "https://github.com/user/test-repo",
      languages: { TypeScript: 80, JavaScript: 20 },
      readme_content:
        "# Test Repo\n\nThis is a test repository for TypeScript development.",
    },
    {
      id: 2,
      name: "python-project",
      description: "A Python machine learning project",
      html_url: "https://github.com/user/python-project",
      languages: { Python: 90, Jupyter: 10 },
      readme_content:
        "# Python ML Project\n\nMachine learning implementation with Python.",
    },
  ];

  beforeEach(() => {
    geminiAPI = new GeminiAPI();
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize without requiring API keys (handled server-side)", () => {
      expect(geminiAPI).toBeDefined();
    });
  });

  describe("sendMessage - Success Cases", () => {
    it("should send message and receive response from server API", async () => {
      const mockResponse = {
        response: "I am Rudra-B, here to help with portfolio questions.",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geminiAPI.sendMessage(
        "Tell me about yourself",
        mockRepos
      );

      expect(result).toBe(
        "I am Rudra-B, here to help with portfolio questions."
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify it calls our API route, not Gemini directly
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[0]).toBe("/api/chat");
      expect(fetchCall[1].method).toBe("POST");
      expect(fetchCall[1].headers["Content-Type"]).toBe("application/json");
    });

    it("should include message and system prompt in request body", async () => {
      const mockResponse = {
        response: "Here are the projects...",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("What projects do you have?", mockRepos);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body.message).toBe("What projects do you have?");
      expect(body.systemPrompt).toBeDefined();
      expect(body.systemPrompt).toContain("Rudra Narayana Sahoo");
      expect(body.systemPrompt).toContain("test-repo");
      expect(body.systemPrompt).toContain("python-project");
    });

    it("should work without repositories", async () => {
      const mockResponse = {
        response: "Response without repos",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geminiAPI.sendMessage("Hello");
      expect(result).toBe("Response without repos");
    });

    it("should include tech stack analysis in system prompt", async () => {
      const mockResponse = {
        response: "Tech stack info",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("What tech do you use?", mockRepos);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body.systemPrompt).toContain("Tech Stack");
      expect(body.systemPrompt).toContain("TypeScript");
      expect(body.systemPrompt).toContain("Python");
    });

    it("should detect and include specific project details", async () => {
      const mockResponse = {
        response: "Details about test-repo...",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Tell me about test-repo", mockRepos);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body.systemPrompt).toContain("DETAILED PROJECT INFORMATION");
      expect(body.systemPrompt).toContain("test-repo");
      expect(body.systemPrompt).toContain("# Test Repo");
    });
  });

  describe("sendMessage - Error Handling", () => {
    it("should handle API request failure with proper error message", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server error" }),
      });

      const result = await geminiAPI.sendMessage("Test message");
      expect(result).toContain("error");
      expect(result).toContain("try again");
    });

    it("should handle network errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const result = await geminiAPI.sendMessage("Test message");
      expect(result).toContain("error");
      expect(result).toContain("try again");
    });

    it("should handle missing response field", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await geminiAPI.sendMessage("Test message");
      // When response field is missing, returns undefined which gets returned as-is
      expect(result).toBeUndefined();
    });

    it("should handle JSON parse errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const result = await geminiAPI.sendMessage("Test message");
      expect(result).toContain("error");
    });
  });

  describe("System Prompt Generation", () => {
    it("should include personal information in system prompt", async () => {
      const mockResponse = {
        response: "Response",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Hello");

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body.systemPrompt).toContain("Rudra Narayana Sahoo");
      expect(body.systemPrompt).toContain("Full-stack Developer");
      expect(body.systemPrompt).toContain("DuckBuck Studios");
      expect(body.systemPrompt).toContain("rudranarayanaknr@gmail.com");
    });

    it("should include instructions for AI behavior", async () => {
      const mockResponse = {
        response: "Response",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Hello");

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body.systemPrompt).toContain("Rudra-B");
      expect(body.systemPrompt).toContain("portfolio");
      expect(body.systemPrompt).toContain("ONLY answer questions");
    });

    it("should generate project list from repositories", async () => {
      const mockResponse = {
        response: "Projects",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("List projects", mockRepos);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body.systemPrompt).toContain("1. test-repo");
      expect(body.systemPrompt).toContain("A test TypeScript repository");
      expect(body.systemPrompt).toContain("2. python-project");
      expect(body.systemPrompt).toContain("A Python machine learning project");
    });
  });
});
