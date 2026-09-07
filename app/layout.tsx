import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";
import { SessionProvider } from "next-auth/react";

const SITE_URL = "https://chatbot-gold-iota-13.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "chatbot-gold-iota — AI Chat Assistant",
    template: "%s | chatbot-gold-iota",
  },
  description:
    "chatbot-gold-iota is a free AI chat assistant powered by OpenRouter and Zen models. Ask questions, generate code, search the web and chat with smart AI agents.",
  keywords: [
    "AI chat",
    "chatbot",
    "chat assistant",
    "AI agent",
    "OpenRouter",
    "LLM",
    "online chat",
    "ask AI",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "chatbot-gold-iota",
    title: "chatbot-gold-iota — AI Chat Assistant",
    description:
      "Free AI chat assistant with multiple models. Ask anything, write code, search the web.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "chatbot-gold-iota — AI Chat Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "chatbot-gold-iota — AI Chat Assistant",
    description:
      "Free AI chat assistant with multiple models. Ask anything, write code, search the web.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.png",
  },
};

export const viewport = {
  maximumScale: 1,
  themeColor: "#000000",
};

const geist = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geist.variable} ${geistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required"
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <SessionProvider
            basePath={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/auth`}
          >
            <TooltipProvider>{children}</TooltipProvider>
          </SessionProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "chatbot-gold-iota",
                url: SITE_URL,
                description:
                  "Free AI chat assistant with multiple models. Ask anything, write code, search the web.",
                inLanguage: "en",
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
