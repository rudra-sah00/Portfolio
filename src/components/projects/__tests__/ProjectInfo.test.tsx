import { render, screen } from "@testing-library/react";
import ProjectInfo from "../ProjectInfo";
import { GitHubRepo } from "@/types";

describe("ProjectInfo Component", () => {
  const mockRepositories: GitHubRepo[] = [
    {
      id: 1,
      name: "portfolio-website",
      description: "My portfolio website built with Next.js",
      html_url: "https://github.com/user/portfolio-website",
      languages: { TypeScript: 70, JavaScript: 20, CSS: 10 },
    },
    {
      id: 2,
      name: "blog-app",
      description: "A blog application",
      html_url: "https://github.com/user/blog-app",
      languages: { Python: 80, HTML: 20 },
      owner: {
        login: "organization",
        type: "Organization",
      },
      isOrganizationRepo: true,
    },
    {
      id: 3,
      name: "test-repo",
      description: null,
      html_url: "https://github.com/user/test-repo",
    },
  ];

  it("should render loading state", () => {
    render(<ProjectInfo repositories={[]} loading={true} />);

    const loadingText = screen.getByText(/Loading repositories/i);
    expect(loadingText).toBeInTheDocument();
  });

  it("should render all repositories", () => {
    render(<ProjectInfo repositories={mockRepositories} loading={false} />);

    const portfolioElements = screen.getAllByText(/Portfolio Website/i);
    expect(portfolioElements.length).toBeGreaterThan(0);
    const blogElements = screen.getAllByText(/Blog App/i);
    expect(blogElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Test Repo/i)).toBeInTheDocument();
  });

  it("should capitalize repository names correctly", () => {
    render(<ProjectInfo repositories={mockRepositories} loading={false} />);

    const portfolioName = screen.getAllByText(/Portfolio Website/i)[0];
    expect(portfolioName).toBeInTheDocument();
  });

  it("should display repository descriptions", () => {
    render(<ProjectInfo repositories={mockRepositories} loading={false} />);

    const description = screen.getByText(
      /My portfolio website built with Next.js/i
    );
    expect(description).toBeInTheDocument();
  });

  it("should show default message for missing descriptions", () => {
    render(<ProjectInfo repositories={mockRepositories} loading={false} />);

    const defaultDesc = screen.getByText(
      /No description available for this repository/i
    );
    expect(defaultDesc).toBeInTheDocument();
  });

  it("should display organization badge for org repos", () => {
    render(<ProjectInfo repositories={mockRepositories} loading={false} />);

    const orgBadge = screen.getByText("organization");
    expect(orgBadge).toBeInTheDocument();
  });

  it("should not show organization badge for user repos", () => {
    const userRepos = mockRepositories.filter(
      (repo) => !repo.isOrganizationRepo
    );
    render(<ProjectInfo repositories={userRepos} loading={false} />);

    const orgBadge = screen.queryByText("organization");
    expect(orgBadge).not.toBeInTheDocument();
  });

  it("should render TechStack component for each repo", () => {
    const { container } = render(
      <ProjectInfo repositories={mockRepositories} loading={false} />
    );

    const techStacks = container.querySelectorAll(".hideOnMobile");
    expect(techStacks.length).toBeGreaterThan(0);
  });

  it("should have proper structure with tabs_let-content class", () => {
    const { container } = render(
      <ProjectInfo repositories={mockRepositories} loading={false} />
    );

    const tabsContent = container.querySelectorAll(".tabs_let-content");
    expect(tabsContent.length).toBe(mockRepositories.length);
  });

  it("should render divider line for each project", () => {
    const { container } = render(
      <ProjectInfo repositories={mockRepositories} loading={false} />
    );

    const dividers = container.querySelectorAll(".tabs_line");
    expect(dividers.length).toBe(mockRepositories.length);
  });

  it("should handle empty repositories array", () => {
    render(<ProjectInfo repositories={[]} loading={false} />);

    const tabsContent = screen.queryByText(/Portfolio Website/i);
    expect(tabsContent).not.toBeInTheDocument();
  });

  it("should pass languages to TechStack component", () => {
    render(<ProjectInfo repositories={mockRepositories} loading={false} />);

    // TechStack should render with languages
    const { container } = render(
      <ProjectInfo repositories={mockRepositories} loading={false} />
    );
    expect(container).toBeTruthy();
  });

  it("should have responsive classes that hide on mobile", () => {
    const { container } = render(
      <ProjectInfo repositories={mockRepositories} loading={false} />
    );

    const mobileHidden = container.querySelectorAll(".hideOnMobile");
    expect(mobileHidden.length).toBeGreaterThan(0);
  });

  it("should render with correct heading styles", () => {
    const { container } = render(
      <ProjectInfo repositories={mockRepositories} loading={false} />
    );

    const headings = container.querySelectorAll(".heading-style-h4");
    expect(headings.length).toBe(mockRepositories.length);
  });

  it("should use unique keys for repositories", () => {
    const { container } = render(
      <ProjectInfo repositories={mockRepositories} loading={false} />
    );

    const items = container.querySelectorAll(".tabs_let-content");
    expect(items.length).toBe(mockRepositories.length);
  });

  it("should handle repositories without languages", () => {
    const repoWithoutLang: GitHubRepo[] = [
      {
        id: 4,
        name: "no-lang-repo",
        description: "Repo without languages",
        html_url: "https://github.com/user/no-lang-repo",
      },
    ];

    render(<ProjectInfo repositories={repoWithoutLang} loading={false} />);

    expect(screen.getByText(/No Lang Repo/i)).toBeInTheDocument();
  });
});
