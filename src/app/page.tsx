'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Copy, Check, Moon, Sun,
  Terminal, Package, Layers, Trophy, Zap,
  ArrowUp, ArrowDown, Sparkles, X, AlertTriangle,
  Shield, ArrowRightLeft, Database,
  ChevronUp, GitBranch, Wrench, Cpu,
  ArrowRight, BarChart3,
  RefreshCw, AlertCircle, CheckCircle2, Info, Wand2, Play,
  Plus, Minus, ExternalLink, Menu, PlayCircle
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip'

import {
  INSTALLED_SKILLS, SKILL_COMBOS, PLAYBOOKS, INTENT_DOMAINS,
  ESCALATION_CHAINS, COMPATIBILITY, DEPENDENCIES, HEALING_RULES,
  ROI_DATA, TOP_SKILLS, SKILL_OVERLAPS, SKILL_UPGRADES,
  ERROR_STANDARDS, FAQ_DATA, ALL_CATEGORIES, AVG_HEALTH,
  getCatColor, getHealthBadge, STATUS_COLORS, INTENT_COLORS
} from '@/lib/skills-data'
import type { Skill, SkillCombo, Playbook, IntentDomain, FAQItem } from '@/lib/skills-data'
import { ClipboardBasketProvider, useClipboardBasketSafe, ClipboardBasketFloating } from '@/lib/clipboard-basket'

// ──────────────────────────────────────────────────────────
// SECTION CONFIG — Directory is LAST (section 16)
// ──────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero', label: 'Hero', icon: Sparkles },
  { id: 'router', label: 'Skill Router', icon: Cpu },
  { id: 'playbooks', label: 'Playbooks', icon: Play },
  { id: 'combos', label: 'Combo Generator', icon: Wand2 },
  { id: 'stacks', label: 'Stacks', icon: Layers },
  { id: 'top-skills', label: 'Top Skills', icon: Trophy },
  { id: 'compatibility', label: 'Compatibility', icon: Shield },
  { id: 'roi', label: 'Stack ROI', icon: BarChart3 },
  { id: 'comparative', label: 'Comparative', icon: ArrowRightLeft },
  { id: 'upgrades', label: 'Upgrade Paths', icon: Zap },
  { id: 'errors', label: 'Error Handling', icon: AlertTriangle },
  { id: 'escalation', label: 'Escalation', icon: RefreshCw },
  { id: 'dependencies', label: 'Dependencies', icon: GitBranch },
  { id: 'healing', label: 'Self-Healing', icon: Wrench },
  { id: 'faq', label: 'FAQ', icon: Info },
  { id: 'directory', label: 'Directory', icon: Package },
]

// ──────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ──────────────────────────────────────────────────────────
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const cardHover = {
  rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  hover: { y: -2, boxShadow: '0 8px 30px rgb(0 0 0 / 0.12)' },
}

const comboSkillVariants = {
  initial: { opacity: 0, x: -20, height: 0 },
  animate: { opacity: 1, x: 0, height: 'auto', transition: { duration: 0.25 } },
  exit: { opacity: 0, x: 20, height: 0, transition: { duration: 0.2 } },
}

// ──────────────────────────────────────────────────────────
// SCROLL PROGRESS BAR
// ──────────────────────────────────────────────────────────
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px]"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ──────────────────────────────────────────────────────────
function AnimatedCounter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const step = (now: number) => {
            const elapsed = (now - start) / (duration * 1000)
            if (elapsed >= 1) {
              setDisplay(value)
              return
            }
            const eased = 1 - Math.pow(1 - elapsed, 3) // ease-out cubic
            setDisplay(Math.round(eased * value))
            requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return <span ref={ref}>{display}</span>
}

