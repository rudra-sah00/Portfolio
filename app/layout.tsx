import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rudra — Portfolio",
  description: "Product designer & developer. I design for clarity, function, and delight.",
  openGraph: {
    title: "Rudra — Portfolio",
    description: "Product designer & developer. I design for clarity, function, and delight.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
        {/* Bottom glass fade — blurs content as it approaches the nav bar */}
        <div
          className="fixed bottom-0 left-0 right-0 h-28 pointer-events-none z-40"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            maskImage: "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
            background: "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 100%)",
          }}
        />
      </body>
    </html>
  );
}
