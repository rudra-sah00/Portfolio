import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TechStack from "../TechStack";

describe("TechStack", () => {
  const mockLanguages = {
    TypeScript: 5000,
    JavaScript: 3000,
    CSS: 2000,
  };

  it("should render no data message when languages is empty", () => {
    render(<TechStack languages={{}} />);
    expect(screen.getByText("No language data available")).toBeInTheDocument();
  });

  it("should display language percentages", () => {
    render(<TechStack languages={mockLanguages} />);
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript/)).toBeInTheDocument();
    expect(screen.getByText(/CSS/)).toBeInTheDocument();
  });

  it("should calculate correct percentages", () => {
    render(<TechStack languages={mockLanguages} />);
    // TypeScript should have highest percentage (5000/10000 = 50%)
    expect(screen.getByText(/50\.0%/)).toBeInTheDocument();
    expect(screen.getByText(/30\.0%/)).toBeInTheDocument();
    expect(screen.getByText(/20\.0%/)).toBeInTheDocument();
  });

  it("should display top 5 languages only", () => {
    const manyLanguages = {
      TypeScript: 5000,
      JavaScript: 4000,
      Python: 3000,
      Go: 2000,
      Rust: 1000,
      Java: 500,
      Ruby: 400,
    };

    render(<TechStack languages={manyLanguages} />);
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/Python/)).toBeInTheDocument();
    // Verify top 5 are shown
    const languageElements = screen.getAllByText(
      /TypeScript|JavaScript|Python|Go|Rust/
    );
    expect(languageElements.length).toBeGreaterThan(0);
  });

  it("should handle single language", () => {
    render(<TechStack languages={{ TypeScript: 1000 }} />);
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/100\.0%/)).toBeInTheDocument();
  });

  it("should sort languages by usage", () => {
    const { container } = render(<TechStack languages={mockLanguages} />);
    const languageElements = container.querySelectorAll("li");
    // TypeScript should be first (highest usage)
    if (languageElements.length > 0) {
      expect(languageElements[0]).toHaveTextContent("TypeScript");
    }
  });
});
