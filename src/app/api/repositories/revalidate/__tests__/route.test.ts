import { POST } from "../route";
import { revalidatePath } from "next/cache";

// Mock Next.js cache revalidation
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("POST /api/repositories/revalidate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should revalidate repository data successfully", async () => {
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Repository data revalidated successfully");
    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp).getTime()).toBeLessThanOrEqual(
      new Date().getTime()
    );
  });

  it("should revalidate /api/repositories path", async () => {
    await POST();

    expect(revalidatePath).toHaveBeenCalledWith("/api/repositories");
  });

  it("should revalidate home page path", async () => {
    await POST();

    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("should call revalidatePath twice", async () => {
    await POST();

    expect(revalidatePath).toHaveBeenCalledTimes(2);
  });

  it("should handle revalidation errors", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const error = new Error("Revalidation failed");
    (revalidatePath as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to revalidate repository data");
    expect(data.message).toBe("Revalidation failed");

    consoleSpy.mockRestore();
  });

  it("should handle unknown errors", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    (revalidatePath as jest.Mock).mockImplementationOnce(() => {
      throw "Unknown error string";
    });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Unknown error");

    consoleSpy.mockRestore();
  });

  it("should return JSON response with correct structure", async () => {
    const response = await POST();
    const data = await response.json();

    expect(data).toHaveProperty("success");
    expect(data).toHaveProperty("message");
    expect(data).toHaveProperty("timestamp");
    expect(typeof data.success).toBe("boolean");
    expect(typeof data.message).toBe("string");
    expect(typeof data.timestamp).toBe("string");
  });

  it("should include timestamp in ISO format", async () => {
    const response = await POST();
    const data = await response.json();

    const timestamp = new Date(data.timestamp);
    expect(timestamp.toISOString()).toBe(data.timestamp);
  });
});
