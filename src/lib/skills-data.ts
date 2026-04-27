// ──────────────────────────────────────────────────────────
// SHARED DATA — Used by both Public Landing & Developer Portal
// ──────────────────────────────────────────────────────────

export interface Skill {
  name: string; category: string; description: string; source: string; installs: string; isNew?: boolean; healthScore: number
}
export interface SkillCombo {
  name: string; emoji: string; skills: string[]; tagline: string; useCase: string; synergy: string; whyChosen: string; benefitsVs: string; misconceptions: string
}
export interface TopSkill { rank: number; name: string; source: string; installs: string; category: string; isNew?: boolean }
export interface SkillOverlap { domain: string; skills: { name: string; approach: string; bestFor: string }[]; routing: string }
export interface SkillUpgrade { original: string; upgraded: string; newCapabilities: string; status: string }
export interface ErrorStandard { skill: string; errorTypes: { type: string; code: string; action: string }[] }
export interface IntentDomain { name: string; icon: string; keywords: string[]; stack: string; trigger: string; chain: string[]; color: string }
export interface EscalationChain { trigger: string; escalateTo: string; reason: string }
export interface Compatibility { type: 'synergy' | 'conflict'; skillA: string; skillB: string; reason: string }
export interface Dependency { skill: string; depends: string[]; reason: string }
export interface HealingRule { detect: string; repair: string; severity: 'critical' | 'warning' | 'info' }
export interface ROIData { stack: string; timeWithout: string; timeWith: string; qualityWithout: string; qualityWith: string; errorReduction: string }
export interface Playbook { name: string; emoji: string; description: string; chain: string[]; trigger: string; copyText: string; whyItWorks?: string }
export interface FAQItem { question: string; answer: string }

export const INSTALLED_SKILLS: Skill[] = [
  { name: "LLM", category: "AI/Media", description: "Large language model chat completions", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "TTS", category: "AI/Media", description: "Text-to-speech voice generation", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "ASR", category: "AI/Media", description: "Speech-to-text transcription", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "VLM", category: "AI/Media", description: "Vision-language model for image analysis", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "video-generation", category: "AI/Media", description: "AI-powered video generation from text/images", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "video-understand", category: "AI/Media", description: "Video content understanding and analysis", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "image-generation", category: "AI/Media", description: "AI image generation from text descriptions", source: "built-in", installs: "built-in", healthScore: 70 },
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
  { name: "frontend-design", category: "Design/UI", description: "Create distinctive, production-grade frontend interfaces avoiding AI slop", source: "anthropics/skills", installs: "342.1K", healthScore: 90 },
  { name: "ui-ux-pro-max", category: "Design/UI", description: "Comprehensive UI/UX design with data-driven stacks", source: "nextlevelbuilder", installs: "134.8K", healthScore: 80 },
  { name: "visual-design-foundations", category: "Design/UI", description: "Typography, color systems, spacing and iconography foundations", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "web-design-guidelines", category: "Design/UI", description: "Review UI code for Web Interface Guidelines compliance", source: "vercel-labs/agent-skills", installs: "280.8K", healthScore: 85 },
  { name: "gsap-animations", category: "Design/UI", description: "Professional web animations with GSAP — ScrollTrigger, Flip, MorphSVG", source: "xerxes-on/gsap", installs: "—", healthScore: 80 },
  { name: "web-shader-extractor", category: "Design/UI", description: "Extract WebGL/Canvas/Shader visual effects from web pages", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "image-understand", category: "Design/UI", description: "Vision-based AI analysis of images", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "image-edit", category: "Design/UI", description: "AI-powered image editing capabilities", source: "built-in", installs: "built-in", healthScore: 60 },
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
  { name: "web-search", category: "Research", description: "Web search for real-time information retrieval", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "web-reader", category: "Research", description: "Web page extraction with site crawling and spidering", source: "ai-skills-library", installs: "—", healthScore: 75 },
  { name: "deep-research", category: "Research", description: "Comprehensive multi-source research workflow", source: "built-in", installs: "built-in", healthScore: 85 },
  { name: "multi-search-engine", category: "Research", description: "Multi-engine web search aggregation", source: "built-in", installs: "built-in", healthScore: 60 },
  { name: "aminer-academic-search", category: "Research", description: "Academic paper and scholar search via AMiner API", source: "built-in", installs: "built-in", healthScore: 80 },
  { name: "aminer-daily-paper", category: "Research", description: "Personalized academic paper recommendations", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "aminer-open-academic", category: "Research", description: "Open academic data access via AMiner platform", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "ai-news-collectors", category: "Research", description: "AI news aggregation and collection", source: "built-in", installs: "built-in", healthScore: 55 },
  { name: "qingyan-research", category: "Research", description: "Qingyan research and analysis", source: "built-in", installs: "built-in", healthScore: 50 },
  { name: "finance", category: "Business", description: "Real-time and historical financial data analysis", source: "built-in", installs: "built-in", healthScore: 80 },
  { name: "stock-analysis-skill", category: "Business", description: "Stock market analysis with watchlist and rumor scanning", source: "built-in", installs: "built-in", healthScore: 70 },
  { name: "market-research-reports", category: "Business", description: "Generate market research reports with visualizations", source: "built-in", installs: "built-in", healthScore: 75 },
  { name: "jobs-to-be-done", category: "Business", description: "Jobs to Be Done product research methodology", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "gift-evaluator", category: "Business", description: "Gift evaluation and recommendation", source: "built-in", installs: "built-in", healthScore: 55 },
  { name: "get-fortune-analysis", category: "Business", description: "Fortune analysis and interpretation", source: "built-in", installs: "built-in", healthScore: 45 },
  { name: "auto-target-tracker", category: "Business", description: "Automatic target and goal tracking", source: "built-in", installs: "built-in", healthScore: 50 },
  { name: "deployment-manager", category: "DevOps", description: "Deploy, monitor, and update projects across Vercel/Netlify/GH Pages", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "supabase-postgres", category: "DevOps", description: "Postgres performance optimization from Supabase", source: "supabase/agent-skills", installs: "125.0K", healthScore: 85 },
  { name: "chain-of-thought", category: "Reasoning", description: "Step-by-step reasoning for decomposing complex problems", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "socratic-method", category: "Reasoning", description: "Guide users through strategic questioning to uncover assumptions", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "devils-advocate", category: "Reasoning", description: "Argue against premises to strengthen arguments and stress-test ideas", source: "ai-skills-library", installs: "—", healthScore: 80 },
  { name: "caveman", category: "Reasoning", description: "Ultra-compressed communication mode — cuts token usage ~75%", source: "juliusbrussee/caveman", installs: "84.7K", healthScore: 70 },
  { name: "context-compressor", category: "Reasoning", description: "Compress long contexts preserving decisions, actions, constraints", source: "ai-skills-library", installs: "—", healthScore: 75 },
  { name: "simulation-sandbox", category: "Reasoning", description: "Test scenarios in simulated environments before real execution", source: "ai-skills-library", installs: "—", healthScore: 75 },
  { name: "pdf", category: "Documents", description: "Create and manipulate PDF documents", source: "built-in", installs: "built-in", healthScore: 90 },
  { name: "docx", category: "Documents", description: "Create and edit Word documents", source: "built-in", installs: "built-in", healthScore: 90 },
  { name: "ppt", category: "Documents", description: "Create and edit PowerPoint presentations", source: "built-in", installs: "built-in", healthScore: 85 },
  { name: "xlsx", category: "Documents", description: "Create, edit, and analyze Excel spreadsheets", source: "built-in", installs: "built-in", healthScore: 90 },
  { name: "charts", category: "Documents", description: "Professional chart and diagram creation", source: "built-in", installs: "built-in", healthScore: 85 },
  { name: "agent-browser", category: "Browser", description: "Headless browser automation CLI for AI agents", source: "vercel-labs/agent-browser", installs: "216.3K", healthScore: 80 },
  { name: "browser-use", category: "Browser", description: "Natural language browser automation — no Playwright code needed", source: "skills.sh", installs: "—", isNew: true, healthScore: 95 },
  { name: "skill-creator", category: "Meta", description: "Create, modify, and benchmark AI agent skills", source: "built-in", installs: "170.0K", healthScore: 85 },
  { name: "skill-vetter", category: "Meta", description: "Security-first skill vetting for AI agents", source: "built-in", installs: "built-in", healthScore: 80 },
  { name: "skill-finder-cn", category: "Meta", description: "Chinese-language skill discovery and search", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "output-formatter", category: "Meta", description: "Strict formatting rules for JSON, tables, markdown, code", source: "ai-skills-library", installs: "—", healthScore: 75 },
  { name: "skill-router", category: "Meta", description: "Intent-to-stack meta-skill — auto-selects the right skill combination", source: "built-in", installs: "built-in", isNew: true, healthScore: 95 },
  { name: "explained-code", category: "Education", description: "Beginner-friendly code explanation with analogies and diagrams", source: "ai-skills-library", installs: "—", healthScore: 70 },
  { name: "interview-designer", category: "Specialty", description: "Design user research interview guides", source: "built-in", installs: "built-in", healthScore: 65 },
  { name: "storyboard-manager", category: "Specialty", description: "Story structure and character development management", source: "built-in", installs: "built-in", healthScore: 60 },
  { name: "photography-ai", category: "Specialty", description: "Professional visual engineering framework for photography", source: "ai-skills-library", installs: "—", healthScore: 75 },
  { name: "dream-interpreter", category: "Specialty", description: "Dream interpretation and analysis", source: "built-in", installs: "built-in", healthScore: 50 },
  { name: "mindfulness-meditation", category: "Specialty", description: "Mindfulness and meditation guidance", source: "built-in", installs: "built-in", healthScore: 45 },
  { name: "anti-pua", category: "Specialty", description: "Anti-manipulation and critical thinking", source: "built-in", installs: "built-in", healthScore: 55 },
]

