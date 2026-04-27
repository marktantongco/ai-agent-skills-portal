# AI Agent Skills Portal

> A comprehensive directory, installation source, and stack recommendation engine for AI agent skills. Build systems, not one-off tasks.

## Overview

This portal catalogs **80 installed skills** across **13 categories**, organized into **16 recommended stacks** for different use cases. Every skill is copy-ready for installation into any AI agent environment. Includes typed error handling standards, comparative analysis of overlapping skills, and upgrade paths.

## Quick Stats

| Metric | Value |
|--------|-------|
| Total Skills | 80 |
| Categories | 13 |
| Recommended Stacks | 16 |
| Top Skill by Installs | find-skills (1.2M) |
| Built-in Skills | 45+ |
| Open Source Skills | 30+ |
| New Skills This Session | 4 (superpowers, browser-use, humanizer, social-media-manager) |
| Community Sources | skills.sh, Anthropic, Vercel, Supabase, Sentry, obra |

## Skill Categories

| Category | Count | Top Skill | Description |
|----------|-------|-----------|-------------|
| Development | 14 | react-best-practices (352.5K) | Full-stack, frontend, mobile, spec-first, component skills |
| AI/Media | 7 | LLM | Language models, speech, vision, video generation |
| Design/UI | 8 | frontend-design (342.1K) | Visual design, animations, image processing, UI systems |
| Content | 10 | seo-content-writer | SEO, blogging, humanizer, social media, content strategy |
| Research | 9 | deep-research | Search, academic, web extraction, multi-engine |
| Business | 7 | finance | Financial data, market research, JTBD, stock analysis |
| Reasoning | 6 | chain-of-thought | Problem decomposition, argument testing, compression |
| Documents | 5 | pdf | Document creation: PDF, DOCX, PPT, XLSX, charts |
| Browser | 2 | agent-browser (216.3K) | CLI and natural language browser automation |
| DevOps | 2 | deployment-manager | CI/CD, deployment, database optimization |
| Meta | 4 | skill-creator (170K) | Skill creation, vetting, scanning, formatting |
| Education | 1 | explained-code | Teaching, documentation, code explanation |
| Specialty | 7 | photography-ai | Photography, storytelling, dreams, mindfulness, interview design |

## Top 14 Skills by Community Installs

| Rank | Skill | Source | Installs | Category |
|------|-------|--------|----------|----------|
| 1 | find-skills | vercel-labs/skills | 1.2M | Development |
| 2 | react-best-practices | vercel-labs/agent-skills | 352.5K | Development |
| 3 | frontend-design | anthropics/skills | 342.1K | Design/UI |
| 4 | web-design-guidelines | vercel-labs/agent-skills | 280.8K | Design/UI |
| 5 | agent-browser | vercel-labs/agent-browser | 216.3K | Browser |
| 6 | skill-creator | anthropics/skills | 170K | Meta |
| 7 | composition-patterns | vercel-labs/agent-skills | 150.8K | Development |
| 8 | ui-ux-pro-max | nextlevelbuilder | 134.8K | Design/UI |
| 9 | supabase-postgres | supabase/agent-skills | 125K | DevOps |
| 10 | brainstorming | obra/superpowers | 124.6K | Development |
| 11 | shadcn | shadcn/ui | 110.8K | Development |
| 12 | react-native-skills | vercel-labs/agent-skills | 101.5K | Development |
| 13 | caveman | juliusbrussee/caveman | 84.7K | Reasoning |
| 14 | next-best-practices | vercel-labs/next-skills | 73.3K | Development |
| NEW | superpowers | skills.sh | -- | Development |
| NEW | browser-use | skills.sh | -- | Browser |
| NEW | humanizer | skills.sh | -- | Content |
| NEW | social-media-manager | skills.sh | -- | Content |

## Comparative Analysis: Overlapping Skills

When multiple skills cover similar territory, use this routing guide:

### Browser Automation
| Skill | Approach | Best For |
|-------|----------|----------|
| agent-browser | CLI commands | Precise scripted automation, repeatable workflows |
| browser-use | Natural language | Quick lookups, ad-hoc browsing, no code needed |

**Routing**: Use agent-browser for repeatable scripts; browser-use for one-off natural language queries.

### Project Orchestration
| Skill | Approach | Best For |
|-------|----------|----------|
| superpowers | Spec-first, sub-agent delegation | Greenfield projects needing architecture |
| coding-agent | Plan-execute-verify loop | Autonomous coding tasks |
| fullstack-dev | Full-stack Next.js scaffold | Web app development specifically |

