"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [formState, setFormState] = useState<FormState>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "meeting" });
      cal("ui", {
        hideEventTypeDetails: false,
        theme: "dark",
      });
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setFormState("success");
        formRef.current?.reset();
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  return (
    <section id="contact" className="px-5 pt-14 pb-8 sm:px-6 sm:pt-20">
      {/* Label */}
      <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/20 mb-4 block">
        Contact
      </span>

      {/* Two-column layout */}
      <div className="flex flex-col sm:flex-row gap-12 sm:gap-0">
        {/* Left — form */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white/90 tracking-tight mb-1">
            Send a message
          </h2>
          <p className="text-sm text-white/35 mb-7 leading-relaxed">
            I typically respond within 24 hours.
          </p>

          {formState === "success" ? (
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-sm text-white/60">Message sent — I&apos;ll be in touch soon.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormState("idle")}
                className="mt-2 text-xs text-white/25 hover:text-white/50 transition-colors w-fit"
              >
                Send another →
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="hidden"
                name="access_key"
                value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY}
              />
              <input type="hidden" name="subject" value="Portfolio Contact" />
              <input type="checkbox" name="botcheck" className="hidden" />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-[11px] font-medium text-white/25 uppercase tracking-widest"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[11px] font-medium text-white/25 uppercase tracking-widest"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-[11px] font-medium text-white/25 uppercase tracking-widest"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
                />
              </div>

              {formState === "error" && (
                <p className="text-xs text-red-400/60">
                  Something went wrong. Try emailing directly.
                </p>
              )}

              <button
                type="submit"
                disabled={formState === "loading"}
                className="mt-2 w-fit flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                {formState === "loading" ? (
                  "Sending…"
                ) : (
                  <>
                    Send message
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                      className="group-hover:translate-x-0.5 transition-transform"
                    >
                      <path
                        d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block w-px bg-white/[0.07] mx-12 self-stretch" />

        {/* Right — schedule */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white/90 tracking-tight mb-1">
            Schedule a call
          </h2>
          <p className="text-sm text-white/35 mb-7 leading-relaxed">
            30 minutes. No agenda needed.
          </p>

          <button
            type="button"
            data-cal-namespace="meeting"
            data-cal-link="rudrasahoo/meeting"
            data-cal-config='{"theme":"dark"}'
            className="group w-full flex flex-col items-center justify-center gap-4 px-6 py-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all sm:gap-5 sm:px-8 sm:py-12"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-white/50"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-white/70 group-hover:text-white/95 transition-colors">
                Book a meeting
              </p>
              <p className="text-xs text-white/25 mt-1">30 min · cal.com/rudrasahoo</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/30 group-hover:text-white/50 transition-colors">
              <span>Open calendar</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
