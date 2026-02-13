import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ankura — Learn Kannada Through Stories",
  description:
    "A revolutionary story-driven Kannada learning app. Don't study Kannada — live inside Bangalore stories. Learn naturally through narrative immersion.",
  keywords: [
    "Kannada",
    "learn Kannada",
    "language learning",
    "Bangalore",
    "story-based learning",
  ],
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
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/icon-192.png' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Noto+Serif+Kannada:wght@400;700;900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='antialiased bg-white text-indigo'>
        <Navbar />
        {/* Accessibility: skip to content */}
        <a href='#main-content' className='skip-to-content'>
          Skip to content
        </a>
        <main id='main-content' className='min-h-[calc(100-h-64)]'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
