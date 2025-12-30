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
  title: "Financial Pro Launchpad | Free Tools for Insurance Professionals",
  description: "Free income calculator and recruiting mill quiz for Hawaii insurance professionals. From 'The Hawaii Financial Professional's Blueprint' by Sony Ho.",
  keywords: ["insurance income calculator", "recruiting mill quiz", "Hawaii insurance", "financial professional", "insurance career"],
  authors: [{ name: "Sony Ho" }],
  openGraph: {
    title: "Financial Pro Launchpad",
    description: "Free tools to help insurance professionals build real practices",
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
