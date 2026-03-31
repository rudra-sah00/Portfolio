"use client";

import { useEffect, useState } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-default w-full h-full border-none hidden md:block"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />

      {/* Modal Container */}
      <div className="relative w-full h-full md:h-[88vh] md:max-w-3xl bg-[#0f0f0f] border-x-0 border-y-0 md:border md:border-white/[0.08] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up md:aspect-[1/1.3]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/70"
                role="img"
                aria-labelledby="resume-icon-title"
              >
                <title id="resume-icon-title">Resume Icon</title>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">Resume</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">
                rudra-sahoo-cv.pdf
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/resume.pdf"
              download="Rudra_Sahoo_Resume.pdf"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="img"
                aria-labelledby="download-icon-title"
              >
                <title id="download-icon-title">Download Icon</title>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden xs:inline">Download</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/[0.05] text-white/40 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="img"
                aria-labelledby="close-icon-title"
              >
                <title id="close-icon-title">Close Icon</title>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 w-full bg-black/20 h-full">
          <iframe
            src="/resume.pdf#view=FitH&toolbar=0"
            className="w-full h-full border-none"
            title="Resume PDF"
          />
        </div>

        {/* Footer for mobile/accessibility fallback */}
        <div className="md:hidden p-4 border-t border-white/[0.08] text-center bg-white/[0.02]">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/30 hover:text-white/60 underline"
          >
            Problems viewing? Open in new tab
          </a>
        </div>
      </div>
    </div>
  );
}
