import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

export async function POST(request: NextRequest) {
  try {
    const { message, systemPrompt } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKeys = [env.GEMINI_API_KEY, env.GEMINI_API_KEY_FALLBACK].filter(
      Boolean
    ) as string[];

    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: "No Gemini API keys configured" },
        { status: 500 }
      );
    }

    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\nUser: ${message}\n\nRudra-B:`
      : message;

    let lastError: Error | null = null;

    // Try each API key
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        const apiKey = apiKeys[i];
        const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: fullPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `API request failed: ${response.status} - ${errorText}`
          );
        }

        const data: GeminiResponse = await response.json();

        if (
          data.candidates &&
          data.candidates[0] &&
          data.candidates[0].content
        ) {
          return NextResponse.json({
            response: data.candidates[0].content.parts[0].text,
          });
        } else {
          throw new Error("No response from Gemini API");
        }
      } catch (error) {
        lastError = error as Error;
        // Try next key if available (silently)
        if (i < apiKeys.length - 1) {
          continue;
        }
      }
    }

    // All keys failed
    console.error("All Gemini API keys failed:", lastError);
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again later." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
