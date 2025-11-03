import { GitHubRepo } from "@/types";

export const fetchGitHubRepositories = async (
  username: string
): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(`/api/repositories?username=${username}`);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch repositories");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  }
};
