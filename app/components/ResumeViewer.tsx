"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ResumeViewerProps {
  url: string;
}

export default function ResumeViewer({ url }: ResumeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [_numPages, setNumPages] = useState<number | null>(null);
  const [pages, setPages] = useState<{ id: string; number: number }[]>([]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPages(
      Array.from({ length: numPages }, (_, i) => ({
        id: `resume-page-${i + 1}`,
        number: i + 1,
      }))
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto scrollbar-hide py-4 md:py-8 flex flex-col items-center"
    >
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center gap-4"
        loading={
          <div className="flex flex-col items-center justify-center h-[50vh] pt-20">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs text-white/40 font-medium">Loading professional resume...</p>
          </div>
        }
      >
        {containerWidth &&
          pages.map((page) => (
            <div
              key={page.id}
              className="shadow-2xl shadow-black/50 border border-white/[0.05] rounded-sm overflow-hidden bg-white"
            >
              <Page
                pageNumber={page.number}
                width={Math.min(containerWidth - 32, 800)} // Subtracting padding and capping at 800px for desktop
                renderAnnotationLayer={true}
                renderTextLayer={true}
                loading={null}
              />
            </div>
          ))}
      </Document>
    </div>
  );
}