export const SKILL_COMBOS: SkillCombo[] = [
  { name: "Frontend Stack", emoji: "🎨", skills: ["frontend-design", "react-best-practices", "composition-patterns", "shadcn", "web-design-guidelines"], tagline: "Architecture → Structure → Components → Quality Gate", useCase: "Building production-grade React UIs with distinctive design", synergy: "frontend-design sets the aesthetic vision, react-best-practices prevents performance pitfalls, composition-patterns ensures scalable architecture, shadcn provides battle-tested components, web-design-guidelines is the quality gate.", whyChosen: "Each skill addresses a distinct layer of frontend quality: frontend-design solves the aesthetic problem (no AI slop), react-best-practices solves the performance problem, composition-patterns solves the architecture problem, shadcn solves the speed problem, web-design-guidelines solves the compliance problem.", benefitsVs: "WITHOUT: AI-generic design, performance issues late, components don't scale, build UI from scratch. WITH: Distinctive design, performance baked in, scalable architecture, proven components, quality gated.", misconceptions: "'I just need react-best-practices for good UI.' Reality: Performance rules ≠ distinctive design. Solution: Pair frontend-design WITH react-best-practices." },
  { name: "Ship It Stack", emoji: "🚀", skills: ["chain-of-thought", "fullstack-dev", "shadcn", "supabase-postgres", "deployment-manager"], tagline: "Think → Build → Component → Persist → Deploy", useCase: "From idea to deployed product in one session", synergy: "chain-of-thought decomposes, fullstack-dev scaffolds, shadcn gives instant UI, supabase-postgres handles data, deployment-manager ships it.", whyChosen: "Mirrors the actual shipping process: think, build, add UI, persist, deploy. Each skill is a phase gate.", benefitsVs: "WITHOUT: Jump to coding, hit architecture problems, spend hours on UI, manual deploy. WITH: Decompose first, scaffold with confidence, instant UI, DB best practices, one-command ship.", misconceptions: "'I can skip thinking and just build.' Reality: You build the wrong thing fast. Solution: 5 min thinking saves 5 hrs refactoring." },
  { name: "Research Stack", emoji: "🔬", skills: ["deep-research", "web-search", "web-reader", "context-compressor"], tagline: "Search → Read → Distill → Compress", useCase: "Deep research from question to compressed briefing", synergy: "deep-research orchestrates, web-search finds data, web-reader extracts, context-compressor prevents overflow.", whyChosen: "Research fails at the token wall. This stack prevents overflow while preserving key decisions.", benefitsVs: "WITHOUT: Search manually, copy-paste, lose sources, overflow context. WITH: Orchestrated investigation, auto-extraction, compressed findings.", misconceptions: "'deep-research is enough alone.' Reality: Without context-compressor you overflow at ~8 sources. Solution: Run the full pipeline." },
  { name: "Content Engine", emoji: "✍️", skills: ["seo-geo", "seo-content-writer", "web-search", "output-formatter"], tagline: "Optimize → Write → Verify → Format", useCase: "Content that ranks in Google AND gets cited by AI", synergy: "seo-geo targets both engines, seo-content-writer produces, web-search verifies, output-formatter structures.", whyChosen: "Content that ranks requires optimization, quality writing, verification, and consistent formatting.", benefitsVs: "WITHOUT: Write by feel, hope it ranks, never verify. WITH: Optimized for Google AND AI, claims verified, consistent formatting.", misconceptions: "'SEO is enough.' Reality: GEO gets you cited by ChatGPT/Perplexity. Solution: Optimize for both engines." },
  { name: "Reasoning Stack", emoji: "🧠", skills: ["chain-of-thought", "devils-advocate", "simulation-sandbox"], tagline: "Think → Challenge → Verify", useCase: "Rigorous decision-making with stress-testing", synergy: "chain-of-thought decomposes, devils-advocate attacks, simulation-sandbox verifies.", whyChosen: "Good decisions require three passes: decompose, challenge, verify. Skip any and you get confident but wrong.", benefitsVs: "WITHOUT: Reason once, trust first conclusion, discover flaws after committing. WITH: Decomposed, attacked, verified. Catch 80% of errors before they matter.", misconceptions: "'Devils-advocate is just being negative.' Reality: Returns a STRONGER argument. Solution: Frame as 'make it bulletproof.'" },
  { name: "Design & Deliver", emoji: "💎", skills: ["frontend-design", "gsap-animations", "shadcn", "fullstack-dev", "deployment-manager"], tagline: "Design → Animate → Build → Ship", useCase: "From mockup to live site with premium interactions", synergy: "frontend-design sets direction, gsap-animations adds feel, shadcn provides components, fullstack-dev builds, deployment-manager ships.", whyChosen: "Design without delivery is a mockup. Each skill transforms output closer to production.", benefitsVs: "WITHOUT: Beautiful mockups that never ship. WITH: Vision → prototype → product → live site.", misconceptions: "'Animations are cosmetic.' Reality: GSAP interactions define UX. Retrofitting is 3x harder. Solution: Design interactions alongside UI." },
  { name: "Data Pipeline", emoji: "📊", skills: ["xlsx", "charts", "finance", "context-compressor"], tagline: "Import → Visualize → Analyze → Distill", useCase: "Financial and data analysis from raw numbers to insights", synergy: "xlsx processes, charts visualizes, finance provides data, context-compressor distills.", whyChosen: "Four failure modes: can't import, can't visualize, no data, too much noise. Each skill removes one.", benefitsVs: "WITHOUT: Manual import, hand-drawn charts, separate data lookup, information overload. WITH: Auto-import, pro charts, real-time data, distilled insights.", misconceptions: "'I just need Excel.' Reality: Excel without charts is numbers. Charts without compression is overload. Solution: Visualize then distill." },
  { name: "Education Stack", emoji: "📚", skills: ["explained-code", "socratic-method", "output-formatter", "pdf"], tagline: "Explain → Guide → Format → Distribute", useCase: "Teaching that actually lands", synergy: "explained-code breaks down, socratic-method guides discovery, output-formatter structures, pdf distributes.", whyChosen: "Teaching fails when it explains but doesn't guide. Socratic turns passive into active learning.", benefitsVs: "WITHOUT: Explain once, students nod, 20% retention. WITH: Analogies + discovery, 80% retention.", misconceptions: "'Good explanations are enough.' Reality: Passive = 20% retention. Socratic = 80%. Solution: Pair explanation with guided discovery." },
  { name: "DevOps Stack", emoji: "⚙️", skills: ["deployment-manager", "mcp-builder", "skill-creator", "skill-scanner"], tagline: "Build → Connect → Extend → Secure", useCase: "Infrastructure, integrations, and skill lifecycle", synergy: "deployment-manager ships, mcp-builder connects, skill-creator extends, skill-scanner secures.", whyChosen: "Four infrastructure needs: deploy, integrate, extend, secure. Each skill is a different lifecycle phase.", benefitsVs: "WITHOUT: Manual deploy, integrations from scratch, no security scanning. WITH: Health-check deploy, MCP patterns, systematic creation, full security.", misconceptions: "'skill-scanner is only for third-party.' Reality: Your own skills develop issues too. Solution: Scan all periodically." },
  { name: "Product Launch", emoji: "🚀", skills: ["superpowers", "frontend-design", "react-best-practices", "browser-use", "deployment-manager", "social-media-manager", "humanizer"], tagline: "Spec → Design → Build → QA → Ship → Market → Polish", useCase: "Full product lifecycle from spec to market", synergy: "superpowers specs, frontend-design designs, react-best-practices audits, browser-use QAs, deployment-manager ships, social-media-manager announces, humanizer polishes.", whyChosen: "Seven capabilities: spec, design, performance, QA, deploy, marketing, polish. Each is a phase gate.", benefitsVs: "WITHOUT: No spec, generic design, manual deploy, AI-sounding copy. WITH: Spec'd, tested, deployed, marketed, humanized.", misconceptions: "'I can launch without QA.' Reality: browser-use catches 40% of bugs manual testing misses. Solution: QA before deploy." },
  { name: "Content Machine", emoji: "📝", skills: ["content-strategy", "seo-content-writer", "gumroad-pipeline", "social-media-manager", "humanizer"], tagline: "Plan → Write → Monetize → Distribute → Polish", useCase: "End-to-end content that ranks, converts, sounds human", synergy: "content-strategy plans, seo-content-writer writes, gumroad-pipeline monetizes, social-media-manager distributes, humanizer polishes.", whyChosen: "Five gaps: no plan, poor SEO, no monetization, limited distribution, AI-sounding copy.", benefitsVs: "WITHOUT: Random posts, no SEO, no monetization, AI-sounding. WITH: Planned, optimized, monetized, distributed, humanized.", misconceptions: "'Humanizer is optional.' Reality: No prompt reliably strips AI patterns. Solution: Always run humanizer as final gate." },
  { name: "Web Scraping", emoji: "🕷️", skills: ["browser-use", "web-reader", "contentanalysis", "xlsx"], tagline: "Browse → Extract → Analyze → Tabulate", useCase: "Data extraction from web to structured spreadsheet", synergy: "browser-use navigates, web-reader extracts, contentanalysis distills, xlsx structures.", whyChosen: "Four stages: navigation, extraction, analysis, structuring. Each transforms raw pages into useful data.", benefitsVs: "WITHOUT: Manual browsing, copy-paste, hand formatting. WITH: Auto-navigation, programmatic extraction, structured results.", misconceptions: "'web-reader alone is enough.' Reality: Can't interact with dynamic pages. Solution: Pair browser-use + web-reader." },
  { name: "Creative Studio", emoji: "🎬", skills: ["brainstorming", "storyboard-manager", "image-generation", "gsap-animations"], tagline: "Ideate → Storyboard → Create → Animate", useCase: "Creative projects from idea to animated visual", synergy: "brainstorming develops concepts, storyboard-manager structures, image-generation creates, gsap-animations brings to life.", whyChosen: "Creative projects fail at ideation-execution handoff. Each skill bridges the gap.", benefitsVs: "WITHOUT: Ideas stay ideas, nothing moves. WITH: Concept → narrative → visual → animation.", misconceptions: "'Brainstorming is just freewriting.' Reality: Structured brainstorming produces 3x more viable concepts. Solution: Use structured ideation." },
  { name: "Automation Stack", emoji: "🤖", skills: ["browser-use", "web-reader", "contentanalysis", "xlsx"], tagline: "Navigate → Extract → Analyze → Structure", useCase: "Automated data extraction from web to structured data", synergy: "browser-use navigates, web-reader extracts, contentanalysis distills, xlsx structures.", whyChosen: "Automation requires navigation, extraction, analysis, structured output. Each skill handles one layer.", benefitsVs: "WITHOUT: 4 hours manual work. WITH: 15 minutes automated.", misconceptions: "'Automation is only for repetitive tasks.' Reality: Even one-time extraction benefits. Solution: Use pipeline for any extraction." },
  { name: "Full Stack Mobile", emoji: "📱", skills: ["react-native-skills", "frontend-design", "composition-patterns", "supabase-postgres"], tagline: "Mobile → Design → Architecture → Persist", useCase: "Complete mobile app from UI to database", synergy: "react-native-skills optimizes, frontend-design designs, composition-patterns structures, supabase-postgres persists.", whyChosen: "Four needs: platform expertise, distinctive design, scalable architecture, reliable data.", benefitsVs: "WITHOUT: Platform bugs, generic UI, unmaintainable code. WITH: Optimized, distinctive, scalable, performant.", misconceptions: "'Mobile is just web on smaller screen.' Reality: Unique constraints: touch, offline, app stores. Solution: Use mobile-specific skills." },
  { name: "Academic Publisher", emoji: "📜", skills: ["aminer-academic-search", "deep-research", "pdf", "docx"], tagline: "Discover → Synthesize → Format → Publish", useCase: "Academic research from discovery to publication", synergy: "aminer-academic-search finds, deep-research synthesizes, pdf/docx formats.", whyChosen: "Academic work requires discovery, synthesis, formatting, distribution.", benefitsVs: "WITHOUT: Manual search, copy-paste citations, hand-formatting. WITH: Structured APIs, auto-synthesis, publication-ready output.", misconceptions: "'Google Scholar is sufficient.' Reality: AMiner provides citation graphs, impact factors. Solution: Use academic-specific search." },
  { name: "Market Intelligence", emoji: "📈", skills: ["finance", "deep-research", "market-research-reports", "charts", "pdf"], tagline: "Data → Research → Report → Visualize → Deliver", useCase: "Financial market analysis from data to report", synergy: "finance provides data, deep-research adds context, market-research-reports structures, charts visualizes, pdf delivers.", whyChosen: "Five layers: raw data, context, structure, visualization, delivery.", benefitsVs: "WITHOUT: Prices without context, unstructured notes. WITH: Contextualized, structured, visualized, delivered.", misconceptions: "'Finance skill is only for trading.' Reality: Essential context for any market decision. Solution: Use as data layer." },
  { name: "API Builder", emoji: "🔧", skills: ["superpowers", "mcp-builder", "coding-agent", "deployment-manager"], tagline: "Spec → Build MCP → Execute → Deploy", useCase: "Build and ship MCP servers and API integrations", synergy: "superpowers specs, mcp-builder builds, coding-agent implements, deployment-manager ships.", whyChosen: "Four API lifecycle phases: spec, build, implement, deploy.", benefitsVs: "WITHOUT: No specs, scratch integrations, manual deploy. WITH: Spec-first, MCP patterns, verified implementation, health-check deploy.", misconceptions: "'MCP is just another API format.' Reality: Standard for AI agent integrations. Solution: Use mcp-builder for AI-facing integrations." },
  { name: "Brand Builder", emoji: "🌞", skills: ["brainstorming", "content-strategy", "seo-geo", "social-media-manager", "humanizer"], tagline: "Ideate → Plan → Optimize → Execute → Polish", useCase: "Build brand presence from scratch across channels", synergy: "brainstorming develops identity, content-strategy plans, seo-geo optimizes, social-media-manager executes, humanizer polishes.", whyChosen: "Brand needs: ideation, planning, optimization, execution, polish.", benefitsVs: "WITHOUT: Random posts, no strategy, AI-sounding. WITH: Structured identity, planned content, multi-platform, authentic.", misconceptions: "'Brand is just a logo.' Reality: Voice + content + presence + tone. Solution: Develop brand as a system." },
  { name: "Data Journalist", emoji: "📰", skills: ["web-search", "web-reader", "xlsx", "charts", "docx"], tagline: "Find → Extract → Structure → Visualize → Publish", useCase: "Data-driven journalism from source to story", synergy: "web-search finds, web-reader extracts, xlsx structures, charts visualizes, docx publishes.", whyChosen: "Five phases: sourcing, extraction, structuring, visualization, publication.", benefitsVs: "WITHOUT: Manual sourcing, copy by hand, separate charts. WITH: Auto-sourced, structured, visualized, publication-ready.", misconceptions: "'Journalism doesn't need data tools.' Reality: Pulitzer for data journalism 8 of last 10 years. Solution: Structure data before writing." },
  { name: "Startup MVP", emoji: "🔥", skills: ["superpowers", "fullstack-dev", "shadcn", "supabase-postgres", "deployment-manager", "humanizer"], tagline: "Spec → Build → UI → Data → Ship → Polish", useCase: "MVP from idea to live in one session", synergy: "superpowers specs, fullstack-dev builds, shadcn gives UI, supabase-postgres handles data, deployment-manager ships, humanizer polishes.", whyChosen: "Minimum stack for idea-to-live: spec, build, UI, data, deploy, polish.", benefitsVs: "WITHOUT: Weeks on architecture, manual deploy, AI-sounding copy. WITH: 30 min spec, 1 hr scaffold, instant UI, one-command deploy, human copy.", misconceptions: "'MVP means skipping quality.' Reality: MVP = minimum FEATURES, not minimum QUALITY. Solution: Ship few features, but ship them well." },
  { name: "Creative Suite", emoji: "🎭", skills: ["image-generation", "gsap-animations", "charts", "web-artifacts-builder"], tagline: "Create → Animate → Visualize → Package", useCase: "Rich creative output from images to interactive demos", synergy: "image-generation creates, gsap-animations animates, charts adds data viz, web-artifacts-builder packages.", whyChosen: "Four creative phases: generation, motion, visualization, packaging.", benefitsVs: "WITHOUT: Static images, no motion, loose files. WITH: Animated, data-enriched, packaged artifacts.", misconceptions: "'Image generation IS the creative work.' Reality: Static images have 10% impact. Solution: Animate, contextualize, package." },
  { name: "Mobile Stack", emoji: "📱", skills: ["react-native-skills", "frontend-design", "composition-patterns"], tagline: "Mobile-first → Design → Architecture", useCase: "Performant React Native/Expo mobile apps", synergy: "react-native-skills optimizes, frontend-design designs, composition-patterns structures.", whyChosen: "Three failure modes: poor performance, generic design, unmaintainable architecture.", benefitsVs: "WITHOUT: Lags on older devices, looks generic, unmaintainable. WITH: Optimized, distinctive, scalable.", misconceptions: "'RN performance is fine out of the box.' Reality: 15+ common traps. Solution: Always run performance rules." },
  { name: "Academic Stack", emoji: "🎓", skills: ["aminer-academic-search", "aminer-daily-paper", "deep-research", "pdf"], tagline: "Discover → Track → Analyze → Publish", useCase: "Academic research from paper discovery to publication", synergy: "aminer finds papers, aminer-daily-paper tracks, deep-research synthesizes, pdf outputs.", whyChosen: "Discovery, tracking, synthesis, publication — complete academic workflow.", benefitsVs: "WITHOUT: Manual search, copy-paste citations. WITH: Structured APIs, auto-synthesis, formatted output.", misconceptions: "'Google Scholar is sufficient.' Reality: AMiner provides citation graphs. Solution: Use AMiner for discovery." },
]

