'use client'

import { useState, useMemo, useCallback, useEffect, useRef, Fragment } from 'react'
import Link from 'next/link'
import {
  Copy, Check, ChevronDown, ChevronUp, ChevronRight,
  Search, X, ArrowRight, ArrowUp, ArrowDown, Command,
  Menu, Terminal, Zap, Shield, AlertTriangle, Activity,
  BookOpen, Layers, GitBranch, Heart, HelpCircle, Database
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from '@/components/ui/accordion'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { AnimatePresence, motion } from 'framer-motion'
import {
  INSTALLED_SKILLS, SKILL_COMBOS, PLAYBOOKS, INTENT_DOMAINS, ESCALATION_CHAINS,
  COMPATIBILITY, DEPENDENCIES, HEALING_RULES, ROI_DATA, TOP_SKILLS, SKILL_OVERLAPS,
  SKILL_UPGRADES, ERROR_STANDARDS, FAQ_DATA, ALL_CATEGORIES, AVG_HEALTH,
  getCatColor, getHealthBadge, STATUS_COLORS, INTENT_COLORS
} from '@/lib/skills-data'
import type { Skill, SkillCombo, Playbook, IntentDomain, FAQItem } from '@/lib/skills-data'
import { ClipboardBasketProvider, useClipboardBasketSafe, ClipboardBasketFloating } from '@/lib/clipboard-basket'

// ──────────────────────────────────────────────────────────
// SECTION LABELS & ZONE COLORS
// ──────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero', label: '001 — HERO', accent: '#a78bfa', icon: Zap },
  { id: 'router', label: '002 — ROUTER', accent: '#4DFFFF', icon: Terminal },
  { id: 'playbooks', label: '003 — PLAYBOOKS', accent: '#FFB000', icon: BookOpen },
  { id: 'combos', label: '004 — COMBOS', accent: '#FF6B00', icon: Layers },
  { id: 'stacks', label: '005 — STACKS', accent: '#22c55e', icon: Database },
  { id: 'top-skills', label: '006 — TOP SKILLS', accent: '#FFD700', icon: Activity },
  { id: 'compatibility', label: '007 — COMPATIBILITY', accent: '#22c55e', icon: Heart },
  { id: 'roi', label: '008 — STACK ROI', accent: '#FFB000', icon: Activity },
  { id: 'analysis', label: '009 — ANALYSIS', accent: '#a78bfa', icon: Search },
  { id: 'upgrades', label: '010 — UPGRADES', accent: '#4DFFFF', icon: GitBranch },
  { id: 'errors', label: '011 — ERROR HANDLING', accent: '#ff3b30', icon: AlertTriangle },
  { id: 'escalation', label: '012 — ESCALATION', accent: '#FF6B00', icon: AlertTriangle },
  { id: 'dependencies', label: '013 — DEPENDENCIES', accent: '#FFB000', icon: GitBranch },
  { id: 'healing', label: '014 — SELF-HEALING', accent: '#22c55e', icon: Shield },
  { id: 'faq', label: '015 — FAQ', accent: '#a78bfa', icon: HelpCircle },
  { id: 'directory', label: '016 — DIRECTORY', accent: '#4DFFFF', icon: Database },
] as const

// ──────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ──────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.04 } }
}

const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
}

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────
function CopyBtn({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const { addItem: addItemToBasket } = useClipboardBasketSafe()
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    if (addItemToBasket) addItemToBasket(text)
    setTimeout(() => setCopied(false), 1500)
  }, [text, addItemToBasket])
  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.97 }}
      className={`font-mono text-[9px] tracking-wider uppercase shrink-0 transition-colors duration-150 ${
        copied
          ? 'text-[#22c55e]'
          : 'text-[#A1A1AA] hover:text-white'
      } ${className}`}
    >
      {copied ? '✓ copied' : '[copy]'}
    </motion.button>
  )
}

function SectionLabel({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <span
      className="font-mono text-[9px] tracking-[0.3em] uppercase"
      style={{ color: accent ? `${accent}88` : 'rgba(167,139,250,0.5)' }}
    >
      {children}
    </span>
  )
}

function TerminalBlock({ children, title, accent = '#a78bfa' }: { children: React.ReactNode; title?: string; accent?: string }) {
  return (
    <div className="bg-[#0B0D10] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        {title && (
          <span className="ml-2 font-mono text-[9px] tracking-wider uppercase text-[rgba(255,255,255,0.25)]">
            {title}
          </span>
        )}
      </div>
      <div className="p-3 font-mono text-xs text-[#A1A1AA]">{children}</div>
    </div>
  )
}

function SkillBadge({ name, accent }: { name: string; accent?: string }) {
  return (
    <span
      className="font-mono text-[10px] px-2 py-0.5 rounded-md border text-[#FFFFFF] bg-[rgba(255,255,255,0.03)] inline-block"
      style={{
        borderColor: accent ? `${accent}30` : 'rgba(255,255,255,0.07)',
      }}
    >
      {name}
    </span>
  )
}

function ArrowChain() {
  return <span className="font-mono text-[10px] text-[rgba(255,255,255,0.2)] mx-0.5">→</span>
}

