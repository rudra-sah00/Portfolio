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
});