export const PLAYBOOKS: Playbook[] = [
  { name: "Bulletproof Quality", emoji: "🛡️", description: "Stress-test any output until it's unbreakable", chain: ["chain-of-thought", "devils-advocate", "simulation-sandbox", "output-formatter"], trigger: "/bulletproof", copyText: "Run: chain-of-thought → devils-advocate → simulation-sandbox → output-formatter", whyItWorks: "Three-pass rigor: decompose the problem, attack every assumption, verify in simulation. The formatter ensures the output is structured and actionable." },
  { name: "Zero-Trace Content", emoji: "👻", description: "Produce content that no AI detector can flag", chain: ["content-strategy", "seo-content-writer", "humanizer", "social-media-manager"], trigger: "/zerotrace", copyText: "Run: content-strategy → seo-content-writer → humanizer → social-media-manager", whyItWorks: "Strategy ensures purpose, writer produces the draft, humanizer strips every AI pattern (hedging, repetition, formulaic structure), social manager distributes with brand voice." },
  { name: "Full Recon", emoji: "🔍", description: "Deep-dive any topic from 360 degrees", chain: ["deep-research", "web-search", "web-reader", "context-compressor", "output-formatter"], trigger: "/recon", copyText: "Run: deep-research → web-search → web-reader → context-compressor → output-formatter", whyItWorks: "Orchestrated research finds 10x more sources, reader extracts key data, compressor prevents token overflow, formatter structures the briefing for immediate action." },
  { name: "Ship Fast", emoji: "⚡", description: "Idea to live URL in under an hour", chain: ["superpowers", "fullstack-dev", "shadcn", "deployment-manager"], trigger: "/shipfast", copyText: "Run: superpowers → fullstack-dev → shadcn → deployment-manager", whyItWorks: "Spec-first prevents building the wrong thing. Fullstack scaffolds in minutes. shadcn gives instant UI. Deploy ships it. 5 min thinking saves 5 hrs refactoring." },
  { name: "Design Audit", emoji: "👁️", description: "Tear down any UI and rebuild it premium", chain: ["web-design-guidelines", "frontend-design", "gsap-animations", "react-best-practices"], trigger: "/designaudit", copyText: "Run: web-design-guidelines → frontend-design → gsap-animations → react-best-practices", whyItWorks: "Guidelines check compliance first, design rebuilds with taste, animations add feel, performance rules ensure it actually runs well." },
  { name: "Content Flip", emoji: "🔄", description: "Take existing content and make it rank + convert", chain: ["contentanalysis", "seo-geo", "seo-content-writer", "gumroad-pipeline", "humanizer"], trigger: "/contentflip", copyText: "Run: contentanalysis → seo-geo → seo-content-writer → gumroad-pipeline → humanizer", whyItWorks: "Analyze what you have, optimize for both Google and AI engines, rewrite with SEO, add monetization, polish to sound human." },
  { name: "Security Sweep", emoji: "🔒", description: "Vet every skill before it touches your system", chain: ["skill-vetter", "skill-scanner", "devils-advocate", "output-formatter"], trigger: "/securitysweep", copyText: "Run: skill-vetter → skill-scanner → devils-advocate → output-formatter", whyItWorks: "Quick vet first, deep 8-phase scan second, devil's advocate stress-tests the findings, formatter produces the security report." },
  { name: "Data Harvest", emoji: "🌾", description: "Extract structured data from any web source", chain: ["browser-use", "web-reader", "contentanalysis", "xlsx", "charts"], trigger: "/harvest", copyText: "Run: browser-use → web-reader → contentanalysis → xlsx → charts", whyItWorks: "Browser navigates dynamic pages, reader extracts content, analysis distills key data, spreadsheet structures it, charts visualize the patterns." },
  { name: "Greenfield", emoji: "🏗️", description: "Start a new project with spec-first architecture", chain: ["brainstorming", "superpowers", "frontend-design", "fullstack-dev", "deployment-manager"], trigger: "/greenfield", copyText: "Run: brainstorming → superpowers → frontend-design → fullstack-dev → deployment-manager", whyItWorks: "Ideate first, then spec, then design the vision, scaffold the app, and ship it. Each step builds on the previous — no jumping ahead." },
  { name: "Decision Engine", emoji: "⚖️", description: "Make any decision with 3-pass rigor", chain: ["chain-of-thought", "socratic-method", "devils-advocate", "simulation-sandbox"], trigger: "/decide", copyText: "Run: chain-of-thought → socratic-method → devils-advocate → simulation-sandbox", whyItWorks: "Decompose the decision, question every assumption through Socratic dialogue, attack the strongest option, simulate outcomes. 80% of wrong decisions caught before committing." },
  { name: "Brand Launch", emoji: "🎯", description: "Launch a brand identity from zero to multi-platform", chain: ["brainstorming", "content-strategy", "seo-geo", "social-media-manager", "humanizer"], trigger: "/brandlaunch", copyText: "Run: brainstorming → content-strategy → seo-geo → social-media-manager → humanizer", whyItWorks: "Develop the identity, plan the content calendar, optimize for discovery, execute across platforms, polish every word to sound authentic." },
  { name: "Monetize It", emoji: "💰", description: "Turn any content into a revenue product", chain: ["content-strategy", "seo-content-writer", "gumroad-pipeline", "humanizer"], trigger: "/monetize", copyText: "Run: content-strategy → seo-content-writer → gumroad-pipeline → humanizer", whyItWorks: "Strategy identifies the market, writer produces the product, pipeline sets up pricing + landing page + email sequence, humanizer makes it convert." },
  { name: "Idea Validator", emoji: "🔮", description: "Test any idea through structured ideation, reasoning, challenge, and simulation before committing resources", chain: ["brainstorming", "chain-of-thought", "devils-advocate", "simulation-sandbox"], trigger: "/validate", copyText: "Run: brainstorming → chain-of-thought → devils-advocate → simulation-sandbox", whyItWorks: "Ideate multiple variations, reason through each systematically, attack the weakest assumptions, simulate real-world conditions. Kills bad ideas fast, strengthens good ones." },
  { name: "API Architect", emoji: "🏛️", description: "Design, build, implement, and deploy API integrations with spec-first architecture", chain: ["superpowers", "mcp-builder", "coding-agent", "deployment-manager"], trigger: "/apibuild", copyText: "Run: superpowers → mcp-builder → coding-agent → deployment-manager", whyItWorks: "Spec the API contract first, build the MCP server with patterns, implement with autonomous coding, deploy with health checks. Spec-first catches 60% of API design errors." },
  { name: "Visual Story", emoji: "🎨", description: "Create animated visual narratives from concept to packaged artifact", chain: ["image-generation", "gsap-animations", "web-artifacts-builder"], trigger: "/visualstory", copyText: "Run: image-generation → gsap-animations → web-artifacts-builder", whyItWorks: "Generate the visual assets, add scroll-triggered animations and motion, package as a standalone artifact. Static images have 10% impact — animation and packaging multiply it." },
  { name: "Market Scout", emoji: "🧭", description: "Comprehensive market analysis from real-time data to publication-ready report", chain: ["finance", "deep-research", "market-research-reports", "charts", "pdf"], trigger: "/scout", copyText: "Run: finance → deep-research → market-research-reports → charts → pdf", whyItWorks: "Pull real-time financial data, add context through deep research, structure as a professional report, visualize key trends, deliver as publication-ready PDF." },
]