**Routing**: Use superpowers to spec + architect, coding-agent to execute code, fullstack-dev for Next.js specifically.

### Content Writing
| Skill | Approach | Best For |
|-------|----------|----------|
| seo-content-writer | SEO + GEO optimized | Search-ranking content |
| blog-writer | Style-guide driven | Brand voice blog posts |
| humanizer | AI pattern stripping | Post-processing quality gate |

**Routing**: Write with seo-content-writer or blog-writer first, then run humanizer as final pass.

### Content Strategy
| Skill | Approach | Best For |
|-------|----------|----------|
| content-strategy | Planning layer -- pillars, calendar | Quarterly content planning |
| marketing-mode | Strategic positioning | Brand and positioning strategy |
| social-media-manager | Execution layer -- multi-platform posts | Day-to-day social content |

**Routing**: Plan with content-strategy, position with marketing-mode, execute with social-media-manager.

### Skill Security
| Skill | Approach | Best For |
|-------|----------|----------|
| skill-scanner | 8-phase deep scan | Pre-install security audit |
| skill-vetter | Quick security check | Fast trust assessment |

**Routing**: Use skill-scanner for thorough audits; skill-vetter for quick checks.

### Academic Research
| Skill | Approach | Best For |
|-------|----------|----------|
| aminer-academic-search | Paper + scholar search | Finding specific papers |
| aminer-daily-paper | Recommendations | Staying current with new publications |
| aminer-open-academic | Open data access | Bulk academic data queries |

**Routing**: Search with aminer-academic-search, track with aminer-daily-paper, bulk access with aminer-open-academic.

## Skill Upgrades

| Original | Upgraded | New Capabilities | Status |
|----------|----------|------------------|--------|
| coding-agent | superpowers | Spec-first workflow, architecture review, sub-agent delegation, typed errors | COEXIST |
| agent-browser | browser-use | Natural language interface, no Playwright code, screenshot returns, typed errors | COEXIST |
| seo-content-writer | humanizer | AI pattern stripping, Wikipedia-trained classifier, diff output, tone preservation | POST-PROCESS |
| content-strategy | social-media-manager | Multi-platform execution, content calendar, pillar distribution, platform limits | PIPELINE |
| skill-vetter | skill-scanner | 8-phase analysis, behavioral analysis, supply chain, permission analysis | UPGRADE |
| skill-finder-cn | find-skills | Global ecosystem search, quality verification, 1.2M installs | UPGRADE |

**Status definitions**:
- **COEXIST**: Both skills serve different UX for the same domain; keep both
- **POST-PROCESS**: New skill runs after the original as a quality gate
- **PIPELINE**: New skill is the next step in the workflow after the original
- **UPGRADE**: New skill fully replaces the original; prefer the new one

## Error Handling Standards

All newly installed skills follow typed error handling with these principles:
- **No silent failures**: Every error is surfaced, never swallowed
- **Typed errors**: Each error has a named type and code for programmatic handling
- **Actionable**: Every error includes the recommended action

### superpowers Error Types

| Error Type | Code | When | Action |
|-----------|------|------|--------|
| SpecMissingError | SP-001 | No specification can be extracted | Halt and prompt user for spec input |
| ArchitectureConflictError | SP-002 | Spec contradicts existing architecture | Surface conflict, ask user to resolve |
| SubAgentTimeoutError | SP-003 | Sub-agent exceeds time budget | Log which agent, retry once, then escalate |
| TestFailureError | SP-004 | Acceptance test fails | Roll back to last passing state, report |
| DeployCheckFailedError | SP-005 | Pre-deploy checks fail | Block deployment, surface failing check |

### browser-use Error Types

| Error Type | Code | When | Action |
|-----------|------|------|--------|
| PageLoadTimeoutError | BU-001 | Page doesn't load within 10s | Retry once, then report URL and timeout |
| ElementNotFoundError | BU-002 | Target element not in DOM | Report which selector, suggest alternatives |
| NavigationError | BU-003 | Click doesn't reach expected URL | Screenshot current state, report expected vs actual |
| AuthFailureError | BU-004 | Login or auth step fails | Surface credentials issue, never retry same creds |
| ScrapeEmptyError | BU-006 | Extracted data is empty | Report expected vs found data |

### humanizer Error Types

| Error Type | Code | When | Action |
|-----------|------|------|--------|
| EmptyInputError | HZ-001 | No text provided | Return error: no input text received |
| PreservedContentError | HZ-002 | Factual claim altered during rewrite | Flag changed claim, revert it, keep style changes |
| ToneMismatchError | HZ-003 | Output tone doesn't match input | Re-process with explicit tone constraint |
| CodeCorruptionError | HZ-004 | Code block or data modified | Revert code blocks entirely, only humanize prose |

