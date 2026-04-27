'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  Search, Copy, Check, ChevronDown, ChevronRight, Moon, Sun,
  Terminal, Package, Layers, Trophy, Zap, BookOpen, ArrowUp,
  ArrowDown, ExternalLink, Hash, Sparkles, Filter, X, AlertTriangle,
  Shield, ArrowRightLeft, Database, Code, Lightbulb, FileText, Globe,
  ChevronUp
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
import { Separator } from '@/components/ui/separator'

// ──────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────

interface Skill {
  name: string
  category: string
  description: string
  source: string
  installs: string
  isNew?: boolean
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
  isNew?: boolean
}

interface OnePrompt {
  name: string
  stack: string
  prompt: string
}

interface SkillOverlap {
  domain: string
  skills: { name: string; approach: string; bestFor: string }[]
  routing: string
}

interface SkillUpgrade {
  original: string
  upgraded: string
  newCapabilities: string
  status: string
}

interface ErrorStandard {
  skill: string
  errorTypes: { type: string; code: string; action: string }[]
}

const INSTALLED_SKILLS: Skill[] = [
  // AI/Media (7)
  { name: "LLM", category: "AI/Media", description: "Large language model chat completions", source: "built-in", installs: "built-in" },
  { name: "TTS", category: "AI/Media", description: "Text-to-speech voice generation", source: "built-in", installs: "built-in" },
  { name: "ASR", category: "AI/Media", description: "Speech-to-text transcription", source: "built-in", installs: "built-in" },
  { name: "VLM", category: "AI/Media", description: "Vision-language model for image analysis", source: "built-in", installs: "built-in" },
  { name: "video-generation", category: "AI/Media", description: "AI-powered video generation from text/images", source: "built-in", installs: "built-in" },
  { name: "video-understand", category: "AI/Media", description: "Video content understanding and analysis", source: "built-in", installs: "built-in" },
  { name: "image-generation", category: "AI/Media", description: "AI image generation from text descriptions", source: "built-in", installs: "built-in" },

  // Development (13)
  { name: "fullstack-dev", category: "Development", description: "Fullstack Next.js 16 development with React, API routes, and Prisma", source: "built-in", installs: "built-in" },
  { name: "coding-agent", category: "Development", description: "Autonomous coding with planning, execution, and verification", source: "built-in", installs: "built-in" },
  { name: "superpowers", category: "Development", description: "Spec-first project orchestration \u2014 staff engineer workflow in one skill", source: "skills.sh", installs: "\u2014", isNew: true },
  { name: "mcp-builder", category: "Development", description: "Build MCP servers in TypeScript and Python", source: "ai-skills-library", installs: "\u2014" },
  { name: "web-artifacts-builder", category: "Development", description: "Single-file HTML artifacts with React + Tailwind", source: "ai-skills-library", installs: "\u2014" },
  { name: "react-best-practices", category: "Development", description: "70 React/Next.js performance rules from Vercel Engineering", source: "vercel-labs/agent-skills", installs: "352.5K" },
  { name: "composition-patterns", category: "Development", description: "React composition patterns that scale \u2014 compound components, state lifting", source: "vercel-labs/agent-skills", installs: "150.8K" },
  { name: "react-native-skills", category: "Development", description: "React Native and Expo best practices for performant mobile apps", source: "vercel-labs/agent-skills", installs: "101.5K" },
  { name: "next-best-practices", category: "Development", description: "Next.js file conventions, RSC boundaries, data patterns, async APIs", source: "vercel-labs/next-skills", installs: "73.3K" },
  { name: "shadcn", category: "Development", description: "shadcn/ui component management \u2014 adding, styling, composing UI", source: "shadcn/ui", installs: "110.8K" },
  { name: "find-skills", category: "Development", description: "Discover and install agent skills from the open ecosystem", source: "vercel-labs/skills", installs: "1.2M" },
  { name: "skill-scanner", category: "Development", description: "Scan agent skills for security issues before adoption", source: "getsentry/skills", installs: "\u2014" },
  { name: "brainstorming", category: "Development", description: "Turn ideas into fully formed designs through collaborative dialogue", source: "obra/superpowers", installs: "124.6K" },

  // Design/UI (8)
  { name: "frontend-design", category: "Design/UI", description: "Create distinctive, production-grade frontend interfaces avoiding AI slop", source: "anthropics/skills", installs: "342.1K" },
  { name: "ui-ux-pro-max", category: "Design/UI", description: "Comprehensive UI/UX design with data-driven stacks", source: "nextlevelbuilder/ui-ux-pro-max-skill", installs: "134.8K" },
  { name: "visual-design-foundations", category: "Design/UI", description: "Typography, color systems, spacing and iconography foundations", source: "built-in", installs: "built-in" },
  { name: "web-design-guidelines", category: "Design/UI", description: "Review UI code for Web Interface Guidelines compliance", source: "vercel-labs/agent-skills", installs: "280.8K" },
  { name: "gsap-animations", category: "Design/UI", description: "Professional web animations with GSAP \u2014 ScrollTrigger, Flip, MorphSVG", source: "xerxes-on/gsap-animation-skill", installs: "\u2014" },
  { name: "web-shader-extractor", category: "Design/UI", description: "Extract WebGL/Canvas/Shader visual effects from web pages", source: "built-in", installs: "built-in" },
  { name: "image-understand", category: "Design/UI", description: "Vision-based AI analysis of images", source: "built-in", installs: "built-in" },
  { name: "image-edit", category: "Design/UI", description: "AI-powered image editing capabilities", source: "built-in", installs: "built-in" },

  // Content (10)
  { name: "seo-content-writer", category: "Content", description: "SEO content creation with GEO optimization", source: "ai-skills-library", installs: "\u2014" },
  { name: "seo-geo", category: "Content", description: "SEO + Generative Engine Optimization for AI visibility", source: "built-in", installs: "built-in" },
  { name: "blog-writer", category: "Content", description: "Blog post generation with style guide adherence", source: "built-in", installs: "built-in" },
  { name: "humanizer", category: "Content", description: "Strip AI writing patterns \u2014 makes generated text sound human", source: "skills.sh", installs: "\u2014", isNew: true },
  { name: "content-strategy", category: "Content", description: "Content strategy planning and editorial calendar", source: "skills.sh", installs: "\u2014" },
  { name: "social-media-manager", category: "Content", description: "Multi-platform social content execution with brand voice", source: "skills.sh", installs: "\u2014", isNew: true },
  { name: "contentanalysis", category: "Content", description: "Extract wisdom and insights from content", source: "built-in", installs: "built-in" },
  { name: "writing-plans", category: "Content", description: "Structured writing plan creation", source: "built-in", installs: "built-in" },
  { name: "podcast-generate", category: "Content", description: "Podcast content generation from text", source: "built-in", installs: "built-in" },
  { name: "marketing-mode", category: "Content", description: "Marketing strategy and execution mode", source: "built-in", installs: "built-in" },
  { name: "gumroad-pipeline", category: "Content", description: "Digital product monetization funnel — pricing, landing pages, email sequences", source: "ai-skills-library", installs: "—", isNew: true },

  // Research (9)
  { name: "web-search", category: "Research", description: "Web search for real-time information retrieval", source: "built-in", installs: "built-in" },
  { name: "web-reader", category: "Research", description: "Web page extraction with site crawling and spidering", source: "ai-skills-library", installs: "\u2014" },
  { name: "deep-research", category: "Research", description: "Comprehensive multi-source research workflow", source: "built-in", installs: "built-in" },
  { name: "multi-search-engine", category: "Research", description: "Multi-engine web search aggregation", source: "built-in", installs: "built-in" },
  { name: "aminer-academic-search", category: "Research", description: "Academic paper and scholar search via AMiner API", source: "built-in", installs: "built-in" },
  { name: "aminer-daily-paper", category: "Research", description: "Personalized academic paper recommendations", source: "built-in", installs: "built-in" },
  { name: "aminer-open-academic", category: "Research", description: "Open academic data access via AMiner platform", source: "built-in", installs: "built-in" },
  { name: "ai-news-collectors", category: "Research", description: "AI news aggregation and collection", source: "built-in", installs: "built-in" },
  { name: "qingyan-research", category: "Research", description: "Qingyan research and analysis", source: "built-in", installs: "built-in" },

  // Business (7)
  { name: "finance", category: "Business", description: "Real-time and historical financial data analysis", source: "built-in", installs: "built-in" },
  { name: "stock-analysis-skill", category: "Business", description: "Stock market analysis with watchlist and rumor scanning", source: "built-in", installs: "built-in" },
  { name: "market-research-reports", category: "Business", description: "Generate market research reports with visualizations", source: "built-in", installs: "built-in" },
  { name: "jobs-to-be-done", category: "Business", description: "Jobs to Be Done product research methodology", source: "ai-skills-library", installs: "\u2014" },
  { name: "gift-evaluator", category: "Business", description: "Gift evaluation and recommendation", source: "built-in", installs: "built-in" },
  { name: "get-fortune-analysis", category: "Business", description: "Fortune analysis and interpretation", source: "built-in", installs: "built-in" },
  { name: "auto-target-tracker", category: "Business", description: "Automatic target and goal tracking", source: "built-in", installs: "built-in" },

  // DevOps (4)
  { name: "deployment-manager", category: "DevOps", description: "Deploy, monitor, and update projects across Vercel/Netlify/GH Pages", source: "ai-skills-library", installs: "\u2014" },
  { name: "supabase-postgres", category: "DevOps", description: "Postgres performance optimization from Supabase", source: "supabase/agent-skills", installs: "125.0K" },

  // Reasoning (6)
  { name: "chain-of-thought", category: "Reasoning", description: "Step-by-step reasoning for decomposing complex problems", source: "ai-skills-library", installs: "\u2014" },
  { name: "socratic-method", category: "Reasoning", description: "Guide users through strategic questioning to uncover assumptions", source: "ai-skills-library", installs: "\u2014" },
  { name: "devils-advocate", category: "Reasoning", description: "Argue against premises to strengthen arguments and stress-test ideas", source: "ai-skills-library", installs: "\u2014" },
  { name: "caveman", category: "Reasoning", description: "Ultra-compressed communication mode \u2014 cuts token usage ~75%", source: "juliusbrussee/caveman", installs: "84.7K" },
  { name: "context-compressor", category: "Reasoning", description: "Compress long contexts preserving decisions, actions, constraints", source: "ai-skills-library", installs: "\u2014" },
  { name: "simulation-sandbox", category: "Reasoning", description: "Test scenarios in simulated environments before real execution", source: "ai-skills-library", installs: "\u2014" },

  // Documents (5)
  { name: "pdf", category: "Documents", description: "Create and manipulate PDF documents", source: "built-in", installs: "built-in" },
  { name: "docx", category: "Documents", description: "Create and edit Word documents", source: "built-in", installs: "built-in" },
  { name: "ppt", category: "Documents", description: "Create and edit PowerPoint presentations", source: "built-in", installs: "built-in" },
  { name: "xlsx", category: "Documents", description: "Create, edit, and analyze Excel spreadsheets", source: "built-in", installs: "built-in" },
  { name: "charts", category: "Documents", description: "Professional chart and diagram creation", source: "built-in", installs: "built-in" },

  // Browser (2)
  { name: "agent-browser", category: "Browser", description: "Headless browser automation CLI for AI agents", source: "vercel-labs/agent-browser", installs: "216.3K" },
  { name: "browser-use", category: "Browser", description: "Natural language browser automation \u2014 no Playwright code needed", source: "skills.sh", installs: "\u2014", isNew: true },

  // Meta (4)
  { name: "skill-creator", category: "Meta", description: "Create, modify, and benchmark AI agent skills", source: "built-in", installs: "170.0K" },
  { name: "skill-vetter", category: "Meta", description: "Security-first skill vetting for AI agents", source: "built-in", installs: "built-in" },
  { name: "skill-finder-cn", category: "Meta", description: "Chinese-language skill discovery and search", source: "built-in", installs: "built-in" },
  { name: "output-formatter", category: "Meta", description: "Strict formatting rules for JSON, tables, markdown, code", source: "ai-skills-library", installs: "\u2014" },

  // Education (1)
  { name: "explained-code", category: "Education", description: "Beginner-friendly code explanation with analogies and diagrams", source: "ai-skills-library", installs: "\u2014" },

  // Specialty (7)
  { name: "interview-designer", category: "Specialty", description: "Design user research interview guides", source: "built-in", installs: "built-in" },
  { name: "storyboard-manager", category: "Specialty", description: "Story structure and character development management", source: "built-in", installs: "built-in" },
  { name: "photography-ai", category: "Specialty", description: "Professional visual engineering framework for photography", source: "ai-skills-library", installs: "\u2014" },
  { name: "dream-interpreter", category: "Specialty", description: "Dream interpretation and analysis", source: "built-in", installs: "built-in" },
  { name: "mindfulness-meditation", category: "Specialty", description: "Mindfulness and meditation guidance", source: "built-in", installs: "built-in" },
  { name: "anti-pua", category: "Specialty", description: "Anti-manipulation and critical thinking", source: "built-in", installs: "built-in" },
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
  },
  {
    name: "Product Launch Stack",
    emoji: "\uD83D\uDE80",
    skills: ["superpowers", "frontend-design", "react-best-practices", "deployment-manager", "social-media-manager", "humanizer"],
    tagline: "Spec \u2192 Design \u2192 Build \u2192 Ship \u2192 Market \u2192 Polish",
    useCase: "Full product lifecycle from specification to market launch",
    synergy: "superpowers ensures spec-first architecture, frontend-design creates the UI, react-best-practices prevents performance pitfalls, deployment-manager ships it live, social-media-manager announces it, humanizer polishes all copy."
  },
  {
    name: "Content Machine",
    emoji: "\uD83D\uDCDD",
    skills: ["content-strategy", "seo-content-writer", "gumroad-pipeline", "social-media-manager", "humanizer"],
    tagline: "Plan \u2192 Write \u2192 Monetize \u2192 Distribute \u2192 Polish",
    useCase: "End-to-end content production that ranks, converts, and sounds human",
    synergy: "content-strategy defines pillars and calendar, seo-content-writer produces optimized content, gumroad-pipeline monetizes it, social-media-manager distributes across platforms, humanizer strips AI patterns from everything."
  },
  {
    name: "Web Scraping Pipeline",
    emoji: "\uD83D\uDD77\uFE0F",
    skills: ["browser-use", "web-reader", "contentanalysis", "xlsx"],
    tagline: "Browse \u2192 Extract \u2192 Analyze \u2192 Tabulate",
    useCase: "Data extraction from web to structured spreadsheet",
    synergy: "browser-use navigates and interacts with pages in natural language, web-reader extracts full content, contentanalysis distills wisdom, xlsx structures results."
  },
  {
    name: "Creative Studio",
    emoji: "\uD83C\uDFA5",
    skills: ["brainstorming", "storyboard-manager", "image-generation", "gsap-animations"],
    tagline: "Ideate \u2192 Storyboard \u2192 Create \u2192 Animate",
    useCase: "Creative projects from initial idea to animated visual",
    synergy: "brainstorming develops the concept, storyboard-manager structures the narrative, image-generation creates visuals, gsap-animations brings them to life."
  }
]