export const INTENT_DOMAINS: IntentDomain[] = [
  { name: "BUILD", icon: "🏗️", keywords: ["build","create","make","develop","ship","launch"], stack: "Product Launch", trigger: "/launch", chain: ["superpowers","frontend-design","react-best-practices","browser-use","deployment-manager","social-media-manager","humanizer"], color: "amber" },
  { name: "WRITE", icon: "✍️", keywords: ["write","content","blog","article","copy","email"], stack: "Content Machine", trigger: "/content", chain: ["content-strategy","seo-content-writer","gumroad-pipeline","social-media-manager","humanizer"], color: "orange" },
  { name: "RESEARCH", icon: "🔬", keywords: ["research","investigate","find out","analyze","what is"], stack: "Research Stack", trigger: "/research", chain: ["deep-research","web-reader","context-compressor","output-formatter","pdf"], color: "cyan" },
  { name: "DESIGN", icon: "💎", keywords: ["design","mockup","UI","interface","prototype"], stack: "Design & Deliver", trigger: "/design", chain: ["brainstorming","frontend-design","gsap-animations","fullstack-dev","deployment-manager"], color: "pink" },
  { name: "DECIDE", icon: "⚖️", keywords: ["should we","which option","compare","decide","evaluate"], stack: "Reasoning Stack", trigger: "/decide", chain: ["chain-of-thought","devils-advocate","simulation-sandbox","output-formatter"], color: "emerald" },
  { name: "DATA", icon: "📊", keywords: ["data","spreadsheet","chart","financial","report"], stack: "Data Pipeline", trigger: "/data", chain: ["finance","xlsx","charts","context-compressor","pdf"], color: "teal" },
  { name: "LEARN", icon: "📚", keywords: ["explain","teach","how does","understand","learn"], stack: "Education Stack", trigger: "/learn", chain: ["explained-code","socratic-method","output-formatter","pdf"], color: "lime" },
  { name: "AUTOMATE", icon: "🤖", keywords: ["automate","scrape","extract","monitor","track"], stack: "Automation Stack", trigger: "/automate", chain: ["browser-use","web-reader","contentanalysis","xlsx"], color: "fuchsia" },
]

