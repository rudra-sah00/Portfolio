export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  readme_content?: string;
  languages?: Record<string, number>;
  owner?: {
    login: string;
    type: string;
  };
  isOrganizationRepo?: boolean;
}