const TOP_SKILLS: TopSkill[] = [
  { rank: 1, name: "find-skills", source: "vercel-labs/skills", installs: "1.2M", category: "Development" },
  { rank: 2, name: "react-best-practices", source: "vercel-labs/agent-skills", installs: "352.5K", category: "Development" },
  { rank: 3, name: "frontend-design", source: "anthropics/skills", installs: "342.1K", category: "Design/UI" },
  { rank: 4, name: "web-design-guidelines", source: "vercel-labs/agent-skills", installs: "280.8K", category: "Design/UI" },
  { rank: 5, name: "agent-browser", source: "vercel-labs/agent-browser", installs: "216.3K", category: "Browser" },
  { rank: 6, name: "shadcn", source: "shadcn/ui", installs: "110.8K", category: "Development" },
  { rank: 7, name: "skill-creator", source: "anthropics/skills", installs: "170.0K", category: "Meta" },
  { rank: 8, name: "composition-patterns", source: "vercel-labs/agent-skills", installs: "150.8K", category: "Development" },
  { rank: 9, name: "brainstorming", source: "obra/superpowers", installs: "124.6K", category: "Development" },
  { rank: 10, name: "supabase-postgres", source: "supabase/agent-skills", installs: "125.0K", category: "DevOps" },
  { rank: 11, name: "ui-ux-pro-max", source: "nextlevelbuilder", installs: "134.8K", category: "Design/UI" },
  { rank: 12, name: "react-native-skills", source: "vercel-labs/agent-skills", installs: "101.5K", category: "Development" },
  { rank: 13, name: "browser-use", source: "skills.sh", installs: "\u2014", category: "Browser", isNew: true },
  { rank: 14, name: "superpowers", source: "skills.sh", installs: "\u2014", category: "Development", isNew: true },
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
  },
  {
    name: "Product Launch",
    stack: "Product Launch Stack",
    prompt: `Install these skills for full product lifecycle:\n\n1. superpowers \u2014 spec-first project orchestration with typed errors\n2. frontend-design \u2014 distinctive, non-AI-slop UI\n3. react-best-practices \u2014 70 performance rules from Vercel\n4. deployment-manager \u2014 ship to production with health checks\n5. social-media-manager \u2014 multi-platform content with brand voice\n6. humanizer \u2014 strip AI patterns, sound human\n\nTogether: Spec + Design + Build + Ship + Market + Polish = launch products that feel real.`
  },
  {
    name: "Content That Converts",
    stack: "Content Machine",
    prompt: `Install these skills for content that ranks AND converts:\n\n1. content-strategy \u2014 define pillars, editorial calendar, KPIs\n2. seo-content-writer \u2014 production SEO content creation\n3. gumroad-pipeline \u2014 monetize with pricing, landing pages, email sequences\n4. social-media-manager \u2014 multi-platform execution\n5. humanizer \u2014 AI pattern stripping as quality gate\n\nTogether: Plan + Write + Monetize + Distribute + Polish = content machine that converts.`
  }
]

