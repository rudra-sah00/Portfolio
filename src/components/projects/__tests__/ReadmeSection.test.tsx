import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReadmeSection from "../ReadmeSection";
import { GitHubRepo } from "@/types";

describe("ReadmeSection", () => {
  const mockRepo: GitHubRepo = {
    id: 1,
    name: "test-repo",
    description: "Test repository",
    html_url: "https://github.com/user/test-repo",
    languages: { TypeScript: 80, JavaScript: 20 },
    readme_content: "# Test README\n\nThis is test content.",
    owner: {
      login: "testuser",
      type: "User",
    },
  };

  it("should render loading state", () => {
    render(<ReadmeSection repositories={[]} loading={true} />);
    expect(screen.getByText("Loading README...")).toBeInTheDocument();
  });

  it("should render readme content when loaded", () => {
    render(<ReadmeSection repositories={[mockRepo]} loading={false} />);
    expect(screen.queryByText("Loading README...")).not.toBeInTheDocument();
    expect(screen.getByText(/Test README/i)).toBeInTheDocument();
  });

  it("should render multiple repositories", () => {
    const mockRepo2: GitHubRepo = {
      ...mockRepo,
      id: 2,
      name: "test-repo-2",
      readme_content: "# Second README\n\nSecond content.",
    };

    render(
      <ReadmeSection repositories={[mockRepo, mockRepo2]} loading={false} />
    );
    expect(screen.getByText(/Test README/i)).toBeInTheDocument();
    expect(screen.getByText(/Second README/i)).toBeInTheDocument();
  });

  it("should render default message when repo has no readme", () => {
    const repoWithoutReadme: GitHubRepo = {
      ...mockRepo,
      readme_content: undefined,
    };

    render(
      <ReadmeSection repositories={[repoWithoutReadme]} loading={false} />
    );
    expect(screen.getByText(/No README available/i)).toBeInTheDocument();
  });

  it("should not show loading when repositories are present", () => {
    render(<ReadmeSection repositories={[mockRepo]} loading={false} />);
    expect(screen.queryByText("Loading README...")).not.toBeInTheDocument();
  });

  it("should render empty array without errors", () => {
    const { container } = render(
      <ReadmeSection repositories={[]} loading={false} />
    );
    expect(container.querySelector(".tabs_right")).toBeInTheDocument();
  });
});