// ──────────────────────────────────────────────────────────
// COPY BUTTON WITH RIPPLE
// ──────────────────────────────────────────────────────────
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const [rippling, setRippling] = useState(false)
  const { addItem: addItemToBasket } = useClipboardBasketSafe()
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setRippling(true)
    if (addItemToBasket) addItemToBasket(text, label)
    setTimeout(() => setCopied(false), 1500)
    setTimeout(() => setRippling(false), 400)
  }, [text, label, addItemToBasket])
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-6 w-6 shrink-0 relative overflow-hidden ${rippling ? 'scale-95' : ''} transition-transform duration-150`}
      onClick={handleCopy}
      title={label || 'Copy'}
      aria-label={label || 'Copy to clipboard'}
    >
      {rippling && (
        <motion.span
          className="absolute inset-0 rounded-md bg-amber-400/20"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      )}
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
            <Check className="h-3 w-3 text-emerald-400" />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
            <Copy className="h-3 w-3 text-muted-foreground" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}

// ──────────────────────────────────────────────────────────
// SECTION WRAPPER WITH SCROLL ANIMATION
// ──────────────────────────────────────────────────────────
function Section({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      variants={sectionVariants}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
    >
      {children}
    </motion.section>
  )
}

// ──────────────────────────────────────────────────────────
// MAIN PAGE
// ──────────────────────────────────────────────────────────
export default function SkillsPortal() {
  const [dark, setDark] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')
  const [globalSearch, setGlobalSearch] = useState('')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Combo generator state
  const [comboSkills, setComboSkills] = useState<string[]>([])
  const [comboName, setComboName] = useState('')
  const [comboSearch, setComboSearch] = useState('')
  const [copyFormat, setCopyFormat] = useState<'chain' | 'list' | 'command' | 'json'>('chain')

  // Directory state
  const [dirSearch, setDirSearch] = useState('')
  const [dirCategory, setDirCategory] = useState('All')

  // Expanded stacks
  const [expandedStacks, setExpandedStacks] = useState<Set<string>>(new Set())

  // Mobile nav
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' }
    )
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Scroll to section
  const scrollTo = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileNavOpen(false)
  }, [])

  // Ref callback helper
  const setRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el
  }, [])

  // ── Filtered skills for directory ──
  const filteredSkills = useMemo(() => {
    return INSTALLED_SKILLS.filter((s) => {
      const matchesSearch = !dirSearch || s.name.toLowerCase().includes(dirSearch.toLowerCase()) || s.description.toLowerCase().includes(dirSearch.toLowerCase())
      const matchesCat = dirCategory === 'All' || s.category === dirCategory
      return matchesSearch && matchesCat
    })
  }, [dirSearch, dirCategory])

  // ── Combo generator helpers ──
  const comboFilteredSkills = useMemo(() => {
    if (!comboSearch) return []
    return INSTALLED_SKILLS.filter(
      (s) => s.name.toLowerCase().includes(comboSearch.toLowerCase()) && !comboSkills.includes(s.name)
    ).slice(0, 8)
  }, [comboSearch, comboSkills])

  const comboConflicts = useMemo(() => {
    return COMPATIBILITY.filter(
      (c) => c.type === 'conflict' && comboSkills.includes(c.skillA) && comboSkills.includes(c.skillB)
    )
  }, [comboSkills])

  const comboSynergies = useMemo(() => {
    return COMPATIBILITY.filter(
      (c) => c.type === 'synergy' && comboSkills.includes(c.skillA) && comboSkills.includes(c.skillB)
    )
  }, [comboSkills])

  const comboSuggestions = useMemo(() => {
    if (comboSkills.length < 2) return []
    const suggestions = new Map<string, number>()
    SKILL_COMBOS.forEach((combo) => {
      const overlap = combo.skills.filter((s) => comboSkills.includes(s)).length
      if (overlap >= 2) {
        combo.skills.forEach((s) => {
          if (!comboSkills.includes(s)) {
            suggestions.set(s, (suggestions.get(s) || 0) + overlap)
          }
        })
      }
    })
    COMPATIBILITY.forEach((c) => {
      if (c.type === 'synergy') {
        if (comboSkills.includes(c.skillA) && !comboSkills.includes(c.skillB)) {
          suggestions.set(c.skillB, (suggestions.get(c.skillB) || 0) + 1)
        }
        if (comboSkills.includes(c.skillB) && !comboSkills.includes(c.skillA)) {
          suggestions.set(c.skillA, (suggestions.get(c.skillA) || 0) + 1)
        }
      }
    })
    return Array.from(suggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name)
  }, [comboSkills])

  const comboCopyText = useMemo(() => {
    const name = comboName || 'Custom Combo'
    switch (copyFormat) {
      case 'chain': return `${name}: ${comboSkills.join(' → ')}`
      case 'list': return `${name}:\n${comboSkills.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      case 'command': return `Run: ${comboSkills.join(' → ')}`
      case 'json': return JSON.stringify({ name, skills: comboSkills, chain: comboSkills.join(' → ') }, null, 2)
    }
  }, [comboSkills, comboName, copyFormat])

  const moveComboSkill = useCallback((idx: number, dir: -1 | 1) => {
    setComboSkills((prev) => {
      const next = [...prev]
      const newIdx = idx + dir
      if (newIdx < 0 || newIdx >= next.length) return prev
      ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
      return next
    })
  }, [])

  const addComboSkill = useCallback((name: string) => {
    setComboSkills((prev) => [...prev, name])
    setComboSearch('')
  }, [])

  const removeComboSkill = useCallback((name: string) => {
    setComboSkills((prev) => prev.filter((s) => s !== name))
  }, [])

  // ── Skill Router helpers ──
  const [routerQuery, setRouterQuery] = useState('')
  const routerResult = useMemo(() => {
    if (!routerQuery.trim()) return null
    const q = routerQuery.toLowerCase()
    let best: IntentDomain | null = null
    let bestScore = 0
    INTENT_DOMAINS.forEach((d) => {
      const score = d.keywords.reduce((acc, kw) => acc + (q.includes(kw) ? 1 : 0), 0)
      if (score > bestScore) { bestScore = score; best = d }
    })
    return best
  }, [routerQuery])

  const toggleStack = useCallback((name: string) => {
    setExpandedStacks((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  // ── Stats ──
  const stats = useMemo(() => [
    { label: 'Skills', value: INSTALLED_SKILLS.length, icon: Package },
    { label: 'Stacks', value: SKILL_COMBOS.length, icon: Layers },
    { label: 'Playbooks', value: PLAYBOOKS.length, icon: Play },
    { label: 'Categories', value: ALL_CATEGORIES.length, icon: Cpu },
    { label: 'Avg Health', value: AVG_HEALTH, icon: Zap },
  ], [])

  return (
    <ClipboardBasketProvider>
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">

        {/* ── SCROLL PROGRESS BAR ── */}
        <ScrollProgressBar />

        {/* ── TOP BAR ── */}
        <header className="fixed top-[2px] left-0 right-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-4 gap-3" role="banner">
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles className="h-5 w-5 text-amber-400" aria-hidden="true" />
            <span className="font-bold text-sm hidden sm:inline">Skills Portal</span>
          </div>
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search skills, stacks, playbooks..."
                className="pl-8 h-8 text-xs bg-muted/50 border-border/50"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                aria-label="Search skills, stacks, and playbooks"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile nav toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <Link href="/dev" aria-label="Switch to Developer View">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" aria-label="Switch to Developer View">
                <Terminal className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">Developer View</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDark(!dark)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </div>
        </header>

        {/* ── FLOATING SIDE NAV (Desktop) ── */}
        <nav className="fixed left-3 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1.5" aria-label="Section navigation">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => scrollTo(id)}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    activeSection === id
                      ? 'bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                  aria-label={`Navigate to ${label} section`}
                  aria-current={activeSection === id ? 'true' : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* ── MOBILE NAV DRAWER ── */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileNavOpen(false)}
                aria-hidden="true"
              />
              <motion.aside
                className="fixed left-0 top-0 bottom-0 z-50 w-56 bg-background border-r border-border/50 p-4 pt-20 overflow-y-auto lg:hidden"
                initial={{ x: -224 }}
                animate={{ x: 0 }}
                exit={{ x: -224 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                role="navigation"
                aria-label="Mobile section navigation"
              >
                <div className="flex flex-col gap-1">
                  {SECTIONS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        activeSection === id
                          ? 'bg-amber-500/15 text-amber-400 font-medium'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                      aria-label={`Navigate to ${label}`}
                      aria-current={activeSection === id ? 'true' : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT ── */}
        <main className="pt-[58px] pb-16 px-4 md:px-16 lg:pl-24 lg:pr-16 max-w-7xl mx-auto flex-1" role="main">

          {/* ═══════════════════ 1. HERO ═══════════════════ */}
          <Section id="hero" className="py-16 md:py-24">
            <div ref={setRef('hero')} className="text-center space-y-6" itemScope itemType="https://schema.org/WebApplication">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-xs text-amber-400 font-medium" role="status">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span itemProp="numberOfItems">{INSTALLED_SKILLS.length}</span> Skills · <span>{SKILL_COMBOS.length}</span> Stacks · <span>{PLAYBOOKS.length}</span> Playbooks
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent leading-tight" itemProp="name">
                AI Agent Skills Portal
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" itemProp="description">
                The definitive directory of AI agent skills with optimized stacks, playbooks, and one-prompt install commands.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto pt-6">
                {stats.map(({ label, value, icon: Icon }) => (
                  <motion.div
                    key={label}
                    variants={cardHover}
                    initial="rest"
                    whileHover="hover"
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                      <CardContent className="p-4 text-center space-y-1">
                        <Icon className="h-5 w-5 mx-auto text-amber-400" aria-hidden="true" />
                        <div className="text-2xl font-bold" aria-label={`${label}: ${value}`}>
                          <AnimatedCounter value={value} />
                        </div>
                        <div className="text-xs text-muted-foreground">{label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 2. SKILL ROUTER ═══════════════════ */}
          <Section id="router" className="py-12">
            <div ref={setRef('router')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Skill Router</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-sm">Describe what you want to do — the router maps your intent to the optimal stack.</p>
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    placeholder="e.g. 'build a product', 'research AI agents', 'write SEO content'..."
                    className="pl-10 h-12 text-base bg-muted/30 border-border/50"
                    value={routerQuery}
                    onChange={(e) => setRouterQuery(e.target.value)}
                    aria-label="Describe your intent to route to a skill stack"
                  />
                  {routerQuery && (
                    <button onClick={() => setRouterQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear search">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {routerResult && (
                    <motion.div
                      key={routerResult.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl" aria-hidden="true">{routerResult.icon}</span>
                            <div>
                              <div className="font-bold text-lg">{routerResult.name}</div>
                              <Badge variant="outline" className={`text-xs ${getCatColor(routerResult.stack).text} ${getCatColor(routerResult.stack).border}`}>
                                → {routerResult.stack}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {routerResult.chain.map((s, i) => (
                              <span key={s} className="flex items-center gap-1.5">
                                <Badge variant="secondary" className="text-xs">{s}</Badge>
                                {i < routerResult!.chain.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted/50 px-2 py-1 rounded">{routerResult.trigger}</code>
                            <CopyBtn text={routerResult.trigger} label="Copy trigger command" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!routerResult && routerQuery.trim() && (
                  <p className="text-sm text-muted-foreground text-center" role="status">No matching intent found. Try keywords like &quot;build&quot;, &quot;write&quot;, &quot;research&quot;, &quot;design&quot;, &quot;decide&quot;, &quot;data&quot;, &quot;learn&quot;, or &quot;automate&quot;.</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2" role="list" aria-label="Intent domain shortcuts">
                  {INTENT_DOMAINS.map((d) => {
                    const colors = INTENT_COLORS[d.color] || { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' }
                    return (
                      <button
                        key={d.name}
                        onClick={() => setRouterQuery(d.keywords[0])}
                        className={`rounded-lg border ${colors.border} ${colors.bg} p-3 text-left hover:scale-[1.02] transition-transform`}
                        role="listitem"
                        aria-label={`Route to ${d.name}: ${d.trigger}`}
                      >
                        <span className="text-lg" aria-hidden="true">{d.icon}</span>
                        <div className={`text-sm font-medium ${colors.text}`}>{d.name}</div>
                        <div className="flex items-center gap-1">
                          <code className="text-[10px] text-muted-foreground">{d.trigger}</code>
                          <CopyBtn text={d.trigger} label={`Copy ${d.name} trigger`} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 3. PLAYBOOKS ═══════════════════ */}
          <Section id="playbooks" className="py-12">
            <div ref={setRef('playbooks')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Play className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Playbooks</h2>
                <Badge variant="secondary" className="text-xs">{PLAYBOOKS.length} playbooks</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PLAYBOOKS.map((pb) => (
                  <motion.div
                    key={pb.name}
                    variants={cardHover}
                    initial="rest"
                    whileHover="hover"
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-card/50 border-border/30 backdrop-blur-sm h-full">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <span aria-hidden="true">{pb.emoji}</span> {pb.name}
                          </CardTitle>
                          <CopyBtn text={pb.copyText} label={`Copy ${pb.name} command`} />
                        </div>
                        <CardDescription className="text-xs">{pb.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {pb.chain.map((s, i) => (
                            <span key={s} className="flex items-center gap-1">
                              <Badge variant="outline" className="text-[10px] h-5">{s}</Badge>
                              {i < pb.chain.length - 1 && <span className="text-muted-foreground text-[10px]" aria-hidden="true">→</span>}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <code className="text-[10px] bg-muted/50 px-1.5 py-0.5 rounded">{pb.trigger}</code>
                          <CopyBtn text={pb.trigger} label={`Copy trigger ${pb.trigger}`} />
                        </div>
                        {pb.whyItWorks && (
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{pb.whyItWorks}</p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 4. COMBO GENERATOR ═══════════════════ */}
          <Section id="combos" className="py-12">
            <div ref={setRef('combos')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Wand2 className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Combo Generator</h2>
              </div>
              <div className="max-w-3xl mx-auto space-y-4">
                <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                  <CardContent className="p-4 space-y-4">
                    {/* Name input */}
                    <Input
                      placeholder="Name your combo (optional)"
                      value={comboName}
                      onChange={(e) => setComboName(e.target.value)}
                      className="h-9 text-sm bg-muted/30"
                      aria-label="Combo name"
                    />
                    {/* Skill search */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      <Input
                        placeholder="Search and add skills..."
                        className="pl-8 h-9 text-sm bg-muted/30"
                        value={comboSearch}
                        onChange={(e) => setComboSearch(e.target.value)}
                        aria-label="Search skills to add to combo"
                      />
                      <AnimatePresence>
                        {comboFilteredSkills.length > 0 && (
                          <motion.div
                            className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            role="listbox"
                            aria-label="Skill suggestions"
                          >
                            {comboFilteredSkills.map((s) => (
                              <button
                                key={s.name}
                                onClick={() => addComboSkill(s.name)}
                                className="w-full px-3 py-2 text-left text-xs hover:bg-muted/50 flex items-center justify-between"
                                role="option"
                                aria-selected={false}
                                aria-label={`Add ${s.name} to combo`}
                              >
                                <span>{s.name}</span>
                                <span className="text-muted-foreground">{s.category}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Selected skills */}
                    <AnimatePresence>
                      {comboSkills.length > 0 && (
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="text-xs font-medium text-muted-foreground">Selected Skills ({comboSkills.length})</div>
                          <div className="space-y-1">
                            <AnimatePresence>
                              {comboSkills.map((s, i) => {
                                const skill = INSTALLED_SKILLS.find((sk) => sk.name === s)
                                const catColor = skill ? getCatColor(skill.category) : { text: '', border: '' }
                                return (
                                  <motion.div
                                    key={s}
                                    variants={comboSkillVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    layout
                                    className="flex items-center gap-2 bg-muted/20 rounded-lg px-3 py-2"
                                  >
                                    <div className="flex gap-0.5">
                                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveComboSkill(i, -1)} disabled={i === 0} aria-label={`Move ${s} up`}>
                                        <ArrowUp className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveComboSkill(i, 1)} disabled={i === comboSkills.length - 1} aria-label={`Move ${s} down`}>
                                        <ArrowDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <span className="text-xs font-medium flex-1">{s}</span>
                                    {skill && <Badge variant="outline" className={`text-[10px] h-5 ${catColor.text} ${catColor.border}`}>{skill.category}</Badge>}
                                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeComboSkill(s)} aria-label={`Remove ${s} from combo`}>
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </motion.div>
                                )
                              })}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Compatibility warnings with enhanced visual feedback */}
                    <AnimatePresence>
                      {(comboConflicts.length > 0 || comboSynergies.length > 0) && (
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          {comboConflicts.map((c, i) => (
                            <motion.div
                              key={`conflict-${i}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-start gap-2 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                              role="alert"
                            >
                              <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                              <div className="flex-1">
                                <span className="font-medium text-red-400">Conflict:</span> {c.skillA} ↔ {c.skillB} — {c.reason}
                              </div>
                            </motion.div>
                          ))}
                          {comboSynergies.map((c, i) => (
                            <motion.div
                              key={`synergy-${i}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-start gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                              <div className="flex-1">
                                <span className="font-medium text-emerald-400">Synergy:</span> {c.skillA} + {c.skillB} — {c.reason}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Smart suggestions */}
                    <AnimatePresence>
                      {comboSuggestions.length > 0 && (
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3" aria-hidden="true" /> Smart Suggestions
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {comboSuggestions.map((s) => (
                              <Button key={s} variant="outline" size="sm" className="h-6 text-xs gap-1" onClick={() => addComboSkill(s)} aria-label={`Add ${s} to combo`}>
                                <Plus className="h-3 w-3" aria-hidden="true" /> {s}
                              </Button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Copy format + Test this combo button */}
                    {comboSkills.length >= 2 && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                          <Select value={copyFormat} onValueChange={(v) => setCopyFormat(v as typeof copyFormat)}>
                            <SelectTrigger className="w-32 h-8 text-xs" aria-label="Copy format">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="chain">Chain</SelectItem>
                              <SelectItem value="list">List</SelectItem>
                              <SelectItem value="command">Command</SelectItem>
                              <SelectItem value="json">JSON</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex-1 bg-muted/30 rounded-lg px-3 py-2 text-xs font-mono truncate">
                            {comboCopyText}
                          </div>
                          <CopyBtn text={comboCopyText || ''} label="Copy combo" />
                        </div>
                        {/* Test this combo button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-9 text-xs gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          onClick={() => {
                            navigator.clipboard.writeText(`Run: ${comboSkills.join(' → ')}`)
                          }}
                          aria-label="Copy test command for this combo"
                        >
                          <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          Test this combo — copy command
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 5. STACKS ═══════════════════ */}
          <Section id="stacks" className="py-12">
            <div ref={setRef('stacks')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Skill Stacks</h2>
                <Badge variant="secondary" className="text-xs">{SKILL_COMBOS.length} stacks</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SKILL_COMBOS.map((combo) => {
                  const isExpanded = expandedStacks.has(combo.name)
                  return (
                    <motion.div
                      key={combo.name}
                      variants={cardHover}
                      initial="rest"
                      whileHover="hover"
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                              <span aria-hidden="true">{combo.emoji}</span> {combo.name}
                            </CardTitle>
                            <CopyBtn text={`${combo.name}: ${combo.skills.join(' → ')}`} label={`Copy ${combo.name} stack`} />
                          </div>
                          <CardDescription className="text-xs">{combo.tagline}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-1 space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {combo.skills.map((s, i) => (
                              <span key={s} className="flex items-center gap-1">
                                <Badge variant="outline" className="text-[10px] h-5">{s}</Badge>
                                {i < combo.skills.length - 1 && <span className="text-muted-foreground text-[10px]" aria-hidden="true">→</span>}
                              </span>
                            ))}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{combo.useCase}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] w-full"
                            onClick={() => toggleStack(combo.name)}
                            aria-label={isExpanded ? `Collapse ${combo.name} details` : `Expand ${combo.name} details`}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? 'Show Less' : 'Show Details'}
                            <ChevronUp className={`h-3 w-3 ml-1 transition-transform ${isExpanded ? '' : 'rotate-180'}`} aria-hidden="true" />
                          </Button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                className="space-y-2 pt-1 border-t border-border/30"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                              >
                                <div>
                                  <div className="text-[10px] font-semibold text-amber-400">Synergy</div>
                                  <p className="text-[10px] text-muted-foreground">{combo.synergy}</p>
                                </div>
                                <div>
                                  <div className="text-[10px] font-semibold text-emerald-400">Why Chosen</div>
                                  <p className="text-[10px] text-muted-foreground">{combo.whyChosen}</p>
                                </div>
                                <div>
                                  <div className="text-[10px] font-semibold text-cyan-400">Benefits vs Going Solo</div>
                                  <p className="text-[10px] text-muted-foreground">{combo.benefitsVs}</p>
                                </div>
                                <div>
                                  <div className="text-[10px] font-semibold text-rose-400">Common Misconceptions</div>
                                  <p className="text-[10px] text-muted-foreground">{combo.misconceptions}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 6. TOP SKILLS BY INSTALLS ═══════════════════ */}
          <Section id="top-skills" className="py-12">
            <div ref={setRef('top-skills')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Top Skills by Installs</h2>
              </div>
              <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-xs">#</TableHead>
                        <TableHead className="text-xs">Skill</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Source</TableHead>
                        <TableHead className="text-xs">Installs</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Category</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TOP_SKILLS.map((ts) => {
                        const catColor = getCatColor(ts.category)
                        return (
                          <TableRow key={ts.rank}>
                            <TableCell className="text-xs font-bold text-amber-400">{ts.rank}</TableCell>
                            <TableCell className="text-xs font-medium">
                              {ts.name}
                              {ts.isNew && <Badge className="ml-1.5 text-[9px] h-4 bg-emerald-500/15 text-emerald-400 border-emerald-500/30">NEW</Badge>}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{ts.source}</TableCell>
                            <TableCell className="text-xs font-mono">{ts.installs}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline" className={`text-[10px] h-5 ${catColor.text} ${catColor.border}`}>{ts.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <CopyBtn text={`Install: ${ts.name}`} label={`Copy install command for ${ts.name}`} />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 7. COMPATIBILITY ═══════════════════ */}
          <Section id="compatibility" className="py-12">
            <div ref={setRef('compatibility')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Compatibility Matrix</h2>
              </div>
              <Tabs defaultValue="synergies">
                <TabsList className="mb-4">
                  <TabsTrigger value="synergies" className="text-xs gap-1" aria-label="View synergies">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" aria-hidden="true" /> Synergies ({COMPATIBILITY.filter(c => c.type === 'synergy').length})
                  </TabsTrigger>
                  <TabsTrigger value="conflicts" className="text-xs gap-1" aria-label="View conflicts">
                    <AlertTriangle className="h-3 w-3 text-red-400" aria-hidden="true" /> Conflicts ({COMPATIBILITY.filter(c => c.type === 'conflict').length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="synergies">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMPATIBILITY.filter(c => c.type === 'synergy').map((c, i) => (
                      <div key={i} className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium">{c.skillA} + {c.skillB}</div>
                          <div className="text-[10px] text-muted-foreground">{c.reason}</div>
                        </div>
                        <CopyBtn text={`${c.skillA} + ${c.skillB}`} label={`Copy synergy: ${c.skillA} + ${c.skillB}`} />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="conflicts">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMPATIBILITY.filter(c => c.type === 'conflict').map((c, i) => (
                      <div key={i} className="flex items-start gap-2 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium">{c.skillA} ↔ {c.skillB}</div>
                          <div className="text-[10px] text-muted-foreground">{c.reason}</div>
                        </div>
                        <CopyBtn text={`${c.skillA} ↔ ${c.skillB}`} label={`Copy conflict: ${c.skillA} ↔ ${c.skillB}`} />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 8. STACK ROI ═══════════════════ */}
          <Section id="roi" className="py-12">
            <div ref={setRef('roi')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Stack ROI</h2>
              </div>
              <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Stack</TableHead>
                          <TableHead className="text-xs">Time w/o</TableHead>
                          <TableHead className="text-xs">Time w/</TableHead>
                          <TableHead className="text-xs">Quality w/o</TableHead>
                          <TableHead className="text-xs">Quality w/</TableHead>
                          <TableHead className="text-xs">Error ↓</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ROI_DATA.map((r) => (
                          <TableRow key={r.stack}>
                            <TableCell className="text-xs font-medium">{r.stack}</TableCell>
                            <TableCell className="text-xs text-red-400">{r.timeWithout}</TableCell>
                            <TableCell className="text-xs text-emerald-400">{r.timeWith}</TableCell>
                            <TableCell className="text-xs text-red-400">{r.qualityWithout}</TableCell>
                            <TableCell className="text-xs text-emerald-400">{r.qualityWith}</TableCell>
                            <TableCell className="text-xs text-amber-400 font-medium">{r.errorReduction}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 9. COMPARATIVE ANALYSIS ═══════════════════ */}
          <Section id="comparative" className="py-12">
            <div ref={setRef('comparative')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <ArrowRightLeft className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Comparative Analysis</h2>
              </div>
              <Accordion type="multiple" className="space-y-2">
                {SKILL_OVERLAPS.map((overlap) => (
                  <AccordionItem key={overlap.domain} value={overlap.domain} className="border border-border/30 rounded-lg px-4 bg-card/30">
                    <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline" aria-label={`Compare skills in ${overlap.domain}`}>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4 text-amber-400" aria-hidden="true" />
                        {overlap.domain}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-3">
                      {overlap.skills.map((s) => {
                        const skill = INSTALLED_SKILLS.find((sk) => sk.name === s.name)
                        const catColor = skill ? getCatColor(skill.category) : { text: '', border: '' }
                        return (
                          <div key={s.name} className="flex items-start gap-3 bg-muted/20 rounded-lg p-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold">{s.name}</span>
                                {skill && <Badge variant="outline" className={`text-[10px] h-4 ${catColor.text} ${catColor.border}`}>{s.approach}</Badge>}
                              </div>
                              <div className="text-[10px] text-muted-foreground">Best for: {s.bestFor}</div>
                            </div>
                          </div>
                        )
                      })}
                      <div className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" aria-hidden="true" /> Routing: {overlap.routing}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 10. UPGRADE PATHS ═══════════════════ */}
          <Section id="upgrades" className="py-12">
            <div ref={setRef('upgrades')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Upgrade Paths</h2>
              </div>
              <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Original</TableHead>
                          <TableHead className="text-xs w-8" />
                          <TableHead className="text-xs">Upgraded</TableHead>
                          <TableHead className="text-xs hidden sm:table-cell">New Capabilities</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {SKILL_UPGRADES.map((u) => {
                          const sc = STATUS_COLORS[u.status] || { bg: '', text: '', border: '' }
                          return (
                            <TableRow key={u.original}>
                              <TableCell className="text-xs">{u.original}</TableCell>
                              <TableCell className="text-xs text-amber-400 text-center" aria-hidden="true">→</TableCell>
                              <TableCell className="text-xs font-medium">{u.upgraded}</TableCell>
                              <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{u.newCapabilities}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`text-[10px] h-5 ${sc.text} ${sc.border}`}>{u.status}</Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 11. TYPED ERROR HANDLING ═══════════════════ */}
          <Section id="errors" className="py-12">
            <div ref={setRef('errors')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Typed Error Handling</h2>
              </div>
              <Accordion type="multiple" className="space-y-2">
                {ERROR_STANDARDS.map((es) => (
                  <AccordionItem key={es.skill} value={es.skill} className="border border-border/30 rounded-lg px-4 bg-card/30">
                    <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline" aria-label={`Error types for ${es.skill}`}>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400" aria-hidden="true" />
                        {es.skill}
                        <Badge variant="outline" className="text-[10px] h-4">{es.errorTypes.length} errors</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs">Type</TableHead>
                              <TableHead className="text-xs">Code</TableHead>
                              <TableHead className="text-xs">Action</TableHead>
                              <TableHead className="w-10" />
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {es.errorTypes.map((et) => (
                              <TableRow key={et.code}>
                                <TableCell className="text-xs font-mono">{et.type}</TableCell>
                                <TableCell className="text-xs">
                                  <code className="bg-muted/50 px-1.5 py-0.5 rounded text-amber-400">{et.code}</code>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{et.action}</TableCell>
                                <TableCell>
                                  <CopyBtn text={`${es.skill}.${et.type} [${et.code}]: ${et.action}`} label={`Copy error code ${et.code}`} />
                                </TableCell>
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
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 12. ERROR ESCALATION ═══════════════════ */}
          <Section id="escalation" className="py-12">
            <div ref={setRef('escalation')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <RefreshCw className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Error Escalation Chains</h2>
              </div>
              <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Trigger</TableHead>
                          <TableHead className="text-xs w-8" />
                          <TableHead className="text-xs">Escalate To</TableHead>
                          <TableHead className="text-xs hidden sm:table-cell">Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ESCALATION_CHAINS.map((ec, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs font-mono">{ec.trigger}</TableCell>
                            <TableCell className="text-xs text-amber-400 text-center" aria-hidden="true">→</TableCell>
                            <TableCell className="text-xs font-medium text-emerald-400">{ec.escalateTo}</TableCell>
                            <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{ec.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 13. DEPENDENCIES ═══════════════════ */}
          <Section id="dependencies" className="py-12">
            <div ref={setRef('dependencies')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <GitBranch className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Dependencies</h2>
              </div>
              <div className="space-y-3">
                {DEPENDENCIES.map((dep) => {
                  const skill = INSTALLED_SKILLS.find((s) => s.name === dep.skill)
                  const catColor = skill ? getCatColor(skill.category) : { text: '', border: '' }
                  return (
                    <motion.div
                      key={dep.skill}
                      variants={cardHover}
                      initial="rest"
                      whileHover="hover"
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{dep.skill}</span>
                                {skill && <Badge variant="outline" className={`text-[10px] h-4 ${catColor.text} ${catColor.border}`}>{skill.category}</Badge>}
                              </div>
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="text-[10px] text-muted-foreground">depends on:</span>
                                {dep.depends.map((d, i) => (
                                  <span key={d} className="flex items-center gap-1">
                                    <Badge variant="secondary" className="text-[10px] h-5">{d}</Badge>
                                    {i < dep.depends.length - 1 && <span className="text-muted-foreground text-[10px]" aria-hidden="true">+</span>}
                                  </span>
                                ))}
                              </div>
                              <p className="text-[10px] text-muted-foreground">{dep.reason}</p>
                            </div>
                            <CopyBtn text={dep.skill} label={`Copy ${dep.skill} name`} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 14. SELF-HEALING ═══════════════════ */}
          <Section id="healing" className="py-12">
            <div ref={setRef('healing')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Wrench className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Self-Healing Rules</h2>
              </div>
              <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Detect</TableHead>
                          <TableHead className="text-xs">Repair</TableHead>
                          <TableHead className="text-xs w-20">Severity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {HEALING_RULES.map((hr, i) => {
                          const sevColors: Record<string, string> = {
                            critical: 'text-red-400 bg-red-500/15 border-red-500/30',
                            warning: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
                            info: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
                          }
                          return (
                            <TableRow key={i}>
                              <TableCell className="text-xs font-mono">{hr.detect}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{hr.repair}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`text-[10px] h-5 ${sevColors[hr.severity] || ''}`}>{hr.severity}</Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 15. FAQ ═══════════════════ */}
          <Section id="faq" className="py-12">
            <div ref={setRef('faq')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Info className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              <Accordion type="multiple" className="space-y-2" role="region" aria-label="Frequently Asked Questions">
                {FAQ_DATA.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-border/30 rounded-lg px-4 bg-card/30">
                    <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline text-left" aria-label={faq.question}>
                      <div className="flex items-center gap-2 pr-4">
                        <HelpIcon className="h-3.5 w-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="flex items-start gap-2">
                        <p className="text-xs text-muted-foreground leading-relaxed flex-1">{faq.answer}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 16. FULL SKILL DIRECTORY (LAST SECTION) ═══════════════════ */}
          <Section id="directory" className="py-12">
            <div ref={setRef('directory')} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-bold">Full Skill Directory</h2>
                <Badge variant="secondary" className="text-xs">{INSTALLED_SKILLS.length} skills</Badge>
              </div>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  <Input
                    placeholder="Search skills..."
                    className="pl-8 h-9 text-sm bg-muted/30"
                    value={dirSearch}
                    onChange={(e) => setDirSearch(e.target.value)}
                    aria-label="Search skills in directory"
                  />
                </div>
                <Select value={dirCategory} onValueChange={setDirCategory}>
                  <SelectTrigger className="w-full sm:w-44 h-9 text-xs" aria-label="Filter by category">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {ALL_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Skills grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[800px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'oklch(0.4 0 0) transparent' }} role="list" aria-label="Skill directory">
                {filteredSkills.map((skill) => {
                  const catColor = getCatColor(skill.category)
                  const healthBadge = getHealthBadge(skill.healthScore)
                  return (
                    <motion.div
                      key={skill.name}
                      variants={cardHover}
                      initial="rest"
                      whileHover="hover"
                      transition={{ duration: 0.2 }}
                      role="listitem"
                    >
                      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-semibold">{skill.name}</span>
                                {skill.isNew && <Badge className="text-[8px] h-3.5 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 px-1">NEW</Badge>}
                              </div>
                              <p className="text-[10px] text-muted-foreground line-clamp-2">{skill.description}</p>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Badge variant="outline" className={`text-[9px] h-4 ${catColor.text} ${catColor.border}`}>{skill.category}</Badge>
                                <Badge variant="outline" className={`text-[9px] h-4 ${healthBadge.text} ${healthBadge.border}`}>{healthBadge.label} {skill.healthScore}</Badge>
                                <span className="text-[9px] text-muted-foreground">{skill.installs}</span>
                              </div>
                            </div>
                            <CopyBtn text={skill.name} label={`Copy ${skill.name}`} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
              {filteredSkills.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm" role="status">No skills match your filters.</div>
              )}
            </div>
          </Section>

        </main>

        {/* ── FOOTER ── */}
        <footer className="border-t border-border/30 py-6 text-center text-xs text-muted-foreground mt-auto" role="contentinfo">
          <p>AI Agent Skills Portal — {INSTALLED_SKILLS.length} Skills · {SKILL_COMBOS.length} Stacks · {PLAYBOOKS.length} Playbooks</p>
        </footer>
      </div>
      <ClipboardBasketFloating />
    </TooltipProvider>
    </ClipboardBasketProvider>
  )
}

// Minimal help icon since lucide doesn't export "Help"
function HelpIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
