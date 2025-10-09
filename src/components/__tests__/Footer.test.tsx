import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer Component", () => {
  it("should render footer section", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it('should display "Get in Touch" heading', () => {
    render(<Footer />);
    const heading = screen.getByText("Get in Touch");
    expect(heading).toBeInTheDocument();
  });

  it("should display email address", () => {
    render(<Footer />);
    const email = screen.getByText("rudranarayanaknr@gmail.com");
    expect(email).toBeInTheDocument();
  });

  it('should display large name "RUDRA SAHOO"', () => {
    render(<Footer />);
    const name = screen.getByText("RUDRA SAHOO");
    expect(name).toBeInTheDocument();
  });

  it("should render all social media links", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it("should have GitHub link with correct href", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const githubLink = links.find((link) =>
      link.getAttribute("href")?.includes("github.com/rudra-sah00")
    );
    expect(githubLink).toBeDefined();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/rudra-sah00"
    );
  });

  it("should have LinkedIn link with correct href", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const linkedinLink = links.find((link) =>
      link.getAttribute("href")?.includes("linkedin.com")
    );
    expect(linkedinLink).toBeDefined();
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/rudra-narayana-sahoo-695342288/"
    );
  });

  it("should have Instagram link with correct href", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const instagramLink = links.find((link) =>
      link.getAttribute("href")?.includes("instagram.com")
    );
    expect(instagramLink).toBeDefined();
    expect(instagramLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/rudra.sah00/"
    );
  });

  it("should have Email link with correct mailto href", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const emailLink = links.find((link) =>
      link.getAttribute("href")?.includes("mailto:")
    );
    expect(emailLink).toBeDefined();
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:rudranarayanaknr@gmail.com"
    );
  });

  it("should render FloatingDock component", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector(".customFloatingDock")).toBeTruthy();
  });

  it("should have proper structure with sections", () => {
    const { container } = render(<Footer />);
    const getInTouchSection = container.querySelector(".getInTouchSection");
    const largeNameSection = container.querySelector(".largeNameSection");

    expect(getInTouchSection).toBeInTheDocument();
    expect(largeNameSection).toBeInTheDocument();
  });
});
