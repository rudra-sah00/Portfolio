import { POST } from "../route";
import { env } from "@/lib/env";
import { NextRequest } from "next/server";

// Helper to create mock NextRequest
function createMockRequest(
  url: string,
  options: { method: string; body?: string }
): NextRequest {
  const bodyText = options.body || "{}";

  return {
    url,
    method: options.method,
    json: async () => JSON.parse(bodyText),
    headers: new Headers(),
    cookies: {} as unknown as NextRequest["cookies"],
    nextUrl: new URL(url),
  } as NextRequest;
}

// Mock fetch for Gemini API
global.fetch = jest.fn();

// Mock env module
jest.mock("@/lib/env", () => ({
  env: {
    GEMINI_API_KEY: "test-api-key-123",
    GEMINI_API_KEY_FALLBACK: "test-fallback-key-456",
  },
}));

describe("/api/chat API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Request Validation", () => {
    it("should return 400 if message is missing", async () => {
      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          systemPrompt: "You are a helpful assistant",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Message is required");
    });

    it("should accept request with message and systemPrompt", async () => {
      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: "Hello! How can I help you?" }],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeminiResponse,
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Hello",
          systemPrompt: "You are Rudra-B",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.response).toBe("Hello! How can I help you?");
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should work without systemPrompt", async () => {
      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: "Response without system prompt" }],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeminiResponse,
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Hello",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.response).toBe("Response without system prompt");
    });
  });

  describe("Gemini API Integration", () => {
    it("should call Gemini API with correct parameters", async () => {
      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: "Test response" }],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeminiResponse,
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "What is your name?",
          systemPrompt: "You are Rudra-B",
        }),
      });

      await POST(request);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[0]).toContain("generativelanguage.googleapis.com");
      expect(fetchCall[0]).toContain("gemini-2.0-flash-exp");
      expect(fetchCall[0]).toContain("test-api-key-123");

      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.contents[0].parts[0].text).toContain(
        "You are Rudra-B"
      );
      expect(requestBody.contents[0].parts[0].text).toContain(
        "What is your name?"
      );
      expect(requestBody.generationConfig).toBeDefined();
      expect(requestBody.generationConfig.temperature).toBe(0.7);
    });

    it("should use primary API key first", async () => {
      const mockGeminiResponse = {
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeminiResponse,
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Test" }),
      });

      await POST(request);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[0]).toContain("test-api-key-123");
    });
  });

  describe("Error Handling", () => {
    it("should return 500 if no API keys are configured", async () => {
      // Temporarily mock env with no keys
      (env as Record<string, string | undefined>).GEMINI_API_KEY = undefined;
      (env as Record<string, string | undefined>).GEMINI_API_KEY_FALLBACK =
        undefined;

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("No Gemini API keys configured");

      // Restore
      (env as Record<string, string | undefined>).GEMINI_API_KEY =
        "test-api-key-123";
      (env as Record<string, string | undefined>).GEMINI_API_KEY_FALLBACK =
        "test-fallback-key-456";
    });

    it("should try fallback key if primary fails", async () => {
      // First call fails
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => "Rate limit exceeded",
      });

      // Second call succeeds
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "Fallback response" }] } }],
        }),
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.response).toBe("Fallback response");
      expect(global.fetch).toHaveBeenCalledTimes(2);

      // Verify fallback key was used
      const secondCall = (global.fetch as jest.Mock).mock.calls[1];
      expect(secondCall[0]).toContain("test-fallback-key-456");
    });

    it("should return 500 if all API keys fail", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "Server error",
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed to get AI response");
      expect(global.fetch).toHaveBeenCalledTimes(2); // Tried both keys
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe(
        "Failed to get AI response. Please try again later."
      );
    });

    it("should handle malformed Gemini response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}), // Empty response
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed to get AI response");
    });

    it("should handle missing candidates in response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ candidates: [] }),
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed to get AI response");
    });

    it("should handle invalid JSON in request body", async () => {
      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: "invalid json{",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("Response Format", () => {
    it("should return response in correct format", async () => {
      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: "Test response text" }],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeminiResponse,
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty("response");
      expect(typeof data.response).toBe("string");
      expect(data.response).toBe("Test response text");
    });

    it("should extract text from nested Gemini response structure", async () => {
      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [
                { text: "First part" },
                { text: " Second part" }, // Multiple parts
              ],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeminiResponse,
      });

      const request = createMockRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should return first part's text
      expect(data.response).toBe("First part");
    });
  });
});
