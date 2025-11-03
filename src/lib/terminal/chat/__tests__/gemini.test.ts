import { GeminiAPI, GeminiResponse } from "../gemini";
import { GitHubRepo } from "@/types";

// Mock fetch
global.fetch = jest.fn();

describe("GeminiAPI", () => {
  let geminiAPI: GeminiAPI;
  const mockApiKey = "test-api-key";

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
    geminiAPI = new GeminiAPI(mockApiKey);
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with API key", () => {
      expect(geminiAPI).toBeDefined();
    });

    it("should accept API key in constructor", () => {
      const api = new GeminiAPI("custom-key");
      expect(api).toBeDefined();
    });

    it("should have correct base URL", () => {
      const api = geminiAPI as unknown as { baseUrl: string };
      expect(api.baseUrl).toContain("generativelanguage.googleapis.com");
      expect(api.baseUrl).toContain("gemini");
    });

    it("should store API key", () => {
      const api = geminiAPI as unknown as { apiKey: string };
      expect(api.apiKey).toBe(mockApiKey);
    });
  });

  describe("sendMessage - Success Cases", () => {
    it("should send message and receive response", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: "I am Rudra-B, here to help with portfolio questions.",
                },
              ],
            },
          },
        ],
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
    });

    it("should include repository data in context", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: "Here are the projects..." }],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geminiAPI.sendMessage(
        "What projects do you have?",
        mockRepos
      );
      expect(result).toContain("Here are the projects");

      // Check that fetch was called with repository context
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.contents[0].parts[0].text).toContain("test-repo");
      expect(body.contents[0].parts[0].text).toContain("python-project");
    });

    it("should work without repositories", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: "Response without repos" }],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geminiAPI.sendMessage("Hello");
      expect(result).toBe("Response without repos");
    });

    it("should detect and include specific project details", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: "Details about test-repo..." }],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Tell me about test-repo", mockRepos);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.contents[0].parts[0].text).toContain(
        "DETAILED PROJECT INFORMATION"
      );
      expect(body.contents[0].parts[0].text).toContain("test-repo");
    });

    it("should detect project by partial name match", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Found project" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("What about python project?", mockRepos);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.contents[0].parts[0].text).toContain("python-project");
    });
  });

  describe("sendMessage - Error Handling", () => {
    it("should handle API request failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await geminiAPI.sendMessage("Test message");
      expect(result).toContain("error");
      expect(result).toContain("try again");
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const result = await geminiAPI.sendMessage("Test message");
      expect(result).toContain("error");
    });

    it("should handle malformed API response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await geminiAPI.sendMessage("Test message");
      expect(result).toContain("error");
    });

    it("should handle missing candidates in response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ candidates: [] }),
      });

      const result = await geminiAPI.sendMessage("Test message");
      expect(result).toContain("error");
    });

    it("should handle missing content in response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: null }],
        }),
      });

      const result = await geminiAPI.sendMessage("Test message");
      expect(result).toContain("error");
    });
  });

  describe("Tech Stack Analysis", () => {
    it("should generate tech stack with empty repositories", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Tech stack info" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("What tech stack?", []);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      // Should include default tech stack when no repos
      expect(body.contents[0].parts[0].text).toContain("React");
      expect(body.contents[0].parts[0].text).toContain("Next.js");
    });

    it("should calculate language percentages correctly", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Languages" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Tech stack?", mockRepos);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      const prompt = body.contents[0].parts[0].text;

      // TypeScript appears in both repos
      expect(prompt).toContain("TypeScript");
      // Should show percentage for TypeScript
      expect(prompt).toMatch(/TypeScript.*50%/);
    });

    it("should handle repositories without languages field", async () => {
      const reposWithoutLang: GitHubRepo[] = [
        {
          id: 1,
          name: "no-lang-repo",
          description: "Repo without languages",
          html_url: "https://github.com/user/no-lang",
        },
      ];

      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geminiAPI.sendMessage("Test", reposWithoutLang);
      expect(result).toBe("Response");
    });
  });

  describe("Projects Section Generation", () => {
    it("should generate default projects when no repos", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Projects" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Show projects", []);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.contents[0].parts[0].text).toContain("DuckBuck Studios");
      expect(body.contents[0].parts[0].text).toContain("rudrasahoo.me");
    });

    it("should list all repositories in projects section", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Projects" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Projects", mockRepos);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      const prompt = body.contents[0].parts[0].text;

      expect(prompt).toContain("test-repo");
      expect(prompt).toContain("python-project");
      expect(prompt).toContain("A test TypeScript repository");
      expect(prompt).toContain("A Python machine learning project");
    });

    it("should handle repos without descriptions", async () => {
      const reposNoDesc: GitHubRepo[] = [
        {
          id: 1,
          name: "no-desc-repo",
          description: null,
          html_url: "https://github.com/user/no-desc",
        },
      ];

      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Test", reposNoDesc);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.contents[0].parts[0].text).toContain(
        "No description available"
      );
    });
  });

  describe("Project Details Generation", () => {
    it("should include readme content when available", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Details" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Tell me about test repo", mockRepos);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.contents[0].parts[0].text).toContain(
        "This is a test repository"
      );
    });

    it("should truncate long readme content", async () => {
      const longReadmeRepo: GitHubRepo[] = [
        {
          id: 1,
          name: "long-readme",
          description: "Repo with long README",
          html_url: "https://github.com/user/long-readme",
          readme_content: "A".repeat(2000), // Long content
        },
      ];

      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("long readme project", longReadmeRepo);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      // Should be truncated with "..."
      expect(body.contents[0].parts[0].text).toContain("...");
    });

    it("should handle repos without readme", async () => {
      const noReadmeRepo: GitHubRepo[] = [
        {
          id: 1,
          name: "no-readme",
          description: "Repo without README",
          html_url: "https://github.com/user/no-readme",
        },
      ];

      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("no readme project", noReadmeRepo);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.contents[0].parts[0].text).toContain("No README available");
    });
  });

  describe("API Request Configuration", () => {
    it("should include correct headers", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Test");

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[1].headers["Content-Type"]).toBe("application/json");
    });

    it("should include API key in URL", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Test");

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[0]).toContain(`key=${mockApiKey}`);
    });

    it("should use POST method", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Test");

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[1].method).toBe("POST");
    });

    it("should include generation config", async () => {
      const mockResponse: GeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await geminiAPI.sendMessage("Test");

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.generationConfig).toBeDefined();
      expect(body.generationConfig.temperature).toBe(0.7);
      expect(body.generationConfig.maxOutputTokens).toBe(1024);
    });
  });
});
