'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  Search, Copy, Check, ChevronDown, ChevronRight, Moon, Sun,
  Terminal, Package, Layers, Trophy, Zap, BookOpen, ArrowUp,
  ArrowDown, ExternalLink, Hash, Sparkles, Filter, X, AlertTriangle,
  Shield, ArrowRightLeft, Database, Code, Lightbulb, FileText, Globe,
  ChevronUp, Activity, Heart, GitBranch, Wrench, Cpu, Navigation,
  ArrowRight, Target, Brain, PenTool, BarChart3, Eye, RefreshCw,
  AlertCircle, CheckCircle2, XCircle, Info
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
// INTERFACES
// ──────────────────────────────────────────────────────────

interface Skill {
  name: string
  category: string
  description: string
  source: string
  installs: string
  isNew?: boolean
  healthScore: number
}

interface SkillCombo {
  name: string
  emoji: string
  skills: string[]
  tagline: string
  useCase: string
  synergy: string
  whyChosen: string
  benefitsVs: string
  misconceptions: string
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

interface IntentDomain {
  name: string
  icon: string
  keywords: string[]
  stack: string
  trigger: string
  chain: string[]
  color: string
}

interface EscalationChain {
  trigger: string
  escalateTo: string
  reason: string
}

interface Compatibility {
  type: 'synergy' | 'conflict'
  skillA: string
  skillB: string
  reason: string
}

interface Dependency {
  skill: string
  depends: string[]
  reason: string
}

interface HealingRule {
  detect: string
  repair: string
  severity: 'critical' | 'warning' | 'info'
}

interface ROIData {
  stack: string
  timeWithout: string
  timeWith: string
  qualityWithout: string
  qualityWith: string
  errorReduction: string
}

// ──────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────

const INSTALLED_SKILLS: Skill[] = [
  // AI/Media (7)
  { name: "LLM", category: "AI/Media", description: "Large language model chat completions", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "TTS", category: "AI/Media", description: "Text-to-speech voice generation", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "ASR", category: "AI/Media", description: "Speech-to-text transcription", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "VLM", category: "AI/Media", description: "Vision-language model for image analysis", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "video-generation", category: "AI/Media", description: "AI-powered video generation from text/images", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "video-understand", category: "AI/Media", description: "Video content understanding and analysis", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "image-generation", category: "AI/Media", description: "AI image generation from text descriptions", source: "built-in", installs: "built-in", healthScore: 70 },

  // Development (13)
  { name: "fullstack-dev", category: "Development", description: "Fullstack Next.js 16 development with React, API routes, and Prisma", source: "built-in", installs: "built-in", healthScore: 90 },
  { name: "coding-agent", category: "Development", description: "Autonomous coding with planning, execution, and verification", source: "built-in", installs: "built-in", healthScore: 85 },
  { name: "superpowers", category: "Development", description: "Spec-first project orchestration — staff engineer workflow in one skill", source: "skills.sh", installs: "—", isNew: true, healthScore: 95 },
  { name: "mcp-builder", category: "Development", description: "Build MCP servers in TypeScript and Python", source: "ai-skills-library", installs: "—", healthScore: 75 },
  { name: "web-artifacts-builder", category: "Development", description: "Single-file HTML artifacts with React + Tailwind", source: "ai-skills-library", installs: "—", healthScore: 70 },
  { name: "react-best-practices", category: "Development", description: "70 React/Next.js performance rules from Vercel Engineering", source: "vercel-labs/agent-skills", installs: "352.5K", healthScore: 90 },
  { name: "composition-patterns", category: "Development", description: "React composition patterns that scale — compound components, state lifting", source: "vercel-labs/agent-skills", installs: "150.8K", healthScore: 85 },
  { name: "react-native-skills", category: "Development", description: "React Native and Expo best practices for performant mobile apps", source: "vercel-labs/agent-skills", installs: "101.5K", healthScore: 80 },
  { name: "next-best-practices", category: "Development", description: "Next.js file conventions, RSC boundaries, data patterns, async APIs", source: "vercel-labs/next-skills", installs: "73.3K", healthScore: 85 },
  { name: "shadcn", category: "Development", description: "shadcn/ui component management — adding, styling, composing UI", source: "shadcn/ui", installs: "110.8K", healthScore: 85 },
  { name: "find-skills", category: "Development", description: "Discover and install agent skills from the open ecosystem", source: "vercel-labs/skills", installs: "1.2M", healthScore: 80 },
  { name: "skill-scanner", category: "Development", description: "Scan agent skills for security issues before adoption", source: "getsentry/skills", installs: "—", healthScore: 90 },
  { name: "brainstorming", category: "Development", description: "Turn ideas into fully formed designs through collaborative dialogue", source: "obra/superpowers", installs: "124.6K", healthScore: 75 },

  // Design/UI (8)
  { name: "frontend-design", category: "Design/UI", description: "Create distinctive, production-grade frontend interfaces avoiding AI slop", source: "anthropics/skills", installs: "342.1K", healthScore: 90 },
  { name: "ui-ux-pro-max", category: "Design/UI", description: "Comprehensive UI/UX design with data-driven stacks", source: "nextlevelbuilder/ui-ux-pro-max-skill", installs: "134.8K", healthScore: 80 },
  { name: "visual-design-foundations", category: "Design/UI", description: "Typography, color systems, spacing and iconography foundations", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "web-design-guidelines", category: "Design/UI", description: "Review UI code for Web Interface Guidelines compliance", source: "vercel-labs/agent-skills", installs: "280.8K", healthScore: 85 },
  { name: "gsap-animations", category: "Design/UI", description: "Professional web animations with GSAP — ScrollTrigger, Flip, MorphSVG", source: "xerxes-on/gsap-animation-skill", installs: "—", healthScore: 80 },
  { name: "web-shader-extractor", category: "Design/UI", description: "Extract WebGL/Canvas/Shader visual effects from web pages", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "image-understand", category: "Design/UI", description: "Vision-based AI analysis of images", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "image-edit", category: "Design/UI", description: "AI-powered image editing capabilities", source: "built-in", installs: "built-in", healthScore: 60 },

  // Content (11)
  { name: "seo-content-writer", category: "Content", description: "SEO content creation with GEO optimization", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "seo-geo", category: "Content", description: "SEO + Generative Engine Optimization for AI visibility", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "blog-writer", category: "Content", description: "Blog post generation with style guide adherence", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "humanizer", category: "Content", description: "Strip AI writing patterns — makes generated text sound human", source: "skills.sh", installs: "—", isNew: true, healthScore: 95 },
  { name: "content-strategy", category: "Content", description: "Content strategy planning and editorial calendar", source: "skills.sh", installs: "—", healthScore: 80 },
  { name: "social-media-manager", category: "Content", description: "Multi-platform social content execution with brand voice", source: "skills.sh", installs: "—", isNew: true, healthScore: 95 },
  { name: "contentanalysis", category: "Content", description: "Extract wisdom and insights from content", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "writing-plans", category: "Content", description: "Structured writing plan creation", source: "built-in", installs: "built-in", healthScore: 60 },
  { name: "podcast-generate", category: "Content", description: "Podcast content generation from text", source: "built-in", installs: "built-in", healthScore: 55 },
  { name: "marketing-mode", category: "Content", description: "Marketing strategy and execution mode", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "gumroad-pipeline", category: "Content", description: "Digital product monetization funnel — pricing, landing pages, email sequences", source: "ai-skills-library", installs: "—", isNew: true, healthScore: 95 },

  // Research (9)
  { name: "web-search", category: "Research", description: "Web search for real-time information retrieval", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "web-reader", category: "Research", description: "Web page extraction with site crawling and spidering", source: "ai-skills-library", installs: "—", healthScore: 75 },
  { name: "deep-research", category: "Research", description: "Comprehensive multi-source research workflow", source: "built-in", installs: "built-in", healthScore: 85 },
  { name: "multi-search-engine", category: "Research", description: "Multi-engine web search aggregation", source: "built-in", installs: "built-in", healthScore: 60 },
  { name: "aminer-academic-search", category: "Research", description: "Academic paper and scholar search via AMiner API", source: "built-in", installs: "built-in", healthScore: 80 },
  { name: "aminer-daily-paper", category: "Research", description: "Personalized academic paper recommendations", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "aminer-open-academic", category: "Research", description: "Open academic data access via AMiner platform", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "ai-news-collectors", category: "Research", description: "AI news aggregation and collection", source: "built-in", installs: "built-in", healthScore: 55 },
  { name: "qingyan-research", category: "Research", description: "Qingyan research and analysis", source: "built-in", installs: "built-in", healthScore: 50 },

  // Business (7)
  { name: "finance", category: "Business", description: "Real-time and historical financial data analysis", source: "built-in", installs: "built-in", healthScore: 80 },
  { name: "stock-analysis-skill", category: "Business", description: "Stock market analysis with watchlist and rumor scanning", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "market-research-reports", category: "Business", description: "Generate market research reports with visualizations", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "jobs-to-be-done", category: "Business", description: "Jobs to Be Done product research methodology", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "gift-evaluator", category: "Business", description: "Gift evaluation and recommendation", source: "built-in", installs: "built-in", healthScore: 55 },
  { name: "get-fortune-analysis", category: "Business", description: "Fortune analysis and interpretation", source: "built-in", installs: "built-in", healthScore: 45 },
  { name: "auto-target-tracker", category: "Business", description: "Automatic target and goal tracking", source: "built-in", installs: "built-in", healthScore: 50 },

  // DevOps (2)
  { name: "deployment-manager", category: "DevOps", description: "Deploy, monitor, and update projects across Vercel/Netlify/GH Pages", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "supabase-postgres", category: "DevOps", description: "Postgres performance optimization from Supabase", source: "supabase/agent-skills", installs: "125.0K", healthScore: 85 },

  // Reasoning (6)
  { name: "chain-of-thought", category: "Reasoning", description: "Step-by-step reasoning for decomposing complex problems", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "socratic-method", category: "Reasoning", description: "Guide users through strategic questioning to uncover assumptions", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "devils-advocate", category: "Reasoning", description: "Argue against premises to strengthen arguments and stress-test ideas", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "caveman", category: "Reasoning", description: "Ultra-compressed communication mode — cuts token usage ~75%", source: "juliusbrussee/caveman", installs: "84.7K", healthScore: 70 },
  { name: "context-compressor", category: "Reasoning", description: "Compress long contexts preserving decisions, actions, constraints", source: "ai-skills-library", installs: "—", healthScore: 75 },
  { name: "simulation-sandbox", category: "Reasoning", description: "Test scenarios in simulated environments before real execution", source: "ai-skills-library", installs: "—", healthScore: 75 },

  // Documents (5)
  { name: "pdf", category: "Documents", description: "Create and manipulate PDF documents", source: "built-in", installs: "built-in", healthScore: 90 },
  { name: "docx", category: "Documents", description: "Create and edit Word documents", source: "built-in", installs: "built-in", healthScore: 90 },
  { name: "ppt", category: "Documents", description: "Create and edit PowerPoint presentations", source: "built-in", installs: "built-in", healthScore: 85 },
  { name: "xlsx", category: "Documents", description: "Create, edit, and analyze Excel spreadsheets", source: "built-in", installs: "built-in", healthScore: 90 },
  { name: "charts", category: "Documents", description: "Professional chart and diagram creation", source: "built-in", installs: "built-in", healthScore: 85 },

  // Browser (2)
  { name: "agent-browser", category: "Browser", description: "Headless browser automation CLI for AI agents", source: "vercel-labs/agent-browser", installs: "216.3K", healthScore: 80 },
  { name: "browser-use", category: "Browser", description: "Natural language browser automation — no Playwright code needed", source: "skills.sh", installs: "—", isNew: true, healthScore: 95 },

  // Meta (4)
  { name: "skill-creator", category: "Meta", description: "Create, modify, and benchmark AI agent skills", source: "built-in", installs: "170.0K", healthScore: 85 },
  { name: "skill-vetter", category: "Meta", description: "Security-first skill vetting for AI agents", source: "built-in", installs: "built-in", healthScore: 80 },
  { name: "skill-finder-cn", category: "Meta", description: "Chinese-language skill discovery and search", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "output-formatter", category: "Meta", description: "Strict formatting rules for JSON, tables, markdown, code", source: "ai-skills-library", installs: "—", healthScore: 75 },

  // Education (1)
  { name: "explained-code", category: "Education", description: "Beginner-friendly code explanation with analogies and diagrams", source: "ai-skills-library", installs: "—", healthScore: 70 },

  // Specialty (7)
  { name: "interview-designer", category: "Specialty", description: "Design user research interview guides", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "storyboard-manager", category: "Specialty", description: "Story structure and character development management", source: "built-in", installs: "built-in", healthScore: 60 },
  { name: "photography-ai", category: "Specialty", description: "Professional visual engineering framework for photography", source: "ai-skills-library", installs: "—", healthScore: 75 },
  { name: "dream-interpreter", category: "Specialty", description: "Dream interpretation and analysis", source: "built-in", installs: "built-in", healthScore: 50 },
  { name: "mindfulness-meditation", category: "Specialty", description: "Mindfulness and meditation guidance", source: "built-in", installs: "built-in", healthScore: 45 },
  { name: "anti-pua", category: "Specialty", description: "Anti-manipulation and critical thinking", source: "built-in", installs: "built-in", healthScore: 55 },
  { name: "skill-router", category: "Meta", description: "Intent-to-stack meta-skill — auto-selects the right skill combination", source: "built-in", installs: "built-in", isNew: true, healthScore: 95 },
]

const SKILL_COMBOS: SkillCombo[] = [
  {
    name: "Frontend Stack",
    emoji: "\uD83C\uDFA8",
    skills: ["frontend-design", "react-best-practices", "composition-patterns", "shadcn", "web-design-guidelines"],
    tagline: "Architecture \u2192 Structure \u2192 Components \u2192 Quality Gate",
    useCase: "Building production-grade React UIs with distinctive design",
    synergy: "frontend-design sets the aesthetic vision, react-best-practices prevents performance pitfalls, composition-patterns ensures scalable architecture, shadcn provides battle-tested components, web-design-guidelines is the quality gate.",
    whyChosen: "Each skill addresses a distinct layer of frontend quality: frontend-design solves the aesthetic problem (no AI slop), react-best-practices solves the performance problem, composition-patterns solves the architecture problem, shadcn solves the speed problem, web-design-guidelines solves the compliance problem. Remove any one and you have a gap.",
    benefitsVs: "WITHOUT: You design by intuition (often AI-generic), catch performance issues late, refactor when components don't scale, build UI from scratch, and ship with unchecked quality. WITH: Every layer is validated — design is distinctive, performance is baked in, architecture scales, components are proven, and quality is gated before ship.",
    misconceptions: "Misconception: 'I just need react-best-practices for good UI.' Reality: Performance rules don't create distinctive design. You need frontend-design for aesthetics AND react-best-practices for performance. Solution: Always pair design vision with engineering rigor."
  },
  {
    name: "Ship It Stack",
    emoji: "\uD83D\uDE80",
    skills: ["chain-of-thought", "fullstack-dev", "shadcn", "supabase-postgres", "deployment-manager"],
    tagline: "Think \u2192 Build \u2192 Component \u2192 Persist \u2192 Deploy",
    useCase: "From idea to deployed product in one session",
    synergy: "chain-of-thought decomposes the problem, fullstack-dev scaffolds the app, shadcn gives instant UI, supabase-postgres handles data, deployment-manager ships it live.",
    whyChosen: "This stack mirrors the actual shipping process: think first, build next, add UI instantly, persist data, then deploy. Each skill is a phase gate — you don't skip thinking to start building, and you don't deploy before data works.",
    benefitsVs: "WITHOUT: You jump straight to coding, hit architecture problems mid-build, spend hours on UI components, debug database issues, and manually deploy. WITH: You decompose first, scaffold with confidence, get instant UI, follow database best practices, and ship with one command.",
    misconceptions: "Misconception: 'I can skip the thinking step and just build.' Reality: Without decomposition, you build the wrong thing fast. Solution: Always decompose before building — 5 minutes of thinking saves 5 hours of refactoring."
  },
  {
    name: "Research Stack",
    emoji: "\uD83D\uDD2C",
    skills: ["deep-research", "web-search", "web-reader", "context-compressor"],
    tagline: "Search \u2192 Read \u2192 Distill \u2192 Compress",
    useCase: "Deep research from question to compressed briefing",
    synergy: "deep-research orchestrates multi-source investigation, web-search finds real-time data, web-reader extracts full content, context-compressor prevents token overflow.",
    whyChosen: "Research fails at the token wall: you find too much, read too much, and overflow your context window. This stack prevents that. deep-research finds sources, web-reader extracts full content, context-compressor distills findings. Remove context-compressor and you'll hit token limits on any serious research.",
    benefitsVs: "WITHOUT: You search manually, copy-paste content, lose track of sources, and run out of context window after 5 sources. WITH: Multi-source investigation is orchestrated, full content is extracted automatically, and findings are compressed to fit any context window.",
    misconceptions: "Misconception: 'deep-research is enough on its own.' Reality: deep-research without web-reader gives you snippets. Without context-compressor, you overflow at ~8 sources. Solution: Always run the full pipeline — search, extract, compress."
  },
  {
    name: "Content Engine",
    emoji: "\u270D\uFE0F",
    skills: ["seo-geo", "seo-content-writer", "web-search", "output-formatter"],
    tagline: "Optimize \u2192 Write \u2192 Verify \u2192 Format",
    useCase: "Content that ranks in Google AND gets cited by AI assistants",
    synergy: "seo-geo targets both search engines and AI answer engines, seo-content-writer produces the content, web-search verifies claims, output-formatter ensures clean output.",
    whyChosen: "Content that ranks requires optimization (seo-geo), quality writing (seo-content-writer), factual verification (web-search), and consistent formatting (output-formatter). seo-geo is the strategy layer, seo-content-writer executes it.",
    benefitsVs: "WITHOUT: You write content by feel, hope it ranks, never verify claims, and output inconsistent formatting. WITH: Every piece is optimized for both Google AND AI answer engines, claims are verified, and formatting is consistent.",
    misconceptions: "Misconception: 'SEO is enough for visibility.' Reality: Traditional SEO only gets you Google rankings. GEO gets you cited by ChatGPT, Perplexity, and Google SGE. Without seo-geo, you're invisible to the fastest-growing search channel. Solution: Optimize for both engines."
  },
  {
    name: "Reasoning Stack",
    emoji: "\uD83E\uDDE0",
    skills: ["chain-of-thought", "devils-advocate", "simulation-sandbox"],
    tagline: "Think \u2192 Challenge \u2192 Verify",
    useCase: "Decision-making with rigorous analysis and stress-testing",
    synergy: "chain-of-thought decomposes the problem, devils-advocate attacks weak points, simulation-sandbox tests outcomes under different scenarios.",
    whyChosen: "Good decisions require three passes: decomposition, adversarial testing, and verification. Skip any step and you get confident but wrong decisions.",
    benefitsVs: "WITHOUT: You reason once, trust your first conclusion, and discover flaws after committing. WITH: Every decision is decomposed, attacked, and verified before execution. You catch 80% of reasoning errors before they become costly mistakes.",
    misconceptions: "Misconception: 'Devils-advocate is just being negative.' Reality: It returns a STRONGER version of your argument, not a destroyed one. Solution: Frame it as 'make my argument bulletproof' not 'prove me wrong.'"
  },
  {
    name: "Design & Deliver",
    emoji: "\uD83D\uDC8E",
    skills: ["frontend-design", "gsap-animations", "shadcn", "fullstack-dev", "deployment-manager"],
    tagline: "Design \u2192 Animate \u2192 Build \u2192 Ship",
    useCase: "From mockup to live site with premium interactions",
    synergy: "frontend-design sets the creative direction, gsap-animations adds micro-interactions, shadcn provides components, fullstack-dev builds it, deployment-manager ships it.",
    whyChosen: "Design without delivery is a mockup. This stack bridges the gap: each skill transforms the output closer to production. frontend-design creates the vision, gsap-animations adds premium feel, fullstack-dev makes it functional, deployment-manager makes it live.",
    benefitsVs: "WITHOUT: You have beautiful mockups that never ship, or functional products that look generic. WITH: Design vision becomes animated prototype becomes functional product becomes live site.",
    misconceptions: "Misconception: 'Animations are cosmetic — I'll add them later.' Reality: GSAP interactions define the user experience. Retrofitting animations is 3x harder. Solution: Design interactions alongside UI, not after."
  },
  {
    name: "Data Pipeline",
    emoji: "\uD83D\uDCCA",
    skills: ["xlsx", "charts", "finance", "context-compressor"],
    tagline: "Import \u2192 Visualize \u2192 Analyze \u2192 Distill",
    useCase: "Financial and data analysis from raw numbers to insights",
    synergy: "xlsx imports and processes data, charts creates visualizations, finance provides market data, context-compressor distills findings.",
    whyChosen: "Data analysis has four failure modes: can't import (xlsx solves), can't visualize (charts solves), no market data (finance solves), too much noise (context-compressor solves). Each skill removes one failure mode.",
    benefitsVs: "WITHOUT: You manually import data, create charts by hand, look up financial data separately, and drown in raw numbers. WITH: Data imports automatically, charts are professional, financial data is real-time, and findings are distilled to actionable insights.",
    misconceptions: "Misconception: 'I just need Excel for data analysis.' Reality: Excel without charts is just numbers. Charts without compression is information overload. Solution: Always visualize then distill."
  },
  {
    name: "Education Stack",
    emoji: "\uD83D\uDCDA",
    skills: ["explained-code", "socratic-method", "output-formatter", "pdf"],
    tagline: "Explain \u2192 Guide \u2192 Format \u2192 Distribute",
    useCase: "Teaching and documentation that actually lands",
    synergy: "explained-code breaks down complexity with analogies, socratic-method guides discovery, output-formatter ensures consistency, pdf produces shareable documents.",
    whyChosen: "Teaching fails when it explains but doesn't guide. explained-code breaks down complexity, socratic-method ensures the learner discovers (not just receives), output-formatter keeps materials consistent, pdf makes them shareable. Socratic is the secret — it turns passive reading into active learning.",
    benefitsVs: "WITHOUT: You explain concepts once, students nod but don't understand, materials are inconsistent, and distribution is ad-hoc. WITH: Explanations use analogies, questions guide discovery, formatting is professional, and materials are easily shared.",
    misconceptions: "Misconception: 'Good explanations are enough for learning.' Reality: Passive explanations have 20% retention. Socratic questioning has 80% retention. Solution: Always pair explanation with guided discovery."
  },
  {
    name: "DevOps Stack",
    emoji: "\u2699\uFE0F",
    skills: ["deployment-manager", "mcp-builder", "skill-creator", "skill-scanner"],
    tagline: "Build \u2192 Connect \u2192 Extend \u2192 Secure",
    useCase: "Infrastructure, integrations, and skill lifecycle management",
    synergy: "deployment-manager handles CI/CD, mcp-builder creates integrations, skill-creator builds new skills, skill-scanner secures them.",
    whyChosen: "Infrastructure has four needs: deployment, integration, extension, and security. Each skill is a different phase of the infrastructure lifecycle.",
    benefitsVs: "WITHOUT: You deploy manually, write integrations from scratch, copy-paste skills without security checks, and have no system for creating new skills. WITH: Deploy with health checks, build MCP integrations, create skills systematically, and scan everything for security.",
    misconceptions: "Misconception: 'skill-scanner is only for third-party skills.' Reality: Even your own skills can develop security issues. Solution: Scan all skills periodically, not just new installations."
  },
  {
    name: "Creative Suite",
    emoji: "\uD83C\uDFA8",
    skills: ["image-generation", "gsap-animations", "charts", "web-artifacts-builder"],
    tagline: "Create \u2192 Animate \u2192 Visualize \u2192 Package",
    useCase: "Rich creative output from images to interactive demos",
    synergy: "image-generation creates visuals, gsap-animations brings them to life, charts adds data viz, web-artifacts-builder packages everything as a shareable artifact.",
    whyChosen: "Creative work has four phases: generation, motion, data visualization, and packaging. Each phase transforms the raw creative into something more complete and shareable.",
    benefitsVs: "WITHOUT: You create static images that never move, have no data visualization, and share work as loose files. WITH: Images come to life with animations, data adds credibility, and everything packages as a shareable interactive artifact.",
    misconceptions: "Misconception: 'Image generation is the creative work — the rest is polish.' Reality: A static image without animation, data context, or packaging has 10% of the impact. Solution: Always animate, contextualize with data, and package for sharing."
  },
  {
    name: "Mobile Stack",
    emoji: "\uD83D\uDCF1",
    skills: ["react-native-skills", "frontend-design", "composition-patterns"],
    tagline: "Mobile-first \u2192 Design \u2192 Architecture",
    useCase: "Building performant React Native/Expo mobile apps",
    synergy: "react-native-skills provides mobile-specific performance rules, frontend-design ensures distinctive UI, composition-patterns keeps component architecture clean.",
    whyChosen: "Mobile development has three failure modes: poor performance, generic design, and unmaintainable architecture. Each skill targets a specific mobile pain point.",
    benefitsVs: "WITHOUT: Your mobile app lags on older devices, looks like every other React Native app, and becomes unmaintainable after 6 months. WITH: Performance is optimized from the start, design is distinctive, and component architecture scales cleanly.",
    misconceptions: "Misconception: 'React Native performance is fine out of the box.' Reality: RN has 15+ common performance traps. Solution: Always run performance rules, not just visual QA."
  },
  {
    name: "Academic Stack",
    emoji: "\uD83C\uDF93",
    skills: ["aminer-academic-search", "aminer-daily-paper", "deep-research", "pdf"],
    tagline: "Discover \u2192 Track \u2192 Analyze \u2192 Publish",
    useCase: "Academic research from paper discovery to publication",
    synergy: "aminer finds papers and scholars, aminer-daily-paper tracks new publications, deep-research synthesizes findings, pdf produces formatted output.",
    whyChosen: "Academic work requires discovery, synthesis, and formatted output. Each skill handles a different phase of the scholarly workflow.",
    benefitsVs: "WITHOUT: You search Google Scholar manually, copy-paste citations, and format documents by hand. WITH: Papers found through structured APIs, findings synthesized automatically, and output formatted for publication.",
    misconceptions: "Misconception: 'Google Scholar is sufficient.' Reality: AMiner provides citation graphs, author profiles, and recommendation engines that Scholar lacks. Solution: Use AMiner for discovery."
  },
  {
    name: "Product Launch Stack",
    emoji: "\uD83D\uDE80",
    skills: ["superpowers", "frontend-design", "react-best-practices", "browser-use", "deployment-manager", "social-media-manager", "humanizer"],
    tagline: "Spec \u2192 Design \u2192 Build \u2192 QA \u2192 Ship \u2192 Market \u2192 Polish",
    useCase: "Full product lifecycle from specification to market launch",
    synergy: "superpowers ensures spec-first architecture, frontend-design creates the UI, react-best-practices prevents performance pitfalls, browser-use handles QA, deployment-manager ships it live, social-media-manager announces it, humanizer polishes all copy.",
    whyChosen: "Launching a product requires seven distinct capabilities: specification, design, performance, QA, deployment, marketing, and polish. Each skill is a phase gate — you don't market before the product is polished.",
    benefitsVs: "WITHOUT: You build without a spec, design generically, ship with performance issues, deploy manually, announce on one platform, and your copy sounds like AI wrote it. WITH: Every phase handled by a specialist skill, zero-gap handoffs, and the final product is spec'd, tested, deployed, marketed, and humanized.",
    misconceptions: "Misconception: 'I can launch without QA.' Reality: browser-use catches 40% of bugs that manual testing misses — broken links, missing meta tags, mobile rendering issues. Solution: Always QA before deploy, even for MVPs."
  },
  {
    name: "Content Machine",
    emoji: "\uD83D\uDCDD",
    skills: ["content-strategy", "seo-content-writer", "gumroad-pipeline", "social-media-manager", "humanizer"],
    tagline: "Plan \u2192 Write \u2192 Monetize \u2192 Distribute \u2192 Polish",
    useCase: "End-to-end content production that ranks, converts, and sounds human",
    synergy: "content-strategy defines pillars and calendar, seo-content-writer produces optimized content, gumroad-pipeline monetizes it, social-media-manager distributes across platforms, humanizer strips AI patterns from everything.",
    whyChosen: "Content production has five gaps: no plan, poor optimization, no monetization, limited distribution, and AI-sounding copy. Each skill fills one gap. Remove humanizer and all your content sounds like ChatGPT wrote it.",
    benefitsVs: "WITHOUT: Random posts with no calendar, content isn't optimized, no monetization strategy, distribution is manual, and everything sounds AI-generated. WITH: Content is planned, optimized, monetized, distributed, and sounds authentically human.",
    misconceptions: "Misconception: 'Humanizer is optional — good prompts produce human-sounding content.' Reality: No prompt technique reliably strips AI patterns. The humanizer uses a Wikipedia-trained classifier. Solution: Always run humanizer as the final quality gate."
  },
  {
    name: "Web Scraping Pipeline",
    emoji: "\uD83D\uDD77\uFE0F",
    skills: ["browser-use", "web-reader", "contentanalysis", "xlsx"],
    tagline: "Browse \u2192 Extract \u2192 Analyze \u2192 Tabulate",
    useCase: "Data extraction from web to structured spreadsheet",
    synergy: "browser-use navigates and interacts with pages in natural language, web-reader extracts full content, contentanalysis distills wisdom, xlsx structures results.",
    whyChosen: "Web data extraction has four stages: navigation, extraction, analysis, and structuring. Each stage transforms raw web pages into progressively more useful data.",
    benefitsVs: "WITHOUT: You manually browse pages, copy-paste content, analyze by reading, and format data by hand. WITH: Pages navigated automatically, content extracted programmatically, insights distilled, and results structured in spreadsheets.",
    misconceptions: "Misconception: 'web-reader alone is enough for scraping.' Reality: web-reader can't interact with dynamic pages. browser-use handles interaction, web-reader handles extraction. Solution: Always pair navigation with extraction for dynamic content."
  },
  {
    name: "Creative Studio",
    emoji: "\uD83C\uDFA5",
    skills: ["brainstorming", "storyboard-manager", "image-generation", "gsap-animations"],
    tagline: "Ideate \u2192 Storyboard \u2192 Create \u2192 Animate",
    useCase: "Creative projects from initial idea to animated visual",
    synergy: "brainstorming develops the concept, storyboard-manager structures the narrative, image-generation creates visuals, gsap-animations brings them to life.",
    whyChosen: "Creative projects fail at the handoff between ideation and execution. brainstorming develops the concept, storyboard-manager structures the narrative, image-generation creates visuals, gsap-animations brings them to life.",
    benefitsVs: "WITHOUT: Ideas stay as ideas, stories have no structure, visuals are generic stock photos, and nothing moves. WITH: Concepts become structured narratives, narratives become visuals, visuals become animations — a complete creative pipeline.",
    misconceptions: "Misconception: 'Brainstorming is just freewriting.' Reality: Structured brainstorming produces 3x more viable concepts. Solution: Always use structured ideation, not stream of consciousness."
  },
  {
    name: "Automation Stack",
    emoji: "\uD83E\uDD16",
    skills: ["browser-use", "web-reader", "contentanalysis", "xlsx"],
    tagline: "Navigate \u2192 Extract \u2192 Analyze \u2192 Structure",
    useCase: "Automated data extraction from web to structured data",
    synergy: "browser-use interacts with pages, web-reader extracts content, contentanalysis distills wisdom, xlsx structures results for analysis.",
    whyChosen: "Automation requires navigation, extraction, analysis, and structured output. Each skill handles one layer of the pipeline. browser-use interacts with pages, web-reader extracts content, contentanalysis distills wisdom, xlsx structures results.",
    benefitsVs: "WITHOUT: You manually visit pages, copy data by hand, analyze by reading, and format in spreadsheets. WITH: Entire pipelines run automatically from navigation to structured data. What takes 4 hours manually takes 15 minutes automated.",
    misconceptions: "Misconception: 'Automation is only for repetitive tasks.' Reality: Even one-time data extraction benefits — consistent extraction, structured output, and no copy-paste errors. Solution: Use the pipeline for any data extraction."
  },
  {
    name: "Full Stack Mobile",
    emoji: "\uD83D\uDCF1",
    skills: ["react-native-skills", "frontend-design", "composition-patterns", "supabase-postgres"],
    tagline: "Mobile \u2192 Design \u2192 Architecture \u2192 Persist",
    useCase: "Complete mobile app development from UI to database",
    synergy: "react-native-skills provides platform expertise, frontend-design ensures distinctive UI, composition-patterns keeps architecture clean, supabase-postgres optimizes the data layer.",
    whyChosen: "Mobile apps need four things: platform expertise, distinctive design, scalable architecture, and reliable data. Each skill addresses a different mobile development concern.",
    benefitsVs: "WITHOUT: Platform-specific bugs, generic design, unmaintainable component trees, and slow database queries. WITH: Platform expertise prevents bugs, design is distinctive, architecture scales, and database queries are optimized.",
    misconceptions: "Misconception: 'Mobile is just web on a smaller screen.' Reality: Mobile has unique constraints: touch interactions, offline support, app store requirements. Solution: Always use mobile-specific skills."
  },
  {
    name: "Academic Publisher",
    emoji: "\uD83D\uDCDC",
    skills: ["aminer-academic-search", "deep-research", "pdf", "docx"],
    tagline: "Discover \u2192 Synthesize \u2192 Format \u2192 Publish",
    useCase: "Academic research from paper discovery to formatted publication",
    synergy: "aminer-academic-search finds papers, deep-research synthesizes findings, pdf produces shareable output, docx enables editing.",
    whyChosen: "Academic publishing requires discovery, synthesis, formatting, and distribution. Each skill handles a different phase of the scholarly workflow.",
    benefitsVs: "WITHOUT: Find papers manually, synthesize by copy-pasting, format by hand, and share as unstructured text. WITH: Discovery through academic APIs, comprehensive synthesis, publication-ready formatting, and dual-format output.",
    misconceptions: "Misconception: 'Academic search and regular web search are the same.' Reality: Academic search provides citation graphs, impact factors, and author disambiguation. Solution: Always use academic-specific search for scholarly work."
  },
  {
    name: "Video Production",
    emoji: "\uD83C\uDFA5",
    skills: ["video-generation", "image-generation", "gsap-animations", "web-artifacts-builder"],
    tagline: "Generate \u2192 Visualize \u2192 Animate \u2192 Package",
    useCase: "Rich video content production from text to interactive demo",
    synergy: "video-generation creates video content, image-generation produces supporting visuals, gsap-animations adds promotional animations, web-artifacts-builder packages everything.",
    whyChosen: "Video content needs generation, visuals, animation, and packaging. Each skill transforms raw creative input into progressively richer media.",
    benefitsVs: "WITHOUT: Video without supporting visuals, no animations for promotion, and no way to package everything. WITH: Video is generated, supported with custom visuals, enhanced with animations, and packaged as shareable demos.",
    misconceptions: "Misconception: 'AI video generation is ready for final production.' Reality: AI video is best for drafts and prototypes. Always pair with human review. Solution: Use video-generation for rapid prototyping, not final production."
  },
  {
    name: "Market Intelligence",
    emoji: "\uD83D\uDCC8",
    skills: ["finance", "deep-research", "market-research-reports", "charts", "pdf"],
    tagline: "Data \u2192 Research \u2192 Report \u2192 Visualize \u2192 Deliver",
    useCase: "Financial market analysis from data to executive report",
    synergy: "finance provides market data, deep-research adds context, market-research-reports structures the analysis, charts visualizes findings, pdf delivers the report.",
    whyChosen: "Market intelligence requires data, context, structure, visualization, and delivery. Each skill adds a layer: raw data, context, structured analysis, visual insights, and a shareable report.",
    benefitsVs: "WITHOUT: Stock prices without context, research without data, unstructured notes, and raw numbers. WITH: Financial data contextualized with research, structured into professional reports, visualized, and delivered as polished PDFs.",
    misconceptions: "Misconception: 'Finance skill is only for stock trading.' Reality: It provides earnings data, company financials, market news, and screening — essential context for any market decision. Solution: Use finance as a data layer, not just a trading tool."
  },
  {
    name: "API Builder",
    emoji: "\uD83D\uDD27",
    skills: ["superpowers", "mcp-builder", "coding-agent", "deployment-manager"],
    tagline: "Spec \u2192 Build MCP \u2192 Execute \u2192 Deploy",
    useCase: "Build and ship MCP servers and API integrations",
    synergy: "superpowers provides the specification, mcp-builder creates the MCP server, coding-agent implements it, deployment-manager ships it.",
    whyChosen: "Building APIs requires specification, MCP server construction, implementation, and deployment. Each skill is a distinct phase of the API lifecycle.",
    benefitsVs: "WITHOUT: Build APIs without specs, write MCP integrations from scratch, implement without planning, and deploy manually. WITH: APIs are spec'd first, MCP servers follow patterns, implementation is planned and verified, and deployment includes health checks.",
    misconceptions: "Misconception: 'MCP is just another API format.' Reality: MCP (Model Context Protocol) is the standard for AI agent integrations. It enables tool discovery, resource management, and prompt templates that REST APIs cannot. Solution: Use mcp-builder for AI-facing integrations."
  },
  {
    name: "Brand Builder",
    emoji: "\uD83C\uDF1E",
    skills: ["brainstorming", "content-strategy", "seo-geo", "social-media-manager", "humanizer"],
    tagline: "Ideate \u2192 Plan \u2192 Optimize \u2192 Execute \u2192 Polish",
    useCase: "Build a brand presence from scratch across all channels",
    synergy: "brainstorming develops brand identity, content-strategy plans the calendar, seo-geo optimizes for discovery, social-media-manager executes across platforms, humanizer polishes all copy.",
    whyChosen: "Building a brand requires ideation, planning, optimization, execution, and polish. Each skill is a different phase of brand development.",
    benefitsVs: "WITHOUT: Random posts with no strategy, content isn't optimized, distribution is inconsistent, and everything sounds AI-generated. WITH: Brand identity developed through structured ideation, content planned and optimized, distribution is multi-platform, and all copy sounds authentic.",
    misconceptions: "Misconception: 'A brand is just a logo and color scheme.' Reality: Brand is consistent voice + strategic content + multi-platform presence + authentic tone. Solution: Develop brand as a system, not a visual identity alone."
  },
  {
    name: "Data Journalist",
    emoji: "\uD83D\uDCF0",
    skills: ["web-search", "web-reader", "xlsx", "charts", "docx"],
    tagline: "Find \u2192 Extract \u2192 Structure \u2192 Visualize \u2192 Publish",
    useCase: "Data-driven journalism from source discovery to published story",
    synergy: "web-search finds sources, web-reader extracts data, xlsx structures it, charts visualizes findings, docx produces the article.",
    whyChosen: "Data journalism requires sourcing, extraction, structuring, visualization, and publication. Each skill transforms raw information into publishable stories.",
    benefitsVs: "WITHOUT: Find data manually, copy by hand, analyze in spreadsheets, create charts separately, and format from scratch. WITH: Sources found automatically, data extracted and structured, visualizations professional, and stories publication-ready.",
    misconceptions: "Misconception: 'Journalism doesn't need structured data tools.' Reality: Modern journalism is data-driven. Solution: Always structure data before writing — the story is in the numbers."
  },
  {
    name: "Startup MVP",
    emoji: "\uD83D\uDD25",
    skills: ["superpowers", "fullstack-dev", "shadcn", "supabase-postgres", "deployment-manager", "humanizer"],
    tagline: "Spec \u2192 Build \u2192 UI \u2192 Data \u2192 Ship \u2192 Polish",
    useCase: "Minimum viable product from idea to live deployment in one session",
    synergy: "superpowers provides the spec, fullstack-dev builds the app, shadcn gives instant UI, supabase-postgres handles data, deployment-manager ships it, humanizer polishes copy.",
    whyChosen: "MVP development requires specification, rapid building, instant UI, reliable data, quick deployment, and authentic copy. This is the minimum stack to go from idea to live product.",
    benefitsVs: "WITHOUT: Weeks on architecture, build UI from scratch, debug database issues, deploy manually, and landing page sounds like ChatGPT. WITH: Spec in 30 minutes, scaffold in 1 hour, instant UI, database best practices, one-command deploy, and human-sounding copy.",
    misconceptions: "Misconception: 'MVP means skipping quality.' Reality: MVP means minimum FEATURES, not minimum QUALITY. This stack ensures quality at every step while keeping scope minimal. Solution: Ship few features, but ship them well."
  },
]

const INTENT_DOMAINS: IntentDomain[] = [
  { name: "BUILD", icon: "🏗️", keywords: ["build","create","make","develop","ship","launch"], stack: "Product Launch", trigger: "/launch", chain: ["superpowers","frontend-design","react-best-practices","browser-use","deployment-manager","social-media-manager","humanizer"], color: "amber" },
  { name: "WRITE", icon: "✍️", keywords: ["write","content","blog","article","copy","email"], stack: "Content Machine", trigger: "/content", chain: ["content-strategy","seo-content-writer","gumroad-pipeline","social-media-manager","humanizer"], color: "orange" },
  { name: "RESEARCH", icon: "🔬", keywords: ["research","investigate","find out","analyze","what is"], stack: "Research Pipeline", trigger: "/research", chain: ["deep-research","web-reader","context-compressor","output-formatter","pdf"], color: "cyan" },
  { name: "DESIGN", icon: "💎", keywords: ["design","mockup","UI","interface","prototype"], stack: "Design & Deliver", trigger: "/design", chain: ["brainstorming","frontend-design","gsap-animations","fullstack-dev","deployment-manager"], color: "pink" },
  { name: "DECIDE", icon: "⚖️", keywords: ["should we","which option","compare","decide","evaluate"], stack: "Reasoning Stack", trigger: "/decide", chain: ["chain-of-thought","devils-advocate","simulation-sandbox","output-formatter"], color: "emerald" },
  { name: "DATA", icon: "📊", keywords: ["data","spreadsheet","chart","financial","report"], stack: "Data Pipeline", trigger: "/data", chain: ["finance","xlsx","charts","context-compressor","pdf"], color: "teal" },
  { name: "LEARN", icon: "📚", keywords: ["explain","teach","how does","understand","learn"], stack: "Education Stack", trigger: "/learn", chain: ["explained-code","socratic-method","output-formatter","pdf"], color: "lime" },
  { name: "AUTOMATE", icon: "🤖", keywords: ["automate","scrape","extract","monitor","track"], stack: "Automation Stack", trigger: "/automate", chain: ["browser-use","web-reader","contentanalysis","xlsx"], color: "fuchsia" },
]

const ESCALATION_CHAINS: EscalationChain[] = [
  { trigger: "superpowers.SpecMissingError", escalateTo: "brainstorming", reason: "No spec yet → ideate first with brainstorming" },
  { trigger: "browser-use.PageLoadTimeoutError", escalateTo: "web-reader", reason: "Browser can't load → try direct content extraction" },
  { trigger: "seo-content-writer.EmptyInputError", escalateTo: "content-strategy", reason: "No content brief → generate one from strategy" },
  { trigger: "deployment-manager.DeployCheckFailedError", escalateTo: "coding-agent", reason: "Deploy failing → auto-fix code issues" },
  { trigger: "humanizer.CodeCorruptionError", escalateTo: "coding-agent", reason: "Humanizer broke code → restore from coding-agent" },
  { trigger: "social-media-manager.MissingPersonaError", escalateTo: "content-strategy", reason: "No audience defined → derive from content strategy" },
  { trigger: "deep-research.SourceExhaustedError", escalateTo: "multi-search-engine", reason: "Primary sources empty → try multi-engine search" },
  { trigger: "context-compressor.TokenOverflowError", escalateTo: "caveman", reason: "Still too long → ultra-compress with caveman mode" },
  { trigger: "charts.RenderingError", escalateTo: "output-formatter", reason: "Chart failed → fallback to formatted table" },
  { trigger: "finance.APIRateLimitError", escalateTo: "web-search", reason: "API limited → search for cached financial data" },
  { trigger: "gumroad-pipeline.NoProductError", escalateTo: "brainstorming", reason: "No product defined → ideate product concepts first" },
  { trigger: "skill-router.ChainBreakError", escalateTo: "superpowers", reason: "Chain broke → re-architect the approach" },
]

const COMPATIBILITY: Compatibility[] = [
  { type: 'synergy', skillA: 'superpowers', skillB: 'coding-agent', reason: 'Spec then execute — zero-gap handoff' },
  { type: 'synergy', skillA: 'frontend-design', skillB: 'gsap-animations', reason: 'Design vision → premium interactions' },
  { type: 'synergy', skillA: 'seo-content-writer', skillB: 'humanizer', reason: 'Write then de-AI — content that ranks AND sounds human' },
  { type: 'synergy', skillA: 'content-strategy', skillB: 'social-media-manager', reason: 'Plan then execute — no random posts' },
  { type: 'synergy', skillA: 'deep-research', skillB: 'context-compressor', reason: 'Research without token overflow' },
  { type: 'synergy', skillA: 'browser-use', skillB: 'web-reader', reason: 'Navigate then extract — complete web pipeline' },
  { type: 'synergy', skillA: 'brainstorming', skillB: 'storyboard-manager', reason: 'Ideate then structure — creative pipeline' },
  { type: 'synergy', skillA: 'shadcn', skillB: 'react-best-practices', reason: 'Battle-tested components + performance rules' },
  { type: 'synergy', skillA: 'chain-of-thought', skillB: 'devils-advocate', reason: 'Think then challenge — stronger conclusions' },
  { type: 'synergy', skillA: 'fullstack-dev', skillB: 'deployment-manager', reason: 'Build then ship — complete dev lifecycle' },
  { type: 'synergy', skillA: 'superpowers', skillB: 'deployment-manager', reason: 'Spec then deploy — architectural control to production' },
  { type: 'synergy', skillA: 'finance', skillB: 'charts', reason: 'Data then visualize — financial insights at a glance' },
  { type: 'synergy', skillA: 'pdf', skillB: 'docx', reason: 'Dual format output — PDF for sharing, DOCX for editing' },
  { type: 'synergy', skillA: 'xlsx', skillB: 'charts', reason: 'Structure then visualize — data becomes stories' },
  { type: 'synergy', skillA: 'skill-creator', skillB: 'skill-scanner', reason: 'Build then secure — skill lifecycle management' },
  { type: 'synergy', skillA: 'supabase-postgres', skillB: 'fullstack-dev', reason: 'Database optimization + app scaffold — performant data layer' },
  { type: 'synergy', skillA: 'react-native-skills', skillB: 'frontend-design', reason: 'Mobile expertise + distinctive UI — premium mobile' },
  { type: 'synergy', skillA: 'seo-geo', skillB: 'social-media-manager', reason: 'AI visibility + multi-platform distribution — discoverability stack' },
  { type: 'synergy', skillA: 'gumroad-pipeline', skillB: 'humanizer', reason: 'Monetize then polish — conversion copy that converts' },
  { type: 'conflict', skillA: 'caveman', skillB: 'humanizer', reason: 'Caveman compresses, humanizer expands — opposing goals' },
  { type: 'conflict', skillA: 'agent-browser', skillB: 'browser-use', reason: 'Same domain, different paradigms — pick one per task' },
  { type: 'conflict', skillA: 'marketing-mode', skillB: 'socratic-method', reason: 'Marketing persuades, Socratic questions — contradictory tone' },
  { type: 'conflict', skillA: 'dream-interpreter', skillB: 'devils-advocate', reason: 'Subjective vs objective — incompatible frames' },
  { type: 'conflict', skillA: 'skill-finder-cn', skillB: 'find-skills', reason: 'Duplicate discovery tools — use one per language' },
]

const DEPENDENCIES: Dependency[] = [
  { skill: "superpowers", depends: ["brainstorming", "coding-agent"], reason: "Delegates ideation to brainstorming and execution to coding-agent" },
  { skill: "deployment-manager", depends: ["fullstack-dev"], reason: "Deploys output from fullstack builds" },
  { skill: "humanizer", depends: ["seo-content-writer", "blog-writer"], reason: "Humanizes output from writing skills" },
  { skill: "social-media-manager", depends: ["content-strategy"], reason: "Executes strategy defined by content-strategy" },
  { skill: "context-compressor", depends: ["deep-research", "web-reader"], reason: "Compresses output from research skills" },
  { skill: "charts", depends: ["xlsx", "finance"], reason: "Visualizes data from spreadsheets and financial data" },
  { skill: "pdf", depends: ["output-formatter"], reason: "Formats output before PDF generation" },
  { skill: "gumroad-pipeline", depends: ["content-strategy", "seo-content-writer"], reason: "Monetizes content produced by writing pipeline" },
  { skill: "browser-use", depends: ["web-reader"], reason: "Navigates pages that web-reader then extracts" },
  { skill: "skill-scanner", depends: ["skill-vetter"], reason: "Deep scan after initial vetting" },
]

const HEALING_RULES: HealingRule[] = [
  { detect: "Skill SKILL.md missing Context section", repair: "Run skill-creator to regenerate missing sections", severity: "critical" },
  { detect: "Skill not referenced in any stack", repair: "Evaluate for stack inclusion or mark as standalone", severity: "warning" },
  { detect: "Handoff chain has broken link (skill not installed)", repair: "Install missing skill or reroute chain", severity: "critical" },
  { detect: "Health score drops below 50", repair: "Audit skill with skill-creator, add error handling", severity: "warning" },
  { detect: "Two skills in same domain with identical approach", repair: "Merge into one skill or define distinct routing rules", severity: "info" },
  { detect: "Error code references non-existent skill", repair: "Update escalation chain to valid skill", severity: "critical" },
  { detect: "Stack missing quality gate skill", repair: "Add humanizer (content) or browser-use (code) as final step", severity: "warning" },
  { detect: "Dependency cycle detected", repair: "Break cycle by extracting shared logic to new skill", severity: "critical" },
]

const ROI_DATA: ROIData[] = [
  { stack: "Product Launch", timeWithout: "40 hrs", timeWith: "6 hrs", qualityWithout: "60%", qualityWith: "95%", errorReduction: "75%" },
  { stack: "Content Machine", timeWithout: "20 hrs", timeWith: "3 hrs", qualityWithout: "55%", qualityWith: "92%", errorReduction: "80%" },
  { stack: "Research Pipeline", timeWithout: "15 hrs", timeWith: "2 hrs", qualityWithout: "50%", qualityWith: "90%", errorReduction: "70%" },
  { stack: "Design & Deliver", timeWithout: "25 hrs", timeWith: "5 hrs", qualityWithout: "65%", qualityWith: "93%", errorReduction: "72%" },
  { stack: "Reasoning Stack", timeWithout: "8 hrs", timeWith: "1.5 hrs", qualityWithout: "55%", qualityWith: "88%", errorReduction: "65%" },
  { stack: "Data Pipeline", timeWithout: "10 hrs", timeWith: "2 hrs", qualityWithout: "60%", qualityWith: "90%", errorReduction: "70%" },
  { stack: "Education Stack", timeWithout: "12 hrs", timeWith: "3 hrs", qualityWithout: "50%", qualityWith: "85%", errorReduction: "60%" },
  { stack: "Automation Stack", timeWithout: "8 hrs", timeWith: "0.5 hrs", qualityWithout: "45%", qualityWith: "88%", errorReduction: "82%" },
  { stack: "Frontend Stack", timeWithout: "30 hrs", timeWith: "5 hrs", qualityWithout: "55%", qualityWith: "94%", errorReduction: "78%" },
  { stack: "Ship It", timeWithout: "20 hrs", timeWith: "3 hrs", qualityWithout: "60%", qualityWith: "90%", errorReduction: "70%" },
  { stack: "Startup MVP", timeWithout: "35 hrs", timeWith: "4 hrs", qualityWithout: "55%", qualityWith: "92%", errorReduction: "76%" },
  { stack: "Brand Builder", timeWithout: "25 hrs", timeWith: "4 hrs", qualityWithout: "50%", qualityWith: "90%", errorReduction: "75%" },
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
  { rank: 13, name: "browser-use", source: "skills.sh", installs: "—", category: "Browser", isNew: true },
  { rank: 14, name: "superpowers", source: "skills.sh", installs: "—", category: "Development", isNew: true },
  { rank: 15, name: "skill-router", source: "built-in", installs: "built-in", category: "Meta", isNew: true },
]

const ONE_PROMPTS: OnePrompt[] = [
  {
    name: "Full Frontend Power",
    stack: "Frontend Stack",
    prompt: `Install these skills for production-grade React UI development:\n\n1. frontend-design — distinctive, non-AI-slop aesthetics\n2. react-best-practices — 70 performance rules from Vercel\n3. composition-patterns — scalable component architecture\n4. shadcn — battle-tested UI components\n5. web-design-guidelines — quality gate for UI compliance\n\nTogether: Design vision + Performance + Architecture + Components + Quality = ship premium UIs fast.`
  },
  {
    name: "Ship It Now",
    stack: "Ship It Stack",
    prompt: `Install these skills to go from idea to deployed product:\n\n1. chain-of-thought — decompose complex problems\n2. fullstack-dev — scaffold full-stack Next.js apps\n3. shadcn — instant UI components\n4. supabase-postgres — database best practices\n5. deployment-manager — ship to Vercel/Netlify/GH Pages\n\nTogether: Think + Build + UI + Data + Deploy = zero-to-live in one session.`
  },
  {
    name: "Deep Research Pipeline",
    stack: "Research Stack",
    prompt: `Install these skills for comprehensive research workflows:\n\n1. deep-research — multi-source investigation orchestrator\n2. web-search — real-time information retrieval\n3. web-reader — full content extraction with crawling\n4. context-compressor — prevent token overflow, preserve decisions\n\nTogether: Search + Read + Distill + Compress = research that scales.`
  },
  {
    name: "Reason & Decide",
    stack: "Reasoning Stack",
    prompt: `Install these skills for rigorous decision-making:\n\n1. chain-of-thought — step-by-step problem decomposition\n2. devils-advocate — stress-test arguments, return stronger version\n3. simulation-sandbox — test scenarios with labeled simulated data\n\nTogether: Think + Challenge + Verify = decisions that survive contact with reality.`
  },
  {
    name: "Content That Ranks",
    stack: "Content Engine",
    prompt: `Install these skills for content that ranks in Google AND AI:\n\n1. seo-geo — optimize for search engines AND AI answer engines\n2. seo-content-writer — production SEO content creation\n3. web-search — verify claims with real-time data\n4. output-formatter — clean, structured output every time\n\nTogether: Optimize + Write + Verify + Format = content that gets found and cited.`
  },
  {
    name: "Product Launch",
    stack: "Product Launch Stack",
    prompt: `Install these skills for full product lifecycle:\n\n1. superpowers — spec-first project orchestration with typed errors\n2. frontend-design — distinctive, non-AI-slop UI\n3. react-best-practices — 70 performance rules from Vercel\n4. deployment-manager — ship to production with health checks\n5. social-media-manager — multi-platform content with brand voice\n6. humanizer — strip AI patterns, sound human\n\nTogether: Spec + Design + Build + Ship + Market + Polish = launch products that feel real.`
  },
  {
    name: "Content That Converts",
    stack: "Content Machine",
    prompt: `Install these skills for content that ranks AND converts:\n\n1. content-strategy — define pillars, editorial calendar, KPIs\n2. seo-content-writer — production SEO content creation\n3. gumroad-pipeline — monetize with pricing, landing pages, email sequences\n4. social-media-manager — multi-platform execution\n5. humanizer — AI pattern stripping as quality gate\n\nTogether: Plan + Write + Monetize + Distribute + Polish = content machine that converts.`
  },
  {
    name: "Startup MVP Sprint",
    stack: "Startup MVP",
    prompt: `Install these skills to ship an MVP in one session:\n\n1. superpowers — spec-first, never build the wrong thing\n2. fullstack-dev — Next.js 16 scaffold with Prisma\n3. shadcn — instant professional UI components\n4. supabase-postgres — optimized database from day one\n5. deployment-manager — one-command ship to production\n6. humanizer — all copy sounds authentically human\n\nTogether: Spec + Build + UI + Data + Ship + Polish = MVP in hours, not weeks.`
  },
  {
    name: "Brand From Scratch",
    stack: "Brand Builder",
    prompt: `Install these skills to build a brand presence:\n\n1. brainstorming — structured ideation for brand identity\n2. content-strategy — editorial calendar and content pillars\n3. seo-geo — optimize for Google AND AI answer engines\n4. social-media-manager — multi-platform execution with brand voice\n5. humanizer — strip AI patterns, sound authentically human\n\nTogether: Ideate + Plan + Optimize + Execute + Polish = brand that people trust.`
  },
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
      { name: "content-strategy", approach: "Planning layer — pillars, calendar", bestFor: "Quarterly content planning" },
      { name: "marketing-mode", approach: "Strategic positioning", bestFor: "Brand and positioning strategy" },
      { name: "social-media-manager", approach: "Execution layer — multi-platform posts", bestFor: "Day-to-day social content" }
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
  },
  {
    skill: "skill-router",
    errorTypes: [
      { type: "IntentAmbiguousError", code: "SR-001", action: "Ask one clarifying question with max 3 options" },
      { type: "SkillNotInstalledError", code: "SR-002", action: "Report missing skill, suggest installation command" },
      { type: "ChainBreakError", code: "SR-003", action: "Log which skill failed, attempt continuation from next" },
      { type: "MultiIntentConflictError", code: "SR-004", action: "Prioritize by action verb, defer secondary intents" },
      { type: "QualityGateFailureError", code: "SR-005", action: "Re-route with deviation context, max 2 retries" },
      { type: "CircularDependencyError", code: "SR-006", action: "Break cycle, log the loop, execute linearized path" }
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

function getHealthBadge(score: number) {
  if (score >= 80) return { label: "Excellent", bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" }
  if (score >= 60) return { label: "Good", bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" }
  if (score >= 40) return { label: "Fair", bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" }
  return { label: "Needs Work", bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" }
}

function parseInstalls(s: string): number {
  if (s === "built-in" || s === "—") return 0
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

const INTENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  orange: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  cyan: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30" },
  pink: { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/30" },
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  teal: { bg: "bg-teal-500/15", text: "text-teal-400", border: "border-teal-500/30" },
  lime: { bg: "bg-lime-500/15", text: "text-lime-400", border: "border-lime-500/30" },
  fuchsia: { bg: "bg-fuchsia-500/15", text: "text-fuchsia-400", border: "border-fuchsia-500/30" },
}

const NAV_ITEMS = [
  { id: "hero", label: "Top" },
  { id: "router", label: "Router" },
  { id: "top-skills", label: "Top Skills" },
  { id: "stacks", label: "Stacks" },
  { id: "directory", label: "Directory" },
  { id: "analysis", label: "Analysis" },
  { id: "upgrades", label: "Upgrades" },
  { id: "errors", label: "Errors" },
  { id: "escalation", label: "Escalation" },
  { id: "compatibility", label: "Compatibility" },
  { id: "roi", label: "ROI" },
  { id: "dependencies", label: "Deps" },
  { id: "healing", label: "Healing" },
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
  const [expandedCombo, setExpandedCombo] = useState<string | null>(null)
  const [sortField, setSortField] = useState<"rank" | "name" | "installs" | "health">("rank")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeSection, setActiveSection] = useState("hero")
  const [routerInput, setRouterInput] = useState("")
  const [matchedIntent, setMatchedIntent] = useState<IntentDomain | null>(null)
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.15 }
    )
    Object.values(sectionsRef.current).forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch { /* fallback */ }
  }, [])

  // Router intent matching
  const handleRouterSearch = useCallback((query: string) => {
    setRouterInput(query)
    if (!query.trim()) { setMatchedIntent(null); return }
    const q = query.toLowerCase()
    let best: IntentDomain | null = null
    let bestScore = 0
    for (const domain of INTENT_DOMAINS) {
      let score = 0
      for (const kw of domain.keywords) {
        if (q.includes(kw)) score += kw.length
      }
      if (score > bestScore) { bestScore = score; best = domain }
    }
    setMatchedIntent(best)
  }, [])

  const filteredSkills = useMemo(() => {
    let skills = INSTALLED_SKILLS
    if (selectedCategory !== "All") skills = skills.filter(s => s.category === selectedCategory)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      skills = skills.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
    }
    return skills
  }, [searchQuery, selectedCategory])

  const avgHealthScore = Math.round(INSTALLED_SKILLS.reduce((a, s) => a + s.healthScore, 0) / INSTALLED_SKILLS.length)

  const scrollTo = useCallback((id: string) => {
    sectionsRef.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const sortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUp className="w-3 h-3 opacity-30" />
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
  }

  const toggleSort = (field: "rank" | "name" | "installs" | "health") => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("asc") }
  }

  const sortedTopSkills = useMemo(() => {
    const skills = [...TOP_SKILLS]
    if (sortField === "name") skills.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortField === "installs") skills.sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs))
    if (sortDir === "desc" && sortField !== "installs") skills.reverse()
    return skills
  }, [sortField, sortDir])

  const manifest = JSON.stringify({
    version: "2.0",
    totalSkills: INSTALLED_SKILLS.length,
    totalStacks: SKILL_COMBOS.length,
    skillRouter: true,
    healthScoreAverage: avgHealthScore,
    routerCommands: INTENT_DOMAINS.map(d => ({ trigger: d.trigger, stack: d.stack, skills: d.chain })),
    categories: ALL_CATEGORIES,
    escalationChains: ESCALATION_CHAINS,
    dependencies: DEPENDENCIES.map(d => ({ skill: d.skill, depends: d.depends })),
    healingRules: HEALING_RULES,
  }, null, 2)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="font-bold text-sm shrink-0">Skills Portal</span>
          <Separator orientation="vertical" className="h-5 mx-1" />
          {NAV_ITEMS.map(item => (
            <Button key={item.id} variant={activeSection === item.id ? "default" : "ghost"} size="sm"
              className="text-xs px-2 py-1 h-7 shrink-0"
              onClick={() => scrollTo(item.id)}>
              {item.label}
            </Button>
          ))}
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        {/* ─── HERO ─── */}
        <section id="hero" ref={el => { sectionsRef.current["hero"] = el }}>
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Agent Skills Portal
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              82 skills. 25 stacks. 1 skill router. The difference between having a team and having an organization.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Skills", value: INSTALLED_SKILLS.length, icon: Package, color: "text-amber-400" },
              { label: "Stacks", value: SKILL_COMBOS.length, icon: Layers, color: "text-pink-400" },
              { label: "Router Commands", value: INTENT_DOMAINS.length, icon: Navigation, color: "text-cyan-400" },
              { label: "Escalation Chains", value: ESCALATION_CHAINS.length, icon: ArrowRightLeft, color: "text-emerald-400" },
              { label: "Avg Health Score", value: avgHealthScore, icon: Heart, color: "text-rose-400" },
            ].map(stat => (
              <Card key={stat.label} className="bg-card/50 border-border">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ─── SKILL ROUTER ─── */}
        <section id="router" ref={el => { sectionsRef.current["router"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Skill Router</h2>
            <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30">NEW</Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            The meta-skill that reads your intent and automatically selects the right skill stack. This is the brain stem of the organization.
          </p>

          {/* Router Search */}
          <Card className="bg-card/50 border-border mb-6">
            <CardContent className="p-6">
              <label className="text-sm font-medium mb-2 block">Describe what you want to do:</label>
              <div className="flex gap-2">
                <Input value={routerInput} onChange={e => handleRouterSearch(e.target.value)}
                  placeholder="e.g., launch a SaaS product, research AI agents, write a blog post..."
                  className="flex-1" />
                {routerInput && (
                  <Button variant="ghost" size="icon" onClick={() => { setRouterInput(""); setMatchedIntent(null) }}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {matchedIntent && (
                <div className="mt-4 p-4 rounded-lg border border-border bg-background/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{matchedIntent.icon}</span>
                    <span className="font-bold text-lg">{matchedIntent.name}</span>
                    <Badge className={`${INTENT_COLORS[matchedIntent.color].bg} ${INTENT_COLORS[matchedIntent.color].text} ${INTENT_COLORS[matchedIntent.color].border} border`}>
                      {matchedIntent.trigger}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Stack: <strong>{matchedIntent.stack}</strong></p>
                  <div className="flex flex-wrap items-center gap-1">
                    {matchedIntent.chain.map((skill, i) => (
                      <span key={skill} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">{skill}</Badge>
                        {i < matchedIntent.chain.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Intent Domain Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {INTENT_DOMAINS.map(domain => {
              const colors = INTENT_COLORS[domain.color]
              return (
                <Card key={domain.name} className={`bg-card/50 border-border hover:border-primary/50 transition-colors cursor-pointer ${matchedIntent?.name === domain.name ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => { setMatchedIntent(domain); setRouterInput(domain.keywords[0]) }}>
                  <CardContent className="p-4">
                    <div className="text-2xl mb-1">{domain.icon}</div>
                    <div className="font-bold text-sm mb-1">{domain.name}</div>
                    <Badge className={`${colors.bg} ${colors.text} ${colors.border} border text-[10px]`}>{domain.trigger}</Badge>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {domain.keywords.slice(0, 3).map(kw => (
                        <span key={kw} className="text-[10px] text-muted-foreground">{kw}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Router Commands */}
          <h3 className="text-lg font-semibold mb-3">Router Commands</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {INTENT_DOMAINS.map(d => {
              const colors = INTENT_COLORS[d.color]
              return (
                <div key={d.trigger} className="p-2 rounded-lg border border-border bg-card/30 text-center">
                  <div className="text-lg">{d.icon}</div>
                  <code className={`text-xs font-mono ${colors.text}`}>{d.trigger}</code>
                  <div className="text-[10px] text-muted-foreground mt-1">{d.chain.length} skills</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── TOP SKILLS ─── */}
        <section id="top-skills" ref={el => { sectionsRef.current["top-skills"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold">Top Skills by Installs</h2>
          </div>
          <Card className="bg-card/50 border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("rank")}>Rank {sortIcon("rank")}</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>Name {sortIcon("name")}</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("installs")}>Installs {sortIcon("installs")}</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTopSkills.map(skill => {
                  const catColor = getCategoryColor(skill.category)
                  return (
                    <TableRow key={skill.rank}>
                      <TableCell className="font-mono text-sm">#{skill.rank}</TableCell>
                      <TableCell className="font-medium">{skill.name} {skill.isNew && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] ml-1">NEW</Badge>}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{skill.source}</TableCell>
                      <TableCell className="font-mono">{skill.installs}</TableCell>
                      <TableCell><Badge className={`${catColor.bg} ${catColor.text} ${catColor.border} border`}>{skill.category}</Badge></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* ─── STACKS ─── */}
        <section id="stacks" ref={el => { sectionsRef.current["stacks"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-6 h-6 text-pink-400" />
            <h2 className="text-2xl font-bold">Skill Stacks ({SKILL_COMBOS.length})</h2>
          </div>
          <p className="text-muted-foreground mb-6">Curated combinations where each skill solves a specific problem in the pipeline. Click any stack to see the deep analysis.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {SKILL_COMBOS.map(combo => (
              <Card key={combo.name} className="bg-card/50 border-border hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedCombo(expandedCombo === combo.name ? null : combo.name)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{combo.emoji}</span>
                      <div>
                        <CardTitle className="text-base">{combo.name}</CardTitle>
                        <CardDescription className="text-xs">{combo.tagline}</CardDescription>
                      </div>
                    </div>
                    {expandedCombo === combo.name ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {combo.skills.map((skill, i) => (
                      <span key={skill} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-[10px]">{skill}</Badge>
                        {i < combo.skills.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-muted-foreground" />}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1"><strong>Use:</strong> {combo.useCase}</p>

                  {expandedCombo === combo.name && (
                    <div className="mt-3 space-y-3 border-t border-border pt-3">
                      <div>
                        <h4 className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Why This Combination</h4>
                        <p className="text-xs text-muted-foreground">{combo.whyChosen}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1"><BarChart3 className="w-3 h-3" /> With vs Without</h4>
                        <p className="text-xs text-muted-foreground">{combo.benefitsVs}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Common Misconception + Solution</h4>
                        <p className="text-xs text-muted-foreground">{combo.misconceptions}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-violet-400 mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> Synergy</h4>
                        <p className="text-xs text-muted-foreground">{combo.synergy}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ─── DIRECTORY ─── */}
        <section id="directory" ref={el => { sectionsRef.current["directory"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-6 h-6 text-violet-400" />
            <h2 className="text-2xl font-bold">Full Directory ({INSTALLED_SKILLS.length})</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Input placeholder="Search skills..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="max-w-xs" />
            <div className="flex flex-wrap gap-1">
              <Button size="sm" variant={selectedCategory === "All" ? "default" : "ghost"} onClick={() => setSelectedCategory("All")}>All</Button>
              {ALL_CATEGORIES.map(cat => (
                <Button key={cat} size="sm" variant={selectedCategory === cat ? "default" : "ghost"} onClick={() => setSelectedCategory(cat)}
                  className="text-xs">{cat}</Button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredSkills.map(skill => {
              const catColor = getCategoryColor(skill.category)
              const health = getHealthBadge(skill.healthScore)
              return (
                <div key={skill.name} className="p-3 rounded-lg border border-border bg-card/30 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-sm">{skill.name}</span>
                      {skill.isNew && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px]">NEW</Badge>}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{skill.description}</p>
                    <Badge className={`${catColor.bg} ${catColor.text} ${catColor.border} border text-[9px] mt-1`}>{skill.category}</Badge>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono">{skill.healthScore}</div>
                    <Badge className={`${health.bg} ${health.text} ${health.border} border text-[9px]`}>{health.label}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── COMPARATIVE ANALYSIS ─── */}
        <section id="analysis" ref={el => { sectionsRef.current["analysis"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <ArrowRightLeft className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold">Comparative Analysis</h2>
          </div>
          <Accordion type="multiple" className="space-y-2">
            {SKILL_OVERLAPS.map(overlap => (
              <AccordionItem key={overlap.domain} value={overlap.domain} className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">{overlap.domain}</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Skill</TableHead>
                        <TableHead>Approach</TableHead>
                        <TableHead>Best For</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overlap.skills.map(s => (
                        <TableRow key={s.name}>
                          <TableCell className="font-medium text-sm">{s.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{s.approach}</TableCell>
                          <TableCell className="text-xs">{s.bestFor}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs text-emerald-400"><strong>Routing:</strong> {overlap.routing}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ─── UPGRADES ─── */}
        <section id="upgrades" ref={el => { sectionsRef.current["upgrades"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold">Skill Upgrade Paths</h2>
          </div>
          <Card className="bg-card/50 border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Original</TableHead>
                  <TableHead>Upgraded To</TableHead>
                  <TableHead>New Capabilities</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SKILL_UPGRADES.map(up => {
                  const statusColor = STATUS_COLORS[up.status] || STATUS_COLORS.COEXIST
                  return (
                    <TableRow key={up.original + up.upgraded}>
                      <TableCell className="font-medium text-sm">{up.original}</TableCell>
                      <TableCell className="font-medium text-sm">{up.upgraded}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{up.newCapabilities}</TableCell>
                      <TableCell><Badge className={`${statusColor.bg} ${statusColor.text} ${statusColor.border} border`}>{up.status}</Badge></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* ─── ERROR STANDARDS ─── */}
        <section id="errors" ref={el => { sectionsRef.current["errors"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold">Typed Error Handling</h2>
          </div>
          <Accordion type="multiple" className="space-y-2">
            {ERROR_STANDARDS.map(std => (
              <AccordionItem key={std.skill} value={std.skill} className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">{std.skill} ({std.errorTypes.length} error types)</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Error Type</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {std.errorTypes.map(err => (
                        <TableRow key={err.code}>
                          <TableCell className="font-mono text-xs">{err.type}</TableCell>
                          <TableCell><Badge variant="outline" className="font-mono text-[10px]">{err.code}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{err.action}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ─── ERROR ESCALATION ─── */}
        <section id="escalation" ref={el => { sectionsRef.current["escalation"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <RefreshCw className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold">Error Escalation Chains</h2>
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">NEW</Badge>
          </div>
          <p className="text-muted-foreground mb-4">When Skill A fails, which Skill B handles recovery? These chains ensure no error is a dead end.</p>
          <Card className="bg-card/50 border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trigger Error</TableHead>
                  <TableHead>Escalate To</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ESCALATION_CHAINS.map(chain => (
                  <TableRow key={chain.trigger}>
                    <TableCell className="font-mono text-xs text-red-400">{chain.trigger}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{chain.escalateTo}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{chain.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* ─── COMPATIBILITY ─── */}
        <section id="compatibility" ref={el => { sectionsRef.current["compatibility"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-bold">Compatibility Matrix</h2>
            <Badge className="bg-sky-500/15 text-sky-400 border-sky-500/30">NEW</Badge>
          </div>
          <Tabs defaultValue="synergies">
            <TabsList>
              <TabsTrigger value="synergies">Synergies ({COMPATIBILITY.filter(c => c.type === 'synergy').length})</TabsTrigger>
              <TabsTrigger value="conflicts">Conflicts ({COMPATIBILITY.filter(c => c.type === 'conflict').length})</TabsTrigger>
            </TabsList>
            <TabsContent value="synergies">
              <div className="grid md:grid-cols-2 gap-2 mt-3">
                {COMPATIBILITY.filter(c => c.type === 'synergy').map((c, i) => (
                  <div key={i} className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium">{c.skillA}</span>
                      <span className="text-xs text-muted-foreground mx-1">+</span>
                      <span className="text-sm font-medium">{c.skillB}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="conflicts">
              <div className="grid md:grid-cols-2 gap-2 mt-3">
                {COMPATIBILITY.filter(c => c.type === 'conflict').map((c, i) => (
                  <div key={i} className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium">{c.skillA}</span>
                      <span className="text-xs text-muted-foreground mx-1">vs</span>
                      <span className="text-sm font-medium">{c.skillB}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* ─── ROI ANALYSIS ─── */}
        <section id="roi" ref={el => { sectionsRef.current["roi"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-teal-400" />
            <h2 className="text-2xl font-bold">Stack ROI Analysis</h2>
            <Badge className="bg-teal-500/15 text-teal-400 border-teal-500/30">NEW</Badge>
          </div>
          <p className="text-muted-foreground mb-4">Measurable impact of using stacks vs. ad-hoc skill selection.</p>
          <Card className="bg-card/50 border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stack</TableHead>
                  <TableHead className="text-red-400">Time (Without)</TableHead>
                  <TableHead className="text-emerald-400">Time (With)</TableHead>
                  <TableHead className="text-red-400">Quality (Without)</TableHead>
                  <TableHead className="text-emerald-400">Quality (With)</TableHead>
                  <TableHead className="text-amber-400">Error Reduction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROI_DATA.map(row => (
                  <TableRow key={row.stack}>
                    <TableCell className="font-medium text-sm">{row.stack}</TableCell>
                    <TableCell className="text-xs text-red-400">{row.timeWithout}</TableCell>
                    <TableCell className="text-xs text-emerald-400 font-medium">{row.timeWith}</TableCell>
                    <TableCell className="text-xs text-red-400">{row.qualityWithout}</TableCell>
                    <TableCell className="text-xs text-emerald-400 font-medium">{row.qualityWith}</TableCell>
                    <TableCell><Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 border">{row.errorReduction}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* ─── DEPENDENCIES ─── */}
        <section id="dependencies" ref={el => { sectionsRef.current["dependencies"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <GitBranch className="w-6 h-6 text-violet-400" />
            <h2 className="text-2xl font-bold">Skill Dependency Graph</h2>
            <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/30">NEW</Badge>
          </div>
          <p className="text-muted-foreground mb-4">Which skills depend on which other skills. Arrows show dependency direction.</p>
          <div className="space-y-3">
            {DEPENDENCIES.map(dep => (
              <div key={dep.skill} className="p-3 rounded-lg border border-border bg-card/30">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/30 border font-medium">{dep.skill}</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">depends on</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  {dep.depends.map(d => (
                    <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{dep.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SELF-HEALING ─── */}
        <section id="healing" ref={el => { sectionsRef.current["healing"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-6 h-6 text-lime-400" />
            <h2 className="text-2xl font-bold">Self-Healing System</h2>
            <Badge className="bg-lime-500/15 text-lime-400 border-lime-500/30">NEW</Badge>
          </div>
          <p className="text-muted-foreground mb-4">Detection and repair rules that keep the skill system healthy without human intervention.</p>
          <Card className="bg-card/50 border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Detect</TableHead>
                  <TableHead>Repair</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HEALING_RULES.map((rule, i) => {
                  const severityColors: Record<string, { bg: string; text: string; border: string }> = {
                    critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
                    warning: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
                    info: { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/30" },
                  }
                  const sc = severityColors[rule.severity]
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-xs">{rule.detect}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{rule.repair}</TableCell>
                      <TableCell><Badge className={`${sc.bg} ${sc.text} ${sc.border} border`}>{rule.severity}</Badge></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* ─── ONE-PROMPT INSTALL ─── */}
        <section id="install" ref={el => { sectionsRef.current["install"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold">One-Prompt Install ({ONE_PROMPTS.length})</h2>
          </div>
          <div className="space-y-3">
            {ONE_PROMPTS.map(op => (
              <Card key={op.name} className="bg-card/50 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">{op.name}</h3>
                      <p className="text-xs text-muted-foreground">Stack: {op.stack}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(op.prompt, op.name)}>
                      {copiedId === op.name ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">{op.prompt}</pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ─── INSTALLATION SOURCE ─── */}
        <section id="source" ref={el => { sectionsRef.current["source"] = el }}>
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Installation Source (AI-Consumable Manifest v2)</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Copy this manifest and provide it to any AI agent. It contains the complete system specification for auto-configuration.
          </p>
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex justify-end mb-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(manifest, "manifest")}>
                  {copiedId === "manifest" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copiedId === "manifest" ? "Copied!" : "Copy Manifest"}
                </Button>
              </div>
              <pre className="text-xs bg-background/50 p-4 rounded-lg overflow-x-auto whitespace-pre max-h-96">{manifest}</pre>
            </CardContent>
          </Card>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            AI Agent Skills Portal v2.0 — {INSTALLED_SKILLS.length} skills, {SKILL_COMBOS.length} stacks, {INTENT_DOMAINS.length} router commands, {ESCALATION_CHAINS.length} escalation chains
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built with Next.js 16 + shadcn/ui + Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  )
}