export const ESCALATION_CHAINS: EscalationChain[] = [
  { trigger: "superpowers.SpecMissingError", escalateTo: "brainstorming", reason: "No spec → ideate first" },
  { trigger: "browser-use.PageLoadTimeoutError", escalateTo: "web-reader", reason: "Browser stuck → direct extraction" },
  { trigger: "seo-content-writer.EmptyInputError", escalateTo: "content-strategy", reason: "No brief → generate from strategy" },
  { trigger: "deployment-manager.DeployCheckFailedError", escalateTo: "coding-agent", reason: "Deploy fails → auto-fix code" },
  { trigger: "humanizer.CodeCorruptionError", escalateTo: "coding-agent", reason: "Humanizer broke code → restore" },
  { trigger: "social-media manager.MissingPersonaError", escalateTo: "content-strategy", reason: "No audience → derive from strategy" },
  { trigger: "deep-research.SourceExhaustedError", escalateTo: "multi-search-engine", reason: "Primary empty → multi-engine" },
  { trigger: "context-compressor.TokenOverflowError", escalateTo: "caveman", reason: "Still too long → ultra-compress" },
  { trigger: "charts.RenderingError", escalateTo: "output-formatter", reason: "Chart fails → formatted table" },
  { trigger: "finance.APIRateLimitError", escalateTo: "web-search", reason: "API limited → cached data" },
  { trigger: "gumroad-pipeline.NoProductError", escalateTo: "brainstorming", reason: "No product → ideate concepts" },
  { trigger: "skill-router.ChainBreakError", escalateTo: "superpowers", reason: "Chain broke → re-architect" },
]

