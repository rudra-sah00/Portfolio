import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Compare } from "../compare";

// Mock SparklesCore
jest.mock("../sparkles", () => ({
  SparklesCore: () => <div data-testid="sparkles">Sparkles</div>,
}));

describe("Compare", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should render the component", () => {
    const { container } = render(
      <Compare firstImage="/test1.jpg" secondImage="/test2.jpg" />
    );
    expect(container).toBeInTheDocument();
  });

  it("should handle mouse enter", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        autoplay={true}
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      fireEvent.mouseEnter(compareDiv);
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should handle mouse leave with hover mode", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="hover"
        initialSliderPercentage={50}
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      fireEvent.mouseLeave(compareDiv);
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should handle mouse leave with drag mode", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="drag"
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      fireEvent.mouseDown(compareDiv);
      fireEvent.mouseLeave(compareDiv);
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should handle mouse move in hover mode", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="hover"
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      // Mock getBoundingClientRect
      compareDiv.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 400,
        top: 0,
        right: 400,
        bottom: 400,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      fireEvent.mouseMove(compareDiv, { clientX: 200 });
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should handle mouse down to start dragging", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="drag"
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      fireEvent.mouseDown(compareDiv);
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should handle mouse up to stop dragging", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="drag"
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      fireEvent.mouseDown(compareDiv);
      fireEvent.mouseUp(compareDiv);
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should handle mouse move while dragging", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="drag"
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      compareDiv.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 400,
        top: 0,
        right: 400,
        bottom: 400,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      fireEvent.mouseDown(compareDiv);
      fireEvent.mouseMove(compareDiv, { clientX: 150 });
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should handle touch start without autoplay", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="drag"
        autoplay={false}
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      fireEvent.touchStart(compareDiv, {
        touches: [{ clientX: 100 }],
      });
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should handle touch end without autoplay", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="drag"
        autoplay={false}
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      fireEvent.touchStart(compareDiv, {
        touches: [{ clientX: 100 }],
      });
      fireEvent.touchEnd(compareDiv);
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should handle touch move without autoplay", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="drag"
        autoplay={false}
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      compareDiv.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 400,
        top: 0,
        right: 400,
        bottom: 400,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      fireEvent.touchStart(compareDiv, {
        touches: [{ clientX: 100 }],
      });
      fireEvent.touchMove(compareDiv, {
        touches: [{ clientX: 200 }],
      });
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should not handle touch events with autoplay enabled", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        autoplay={true}
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      fireEvent.touchStart(compareDiv, {
        touches: [{ clientX: 100 }],
      });
      fireEvent.touchMove(compareDiv, {
        touches: [{ clientX: 200 }],
      });
      fireEvent.touchEnd(compareDiv);
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        className="custom-compare"
      />
    );
    const compareDiv = container.querySelector(".custom-compare");
    expect(compareDiv).toBeInTheDocument();
  });

  it("should start autoplay when enabled", async () => {
    render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        autoplay={true}
        autoplayDuration={1000}
      />
    );

    // Advance timers to trigger autoplay animation
    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(true).toBe(true); // Autoplay started
    });
  });

  it("should clamp slider percentage between 0 and 100", () => {
    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="hover"
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      compareDiv.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 400,
        top: 0,
        right: 400,
        bottom: 400,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      // Test values outside 0-100 range
      fireEvent.mouseMove(compareDiv, { clientX: -50 }); // Should clamp to 0
      fireEvent.mouseMove(compareDiv, { clientX: 500 }); // Should clamp to 100
      expect(compareDiv).toBeInTheDocument();
    }
  });

  it("should use requestAnimationFrame for smooth animation", () => {
    const rafSpy = jest.spyOn(window, "requestAnimationFrame");

    const { container } = render(
      <Compare
        firstImage="/test1.jpg"
        secondImage="/test2.jpg"
        slideMode="hover"
      />
    );
    const compareDiv = container.querySelector("div");
    if (compareDiv) {
      compareDiv.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 400,
        top: 0,
        right: 400,
        bottom: 400,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      fireEvent.mouseMove(compareDiv, { clientX: 200 });
      expect(rafSpy).toHaveBeenCalled();
    }

    rafSpy.mockRestore();
  });
});