function HealthDot({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#FFB000' : score >= 40 ? '#FF6B00' : '#ff3b30'
  return (
    <span className="inline-block w-2 h-2 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: color }} />
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const cfg = severity === 'critical'
    ? 'bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/20'
    : severity === 'warning'
      ? 'bg-[#FFB000]/10 text-[#FFB000] border-[#FFB000]/20'
      : 'bg-[#4DFFFF]/10 text-[#4DFFFF] border-[#4DFFFF]/20'
  return (
    <span className={`font-mono text-[9px] px-1.5 py-0.5 border rounded-md uppercase tracking-wider ${cfg}`}>
      {severity}
    </span>
  )
}

function GlowCard({
  children,
  accent = '#a78bfa',
  className = '',
}: {
  children: React.ReactNode
  accent?: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 transition-shadow duration-200 hover:shadow-[0_0_20px_${accent}15] ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────
// COMMAND PALETTE
// ──────────────────────────────────────────────────────────
function CommandPalette({
  open,
  onClose,
  onSelectSection,
}: {
  open: boolean
  onClose: () => void
  onSelectSection: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const items: { type: string; label: string; id: string; sub: string }[] = []

    // Search sections
    for (const sec of SECTIONS) {
      if (sec.label.toLowerCase().includes(q) || sec.id.toLowerCase().includes(q)) {
        items.push({ type: 'Section', label: sec.label, id: sec.id, sub: 'Jump to section' })
      }
    }

    // Search skills
    for (const s of INSTALLED_SKILLS) {
      if (s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
        items.push({ type: 'Skill', label: s.name, id: 'directory', sub: s.category })
      }
    }

    // Search stacks
    for (const c of SKILL_COMBOS) {
      if (c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)) {
        items.push({ type: 'Stack', label: c.name, id: 'stacks', sub: c.tagline })
      }
    }

    // Search playbooks
    for (const p of PLAYBOOKS) {
      if (p.name.toLowerCase().includes(q) || p.trigger.toLowerCase().includes(q)) {
        items.push({ type: 'Playbook', label: `${p.emoji} ${p.name}`, id: 'playbooks', sub: p.trigger })
      }
    }

    return items.slice(0, 20)
  }, [query])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>()
    for (const item of results) {
      const arr = map.get(item.type) || []
      arr.push(item)
      map.set(item.type, arr)
    }
    return map
  }, [results])

  const typeColors: Record<string, string> = {
    Section: '#a78bfa',
    Skill: '#4DFFFF',
    Stack: '#22c55e',
    Playbook: '#FFB000',
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-lg z-[101] bg-[#14161A] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
              <Search size={14} className="text-[#A1A1AA]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search skills, stacks, playbooks..."
                className="flex-1 bg-transparent outline-none text-white placeholder:text-[#6B7280] font-mono text-sm"
              />
              <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.1)] text-[#6B7280]">ESC</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {query.trim() === '' && (
                <div className="px-3 py-6 text-center font-mono text-xs text-[#6B7280]">
                  Type to search across {INSTALLED_SKILLS.length} skills, {SKILL_COMBOS.length} stacks, {PLAYBOOKS.length} playbooks
                </div>
              )}
              {query.trim() !== '' && results.length === 0 && (
                <div className="px-3 py-6 text-center font-mono text-xs text-[#6B7280]">
                  No results found
                </div>
              )}
              {Array.from(grouped.entries()).map(([type, items]) => (
                <div key={type}>
                  <div className="px-3 py-1.5 font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: typeColors[type] || '#A1A1AA' }}>
                    {type}
                  </div>
                  {items.map((item, i) => (
                    <button
                      key={`${type}-${i}`}
                      onClick={() => {
                        onSelectSection(item.id)
                        onClose()
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-mono text-xs text-white truncate">{item.label}</div>
                        <div className="font-mono text-[9px] text-[#6B7280] truncate">{item.sub}</div>
                      </div>
                      <ChevronRight size={12} className="text-[#6B7280] shrink-0" />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ──────────────────────────────────────────────────────────
// MAIN PAGE
// ──────────────────────────────────────────────────────────
export default function DevPortalPage() {
  // State
  const [routerQuery, setRouterQuery] = useState('')
  const [comboSelected, setComboSelected] = useState<string[]>([])
  const [comboName, setComboName] = useState('')
  const [comboFormat, setComboFormat] = useState<'chain' | 'list' | 'command' | 'json'>('chain')
  const [searchQuery, setSearchQuery] = useState('')
  const [dirCategory, setDirCategory] = useState('All')
  const [activeSection, setActiveSection] = useState('hero')
  const [navOpen, setNavOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [sortField, setSortField] = useState<'rank' | 'name' | 'installs' | 'category'>('rank')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [expandedStacks, setExpandedStacks] = useState<Set<string>>(new Set())

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const mainRef = useRef<HTMLDivElement>(null)

  // Router logic
  const routerResult = useMemo(() => {
    if (!routerQuery.trim()) return null
    const q = routerQuery.toLowerCase()
    let best: IntentDomain | null = null
    let bestScore = 0
    for (const domain of INTENT_DOMAINS) {
      let score = 0
      for (const kw of domain.keywords) {
        if (q.includes(kw)) score += kw.length
      }
      if (score > bestScore) { bestScore = score; best = domain }
    }
    return best
  }, [routerQuery])

  // Combo output
  const comboOutput = useMemo(() => {
    if (comboSelected.length === 0) return ''
    const name = comboName || 'custom-stack'
    switch (comboFormat) {
      case 'chain': return `${name}: ${comboSelected.join(' → ')}`
      case 'list': return comboSelected.map((s, i) => `${i + 1}. ${s}`).join('\n')
      case 'command': return `Run: ${comboSelected.join(' → ')}`
      case 'json': return JSON.stringify({ name, skills: comboSelected }, null, 2)
    }
  }, [comboSelected, comboName, comboFormat])

  // Combo conflicts
  const comboConflicts = useMemo(() => {
    if (comboSelected.length < 2) return []
    return COMPATIBILITY.filter(c =>
      c.type === 'conflict' && comboSelected.includes(c.skillA) && comboSelected.includes(c.skillB)
    )
  }, [comboSelected])

  // Combo synergies
  const comboSynergies = useMemo(() => {
    if (comboSelected.length < 2) return []
    return COMPATIBILITY.filter(c =>
      c.type === 'synergy' && comboSelected.includes(c.skillA) && comboSelected.includes(c.skillB)
    )
  }, [comboSelected])

  // Directory filtering
  const filteredSkills = useMemo(() => {
    let skills = INSTALLED_SKILLS
    if (dirCategory !== 'All') skills = skills.filter(s => s.category === dirCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      skills = skills.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      )
    }
    return skills
  }, [dirCategory, searchQuery])

  // Sorted top skills
  const sortedTopSkills = useMemo(() => {
    const arr = [...TOP_SKILLS]
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      if (sortField === 'rank') return (a.rank - b.rank) * dir
      if (sortField === 'name') return a.name.localeCompare(b.name) * dir
      if (sortField === 'category') return a.category.localeCompare(b.category) * dir
      return 0
    })
    return arr
  }, [sortField, sortDir])

  // Scroll progress
  useEffect(() => {
    const handler = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )
    for (const sec of SECTIONS) {
      const el = sectionRefs.current[sec.id]
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(p => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Scroll to section
  const scrollToSection = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setNavOpen(false)
  }, [])

  const toggleComboSkill = useCallback((name: string) => {
    setComboSelected(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }, [])

  const toggleSort = useCallback((field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }, [sortField])

  const toggleStack = useCallback((name: string) => {
    setExpandedStacks(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const currentSection = SECTIONS.find(s => s.id === activeSection)

  // ────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────
  return (
    <ClipboardBasketProvider>
    <div className="min-h-screen bg-[#0B0D10] text-white flex">
      {/* ─── SCROLL PROGRESS BAR ─── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
        <div
          className="h-full transition-[width] duration-100"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #a78bfa, #4DFFFF, #FFB000)',
          }}
        />
      </div>

      {/* ─── LEFT SIDEBAR NAV ─── */}
      <nav className="hidden lg:flex flex-col w-52 shrink-0 border-r border-[rgba(255,255,255,0.07)] bg-[#0B0D10] sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-[rgba(255,255,255,0.07)]">
          <Link href="/" className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#a78bfa] hover:text-[#4DFFFF] transition-colors">
            ← public
          </Link>
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-white mt-2">
            SKILLS://DEV
          </div>
        </div>
        <div className="flex-1 py-2">
          {SECTIONS.map(sec => {
            const isActive = activeSection === sec.id
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-4 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase transition-all duration-150 border-l-2 ${
                  isActive
                    ? 'bg-[rgba(255,255,255,0.03)]'
                    : 'border-transparent text-[#6B7280] hover:text-[#A1A1AA]'
                }`}
                style={{
                  color: isActive ? sec.accent : undefined,
                  borderColor: isActive ? sec.accent : undefined,
                }}
              >
                {sec.label}
              </button>
            )
          })}
        </div>
        <div className="p-3 border-t border-[rgba(255,255,255,0.07)]">
          <button
            onClick={() => setPaletteOpen(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] text-[#6B7280] hover:text-white hover:border-[rgba(255,255,255,0.15)] transition-colors"
          >
            <Search size={12} />
            <span className="font-mono text-[9px] flex-1 text-left">Search...</span>
            <kbd className="font-mono text-[8px] px-1 py-0.5 rounded border border-[rgba(255,255,255,0.1)]">⌘K</kbd>
          </button>
        </div>
      </nav>

      {/* ─── STICKY TOP NAV (frosted glass) ─── */}
      <div className="fixed top-[2px] left-0 lg:left-52 right-0 z-50">
        <div className="backdrop-blur-xl bg-[#0B0D10]/80 border-b border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center justify-between px-4 sm:px-6 h-10">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button onClick={() => setNavOpen(!navOpen)} className="lg:hidden text-[#A1A1AA]">
                {navOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
              <Link href="/" className="lg:hidden font-mono text-[9px] tracking-[0.2em] uppercase text-[#a78bfa]">
                ← public
              </Link>
              <span className="hidden sm:inline font-mono text-[10px] tracking-[0.15em] uppercase text-[#A1A1AA]">
                {currentSection?.label || 'SKILLS://DEV'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] text-[#6B7280] hover:text-white hover:border-[rgba(255,255,255,0.15)] transition-colors"
              >
                <Search size={12} />
                <span className="font-mono text-[9px]">Search...</span>
                <kbd className="font-mono text-[8px] px-1 py-0.5 rounded border border-[rgba(255,255,255,0.1)]">⌘K</kbd>
              </button>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#a78bfa]">
                DEV
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE NAV DROPDOWN ─── */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-[42px] left-0 right-0 z-40 bg-[#0B0D10] border-b border-[rgba(255,255,255,0.07)] overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto py-2">
              {SECTIONS.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-4 py-1.5 font-mono text-[9px] tracking-[0.15em] uppercase ${
                    activeSection === sec.id ? 'text-[#a78bfa] bg-[rgba(167,139,250,0.05)]' : 'text-[#6B7280]'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── COMMAND PALETTE ─── */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectSection={scrollToSection}
      />

      {/* ─── MAIN CONTENT ─── */}
      <main ref={mainRef} className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 lg:pt-12">

          {/* ═══════════ 001 — HERO ═══════════ */}
          <section id="hero" ref={el => { sectionRefs.current['hero'] = el }} className="pt-8 lg:pt-4 pb-10">
            <SectionLabel accent="#a78bfa">001 — Hero</SectionLabel>
            <motion.h1
              {...fadeUp}
              className="mt-4 font-bold text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.12em] leading-none"
            >
              DEVELOPER<br />
              <span className="text-[#a78bfa]">PORTAL</span>
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="mt-4 font-mono text-xs text-[#A1A1AA] max-w-xl"
            >
              <span className="text-[#4DFFFF]">❯</span> {INSTALLED_SKILLS.length} skills. {SKILL_COMBOS.length} stacks. {PLAYBOOKS.length} playbooks. {INTENT_DOMAINS.length} router commands. Complete system reference for the AI Agent Skills Platform.
            </motion.p>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {[
                { label: 'skills', value: INSTALLED_SKILLS.length, accent: '#a78bfa' },
                { label: 'stacks', value: SKILL_COMBOS.length, accent: '#4DFFFF' },
                { label: 'playbooks', value: PLAYBOOKS.length, accent: '#FFB000' },
                { label: 'avg health', value: AVG_HEALTH, accent: '#22c55e' },
              ].map(stat => (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="p-4 bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl hover:shadow-[0_0_20px_rgba(167,139,250,0.1)] transition-shadow duration-200"
                >
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#6B7280]">{stat.label}</div>
                  <div className="mt-1 text-2xl font-bold" style={{ color: stat.accent }}>{stat.value}</div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ═══════════ 002 — SKILL ROUTER ═══════════ */}
          <section id="router" ref={el => { sectionRefs.current['router'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#4DFFFF">002 — Router</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Skill Router
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              Intent → Stack mapping · {INTENT_DOMAINS.length} commands
            </p>
            <div className="mt-4">
              <TerminalBlock title="skill-router" accent="#4DFFFF">
                <div className="flex items-center gap-2">
                  <span className="text-[#4DFFFF]">❯</span>
                  <input
                    type="text"
                    value={routerQuery}
                    onChange={e => setRouterQuery(e.target.value)}
                    placeholder="type your intent... (e.g. launch, research, design)"
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-[#6B7280] font-mono text-xs"
                  />
                  {routerQuery && (
                    <button onClick={() => setRouterQuery('')} className="text-[#6B7280] hover:text-white transition-colors">
                      <X size={12} />
                    </button>
                  )}
                </div>
                {routerResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.07)]"
                  >
                    <div className="text-[#22c55e] text-[10px] tracking-wider uppercase mb-2">
                      matched: {routerResult.name}
                    </div>
                    <div className="text-[#A1A1AA] text-[10px] mb-1">
                      stack: <span className="text-white">{routerResult.stack}</span>
                    </div>
                    <div className="text-[#A1A1AA] text-[10px] mb-2">
                      trigger: <span className="text-[#4DFFFF]">{routerResult.trigger}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-0.5">
                      {routerResult.chain.map((s, i) => (
                        <Fragment key={s}>
                          <SkillBadge name={s} accent="#4DFFFF" />
                          {i < routerResult.chain.length - 1 && <ArrowChain />}
                        </Fragment>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center">
                      <CopyBtn text={`Run: ${routerResult.chain.join(' → ')}`} />
                    </div>
                  </motion.div>
                )}
                {!routerResult && routerQuery.trim() && (
                  <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.07)] text-[#6B7280] text-[10px]">
                    no match — try: build, write, research, design, decide, data, learn, automate
                  </div>
                )}
              </TerminalBlock>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INTENT_DOMAINS.map(d => {
                const colors = INTENT_COLORS[d.color]
                return (
                  <motion.button
                    key={d.name}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRouterQuery(d.keywords[0])}
                    className={`p-3 rounded-xl text-left bg-[#14161A] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] transition-colors ${colors?.bg || ''}`}
                  >
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: d.color === 'amber' ? '#FFB000' : d.color === 'orange' ? '#FF6B00' : d.color === 'cyan' ? '#4DFFFF' : d.color === 'pink' ? '#ec4899' : d.color === 'emerald' ? '#22c55e' : '#a78bfa' }}>
                      {d.icon} {d.name}
                    </div>
                    <div className="font-mono text-[9px] text-[#6B7280] mt-1">{d.trigger}</div>
                  </motion.button>
                )
              })}
            </div>
          </section>

          {/* ═══════════ 003 — PLAYBOOKS ═══════════ */}
          <section id="playbooks" ref={el => { sectionRefs.current['playbooks'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#FFB000">003 — Playbooks</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Playbooks
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              {PLAYBOOKS.length} pre-built execution scripts
            </p>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-40px' }}
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {PLAYBOOKS.map(pb => (
                <motion.div key={pb.name} variants={staggerItem}>
                  <GlowCard accent="#FFB000">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-sm mr-1">{pb.emoji}</span>
                        <span className="font-bold text-sm uppercase tracking-wider text-white">{pb.name}</span>
                      </div>
                      <CopyBtn text={pb.copyText} />
                    </div>
                    <p className="font-mono text-[10px] text-[#A1A1AA] mt-1">{pb.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-0.5">
                      {pb.chain.map((s, i) => (
                        <Fragment key={s}>
                          <SkillBadge name={s} accent="#FFB000" />
                          {i < pb.chain.length - 1 && <ArrowChain />}
                        </Fragment>
                      ))}
                    </div>
                    <div className="mt-2 font-mono text-[9px] text-[#4DFFFF] tracking-wider flex items-center gap-2">
                      {pb.trigger}
                      <CopyBtn text={pb.trigger} />
                    </div>
                    {pb.whyItWorks && (
                      <p className="mt-2 font-mono text-[9px] text-[#6B7280] leading-relaxed">{pb.whyItWorks}</p>
                    )}
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ═══════════ 004 — COMBO GENERATOR ═══════════ */}
          <section id="combos" ref={el => { sectionRefs.current['combos'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#FF6B00">004 — Combos</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Combo Generator
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              Build custom skill chains
            </p>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TerminalBlock title="skill-selector" accent="#FF6B00">
                <div className="mb-2">
                  <input
                    type="text"
                    value={comboName}
                    onChange={e => setComboName(e.target.value)}
                    placeholder="stack name (optional)"
                    className="w-full bg-transparent outline-none text-white placeholder:text-[#6B7280] font-mono text-xs border-b border-[rgba(255,255,255,0.07)] pb-1"
                  />
                </div>
                <div className="font-mono text-[9px] tracking-wider uppercase text-[#FF6B00] mb-2">
                  select skills ({comboSelected.length} selected)
                </div>
                <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                  {INSTALLED_SKILLS.map(s => {
                    const selected = comboSelected.includes(s.name)
                    return (
                      <motion.button
                        key={s.name}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleComboSkill(s.name)}
                        className={`font-mono text-[9px] px-1.5 py-0.5 rounded-md border transition-colors ${
                          selected
                            ? 'bg-[#FF6B00]/15 border-[#FF6B00]/40 text-[#FF6B00]'
                            : 'border-[rgba(255,255,255,0.07)] text-[#A1A1AA] hover:border-[rgba(255,255,255,0.15)]'
                        }`}
                      >
                        {s.name}
                      </motion.button>
                    )
                  })}
                </div>
              </TerminalBlock>
              <TerminalBlock title="output" accent="#FF6B00">
                <div className="flex gap-2 mb-3">
                  {(['chain', 'list', 'command', 'json'] as const).map(fmt => (
                    <motion.button
                      key={fmt}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setComboFormat(fmt)}
                      className={`font-mono text-[9px] px-2 py-0.5 border rounded-md uppercase tracking-wider transition-colors ${
                        comboFormat === fmt
                          ? 'border-[#FF6B00]/40 text-[#FF6B00] bg-[#FF6B00]/10'
                          : 'border-[rgba(255,255,255,0.07)] text-[#6B7280]'
                      }`}
                    >
                      {fmt}
                    </motion.button>
                  ))}
                </div>
                {comboSelected.length > 0 ? (
                  <>
                    <pre className="text-white text-[11px] whitespace-pre-wrap">{comboOutput}</pre>
                    <div className="mt-2">
                      <CopyBtn text={comboOutput} />
                    </div>
                  </>
                ) : (
                  <span className="text-[#6B7280]">select skills to generate combo</span>
                )}
                {comboConflicts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.07)]">
                    <div className="font-mono text-[9px] tracking-wider uppercase text-[#ff3b30] mb-1">conflicts detected</div>
                    {comboConflicts.map((c, i) => (
                      <div key={i} className="font-mono text-[9px] text-[#A1A1AA]">
                        <span className="text-[#ff3b30]">{c.skillA}</span> ↔ <span className="text-[#ff3b30]">{c.skillB}</span>: {c.reason}
                      </div>
                    ))}
                  </div>
                )}
                {comboSynergies.length > 0 && (
                  <div className="mt-2">
                    <div className="font-mono text-[9px] tracking-wider uppercase text-[#22c55e] mb-1">synergies</div>
                    {comboSynergies.map((c, i) => (
                      <div key={i} className="font-mono text-[9px] text-[#A1A1AA]">
                        <span className="text-[#22c55e]">{c.skillA}</span> + <span className="text-[#22c55e]">{c.skillB}</span>: {c.reason}
                      </div>
                    ))}
                  </div>
                )}
              </TerminalBlock>
            </div>
          </section>

          {/* ═══════════ 005 — STACKS ═══════════ */}
          <section id="stacks" ref={el => { sectionRefs.current['stacks'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#22c55e">005 — Stacks</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Skill Stacks
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              {SKILL_COMBOS.length} optimized combinations
            </p>
            <div className="mt-4 space-y-2">
              {SKILL_COMBOS.map(combo => {
                const expanded = expandedStacks.has(combo.name)
                return (
                  <motion.div
                    key={combo.name}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden hover:border-[rgba(34,197,94,0.2)] transition-colors"
                  >
                    <button
                      onClick={() => toggleStack(combo.name)}
                      className="w-full p-4 text-left flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm">{combo.emoji}</span>
                          <span className="font-bold text-sm uppercase tracking-wider text-white">{combo.name}</span>
                          <span className="font-mono text-[9px] text-[#6B7280]">{combo.skills.length} skills</span>
                        </div>
                        <p className="font-mono text-[9px] text-[#A1A1AA] mt-1">{combo.tagline}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <CopyBtn text={`Run: ${combo.skills.join(' → ')}`} />
                        <motion.div
                          animate={{ rotate: expanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={14} className="text-[#6B7280]" />
                        </motion.div>
                      </div>
                    </button>
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3 border-t border-[rgba(255,255,255,0.07)] pt-3">
                            <div className="flex flex-wrap items-center gap-0.5">
                              {combo.skills.map((s, i) => (
                                <Fragment key={s}>
                                  <SkillBadge name={s} accent="#22c55e" />
                                  {i < combo.skills.length - 1 && <ArrowChain />}
                                </Fragment>
                              ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <div className="font-mono text-[9px] tracking-wider uppercase text-[#22c55e] mb-1">synergy</div>
                                <p className="font-mono text-[9px] text-[#A1A1AA] leading-relaxed">{combo.synergy}</p>
                              </div>
                              <div>
                                <div className="font-mono text-[9px] tracking-wider uppercase text-[#4DFFFF] mb-1">use case</div>
                                <p className="font-mono text-[9px] text-[#A1A1AA] leading-relaxed">{combo.useCase}</p>
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-[9px] tracking-wider uppercase text-[#FFB000] mb-1">why chosen</div>
                              <p className="font-mono text-[9px] text-[#A1A1AA] leading-relaxed">{combo.whyChosen}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <div className="font-mono text-[9px] tracking-wider uppercase text-[#ff3b30] mb-1">without</div>
                                <p className="font-mono text-[9px] text-[#A1A1AA] leading-relaxed">{combo.benefitsVs}</p>
                              </div>
                              <div>
                                <div className="font-mono text-[9px] tracking-wider uppercase text-[#a78bfa] mb-1">misconceptions</div>
                                <p className="font-mono text-[9px] text-[#A1A1AA] leading-relaxed">{combo.misconceptions}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </section>

          {/* ═══════════ 006 — TOP SKILLS ═══════════ */}
          <section id="top-skills" ref={el => { sectionRefs.current['top-skills'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#FFD700">006 — Top Skills</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Top Skills
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              By install count · {TOP_SKILLS.length} ranked
            </p>
            <div className="mt-4 bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(255,255,255,0.07)] hover:bg-transparent">
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">
                      <button className="flex items-center gap-1" onClick={() => toggleSort('rank')}>
                        rank {sortField === 'rank' && (sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
                      </button>
                    </TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">
                      <button className="flex items-center gap-1" onClick={() => toggleSort('name')}>
                        name {sortField === 'name' && (sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
                      </button>
                    </TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280] hidden sm:table-cell">source</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">installs</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">
                      <button className="flex items-center gap-1" onClick={() => toggleSort('category')}>
                        category {sortField === 'category' && (sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTopSkills.map(skill => (
                    <TableRow key={skill.rank} className="border-[rgba(255,255,255,0.05)] hover:bg-[rgba(167,139,250,0.03)]">
                      <TableCell className="font-mono text-xs text-[#FFD700]">{String(skill.rank).padStart(2, '0')}</TableCell>
                      <TableCell className="font-mono text-xs text-white">
                        <div className="flex items-center gap-1">
                          {skill.name}
                          {skill.isNew && (
                            <span className="font-mono text-[8px] text-[#22c55e] uppercase tracking-wider border border-[#22c55e]/30 px-1 rounded">new</span>
                          )}
                          <CopyBtn text={skill.name} />
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-[#6B7280] hidden sm:table-cell">{skill.source}</TableCell>
                      <TableCell className="font-mono text-xs text-[#4DFFFF]">{skill.installs}</TableCell>
                      <TableCell className="font-mono text-[10px] text-[#A1A1AA]">{skill.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* ═══════════ 007 — COMPATIBILITY ═══════════ */}
          <section id="compatibility" ref={el => { sectionRefs.current['compatibility'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#22c55e">007 — Compatibility</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Compatibility Matrix
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              synergies vs conflicts
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#14161A] border border-[rgba(34,197,94,0.2)] rounded-xl overflow-hidden">
                <div className="px-4 py-2 border-b border-[rgba(34,197,94,0.15)] bg-[rgba(34,197,94,0.03)]">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#22c55e]">
                    synergies ({COMPATIBILITY.filter(c => c.type === 'synergy').length})
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {COMPATIBILITY.filter(c => c.type === 'synergy').map((c, i) => (
                    <div key={i} className="px-4 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-b-0 hover:bg-[rgba(34,197,94,0.03)]">
                      <div className="font-mono text-[10px] flex items-center gap-1">
                        <span className="text-[#22c55e]">{c.skillA}</span>
                        <span className="text-[#6B7280] mx-1">+</span>
                        <span className="text-[#22c55e]">{c.skillB}</span>
                        <CopyBtn text={`${c.skillA} + ${c.skillB}`} />
                      </div>
                      <div className="font-mono text-[9px] text-[#6B7280]">{c.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#14161A] border border-[rgba(255,59,48,0.2)] rounded-xl overflow-hidden">
                <div className="px-4 py-2 border-b border-[rgba(255,59,48,0.15)] bg-[rgba(255,59,48,0.03)]">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ff3b30]">
                    conflicts ({COMPATIBILITY.filter(c => c.type === 'conflict').length})
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {COMPATIBILITY.filter(c => c.type === 'conflict').map((c, i) => (
                    <div key={i} className="px-4 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-b-0 hover:bg-[rgba(255,59,48,0.03)]">
                      <div className="font-mono text-[10px] flex items-center gap-1">
                        <span className="text-[#ff3b30]">{c.skillA}</span>
                        <span className="text-[#6B7280] mx-1">↔</span>
                        <span className="text-[#ff3b30]">{c.skillB}</span>
                        <CopyBtn text={`${c.skillA} ↔ ${c.skillB}`} />
                      </div>
                      <div className="font-mono text-[9px] text-[#6B7280]">{c.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════ 008 — STACK ROI ═══════════ */}
          <section id="roi" ref={el => { sectionRefs.current['roi'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#FFB000">008 — Stack ROI</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Stack ROI
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              Time & quality comparison
            </p>
            <div className="mt-4 bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(255,255,255,0.07)] hover:bg-transparent">
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">stack</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">without</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">with</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">quality — / +</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">error ↓</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROI_DATA.map(row => (
                    <TableRow key={row.stack} className="border-[rgba(255,255,255,0.05)] hover:bg-[rgba(167,139,250,0.03)]">
                      <TableCell className="font-mono text-xs text-white">
                        {row.stack}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#6B7280]">{row.timeWithout}</TableCell>
                      <TableCell className="font-mono text-xs text-[#22c55e]">{row.timeWith}</TableCell>
                      <TableCell className="font-mono text-[10px]">
                        <span className="text-[#6B7280]">{row.qualityWithout}</span>
                        <span className="text-[#6B7280] mx-1">→</span>
                        <span className="text-[#22c55e]">{row.qualityWith}</span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#4DFFFF]">{row.errorReduction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* ═══════════ 009 — ANALYSIS ═══════════ */}
          <section id="analysis" ref={el => { sectionRefs.current['analysis'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#a78bfa">009 — Analysis</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Comparative Analysis
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              Overlapping skills & routing rules
            </p>
            <div className="mt-4">
              <Accordion type="multiple" className="space-y-2">
                {SKILL_OVERLAPS.map((overlap, idx) => (
                  <AccordionItem
                    key={overlap.domain}
                    value={`overlap-${idx}`}
                    className="bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden data-[state=open]:border-[rgba(167,139,250,0.2)] px-0"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[rgba(167,139,250,0.03)] font-mono text-xs uppercase tracking-wider text-white [&>svg]:text-[#a78bfa]">
                      {overlap.domain}
                      <span className="ml-2 font-mono text-[9px] text-[#6B7280] normal-case tracking-normal">{overlap.skills.length} skills</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {overlap.skills.map(s => (
                          <div key={s.name} className="border-l-2 border-[#a78bfa]/30 pl-3">
                            <div className="font-mono text-xs text-white flex items-center gap-1">
                              {s.name}
                              <CopyBtn text={s.name} />
                            </div>
                            <div className="font-mono text-[9px] text-[#6B7280]">
                              approach: <span className="text-[#4DFFFF]">{s.approach}</span> · best for: <span className="text-[#a78bfa]">{s.bestFor}</span>
                            </div>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.07)] font-mono text-[9px] text-[#A1A1AA]">
                          routing: <span className="text-[#a78bfa]">{overlap.routing}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* ═══════════ 010 — UPGRADE PATHS ═══════════ */}
          <section id="upgrades" ref={el => { sectionRefs.current['upgrades'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#4DFFFF">010 — Upgrades</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Upgrade Paths
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              Skill evolution & migration
            </p>
            <div className="mt-4 bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(255,255,255,0.07)] hover:bg-transparent">
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">original</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]"></TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">upgraded</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">new capabilities</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#6B7280]">status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SKILL_UPGRADES.map(u => {
                    const statusStyle = STATUS_COLORS[u.status as keyof typeof STATUS_COLORS]
                    return (
                      <TableRow key={u.original} className="border-[rgba(255,255,255,0.05)] hover:bg-[rgba(167,139,250,0.03)]">
                        <TableCell className="font-mono text-xs text-[#6B7280]">
                          <div className="flex items-center gap-1">{u.original} <CopyBtn text={u.original} /></div>
                        </TableCell>
                        <TableCell className="text-[#a78bfa]"><ArrowRight size={12} /></TableCell>
                        <TableCell className="font-mono text-xs text-white">
                          <div className="flex items-center gap-1">{u.upgraded} <CopyBtn text={u.upgraded} /></div>
                        </TableCell>
                        <TableCell className="font-mono text-[10px] text-[#A1A1AA]">{u.newCapabilities}</TableCell>
                        <TableCell>
                          <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${statusStyle?.bg || ''} ${statusStyle?.text || ''} ${statusStyle?.border || ''}`}>
                            {u.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* ═══════════ 011 — ERROR HANDLING ═══════════ */}
          <section id="errors" ref={el => { sectionRefs.current['errors'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#ff3b30">011 — Error Handling</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Error Handling
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              Typed error codes per skill
            </p>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-40px' }}
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {ERROR_STANDARDS.map(es => (
                <motion.div key={es.skill} variants={staggerItem}>
                  <GlowCard accent="#ff3b30">
                    <div className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2 mb-2">
                      {es.skill}
                      <CopyBtn text={es.skill} />
                    </div>
                    <div className="space-y-2">
                      {es.errorTypes.map(et => (
                        <div key={et.code} className="flex items-start gap-2">
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-md border border-[rgba(255,59,48,0.2)] text-[#ff3b30] bg-[rgba(255,59,48,0.05)] shrink-0">
                            {et.code}
                          </span>
                          <div className="min-w-0">
                            <div className="font-mono text-[9px] text-white">{et.type}</div>
                            <div className="font-mono text-[9px] text-[#6B7280]">{et.action}</div>
                          </div>
                          <CopyBtn text={et.code} className="shrink-0" />
                        </div>
                      ))}
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ═══════════ 012 — ESCALATION ═══════════ */}
          <section id="escalation" ref={el => { sectionRefs.current['escalation'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#FF6B00">012 — Escalation</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Escalation Chains
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              {ESCALATION_CHAINS.length} error escalation paths
            </p>
            <div className="mt-4 bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
              {ESCALATION_CHAINS.map((chain, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 hover:bg-[rgba(255,107,0,0.03)] transition-colors ${
                    i < ESCALATION_CHAINS.length - 1 ? 'border-b border-[rgba(255,255,255,0.05)]' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[10px] text-[#FF6B00]">{chain.trigger}</span>
                      <CopyBtn text={chain.trigger} />
                    </div>
                    <ArrowRight size={12} className="text-[#6B7280] hidden sm:block" />
                    <span className="font-mono text-[9px] text-[#6B7280] sm:hidden">→</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[10px] text-white">{chain.escalateTo}</span>
                      <CopyBtn text={chain.escalateTo} />
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-[#6B7280] mt-0.5">{chain.reason}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════ 013 — DEPENDENCIES ═══════════ */}
          <section id="dependencies" ref={el => { sectionRefs.current['dependencies'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#FFB000">013 — Dependencies</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Dependencies
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              {DEPENDENCIES.length} dependency relationships
            </p>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-40px' }}
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {DEPENDENCIES.map((dep, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <GlowCard accent="#FFB000">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-mono text-xs text-white">{dep.skill}</span>
                      <CopyBtn text={dep.skill} />
                    </div>
                    <div className="flex flex-wrap items-center gap-1 mb-2">
                      <span className="font-mono text-[9px] text-[#6B7280]">requires:</span>
                      {dep.depends.map(d => (
                        <span key={d} className="font-mono text-[9px] px-1.5 py-0.5 rounded-md border border-[rgba(255,176,0,0.2)] text-[#FFB000] bg-[rgba(255,176,0,0.05)]">
                          {d}
                        </span>
                      ))}
                    </div>
                    <p className="font-mono text-[9px] text-[#6B7280]">{dep.reason}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ═══════════ 014 — SELF-HEALING ═══════════ */}
          <section id="healing" ref={el => { sectionRefs.current['healing'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#22c55e">014 — Self-Healing</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Self-Healing
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              {HEALING_RULES.length} detection + repair rules
            </p>
            <div className="mt-4 space-y-2">
              {HEALING_RULES.map((rule, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 hover:border-[rgba(34,197,94,0.2)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <SeverityBadge severity={rule.severity} />
                    <span className="font-mono text-[9px] text-[#6B7280]">rule #{i + 1}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <div className="font-mono text-[9px] tracking-wider uppercase text-[#ff3b30] mb-0.5">detect</div>
                      <div className="font-mono text-[10px] text-[#A1A1AA] flex items-center gap-1">
                        {rule.detect}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] tracking-wider uppercase text-[#22c55e] mb-0.5">repair</div>
                      <div className="font-mono text-[10px] text-[#A1A1AA] flex items-center gap-1">
                        {rule.repair}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ═══════════ 015 — FAQ ═══════════ */}
          <section id="faq" ref={el => { sectionRefs.current['faq'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)]">
            <SectionLabel accent="#a78bfa">015 — FAQ</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              FAQ
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              {FAQ_DATA.length} GEO-optimized Q&As
            </p>
            <div className="mt-4 space-y-2">
              <Accordion type="multiple" className="space-y-2">
                {FAQ_DATA.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden data-[state=open]:border-[rgba(167,139,250,0.2)] px-0"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[rgba(167,139,250,0.03)] font-mono text-xs text-white text-left [&>svg]:text-[#a78bfa]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="font-mono text-[10px] text-[#A1A1AA] leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* ═══════════ 016 — DIRECTORY ═══════════ */}
          <section id="directory" ref={el => { sectionRefs.current['directory'] = el }} className="py-10 border-t border-[rgba(255,255,255,0.07)] pb-20">
            <SectionLabel accent="#4DFFFF">016 — Directory</SectionLabel>
            <motion.h2 {...fadeUp} className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">
              Full Skill Directory
            </motion.h2>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">
              {INSTALLED_SKILLS.length} skills across {ALL_CATEGORIES.length} categories
            </p>

            {/* Search + Filter */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search skills..."
                  className="w-full pl-9 pr-3 py-2 bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl font-mono text-xs text-white placeholder:text-[#6B7280] outline-none focus:border-[#4DFFFF]/30 transition-colors"
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => setDirCategory('All')}
                  className={`font-mono text-[9px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                    dirCategory === 'All'
                      ? 'border-[#4DFFFF]/40 text-[#4DFFFF] bg-[#4DFFFF]/10'
                      : 'border-[rgba(255,255,255,0.07)] text-[#6B7280] hover:border-[rgba(255,255,255,0.15)]'
                  }`}
                >
                  All ({INSTALLED_SKILLS.length})
                </button>
                {ALL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setDirCategory(cat)}
                    className={`font-mono text-[9px] px-2.5 py-1.5 rounded-lg border transition-colors hidden sm:inline-block ${
                      dirCategory === cat
                        ? `border-[#4DFFFF]/40 text-[#4DFFFF] bg-[#4DFFFF]/10`
                        : 'border-[rgba(255,255,255,0.07)] text-[#6B7280] hover:border-[rgba(255,255,255,0.15)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile category select */}
            <div className="mt-2 sm:hidden">
              <select
                value={dirCategory}
                onChange={e => setDirCategory(e.target.value)}
                className="w-full bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 py-2 font-mono text-xs text-white outline-none"
              >
                <option value="All">All ({INSTALLED_SKILLS.length})</option>
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 font-mono text-[9px] text-[#6B7280] uppercase tracking-wider">
              {filteredSkills.length} result{filteredSkills.length !== 1 ? 's' : ''}
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
            >
              {filteredSkills.map(skill => {
                const catColor = getCatColor(skill.category)
                const healthBadge = getHealthBadge(skill.healthScore)
                return (
                  <motion.div
                    key={skill.name}
                    variants={staggerItem}
                    layout
                    className="bg-[#14161A] border border-[rgba(255,255,255,0.07)] rounded-xl p-3 hover:border-[rgba(255,255,255,0.15)] transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <HealthDot score={skill.healthScore} />
                          <span className="font-mono text-xs text-white truncate">{skill.name}</span>
                          {skill.isNew && (
                            <span className="font-mono text-[7px] text-[#22c55e] uppercase tracking-wider border border-[#22c55e]/30 px-0.5 rounded shrink-0">new</span>
                          )}
                        </div>
                        <p className="font-mono text-[9px] text-[#6B7280] mt-0.5 truncate">{skill.description}</p>
                      </div>
                      <CopyBtn text={skill.name} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-md border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                        {skill.category}
                      </span>
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-md border ${healthBadge.bg} ${healthBadge.text} ${healthBadge.border}`}>
                        {healthBadge.label} {skill.healthScore}
                      </span>
                      <span className="font-mono text-[8px] text-[#6B7280]">{skill.installs}</span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </section>

        </div>
      </main>
      <ClipboardBasketFloating />
    </div>
    </ClipboardBasketProvider>
  )
}
