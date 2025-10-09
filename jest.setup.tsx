import "@testing-library/jest-dom";
import React from "react";

// Mock Next.js modules
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "/",
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        const MotionComponent = React.forwardRef<
          HTMLElement,
          Record<string, unknown> & { children?: React.ReactNode }
        >((props, ref) => {
          const { children, ...restProps } = props;
          // Filter out framer-motion specific props
          const domProps = Object.keys(restProps).reduce<
            Record<string, unknown>
          >((acc, key) => {
            if (
              !key.startsWith("while") &&
              !key.startsWith("animate") &&
              !key.startsWith("initial") &&
              !key.startsWith("exit") &&
              !key.startsWith("transition") &&
              !key.startsWith("variants") &&
              !key.startsWith("drag") &&
              !key.startsWith("layout")
            ) {
              acc[key] = restProps[key];
            }
            return acc;
          }, {});
          return React.createElement(
            prop as string,
            { ...domProps, ref },
            children as React.ReactNode
          );
        });
        MotionComponent.displayName = `Motion${String(prop)}`;
        return MotionComponent;
      },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useMotionValue: () => ({ set: jest.fn(), get: jest.fn() }),
  useTransform: () => ({ set: jest.fn(), get: jest.fn() }),
  useSpring: () => ({ set: jest.fn(), get: jest.fn() }),
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
}));

// Mock GSAP
jest.mock("gsap", () => ({
  gsap: {
    registerPlugin: jest.fn(),
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
  },
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: jest.fn(),
    getAll: jest.fn(() => [{ kill: jest.fn() }]),
  },
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock react-markdown
jest.mock("react-markdown", () => {
  return function ReactMarkdown({ children }: { children: string }) {
    return <div data-testid="react-markdown">{children}</div>;
  };
});

// Mock remark-gfm
jest.mock("remark-gfm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock rehype-highlight
jest.mock("rehype-highlight", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock rehype-raw
jest.mock("rehype-raw", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock rehype-sanitize
jest.mock("rehype-sanitize", () => ({
  __esModule: true,
  default: jest.fn(),
  defaultSchema: {},
}));

// Mock @tsparticles/react
jest.mock("@tsparticles/react", () => {
  const MockParticles = ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="particles">{children}</div>
  );
  MockParticles.displayName = "MockParticles";
  return {
    __esModule: true,
    default: MockParticles,
    Particles: MockParticles,
    initParticlesEngine: jest.fn(() => Promise.resolve()),
  };
});

// Mock @tsparticles/slim
jest.mock("@tsparticles/slim", () => ({
  __esModule: true,
  loadSlim: jest.fn(() => Promise.resolve()),
}));

// Mock mermaid
jest.mock("mermaid", () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    render: jest.fn(() => Promise.resolve({ svg: "<svg></svg>" })),
  },
}));

// Mock Next.js server components
global.Request = class Request {
  constructor(
    public url: string,
    public init?: RequestInit
  ) {}
  json() {
    return Promise.resolve(JSON.parse((this.init?.body as string) || "{}"));
  }
} as unknown as typeof Request;

global.Response = class Response {
  constructor(
    public body?: BodyInit | null,
    public init?: ResponseInit
  ) {}
  static json(data: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
  }
} as unknown as typeof Response;

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: class NextResponse {
    private _body: unknown;
    private _init: ResponseInit;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this._body = body;
      this._init = init || {};
    }

    static json(data: unknown, init?: ResponseInit) {
      const response = new NextResponse(JSON.stringify(data), {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
      });
      response._body = data;
      return response;
    }

    async json() {
      if (typeof this._body === "string") {
        return JSON.parse(this._body);
      }
      return this._body;
    }

    get status() {
      return this._init.status || 200;
    }

    get headers() {
      return this._init.headers || {};
    }
  },
}));
