import { NextResponse } from "next/server";
import { GitHubRepo } from "@/types";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: "Username parameter is required",
        },
        { status: 400 }
      );
    }

    // Prepare headers for GitHub API with token from environment
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-App",
    };

    // Add authorization if token is available
    if (env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
    }

    // Use authenticated endpoint to fetch ALL repos (personal + org + private if token has access)
    const reposResponse = await fetch(
      `https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&sort=updated&per_page=100&visibility=public`,
      { headers }
    );

    if (!reposResponse.ok) {
      const errorText = await reposResponse.text();
      console.error(`GitHub API error: ${reposResponse.status} - ${errorText}`);

      return NextResponse.json(
        {
          success: false,
          error: `GitHub API error: ${reposResponse.status}`,
          message: errorText,
        },
        { status: reposResponse.status }
      );
    }

    // Get all repos (personal, org, collaborator) in one call
    const allRepos = await reposResponse.json();

    // Deduplicate repositories by ID (in case same repo appears multiple times)
    const uniqueRepos = Array.from(
      new Map(
        allRepos.map(
          (repo: GitHubRepo) => [repo.id, repo] as [number, GitHubRepo]
        )
      ).values()
    ) as GitHubRepo[];

    // Fetch README and languages for each repository
    const reposWithReadme = await Promise.all(
      uniqueRepos.map(async (repo: GitHubRepo): Promise<GitHubRepo> => {
        try {
          // Skip repos without owner information
          if (!repo.owner) {
            throw new Error("Repository owner information missing");
          }

          // Fetch README - use the correct owner (could be user or organization)
          const readmeResponse = await fetch(
            `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`,
            { headers }
          );

          // Fetch languages/tech stack - use the correct owner
          const languagesResponse = await fetch(
            `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`,
            { headers }
          );

          let readme_content = "";
          let languages = {};

          if (readmeResponse.ok) {
            const readmeData = await readmeResponse.json();
            readme_content = Buffer.from(readmeData.content, "base64").toString(
              "utf-8"
            );
          } else {
            readme_content = `# ${repo.name}

This repository doesn't have a README.md file.

**Repository:** ${repo.name}
**Description:** ${repo.description || "No description available"}

Click "View on GitHub" to explore the repository directly.`;
          }

          if (languagesResponse.ok) {
            languages = await languagesResponse.json();
          }

          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            readme_content,
            languages,
            owner: repo.owner
              ? {
                  login: repo.owner.login,
                  type: repo.owner.type,
                }
              : { login: "", type: "User" },
            isOrganizationRepo: repo.owner?.type === "Organization",
          };
        } catch (error) {
          console.error(`Error fetching data for ${repo.name}:`, error);
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            readme_content: `# ${repo.name}

Unable to load README for "${repo.name}".

**Repository:** ${repo.name}
**Description:** ${repo.description || "No description available"}

Click "View on GitHub" to explore the repository directly.`,
            languages: {},
            owner: repo.owner
              ? {
                  login: repo.owner.login,
                  type: repo.owner.type,
                }
              : { login: "", type: "User" },
            isOrganizationRepo: repo.owner?.type === "Organization",
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: reposWithReadme,
      count: reposWithReadme.length,
    });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch repositories",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
