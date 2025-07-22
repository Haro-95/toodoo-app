import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/user-context";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Toodoo App",
  description: "A modern, accessible todo application built with Next.js",
  keywords: ["todo app", "task management", "productivity", "react", "nextjs"],
  authors: [{ name: "Toodoo Team" }],
  openGraph: {
    title: "Toodoo App - Manage Your Tasks Efficiently",
    description: "A beautiful, accessible task management application with categories and dark mode support",
    url: "https://toodoo.app",
    siteName: "Toodoo App",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Toodoo App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toodoo App - Organize Your Tasks",
    description: "A modern, accessible todo application with category support and dark mode",
    images: ["/twitter-image.png"],
  },
  applicationName: "Toodoo",
  appleWebApp: {
    capable: true,
    title: "Toodoo",
    statusBarStyle: "default",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="!scroll-smooth">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
