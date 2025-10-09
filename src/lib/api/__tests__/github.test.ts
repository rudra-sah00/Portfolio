import { fetchGitHubRepositories } from "../github";

// Mock fetch
global.fetch = jest.fn();

describe("GitHub API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchGitHubRepositories", () => {
    it("should fetch repositories successfully", async () => {
      const mockRepos = [
        {
          id: 1,
          name: "test-repo",
          description: "Test repository",
          html_url: "https://github.com/user/test-repo",
          languages: { TypeScript: 80, JavaScript: 20 },
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockRepos }),
      });

      const result = await fetchGitHubRepositories("testuser");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/repositories?username=testuser"
      );
      expect(result).toEqual(mockRepos);
    });

    it("should handle API error responses", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchGitHubRepositories("testuser")).rejects.toThrow(
        "API responded with status: 404"
      );
    });

    it("should handle unsuccessful API responses", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          message: "User not found",
        }),
      });

      await expect(fetchGitHubRepositories("testuser")).rejects.toThrow(
        "User not found"
      );
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(fetchGitHubRepositories("testuser")).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle empty username", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

      const result = await fetchGitHubRepositories("");

      expect(global.fetch).toHaveBeenCalledWith("/api/repositories?username=");
      expect(result).toEqual([]);
    });
  });
});