export const COMPATIBILITY: Compatibility[] = [
  { type: 'synergy', skillA: 'superpowers', skillB: 'coding-agent', reason: 'Spec then execute' },
  { type: 'synergy', skillA: 'frontend-design', skillB: 'gsap-animations', reason: 'Design vision → premium interactions' },
  { type: 'synergy', skillA: 'seo-content-writer', skillB: 'humanizer', reason: 'Write then de-AI' },
  { type: 'synergy', skillA: 'content-strategy', skillB: 'social-media-manager', reason: 'Plan then execute' },
  { type: 'synergy', skillA: 'deep-research', skillB: 'context-compressor', reason: 'Research without overflow' },
  { type: 'synergy', skillA: 'browser-use', skillB: 'web-reader', reason: 'Navigate then extract' },
  { type: 'synergy', skillA: 'shadcn', skillB: 'react-best-practices', reason: 'Components + performance' },
  { type: 'synergy', skillA: 'chain-of-thought', skillB: 'devils-advocate', reason: 'Think then challenge' },
  { type: 'synergy', skillA: 'fullstack-dev', skillB: 'deployment-manager', reason: 'Build then ship' },
  { type: 'synergy', skillA: 'finance', skillB: 'charts', reason: 'Data → visualize' },
  { type: 'synergy', skillA: 'pdf', skillB: 'docx', reason: 'PDF for sharing, DOCX for editing' },
  { type: 'synergy', skillA: 'xlsx', skillB: 'charts', reason: 'Structure → visualize' },
  { type: 'synergy', skillA: 'skill-creator', skillB: 'skill-scanner', reason: 'Build then secure' },
  { type: 'synergy', skillA: 'supabase-postgres', skillB: 'fullstack-dev', reason: 'DB optimization + app scaffold' },
  { type: 'synergy', skillA: 'react-native-skills', skillB: 'frontend-design', reason: 'Mobile expertise + distinctive UI' },
  { type: 'synergy', skillA: 'seo-geo', skillB: 'social-media-manager', reason: 'AI visibility + distribution' },
  { type: 'synergy', skillA: 'gumroad-pipeline', skillB: 'humanizer', reason: 'Monetize then polish' },
  { type: 'synergy', skillA: 'brainstorming', skillB: 'superpowers', reason: 'Ideate then architect' },
  { type: 'synergy', skillA: 'socratic-method', skillB: 'explained-code', reason: 'Guide discovery + explain' },
  { type: 'conflict', skillA: 'caveman', skillB: 'humanizer', reason: 'Compress vs expand — opposing goals' },
  { type: 'conflict', skillA: 'agent-browser', skillB: 'browser-use', reason: 'Same domain, different paradigms — pick one' },
  { type: 'conflict', skillA: 'marketing-mode', skillB: 'socratic-method', reason: 'Persuade vs question — contradictory tone' },
  { type: 'conflict', skillA: 'dream-interpreter', skillB: 'devils-advocate', reason: 'Subjective vs objective — incompatible' },
  { type: 'conflict', skillA: 'skill-finder-cn', skillB: 'find-skills', reason: 'Duplicate discovery — use one per language' },
]