const SKILL_OVERLAPS: SkillOverlap[] = [
  {
    domain: "Browser Automation",
    skills: [
      { name: "agent-browser", approach: "CLI commands", bestFor: "Precise scripted automation" },
      { name: "browser-use", approach: "Natural language", bestFor: "Quick lookups, ad-hoc browsing" }
    ],
    routing: "Use agent-browser for repeatable scripts; browser-use for one-off natural language queries"
  },
  {
    domain: "Project Orchestration",
    skills: [
      { name: "superpowers", approach: "Spec-first, sub-agent delegation", bestFor: "Greenfield projects needing architecture" },
      { name: "coding-agent", approach: "Plan-execute-verify loop", bestFor: "Autonomous coding tasks" },
      { name: "fullstack-dev", approach: "Full-stack Next.js scaffold", bestFor: "Web app development" }
    ],
    routing: "Use superpowers to spec+architect, coding-agent to execute code, fullstack-dev for Next.js specifically"
  },
  {
    domain: "Content Writing",
    skills: [
      { name: "seo-content-writer", approach: "SEO + GEO optimized", bestFor: "Search-ranking content" },
      { name: "blog-writer", approach: "Style-guide driven", bestFor: "Brand voice blog posts" },
      { name: "humanizer", approach: "AI pattern stripping", bestFor: "Post-processing quality gate" }
    ],
    routing: "Write with seo-content-writer or blog-writer first, then run humanizer as final pass"
  },
  {
    domain: "Content Strategy",
    skills: [
      { name: "content-strategy", approach: "Planning layer \u2014 pillars, calendar", bestFor: "Quarterly content planning" },
      { name: "marketing-mode", approach: "Strategic positioning", bestFor: "Brand and positioning strategy" },
      { name: "social-media-manager", approach: "Execution layer \u2014 multi-platform posts", bestFor: "Day-to-day social content" }
    ],
    routing: "Plan with content-strategy, position with marketing-mode, execute with social-media-manager"
  },
  {
    domain: "Skill Security",
    skills: [
      { name: "skill-scanner", approach: "8-phase deep scan", bestFor: "Pre-install security audit" },
      { name: "skill-vetter", approach: "Quick security check", bestFor: "Fast trust assessment" }
    ],
    routing: "Use skill-scanner for thorough audits; skill-vetter for quick checks"
  },
  {
    domain: "Academic Research",
    skills: [
      { name: "aminer-academic-search", approach: "Paper + scholar search", bestFor: "Finding specific papers" },
      { name: "aminer-daily-paper", approach: "Recommendations", bestFor: "Staying current" },
      { name: "aminer-open-academic", approach: "Open data access", bestFor: "Bulk academic data" }
    ],
    routing: "Search with aminer-academic-search, track with aminer-daily-paper, bulk access with aminer-open-academic"
  }
]

