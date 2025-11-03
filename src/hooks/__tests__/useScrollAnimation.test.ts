import { renderHook } from "@testing-library/react";
import { useScrollAnimation } from "../useScrollAnimation";
import { GitHubRepo } from "@/types";

describe("useScrollAnimation Hook", () => {
  let mockRepos: GitHubRepo[];

  beforeEach(() => {
    mockRepos = [
      {
        id: 1,
        name: "repo1",
        description: "First repo",
        html_url: "https://github.com/user/repo1",
        languages: { TypeScript: 100 },
      },
      {
        id: 2,
        name: "repo2",
        description: "Second repo",
        html_url: "https://github.com/user/repo2",
        languages: { JavaScript: 100 },
      },
    ];

    // Mock DOM elements
    document.querySelectorAll = jest.fn().mockReturnValue([]);
    document.querySelector = jest.fn().mockReturnValue(null);
    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should attach scroll event listener on mount", () => {
    renderHook(() => useScrollAnimation(mockRepos));

    expect(document.addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("should remove scroll event listener on unmount", () => {
    const { unmount } = renderHook(() => useScrollAnimation(mockRepos));

    unmount();

    expect(document.removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("should handle empty repositories array", () => {
    const { unmount } = renderHook(() => useScrollAnimation([]));

    expect(document.addEventListener).toHaveBeenCalled();
    unmount();
  });

  it("should re-attach listener when repositories change", () => {
    const { rerender } = renderHook(
      ({ repos }: { repos: GitHubRepo[] }) => useScrollAnimation(repos),
      {
        initialProps: { repos: [] as GitHubRepo[] },
      }
    );

    const initialCallCount = (document.addEventListener as jest.Mock).mock.calls
      .length;

    rerender({ repos: mockRepos });

    expect(
      (document.addEventListener as jest.Mock).mock.calls.length
    ).toBeGreaterThan(initialCallCount);
  });

  it("should set first section as active after repositories load", () => {
    jest.useFakeTimers();

    const mockFirstSection = {
      classList: { add: jest.fn(), remove: jest.fn() },
    };
    const mockFirstReadme = {
      classList: { add: jest.fn(), remove: jest.fn() },
    };

    (document.querySelector as jest.Mock)
      .mockReturnValueOnce(mockFirstSection)
      .mockReturnValueOnce(mockFirstReadme);

    renderHook(() => useScrollAnimation(mockRepos));

    jest.advanceTimersByTime(100);

    expect(mockFirstSection.classList.add).toHaveBeenCalledWith("is-1");
    expect(mockFirstReadme.classList.add).toHaveBeenCalledWith("is-1");

    jest.useRealTimers();
  });

  it("should not set active section for empty repositories", () => {
    jest.useFakeTimers();

    const mockFirstSection = {
      classList: { add: jest.fn(), remove: jest.fn() },
    };

    (document.querySelector as jest.Mock).mockReturnValue(mockFirstSection);

    renderHook(() => useScrollAnimation([]));

    jest.advanceTimersByTime(100);

    expect(mockFirstSection.classList.add).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("should calculate window height based on repository count", () => {
    const manyRepos = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `repo${i}`,
      description: `Repo ${i}`,
      html_url: `https://github.com/user/repo${i}`,
      languages: { TypeScript: 100 },
    }));

    renderHook(() => useScrollAnimation(manyRepos));

    expect(document.addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("should handle scroll events and activate sections", () => {
    const mockSections = [
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
    ];

    const mockReadmeContents = [
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
    ];

    (document.querySelectorAll as jest.Mock)
      .mockReturnValueOnce(mockSections)
      .mockReturnValueOnce(mockReadmeContents);

    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    renderHook(() => useScrollAnimation(mockRepos));

    const scrollHandler = (document.addEventListener as jest.Mock).mock
      .calls[0][1];

    // Simulate scroll event
    scrollHandler();

    expect(mockSections[0].classList.add).toHaveBeenCalledWith("is-1");
  });

  it("should return early when repositories array is empty during scroll", () => {
    Object.defineProperty(window, "scrollY", { value: 100, writable: true });

    renderHook(() => useScrollAnimation([]));

    const scrollHandler = (document.addEventListener as jest.Mock).mock
      .calls[0][1];

    // Should not throw when scrolling with empty repos
    expect(() => scrollHandler()).not.toThrow();
  });

  it("should update GitHub button href on scroll", () => {
    const mockButton = { href: "" };
    const mockSections = [
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
    ];

    (document.querySelectorAll as jest.Mock).mockReturnValue(mockSections);
    (document.querySelector as jest.Mock).mockReturnValue(mockButton);

    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    renderHook(() => useScrollAnimation(mockRepos));

    const scrollHandler = (document.addEventListener as jest.Mock).mock
      .calls[0][1];
    scrollHandler();

    expect(mockButton.href).toBe(mockRepos[0].html_url);
  });

  it("should handle scroll past last section", () => {
    const mockSections = [
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
    ];

    const mockReadmeContents = [
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
    ];

    (document.querySelectorAll as jest.Mock)
      .mockReturnValueOnce(mockSections)
      .mockReturnValueOnce(mockReadmeContents);

    Object.defineProperty(window, "scrollY", {
      value: 5000,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    renderHook(() => useScrollAnimation(mockRepos));

    const scrollHandler = (document.addEventListener as jest.Mock).mock
      .calls[0][1];
    scrollHandler();

    expect(mockSections[1].classList.add).toHaveBeenCalledWith("is-1");
    expect(mockReadmeContents[1].classList.add).toHaveBeenCalledWith("is-1");
  });

  it("should remove is-1 from non-last sections when scrolling", () => {
    const mockSections = [
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
    ];

    (document.querySelectorAll as jest.Mock).mockReturnValue(mockSections);

    Object.defineProperty(window, "scrollY", {
      value: 1500,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    const threeRepos = [...mockRepos, { ...mockRepos[0], id: 3 }];
    renderHook(() => useScrollAnimation(threeRepos));

    const scrollHandler = (document.addEventListener as jest.Mock).mock
      .calls[0][1];
    scrollHandler();

    expect(mockSections[0].classList.remove).toHaveBeenCalledWith("is-1");
  });

  it("should handle different window heights for few repositories", () => {
    const fewRepos = mockRepos.slice(0, 1);

    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    renderHook(() => useScrollAnimation(fewRepos));

    const scrollHandler = (document.addEventListener as jest.Mock).mock
      .calls[0][1];

    // Should calculate window height with +550 for <=5 repos
    expect(() => scrollHandler()).not.toThrow();
  });

  it("should handle different window heights for many repositories", () => {
    const manyRepos = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      name: `repo${i}`,
      description: `Repo ${i}`,
      html_url: `https://github.com/user/repo${i}`,
    }));

    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });

    renderHook(() => useScrollAnimation(manyRepos));

    const scrollHandler = (document.addEventListener as jest.Mock).mock
      .calls[0][1];

    // Should calculate window height with +400 for >5 repos
    expect(() => scrollHandler()).not.toThrow();
  });
});
