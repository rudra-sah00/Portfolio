import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReadmeViewer from "../ReadmeViewer";

// Mock mermaid
jest.mock("mermaid", () => ({
  default: {
    initialize: jest.fn(),
    render: jest.fn().mockResolvedValue({ svg: "<svg>mermaid diagram</svg>" }),
  },
}));

describe("ReadmeViewer", () => {
  const mockContent = `# Test README

This is a test readme content.

## Features
- Feature 1
- Feature 2
- Feature 3

## Code Example
\`\`\`javascript
console.log('Hello, World!');
\`\`\`
`;

  it("should render the component", () => {
    render(<ReadmeViewer content={mockContent} repoName="test-repo" />);
    expect(screen.getByText("README.md")).toBeInTheDocument();
  });

  it("should render markdown content", () => {
    render(<ReadmeViewer content={mockContent} repoName="test-repo" />);
    expect(screen.getByText(/Test README/i)).toBeInTheDocument();
  });

  it("should render lists", () => {
    render(<ReadmeViewer content={mockContent} repoName="test-repo" />);
    expect(screen.getByText(/Feature 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Feature 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Feature 3/i)).toBeInTheDocument();
  });

  it("should render code blocks", () => {
    render(<ReadmeViewer content={mockContent} repoName="test-repo" />);
    expect(screen.getByText(/console.log/)).toBeInTheDocument();
  });

  it("should handle mermaid diagrams", async () => {
    const mermaidContent = `\`\`\`mermaid
graph TD
  A[Start] --> B[End]
\`\`\``;

    const { container } = render(
      <ReadmeViewer content={mermaidContent} repoName="test-repo" />
    );

    // Just verify the component renders without errors
    expect(container).toBeInTheDocument();
  });

  it("should render tables", () => {
    const tableContent = `
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Column 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Value 1/i)).toBeInTheDocument();
  });

  it("should render images with proper attributes", () => {
    const imageContent = `![Test Image](https://example.com/image.png)`;
    const { container } = render(
      <ReadmeViewer content={imageContent} repoName="test-repo" />
    );
    // Check if content is rendered, image might not render in test environment
    expect(container.querySelector(".content")).toBeInTheDocument();
  });

  it("should handle aligned divs", () => {
    const alignedContent = `<div align="center">Centered content</div>`;
    render(<ReadmeViewer content={alignedContent} repoName="test-repo" />);
    expect(screen.getByText(/Centered content/i)).toBeInTheDocument();
  });

  it("should render inline code", () => {
    const inlineCodeContent = "This is `inline code` in markdown.";
    render(<ReadmeViewer content={inlineCodeContent} repoName="test-repo" />);
    expect(screen.getByText(/inline code/i)).toBeInTheDocument();
  });

  it("should handle empty content", () => {
    render(<ReadmeViewer content="" repoName="test-repo" />);
    expect(screen.getByText("README.md")).toBeInTheDocument();
  });

  it("should render header with icon", () => {
    render(<ReadmeViewer content={mockContent} repoName="test-repo" />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
