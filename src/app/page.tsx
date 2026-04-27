'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  Search, Copy, Check, ChevronDown, ChevronRight, Moon, Sun,
  Terminal, Package, Layers, Trophy, Zap, BookOpen, ArrowUp,
  ArrowDown, ExternalLink, Hash, Sparkles, Filter, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from '@/components/ui/accordion'

// ──────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────

interface Skill {
  name: string
  category: string
  description: string
  source: string
  installs: string
}

interface SkillCombo {
  name: string
  emoji: string
  skills: string[]
  tagline: string
  useCase: string
  synergy: string
}

interface TopSkill {
  rank: number
  name: string
  source: string
  installs: string
  category: string
}

interface OnePrompt {
  name: string
  stack: string
  prompt: string
}

const INSTALLED_SKILLS: Skill[] = [
  // Development
  { name: "fullstack-dev", category: "Development", description: "Fullstack Next.js 16 development with React, API routes, and Prisma", source: "built-in", installs: "built-in" },
  { name: "coding-agent", category: "Development", description: "Autonomous coding with planning, execution, and verification", source: "built-in", installs: "built-in" },
  { name: "mcp-builder", category: "Development", description: "Build MCP servers in TypeScript and Python", source: "ai-skills-library", installs: "\u2014" },
  { name: "web-artifacts-builder", category: "Development", description: "Single-file HTML artifacts with React + Tailwind", source: "ai-skills-library", installs: "\u2014" },
  { name: "react-best-practices", category: "Development", description: "70 React/Next.js performance rules from Vercel Engineering", source: "vercel-labs/agent-skills", installs: "352.5K" },
  { name: "composition-patterns", category: "Development", description: "React composition patterns that scale \u2014 compound components, state lifting", source: "vercel-labs/agent-skills", installs: "150.8K" },
  { name: "react-native-skills", category: "Development", description: "React Native and Expo best practices for performant mobile apps", source: "vercel-labs/agent-skills", installs: "101.5K" },
  { name: "next-best-practices", category: "Development", description: "Next.js file conventions, RSC boundaries, data patterns, async APIs", source: "vercel-labs/next-skills", installs: "73.3K" },
  { name: "shadcn", category: "Development", description: "shadcn/ui component management \u2014 adding, styling, composing UI", source: "shadcn/ui", installs: "110.8K" },
  { name: "web-design-guidelines", category: "Development", description: "Review UI code for Web Interface Guidelines compliance", source: "vercel-labs/agent-skills", installs: "280.8K" },
  { name: "frontend-design", category: "Development", description: "Create distinctive, production-grade frontend interfaces avoiding AI slop", source: "anthropics/skills", installs: "342.1K" },
  { name: "find-skills", category: "Development", description: "Discover and install agent skills from the open ecosystem", source: "vercel-labs/skills", installs: "1.2M" },
  { name: "skill-scanner", category: "Development", description: "Scan agent skills for security issues before adoption", source: "getsentry/skills", installs: "\u2014" },
  { name: "brainstorming", category: "Development", description: "Turn ideas into fully formed designs through collaborative dialogue", source: "obra/superpowers", installs: "124.6K" },

  // Reasoning
  { name: "chain-of-thought", category: "Reasoning", description: "Step-by-step reasoning for decomposing complex problems", source: "ai-skills-library", installs: "\u2014" },
  { name: "socratic-method", category: "Reasoning", description: "Guide users through strategic questioning to uncover assumptions", source: "ai-skills-library", installs: "\u2014" },
  { name: "simulation-sandbox", category: "Reasoning", description: "Test scenarios in simulated environments before real execution", source: "ai-skills-library", installs: "\u2014" },
  { name: "output-formatter", category: "Reasoning", description: "Strict formatting rules for JSON, tables, markdown, code", source: "ai-skills-library", installs: "\u2014" },
  { name: "context-compressor", category: "Reasoning", description: "Compress long contexts preserving decisions, actions, constraints", source: "ai-skills-library", installs: "\u2014" },
  { name: "devils-advocate", category: "Reasoning", description: "Argue against premises to strengthen arguments and stress-test ideas", source: "ai-skills-library", installs: "\u2014" },
  { name: "caveman", category: "Reasoning", description: "Ultra-compressed communication mode \u2014 cuts token usage ~75%", source: "juliusbrussee/caveman", installs: "84.7K" },

  // DevOps
  { name: "deployment-manager", category: "DevOps", description: "Deploy, monitor, and update projects across Vercel/Netlify/GH Pages", source: "ai-skills-library", installs: "\u2014" },

  // Creative
  { name: "photography-ai", category: "Creative", description: "Professional visual engineering framework for photography", source: "ai-skills-library", installs: "\u2014" },
  { name: "gsap-animations", category: "Creative", description: "Professional web animations with GSAP \u2014 ScrollTrigger, Flip, MorphSVG", source: "xerxes-on/gsap-animation-skill", installs: "\u2014" },
  { name: "image-generation", category: "Creative", description: "AI image generation from text descriptions", source: "built-in", installs: "built-in" },
  { name: "image-understand", category: "Creative", description: "Vision-based AI analysis of images", source: "built-in", installs: "built-in" },
  { name: "image-edit", category: "Creative", description: "AI-powered image editing capabilities", source: "built-in", installs: "built-in" },
  { name: "web-shader-extractor", category: "Creative", description: "Extract WebGL/Canvas/Shader visual effects from web pages", source: "built-in", installs: "built-in" },
  { name: "visual-design-foundations", category: "Creative", description: "Typography, color systems, spacing and iconography foundations", source: "built-in", installs: "built-in" },

  // Data
  { name: "web-reader", category: "Data", description: "Web page extraction with site crawling and spidering", source: "ai-skills-library", installs: "\u2014" },
  { name: "web-search", category: "Data", description: "Web search for real-time information retrieval", source: "built-in", installs: "built-in" },
  { name: "deep-research", category: "Data", description: "Comprehensive multi-source research workflow", source: "built-in", installs: "built-in" },
  { name: "supabase-postgres", category: "Data", description: "Postgres performance optimization from Supabase", source: "supabase/agent-skills", installs: "125.0K" },
  { name: "xlsx", category: "Data", description: "Create, edit, and analyze Excel spreadsheets", source: "built-in", installs: "built-in" },
  { name: "finance", category: "Data", description: "Real-time and historical financial data analysis", source: "built-in", installs: "built-in" },
  { name: "stock-analysis-skill", category: "Data", description: "Stock market analysis with watchlist and rumor scanning", source: "built-in", installs: "built-in" },
  { name: "aminer-academic-search", category: "Data", description: "Academic paper and scholar search via AMiner API", source: "built-in", installs: "built-in" },
  { name: "aminer-daily-paper", category: "Data", description: "Personalized academic paper recommendations", source: "built-in", installs: "built-in" },
  { name: "multi-search-engine", category: "Data", description: "Multi-engine web search aggregation", source: "built-in", installs: "built-in" },

  // Content
  { name: "seo-content-writer", category: "Content", description: "SEO content creation with GEO optimization", source: "ai-skills-library", installs: "\u2014" },
  { name: "seo-geo", category: "Content", description: "SEO + Generative Engine Optimization for AI visibility", source: "built-in", installs: "built-in" },
  { name: "blog-writer", category: "Content", description: "Blog post generation with style guide adherence", source: "built-in", installs: "built-in" },
  { name: "content-strategy", category: "Content", description: "Content strategy planning and execution", source: "built-in", installs: "built-in" },
  { name: "contentanalysis", category: "Content", description: "Extract wisdom and insights from content", source: "built-in", installs: "built-in" },
  { name: "writing-plans", category: "Content", description: "Structured writing plan creation", source: "built-in", installs: "built-in" },
  { name: "podcast-generate", category: "Content", description: "Podcast content generation from text", source: "built-in", installs: "built-in" },

  // Documents
  { name: "pdf", category: "Documents", description: "Create and manipulate PDF documents", source: "built-in", installs: "built-in" },
  { name: "docx", category: "Documents", description: "Create and edit Word documents", source: "built-in", installs: "built-in" },
  { name: "ppt", category: "Documents", description: "Create and edit PowerPoint presentations", source: "built-in", installs: "built-in" },
  { name: "charts", category: "Documents", description: "Professional chart and diagram creation", source: "built-in", installs: "built-in" },

  // AI/Media
  { name: "LLM", category: "AI/Media", description: "Large language model chat completions", source: "built-in", installs: "built-in" },
  { name: "TTS", category: "AI/Media", description: "Text-to-speech voice generation", source: "built-in", installs: "built-in" },
  { name: "ASR", category: "AI/Media", description: "Speech-to-text transcription", source: "built-in", installs: "built-in" },
  { name: "VLM", category: "AI/Media", description: "Vision-language model for image analysis", source: "built-in", installs: "built-in" },
  { name: "video-generation", category: "AI/Media", description: "AI-powered video generation from text/images", source: "built-in", installs: "built-in" },
  { name: "video-understand", category: "AI/Media", description: "Video content understanding and analysis", source: "built-in", installs: "built-in" },

  // Strategy
  { name: "jobs-to-be-done", category: "Strategy", description: "Jobs to Be Done product research methodology", source: "ai-skills-library", installs: "\u2014" },

  // Education
  { name: "explained-code", category: "Education", description: "Beginner-friendly code explanation with analogies and diagrams", source: "ai-skills-library", installs: "\u2014" },

  // Meta
  { name: "skill-creator", category: "Meta", description: "Create, modify, and benchmark AI agent skills", source: "built-in", installs: "170.0K" },
  { name: "skill-vetter", category: "Meta", description: "Security-first skill vetting for AI agents", source: "built-in", installs: "built-in" },
  { name: "skill-finder-cn", category: "Meta", description: "Chinese-language skill discovery and search", source: "built-in", installs: "built-in" },

  // Tools
  { name: "agent-browser", category: "Tools", description: "Headless browser automation for AI agents", source: "vercel-labs/agent-browser", installs: "216.3K" },

  // Other
  { name: "market-research-reports", category: "Other", description: "Generate market research reports with visualizations", source: "built-in", installs: "built-in" },
  { name: "storyboard-manager", category: "Other", description: "Story structure and character development management", source: "built-in", installs: "built-in" },
  { name: "interview-designer", category: "Other", description: "Design user research interview guides", source: "built-in", installs: "built-in" },
  { name: "marketing-mode", category: "Other", description: "Marketing strategy and execution mode", source: "built-in", installs: "built-in" },
  { name: "dream-interpreter", category: "Other", description: "Dream interpretation and analysis", source: "built-in", installs: "built-in" },
  { name: "gift-evaluator", category: "Other", description: "Gift evaluation and recommendation", source: "built-in", installs: "built-in" },
  { name: "anti-pua", category: "Other", description: "Anti-manipulation and critical thinking", source: "built-in", installs: "built-in" },
  { name: "auto-target-tracker", category: "Other", description: "Automatic target and goal tracking", source: "built-in", installs: "built-in" },
  { name: "mindfulness-meditation", category: "Other", description: "Mindfulness and meditation guidance", source: "built-in", installs: "built-in" },
  { name: "get-fortune-analysis", category: "Other", description: "Fortune analysis and interpretation", source: "built-in", installs: "built-in" },
  { name: "qingyan-research", category: "Other", description: "Qingyan research and analysis", source: "built-in", installs: "built-in" },
  { name: "ui-ux-pro-max", category: "Other", description: "Comprehensive UI/UX design with data-driven stacks", source: "nextlevelbuilder/ui-ux-pro-max-skill", installs: "134.8K" },
]

