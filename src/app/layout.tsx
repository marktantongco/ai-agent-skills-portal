import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Agent Skills Portal — 82 Skills, 25 Stacks, Skill Router",
  description: "The definitive AI agent skills portal: 82 curated skills, 25 optimized stacks, 8 router commands, skill combo generator, and one-prompt install commands. Built for developers who ship, not search. SEO + GEO optimized for both Google and AI answer engines.",
  keywords: [
    "AI agent skills", "skill portal", "AI skills directory", "agent skills",
    "skill stacks", "skill router", "AI development tools", "Next.js skills",
    "React skills", "fullstack development", "AI agent orchestration",
    "skill combinations", "one-prompt install", "skill combo generator",
    "chain-of-thought", "superpowers skill", "browser-use", "humanizer",
    "frontend-design skill", "react-best-practices", "deployment-manager",
    "shadcn ui", "GSAP animations", "SEO content writer", "GEO optimization",
    "AI answer engine optimization", "generative engine optimization",
    "AI agent skills portal", "skill playbook", "bulletproof quality stack"
  ],
  authors: [{ name: "AI Agent Skills Portal" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AI Agent Skills Portal — 82 Skills, 25 Stacks, Skill Router",
    description: "82 curated AI agent skills. 25 optimized stacks. 8 router commands. Skill combo generator. One-prompt install. The difference between having a team and having an organization.",
    url: "https://chat.z.ai",
    siteName: "AI Agent Skills Portal",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Skills Portal — 82 Skills, 25 Stacks",
    description: "82 curated AI agent skills. 25 optimized stacks. 8 router commands. Skill combo generator. One-prompt install.",
  },
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
  alternates: {
    canonical: "https://chat.z.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI Agent Skills Portal",
              "description": "82 curated AI agent skills with 25 optimized stacks and skill router",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "82 AI agent skills",
                "25 optimized skill stacks",
                "8 router commands",
                "Skill combo generator",
                "One-prompt install",
                "Error escalation chains",
                "Skill health scores",
                "Compatibility matrix"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
