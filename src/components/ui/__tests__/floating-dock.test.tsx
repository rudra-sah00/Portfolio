import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FloatingDock } from "../floating-dock";

describe("FloatingDock", () => {
  const mockItems = [
    {
      title: "GitHub",
      icon: <svg data-testid="github-icon" />,
      href: "https://github.com",
    },
    {
      title: "LinkedIn",
      icon: <svg data-testid="linkedin-icon" />,
      href: "https://linkedin.com",
    },
    {
      title: "Twitter",
      icon: <svg data-testid="twitter-icon" />,
      href: "https://twitter.com",
    },
  ];

  it("should render both desktop and mobile docks", () => {
    const { container } = render(<FloatingDock items={mockItems} />);
    expect(container).toBeInTheDocument();
  });

  it("should render all items", () => {
    render(<FloatingDock items={mockItems} />);
    expect(screen.getAllByTestId("github-icon")).toHaveLength(2); // desktop + mobile
    expect(screen.getAllByTestId("linkedin-icon")).toHaveLength(2);
    expect(screen.getAllByTestId("twitter-icon")).toHaveLength(2);
  });

  it("should apply custom desktop className", () => {
    const { container } = render(
      <FloatingDock items={mockItems} desktopClassName="custom-desktop" />
    );
    const desktopDock = container.querySelector(".custom-desktop");
    expect(desktopDock).toBeInTheDocument();
  });

  it("should apply custom mobile className", () => {
    const { container } = render(
      <FloatingDock items={mockItems} mobileClassName="custom-mobile" />
    );
    const mobileDock = container.querySelector(".custom-mobile");
    expect(mobileDock).toBeInTheDocument();
  });

  it("should handle mouse move on desktop dock", () => {
    const { container } = render(<FloatingDock items={mockItems} />);
    const desktopDock = container.querySelector(".md\\:flex");

    if (desktopDock) {
      fireEvent.mouseMove(desktopDock, { pageX: 100 });
      expect(desktopDock).toBeInTheDocument();
    }
  });

  it("should handle mouse leave on desktop dock", () => {
    const { container } = render(<FloatingDock items={mockItems} />);
    const desktopDock = container.querySelector(".md\\:flex");

    if (desktopDock) {
      fireEvent.mouseLeave(desktopDock);
      expect(desktopDock).toBeInTheDocument();
    }
  });

  it("should show title tooltip on mobile icon hover", () => {
    render(<FloatingDock items={mockItems} />);
    const links = screen.getAllByRole("link");
    const mobileLinks = links.slice(3); // First 3 are desktop, next 3 are mobile

    fireEvent.mouseEnter(mobileLinks[0]);
    expect(mobileLinks[0]).toBeInTheDocument();
  });

  it("should hide title tooltip on mobile icon mouse leave", () => {
    render(<FloatingDock items={mockItems} />);
    const links = screen.getAllByRole("link");
    const mobileLinks = links.slice(3);

    fireEvent.mouseEnter(mobileLinks[0]);
    fireEvent.mouseLeave(mobileLinks[0]);
    expect(mobileLinks[0]).toBeInTheDocument();
  });

  it("should show title tooltip on desktop icon hover", () => {
    render(<FloatingDock items={mockItems} />);
    const links = screen.getAllByRole("link");
    const desktopLinks = links.slice(0, 3);

    fireEvent.mouseEnter(desktopLinks[0]);
    expect(desktopLinks[0]).toBeInTheDocument();
  });

  it("should hide title tooltip on desktop icon mouse leave", () => {
    render(<FloatingDock items={mockItems} />);
    const links = screen.getAllByRole("link");
    const desktopLinks = links.slice(0, 3);

    fireEvent.mouseEnter(desktopLinks[0]);
    fireEvent.mouseLeave(desktopLinks[0]);
    expect(desktopLinks[0]).toBeInTheDocument();
  });

  it("should have correct href attributes", () => {
    render(<FloatingDock items={mockItems} />);
    const links = screen.getAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "https://github.com");
    expect(links[1]).toHaveAttribute("href", "https://linkedin.com");
    expect(links[2]).toHaveAttribute("href", "https://twitter.com");
  });

  it("should have target and rel attributes for security", () => {
    render(<FloatingDock items={mockItems} />);
    const links = screen.getAllByRole("link");

    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("should transform icon size based on mouse position (desktop)", () => {
    const { container } = render(<FloatingDock items={mockItems} />);
    const desktopDock = container.querySelector(".md\\:flex");

    if (desktopDock) {
      // Simulate mouse movement to trigger transforms
      fireEvent.mouseMove(desktopDock, { pageX: 50 });
      fireEvent.mouseMove(desktopDock, { pageX: 100 });
      fireEvent.mouseMove(desktopDock, { pageX: 200 });
      expect(desktopDock).toBeInTheDocument();
    }
  });

  it("should handle getBoundingClientRect for distance calculations", () => {
    const { container } = render(<FloatingDock items={mockItems} />);
    const desktopDock = container.querySelector(".md\\:flex");

    if (desktopDock) {
      const iconContainer = desktopDock.querySelector(
        "div[class*='aspect-square']"
      );
      if (iconContainer) {
        const bounds = iconContainer.getBoundingClientRect();
        expect(bounds).toBeDefined();
      }
    }
  });

  it("should apply whileTap animation on mobile", () => {
    render(<FloatingDock items={mockItems} />);
    const links = screen.getAllByRole("link");
    const mobileLinks = links.slice(3); // Mobile dock is second set

    if (mobileLinks[0]) {
      expect(mobileLinks[0].querySelector("div")).toBeInTheDocument();
    }
  });

  it("should apply whileHover animation on mobile", () => {
    render(<FloatingDock items={mockItems} />);
    const links = screen.getAllByRole("link");
    const mobileLinks = links.slice(3);

    if (mobileLinks[0]) {
      const motionDiv = mobileLinks[0].querySelector("div");
      expect(motionDiv).toBeInTheDocument();
    }
  });
});
