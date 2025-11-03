import { z } from "zod";

const envSchema = z.object({
  // Email Configuration (for contact form)
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_TO: z.string().email().optional(),

  // GitHub API
  GITHUB_TOKEN: z.string().optional(),

  // AI Terminal - Primary and Fallback API Keys
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_API_KEY_FALLBACK: z.string().optional(),

  // Next.js
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://rudrasahoo.live"),

  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