export const DEPENDENCIES: Dependency[] = [
  { skill: "superpowers", depends: ["brainstorming", "coding-agent"], reason: "Delegates ideation and execution" },
  { skill: "deployment-manager", depends: ["fullstack-dev"], reason: "Deploys fullstack builds" },
  { skill: "humanizer", depends: ["seo-content-writer", "blog-writer"], reason: "Humanizes writing output" },
  { skill: "social-media-manager", depends: ["content-strategy"], reason: "Executes content strategy" },
  { skill: "context-compressor", depends: ["deep-research", "web-reader"], reason: "Compresses research output" },
  { skill: "charts", depends: ["xlsx", "finance"], reason: "Visualizes structured data" },
  { skill: "pdf", depends: ["output-formatter"], reason: "Formats before PDF generation" },
  { skill: "gumroad-pipeline", depends: ["content-strategy", "seo-content-writer"], reason: "Monetizes writing pipeline" },
  { skill: "browser-use", depends: ["web-reader"], reason: "Navigation → extraction pipeline" },
  { skill: "skill-scanner", depends: ["skill-vetter"], reason: "Deep scan after initial vetting" },
]

export const HEALING_RULES: HealingRule[] = [
  { detect: "SKILL.md missing Context section", repair: "Run skill-creator to regenerate", severity: "critical" },
  { detect: "Skill not in any stack", repair: "Evaluate for stack inclusion or mark standalone", severity: "warning" },
  { detect: "Handoff chain broken link", repair: "Install missing skill or reroute chain", severity: "critical" },
  { detect: "Health score below 50", repair: "Audit with skill-creator, add error handling", severity: "warning" },
  { detect: "Duplicate skills in same domain", repair: "Merge or define routing rules", severity: "info" },
  { detect: "Error code references missing skill", repair: "Update escalation chain", severity: "critical" },
  { detect: "Stack missing quality gate", repair: "Add humanizer or browser-use as final step", severity: "warning" },
  { detect: "Dependency cycle detected", repair: "Extract shared logic to new skill", severity: "critical" },
]

export const ROI_DATA: ROIData[] = [
  { stack: "Product Launch", timeWithout: "40 hrs", timeWith: "6 hrs", qualityWithout: "60%", qualityWith: "95%", errorReduction: "75%" },
  { stack: "Content Machine", timeWithout: "20 hrs", timeWith: "3 hrs", qualityWithout: "55%", qualityWith: "92%", errorReduction: "80%" },
  { stack: "Research Pipeline", timeWithout: "15 hrs", timeWith: "2 hrs", qualityWithout: "50%", qualityWith: "90%", errorReduction: "70%" },
  { stack: "Automation", timeWithout: "8 hrs", timeWith: "0.5 hrs", qualityWithout: "45%", qualityWith: "88%", errorReduction: "82%" },
  { stack: "Frontend Stack", timeWithout: "30 hrs", timeWith: "5 hrs", qualityWithout: "55%", qualityWith: "94%", errorReduction: "78%" },
  { stack: "Startup MVP", timeWithout: "35 hrs", timeWith: "4 hrs", qualityWithout: "55%", qualityWith: "92%", errorReduction: "76%" },
  { stack: "Brand Builder", timeWithout: "25 hrs", timeWith: "4 hrs", qualityWithout: "50%", qualityWith: "90%", errorReduction: "75%" },
  { stack: "Design & Deliver", timeWithout: "25 hrs", timeWith: "5 hrs", qualityWithout: "65%", qualityWith: "93%", errorReduction: "72%" },
]

export const TOP_SKILLS: TopSkill[] = [
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
  { rank: 11, name: "browser-use", source: "skills.sh", installs: "—", category: "Browser", isNew: true },
  { rank: 12, name: "superpowers", source: "skills.sh", installs: "—", category: "Development", isNew: true },
  { rank: 13, name: "skill-router", source: "built-in", installs: "built-in", category: "Meta", isNew: true },
]

export const SKILL_OVERLAPS: SkillOverlap[] = [
  { domain: "Browser Automation", skills: [{ name: "agent-browser", approach: "CLI", bestFor: "Scripted automation" }, { name: "browser-use", approach: "Natural language", bestFor: "Ad-hoc queries" }], routing: "agent-browser for scripts; browser-use for one-offs" },
  { domain: "Project Orchestration", skills: [{ name: "superpowers", approach: "Spec-first", bestFor: "Greenfield architecture" }, { name: "coding-agent", approach: "Plan-execute-verify", bestFor: "Autonomous coding" }, { name: "fullstack-dev", approach: "Next.js scaffold", bestFor: "Web apps" }], routing: "superpowers to architect, coding-agent to execute, fullstack-dev for Next.js" },
  { domain: "Content Writing", skills: [{ name: "seo-content-writer", approach: "SEO + GEO", bestFor: "Search-ranking" }, { name: "blog-writer", approach: "Style-guide", bestFor: "Brand voice" }, { name: "humanizer", approach: "De-AI", bestFor: "Final quality gate" }], routing: "Write first, then humanizer as final pass" },
  { domain: "Content Strategy", skills: [{ name: "content-strategy", approach: "Planning", bestFor: "Quarterly plans" }, { name: "marketing-mode", approach: "Positioning", bestFor: "Brand strategy" }, { name: "social-media-manager", approach: "Execution", bestFor: "Daily posting" }], routing: "Plan → position → execute" },
  { domain: "Skill Security", skills: [{ name: "skill-scanner", approach: "8-phase scan", bestFor: "Pre-install audit" }, { name: "skill-vetter", approach: "Quick check", bestFor: "Fast assessment" }], routing: "scanner for thorough; vetter for quick" },
]

export const SKILL_UPGRADES: SkillUpgrade[] = [
  { original: "coding-agent", upgraded: "superpowers", newCapabilities: "Spec-first, sub-agent delegation, typed errors", status: "COEXIST" },
  { original: "agent-browser", upgraded: "browser-use", newCapabilities: "Natural language, no Playwright code, typed errors", status: "COEXIST" },
  { original: "seo-content-writer", upgraded: "humanizer", newCapabilities: "AI pattern stripping, Wikipedia classifier, diff output", status: "POST-PROCESS" },
  { original: "content-strategy", upgraded: "social-media-manager", newCapabilities: "Multi-platform, content calendar, brand voice", status: "PIPELINE" },
  { original: "skill-vetter", upgraded: "skill-scanner", newCapabilities: "8-phase analysis, behavioral, supply chain", status: "UPGRADE" },
]