### social-media-manager Error Types

| Error Type | Code | When | Action |
|-----------|------|------|--------|
| MissingPersonaError | SM-001 | No audience persona provided | Halt and prompt for target audience |
| PlatformLimitError | SM-002 | Post exceeds platform char limit | Auto-truncate with ellipsis, flag for review |
| BrandVoiceConflictError | SM-003 | Posts don't match brand voice | Regenerate with shared voice reference |
| CalendarGapError | SM-004 | Days with no content scheduled | Fill with evergreen content, flag as auto-filled |

## Recommended Stacks (16)

### Frontend Stack
`frontend-design` + `react-best-practices` + `composition-patterns` + `shadcn` + `web-design-guidelines`

Architecture -> Structure -> Components -> Quality Gate. Building production-grade React UIs with distinctive design.

### Ship It Stack
`chain-of-thought` + `fullstack-dev` + `shadcn` + `supabase-postgres` + `deployment-manager`

Think -> Build -> Component -> Persist -> Deploy. From idea to deployed product in one session.

### Research Stack
`deep-research` + `web-search` + `web-reader` + `context-compressor`

Search -> Read -> Distill -> Compress. Deep research from question to compressed briefing.

### Content Engine
`seo-geo` + `seo-content-writer` + `web-search` + `output-formatter`

Optimize -> Write -> Verify -> Format. Content that ranks in Google AND gets cited by AI.

### Reasoning Stack
`chain-of-thought` + `devils-advocate` + `simulation-sandbox`

Think -> Challenge -> Verify. Decision-making with rigorous analysis and stress-testing.

### Design & Deliver
`frontend-design` + `gsap-animations` + `shadcn` + `fullstack-dev` + `deployment-manager`

Design -> Animate -> Build -> Ship. From mockup to live site with premium interactions.

### Data Pipeline
`xlsx` + `charts` + `finance` + `context-compressor`

Import -> Visualize -> Analyze -> Distill. Financial and data analysis from raw numbers to insights.

### Education Stack
`explained-code` + `socratic-method` + `output-formatter` + `pdf`

Explain -> Guide -> Format -> Distribute. Teaching and documentation that actually lands.

### DevOps Stack
`deployment-manager` + `mcp-builder` + `skill-creator` + `skill-scanner`

Build -> Connect -> Extend -> Secure. Infrastructure, integrations, and skill lifecycle.

### Creative Suite
`image-generation` + `gsap-animations` + `charts` + `web-artifacts-builder`

Create -> Animate -> Visualize -> Package. Rich creative output from images to interactive demos.

### Mobile Stack
`react-native-skills` + `frontend-design` + `composition-patterns`

Mobile-first -> Design -> Architecture. Building performant React Native/Expo apps.

### Academic Stack
`aminer-academic-search` + `aminer-daily-paper` + `deep-research` + `pdf`

Discover -> Track -> Analyze -> Publish. Academic research from paper discovery to publication.

### Product Launch Stack (NEW)
`superpowers` + `frontend-design` + `react-best-practices` + `deployment-manager` + `social-media-manager` + `humanizer`

Spec -> Design -> Build -> Ship -> Market -> Polish. Full product lifecycle from specification to market launch.

### Content Machine (NEW)
`content-strategy` + `seo-content-writer` + `social-media-manager` + `humanizer`

Plan -> Write -> Distribute -> Polish. End-to-end content production that ranks and sounds human.

### Web Scraping Pipeline (NEW)
`browser-use` + `web-reader` + `contentanalysis` + `xlsx`

Browse -> Extract -> Analyze -> Tabulate. Data extraction from web to structured spreadsheet.

### Creative Studio (NEW)
`brainstorming` + `storyboard-manager` + `image-generation` + `gsap-animations`

Ideate -> Storyboard -> Create -> Animate. Creative projects from initial idea to animated visual.

## One-Prompt Install Commands

### Full Frontend Power
```
Install these skills for production-grade React UI development:
1. frontend-design -- distinctive, non-AI-slop aesthetics
2. react-best-practices -- 70 performance rules from Vercel
3. composition-patterns -- scalable component architecture
4. shadcn -- battle-tested UI components
5. web-design-guidelines -- quality gate for UI compliance
Together: Design vision + Performance + Architecture + Components + Quality = ship premium UIs fast.
```

