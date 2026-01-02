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
  metadataBase: new URL('https://financial-pro-launchpad.vercel.app'),
  title: {
    default: "Financial Pro Launchpad | Free Tools for Insurance Professionals",
    template: "%s | Financial Pro Launchpad"
  },
  description: "Free income calculator and recruiting mill quiz for Hawaii insurance professionals. From 'The Hawaii Financial Professional's Blueprint' by Sony Ho.",
  keywords: ["insurance income calculator", "recruiting mill quiz", "Hawaii insurance", "financial professional", "insurance career", "Sony Ho", "Hawaii financial advisor"],
  authors: [{ name: "Sony Ho" }],
  creator: "Sony Ho",
  publisher: "Financial Pro Launchpad",
  openGraph: {
    title: "Financial Pro Launchpad",
    description: "Free tools to help insurance professionals build real practices. Calculate your true earning potential and evaluate your organization.",
    type: "website",
    url: "https://financial-pro-launchpad.vercel.app",
    siteName: "Financial Pro Launchpad",
    locale: "en_US",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Financial Pro Launchpad - Build Your Real Practice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Pro Launchpad | Free Tools for Insurance Professionals",
    description: "Free income calculator and recruiting mill quiz for Hawaii insurance professionals.",
    images: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&h=630&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
