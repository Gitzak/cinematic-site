import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinematic Studio — Live Shows, Drama, Concerts & Dance",
  description:
    "Discover world-class cinematic productions — from intimate drama and live concerts to contemporary dance. Immersive storytelling crafted frame by frame.",
  keywords: [
    "cinematic studio",
    "live shows",
    "drama performances",
    "live concerts",
    "contemporary dance",
    "immersive theater",
    "stage productions",
    "performing arts",
  ],
  openGraph: {
    title: "Cinematic Studio — Live Shows, Drama, Concerts & Dance",
    description:
      "World-class live productions blending sound, movement, and storytelling into unforgettable cinematic experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
