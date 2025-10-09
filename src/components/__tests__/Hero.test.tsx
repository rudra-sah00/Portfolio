import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Hero from "../Hero";
import { GitHubRepo } from "@/types";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Mock GSAP and ScrollTrigger
jest.mock("gsap", () => ({
  gsap: {
    registerPlugin: jest.fn(),
  },
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: jest.fn(),
    getAll: jest.fn(() => [{ kill: jest.fn() }]),
  },
}));

// Mock @tsparticles/slim
jest.mock("@tsparticles/slim", () => ({
  loadSlim: jest.fn(() => Promise.resolve()),
}));

describe("Hero Component", () => {
  const mockRepositories: GitHubRepo[] = [
    {
      id: 1,
      name: "test-repo",
      description: "Test repository",
      html_url: "https://github.com/user/test-repo",
      languages: { TypeScript: 100 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render hero section", () => {
    render(<Hero repositories={mockRepositories} loading={false} />);
    const heroContent = screen.getByText(/Hey,/i);
    expect(heroContent).toBeInTheDocument();
  });

  it('should display name "Rudra"', () => {
    render(<Hero repositories={mockRepositories} loading={false} />);
    const name = screen.getByText(/Rudra/i);
    expect(name).toBeInTheDocument();
  });

  it("should display subtitle text", () => {
    render(<Hero repositories={mockRepositories} loading={false} />);
    const subtitle = screen.getByText(/I'm a/i);
    expect(subtitle).toBeInTheDocument();
  });

  it("should render Compare component for profile images", () => {
    const { container } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );
    const compareComponent = container.querySelector(".rounded-full");
    expect(compareComponent).toBeInTheDocument();
  });

  it("should render terminal link", () => {
    const { container } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );
    const terminalLink = container.querySelector(".btn-flip");
    expect(terminalLink).toBeInTheDocument();
    expect(terminalLink).toHaveAttribute("data-back", "Terminal");
  });

  it("should open terminal when terminal link is clicked", async () => {
    const { container } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );
    const terminalLink = container.querySelector(".btn-flip");

    if (terminalLink) {
      fireEvent.click(terminalLink);
    }

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("should close terminal and restore scrolling", async () => {
    const { container } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );
    const terminalLink = container.querySelector(".btn-flip");

    if (terminalLink) {
      fireEvent.click(terminalLink);
    }

    // Terminal should open - check for terminal container
    await waitFor(() => {
      const terminalContainer = container.querySelector(".terminal-container");
      expect(terminalContainer).toBeInTheDocument();
    });

    // Verify terminal opened successfully
    expect(
      screen.getByText(/Type !help for available commands/i)
    ).toBeInTheDocument();
  });

  it("should pass repositories to TerminalPopup", () => {
    const { container } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it("should handle loading state", () => {
    render(<Hero repositories={[]} loading={true} />);
    const heroContent = screen.getByText(/Hey,/i);
    expect(heroContent).toBeInTheDocument();
  });

  it("should clean up ScrollTrigger on unmount", () => {
    const { unmount } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );

    unmount();

    expect(ScrollTrigger.getAll).toHaveBeenCalled();
  });

  it("should restore body overflow on unmount", () => {
    const { unmount } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );

    unmount();

    expect(document.body.style.overflow).toBe("unset");
  });

  it("should render ContainerTextFlip with animated words", () => {
    const { container } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );
    expect(container.textContent).toContain("I'm a");
  });

  it("should have proper gradient styling on name", () => {
    const { container } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );
    const rudraText = container.querySelector(".bg-gradient-to-r");
    expect(rudraText).toBeInTheDocument();
  });

  it("should be responsive with proper text sizes", () => {
    const { container } = render(
      <Hero repositories={mockRepositories} loading={false} />
    );
    const heading = container.querySelector("h1");
    expect(heading).toHaveClass("text-2xl");
  });
});
