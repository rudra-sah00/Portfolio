import { GET } from "../route";
import { env } from "@/lib/env";

// Mock NextRequest
class MockNextRequest {
  public url: string;
  public nextUrl: { searchParams: URLSearchParams };

  constructor(url: string) {
    this.url = url;
    const urlObj = new URL(url);
    this.nextUrl = { searchParams: urlObj.searchParams };
  }
}

// Mock fetch
global.fetch = jest.fn();

describe("GET /api/repositories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    // Reset fetch mock to default behavior
    global.fetch = jest.fn();
  });

  it("should return 400 if username is missing", async () => {
    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories"
    ) as unknown as Request;

    const response = await GET(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Username parameter is required");
  });

  it("should fetch user repositories successfully", async () => {
    const mockRepos = [
      {
        id: 1,
        name: "test-repo",
        description: "Test repository",
        html_url: "https://github.com/user/test-repo",
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: Buffer.from("# Test README").toString("base64"),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ TypeScript: 100 }),
      });

    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories?username=testuser"
    );

    const response = await GET(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  it("should handle GitHub API errors", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: async () => "Not Found",
      json: async () => ({ message: "Not Found" }),
    });

    global.fetch = mockFetch;

    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories?username=nonexistent"
    );

    const response = await GET(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("GitHub API error: 404");
    expect(data.message).toBe("Not Found");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.github.com/user/repos"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/vnd.github.v3+json",
        }),
      })
    );
  });

  it("should fetch organization repositories", async () => {
    const mockUserRepos = [
      {
        id: 1,
        name: "user-repo",
        owner: { login: "testuser", type: "User" },
        description: "User repository",
        html_url: "https://github.com/testuser/user-repo",
      },
    ];
    const mockOrgReposResponse = [
      {
        id: 2,
        name: "org-repo",
        owner: { type: "Organization", login: "org" },
        description: "Org repository",
        html_url: "https://github.com/org/org-repo",
      },
    ];

    const mockReadmeContent = Buffer.from("# README").toString("base64");

    const mockFetch = jest
      .fn()
      // User repos fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserRepos,
      })
      // Org repos fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrgReposResponse,
      })
      // All subsequent fetches (README and languages for each repo)
      .mockResolvedValue({
        ok: true,
        json: async () => ({ content: mockReadmeContent, TypeScript: 100 }),
      });

    global.fetch = mockFetch;

    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories?username=testuser"
    );

    const response = await GET(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
  });

  it("should remove duplicate repositories", async () => {
    const duplicateRepos = [
      { id: 1, name: "repo1", owner: { login: "user", type: "User" } },
      { id: 1, name: "repo1", owner: { login: "user", type: "User" } },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => duplicateRepos,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: Buffer.from("# README").toString("base64"),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: Buffer.from("# README").toString("base64"),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories?username=testuser"
    );

    const response = await GET(request as unknown as Request);
    const data = await response.json();

    // Should only have one repo after deduplication
    expect(data.data.filter((r: { id: number }) => r.id === 1).length).toBe(1);
  });

  it("should fetch README content", async () => {
    const mockRepos = [
      {
        id: 1,
        name: "test-repo",
        owner: { login: "user", type: "User" },
      },
    ];

    const readmeContent = "# Test README\n\nThis is a test";

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: Buffer.from(readmeContent).toString("base64"),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ TypeScript: 100 }),
      });

    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories?username=testuser"
    );

    const response = await GET(request as unknown as Request);
    const data = await response.json();

    expect(data.data[0].readme_content).toContain("Test README");
  });

  it("should fetch languages/tech stack", async () => {
    const mockRepos = [
      {
        id: 1,
        name: "test-repo",
        owner: { login: "user", type: "User" },
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      })
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ TypeScript: 70, JavaScript: 30 }),
      });

    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories?username=testuser"
    );

    const response = await GET(request as unknown as Request);
    const data = await response.json();

    expect(data.data[0].languages).toEqual({ TypeScript: 70, JavaScript: 30 });
  });

  it("should handle missing README gracefully", async () => {
    const mockRepos = [
      {
        id: 1,
        name: "no-readme-repo",
        description: "Repo without README",
        owner: { login: "user" },
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories?username=testuser"
    );

    const response = await GET(request as unknown as Request);
    const data = await response.json();

    expect(data.data[0].readme_content).toBeDefined();
    expect(data.data[0].readme_content).toContain("no-readme-repo");
  });

  it("should set isOrganizationRepo flag correctly", async () => {
    const mockOrgRepos = [
      {
        id: 1,
        name: "org-repo",
        owner: { type: "Organization", login: "test-org" },
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrgRepos,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: Buffer.from("# Org Repo").toString("base64"),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories?username=testuser"
    );

    const response = await GET(request as unknown as Request);
    const data = await response.json();

    expect(data.data[0].isOrganizationRepo).toBe(true);
  });

  it("should use authorization header for GitHub API", async () => {
    // Mock env to have GITHUB_TOKEN
    const originalToken = env.GITHUB_TOKEN;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (env as any).GITHUB_TOKEN = "test-token-123";

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const request = new MockNextRequest(
      "http://localhost:3000/api/repositories?username=testuser"
    );

    await GET(request as unknown as Request);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Bearer"),
        }),
      })
    );

    // Restore original token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (env as any).GITHUB_TOKEN = originalToken;
  });
});
