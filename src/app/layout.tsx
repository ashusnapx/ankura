import type { Metadata, Viewport } from "next";
import {
  Inter,
  Noto_Serif_Kannada,
  DM_Serif_Display,
  Kalam,
  Roboto_Mono,
} from "next/font/google";
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

const story = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-story",
  display: "swap",
});

const note = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-note",
  display: "swap",
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ankura.app"),
  title: {
    default: "Ankura — Learn Kannada Through Stories",
    template: "%s | Ankura",
  },
  description:
    "A revolutionary story-driven Kannada learning app. Don't study Kannada — live inside Bangalore stories. Learn naturally through narrative immersion.",
  keywords: [
    "Kannada",
    "learn Kannada",
    "language learning",
    "Bangalore",
    "story-based learning",
    "Ankura",
    "Kannada for beginners",
    "learn Kannada online",
    "Hindi to Kannada",
  ],
  authors: [{ name: "Ankura Team" }],
  category: "Education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: "https://ankura.app",
  },
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
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Ankura",
              url: "https://ankura.app",
              description:
                "A revolutionary story-driven Kannada learning app. Learn Kannada through immersive Bangalore stories.",
              applicationCategory: "EducationalApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              inLanguage: ["en", "kn", "hi"],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${kannada.variable} ${story.variable} ${note.variable} ${mono.variable} antialiased font-sans bg-white text-indigo`}
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