### Ship It Now
```
Install these skills to go from idea to deployed product:
1. chain-of-thought -- decompose complex problems
2. fullstack-dev -- scaffold full-stack Next.js apps
3. shadcn -- instant UI components
4. supabase-postgres -- database best practices
5. deployment-manager -- ship to Vercel/Netlify/GH Pages
Together: Think + Build + UI + Data + Deploy = zero-to-live in one session.
```

### Deep Research Pipeline
```
Install these skills for comprehensive research workflows:
1. deep-research -- multi-source investigation orchestrator
2. web-search -- real-time information retrieval
3. web-reader -- full content extraction with crawling
4. context-compressor -- prevent token overflow, preserve decisions
Together: Search + Read + Distill + Compress = research that scales.
```

### Reason & Decide
```
Install these skills for rigorous decision-making:
1. chain-of-thought -- step-by-step problem decomposition
2. devils-advocate -- stress-test arguments, return stronger version
3. simulation-sandbox -- test scenarios with labeled simulated data
Together: Think + Challenge + Verify = decisions that survive contact with reality.
```

### Content That Ranks
```
Install these skills for content that ranks in Google AND AI:
1. seo-geo -- optimize for search engines AND AI answer engines
2. seo-content-writer -- production SEO content creation
3. web-search -- verify claims with real-time data
4. output-formatter -- clean, structured output every time
Together: Optimize + Write + Verify + Format = content that gets found and cited.
```

### Product Launch (NEW)
```
Install these skills for full product lifecycle:
1. superpowers -- spec-first project orchestration with typed errors
2. frontend-design -- distinctive, non-AI-slop UI
3. react-best-practices -- 70 performance rules from Vercel
4. deployment-manager -- ship to production with health checks
5. social-media-manager -- multi-platform content with brand voice
6. humanizer -- strip AI patterns, sound human
Together: Spec + Design + Build + Ship + Market + Polish = launch products that feel real.
```

### Content That Converts (NEW)
```
Install these skills for content that ranks AND sounds human:
1. content-strategy -- define pillars, editorial calendar, KPIs
2. seo-content-writer -- production SEO content creation
3. social-media-manager -- multi-platform execution
4. humanizer -- AI pattern stripping as quality gate
Together: Plan + Write + Distribute + Polish = content machine that never stops.
```

## Installation Methods

### Method 1: npx skills (Recommended)
```bash
npx skills add vercel-labs/agent-skills@react-best-practices
npx skills add anthropics/skills@frontend-design
npx skills add shadcn/ui@shadcn
```

### Method 2: Direct SKILL.md Copy
Copy any `SKILL.md` from `/home/z/my-project/skills/<skill-name>/` into your agent's skills directory.

### Method 3: Full Library Install (One Command)
```bash
# Copy all 80 skills at once
cp -r /home/z/my-project/skills/* /your-project/skills/
```

### Method 4: AGENTS.md Setup
```bash
# Copy the operating instructions
cp AGENTS.md /your-project/AGENTS.md

# Set up the skills directory
mkdir -p /your-project/skills/
```

## Skill Sources

| Source | URL | Skills | Trust Level |
|--------|-----|--------|-------------|
| Built-in | /home/z/my-project/skills/ | 45+ | Production |
| ai-skills-library | github.com/marktantongco/ai-skills-library | 8 | Verified |
| skills.sh | skills.sh | 60K+ | Community |
| Vercel | github.com/vercel-labs/agent-skills | 7 | Official |
| Anthropic | github.com/anthropics/skills | 7 | Official |
| Supabase | github.com/supabase/agent-skills | 1 | Official |
| Sentry | github.com/getsentry/skills | 15+ | Official |
| obra/superpowers | github.com/obra/superpowers | 13 | Community |

## Full Skill Directory (80 Skills)

