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

// All 82 skill names for ItemList schema
const ALL_SKILL_NAMES = [
  "LLM","TTS","ASR","VLM","video-generation","video-understand","image-generation",
  "fullstack-dev","coding-agent","superpowers","mcp-builder","web-artifacts-builder",
  "react-best-practices","composition-patterns","react-native-skills","next-best-practices",
  "shadcn","find-skills","skill-scanner","brainstorming",
  "frontend-design","ui-ux-pro-max","visual-design-foundations","web-design-guidelines",
  "gsap-animations","web-shader-extractor","image-understand","image-edit",
  "seo-content-writer","seo-geo","blog-writer","humanizer","content-strategy",
  "social-media-manager","contentanalysis","writing-plans","podcast-generate",
  "marketing-mode","gumroad-pipeline",
  "web-search","web-reader","deep-research","multi-search-engine",
  "aminer-academic-search","aminer-daily-paper","aminer-open-academic",
  "ai-news-collectors","qingyan-research",
  "finance","stock-analysis-skill","market-research-reports","jobs-to-be-done",
  "gift-evaluator","get-fortune-analysis","auto-target-tracker",
  "deployment-manager","supabase-postgres",
  "chain-of-thought","socratic-method","devils-advocate","caveman",
  "context-compressor","simulation-sandbox",
  "pdf","docx","ppt","xlsx","charts",
  "agent-browser","browser-use",
  "skill-creator","skill-vetter","skill-finder-cn","output-formatter","skill-router",
  "explained-code",
  "interview-designer","storyboard-manager","photography-ai",
  "dream-interpreter","mindfulness-meditation","anti-pua"
];

