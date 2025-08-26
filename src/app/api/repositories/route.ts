import { NextResponse } from 'next/server';
import { GitHubRepo } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Username parameter is required' 
        },
        { status: 400 }
      );
    }

    // Prepare headers for GitHub API with hardcoded token
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App',
      'Authorization': 'Bearer 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'
    };

    // Fetch user repositories from GitHub API
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=public`,
      { headers }
    );

    if (!reposResponse.ok) {
      const errorText = await reposResponse.text();
      console.error(`GitHub API error: ${reposResponse.status} - ${errorText}`);
      
      return NextResponse.json({
        success: false,
        error: `GitHub API error: ${reposResponse.status}`,
        message: errorText
      }, { status: reposResponse.status });
    }

    const userRepos = await reposResponse.json();

    // Fetch repositories from organizations where user has access (using authenticated endpoint)
    const orgReposResponse = await fetch(
      `https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&sort=updated&per_page=100`,
      { headers }
    );

    let orgRepos: GitHubRepo[] = [];
    if (orgReposResponse.ok) {
      const allUserRepos = await orgReposResponse.json();
      // Filter only organization repositories
      orgRepos = allUserRepos.filter((repo: GitHubRepo) => repo.owner?.type === 'Organization');
    }

    // Combine user repos and organization repos
    const allRepos = [...userRepos, ...orgRepos];

    // Remove duplicates based on repo ID
    const uniqueRepos = allRepos.filter((repo, index, self) => 
      index === self.findIndex(r => r.id === repo.id)
    );

    // Fetch README and languages for each repository
    const reposWithReadme = await Promise.all(
      uniqueRepos.map(async (repo: GitHubRepo): Promise<GitHubRepo> => {
        try {
          // Skip repos without owner information
          if (!repo.owner) {
            throw new Error('Repository owner information missing');
          }

          // Helper function for fetch with timeout
          const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            
            try {
              const response = await fetch(url, {
                ...options,
                signal: controller.signal
              });
              clearTimeout(id);
              return response;
            } catch (error) {
              clearTimeout(id);
              throw error;
            }
          };

          let readme_content = '';
          let languages = {};

          // Fetch README with timeout and error handling
          try {
            const readmeResponse = await fetchWithTimeout(
              `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`,
              { headers },
              5000 // 5 second timeout
            );

            if (readmeResponse.ok) {
              const readmeData = await readmeResponse.json();
              readme_content = Buffer.from(readmeData.content, 'base64').toString('utf-8');
            } else {
              readme_content = `# ${repo.name}

This repository doesn't have a README.md file.

**Repository:** ${repo.name}
**Description:** ${repo.description || 'No description available'}

Click "View on GitHub" to explore the repository directly.`;
            }
          } catch (error) {
            console.log(`README fetch failed for ${repo.name}:`, error instanceof Error ? error.message : 'Unknown error');
            readme_content = `# ${repo.name}

**Repository:** ${repo.name}
**Description:** ${repo.description || 'No description available'}

README content temporarily unavailable due to network timeout.
Click "View on GitHub" to explore the repository directly.`;
          }

          // Fetch languages with timeout and error handling
          try {
            const languagesResponse = await fetchWithTimeout(
              `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`,
              { headers },
              5000 // 5 second timeout
            );

            if (languagesResponse.ok) {
              languages = await languagesResponse.json();
            }
          } catch (error) {
            console.log(`Languages fetch failed for ${repo.name}:`, error instanceof Error ? error.message : 'Unknown error');
            // Languages will remain as empty object
          }

          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            readme_content,
            languages,
            owner: repo.owner ? {
              login: repo.owner.login,
              type: repo.owner.type
            } : { login: '', type: 'User' },
            isOrganizationRepo: repo.owner?.type === 'Organization'
          };
        } catch (error) {
          console.error(`Error fetching data for ${repo.name}:`, error instanceof Error ? error.message : 'Unknown error');
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            readme_content: `# ${repo.name}

**Repository:** ${repo.name}
**Description:** ${repo.description || 'No description available'}

*Note: Some repository details are temporarily unavailable due to network issues.*

Click "View on GitHub" to explore the repository directly.`,
            languages: {},
            owner: repo.owner ? {
              login: repo.owner.login,
              type: repo.owner.type
            } : { login: '', type: 'User' },
            isOrganizationRepo: repo.owner?.type === 'Organization'
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: reposWithReadme,
      count: reposWithReadme.length
    });

  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