| # | Skill | Category | Source | Installs |
|---|-------|----------|--------|----------|
| 1 | ASR | AI/Media | built-in | built-in |
| 2 | LLM | AI/Media | built-in | built-in |
| 3 | TTS | AI/Media | built-in | built-in |
| 4 | VLM | AI/Media | built-in | built-in |
| 5 | video-generation | AI/Media | built-in | built-in |
| 6 | video-understand | AI/Media | built-in | built-in |
| 7 | image-generation | AI/Media | built-in | built-in |
| 8 | fullstack-dev | Development | built-in | built-in |
| 9 | coding-agent | Development | built-in | built-in |
| 10 | superpowers | Development | skills.sh | NEW |
| 11 | mcp-builder | Development | ai-skills-library | -- |
| 12 | web-artifacts-builder | Development | ai-skills-library | -- |
| 13 | react-best-practices | Development | vercel-labs | 352.5K |
| 14 | composition-patterns | Development | vercel-labs | 150.8K |
| 15 | react-native-skills | Development | vercel-labs | 101.5K |
| 16 | next-best-practices | Development | vercel-labs | 73.3K |
| 17 | shadcn | Development | shadcn/ui | 110.8K |
| 18 | find-skills | Development | vercel-labs | 1.2M |
| 19 | skill-scanner | Development | getsentry | -- |
| 20 | brainstorming | Development | obra/superpowers | 124.6K |
| 21 | frontend-design | Design/UI | anthropics | 342.1K |
| 22 | ui-ux-pro-max | Design/UI | nextlevelbuilder | 134.8K |
| 23 | visual-design-foundations | Design/UI | built-in | built-in |
| 24 | web-design-guidelines | Design/UI | vercel-labs | 280.8K |
| 25 | gsap-animations | Design/UI | xerxes-on | -- |
| 26 | web-shader-extractor | Design/UI | built-in | built-in |
| 27 | image-understand | Design/UI | built-in | built-in |
| 28 | image-edit | Design/UI | built-in | built-in |
| 29 | seo-content-writer | Content | ai-skills-library | -- |
| 30 | seo-geo | Content | built-in | built-in |
| 31 | blog-writer | Content | built-in | built-in |
| 32 | humanizer | Content | skills.sh | NEW |
| 33 | content-strategy | Content | skills.sh | -- |
| 34 | social-media-manager | Content | skills.sh | NEW |
| 35 | contentanalysis | Content | built-in | built-in |
| 36 | writing-plans | Content | built-in | built-in |
| 37 | podcast-generate | Content | built-in | built-in |
| 38 | marketing-mode | Content | built-in | built-in |
| 39 | web-search | Research | built-in | built-in |
| 40 | web-reader | Research | ai-skills-library | -- |
| 41 | deep-research | Research | built-in | built-in |
| 42 | multi-search-engine | Research | built-in | built-in |
| 43 | aminer-academic-search | Research | built-in | built-in |
| 44 | aminer-daily-paper | Research | built-in | built-in |
| 45 | aminer-open-academic | Research | built-in | built-in |
| 46 | ai-news-collectors | Research | built-in | built-in |
| 47 | qingyan-research | Research | built-in | built-in |
| 48 | finance | Business | built-in | built-in |
| 49 | stock-analysis-skill | Business | built-in | built-in |
| 50 | market-research-reports | Business | built-in | built-in |
| 51 | jobs-to-be-done | Business | ai-skills-library | -- |
| 52 | gift-evaluator | Business | built-in | built-in |
| 53 | get-fortune-analysis | Business | built-in | built-in |
| 54 | auto-target-tracker | Business | built-in | built-in |
| 55 | deployment-manager | DevOps | ai-skills-library | -- |
| 56 | supabase-postgres | DevOps | supabase | 125.0K |
| 57 | chain-of-thought | Reasoning | ai-skills-library | -- |
| 58 | socratic-method | Reasoning | ai-skills-library | -- |
| 59 | devils-advocate | Reasoning | ai-skills-library | -- |
| 60 | caveman | Reasoning | juliusbrussee | 84.7K |
| 61 | context-compressor | Reasoning | ai-skills-library | -- |
| 62 | simulation-sandbox | Reasoning | ai-skills-library | -- |
| 63 | pdf | Documents | built-in | built-in |
| 64 | docx | Documents | built-in | built-in |
| 65 | ppt | Documents | built-in | built-in |
| 66 | xlsx | Documents | built-in | built-in |
| 67 | charts | Documents | built-in | built-in |
| 68 | agent-browser | Browser | vercel-labs | 216.3K |
| 69 | browser-use | Browser | skills.sh | NEW |
| 70 | skill-creator | Meta | built-in | 170.0K |
| 71 | skill-vetter | Meta | built-in | built-in |
| 72 | skill-finder-cn | Meta | built-in | built-in |
| 73 | output-formatter | Meta | ai-skills-library | -- |
| 74 | explained-code | Education | ai-skills-library | -- |
| 75 | interview-designer | Specialty | built-in | built-in |
| 76 | storyboard-manager | Specialty | built-in | built-in |
| 77 | photography-ai | Specialty | ai-skills-library | -- |
| 78 | dream-interpreter | Specialty | built-in | built-in |
| 79 | mindfulness-meditation | Specialty | built-in | built-in |
| 80 | anti-pua | Specialty | built-in | built-in |

## Operating Principle

> Build it once -> it runs forever. Every skill added makes the system smarter. Every cron scheduled removes one more thing you have to think about.

*Built with the compounding system principle: Your job is not to answer. Your job is to make yourself unnecessary -- one skill at a time.*