const SKILL_COMBOS: SkillCombo[] = [
  {
    name: "Frontend Stack",
    emoji: "\uD83C\uDFA8",
    skills: ["frontend-design", "react-best-practices", "composition-patterns", "shadcn", "web-design-guidelines"],
    tagline: "Architecture \u2192 Structure \u2192 Components \u2192 Quality Gate",
    useCase: "Building production-grade React UIs with distinctive design",
    synergy: "frontend-design sets the aesthetic vision, react-best-practices prevents performance pitfalls, composition-patterns ensures scalable architecture, shadcn provides battle-tested components, web-design-guidelines is the quality gate."
  },
  {
    name: "Ship It Stack",
    emoji: "\uD83D\uDE80",
    skills: ["chain-of-thought", "fullstack-dev", "shadcn", "supabase-postgres", "deployment-manager"],
    tagline: "Think \u2192 Build \u2192 Component \u2192 Persist \u2192 Deploy",
    useCase: "From idea to deployed product in one session",
    synergy: "chain-of-thought decomposes the problem, fullstack-dev scaffolds the app, shadcn gives instant UI, supabase-postgres handles data, deployment-manager ships it live."
  },
  {
    name: "Research Stack",
    emoji: "\uD83D\uDD2C",
    skills: ["deep-research", "web-search", "web-reader", "context-compressor"],
    tagline: "Search \u2192 Read \u2192 Distill \u2192 Compress",
    useCase: "Deep research from question to compressed briefing",
    synergy: "deep-research orchestrates multi-source investigation, web-search finds real-time data, web-reader extracts full content, context-compressor prevents token overflow."
  },
  {
    name: "Content Engine",
    emoji: "\u270D\uFE0F",
    skills: ["seo-geo", "seo-content-writer", "web-search", "output-formatter"],
    tagline: "Optimize \u2192 Write \u2192 Verify \u2192 Format",
    useCase: "Content that ranks in Google AND gets cited by AI assistants",
    synergy: "seo-geo targets both search engines and AI answer engines, seo-content-writer produces the content, web-search verifies claims, output-formatter ensures clean output."
  },
  {
    name: "Reasoning Stack",
    emoji: "\uD83E\uDDE0",
    skills: ["chain-of-thought", "devils-advocate", "simulation-sandbox"],
    tagline: "Think \u2192 Challenge \u2192 Verify",
    useCase: "Decision-making with rigorous analysis and stress-testing",
    synergy: "chain-of-thought decomposes the problem, devils-advocate attacks weak points, simulation-sandbox tests outcomes under different scenarios."
  },
  {
    name: "Design & Deliver",
    emoji: "\uD83D\uDC8E",
    skills: ["frontend-design", "gsap-animations", "shadcn", "fullstack-dev", "deployment-manager"],
    tagline: "Design \u2192 Animate \u2192 Build \u2192 Ship",
    useCase: "From mockup to live site with premium interactions",
    synergy: "frontend-design sets the creative direction, gsap-animations adds micro-interactions, shadcn provides components, fullstack-dev builds it, deployment-manager ships it."
  },
  {
    name: "Data Pipeline",
    emoji: "\uD83D\uDCCA",
    skills: ["xlsx", "charts", "finance", "context-compressor"],
    tagline: "Import \u2192 Visualize \u2192 Analyze \u2192 Distill",
    useCase: "Financial and data analysis from raw numbers to insights",
    synergy: "xlsx imports and processes data, charts creates visualizations, finance provides market data, context-compressor distills findings."
  },
  {
    name: "Education Stack",
    emoji: "\uD83D\uDCDA",
    skills: ["explained-code", "socratic-method", "output-formatter", "pdf"],
    tagline: "Explain \u2192 Guide \u2192 Format \u2192 Distribute",
    useCase: "Teaching and documentation that actually lands",
    synergy: "explained-code breaks down complexity with analogies, socratic-method guides discovery, output-formatter ensures consistency, pdf produces shareable documents."
  },
  {
    name: "DevOps Stack",
    emoji: "\u2699\uFE0F",
    skills: ["deployment-manager", "mcp-builder", "skill-creator", "skill-scanner"],
    tagline: "Build \u2192 Connect \u2192 Extend \u2192 Secure",
    useCase: "Infrastructure, integrations, and skill lifecycle management",
    synergy: "deployment-manager handles CI/CD, mcp-builder creates integrations, skill-creator builds new skills, skill-scanner secures them."
  },
  {
    name: "Creative Suite",
    emoji: "\uD83C\uDFAC",
    skills: ["image-generation", "gsap-animations", "charts", "web-artifacts-builder"],
    tagline: "Create \u2192 Animate \u2192 Visualize \u2192 Package",
    useCase: "Rich creative output from images to interactive demos",
    synergy: "image-generation creates visuals, gsap-animations brings them to life, charts adds data viz, web-artifacts-builder packages everything as a shareable artifact."
  },
  {
    name: "Mobile Stack",
    emoji: "\uD83D\uDCF1",
    skills: ["react-native-skills", "frontend-design", "composition-patterns"],
    tagline: "Mobile-first \u2192 Design \u2192 Architecture",
    useCase: "Building performant React Native/Expo mobile apps",
    synergy: "react-native-skills provides mobile-specific performance rules, frontend-design ensures distinctive UI, composition-patterns keeps component architecture clean."
  },
  {
    name: "Academic Stack",
    emoji: "\uD83C\uDF93",
    skills: ["aminer-academic-search", "aminer-daily-paper", "deep-research", "pdf"],
    tagline: "Discover \u2192 Track \u2192 Analyze \u2192 Publish",
    useCase: "Academic research from paper discovery to publication",
    synergy: "aminer finds papers and scholars, aminer-daily-paper tracks new publications, deep-research synthesizes findings, pdf produces formatted output."
  }
]

