import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Silkscreen } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  weight: ["400"],
  variable: "--font-dot",
  subsets: ["latin"],
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "NextLearning";

export const metadata: Metadata = {
  title: {
    default: `${appName} — AI-Powered Learning to Livelihood`,
    template: `%s | ${appName}`,
  },
  description:
    "Discover careers, develop skills, and find opportunities. An AI-powered learning-to-livelihood platform for rural Indian students.",
  keywords: [
    "career guidance",
    "rural education",
    "skill development",
    "scholarships India",
    "vocational training",
    "AI education",
  ],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0c0c0e" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground dot-bg selection:bg-red-500 selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
