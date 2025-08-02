import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iryscode - AI Static Site Generator",
  description: "Generate beautiful static websites using AI. Create HTML, CSS, and JavaScript with natural language prompts powered by Google Gemini.",
  keywords: ["AI", "static site generator", "HTML", "CSS", "JavaScript", "Gemini", "web development"],
  authors: [{ name: "Iryscode Team" }],
  icons: {
    icon: "/irys.png",
    shortcut: "/irys.png",
    apple: "/irys.png",
  },
  openGraph: {
    title: "Iryscode - AI Static Site Generator",
    description: "Generate beautiful static websites using AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