const TOP_SKILLS: TopSkill[] = [
  { rank: 1, name: "find-skills", source: "vercel-labs/skills", installs: "1.2M", category: "Development" },
  { rank: 2, name: "react-best-practices", source: "vercel-labs/agent-skills", installs: "352.5K", category: "Development" },
  { rank: 3, name: "frontend-design", source: "anthropics/skills", installs: "342.1K", category: "Development" },
  { rank: 4, name: "web-design-guidelines", source: "vercel-labs/agent-skills", installs: "280.8K", category: "Development" },
  { rank: 5, name: "shadcn", source: "shadcn/ui", installs: "110.8K", category: "Development" },
  { rank: 6, name: "agent-browser", source: "vercel-labs/agent-browser", installs: "216.3K", category: "Tools" },
  { rank: 7, name: "skill-creator", source: "anthropics/skills", installs: "170.0K", category: "Meta" },
  { rank: 8, name: "composition-patterns", source: "vercel-labs/agent-skills", installs: "150.8K", category: "Development" },
  { rank: 9, name: "brainstorming", source: "obra/superpowers", installs: "124.6K", category: "Development" },
  { rank: 10, name: "supabase-postgres", source: "supabase/agent-skills", installs: "125.0K", category: "Data" },
  { rank: 11, name: "ui-ux-pro-max", source: "nextlevelbuilder", installs: "134.8K", category: "Other" },
  { rank: 12, name: "react-native-skills", source: "vercel-labs/agent-skills", installs: "101.5K", category: "Development" },
]

