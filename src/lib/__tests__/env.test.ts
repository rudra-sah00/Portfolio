describe("env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should parse valid environment variables", async () => {
    process.env = {
      EMAIL_USER: "test@example.com",
      EMAIL_PASS: "password123",
      EMAIL_TO: "recipient@example.com",
      GITHUB_TOKEN: "ghp_test123",
      GEMINI_API_KEY: "test-api-key",
      NEXT_PUBLIC_SITE_URL: "https://test.com",
      NODE_ENV: "development",
    };

    const envModule = await import("../env");
    const env = envModule.env;

    expect(env.EMAIL_USER).toBe("test@example.com");
    expect(env.EMAIL_PASS).toBe("password123");
    expect(env.EMAIL_TO).toBe("recipient@example.com");
    expect(env.GITHUB_TOKEN).toBe("ghp_test123");
    expect(env.GEMINI_API_KEY).toBe("test-api-key");
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://test.com");
    expect(env.NODE_ENV).toBe("development");
  });

  it("should handle optional environment variables", async () => {
    process.env = {
      NODE_ENV: "test",
    };

    const envModule = await import("../env");
    const env = envModule.env;

    expect(env.EMAIL_USER).toBeUndefined();
    expect(env.EMAIL_PASS).toBeUndefined();
    expect(env.EMAIL_TO).toBeUndefined();
    expect(env.GITHUB_TOKEN).toBeUndefined();
    expect(env.GEMINI_API_KEY).toBeUndefined();
    expect(env.NODE_ENV).toBe("test");
  });

  it("should use default values", async () => {
    process.env = {} as NodeJS.ProcessEnv;

    const envModule = await import("../env");
    const env = envModule.env;

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://rudrasahoo.live");
    expect(env.NODE_ENV).toBe("development");
  });

  it("should accept production environment", async () => {
    process.env = {
      NODE_ENV: "production",
    };

    const envModule = await import("../env");
    const env = envModule.env;

    expect(env.NODE_ENV).toBe("production");
  });

  it("should accept test environment", async () => {
    process.env = {
      NODE_ENV: "test",
    };

    const envModule = await import("../env");
    const env = envModule.env;

    expect(env.NODE_ENV).toBe("test");
  });

  it("should validate email format for EMAIL_USER", () => {
    process.env = {
      EMAIL_USER: "invalid-email",
      NODE_ENV: "test",
    };

    expect(() => {
      jest.resetModules();
      jest.requireActual("../env");
    }).toThrow();
  });

  it("should validate email format for EMAIL_TO", () => {
    process.env = {
      EMAIL_TO: "not-an-email",
      NODE_ENV: "test",
    };

    expect(() => {
      jest.resetModules();
      jest.requireActual("../env");
    }).toThrow();
  });

  it("should validate URL format for NEXT_PUBLIC_SITE_URL", () => {
    process.env = {
      NEXT_PUBLIC_SITE_URL: "not-a-url",
      NODE_ENV: "test",
    };

    expect(() => {
      jest.resetModules();
      jest.requireActual("../env");
    }).toThrow();
  });

  it("should reject invalid NODE_ENV values", () => {
    const invalidEnv = {
      NODE_ENV: "invalid-env",
    };

    expect(() => {
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      process.env = invalidEnv as any;
      jest.requireActual("../env");
    }).toThrow();
  });

  it("should export Env type", async () => {
    const envModule = await import("../env");
    const env = envModule.env;

    // Type check - should have expected properties
    expect(env).toHaveProperty("NODE_ENV");
    expect(env).toHaveProperty("NEXT_PUBLIC_SITE_URL");
  });
});
