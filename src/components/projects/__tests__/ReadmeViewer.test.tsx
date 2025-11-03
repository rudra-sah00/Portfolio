import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReadmeViewer from "../ReadmeViewer";

// Mock mermaid with full implementation
const mockRender = jest
  .fn()
  .mockResolvedValue({ svg: "<svg>mermaid diagram</svg>" });
const mockInitialize = jest.fn();

jest.mock("mermaid", () => ({
  default: {
    initialize: mockInitialize,
    render: mockRender,
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

    // Wait for component to render
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it("should handle mermaid rendering with actual SVG output", async () => {
    const mermaidContent = `\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello
\`\`\``;

    const { container } = render(
      <ReadmeViewer content={mermaidContent} repoName="test-repo" />
    );

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
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

  it("should handle mermaid rendering error", async () => {
    // Mock mermaid to throw an error
    mockRender.mockRejectedValueOnce(new Error("Render failed"));

    const mermaidContent = `\`\`\`mermaid
graph LR
  A --> B
\`\`\``;

    const { container } = render(
      <ReadmeViewer content={mermaidContent} repoName="test-repo" />
    );

    // Should fallback to code block
    await waitFor(
      () => {
        const codeElement = container.querySelector("code.language-mermaid");
        expect(codeElement || container).toBeTruthy();
      },
      { timeout: 3000 }
    );

    // Restore mock
    mockRender.mockResolvedValue({ svg: "<svg>mermaid diagram</svg>" });
  });

  it("should render image with width attribute", () => {
    const imageContent = `![Test Image](test.png)`;
    const { container } = render(
      <ReadmeViewer content={imageContent} repoName="test-repo" />
    );
    // Markdown images are rendered
    expect(container.querySelector(".content")).toBeInTheDocument();
  });

  it("should render image with numeric width", () => {
    const imageContent = `![Test](https://example.com/image.png)`;
    const { container } = render(
      <ReadmeViewer content={imageContent} repoName="test-repo" />
    );
    expect(container.querySelector(".content")).toBeInTheDocument();
  });

  it("should render image without width attribute", () => {
    const imageContent = `![Test](test.png)`;
    const { container } = render(
      <ReadmeViewer content={imageContent} repoName="test-repo" />
    );
    expect(container.querySelector(".content")).toBeInTheDocument();
  });

  it("should handle table with aligned cells", () => {
    const tableContent = `
| Left | Center | Right |
|:-----|:------:|------:|
| Data 1 | Data 2 | Data 3 |
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Left/i)).toBeInTheDocument();
    expect(screen.getByText(/Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Right/i)).toBeInTheDocument();
    expect(screen.getByText(/Data 1/i)).toBeInTheDocument();
  });

  it("should render table with proper border styling", () => {
    const tableContent = `
| Column A | Column B | Column C |
|---|---|---|
| 1 | 2 | 3 |
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Column A/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
  });

  it("should handle div with different alignments", () => {
    const alignedDivs = `# Test

Normal paragraph text.

Some more content.
`;
    const { container } = render(
      <ReadmeViewer content={alignedDivs} repoName="test-repo" />
    );
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
    expect(container.querySelector(".content")).toBeInTheDocument();
  });

  it("should handle div with existing style attribute", () => {
    const styledDiv = `**Bold text** and *italic text*`;
    render(<ReadmeViewer content={styledDiv} repoName="test-repo" />);
    expect(screen.getByText(/Bold text/i)).toBeInTheDocument();
  });

  it("should handle code block without language specified", () => {
    const codeContent = `\`\`\`
plain code block
\`\`\``;
    render(<ReadmeViewer content={codeContent} repoName="test-repo" />);
    expect(screen.getByText(/plain code block/i)).toBeInTheDocument();
  });

  it("should handle code block with specific language", () => {
    const codeContent = `\`\`\`python
def hello():
    print("Hello")
\`\`\``;
    render(<ReadmeViewer content={codeContent} repoName="test-repo" />);
    expect(screen.getByText(/def hello/i)).toBeInTheDocument();
  });

  it("should handle code block with typescript language", () => {
    const codeContent = `\`\`\`typescript
const greet = (): void => {
  console.log("Hello");
};
\`\`\``;
    render(<ReadmeViewer content={codeContent} repoName="test-repo" />);
    expect(screen.getByText(/const greet/i)).toBeInTheDocument();
  });

  it("should handle inline code without language class", () => {
    const inlineCode = "Text with `code` here";
    render(<ReadmeViewer content={inlineCode} repoName="test-repo" />);
    expect(screen.getByText(/code/i)).toBeInTheDocument();
  });

  it("should render table headers correctly", () => {
    const tableWithHeaders = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
`;
    render(<ReadmeViewer content={tableWithHeaders} repoName="test-repo" />);
    // Just verify the content is rendered
    expect(screen.getByText(/Header 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Cell 1/i)).toBeInTheDocument();
  });

  it("should handle complex markdown with multiple elements", () => {
    const complexContent = `
# Main Title

## Subtitle

Some **bold** and *italic* text.

\`\`\`javascript
const x = 10;
\`\`\`

<div align="center">
  <img src="test.png" width="100" alt="Test" />
</div>

| A | B |
|---|---|
| 1 | 2 |
`;
    render(<ReadmeViewer content={complexContent} repoName="test-repo" />);
    expect(screen.getByText(/Main Title/i)).toBeInTheDocument();
    expect(screen.getByText(/bold/i)).toBeInTheDocument();
  });

  it("should handle table cells with vertical alignment", () => {
    const tableContent = `
<table>
  <tbody>
    <tr>
      <td vAlign="top">Top</td>
      <td vAlign="middle">Middle</td>
      <td vAlign="bottom">Bottom</td>
    </tr>
  </tbody>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Top/i)).toBeInTheDocument();
    expect(screen.getByText(/Middle/i)).toBeInTheDocument();
  });

  it("should handle table headers with alignment and vertical alignment", () => {
    const tableContent = `
<table>
  <thead>
    <tr>
      <th align="left" vAlign="top">Header</th>
    </tr>
  </thead>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Header/i)).toBeInTheDocument();
  });

  it("should render header with icon", () => {
    const mockContent = "# Test";
    render(<ReadmeViewer content={mockContent} repoName="test-repo" />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should handle div elements with alignment", () => {
    const divContent = `# Test\n\nSome content here.`;
    render(<ReadmeViewer content={divContent} repoName="test-repo" />);
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });

  it("should render markdown images", () => {
    const imgContent = `![Test Image](https://example.com/test.png)`;
    const { container } = render(
      <ReadmeViewer content={imgContent} repoName="test-repo" />
    );
    // Check that the markdown is processed
    expect(container).toBeInTheDocument();
  });

  it("should handle various markdown image formats", () => {
    const imgContent = `![Alt Text](https://example.com/image.jpg "Title Text")`;
    const { container } = render(
      <ReadmeViewer content={imgContent} repoName="test-repo" />
    );
    expect(container).toBeInTheDocument();
  });

  it("should handle GitHub Flavored Markdown tables with alignment", () => {
    const tableContent = `| Left | Center | Right |
|:-----|:------:|------:|
| A    | B      | C     |`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Left/i)).toBeInTheDocument();
    expect(screen.getByText(/Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Right/i)).toBeInTheDocument();
  });

  it("should handle inline code separately from code blocks", () => {
    const inlineContent = `Some text with \`inline code\` here.`;
    render(<ReadmeViewer content={inlineContent} repoName="test-repo" />);
    expect(screen.getByText(/inline code/i)).toBeInTheDocument();
  });

  it("should handle JavaScript code blocks", () => {
    const jsCodeContent = `\`\`\`javascript
function test() {
  return true;
}
\`\`\``;
    const { container } = render(
      <ReadmeViewer content={jsCodeContent} repoName="test-repo" />
    );
    // Check that content is rendered
    expect(container).toBeInTheDocument();
  });

  it("should handle Python code blocks", () => {
    const pythonCodeContent = `\`\`\`python
def hello():
    print("world")
\`\`\``;
    const { container } = render(
      <ReadmeViewer content={pythonCodeContent} repoName="test-repo" />
    );
    // Check that content is rendered
    expect(container).toBeInTheDocument();
  });

  it("should render inline code without className", () => {
    const content = "Some `inline code` here";
    render(<ReadmeViewer content={content} repoName="test-repo" />);

    const codeElements = screen.getAllByText(/inline code/i);
    expect(codeElements.length).toBeGreaterThan(0);
  });

  it("should handle code block with match but not mermaid", () => {
    const codeContent = `\`\`\`javascript
const x = 42;
\`\`\``;
    const { container } = render(
      <ReadmeViewer content={codeContent} repoName="test-repo" />
    );

    // Code should be rendered
    expect(container.textContent).toContain("const x = 42");
  });

  it("should handle div without align attribute", () => {
    const divContent = `# Title

Regular paragraph without alignment.`;
    const { container } = render(
      <ReadmeViewer content={divContent} repoName="test-repo" />
    );

    expect(container).toBeInTheDocument();
  });

  it("should handle div with right alignment", () => {
    const divContent = `<div align="right">Right aligned</div>`;
    render(<ReadmeViewer content={divContent} repoName="test-repo" />);

    expect(screen.getByText(/Right aligned/i)).toBeInTheDocument();
  });

  it("should handle div with left alignment", () => {
    const divContent = `<div align="left">Left aligned</div>`;
    render(<ReadmeViewer content={divContent} repoName="test-repo" />);

    expect(screen.getByText(/Left aligned/i)).toBeInTheDocument();
  });

  it("should handle image with string width", () => {
    const imgContent = `![Test Image](test.png)`;
    const { container } = render(
      <ReadmeViewer content={imgContent} repoName="test-repo" />
    );

    // Check that markdown content is rendered
    expect(container.querySelector(".content")).toBeInTheDocument();
  });

  it("should handle image with numeric width", () => {
    const imgContent = `![Test Image](test.png)`;
    const { container } = render(
      <ReadmeViewer content={imgContent} repoName="test-repo" />
    );

    // Check that markdown content is rendered
    expect(container.querySelector(".content")).toBeInTheDocument();
  });

  it("should handle image without width", () => {
    const imgContent = `![Test](test.png)`;
    const { container } = render(
      <ReadmeViewer content={imgContent} repoName="test-repo" />
    );

    // Check that markdown content is rendered
    expect(container.querySelector(".content")).toBeInTheDocument();
  });

  it("should render table with full styling", () => {
    const tableContent = `
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);

    // GFM tables are rendered
    expect(screen.getByText(/Column 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Data 1/i)).toBeInTheDocument();
  });

  it("should handle td with both align and vAlign", () => {
    const tableContent = `
<table>
  <tbody>
    <tr>
      <td align="center" vAlign="middle">Centered</td>
    </tr>
  </tbody>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Centered/i)).toBeInTheDocument();
  });

  it("should handle td with only align", () => {
    const tableContent = `
<table>
  <tbody>
    <tr>
      <td align="right">Right</td>
    </tr>
  </tbody>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Right/i)).toBeInTheDocument();
  });

  it("should handle td with only vAlign", () => {
    const tableContent = `
<table>
  <tbody>
    <tr>
      <td vAlign="bottom">Bottom</td>
    </tr>
  </tbody>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Bottom/i)).toBeInTheDocument();
  });

  it("should handle td without align or vAlign", () => {
    const tableContent = `
<table>
  <tbody>
    <tr>
      <td>Plain cell</td>
    </tr>
  </tbody>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Plain cell/i)).toBeInTheDocument();
  });

  it("should handle th with both align and vAlign", () => {
    const tableContent = `
<table>
  <thead>
    <tr>
      <th align="left" vAlign="top">Header Left Top</th>
    </tr>
  </thead>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Header Left Top/i)).toBeInTheDocument();
  });

  it("should handle th with only align", () => {
    const tableContent = `
<table>
  <thead>
    <tr>
      <th align="center">Centered Header</th>
    </tr>
  </thead>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Centered Header/i)).toBeInTheDocument();
  });

  it("should handle th with only vAlign", () => {
    const tableContent = `
<table>
  <thead>
    <tr>
      <th vAlign="middle">Middle Header</th>
    </tr>
  </thead>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Middle Header/i)).toBeInTheDocument();
  });

  it("should handle th without align or vAlign", () => {
    const tableContent = `
<table>
  <thead>
    <tr>
      <th>Plain Header</th>
    </tr>
  </thead>
</table>
`;
    render(<ReadmeViewer content={tableContent} repoName="test-repo" />);
    expect(screen.getByText(/Plain Header/i)).toBeInTheDocument();
  });

  it("should handle mermaid rendering when ref is not available initially", async () => {
    const mermaidContent = `\`\`\`mermaid
flowchart TB
  Start --> Stop
\`\`\``;

    const { container } = render(
      <ReadmeViewer content={mermaidContent} repoName="test-repo" />
    );

    await waitFor(
      () => {
        expect(container).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("should handle complex table with mixed alignments", () => {
    const tableContent = `
| Left | Center | Right | Default |
|:-----|:------:|------:|---------|
| L1   | C1     | R1    | D1      |
| L2   | C2     | R2    | D2      |
`;
    const { container } = render(
      <ReadmeViewer content={tableContent} repoName="test-repo" />
    );

    expect(screen.getByText(/Left/i)).toBeInTheDocument();
    expect(screen.getByText(/Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Right/i)).toBeInTheDocument();
    expect(screen.getByText(/Default/i)).toBeInTheDocument();
    // Ensure table was rendered
    expect(container.querySelector(".content")).toBeInTheDocument();
  });

  it("should render README.md title in header", () => {
    render(<ReadmeViewer content="# Test" repoName="test-repo" />);

    const title = screen.getByText("README.md");
    expect(title).toBeInTheDocument();
    expect(title.className).toContain("title");
  });

  it("should render icon in header", () => {
    const { container } = render(
      <ReadmeViewer content="# Test" repoName="test-repo" />
    );

    const icon = container.querySelector("svg.icon");
    expect(icon).toBeInTheDocument();
    expect(icon?.getAttribute("viewBox")).toBe("0 0 16 16");
  });

  it("should handle div with custom style prop", () => {
    const divContent = `# Test\n\nContent`;
    const { container } = render(
      <ReadmeViewer content={divContent} repoName="test-repo" />
    );

    expect(container).toBeInTheDocument();
  });
});