const ONE_PROMPTS: OnePrompt[] = [
  {
    name: "Full Frontend Power",
    stack: "Frontend Stack",
    prompt: `Install these skills for production-grade React UI development:\n\n1. frontend-design \u2014 distinctive, non-AI-slop aesthetics\n2. react-best-practices \u2014 70 performance rules from Vercel\n3. composition-patterns \u2014 scalable component architecture\n4. shadcn \u2014 battle-tested UI components\n5. web-design-guidelines \u2014 quality gate for UI compliance\n\nTogether: Design vision + Performance + Architecture + Components + Quality = ship premium UIs fast.`
  },
  {
    name: "Ship It Now",
    stack: "Ship It Stack",
    prompt: `Install these skills to go from idea to deployed product:\n\n1. chain-of-thought \u2014 decompose complex problems\n2. fullstack-dev \u2014 scaffold full-stack Next.js apps\n3. shadcn \u2014 instant UI components\n4. supabase-postgres \u2014 database best practices\n5. deployment-manager \u2014 ship to Vercel/Netlify/GH Pages\n\nTogether: Think + Build + UI + Data + Deploy = zero-to-live in one session.`
  },
  {
    name: "Deep Research Pipeline",
    stack: "Research Stack",
    prompt: `Install these skills for comprehensive research workflows:\n\n1. deep-research \u2014 multi-source investigation orchestrator\n2. web-search \u2014 real-time information retrieval\n3. web-reader \u2014 full content extraction with crawling\n4. context-compressor \u2014 prevent token overflow, preserve decisions\n\nTogether: Search + Read + Distill + Compress = research that scales.`
  },
  {
    name: "Reason & Decide",
    stack: "Reasoning Stack",
    prompt: `Install these skills for rigorous decision-making:\n\n1. chain-of-thought \u2014 step-by-step problem decomposition\n2. devils-advocate \u2014 stress-test arguments, return stronger version\n3. simulation-sandbox \u2014 test scenarios with labeled simulated data\n\nTogether: Think + Challenge + Verify = decisions that survive contact with reality.`
  },
  {
    name: "Content That Ranks",
    stack: "Content Engine",
    prompt: `Install these skills for content that ranks in Google AND AI:\n\n1. seo-geo \u2014 optimize for search engines AND AI answer engines\n2. seo-content-writer \u2014 production SEO content creation\n3. web-search \u2014 verify claims with real-time data\n4. output-formatter \u2014 clean, structured output every time\n\nTogether: Optimize + Write + Verify + Format = content that gets found and cited.`
  }
]

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Development": { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  "Reasoning": { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  "DevOps": { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/30" },
  "Creative": { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/30" },
  "Data": { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30" },
  "Content": { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  "Documents": { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/30" },
  "AI/Media": { bg: "bg-rose-500/15", text: "text-rose-400", border: "border-rose-500/30" },
  "Strategy": { bg: "bg-teal-500/15", text: "text-teal-400", border: "border-teal-500/30" },
  "Education": { bg: "bg-lime-500/15", text: "text-lime-400", border: "border-lime-500/30" },
  "Meta": { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30" },
  "Tools": { bg: "bg-indigo-500/15", text: "text-indigo-400", border: "border-indigo-500/30" },
  "Other": { bg: "bg-slate-500/15", text: "text-slate-400", border: "border-slate-500/30" },
}

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS["Other"]
}

function parseInstalls(s: string): number {
  if (s === "built-in" || s === "\u2014") return 0
  const num = parseFloat(s)
  if (s.endsWith('M')) return num * 1_000_000
  if (s.endsWith('K')) return num * 1_000
  return num
}

const ALL_CATEGORIES = Array.from(new Set(INSTALLED_SKILLS.map(s => s.category)))

const NAV_ITEMS = [
  { id: "hero", label: "Top" },
  { id: "top-skills", label: "Top Skills" },
  { id: "stacks", label: "Stacks" },
  { id: "directory", label: "Directory" },
  { id: "analysis", label: "Analysis" },
  { id: "install", label: "Install" },
]

// ──────────────────────────────────────────────────────────
// COMPONENT
// ──────────────────────────────────────────────────────────

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [darkMode, setDarkMode] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null)
  const [sortField, setSortField] = useState<"rank" | "name" | "installs">("rank")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeSection, setActiveSection] = useState("hero")
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({})

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )
    Object.values(sectionsRef.current).forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // fallback
    }
  }, [])

  // Filtered skills
  const filteredSkills = useMemo(() => {
    let skills = INSTALLED_SKILLS
    if (selectedCategory !== "All") {
      skills = skills.filter(s => s.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      skills = skills.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.source.toLowerCase().includes(q)
      )
    }
    return skills
  }, [searchQuery, selectedCategory])

  // Sorted top skills
  const sortedTopSkills = useMemo(() => {
    const sorted = [...TOP_SKILLS]
    sorted.sort((a, b) => {
      let cmp = 0
      if (sortField === "rank") cmp = a.rank - b.rank
      else if (sortField === "name") cmp = a.name.localeCompare(b.name)
      else if (sortField === "installs") cmp = parseInstalls(a.installs) - parseInstalls(b.installs)
      return sortDir === "asc" ? cmp : -cmp
    })
    return sorted
  }, [sortField, sortDir])

  // Category analysis data
  const categoryAnalysis = useMemo(() => {
    const cats = ALL_CATEGORIES.map(cat => {
      const skills = INSTALLED_SKILLS.filter(s => s.category === cat)
      const withInstalls = skills.filter(s => s.installs !== "built-in" && s.installs !== "\u2014")
      const topSkill = withInstalls.sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs))[0]
      const avgInstalls = withInstalls.length > 0
        ? withInstalls.reduce((sum, s) => sum + parseInstalls(s.installs), 0) / withInstalls.length
        : 0
      const bestStack = SKILL_COMBOS.find(c => c.skills.some(sk => skills.some(s => s.name === sk)))
      return {
        category: cat,
        count: skills.length,
        topSkill: topSkill?.name ?? "\u2014",
        topInstalls: topSkill?.installs ?? "\u2014",
        avgInstalls: avgInstalls > 0 ? `${(avgInstalls / 1000).toFixed(1)}K` : "\u2014",
        bestStack: bestStack?.name ?? "\u2014",
      }
    })
    return cats.sort((a, b) => b.count - a.count)
  }, [])

  const toggleSort = (field: "rank" | "name" | "installs") => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const renderSortIcon = (field: "rank" | "name" | "installs") => {
    if (sortField !== field) return null
    return sortDir === "asc" ? <ArrowUp className="inline size-3 ml-1" /> : <ArrowDown className="inline size-3 ml-1" />
  }

  // Ref setter helper
  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionsRef.current[id] = el
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#111111] text-white' : 'bg-white text-gray-900'}`}>
      {/* ─── STICKY HEADER ─── */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${darkMode ? 'bg-[#111111]/80 border-[#2a2a2a]' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <Sparkles className="size-5 text-amber-500" />
              <span className="font-bold text-base tracking-tight">Skills Portal</span>
            </div>

            {/* Nav - hidden on mobile */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'text-amber-500 bg-amber-500/10'
                      : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Search + Theme */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 size-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <Input
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`pl-8 w-36 sm:w-56 h-8 text-sm ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a] focus:border-amber-500/50' : 'bg-gray-50'}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── 1. HERO ─── */}
        <section id="hero" ref={setSectionRef("hero")} className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
            {/* Gradient accent line */}
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-8" />

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              AI Agent<br />
              <span className="text-amber-500">Skills Portal</span>
            </h1>
            <p className={`mt-5 text-lg sm:text-xl max-w-2xl leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              A directory, installation source, and stack recommendation engine for 72 production-ready agent skills. Browse, combine, and deploy.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-6">
              {[
                { label: "Skills", value: "72", icon: Package },
                { label: "Stacks", value: "12", icon: Layers },
                { label: "Categories", value: "10", icon: Filter },
                { label: "Top Install", value: "1.2M", icon: Trophy },
              ].map(stat => (
                <div key={stat.label} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
                  <stat.icon className="size-4 text-amber-500" />
                  <span className={`text-2xl font-bold font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </section>

        {/* ─── 2. QUICK STATS BAR ─── */}
        <section className={`border-y ${darkMode ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 py-4 overflow-x-auto scrollbar-hide">
              {[
                { label: "Total Skills", value: "72", sub: "installed & available" },
                { label: "Categories", value: "10", sub: "organized domains" },
                { label: "Curated Stacks", value: "12", sub: "synergy-optimized" },
                { label: "Community Installs", value: "2.5M+", sub: "across all skills" },
                { label: "Built-in Skills", value: "38", sub: "zero-config ready" },
                { label: "Open Source", value: "34", sub: "community contributed" },
              ].map(stat => (
                <div
                  key={stat.label}
                  className={`flex-shrink-0 px-5 py-3 rounded-lg border min-w-[160px] ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}
                >
                  <div className="text-xl font-bold font-mono text-amber-500">{stat.value}</div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.label}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 3. TOP SKILLS TABLE ─── */}
        <section id="top-skills" ref={setSectionRef("top-skills")} className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Top Skills by Installs</h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Community adoption ranking — click column headers to sort
              </p>
            </div>

            <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
              <Table>
                <TableHeader>
                  <TableRow className={`${darkMode ? 'border-[#2a2a2a] hover:bg-transparent' : 'border-gray-100'}`}>
                    <TableHead className={`cursor-pointer select-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} onClick={() => toggleSort("rank")}>
                      # {renderSortIcon("rank")}
                    </TableHead>
                    <TableHead className={`cursor-pointer select-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} onClick={() => toggleSort("name")}>
                      Skill {renderSortIcon("name")}
                    </TableHead>
                    <TableHead className={`hidden sm:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Source</TableHead>
                    <TableHead className={`cursor-pointer select-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} onClick={() => toggleSort("installs")}>
                      Installs {renderSortIcon("installs")}
                    </TableHead>
                    <TableHead className={`hidden md:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</TableHead>
                    <TableHead className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTopSkills.map(skill => {
                    const colors = getCategoryColor(skill.category)
                    return (
                      <TableRow key={skill.rank} className={`${darkMode ? 'border-[#2a2a2a]' : 'border-gray-100'}`}>
                        <TableCell className="font-mono text-amber-500 font-bold">{skill.rank}</TableCell>
                        <TableCell className="font-medium">{skill.name}</TableCell>
                        <TableCell className={`hidden sm:table-cell font-mono text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{skill.source}</TableCell>
                        <TableCell className="font-mono font-semibold">{skill.installs}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {skill.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => copyToClipboard(`npx skills install ${skill.name}`, `top-${skill.rank}`)}
                          >
                            {copiedId === `top-${skill.rank}` ? (
                              <><Check className="size-3 mr-1 text-emerald-400" /> Copied</>
                            ) : (
                              <><Copy className="size-3 mr-1" /> Install</>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* ─── 4. SKILL COMBINATIONS / STACKS ─── */}
        <section id="stacks" ref={setSectionRef("stacks")} className={`py-16 sm:py-20 border-t ${darkMode ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Curated Skill Stacks</h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Synergy-optimized combinations — each stack is greater than the sum of its skills
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {SKILL_COMBOS.map(combo => {
                const comboSkills = combo.skills.map(name => INSTALLED_SKILLS.find(s => s.name === name)).filter(Boolean) as Skill[]
                return (
                  <Card
                    key={combo.name}
                    className={`transition-all duration-200 hover:scale-[1.01] ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-amber-500/30' : 'bg-white border-gray-200 hover:border-amber-500/40'}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{combo.emoji}</span>
                          <CardTitle className="text-lg">{combo.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className={`font-mono text-xs ${darkMode ? 'text-amber-500/70' : 'text-amber-600'}`}>
                        {combo.tagline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Skill pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {comboSkills.map(skill => {
                          if (!skill) return null
                          const colors = getCategoryColor(skill.category)
                          return (
                            <span
                              key={skill.name}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
                            >
                              {skill.name}
                            </span>
                          )
                        })}
                      </div>

                      {/* Use case */}
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Use case:</span> {combo.useCase}
                      </p>

                      {/* Synergy - collapsible */}
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="synergy" className={`border-0 ${darkMode ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                          <AccordionTrigger className={`py-1 text-xs font-medium hover:no-underline ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            How they synergize
                          </AccordionTrigger>
                          <AccordionContent className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {combo.synergy}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Copy Stack Prompt */}
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full h-8 text-xs ${darkMode ? 'border-[#2a2a2a] hover:border-amber-500/50 hover:bg-amber-500/10' : 'border-gray-200 hover:border-amber-500/50 hover:bg-amber-50'}`}
                        onClick={() => {
                          const prompt = ONE_PROMPTS.find(p => p.stack === combo.name)?.prompt ?? combo.skills.join(', ')
                          copyToClipboard(prompt, `stack-${combo.name}`)
                        }}
                      >
                        {copiedId === `stack-${combo.name}` ? (
                          <><Check className="size-3 mr-1 text-emerald-400" /> Copied!</>
                        ) : (
                          <><Copy className="size-3 mr-1" /> Copy Stack Prompt</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── 5. ALL SKILLS DIRECTORY ─── */}
        <section id="directory" ref={setSectionRef("directory")} className="py-16 sm:py-20 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">All Skills Directory</h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Browse all 72 installed skills — filter by category or search
              </p>
            </div>

            {/* Category tabs */}
            <div className="mb-6 overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === "All"
                      ? 'bg-amber-500 text-black'
                      : darkMode ? 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({INSTALLED_SKILLS.length})
                </button>
                {ALL_CATEGORIES.map(cat => {
                  const count = INSTALLED_SKILLS.filter(s => s.category === cat).length
                  const colors = getCategoryColor(cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        selectedCategory === cat
                          ? `bg-amber-500 text-black`
                          : darkMode
                            ? `bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:text-white`
                            : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSkills.map(skill => {
                const colors = getCategoryColor(skill.category)
                const isExpanded = expandedSkill === skill.name
                return (
                  <div
                    key={skill.name}
                    className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                      darkMode
                        ? `bg-[#1a1a1a] border-[#2a2a2a] hover:border-amber-500/30 ${isExpanded ? 'border-amber-500/40' : ''}`
                        : `bg-white border-gray-200 hover:border-amber-500/30 ${isExpanded ? 'border-amber-500/40' : ''}`
                    }`}
                    onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">{skill.name}</h3>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {skill.category}
                          </span>
                        </div>
                        <p className={`mt-1 text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {skill.description}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {isExpanded ? <ChevronDown className="size-4 text-amber-500" /> : <ChevronRight className={`size-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className={`mt-3 pt-3 border-t space-y-2 ${darkMode ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-4 text-xs">
                          <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                            Source: <span className={`font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{skill.source}</span>
                          </span>
                          <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                            Installs: <span className="font-mono font-semibold text-amber-500">{skill.installs}</span>
                          </span>
                        </div>

                        {/* Stacks this skill appears in */}
                        {(() => {
                          const inStacks = SKILL_COMBOS.filter(c => c.skills.includes(skill.name))
                          if (inStacks.length === 0) return null
                          return (
                            <div className="text-xs">
                              <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>In stacks: </span>
                              {inStacks.map((s, i) => (
                                <span key={s.name}>
                                  <span className="font-medium">{s.emoji} {s.name}</span>
                                  {i < inStacks.length - 1 && <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}> \u00B7 </span>}
                                </span>
                              ))}
                            </div>
                          )
                        })()}

                        <Button
                          variant="outline"
                          size="sm"
                          className={`h-7 text-xs ${darkMode ? 'border-[#2a2a2a] hover:border-amber-500/50 hover:bg-amber-500/10' : 'border-gray-200 hover:border-amber-500/50'}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(`npx skills install ${skill.name}`, `skill-${skill.name}`)
                          }}
                        >
                          {copiedId === `skill-${skill.name}` ? (
                            <><Check className="size-3 mr-1 text-emerald-400" /> Copied</>
                          ) : (
                            <><Copy className="size-3 mr-1" /> Copy Install Command</>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {filteredSkills.length === 0 && (
              <div className={`text-center py-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <Search className="size-8 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No skills found</p>
                <p className="text-sm mt-1">Try a different search or category</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── 6. COMPARATIVE ANALYSIS ─── */}
        <section id="analysis" ref={setSectionRef("analysis")} className={`py-16 sm:py-20 border-t ${darkMode ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Comparative Analysis</h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Which categories are strongest? A data-driven breakdown
              </p>
            </div>

            <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
              <Table>
                <TableHeader>
                  <TableRow className={darkMode ? 'border-[#2a2a2a] hover:bg-transparent' : 'border-gray-100'}>
                    <TableHead className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Category</TableHead>
                    <TableHead className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Skills</TableHead>
                    <TableHead className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Top Skill</TableHead>
                    <TableHead className={`hidden sm:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top Installs</TableHead>
                    <TableHead className={`hidden md:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Installs</TableHead>
                    <TableHead className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Best Stack</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryAnalysis.map(row => {
                    const colors = getCategoryColor(row.category)
                    return (
                      <TableRow key={row.category} className={darkMode ? 'border-[#2a2a2a]' : 'border-gray-100'}>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {row.category}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono font-bold">{row.count}</TableCell>
                        <TableCell className="font-medium text-sm">{row.topSkill}</TableCell>
                        <TableCell className={`hidden sm:table-cell font-mono text-amber-500 font-semibold`}>{row.topInstalls}</TableCell>
                        <TableCell className={`hidden md:table-cell font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{row.avgInstalls}</TableCell>
                        <TableCell className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{row.bestStack}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Strength indicators */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Most Skills", value: "Development (14)", detail: "Dominates the ecosystem", accent: "text-amber-500" },
                { label: "Highest Installs", value: "Development (1.2M)", detail: "find-skills leads all skills", accent: "text-emerald-400" },
                { label: "Deepest Stack", value: "Frontend Stack (5 skills)", detail: "Design→Structure→Components→Quality", accent: "text-pink-400" },
                { label: "Fastest Growing", value: "Data (10 skills)", detail: "Research, finance, academics", accent: "text-cyan-400" },
                { label: "Most Self-Sufficient", value: "AI/Media (6 built-in)", detail: "Zero external dependencies", accent: "text-rose-400" },
                { label: "Best Synergy", value: "Ship It Stack", detail: "Think→Build→UI→Data→Deploy", accent: "text-sky-400" },
              ].map(item => (
                <div
                  key={item.label}
                  className={`rounded-lg border p-4 ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}
                >
                  <div className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</div>
                  <div className={`text-sm font-bold mt-1 ${item.accent}`}>{item.value}</div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 7. ONE-PROMPT INSTALL ─── */}
        <section id="install" ref={setSectionRef("install")} className="py-16 sm:py-20 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">One-Prompt Install</h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Copy a single prompt, paste it to your agent, get a full stack installed
              </p>
            </div>

            <div className="space-y-4">
              {ONE_PROMPTS.map((prompt, idx) => (
                <div
                  key={prompt.name}
                  className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}
                >
                  <Accordion type="single" collapsible>
                    <AccordionItem value="prompt" className="border-0">
                      <AccordionTrigger className={`px-6 py-4 hover:no-underline ${darkMode ? 'hover:bg-[#222]' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center justify-center size-7 rounded-md font-bold text-sm ${darkMode ? 'bg-amber-500/15 text-amber-500' : 'bg-amber-100 text-amber-700'}`}>
                            {idx + 1}
                          </span>
                          <div className="text-left">
                            <div className="font-semibold">{prompt.name}</div>
                            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{prompt.stack}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className={`rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap ${darkMode ? 'bg-[#0d0d0d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                          {prompt.prompt}
                        </div>
                        <Button
                          className="mt-3 bg-amber-500 hover:bg-amber-600 text-black font-medium"
                          size="sm"
                          onClick={() => copyToClipboard(prompt.prompt, `prompt-${prompt.name}`)}
                        >
                          {copiedId === `prompt-${prompt.name}` ? (
                            <><Check className="size-4 mr-2" /> Copied to Clipboard!</>
                          ) : (
                            <><Copy className="size-4 mr-2" /> Copy to Clipboard</>
                          )}
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 8. SKILLS INSTALLATION GUIDE ─── */}
        <section className={`py-16 sm:py-20 border-t ${darkMode ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Installation Guide</h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Three ways to install skills into your agent
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Method 1 */}
              <div className={`rounded-xl border p-6 ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="size-5 text-amber-500" />
                  <h3 className="font-bold text-lg">npx skills</h3>
                </div>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Install directly from the CLI. Fastest method for single skills.
                </p>
                <div className={`rounded-lg p-4 font-mono text-sm ${darkMode ? 'bg-[#0d0d0d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                  <div className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}># Install a single skill</div>
                  <div>npx skills install react-best-practices</div>
                  <div className={`text-xs mt-3 mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}># Install a full stack</div>
                  <div>npx skills install-stack frontend-stack</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`mt-3 w-full ${darkMode ? 'border-[#2a2a2a] hover:border-amber-500/50' : 'border-gray-200 hover:border-amber-500/50'}`}
                  onClick={() => copyToClipboard('npx skills install react-best-practices', 'guide-1')}
                >
                  {copiedId === 'guide-1' ? <><Check className="size-3 mr-1 text-emerald-400" /> Copied</> : <><Copy className="size-3 mr-1" /> Copy Command</>}
                </Button>
              </div>

              {/* Method 2 */}
              <div className={`rounded-xl border p-6 ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="size-5 text-amber-500" />
                  <h3 className="font-bold text-lg">SKILL.md Copy</h3>
                </div>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Copy the SKILL.md file directly into your project. Full control over content.
                </p>
                <div className={`rounded-lg p-4 font-mono text-sm ${darkMode ? 'bg-[#0d0d0d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                  <div className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}># Create skills directory</div>
                  <div>mkdir -p .skills</div>
                  <div className={`text-xs mt-3 mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}># Copy skill file</div>
                  <div>curl -o .skills/react-best-practices.md \</div>
                  <div>&nbsp;&nbsp;https://skills.dev/react-best-practices/SKILL.md</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`mt-3 w-full ${darkMode ? 'border-[#2a2a2a] hover:border-amber-500/50' : 'border-gray-200 hover:border-amber-500/50'}`}
                  onClick={() => copyToClipboard('mkdir -p .skills && curl -o .skills/react-best-practices.md https://skills.dev/react-best-practices/SKILL.md', 'guide-2')}
                >
                  {copiedId === 'guide-2' ? <><Check className="size-3 mr-1 text-emerald-400" /> Copied</> : <><Copy className="size-3 mr-1" /> Copy Command</>}
                </Button>
              </div>

              {/* Method 3 */}
              <div className={`rounded-xl border p-6 ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="size-5 text-amber-500" />
                  <h3 className="font-bold text-lg">AGENTS.md Setup</h3>
                </div>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Register skills in your AGENTS.md for automatic agent discovery.
                </p>
                <div className={`rounded-lg p-4 font-mono text-sm ${darkMode ? 'bg-[#0d0d0d] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                  <div className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}># In AGENTS.md</div>
                  <div className="text-amber-500">## Skills</div>
                  <div>- frontend-design</div>
                  <div>- react-best-practices</div>
                  <div>- shadcn</div>
                  <div className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}># Agent auto-loads these on start</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`mt-3 w-full ${darkMode ? 'border-[#2a2a2a] hover:border-amber-500/50' : 'border-gray-200 hover:border-amber-500/50'}`}
                  onClick={() => copyToClipboard('## Skills\n- frontend-design\n- react-best-practices\n- shadcn', 'guide-3')}
                >
                  {copiedId === 'guide-3' ? <><Check className="size-3 mr-1 text-emerald-400" /> Copied</> : <><Copy className="size-3 mr-1" /> Copy Template</>}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── 9. FOOTER ─── */}
      <footer className={`border-t py-8 mt-auto ${darkMode ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Built with the compounding system principle \u2014 each skill makes every other skill more valuable
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a
                href="https://github.com/vercel-labs/agent-skills"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 hover:text-amber-500 transition-colors ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
              >
                <ExternalLink className="size-3" /> vercel-labs/agent-skills
              </a>
              <a
                href="https://github.com/anthropics/skills"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 hover:text-amber-500 transition-colors ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
              >
                <ExternalLink className="size-3" /> anthropics/skills
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
