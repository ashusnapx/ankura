import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif_Kannada } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const kannada = Noto_Serif_Kannada({
  subsets: ["kannada"],
  variable: "--font-kannada",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ankura.app"),
  title: "Ankura — Learn Kannada Through Stories",
  description:
    "A revolutionary story-driven Kannada learning app. Don't study Kannada — live inside Bangalore stories. Learn naturally through narrative immersion.",
  keywords: [
    "Kannada",
    "learn Kannada",
    "language learning",
    "Bangalore",
    "story-based learning",
    "Ankura",
  ],
  authors: [{ name: "Ankura Team" }],
  openGraph: {
    title: "Ankura — Learn Kannada Through Stories",
    description:
      "Don't study Kannada — live it. Experience story-driven immersion.",
    url: "https://ankura.app",
    siteName: "Ankura",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ankura — Learn Kannada Through Stories",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ankura — Learn Kannada Through Stories",
    description: "Experience the revolutionary way to learn Kannada.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ankura",
  },
};

export const viewport: Viewport = {
  themeColor: "#E07A5F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Next.js 14+ handles links of type icon, apple-touch-icon etc from metadata automatically if they exist in public/ or are specified in metadata object. However, explicit links for preconnect/etc can remain if needed, but next/font handles optimization. */}
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      </head>
      <body
        className={`${inter.variable} ${kannada.variable} antialiased font-sans bg-white text-indigo`}
      >
        <Navbar />
        {/* Accessibility: skip to content */}
        <a href='#main-content' className='skip-to-content'>
          Skip to content
        </a>
        <main id='main-content' className='min-h-[calc(100vh-160px)]'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
