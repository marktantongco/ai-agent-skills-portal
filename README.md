# AI Agent Skills Portal

> **82 Skills · 25 Stacks · 16 Playbooks · 8 Router Commands · 13 Categories**

The definitive directory of AI agent skills — optimized stacks, interactive combo generator, compatibility matrix, and one-prompt install commands. Two views: a polished public landing page and a developer-focused terminal-style portal.

---

## 🌐 Live Demos

| View | URL | Description |
|------|-----|-------------|
| **Public Portal** | [marktantongco.github.io/ai-agent-skills-portal](https://marktantongco.github.io/ai-agent-skills-portal) | Warm, accessible landing page for general users |
| **Developer Portal** | [marktantongco.github.io/ai-agent-skills-portal/dev](https://marktantongco.github.io/ai-agent-skills-portal/dev) | Dark ops terminal UI with command palette |
| **Vercel (Public)** | [ai-agent-skills-portal.vercel.app](https://ai-agent-skills-portal.vercel.app) | Vercel deployment — public portal |
| **Vercel (Dev)** | [ai-agent-skills-portal.vercel.app/dev](https://ai-agent-skills-portal.vercel.app/dev) | Vercel deployment — developer portal |

---

## ✨ Features

### Dual-Site Architecture
- **Public Portal** — Glass morphism design, gradient hero, dark/light mode, mobile-first, accessible
- **Developer Portal** — promptc-os inspired "Dark Ops" design, void black #0B0D10, zone-colored accents, command palette (⌘K), Framer Motion animations, frosted glass nav

### Skill Router
Describe what you want to do in natural language and get routed to the optimal stack. 8 intent domains:
- `/launch` → Product Launch stack
- `/content` → Content Machine stack
- `/research` → Research Stack
- `/design` → Design & Deliver stack
- `/decide` → Reasoning Stack
- `/data` → Data Pipeline stack
- `/learn` → Education Stack
- `/automate` → Automation Stack

### 16 Playbooks
Pre-built execution scripts with trigger commands:

| Playbook | Trigger | Chain |
|----------|---------|-------|
| Bulletproof Quality | `/bulletproof` | chain-of-thought → devils-advocate → simulation-sandbox → output-formatter |
| Zero-Trace Content | `/zerotrace` | content-strategy → seo-content-writer → humanizer → social-media-manager |
| Full Recon | `/recon` | deep-research → web-search → web-reader → context-compressor → output-formatter |
| Ship Fast | `/shipfast` | superpowers → fullstack-dev → shadcn → deployment-manager |
| Design Audit | `/designaudit` | web-design-guidelines → frontend-design → gsap-animations → react-best-practices |
| Content Flip | `/contentflip` | contentanalysis → seo-geo → seo-content-writer → gumroad-pipeline → humanizer |
| Security Sweep | `/securitysweep` | skill-vetter → skill-scanner → devils-advocate → output-formatter |
| Data Harvest | `/harvest` | browser-use → web-reader → contentanalysis → xlsx → charts |
| Greenfield | `/greenfield` | brainstorming → superpowers → frontend-design → fullstack-dev → deployment-manager |
| Decision Engine | `/decide` | chain-of-thought → socratic-method → devils-advocate → simulation-sandbox |
| Brand Launch | `/brandlaunch` | brainstorming → content-strategy → seo-geo → social-media-manager → humanizer |
| Rapid Prototype | `/prototype` | superpowers → fullstack-dev → shadcn → browser-use |
| Deep Dive | `/deepdive` | deep-research → web-search → aminer-academic-search → context-compressor |
| Design System | `/designsystem` | frontend-design → web-design-guidelines → shadcn → gsap-animations |
| Monetize | `/monetize` | content-strategy → gumroad-pipeline → seo-geo → social-media-manager |
| Launch Pad | `/launchpad` | superpowers → brainstorming → fullstack-dev → deployment-manager → humanizer |

### Interactive Combo Generator
- Pick any skills from the 82-skill directory
- Auto-detect compatibility (synergies + conflicts)
- Smart suggestions based on existing stacks
- Multi-format copy: chain, list, command, JSON
- Drag to reorder skill execution sequence

### 25 Optimized Stacks
Each stack includes:
- **Synergy** — how skills amplify each other
- **Why Chosen** — the specific problem each skill solves
- **Benefits vs Going Solo** — concrete comparison
- **Common Misconceptions** — what people get wrong

### Comprehensive Data
- **Compatibility Matrix** — 19 synergies + 5 conflicts
- **Stack ROI** — Time/quality comparison with vs without
- **Comparative Analysis** — Overlapping skill routing rules
- **Upgrade Paths** — Skill evolution and migration
- **Error Handling** — Typed error codes per skill
- **Escalation Chains** — 12 error recovery paths
- **Dependencies** — 10 skill dependency relationships
- **Self-Healing Rules** — 8 detection + repair rules
- **Health Scores** — 0-100 per skill with color coding

### Copy-Ready Everything
Every skill name, stack, playbook, trigger, error code, compatibility entry, ROI row, escalation chain, dependency, healing rule, and FAQ answer has a one-click copy button.

---

## 📊 Skills by Category

| Category | Count | Key Skills |
|----------|-------|------------|
| Development | 14 | fullstack-dev, superpowers, react-best-practices, shadcn, next-best-practices |
| Design/UI | 9 | frontend-design, gsap-animations, web-design-guidelines, ui-ux-pro-max |
| Content | 10 | seo-geo, humanizer, social-media-manager, gumroad-pipeline |
| Research | 8 | deep-research, web-search, web-reader, aminer-academic-search |
| Business | 6 | finance, market-research-reports, jobs-to-be-done |
| DevOps | 2 | deployment-manager, supabase-postgres |
| Reasoning | 6 | chain-of-thought, devils-advocate, socratic-method, simulation-sandbox |
| Documents | 5 | pdf, docx, ppt, xlsx, charts |
| AI/Media | 7 | LLM, TTS, ASR, VLM, image-generation, video-generation |
| Browser | 2 | agent-browser, browser-use |
| Meta | 5 | skill-router, skill-creator, skill-vetter, find-skills |
| Education | 1 | explained-code |
| Specialty | 5 | photography-ai, interview-designer, storyboard-manager |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| State | React hooks + Zustand |
| Fonts | Geist Sans + Geist Mono |
| Build | Static export (GitHub Pages compatible) |
| Deploy | GitHub Pages + Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Install
```bash
git clone https://github.com/marktantongco/ai-agent-skills-portal.git
cd ai-agent-skills-portal
npm install
```

### Development
```bash
npm run dev
# Open http://localhost:3000 for public portal
# Open http://localhost:3000/dev for developer portal
```

### Build
```bash
npm run build
# Static export generated in /out directory
```

### Production
```bash
npm run start
```

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind v4 + oklch tokens + custom animations
│   │   ├── layout.tsx           # Root layout with SEO, JSON-LD schemas
│   │   ├── page.tsx             # Public Landing Page (glass morphism)
│   │   └── dev/
│   │       └── page.tsx         # Developer Portal (promptc-os design)
│   ├── components/
│   │   └── ui/                  # 40+ shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   └── lib/
│       ├── skills-data.ts       # Shared data module (82 skills, 25 stacks, 16 playbooks)
│       └── utils.ts             # cn() utility
├── public/
│   ├── logo.svg
│   └── robots.txt
├── skills/                      # 82 skill directories with SKILL.md files
├── next.config.ts               # Static export config
├── tailwind.config.ts           # Tailwind v4 + CSS variables
├── components.json              # shadcn/ui config
└── package.json
```

---

## 🎨 Design System

### Public Portal
- **Theme**: Warm, accessible, glass morphism
- **Colors**: Amber → Orange → Rose gradient, dark/light mode
- **Cards**: Frosted glass with backdrop blur
- **Navigation**: Floating side nav + top bar
- **Accessibility**: WCAG AA compliant, semantic HTML, aria-labels

### Developer Portal (promptc-os Design Framework)
- **Theme**: "Developer-Centric Dark Ops" — void black, terminal-inspired
- **Background**: #0B0D10 (void black), cards #14161A
- **Accents**: Zone-colored per section (Violet, Cyan, Amber, Orange, Green, Gold)
- **Navigation**: Frosted glass sticky nav + left sidebar + command palette (⌘K)
- **Animations**: Framer Motion (fadeUp, stagger, hover lift, button press)
- **Effects**: Neon glow borders, frosted glass, scroll progress bar
- **Typography**: Geist Mono for labels, tight tracking on section numbers

---

## 🔑 Keyboard Shortcuts (Developer Portal)

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open command palette |
| `Escape` | Close command palette / modal |
| `1-9` | Navigate to section (via sidebar) |

---

## 📈 SEO & GEO

- 5 JSON-LD schemas (SoftwareApplication, ItemList, FAQPage, HowTo, WebApplication)
- 30+ targeted keywords
- OpenGraph + Twitter card meta
- Canonical URL + robots directives
- Semantic HTML5 with aria-labels
- FAQ section optimized for AI answer engines

---

## 📄 License

MIT

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), and [Framer Motion](https://www.framer.com/motion/).
