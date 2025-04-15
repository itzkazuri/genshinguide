import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"], // ✅ cukup latin saja, sudah support huruf Jepang
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Genshin Guide",
  description: "Your ultimate guide to Genshin Impact characters, farming, and meta strategies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoJP.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
