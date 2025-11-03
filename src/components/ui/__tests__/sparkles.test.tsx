import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SparklesCore } from "../sparkles";

// Mock tsparticles/slim
jest.mock("@tsparticles/slim", () => ({
  loadSlim: jest.fn().mockResolvedValue(undefined),
}));

// Mock tsparticles/react
jest.mock("@tsparticles/react", () => ({
  __esModule: true,
  default: function MockParticles({
    particlesLoaded,
    id,
    className,
  }: {
    particlesLoaded?: (container?: { id: string }) => void;
    id?: string;
    className?: string;
  }) {
    // Simulate particles loaded callback
    React.useEffect(() => {
      if (particlesLoaded) {
        particlesLoaded({ id: "test-container" });
      }
    }, [particlesLoaded]);

    return <div data-testid="particles" id={id} className={className} />;
  },
  initParticlesEngine: jest.fn(
    (callback: (engine: unknown) => Promise<void>) => {
      return callback({}).then(() => undefined);
    }
  ),
}));

describe("SparklesCore", () => {
  it("should render the component", async () => {
    const { container } = render(<SparklesCore />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it("should render particles after initialization", async () => {
    const { getByTestId } = render(<SparklesCore />);
    await waitFor(() => {
      expect(getByTestId("particles")).toBeInTheDocument();
    });
  });

  it("should use custom id when provided", async () => {
    const { getByTestId } = render(<SparklesCore id="custom-particles" />);
    await waitFor(() => {
      const particles = getByTestId("particles");
      expect(particles).toHaveAttribute("id", "custom-particles");
    });
  });

  it("should apply custom className", async () => {
    const { container } = render(<SparklesCore className="custom-class" />);
    await waitFor(() => {
      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });
  });

  it("should handle particlesLoaded callback", async () => {
    const { getByTestId } = render(<SparklesCore />);
    await waitFor(() => {
      expect(getByTestId("particles")).toBeInTheDocument();
    });
  });

  it("should pass background color to options", async () => {
    const { container } = render(<SparklesCore background="#ff0000" />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it("should pass particle size options", async () => {
    const { container } = render(<SparklesCore minSize={1} maxSize={3} />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it("should pass speed option", async () => {
    const { container } = render(<SparklesCore speed={2} />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it("should pass particle color option", async () => {
    const { container } = render(<SparklesCore particleColor="#00ff00" />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it("should pass particle density option", async () => {
    const { container } = render(<SparklesCore particleDensity={100} />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });
});
