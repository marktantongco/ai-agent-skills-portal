'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Search, Copy, Check, Moon, Sun,
  Terminal, Package, Layers, Trophy, Zap,
  ArrowUp, ArrowDown, Sparkles, X, AlertTriangle,
  Shield, ArrowRightLeft, Database,
  ChevronUp, GitBranch, Wrench, Cpu,
  ArrowRight, BarChart3,
  RefreshCw, AlertCircle, CheckCircle2, Info, Wand2, Play,
  Plus, Minus, ExternalLink
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

// ──────────────────────────────────────────────────────────
// SECTION CONFIG
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
// COPY BUTTON
// ──────────────────────────────────────────────────────────
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [text])
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 shrink-0"
      onClick={handleCopy}
      title={label || 'Copy'}
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
    </Button>
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

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

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
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background text-foreground">
        {/* ── TOP BAR ── */}
        <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-4 gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="font-bold text-sm hidden sm:inline">Skills Portal</span>
          </div>
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search skills, stacks, playbooks..."
                className="pl-8 h-8 text-xs bg-muted/50 border-border/50"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dev">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <Terminal className="h-3 w-3" />
                <span className="hidden sm:inline">Developer View</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDark(!dark)}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* ── FLOATING SIDE NAV ── */}
        <nav className="fixed left-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1.5">
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
                >
                  <Icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main className="pt-14 pb-16 pl-12 pr-4 md:px-16 lg:px-24 max-w-7xl mx-auto">

          {/* ═══════════════════ 1. HERO ═══════════════════ */}
          <section id="hero" ref={setRef('hero')} className="py-16 md:py-24">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-xs text-amber-400 font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                {INSTALLED_SKILLS.length} Skills · {SKILL_COMBOS.length} Stacks · {PLAYBOOKS.length} Playbooks
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent leading-tight">
                AI Agent Skills Portal
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                The definitive directory of AI agent skills with optimized stacks, playbooks, and one-prompt install commands.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto pt-6">
                {stats.map(({ label, value, icon: Icon }) => (
                  <Card key={label} className="bg-card/50 border-border/30 backdrop-blur-sm">
                    <CardContent className="p-4 text-center space-y-1">
                      <Icon className="h-5 w-5 mx-auto text-amber-400" />
                      <div className="text-2xl font-bold">{value}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 2. SKILL ROUTER ═══════════════════ */}
          <section id="router" ref={setRef('router')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Skill Router</h2>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">Describe what you want to do — the router maps your intent to the optimal stack.</p>
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. 'build a product', 'research AI agents', 'write SEO content'..."
                  className="pl-10 h-12 text-base bg-muted/30 border-border/50"
                  value={routerQuery}
                  onChange={(e) => setRouterQuery(e.target.value)}
                />
                {routerQuery && (
                  <button onClick={() => setRouterQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              {routerResult && (
                <Card className="bg-card/50 border-border/30">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{routerResult.icon}</span>
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
                          {i < routerResult!.chain.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted/50 px-2 py-1 rounded">{routerResult.trigger}</code>
                      <CopyBtn text={routerResult.trigger} label="Copy trigger" />
                    </div>
                  </CardContent>
                </Card>
              )}
              {!routerResult && routerQuery.trim() && (
                <p className="text-sm text-muted-foreground text-center">No matching intent found. Try keywords like &quot;build&quot;, &quot;write&quot;, &quot;research&quot;, &quot;design&quot;, &quot;decide&quot;, &quot;data&quot;, &quot;learn&quot;, or &quot;automate&quot;.</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {INTENT_DOMAINS.map((d) => {
                  const colors = INTENT_COLORS[d.color] || { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' }
                  return (
                    <button
                      key={d.name}
                      onClick={() => setRouterQuery(d.keywords[0])}
                      className={`rounded-lg border ${colors.border} ${colors.bg} p-3 text-left hover:scale-[1.02] transition-transform`}
                    >
                      <span className="text-lg">{d.icon}</span>
                      <div className={`text-sm font-medium ${colors.text}`}>{d.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{d.trigger}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 3. PLAYBOOKS ═══════════════════ */}
          <section id="playbooks" ref={setRef('playbooks')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Play className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Playbooks</h2>
              <Badge variant="secondary" className="text-xs">{PLAYBOOKS.length} playbooks</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PLAYBOOKS.map((pb) => (
                <Card key={pb.name} className="bg-card/50 border-border/30 hover:border-amber-500/30 transition-colors">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <span>{pb.emoji}</span> {pb.name}
                      </CardTitle>
                      <CopyBtn text={pb.copyText} label="Copy command" />
                    </div>
                    <CardDescription className="text-xs">{pb.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {pb.chain.map((s, i) => (
                        <span key={s} className="flex items-center gap-1">
                          <Badge variant="outline" className="text-[10px] h-5">{s}</Badge>
                          {i < pb.chain.length - 1 && <span className="text-muted-foreground text-[10px]">→</span>}
                        </span>
                      ))}
                    </div>
                    <code className="text-[10px] bg-muted/50 px-1.5 py-0.5 rounded block">{pb.trigger}</code>
                    {pb.whyItWorks && (
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{pb.whyItWorks}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 4. COMBO GENERATOR ═══════════════════ */}
          <section id="combos" ref={setRef('combos')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Wand2 className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Combo Generator</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <Card className="bg-card/50 border-border/30">
                <CardContent className="p-4 space-y-4">
                  {/* Name input */}
                  <Input
                    placeholder="Name your combo (optional)"
                    value={comboName}
                    onChange={(e) => setComboName(e.target.value)}
                    className="h-9 text-sm bg-muted/30"
                  />
                  {/* Skill search */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search and add skills..."
                      className="pl-8 h-9 text-sm bg-muted/30"
                      value={comboSearch}
                      onChange={(e) => setComboSearch(e.target.value)}
                    />
                    {comboFilteredSkills.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {comboFilteredSkills.map((s) => (
                          <button
                            key={s.name}
                            onClick={() => addComboSkill(s.name)}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-muted/50 flex items-center justify-between"
                          >
                            <span>{s.name}</span>
                            <span className="text-muted-foreground">{s.category}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Selected skills */}
                  {comboSkills.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Selected Skills ({comboSkills.length})</div>
                      <div className="space-y-1">
                        {comboSkills.map((s, i) => {
                          const skill = INSTALLED_SKILLS.find((sk) => sk.name === s)
                          const catColor = skill ? getCatColor(skill.category) : { text: '', border: '' }
                          return (
                            <div key={s} className="flex items-center gap-2 bg-muted/20 rounded-lg px-3 py-2">
                              <div className="flex gap-0.5">
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveComboSkill(i, -1)} disabled={i === 0}>
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveComboSkill(i, 1)} disabled={i === comboSkills.length - 1}>
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="text-xs font-medium flex-1">{s}</span>
                              {skill && <Badge variant="outline" className={`text-[10px] h-5 ${catColor.text} ${catColor.border}`}>{skill.category}</Badge>}
                              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeComboSkill(s)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  {/* Compatibility warnings */}
                  {(comboConflicts.length > 0 || comboSynergies.length > 0) && (
                    <div className="space-y-2">
                      {comboConflicts.map((c, i) => (
                        <div key={`conflict-${i}`} className="flex items-start gap-2 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-medium text-red-400">Conflict:</span> {c.skillA} ↔ {c.skillB} — {c.reason}
                          </div>
                          <CopyBtn text={`⚠️ Conflict: ${c.skillA} ↔ ${c.skillB} — ${c.reason}`} />
                        </div>
                      ))}
                      {comboSynergies.map((c, i) => (
                        <div key={`synergy-${i}`} className="flex items-start gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-medium text-emerald-400">Synergy:</span> {c.skillA} + {c.skillB} — {c.reason}
                          </div>
                          <CopyBtn text={`✓ Synergy: ${c.skillA} + ${c.skillB} — ${c.reason}`} />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Smart suggestions */}
                  {comboSuggestions.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Smart Suggestions
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {comboSuggestions.map((s) => (
                          <Button key={s} variant="outline" size="sm" className="h-6 text-xs gap-1" onClick={() => addComboSkill(s)}>
                            <Plus className="h-3 w-3" /> {s}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Copy format */}
                  {comboSkills.length >= 2 && (
                    <div className="flex items-center gap-2 pt-2">
                      <Select value={copyFormat} onValueChange={(v) => setCopyFormat(v as typeof copyFormat)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
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
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 5. STACKS ═══════════════════ */}
          <section id="stacks" ref={setRef('stacks')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Skill Stacks</h2>
              <Badge variant="secondary" className="text-xs">{SKILL_COMBOS.length} stacks</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SKILL_COMBOS.map((combo) => {
                const isExpanded = expandedStacks.has(combo.name)
                return (
                  <Card key={combo.name} className="bg-card/50 border-border/30 hover:border-amber-500/20 transition-colors">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <span>{combo.emoji}</span> {combo.name}
                        </CardTitle>
                        <CopyBtn text={`${combo.name}: ${combo.skills.join(' → ')}`} />
                      </div>
                      <CardDescription className="text-xs">{combo.tagline}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-1 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {combo.skills.map((s, i) => (
                          <span key={s} className="flex items-center gap-1">
                            <Badge variant="outline" className="text-[10px] h-5">{s}</Badge>
                            {i < combo.skills.length - 1 && <span className="text-muted-foreground text-[10px]">→</span>}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{combo.useCase}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] w-full"
                        onClick={() => toggleStack(combo.name)}
                      >
                        {isExpanded ? 'Show Less' : 'Show Details'}
                        <ChevronUp className={`h-3 w-3 ml-1 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
                      </Button>
                      {isExpanded && (
                        <div className="space-y-2 pt-1 border-t border-border/30">
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
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 6. TOP SKILLS BY INSTALLS ═══════════════════ */}
          <section id="top-skills" ref={setRef('top-skills')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Top Skills by Installs</h2>
            </div>
            <Card className="bg-card/50 border-border/30">
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
                            <CopyBtn text={`Install: ${ts.name}`} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 7. COMPATIBILITY ═══════════════════ */}
          <section id="compatibility" ref={setRef('compatibility')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Compatibility Matrix</h2>
            </div>
            <Tabs defaultValue="synergies">
              <TabsList className="mb-4">
                <TabsTrigger value="synergies" className="text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Synergies ({COMPATIBILITY.filter(c => c.type === 'synergy').length})
                </TabsTrigger>
                <TabsTrigger value="conflicts" className="text-xs gap-1">
                  <AlertTriangle className="h-3 w-3 text-red-400" /> Conflicts ({COMPATIBILITY.filter(c => c.type === 'conflict').length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="synergies">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMPATIBILITY.filter(c => c.type === 'synergy').map((c, i) => (
                    <div key={i} className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium">{c.skillA} + {c.skillB}</div>
                        <div className="text-[10px] text-muted-foreground">{c.reason}</div>
                      </div>
                      <CopyBtn text={`${c.skillA} + ${c.skillB}: ${c.reason}`} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="conflicts">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMPATIBILITY.filter(c => c.type === 'conflict').map((c, i) => (
                    <div key={i} className="flex items-start gap-2 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium">{c.skillA} ↔ {c.skillB}</div>
                        <div className="text-[10px] text-muted-foreground">{c.reason}</div>
                      </div>
                      <CopyBtn text={`⚠️ ${c.skillA} ↔ ${c.skillB}: ${c.reason}`} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 8. STACK ROI ═══════════════════ */}
          <section id="roi" ref={setRef('roi')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Stack ROI</h2>
            </div>
            <Card className="bg-card/50 border-border/30">
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
                        <TableHead className="w-10" />
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
                          <TableCell>
                            <CopyBtn text={`ROI: ${r.stack} — Time: ${r.timeWithout}→${r.timeWith}, Quality: ${r.qualityWithout}→${r.qualityWith}, Error↓${r.errorReduction}`} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 9. COMPARATIVE ANALYSIS ═══════════════════ */}
          <section id="comparative" ref={setRef('comparative')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <ArrowRightLeft className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Comparative Analysis</h2>
            </div>
            <Accordion type="multiple" className="space-y-2">
              {SKILL_OVERLAPS.map((overlap) => (
                <AccordionItem key={overlap.domain} value={overlap.domain} className="border border-border/30 rounded-lg px-4 bg-card/30">
                  <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="h-4 w-4 text-amber-400" />
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
                          <CopyBtn text={`${s.name} (${s.approach}): ${s.bestFor}`} />
                        </div>
                      )
                    })}
                    <div className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                      <ArrowRight className="h-3 w-3" /> Routing: {overlap.routing}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 10. UPGRADE PATHS ═══════════════════ */}
          <section id="upgrades" ref={setRef('upgrades')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Upgrade Paths</h2>
            </div>
            <Card className="bg-card/50 border-border/30">
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
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {SKILL_UPGRADES.map((u) => {
                        const sc = STATUS_COLORS[u.status] || { bg: '', text: '', border: '' }
                        return (
                          <TableRow key={u.original}>
                            <TableCell className="text-xs">{u.original}</TableCell>
                            <TableCell className="text-xs text-amber-400 text-center">→</TableCell>
                            <TableCell className="text-xs font-medium">{u.upgraded}</TableCell>
                            <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{u.newCapabilities}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] h-5 ${sc.text} ${sc.border}`}>{u.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <CopyBtn text={`${u.original} → ${u.upgraded}: ${u.newCapabilities} [${u.status}]`} />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 11. TYPED ERROR HANDLING ═══════════════════ */}
          <section id="errors" ref={setRef('errors')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Typed Error Handling</h2>
            </div>
            <Accordion type="multiple" className="space-y-2">
              {ERROR_STANDARDS.map((es) => (
                <AccordionItem key={es.skill} value={es.skill} className="border border-border/30 rounded-lg px-4 bg-card/30">
                  <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400" />
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
                                <CopyBtn text={`${es.skill}.${et.type} [${et.code}]: ${et.action}`} />
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
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 12. ERROR ESCALATION ═══════════════════ */}
          <section id="escalation" ref={setRef('escalation')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Error Escalation Chains</h2>
            </div>
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Trigger</TableHead>
                        <TableHead className="text-xs w-8" />
                        <TableHead className="text-xs">Escalate To</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Reason</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ESCALATION_CHAINS.map((ec, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs font-mono">{ec.trigger}</TableCell>
                          <TableCell className="text-xs text-amber-400 text-center">→</TableCell>
                          <TableCell className="text-xs font-medium text-emerald-400">{ec.escalateTo}</TableCell>
                          <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{ec.reason}</TableCell>
                          <TableCell>
                            <CopyBtn text={`${ec.trigger} → ${ec.escalateTo}: ${ec.reason}`} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 13. DEPENDENCIES ═══════════════════ */}
          <section id="dependencies" ref={setRef('dependencies')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <GitBranch className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Dependencies</h2>
            </div>
            <div className="space-y-3">
              {DEPENDENCIES.map((dep) => {
                const skill = INSTALLED_SKILLS.find((s) => s.name === dep.skill)
                const catColor = skill ? getCatColor(skill.category) : { text: '', border: '' }
                return (
                  <Card key={dep.skill} className="bg-card/50 border-border/30">
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
                                {i < dep.depends.length - 1 && <span className="text-muted-foreground text-[10px]">+</span>}
                              </span>
                            ))}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{dep.reason}</p>
                        </div>
                        <CopyBtn text={`${dep.skill} depends on: ${dep.depends.join(', ')} — ${dep.reason}`} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 14. SELF-HEALING ═══════════════════ */}
          <section id="healing" ref={setRef('healing')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Self-Healing Rules</h2>
            </div>
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Detect</TableHead>
                        <TableHead className="text-xs">Repair</TableHead>
                        <TableHead className="text-xs w-20">Severity</TableHead>
                        <TableHead className="w-10" />
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
                            <TableCell>
                              <CopyBtn text={`Detect: ${hr.detect} | Repair: ${hr.repair} | Severity: ${hr.severity}`} />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 15. FAQ ═══════════════════ */}
          <section id="faq" ref={setRef('faq')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="multiple" className="space-y-2">
              {FAQ_DATA.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border/30 rounded-lg px-4 bg-card/30">
                  <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline text-left">
                    <div className="flex items-center gap-2 pr-4">
                      <HelpIcon className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="flex items-start gap-2">
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1">{faq.answer}</p>
                      <CopyBtn text={`Q: ${faq.question}\nA: ${faq.answer}`} label="Copy Q&A" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <Separator className="my-4 bg-border/30" />

          {/* ═══════════════════ 16. FULL SKILL DIRECTORY ═══════════════════ */}
          <section id="directory" ref={setRef('directory')} className="py-12">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Full Skill Directory</h2>
              <Badge variant="secondary" className="text-xs">{INSTALLED_SKILLS.length} skills</Badge>
            </div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  className="pl-8 h-9 text-sm bg-muted/30"
                  value={dirSearch}
                  onChange={(e) => setDirSearch(e.target.value)}
                />
              </div>
              <Select value={dirCategory} onValueChange={setDirCategory}>
                <SelectTrigger className="w-full sm:w-44 h-9 text-xs">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[800px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'oklch(0.4 0 0) transparent' }}>
              {filteredSkills.map((skill) => {
                const catColor = getCatColor(skill.category)
                const healthBadge = getHealthBadge(skill.healthScore)
                return (
                  <Card key={skill.name} className="bg-card/50 border-border/30 hover:border-amber-500/20 transition-colors">
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
                        <CopyBtn text={`${skill.name} [${skill.category}] Health:${skill.healthScore} — ${skill.description}`} label="Copy skill info" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            {filteredSkills.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">No skills match your filters.</div>
            )}
          </section>

        </main>

        {/* ── FOOTER ── */}
        <footer className="border-t border-border/30 py-6 text-center text-xs text-muted-foreground">
          <p>AI Agent Skills Portal — {INSTALLED_SKILLS.length} Skills · {SKILL_COMBOS.length} Stacks · {PLAYBOOKS.length} Playbooks</p>
        </footer>
      </div>
    </TooltipProvider>
  )
}

// Minimal help icon since lucide doesn't export "Help"
function HelpIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