const faqItems = [
  { q: "What is the AI Agent Skills Portal?", a: "The AI Agent Skills Portal is a curated directory of 82 AI agent skills organized into 25 optimized stacks with 16 playbooks and 8 router commands. It provides one-prompt install commands, compatibility matrices, and skill combo generators for developers who ship." },
  { q: "How do I install an AI agent skill?", a: "Each skill has a one-prompt install command. You can use the skill-router to auto-select the right combination, or manually pick skills from the directory. Stacks and playbooks provide pre-built chains for common workflows." },
  { q: "What are skill stacks?", a: "Skill stacks are optimized combinations of 3-7 AI agent skills that work together to accomplish complex tasks. Each stack has defined synergy between skills, with clear data flow from one skill to the next. Examples include the Frontend Stack (5 skills) and the Product Launch stack (7 skills)." },
  { q: "How does the skill router work?", a: "The skill-router is a meta-skill that maps natural language intents to optimal skill stacks. It supports 8 commands (/launch, /content, /research, /design, /decide, /data, /learn, /automate) and uses keyword matching to route your request to the best stack." },
  { q: "What are playbooks?", a: "Playbooks are pre-built execution scripts — named skill chains with trigger commands. Each playbook combines skills in the optimal order for a specific workflow, such as 'Bulletproof Quality' or 'Ship Fast'. Just copy the command and run it." },
  { q: "How do skill combos and the combo generator work?", a: "The combo generator lets you pick individual skills and automatically chains them together. It checks compatibility (synergies and conflicts), suggests related skills based on existing combos, and provides copy-ready output in multiple formats including chain, list, command, and JSON." },
  { q: "What is skill compatibility?", a: "The compatibility matrix shows which skills work well together (synergies) and which should not be combined (conflicts). Synergies like superpowers + coding-agent produce better results when used together. Conflicts like caveman + humanizer have opposing goals and should be avoided." },
  { q: "How are skill health scores calculated?", a: "Health scores (0-100) reflect a skill's reliability and completeness based on error handling coverage, dependency satisfaction, stack inclusion, and documentation quality. Scores above 80 are Excellent, 60-79 Good, 40-59 Fair, below 40 Needs Work." },
  { q: "Can I create custom skill combinations?", a: "Yes! Use the combo generator to select any skills, name your combo, and get copy-ready commands. The generator warns you about conflicts and suggests synergistic skills based on existing stacks and compatibility data." },
  { q: "What is the difference between built-in and community skills?", a: "Built-in skills come pre-installed with the platform. Community skills (from sources like vercel-labs, skills.sh, ai-skills-library) are installed on demand. New skills like superpowers, browser-use, and humanizer are recently added high-impact community contributions." },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://chat.z.ai"),
  title: "AI Agent Skills Portal — 82 Skills, 25 Stacks, Skill Router | One-Prompt Install",
  description: "Explore 82 curated AI agent skills with 25 optimized stacks, 16 playbooks, and 8 router commands. One-prompt install, skill combo generator, compatibility matrix, and ROI analysis. Start building with the right skills — try the Skill Router now!",
  keywords: [
    "AI agent skills", "AI skills directory", "skill portal", "agent skills",
    "skill stacks", "skill stack combinations", "AI agent skills directory",
    "skill router", "AI development tools", "Next.js skills",
    "React skills", "fullstack development", "AI agent orchestration",
    "skill combinations", "one-prompt install", "one-prompt install AI tools",
    "skill combo generator", "AI skill compatibility",
    "chain-of-thought", "superpowers skill", "browser-use", "humanizer",
    "frontend-design skill", "react-best-practices", "deployment-manager",
    "shadcn ui", "GSAP animations", "SEO content writer", "GEO optimization",
    "AI answer engine optimization", "generative engine optimization",
    "AI agent skills portal", "skill playbook", "bulletproof quality stack",
    "AI agent stack directory", "skill health score", "AI tools directory",
    "agent skill install command", "AI workflow automation"
  ],
  authors: [{ name: "AI Agent Skills Portal", url: "https://chat.z.ai" }],
  applicationName: "AI Agent Skills Portal",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AI Agent Skills Portal — 82 Skills, 25 Stacks, Skill Router",
    description: "The definitive directory of 82 AI agent skills with optimized stacks, playbooks, combo generator, and one-prompt install. Find the right skills for any workflow — from product launch to content creation.",
    url: "https://chat.z.ai",
    siteName: "AI Agent Skills Portal",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Skills Portal — 82 Skills, 25 Stacks",
    description: "82 curated AI agent skills. 25 optimized stacks. 16 playbooks. Skill combo generator. One-prompt install. The difference between having a team and having an organization.",
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
  sitemap: "https://chat.z.ai/sitemap.xml",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SoftwareApplication JSON-LD
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Agent Skills Portal",
    "description": "Curated directory of 82 AI agent skills with 25 optimized stacks, 16 playbooks, 8 router commands, skill combo generator, compatibility matrix, and one-prompt install commands.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "82 AI agent skills across 13 categories",
      "25 optimized skill stacks with synergy analysis",
      "16 pre-built playbooks with trigger commands",
      "8 skill router commands for intent-to-stack mapping",
      "Skill combo generator with compatibility checking",
      "One-prompt install for all skills",
      "Typed error handling with escalation chains",
      "Skill health scores (0-100)",
      "Compatibility matrix (synergies and conflicts)",
      "ROI analysis for all stacks",
      "Comparative analysis for overlapping skills",
      "Upgrade paths for skill evolution",
      "Self-healing rules for skill maintenance",
      "Dependency tracking between skills",
      "Dark mode support",
      "Full-text skill search and filtering"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "3.0",
    "programmingLanguage": "TypeScript"
  };

  // ItemList JSON-LD
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI Agent Skills Directory",
    "description": "Complete list of 82 AI agent skills available in the Skills Portal",
    "numberOfItems": ALL_SKILL_NAMES.length,
    "itemListElement": ALL_SKILL_NAMES.map((name, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": name,
      "url": `https://chat.z.ai/#directory`
    }))
  };

  // FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // HowTo JSON-LD
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use Skill Stacks",
    "description": "Step-by-step guide to selecting, combining, and running AI agent skill stacks for any workflow.",
    "totalTime": "PT5M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Identify Your Intent",
        "text": "Use the Skill Router to describe what you want to do (e.g., 'launch a product', 'research AI agents'). The router matches your intent to the optimal skill stack.",
        "image": "https://chat.z.ai/og-step1.png"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Select a Stack or Playbook",
        "text": "Choose from 25 pre-built stacks or 16 playbooks. Each stack lists skills in optimal execution order with synergy explanations.",
        "image": "https://chat.z.ai/og-step2.png"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Check Compatibility",
        "text": "Review the compatibility matrix for synergies and conflicts between your selected skills. Avoid combining conflicting skills like caveman + humanizer.",
        "image": "https://chat.z.ai/og-step3.png"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Copy and Run",
        "text": "Use the one-prompt install command or copy the skill chain. Run the command to execute the stack in order.",
        "image": "https://chat.z.ai/og-step4.png"
      }
    ]
  };

  // WebApplication JSON-LD (original, kept for backward compat)
  const webAppSchema = {
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
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="application-name" content="AI Agent Skills Portal" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://z-cdn.chatglm.cn" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
