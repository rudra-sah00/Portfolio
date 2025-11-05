import { POST } from "../route";
import nodemailer from "nodemailer";

// Mock NextRequest
class MockNextRequest {
  private bodyText: string;
  public url: string;
  public method: string;

  constructor(url: string, options: { method: string; body?: string }) {
    this.url = url;
    this.method = options.method;
    this.bodyText = options.body || "{}";
  }

  async json() {
    return JSON.parse(this.bodyText);
  }
}

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-id" }),
  })),
}));

// Mock env module
jest.mock("@/lib/env", () => ({
  env: {
    EMAIL_USER: "test@example.com",
    EMAIL_PASS: "test-password",
    EMAIL_TO: "recipient@example.com",
  },
}));

describe("/api/contact API Route", () => {
  it("should return 400 if name is missing", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        contactOption: "email",
        contactDetails: "test@example.com",
        message: "Test message",
      }),
    }) as unknown as Request;

    const response = await POST(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("All fields are required");
  });

  it("should return 400 if contactOption is missing", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        contactDetails: "test@example.com",
        message: "Test message",
      }),
    });

    const response = await POST(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("All fields are required");
  });

  it("should return 400 if contactDetails is missing", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        contactOption: "email",
        message: "Test message",
      }),
    });

    const response = await POST(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("All fields are required");
  });

  it("should return 400 if message is missing", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        contactOption: "email",
        contactDetails: "test@example.com",
      }),
    });

    const response = await POST(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("All fields are required");
  });

  it("should send email with valid data", async () => {
    const mockNodemailer = jest.mocked(nodemailer);
    const mockSendMail = jest.fn().mockResolvedValue({ messageId: "test-123" });
    mockNodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);

    const request = new MockNextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        contactOption: "email",
        contactDetails: "test@example.com",
        message: "Test message",
      }),
    });

    const response = await POST(request as unknown as Request);
    await response.json();

    expect(response.status).toBe(200);
    expect(mockSendMail).toHaveBeenCalled();
  });

  it("should handle email sending errors", async () => {
    const mockNodemailer = jest.mocked(nodemailer);
    const mockSendMail = jest.fn().mockRejectedValue(new Error("Email failed"));
    mockNodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);

    const request = new MockNextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        contactOption: "email",
        contactDetails: "test@example.com",
        message: "Test message",
      }),
    });

    const response = await POST(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });

  it("should handle different contact options", async () => {
    const mockNodemailer = jest.mocked(nodemailer);
    const mockSendMail = jest.fn().mockResolvedValue({ messageId: "test-456" });
    mockNodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);

    const contactOptions = ["email", "phone", "linkedin"];

    for (const option of contactOptions) {
      const request = new MockNextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          contactOption: option,
          contactDetails: "contact-details",
          message: "Test message",
        }),
      });

      const response = await POST(request as unknown as Request);
      expect(response.status).toBe(200);
    }
  });

  it("should create proper email with HTML template", async () => {
    const mockNodemailer = jest.mocked(nodemailer);
    const mockSendMail = jest.fn().mockResolvedValue({ messageId: "test-789" });
    mockNodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);

    const request = new MockNextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        contactOption: "email",
        contactDetails: "john@example.com",
        message: "Hello, this is a test message",
      }),
    });

    await POST(request as unknown as Request);

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.any(String),
        to: expect.any(String),
        subject: expect.any(String),
        html: expect.stringContaining("John Doe"),
      })
    );
  });

  it("should handle malformed JSON", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: "invalid-json",
    });

    const response = await POST(request as unknown as Request);
    expect(response.status).toBe(500);
  });

  it("should return success response with message", async () => {
    const mockNodemailer = jest.mocked(nodemailer);
    const mockSendMail = jest
      .fn()
      .mockResolvedValue({ messageId: "success-123" });
    mockNodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);

    const request = new MockNextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        contactOption: "email",
        contactDetails: "test@example.com",
        message: "Test message",
      }),
    });

    const response = await POST(request as unknown as Request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message");
    expect(data.message).toBe("Email sent successfully!");
  });
});
