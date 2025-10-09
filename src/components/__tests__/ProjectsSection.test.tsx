import { render, screen } from "@testing-library/react";
import ProjectsSection from "../ProjectsSection";
import { GitHubRepo } from "@/types";
import * as hooks from "@/hooks";

// Mock the scroll animation hook
jest.mock("@/hooks", () => ({
  useScrollAnimation: jest.fn(),
}));

describe("ProjectsSection Component", () => {
  const mockRepositories: GitHubRepo[] = [
    {
      id: 1,
      name: "portfolio-website",
      description: "My portfolio website",
      html_url: "https://github.com/user/portfolio-website",
      languages: { TypeScript: 70, JavaScript: 20, CSS: 10 },
    },
    {
      id: 2,
      name: "blog-app",
      description: "A blog application",
      html_url: "https://github.com/user/blog-app",
      languages: { Python: 80, HTML: 20 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = "unset";
  });

  it("should render loading state", () => {
    render(<ProjectsSection repositories={[]} loading={true} />);

    const loadingText = screen.getByText(/Loading Projects/i);
    expect(loadingText).toBeInTheDocument();
  });

  it("should display loading spinner when loading", () => {
    const { container } = render(
      <ProjectsSection repositories={[]} loading={true} />
    );

    const spinner = container.querySelector(".loading-spinner");
    expect(spinner).toBeInTheDocument();
  });

  it('should display "Fetching repositories" message', () => {
    render(<ProjectsSection repositories={[]} loading={true} />);

    const message = screen.getByText(/Fetching repositories from GitHub/i);
    expect(message).toBeInTheDocument();
  });

  it("should prevent scrolling when loading", () => {
    render(<ProjectsSection repositories={[]} loading={true} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should restore scrolling when not loading", () => {
    const { rerender } = render(
      <ProjectsSection repositories={[]} loading={true} />
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <ProjectsSection repositories={mockRepositories} loading={false} />
    );

    expect(document.body.style.overflow).toBe("unset");
  });

  it("should render repositories when loaded", () => {
    render(<ProjectsSection repositories={mockRepositories} loading={false} />);

    expect(screen.queryByText(/Loading Projects/i)).not.toBeInTheDocument();
  });

  it("should render ProjectInfo component", () => {
    const { container } = render(
      <ProjectsSection repositories={mockRepositories} loading={false} />
    );

    const projectInfo = container.querySelector(".tabs_left-top");
    expect(projectInfo).toBeInTheDocument();
  });

  it("should render ReadmeSection component", () => {
    const { container } = render(
      <ProjectsSection repositories={mockRepositories} loading={false} />
    );

    const readmeSection = container.querySelector(".tabs_right");
    expect(readmeSection).toBeTruthy();
  });

  it("should render GitHubButton component", () => {
    render(<ProjectsSection repositories={mockRepositories} loading={false} />);

    const githubButton = screen.getByText(/View on GitHub/i);
    expect(githubButton).toBeInTheDocument();
  });

  it("should call useScrollAnimation hook with repositories", () => {
    render(<ProjectsSection repositories={mockRepositories} loading={false} />);

    expect(hooks.useScrollAnimation).toHaveBeenCalledWith(mockRepositories);
  });

  it("should restore scrolling on unmount", () => {
    const { unmount } = render(
      <ProjectsSection repositories={mockRepositories} loading={false} />
    );

    document.body.style.overflow = "hidden";

    unmount();

    expect(document.body.style.overflow).toBe("unset");
  });

  it("should handle empty repositories array", () => {
    render(<ProjectsSection repositories={[]} loading={false} />);

    expect(screen.queryByText(/Loading Projects/i)).not.toBeInTheDocument();
  });

  it("should have proper section structure", () => {
    const { container } = render(
      <ProjectsSection repositories={mockRepositories} loading={false} />
    );

    const section = container.querySelector(".section_tabs");
    expect(section).toBeInTheDocument();
  });

  it("should render loading animation with three spinner rings", () => {
    const { container } = render(
      <ProjectsSection repositories={[]} loading={true} />
    );

    const spinnerRings = container.querySelectorAll(".spinner-ring");
    expect(spinnerRings).toHaveLength(3);
  });

  it("should update when repositories change", () => {
    const { rerender } = render(
      <ProjectsSection repositories={[]} loading={false} />
    );

    rerender(
      <ProjectsSection repositories={mockRepositories} loading={false} />
    );

    expect(screen.queryByText(/Loading Projects/i)).not.toBeInTheDocument();
  });
});