export const ERROR_STANDARDS: ErrorStandard[] = [
  { skill: "superpowers", errorTypes: [{ type: "SpecMissingError", code: "SP-001", action: "Halt, prompt for spec" }, { type: "ArchitectureConflictError", code: "SP-002", action: "Surface conflict" }, { type: "SubAgentTimeoutError", code: "SP-003", action: "Log, retry, escalate" }, { type: "TestFailureError", code: "SP-004", action: "Rollback to last passing" }, { type: "DeployCheckFailedError", code: "SP-005", action: "Block deploy" }] },
  { skill: "browser-use", errorTypes: [{ type: "PageLoadTimeoutError", code: "BU-001", action: "Retry, report URL" }, { type: "ElementNotFoundError", code: "BU-002", action: "Suggest alternatives" }, { type: "NavigationError", code: "BU-003", action: "Screenshot, report" }, { type: "AuthFailureError", code: "BU-004", action: "Surface issue" }, { type: "ScrapeEmptyError", code: "BU-006", action: "Report expected vs found" }] },
  { skill: "humanizer", errorTypes: [{ type: "EmptyInputError", code: "HZ-001", action: "No input received" }, { type: "PreservedContentError", code: "HZ-002", action: "Revert changed claim" }, { type: "ToneMismatchError", code: "HZ-003", action: "Re-process with constraint" }, { type: "CodeCorruptionError", code: "HZ-004", action: "Revert code blocks" }] },
  { skill: "social-media-manager", errorTypes: [{ type: "MissingPersonaError", code: "SM-001", action: "Prompt for audience" }, { type: "PlatformLimitError", code: "SM-002", action: "Auto-truncate" }, { type: "BrandVoiceConflictError", code: "SM-003", action: "Regenerate" }, { type: "CalendarGapError", code: "SM-004", action: "Fill with evergreen" }] },
  { skill: "gumroad-pipeline", errorTypes: [{ type: "NoProductError", code: "GP-001", action: "Prompt: what are you selling?" }, { type: "PricingBelowFloorError", code: "GP-002", action: "Reject below $5" }, { type: "CopyLengthError", code: "GP-003", action: "Flag, suggest cuts" }, { type: "EmailSequenceOverflowError", code: "GP-004", action: "Trim to 5" }, { type: "LowConversionWarning", code: "GP-005", action: "A/B suggestions" }, { type: "MissingSocialProofError", code: "GP-006", action: "Insert placeholder" }] },
  { skill: "skill-router", errorTypes: [{ type: "IntentAmbiguousError", code: "SR-001", action: "Ask 1 question, max 3 options" }, { type: "SkillNotInstalledError", code: "SR-002", action: "Suggest install command" }, { type: "ChainBreakError", code: "SR-003", action: "Continue from next skill" }, { type: "QualityGateFailureError", code: "SR-005", action: "Re-route, max 2 retries" }, { type: "CircularDependencyError", code: "SR-006", action: "Break cycle, linearize" }] },
]

export const FAQ_DATA: FAQItem[] = [
  { question: "What is an AI agent skill?", answer: "An AI agent skill is a specialized capability module that gives an AI agent domain-specific expertise. Think of it like a plugin — each skill contains instructions, constraints, and examples that teach the AI how to perform a specific task at expert level. Skills range from code generation (fullstack-dev) to content optimization (seo-geo) to reasoning (chain-of-thought)." },
  { question: "How do skill stacks work?", answer: "A skill stack is a sequence of skills that run in pipeline — the output of one becomes the input of the next. This is more powerful than using skills individually because each skill in the chain refines and strengthens the output. For example, the Bulletproof Quality stack runs chain-of-thought → devils-advocate → simulation-sandbox → output-formatter, catching 80% of errors before they matter." },
  { question: "What is the Skill Router?", answer: "The Skill Router is a meta-skill that automatically selects the right skill combination based on your intent. You describe what you want to do (e.g., 'launch a product' or 'research AI agents') and it maps your intent to the optimal stack. It supports 8 router commands: /launch, /content, /research, /design, /decide, /data, /learn, /automate." },
  { question: "How do I install a skill?", answer: "Skills can be installed with a single command. For built-in skills, they're available by default. For community skills from sources like skills.sh, vercel-labs, or ai-skills-library, use the find-skills tool to discover and install them. Each skill card on this portal includes a copy-ready install command." },
  { question: "What is GEO (Generative Engine Optimization)?", answer: "GEO is the practice of optimizing content not just for traditional search engines like Google, but also for AI-powered answer engines like ChatGPT, Perplexity, and Google SGE. While SEO focuses on ranking in search results, GEO focuses on getting your content cited as a source by AI systems. The seo-geo skill optimizes for both simultaneously." },
  { question: "Can I create my own skill combinations?", answer: "Yes — the Combo Generator lets you pick any skills from the 82-skill directory, name your combo, and get a copy-ready command. The generator also checks for compatibility conflicts and suggests synergies based on existing stack patterns. You can export your custom combo in multiple formats: chain, list, command, or JSON." },
  { question: "What are skill playbooks?", answer: "Playbooks are pre-built execution scripts with named skill chains and trigger commands. Each playbook is a battle-tested workflow optimized for a specific outcome. For example, the 'Ship Fast' playbook (/shipfast) runs superpowers → fullstack-dev → shadcn → deployment-manager to go from idea to live URL in under an hour." },
  { question: "How does the error escalation system work?", answer: "Every skill has typed error codes (e.g., BU-001 for browser-use PageLoadTimeout). When an error occurs, the system automatically escalates to the best fallback skill. For example, if browser-use times out, it escalates to web-reader for direct extraction. There are 12 escalation chains ensuring no dead ends — every failure has a recovery path." },
  { question: "What does the health score mean?", answer: "The health score (0-100) rates each skill's reliability and completeness. Scores above 80 are 'Excellent' (battle-tested with typed errors), 60-80 are 'Good' (functional but may lack error handling), 40-60 are 'Fair' (works but needs improvement), and below 40 'Needs Work' (consider upgrading). Skills with health scores below 50 trigger self-healing rules." },
  { question: "How do skill dependencies work?", answer: "Some skills depend on others for full functionality. For example, 'humanizer' depends on 'seo-content-writer' or 'blog-writer' because it processes their writing output. The dependency system ensures you install prerequisites and understand the execution order. The portal maps 10 key dependency relationships." },
]

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
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

export function getCatColor(cat: string) { return CATEGORY_COLORS[cat] || { bg: "bg-slate-500/15", text: "text-slate-400", border: "border-slate-500/30" } }

export function getHealthBadge(s: number) {
  if (s >= 80) return { label: "Excellent", bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" }
  if (s >= 60) return { label: "Good", bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" }
  if (s >= 40) return { label: "Fair", bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" }
  return { label: "Needs Work", bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" }
}

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  COEXIST: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  "POST-PROCESS": { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/30" },
  PIPELINE: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  UPGRADE: { bg: "bg-rose-500/15", text: "text-rose-400", border: "border-rose-500/30" }
}

export const INTENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  orange: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  cyan: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30" },
  pink: { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/30" },
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  teal: { bg: "bg-teal-500/15", text: "text-teal-400", border: "border-teal-500/30" },
  lime: { bg: "bg-lime-500/15", text: "text-lime-400", border: "border-lime-500/30" },
  fuchsia: { bg: "bg-fuchsia-500/15", text: "text-fuchsia-400", border: "border-fuchsia-500/30" }
}

export const ALL_CATEGORIES = Array.from(new Set(INSTALLED_SKILLS.map(s => s.category)))
export const AVG_HEALTH = Math.round(INSTALLED_SKILLS.reduce((a, s) => a + s.healthScore, 0) / INSTALLED_SKILLS.length)
