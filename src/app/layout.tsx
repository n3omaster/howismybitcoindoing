import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "How Is My Bitcoin Doing?",
  description:
    "Enter a Bitcoin address to see if your wallet is in profit or loss. Track your BTC P&L with real-time prices and historical transaction data.",
  keywords: ["bitcoin", "btc", "profit", "loss", "p&l", "wallet", "tracker"],
  openGraph: {
    title: "How Is My Bitcoin Doing?",
    description:
      "Enter a Bitcoin address to see if your wallet is in profit or loss.",
    type: "website",
    siteName: "How Is My Bitcoin Doing?",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Is My Bitcoin Doing?",
    description:
      "Enter a Bitcoin address to see if your wallet is in profit or loss.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
