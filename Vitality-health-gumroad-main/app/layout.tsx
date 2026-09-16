import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern Gut Health — The 21-Day Bloat Reset",
  description:
    "A guided 21-day document program for bloating, digestive wellbeing, and daily food confidence with a practical food-first routine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