const SKILL_UPGRADES: SkillUpgrade[] = [
  { original: "coding-agent", upgraded: "superpowers", newCapabilities: "Spec-first workflow, architecture review, sub-agent delegation, typed errors", status: "COEXIST" },
  { original: "agent-browser", upgraded: "browser-use", newCapabilities: "Natural language interface, no Playwright code, screenshot returns, typed errors", status: "COEXIST" },
  { original: "seo-content-writer", upgraded: "humanizer", newCapabilities: "AI pattern stripping, Wikipedia-trained classifier, diff output, tone preservation", status: "POST-PROCESS" },
  { original: "content-strategy", upgraded: "social-media-manager", newCapabilities: "Multi-platform execution, content calendar, pillar distribution, platform limits", status: "PIPELINE" },
  { original: "skill-vetter", upgraded: "skill-scanner", newCapabilities: "8-phase analysis, behavioral analysis, supply chain, permission analysis", status: "UPGRADE" },
  { original: "skill-finder-cn", upgraded: "find-skills", newCapabilities: "Global ecosystem search, quality verification, 1.2M installs", status: "UPGRADE" },
]

const ERROR_STANDARDS: ErrorStandard[] = [
  {
    skill: "superpowers",
    errorTypes: [
      { type: "SpecMissingError", code: "SP-001", action: "Halt and prompt user for spec input" },
      { type: "ArchitectureConflictError", code: "SP-002", action: "Surface conflict, ask user to resolve" },
      { type: "SubAgentTimeoutError", code: "SP-003", action: "Log which agent, retry once, then escalate" },
      { type: "TestFailureError", code: "SP-004", action: "Roll back to last passing state, report" },
      { type: "DeployCheckFailedError", code: "SP-005", action: "Block deployment, surface failing check" }
    ]
  },
  {
    skill: "browser-use",
    errorTypes: [
      { type: "PageLoadTimeoutError", code: "BU-001", action: "Retry once, then report URL and timeout" },
      { type: "ElementNotFoundError", code: "BU-002", action: "Report which selector, suggest alternatives" },
      { type: "NavigationError", code: "BU-003", action: "Screenshot current state, report expected vs actual" },
      { type: "AuthFailureError", code: "BU-004", action: "Surface credentials issue, never retry same creds" },
      { type: "ScrapeEmptyError", code: "BU-006", action: "Report expected vs found data" }
    ]
  },
  {
    skill: "humanizer",
    errorTypes: [
      { type: "EmptyInputError", code: "HZ-001", action: "Return error: no input text received" },
      { type: "PreservedContentError", code: "HZ-002", action: "Flag changed claim, revert it, keep style" },
      { type: "ToneMismatchError", code: "HZ-003", action: "Re-process with tone constraint" },
      { type: "CodeCorruptionError", code: "HZ-004", action: "Revert code blocks, only humanize prose" }
    ]
  },
  {
    skill: "social-media-manager",
    errorTypes: [
      { type: "MissingPersonaError", code: "SM-001", action: "Halt and prompt for target audience" },
      { type: "PlatformLimitError", code: "SM-002", action: "Auto-truncate with ellipsis, flag for review" },
      { type: "BrandVoiceConflictError", code: "SM-003", action: "Regenerate with shared voice reference" },
      { type: "CalendarGapError", code: "SM-004", action: "Fill with evergreen content, flag as auto-filled" }
    ]
  },
  {
    skill: "gumroad-pipeline",
    errorTypes: [
      { type: "NoProductError", code: "GP-001", action: "Halt and prompt: what are you selling and to whom?" },
      { type: "PricingBelowFloorError", code: "GP-002", action: "Reject price below $5, explain value perception risk" },
      { type: "CopyLengthError", code: "GP-003", action: "Flag section too long, suggest cuts" },
      { type: "EmailSequenceOverflowError", code: "GP-004", action: "Trim to 5 emails, flag which to cut" },
      { type: "LowConversionWarning", code: "GP-005", action: "Generate A/B test suggestions" },
      { type: "MissingSocialProofError", code: "GP-006", action: "Insert placeholder for real testimonial" }
    ]
  }
]

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Development": { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  "Reasoning": { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  "DevOps": { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/30" },
  "Design/UI": { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/30" },
  "Research": { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30" },
  "Content": { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  "Business": { bg: "bg-teal-500/15", text: "text-teal-400", border: "border-teal-500/30" },
  "Documents": { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/30" },
  "AI/Media": { bg: "bg-rose-500/15", text: "text-rose-400", border: "border-rose-500/30" },
  "Browser": { bg: "bg-fuchsia-500/15", text: "text-fuchsia-400", border: "border-fuchsia-500/30" },
  "Education": { bg: "bg-lime-500/15", text: "text-lime-400", border: "border-lime-500/30" },
  "Meta": { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30" },
  "Specialty": { bg: "bg-stone-500/15", text: "text-stone-400", border: "border-stone-500/30" },
}

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || { bg: "bg-slate-500/15", text: "text-slate-400", border: "border-slate-500/30" }
}

function parseInstalls(s: string): number {
  if (s === "built-in" || s === "\u2014") return 0
  const num = parseFloat(s)
  if (s.endsWith('M')) return num * 1_000_000
  if (s.endsWith('K')) return num * 1_000
  return num
}

const ALL_CATEGORIES = Array.from(new Set(INSTALLED_SKILLS.map(s => s.category)))

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "COEXIST": { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  "POST-PROCESS": { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/30" },
  "PIPELINE": { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  "UPGRADE": { bg: "bg-rose-500/15", text: "text-rose-400", border: "border-rose-500/30" },
}

const NAV_ITEMS = [
  { id: "hero", label: "Top" },
  { id: "top-skills", label: "Top Skills" },
  { id: "stacks", label: "Stacks" },
  { id: "directory", label: "Directory" },
  { id: "analysis", label: "Analysis" },
  { id: "upgrades", label: "Upgrades" },
  { id: "errors", label: "Errors" },
  { id: "install", label: "Install" },
  { id: "source", label: "Source" },
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
  const [expandedCombo, setExpandedCombo] = useState<string | null>(null)
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
      { threshold: 0.2 }
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

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionsRef.current[id] = el
  }

  const dm = darkMode

  return (
    <div className={`min-h-screen flex flex-col ${dm ? 'bg-[#111111] text-white' : 'bg-white text-gray-900'}`}>
      {/* ─── STICKY HEADER ─── */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${dm ? 'bg-[#111111]/80 border-[#2a2a2a]' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2 shrink-0">
              <Sparkles className="size-5 text-amber-500" />
              <span className="font-bold text-base tracking-tight">Skills Portal</span>
            </div>
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'text-amber-500 bg-amber-500/10'
                      : dm ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 size-4 ${dm ? 'text-gray-500' : 'text-gray-400'}`} />
                <Input
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`pl-8 w-32 sm:w-56 h-8 text-sm ${dm ? 'bg-[#1a1a1a] border-[#2a2a2a] focus:border-amber-500/50' : 'bg-gray-50'}`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className={`absolute right-2 top-1/2 -translate-y-1/2 ${dm ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <Button variant="ghost" size="icon" className="size-8" onClick={() => setDarkMode(!dm)}>
                {dm ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── 1. HERO ─── */}
        <section id="hero" ref={setSectionRef("hero")} className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-8" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              AI Agent<br />
              <span className="text-amber-500">Skills Portal</span>
            </h1>
            <p className={`mt-5 text-lg sm:text-xl max-w-2xl leading-relaxed ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
              A directory, installation source, and stack recommendation engine for 81 production-ready agent skills. Browse, combine, and deploy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-6">
              {[
                { label: "Skills", value: "81", icon: Package },
                { label: "Stacks", value: "16", icon: Layers },
                { label: "Categories", value: "13", icon: Filter },
                { label: "Top Install", value: "1.2M", icon: Trophy },
              ].map(stat => (
                <div key={stat.label} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border ${dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
                  <stat.icon className="size-4 text-amber-500" />
                  <span className={`text-2xl font-bold font-mono ${dm ? 'text-white' : 'text-gray-900'}`}>{stat.value}</span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </section>

        {/* ─── 2. QUICK STATS BAR ─── */}
        <section className={`border-y ${dm ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 py-4 overflow-x-auto">
              {[
                { label: "Total Skills", value: "81", sub: "installed & available" },
                { label: "Categories", value: "13", sub: "organized domains" },
                { label: "Curated Stacks", value: "16", sub: "synergy-optimized" },
                { label: "Community Installs", value: "3M+", sub: "across all skills" },
                { label: "Built-in Skills", value: "42", sub: "zero-config ready" },
                { label: "New Skills", value: "4", sub: "just added" },
              ].map(stat => (
                <div key={stat.label} className={`flex-shrink-0 px-5 py-3 rounded-lg border min-w-[160px] ${dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
                  <div className="text-xl font-bold font-mono text-amber-500">{stat.value}</div>
                  <div className={`text-sm font-medium ${dm ? 'text-white' : 'text-gray-900'}`}>{stat.label}</div>
                  <div className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{stat.sub}</div>
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
              <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                Community adoption ranking — click column headers to sort
              </p>
            </div>
            <div className={`rounded-xl border overflow-hidden ${dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className={`${dm ? 'border-[#2a2a2a] hover:bg-transparent' : 'border-gray-100'}`}>
                      <TableHead className={`cursor-pointer select-none ${dm ? 'text-gray-400' : 'text-gray-500'}`} onClick={() => toggleSort("rank")}>
                        # {renderSortIcon("rank")}
                      </TableHead>
                      <TableHead className={`cursor-pointer select-none ${dm ? 'text-gray-400' : 'text-gray-500'}`} onClick={() => toggleSort("name")}>
                        Skill {renderSortIcon("name")}
                      </TableHead>
                      <TableHead className={`hidden sm:table-cell ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Source</TableHead>
                      <TableHead className={`cursor-pointer select-none ${dm ? 'text-gray-400' : 'text-gray-500'}`} onClick={() => toggleSort("installs")}>
                        Installs {renderSortIcon("installs")}
                      </TableHead>
                      <TableHead className={`hidden md:table-cell ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Category</TableHead>
                      <TableHead className={`${dm ? 'text-gray-400' : 'text-gray-500'}`}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTopSkills.map(skill => {
                      const colors = getCategoryColor(skill.category)
                      return (
                        <TableRow key={skill.rank} className={`${dm ? 'border-[#2a2a2a]' : 'border-gray-100'}`}>
                          <TableCell className="font-mono text-amber-500 font-bold">{skill.rank}</TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {skill.name}
                              {skill.isNew && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">NEW</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={`hidden sm:table-cell font-mono text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{skill.source}</TableCell>
                          <TableCell className="font-mono font-semibold">{skill.installs}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                              {skill.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => copyToClipboard(`npx skills add ${skill.name}`, `top-${skill.rank}`)}>
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
          </div>
        </section>

        {/* ─── 4. RECOMMENDED STACKS ─── */}
        <section id="stacks" ref={setSectionRef("stacks")} className={`py-16 sm:py-20 ${dm ? 'bg-[#0d0d0d]' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Recommended Stacks</h2>
              <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                Curated skill combinations with proven synergy — click to expand
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SKILL_COMBOS.map(combo => {
                const isOpen = expandedCombo === combo.name
                return (
                  <Card key={combo.name} className={`cursor-pointer transition-all ${dm ? 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-amber-500/40' : 'bg-white border-gray-200 hover:border-amber-500/40'}`} onClick={() => setExpandedCombo(isOpen ? null : combo.name)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{combo.emoji}</span>
                          <div>
                            <CardTitle className="text-base">{combo.name}</CardTitle>
                            <CardDescription className={`text-xs mt-0.5 ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{combo.tagline}</CardDescription>
                          </div>
                        </div>
                        {isOpen ? <ChevronUp className="size-4 text-amber-500 shrink-0 mt-1" /> : <ChevronDown className="size-4 text-amber-500 shrink-0 mt-1" />}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {combo.skills.map(skillName => {
                          const skill = INSTALLED_SKILLS.find(s => s.name === skillName)
                          const colors = skill ? getCategoryColor(skill.category) : getCategoryColor("Other")
                          return (
                            <span key={skillName} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                              {skillName}
                            </span>
                          )
                        })}
                      </div>
                      <p className={`text-sm ${dm ? 'text-gray-400' : 'text-gray-600'}`}>{combo.useCase}</p>
                      {isOpen && (
                        <div className={`mt-4 p-3 rounded-lg border ${dm ? 'bg-[#111111] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Zap className="size-3.5 text-amber-500" />
                            <span className="text-sm font-semibold text-amber-500">Synergy</span>
                          </div>
                          <p className={`text-sm leading-relaxed ${dm ? 'text-gray-300' : 'text-gray-700'}`}>{combo.synergy}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── 5.5 HANDOFF CHAINS ─── */}
        <section id="chains" ref={setSectionRef("chains")} className={`py-16 sm:py-20 ${dm ? 'bg-[#0d0d0d]' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Skill Handoff Chains</h2>
              <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                The agent org chart — how skills pass work to each other
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "/launch", title: "Full Product Launch", chain: ["superpowers", "frontend-design", "react-best-practices", "browser-use", "deployment-manager", "social-media-manager", "humanizer"], desc: "Spec → Design → Audit → QA → Ship → Announce → Polish" },
                { name: "/content", title: "Content Machine", chain: ["content-strategy", "seo-content-writer", "gumroad-pipeline", "social-media-manager", "humanizer"], desc: "Plan → Write → Monetize → Distribute → Polish" },
                { name: "/research", title: "Research to Report", chain: ["deep-research", "web-reader", "context-compressor", "output-formatter", "pdf"], desc: "Search → Extract → Distill → Format → Document" },
                { name: "/design", title: "Design to Deploy", chain: ["brainstorming", "frontend-design", "gsap-animations", "fullstack-dev", "deployment-manager"], desc: "Ideate → Mock Up → Animate → Build → Ship" },
                { name: "/decide", title: "Reason and Decide", chain: ["chain-of-thought", "devils-advocate", "simulation-sandbox", "output-formatter"], desc: "Decompose → Stress-Test → Verify → Structure" },
              ].map((chain) => (
                <Card key={chain.name} className={`${dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <code className="text-amber-500 font-mono text-sm font-bold">{chain.name}</code>
                      <Terminal className="size-4 text-amber-500/60" />
                    </div>
                    <CardTitle className="text-base">{chain.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{chain.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {chain.chain.map((skill, i) => (
                        <span key={skill} className="inline-flex items-center">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${dm ? 'border-[#3a3a3a] text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                            {skill}
                          </Badge>
                          {i < chain.chain.length - 1 && <span className="text-amber-500/50 mx-0.5 text-[10px]">→</span>}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5.75 FULL DIRECTORY ─── */}
        <section id="directory" ref={setSectionRef("directory")} className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Full Skill Directory</h2>
              <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                All 80 skills — filter by category, search by name or description
              </p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  selectedCategory === "All"
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : dm ? 'bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-amber-500/30' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-500/30'
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
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                      selectedCategory === cat
                        ? `${colors.bg} ${colors.text} ${colors.border}`
                        : dm ? 'bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-[#3a3a3a]' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSkills.map(skill => {
                const colors = getCategoryColor(skill.category)
                const isExpanded = expandedSkill === skill.name
                return (
                  <div
                    key={skill.name}
                    className={`rounded-lg border p-4 cursor-pointer transition-all ${
                      dm ? 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-amber-500/30' : 'bg-white border-gray-200 hover:border-amber-500/30'
                    }`}
                    onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{skill.name}</span>
                          {skill.isNew && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">NEW</span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 line-clamp-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>{skill.description}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}>
                        {skill.category}
                      </span>
                    </div>
                    {isExpanded && (
                      <div className={`mt-3 pt-3 border-t ${dm ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                        <div className="flex flex-col gap-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={dm ? 'text-gray-500' : 'text-gray-400'}>Source</span>
                            <span className="font-mono">{skill.source}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={dm ? 'text-gray-500' : 'text-gray-400'}>Installs</span>
                            <span className="font-mono">{skill.installs}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-7 text-xs w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(`npx skills add ${skill.source !== 'built-in' ? skill.source + '/' : ''}${skill.name}`, `skill-${skill.name}`)
                            }}
                          >
                            {copiedId === `skill-${skill.name}` ? (
                              <><Check className="size-3 mr-1 text-emerald-400" /> Copied</>
                            ) : (
                              <><Copy className="size-3 mr-1" /> Copy Install Command</>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {filteredSkills.length === 0 && (
              <div className={`text-center py-12 ${dm ? 'text-gray-500' : 'text-gray-400'}`}>
                No skills match your search.
              </div>
            )}
          </div>
        </section>

        {/* ─── 6. COMPARATIVE ANALYSIS ─── */}
        <section id="analysis" ref={setSectionRef("analysis")} className={`py-16 sm:py-20 ${dm ? 'bg-[#0d0d0d]' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Comparative Analysis</h2>
              <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                Overlapping skills and routing decisions — know which to use when
              </p>
            </div>
            <div className="space-y-6">
              {SKILL_OVERLAPS.map(overlap => (
                <div key={overlap.domain} className={`rounded-xl border p-6 ${dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowRightLeft className="size-5 text-amber-500" />
                    <h3 className="text-lg font-bold">{overlap.domain}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className={dm ? 'border-[#2a2a2a] hover:bg-transparent' : 'border-gray-100'}>
                          <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Skill</TableHead>
                          <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Approach</TableHead>
                          <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Best For</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {overlap.skills.map(s => {
                          const skill = INSTALLED_SKILLS.find(sk => sk.name === s.name)
                          const colors = skill ? getCategoryColor(skill.category) : getCategoryColor("Other")
                          return (
                            <TableRow key={s.name} className={dm ? 'border-[#2a2a2a]' : 'border-gray-100'}>
                              <TableCell>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                                  {s.name}
                                </span>
                              </TableCell>
                              <TableCell className={`text-sm ${dm ? 'text-gray-300' : 'text-gray-700'}`}>{s.approach}</TableCell>
                              <TableCell className={`text-sm ${dm ? 'text-gray-300' : 'text-gray-700'}`}>{s.bestFor}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${dm ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                    <Lightbulb className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-500 font-medium">{overlap.routing}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 7. SKILL UPGRADES ─── */}
        <section id="upgrades" ref={setSectionRef("upgrades")} className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Skill Upgrades</h2>
              <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                How new skills relate to existing ones — coexist, post-process, pipeline, or upgrade
              </p>
            </div>
            <div className={`rounded-xl border overflow-hidden ${dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className={dm ? 'border-[#2a2a2a] hover:bg-transparent' : 'border-gray-100'}>
                      <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Original</TableHead>
                      <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}></TableHead>
                      <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Upgraded</TableHead>
                      <TableHead className={`hidden sm:table-cell ${dm ? 'text-gray-400' : 'text-gray-500'}`}>New Capabilities</TableHead>
                      <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SKILL_UPGRADES.map(upgrade => {
                      const statusColor = STATUS_COLORS[upgrade.status] || STATUS_COLORS["COEXIST"]
                      return (
                        <TableRow key={upgrade.original} className={dm ? 'border-[#2a2a2a]' : 'border-gray-100'}>
                          <TableCell className="font-mono text-sm">{upgrade.original}</TableCell>
                          <TableCell>
                            <ArrowRightLeft className="size-4 text-amber-500" />
                          </TableCell>
                          <TableCell className="font-mono text-sm font-semibold">{upgrade.upgraded}</TableCell>
                          <TableCell className={`hidden sm:table-cell text-sm ${dm ? 'text-gray-400' : 'text-gray-600'}`}>{upgrade.newCapabilities}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                              {upgrade.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
            {/* Status legend */}
            <div className="mt-4 flex flex-wrap gap-4">
              {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                <div key={status} className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>{status}</span>
                  <span className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>
                    {status === "COEXIST" && "Both skills serve different purposes"}
                    {status === "POST-PROCESS" && "Run after the original as a quality gate"}
                    {status === "PIPELINE" && "Original feeds into the upgrade"}
                    {status === "UPGRADE" && "Direct replacement recommended"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 8. ERROR STANDARDS ─── */}
        <section id="errors" ref={setSectionRef("errors")} className={`py-16 sm:py-20 ${dm ? 'bg-[#0d0d0d]' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Error Handling Standards</h2>
              <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                Typed error handling that new skills follow — never silent failures
              </p>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {ERROR_STANDARDS.map(std => (
                <AccordionItem key={std.skill} value={std.skill} className={`rounded-xl border px-6 ${dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} [&[data-state=open]]:border-amber-500/30`}>
                  <AccordionTrigger className={`hover:no-underline py-4 ${dm ? 'hover:text-amber-400' : 'hover:text-amber-600'}`}>
                    <div className="flex items-center gap-3">
                      <Shield className="size-5 text-amber-500" />
                      <span className="font-bold text-base">{std.skill}</span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${dm ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {std.errorTypes.length} error types
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className={dm ? 'border-[#2a2a2a] hover:bg-transparent' : 'border-gray-100'}>
                            <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Error Type</TableHead>
                            <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Code</TableHead>
                            <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {std.errorTypes.map(err => (
                            <TableRow key={err.code} className={dm ? 'border-[#2a2a2a]' : 'border-gray-100'}>
                              <TableCell className="font-mono text-sm text-amber-400">{err.type}</TableCell>
                              <TableCell>
                                <span className={`font-mono text-xs px-2 py-0.5 rounded ${dm ? 'bg-rose-500/10 text-rose-400' : 'bg-red-50 text-red-600'}`}>
                                  {err.code}
                                </span>
                              </TableCell>
                              <TableCell className={`text-sm ${dm ? 'text-gray-300' : 'text-gray-700'}`}>{err.action}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ─── 9. ONE-PROMPT INSTALL ─── */}
        <section id="install" ref={setSectionRef("install")} className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">One-Prompt Install</h2>
              <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                Copy-ready prompts — paste into any AI agent to install full stacks
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ONE_PROMPTS.map(op => (
                <Card key={op.name} className={`${dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{op.name}</CardTitle>
                        <CardDescription className={`text-xs mt-0.5 ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{op.stack}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => copyToClipboard(op.prompt, `prompt-${op.name}`)}>
                        {copiedId === `prompt-${op.name}` ? (
                          <><Check className="size-3 mr-1 text-emerald-400" /> Copied</>
                        ) : (
                          <><Copy className="size-3 mr-1" /> Copy</>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <pre className={`text-xs whitespace-pre-wrap leading-relaxed p-3 rounded-lg ${dm ? 'bg-[#111111] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                      {op.prompt}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 10. INSTALLATION SOURCE ─── */}
        <section id="source" ref={setSectionRef("source")} className={`py-16 sm:py-20 ${dm ? 'bg-[#0d0d0d]' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-12 h-1 bg-amber-500 rounded-full mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold">Installation Source</h2>
              <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                Machine-readable install paths and commands for AI consumption
              </p>
            </div>

            {/* Full Library Install */}
            <div className={`mb-8 p-6 rounded-xl border-2 border-amber-500/30 ${dm ? 'bg-amber-500/5' : 'bg-amber-50'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="size-5 text-amber-500" />
                <h3 className="text-lg font-bold text-amber-500">Full Library Install</h3>
              </div>
              <p className={`text-sm mb-4 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                One command to install all built-in skills:
              </p>
              <div className={`flex items-center gap-2 p-3 rounded-lg font-mono text-sm ${dm ? 'bg-[#1a1a1a] border border-[#2a2a2a]' : 'bg-white border border-gray-200'}`}>
                <code className="flex-1 text-amber-500">npx skills add --all --source built-in</code>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => copyToClipboard('npx skills add --all --source built-in', 'full-install')}>
                  {copiedId === 'full-install' ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                </Button>
              </div>
            </div>

            {/* Skills table */}
            <div className={`rounded-xl border overflow-hidden ${dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className={`${dm ? 'bg-[#1a1a1a] border-[#2a2a2a] hover:bg-transparent' : 'bg-white border-gray-100 hover:bg-transparent'}`}>
                      <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Skill</TableHead>
                      <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}>Category</TableHead>
                      <TableHead className={`hidden sm:table-cell ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Install Command</TableHead>
                      <TableHead className={`hidden md:table-cell ${dm ? 'text-gray-400' : 'text-gray-500'}`}>SKILL.md Path</TableHead>
                      <TableHead className={dm ? 'text-gray-400' : 'text-gray-500'}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {INSTALLED_SKILLS.map(skill => {
                      const cmd = skill.source === 'built-in'
                        ? `npx skills add ${skill.name}`
                        : `npx skills add ${skill.source}/${skill.name}`
                      const path = `/skills/${skill.name}/SKILL.md`
                      return (
                        <TableRow key={skill.name} className={dm ? 'border-[#2a2a2a]' : 'border-gray-100'}>
                          <TableCell className="font-mono text-sm font-medium">
                            <div className="flex items-center gap-1.5">
                              {skill.name}
                              {skill.isNew && (
                                <span className="inline-flex items-center px-1 py-0 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400">NEW</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(skill.category).bg} ${getCategoryColor(skill.category).text} ${getCategoryColor(skill.category).border}`}>
                              {skill.category}
                            </span>
                          </TableCell>
                          <TableCell className={`hidden sm:table-cell font-mono text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{cmd}</TableCell>
                          <TableCell className={`hidden md:table-cell font-mono text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{path}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => copyToClipboard(cmd, `src-${skill.name}`)}>
                              {copiedId === `src-${skill.name}` ? (
                                <Check className="size-3 text-emerald-400" />
                              ) : (
                                <Copy className="size-3" />
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
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className={`border-t mt-auto ${dm ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span className={`text-sm font-medium ${dm ? 'text-gray-400' : 'text-gray-600'}`}>Skills Portal</span>
            </div>
            <p className={`text-sm ${dm ? 'text-gray-500' : 'text-gray-400'}`}>
              Build systems, not one-off tasks
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
