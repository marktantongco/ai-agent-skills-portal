'use client'

import { useState, useMemo, useCallback, useEffect, useRef, Fragment } from 'react'
import Link from 'next/link'
import {
  Copy, Check, ChevronDown, ChevronUp,
  Search, X, ArrowRight, ArrowUp, ArrowDown
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from '@/components/ui/accordion'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  INSTALLED_SKILLS, SKILL_COMBOS, PLAYBOOKS, INTENT_DOMAINS, ESCALATION_CHAINS,
  COMPATIBILITY, DEPENDENCIES, HEALING_RULES, ROI_DATA, TOP_SKILLS, SKILL_OVERLAPS,
  SKILL_UPGRADES, ERROR_STANDARDS, FAQ_DATA, ALL_CATEGORIES, AVG_HEALTH,
  getCatColor, getHealthBadge, STATUS_COLORS, INTENT_COLORS
} from '@/lib/skills-data'
import type { Skill, SkillCombo, Playbook, IntentDomain, FAQItem } from '@/lib/skills-data'

// ──────────────────────────────────────────────────────────
// SECTION LABELS
// ──────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero', label: '001 — HERO' },
  { id: 'router', label: '002 — ROUTER' },
  { id: 'playbooks', label: '003 — PLAYBOOKS' },
  { id: 'combos', label: '004 — COMBOS' },
  { id: 'stacks', label: '005 — STACKS' },
  { id: 'top-skills', label: '006 — TOP SKILLS' },
  { id: 'compatibility', label: '007 — COMPATIBILITY' },
  { id: 'roi', label: '008 — STACK ROI' },
  { id: 'analysis', label: '009 — ANALYSIS' },
  { id: 'upgrades', label: '010 — UPGRADES' },
  { id: 'errors', label: '011 — ERROR HANDLING' },
  { id: 'escalation', label: '012 — ESCALATION' },
  { id: 'dependencies', label: '013 — DEPENDENCIES' },
  { id: 'healing', label: '014 — SELF-HEALING' },
  { id: 'faq', label: '015 — FAQ' },
  { id: 'directory', label: '016 — DIRECTORY' },
] as const

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [text])
  return (
    <button onClick={handleCopy} className="font-mono text-[9px] tracking-wider uppercase text-[#ccff00] hover:underline ml-2 shrink-0">
      {copied ? 'copied' : '[copy]'}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[rgba(204,255,0,.5)]">{children}</span>
  )
}

function TerminalBlock({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-[#030303] border border-[rgba(204,255,0,.2)] rounded-none">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-[rgba(204,255,0,.2)]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        {title && <span className="ml-2 font-mono text-[9px] tracking-wider uppercase text-[rgba(239,239,239,.25)]">{title}</span>}
      </div>
      <div className="p-3 font-mono text-xs text-[rgba(239,239,239,.58)]">{children}</div>
    </div>
  )
}

function SkillBadge({ name }: { name: string }) {
  return (
    <span className="font-mono text-[10px] px-2 py-0.5 border border-[rgba(204,255,0,.2)] text-[#efefef] bg-[#181818] inline-block">
      {name}
    </span>
  )
}

function ArrowChain() {
  return <span className="font-mono text-[10px] text-[rgba(239,239,239,.25)] mx-0.5">→</span>
}

function HealthDot({ score }: { score: number }) {
  const color = score >= 80 ? '#00e676' : score >= 60 ? '#ccff00' : score >= 40 ? '#febc2e' : '#ff3b30'
  return <span className="inline-block w-2 h-2 rounded-none mr-1.5 shrink-0" style={{ backgroundColor: color }} />
}

function SeverityBadge({ severity }: { severity: string }) {
  const cfg = severity === 'critical'
    ? 'bg-[#ff3b30]/15 text-[#ff3b30] border-[#ff3b30]/30'
    : severity === 'warning'
      ? 'bg-[#febc2e]/15 text-[#febc2e] border-[#febc2e]/30'
      : 'bg-[#00ffff]/15 text-[#00ffff] border-[#00ffff]/30'
  return (
    <span className={`font-mono text-[9px] px-1.5 py-0.5 border rounded-none uppercase tracking-wider ${cfg}`}>
      {severity}
    </span>
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
  const [sortField, setSortField] = useState<'rank' | 'name' | 'installs' | 'category'>('rank')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

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

  // ────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#efefef] flex">
      {/* ─── LEFT SIDEBAR NAV ─── */}
      <nav className="hidden lg:flex flex-col w-52 shrink-0 border-r border-[rgba(204,255,0,.2)] bg-[#0a0a0a] sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-[rgba(204,255,0,.2)]">
          <Link href="/" className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#ccff00] hover:underline">
            ← public
          </Link>
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#efefef] mt-2">
            SKILLS://DEV
          </div>
        </div>
        <div className="flex-1 py-2">
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`w-full text-left px-4 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase transition-colors ${
                activeSection === sec.id
                  ? 'text-[#ccff00] bg-[rgba(204,255,0,.08)]'
                  : 'text-[rgba(239,239,239,.38)] hover:text-[rgba(239,239,239,.7)]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── MOBILE NAV ─── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-[rgba(204,255,0,.2)]">
        <div className="flex items-center justify-between px-4 py-2">
          <Link href="/" className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ccff00]">← public</Link>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#efefef]">SKILLS://DEV</span>
          <button onClick={() => setNavOpen(!navOpen)} className="text-[rgba(239,239,239,.58)]">
            {navOpen ? <X size={16} /> : <Search size={16} />}
          </button>
        </div>
        {navOpen && (
          <div className="border-t border-[rgba(204,255,0,.2)] max-h-64 overflow-y-auto">
            {SECTIONS.map(sec => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-4 py-1.5 font-mono text-[9px] tracking-[0.15em] uppercase ${
                  activeSection === sec.id ? 'text-[#ccff00] bg-[rgba(204,255,0,.08)]' : 'text-[rgba(239,239,239,.38)]'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main ref={mainRef} className="flex-1 min-w-0 lg:ml-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 lg:pt-0">

          {/* ═══════════ 001 — HERO ═══════════ */}
          <section id="hero" ref={el => { sectionRefs.current['hero'] = el }} className="pt-8 lg:pt-12 pb-8">
            <SectionLabel>001 — Hero</SectionLabel>
            <h1 className="mt-4 font-bold text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.15em] leading-none">
              DEVELOPER<br />
              <span className="text-[#ccff00]">PORTAL</span>
            </h1>
            <p className="mt-4 font-mono text-xs text-[rgba(239,239,239,.58)] max-w-xl">
              <span className="text-[#00ffff]">❯</span> 82 skills. 25 stacks. 16 playbooks. 8 router commands. Complete system reference for the AI Agent Skills Platform.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-0 border border-[rgba(204,255,0,.2)]">
              {[
                { label: 'skills', value: INSTALLED_SKILLS.length },
                { label: 'stacks', value: SKILL_COMBOS.length },
                { label: 'playbooks', value: PLAYBOOKS.length },
                { label: 'avg health', value: AVG_HEALTH },
              ].map(stat => (
                <div key={stat.label} className="p-4 border border-[rgba(204,255,0,.2)] bg-[#0f0f0f] hover:shadow-[6px_6px_0_rgba(204,255,0,.15)] transition-shadow duration-200">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[rgba(239,239,239,.38)]">{stat.label}</div>
                  <div className="mt-1 text-2xl font-bold text-[#ccff00]">{stat.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════ 002 — SKILL ROUTER ═══════════ */}
          <section id="router" ref={el => { sectionRefs.current['router'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>002 — Router</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Skill Router</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              Intent → Stack mapping · 8 commands
            </p>
            <div className="mt-4">
              <TerminalBlock title="skill-router">
                <div className="flex items-center gap-2">
                  <span className="text-[#00ffff]">❯</span>
                  <input
                    type="text"
                    value={routerQuery}
                    onChange={e => setRouterQuery(e.target.value)}
                    placeholder="type your intent... (e.g. launch, research, design)"
                    className="flex-1 bg-transparent outline-none text-[#efefef] placeholder:text-[rgba(239,239,239,.25)] font-mono text-xs"
                  />
                  {routerQuery && (
                    <button onClick={() => setRouterQuery('')} className="text-[rgba(239,239,239,.25)] hover:text-[#efefef]">
                      <X size={12} />
                    </button>
                  )}
                </div>
                {routerResult && (
                  <div className="mt-3 pt-3 border-t border-[rgba(204,255,0,.15)]">
                    <div className="text-[#ccff00] text-[10px] tracking-wider uppercase mb-2">
                      matched: {routerResult.name}
                    </div>
                    <div className="text-[rgba(239,239,239,.58)] text-[10px] mb-1">
                      stack: <span className="text-[#efefef]">{routerResult.stack}</span>
                    </div>
                    <div className="text-[rgba(239,239,239,.58)] text-[10px] mb-2">
                      trigger: <span className="text-[#00ffff]">{routerResult.trigger}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-0.5">
                      {routerResult.chain.map((s, i) => (
                        <Fragment key={s}>
                          <SkillBadge name={s} />
                          {i < routerResult.chain.length - 1 && <ArrowChain />}
                        </Fragment>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center">
                      <CopyBtn text={`Run: ${routerResult.chain.join(' → ')}`} />
                    </div>
                  </div>
                )}
                {!routerResult && routerQuery.trim() && (
                  <div className="mt-3 pt-3 border-t border-[rgba(204,255,0,.15)] text-[rgba(239,239,239,.25)] text-[10px]">
                    no match — try: build, write, research, design, decide, data, learn, automate
                  </div>
                )}
              </TerminalBlock>
            </div>
            {/* Intent domains reference */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-0 border border-[rgba(204,255,0,.2)]">
              {INTENT_DOMAINS.map(d => (
                <button
                  key={d.name}
                  onClick={() => setRouterQuery(d.keywords[0])}
                  className="p-3 border border-[rgba(204,255,0,.2)] bg-[#0f0f0f] hover:bg-[#181818] transition-colors text-left"
                >
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ccff00]">{d.icon} {d.name}</div>
                  <div className="font-mono text-[9px] text-[rgba(239,239,239,.38)] mt-1">{d.trigger}</div>
                </button>
              ))}
            </div>
          </section>

          {/* ═══════════ 003 — PLAYBOOKS ═══════════ */}
          <section id="playbooks" ref={el => { sectionRefs.current['playbooks'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>003 — Playbooks</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Playbooks</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              {PLAYBOOKS.length} pre-built execution scripts
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-0 border border-[rgba(204,255,0,.2)]">
              {PLAYBOOKS.map(pb => (
                <div key={pb.name} className="border border-[rgba(204,255,0,.2)] p-4 bg-[#0f0f0f] hover:shadow-[6px_6px_0_rgba(204,255,0,.15)] transition-shadow duration-200">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm mr-1">{pb.emoji}</span>
                      <span className="font-bold text-sm uppercase tracking-wider text-[#efefef]">{pb.name}</span>
                    </div>
                    <CopyBtn text={pb.copyText} />
                  </div>
                  <p className="font-mono text-[10px] text-[rgba(239,239,239,.38)] mt-1">{pb.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-0.5">
                    {pb.chain.map((s, i) => (
                      <Fragment key={s}>
                        <SkillBadge name={s} />
                        {i < pb.chain.length - 1 && <ArrowChain />}
                      </Fragment>
                    ))}
                  </div>
                  <div className="mt-2 font-mono text-[9px] text-[#00ffff] tracking-wider">{pb.trigger}</div>
                  {pb.whyItWorks && (
                    <p className="mt-2 font-mono text-[9px] text-[rgba(239,239,239,.38)] leading-relaxed">{pb.whyItWorks}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════ 004 — COMBO GENERATOR ═══════════ */}
          <section id="combos" ref={el => { sectionRefs.current['combos'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>004 — Combos</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Combo Generator</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              Build custom skill chains
            </p>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selector */}
              <div>
                <TerminalBlock title="skill-selector">
                  <div className="mb-2">
                    <input
                      type="text"
                      value={comboName}
                      onChange={e => setComboName(e.target.value)}
                      placeholder="stack name (optional)"
                      className="w-full bg-transparent outline-none text-[#efefef] placeholder:text-[rgba(239,239,239,.25)] font-mono text-xs border-b border-[rgba(204,255,0,.15)] pb-1"
                    />
                  </div>
                  <div className="font-mono text-[9px] tracking-wider uppercase text-[rgba(204,255,0,.5)] mb-2">
                    select skills ({comboSelected.length} selected)
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                    {INSTALLED_SKILLS.map(s => {
                      const selected = comboSelected.includes(s.name)
                      return (
                        <button
                          key={s.name}
                          onClick={() => toggleComboSkill(s.name)}
                          className={`font-mono text-[9px] px-1.5 py-0.5 border transition-colors ${
                            selected
                              ? 'bg-[#ccff00]/15 border-[#ccff00]/40 text-[#ccff00]'
                              : 'border-[rgba(204,255,0,.2)] text-[rgba(239,239,239,.58)] hover:border-[rgba(204,255,0,.4)]'
                          }`}
                        >
                          {s.name}
                        </button>
                      )
                    })}
                  </div>
                </TerminalBlock>
              </div>
              {/* Output */}
              <div>
                <TerminalBlock title="output">
                  <div className="flex gap-2 mb-3">
                    {(['chain', 'list', 'command', 'json'] as const).map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => setComboFormat(fmt)}
                        className={`font-mono text-[9px] px-2 py-0.5 border uppercase tracking-wider ${
                          comboFormat === fmt
                            ? 'border-[#ccff00]/40 text-[#ccff00] bg-[#ccff00]/10'
                            : 'border-[rgba(204,255,0,.2)] text-[rgba(239,239,239,.38)]'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                  {comboSelected.length > 0 ? (
                    <>
                      <pre className="text-[#efefef] text-[11px] whitespace-pre-wrap">{comboOutput}</pre>
                      <div className="mt-2">
                        <CopyBtn text={comboOutput} />
                      </div>
                    </>
                  ) : (
                    <span className="text-[rgba(239,239,239,.25)]">select skills to generate combo</span>
                  )}
                  {comboConflicts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[rgba(204,255,0,.15)]">
                      <div className="font-mono text-[9px] tracking-wider uppercase text-[#ff3b30] mb-1">conflicts detected</div>
                      {comboConflicts.map((c, i) => (
                        <div key={i} className="font-mono text-[9px] text-[rgba(239,239,239,.58)]">
                          <span className="text-[#ff3b30]">{c.skillA}</span> ↔ <span className="text-[#ff3b30]">{c.skillB}</span>: {c.reason}
                        </div>
                      ))}
                    </div>
                  )}
                  {comboSynergies.length > 0 && (
                    <div className="mt-2">
                      <div className="font-mono text-[9px] tracking-wider uppercase text-[#00e676] mb-1">synergies</div>
                      {comboSynergies.map((c, i) => (
                        <div key={i} className="font-mono text-[9px] text-[rgba(239,239,239,.58)]">
                          <span className="text-[#00e676]">{c.skillA}</span> + <span className="text-[#00e676]">{c.skillB}</span>: {c.reason}
                        </div>
                      ))}
                    </div>
                  )}
                </TerminalBlock>
              </div>
            </div>
          </section>

          {/* ═══════════ 005 — STACKS ═══════════ */}
          <section id="stacks" ref={el => { sectionRefs.current['stacks'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>005 — Stacks</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Skill Stacks</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              {SKILL_COMBOS.length} optimized combinations
            </p>
            <div className="mt-4 border border-[rgba(204,255,0,.2)]">
              {SKILL_COMBOS.map((combo, idx) => (
                <div
                  key={combo.name}
                  className={`p-4 bg-[#0f0f0f] hover:shadow-[6px_6px_0_rgba(204,255,0,.15)] transition-shadow duration-200 ${
                    idx < SKILL_COMBOS.length - 1 ? 'border-b border-[rgba(204,255,0,.2)]' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <span className="text-sm mr-1">{combo.emoji}</span>
                      <span className="font-bold text-sm uppercase tracking-wider">{combo.name}</span>
                      <span className="ml-2 font-mono text-[9px] text-[rgba(239,239,239,.38)]">{combo.skills.length} skills</span>
                    </div>
                    <CopyBtn text={`Run: ${combo.skills.join(' → ')}`} />
                  </div>
                  <p className="font-mono text-[9px] text-[rgba(239,239,239,.38)] mt-1">{combo.tagline}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-0.5">
                    {combo.skills.map((s, i) => (
                      <Fragment key={s}>
                        <SkillBadge name={s} />
                        {i < combo.skills.length - 1 && <ArrowChain />}
                      </Fragment>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[9px] text-[rgba(239,239,239,.38)] leading-relaxed">{combo.useCase}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════ 006 — TOP SKILLS ═══════════ */}
          <section id="top-skills" ref={el => { sectionRefs.current['top-skills'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>006 — Top Skills</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Top Skills</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              By install count · {TOP_SKILLS.length} ranked
            </p>
            <div className="mt-4 border border-[rgba(204,255,0,.2)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(204,255,0,.2)] hover:bg-transparent">
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]" onClick={() => toggleSort('rank')}>
                      <button className="flex items-center gap-1">
                        rank {sortField === 'rank' && (sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
                      </button>
                    </TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]" onClick={() => toggleSort('name')}>
                      <button className="flex items-center gap-1">
                        name {sortField === 'name' && (sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
                      </button>
                    </TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)] hidden sm:table-cell">source</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">installs</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]" onClick={() => toggleSort('category')}>
                      <button className="flex items-center gap-1">
                        category {sortField === 'category' && (sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTopSkills.map(skill => (
                    <TableRow key={skill.rank} className="border-[rgba(204,255,0,.15)] hover:bg-[rgba(204,255,0,.05)]">
                      <TableCell className="font-mono text-xs text-[#ccff00]">{String(skill.rank).padStart(2, '0')}</TableCell>
                      <TableCell className="font-mono text-xs text-[#efefef]">
                        {skill.name}
                        {skill.isNew && <span className="ml-1 font-mono text-[8px] text-[#ccff00] uppercase tracking-wider border border-[#ccff00]/30 px-1">new</span>}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-[rgba(239,239,239,.38)] hidden sm:table-cell">{skill.source}</TableCell>
                      <TableCell className="font-mono text-xs text-[#00ffff]">{skill.installs}</TableCell>
                      <TableCell className="font-mono text-[10px] text-[rgba(239,239,239,.58)]">{skill.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* ═══════════ 007 — COMPATIBILITY ═══════════ */}
          <section id="compatibility" ref={el => { sectionRefs.current['compatibility'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>007 — Compatibility</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Compatibility Matrix</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              synergies vs conflicts
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Synergies */}
              <div className="border border-[rgba(0,230,118,.2)] bg-[#0f0f0f]">
                <div className="px-4 py-2 border-b border-[rgba(0,230,118,.2)] bg-[rgba(0,230,118,.05)]">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#00e676]">synergies ({COMPATIBILITY.filter(c => c.type === 'synergy').length})</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {COMPATIBILITY.filter(c => c.type === 'synergy').map((c, i) => (
                    <div key={i} className="px-4 py-2 border-b border-[rgba(204,255,0,.1)] last:border-b-0">
                      <div className="font-mono text-[10px]">
                        <span className="text-[#00e676]">{c.skillA}</span>
                        <span className="text-[rgba(239,239,239,.25)] mx-1">+</span>
                        <span className="text-[#00e676]">{c.skillB}</span>
                      </div>
                      <div className="font-mono text-[9px] text-[rgba(239,239,239,.38)]">{c.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Conflicts */}
              <div className="border border-[rgba(255,59,48,.2)] bg-[#0f0f0f]">
                <div className="px-4 py-2 border-b border-[rgba(255,59,48,.2)] bg-[rgba(255,59,48,.05)]">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ff3b30]">conflicts ({COMPATIBILITY.filter(c => c.type === 'conflict').length})</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {COMPATIBILITY.filter(c => c.type === 'conflict').map((c, i) => (
                    <div key={i} className="px-4 py-2 border-b border-[rgba(204,255,0,.1)] last:border-b-0">
                      <div className="font-mono text-[10px]">
                        <span className="text-[#ff3b30]">{c.skillA}</span>
                        <span className="text-[rgba(239,239,239,.25)] mx-1">↔</span>
                        <span className="text-[#ff3b30]">{c.skillB}</span>
                      </div>
                      <div className="font-mono text-[9px] text-[rgba(239,239,239,.38)]">{c.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════ 008 — STACK ROI ═══════════ */}
          <section id="roi" ref={el => { sectionRefs.current['roi'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>008 — Stack ROI</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Stack ROI</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              Time & quality comparison
            </p>
            <div className="mt-4 border border-[rgba(204,255,0,.2)] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(204,255,0,.2)] hover:bg-transparent">
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">stack</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">without</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">with</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">quality — / +</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">error ↓</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROI_DATA.map(row => (
                    <TableRow key={row.stack} className="border-[rgba(204,255,0,.15)] hover:bg-[rgba(204,255,0,.05)]">
                      <TableCell className="font-mono text-xs text-[#efefef]">{row.stack}</TableCell>
                      <TableCell className="font-mono text-xs text-[rgba(239,239,239,.38)]">{row.timeWithout}</TableCell>
                      <TableCell className="font-mono text-xs text-[#ccff00]">{row.timeWith}</TableCell>
                      <TableCell className="font-mono text-[10px]">
                        <span className="text-[rgba(239,239,239,.38)]">{row.qualityWithout}</span>
                        <span className="text-[rgba(239,239,239,.25)] mx-1">→</span>
                        <span className="text-[#00e676]">{row.qualityWith}</span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#00ffff]">{row.errorReduction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* ═══════════ 009 — ANALYSIS ═══════════ */}
          <section id="analysis" ref={el => { sectionRefs.current['analysis'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>009 — Analysis</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Comparative Analysis</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              Overlapping skills & routing rules
            </p>
            <div className="mt-4">
              <Accordion type="multiple" className="space-y-0">
                {SKILL_OVERLAPS.map((overlap, idx) => (
                  <AccordionItem key={overlap.domain} value={`overlap-${idx}`} className="border border-[rgba(204,255,0,.2)] rounded-none data-[state=open]:bg-[#0f0f0f]">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[rgba(204,255,0,.05)] font-mono text-xs uppercase tracking-wider text-[#efefef] [&>svg]:text-[#ccff00]">
                      {overlap.domain}
                      <span className="ml-2 font-mono text-[9px] text-[rgba(239,239,239,.38)] normal-case tracking-normal">{overlap.skills.length} skills</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {overlap.skills.map(s => (
                          <div key={s.name} className="border-l-2 border-[#ccff00]/30 pl-3">
                            <div className="font-mono text-xs text-[#efefef]">{s.name}</div>
                            <div className="font-mono text-[9px] text-[rgba(239,239,239,.38)]">
                              approach: <span className="text-[#00ffff]">{s.approach}</span> · best for: <span className="text-[#ccff00]">{s.bestFor}</span>
                            </div>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-[rgba(204,255,0,.15)] font-mono text-[9px] text-[rgba(239,239,239,.58)]">
                          routing: <span className="text-[#ccff00]">{overlap.routing}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* ═══════════ 010 — UPGRADE PATHS ═══════════ */}
          <section id="upgrades" ref={el => { sectionRefs.current['upgrades'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>010 — Upgrades</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Upgrade Paths</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              Skill evolution & migration
            </p>
            <div className="mt-4 border border-[rgba(204,255,0,.2)] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(204,255,0,.2)] hover:bg-transparent">
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">original</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]"></TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">upgraded</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">new capabilities</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SKILL_UPGRADES.map(u => {
                    const statusStyle = STATUS_COLORS[u.status]
                    return (
                      <TableRow key={u.original} className="border-[rgba(204,255,0,.15)] hover:bg-[rgba(204,255,0,.05)]">
                        <TableCell className="font-mono text-xs text-[rgba(239,239,239,.58)]">{u.original}</TableCell>
                        <TableCell className="font-mono text-[10px] text-[#ccff00]">→</TableCell>
                        <TableCell className="font-mono text-xs text-[#efefef]">{u.upgraded}</TableCell>
                        <TableCell className="font-mono text-[10px] text-[rgba(239,239,239,.58)] max-w-[200px]">{u.newCapabilities}</TableCell>
                        <TableCell>
                          <span className={`font-mono text-[9px] px-1.5 py-0.5 border rounded-none uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
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
          <section id="errors" ref={el => { sectionRefs.current['errors'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>011 — Error Handling</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Error Standards</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              Typed error codes per skill
            </p>
            <div className="mt-4 space-y-4">
              {ERROR_STANDARDS.map(es => (
                <TerminalBlock key={es.skill} title={es.skill}>
                  <div className="space-y-2">
                    {es.errorTypes.map(err => (
                      <div key={err.code} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="font-mono text-[10px] text-[#ff3b30] shrink-0">{err.code}</span>
                        <span className="font-mono text-[10px] text-[rgba(239,239,239,.38)] shrink-0">{err.type}</span>
                        <span className="font-mono text-[9px] text-[rgba(239,239,239,.25)]">→</span>
                        <span className="font-mono text-[10px] text-[#00ffff]">{err.action}</span>
                      </div>
                    ))}
                  </div>
                </TerminalBlock>
              ))}
            </div>
          </section>

          {/* ═══════════ 012 — ESCALATION ═══════════ */}
          <section id="escalation" ref={el => { sectionRefs.current['escalation'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>012 — Escalation</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Escalation Chains</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              {ESCALATION_CHAINS.length} recovery paths
            </p>
            <div className="mt-4 border border-[rgba(204,255,0,.2)]">
              {ESCALATION_CHAINS.map((chain, idx) => (
                <div
                  key={chain.trigger}
                  className={`px-4 py-3 bg-[#0f0f0f] ${idx < ESCALATION_CHAINS.length - 1 ? 'border-b border-[rgba(204,255,0,.15)]' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-mono text-[10px] text-[#ff3b30]">{chain.trigger}</span>
                    <ArrowRight size={10} className="text-[#ccff00] hidden sm:block" />
                    <span className="font-mono text-[10px] text-[#00ffff]">{chain.escalateTo}</span>
                  </div>
                  <div className="font-mono text-[9px] text-[rgba(239,239,239,.38)] mt-0.5">{chain.reason}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════ 013 — DEPENDENCIES ═══════════ */}
          <section id="dependencies" ref={el => { sectionRefs.current['dependencies'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>013 — Dependencies</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Skill Dependencies</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              Dependency graph
            </p>
            <div className="mt-4 border border-[rgba(204,255,0,.2)]">
              {DEPENDENCIES.map((dep, idx) => (
                <div
                  key={dep.skill}
                  className={`px-4 py-3 bg-[#0f0f0f] hover:shadow-[6px_6px_0_rgba(204,255,0,.15)] transition-shadow duration-200 ${idx < DEPENDENCIES.length - 1 ? 'border-b border-[rgba(204,255,0,.15)]' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#ccff00]">{dep.skill}</span>
                    <span className="font-mono text-[10px] text-[rgba(239,239,239,.25)]">depends on</span>
                    <div className="flex flex-wrap items-center gap-0.5">
                      {dep.depends.map((d, i) => (
                        <Fragment key={d}>
                          <SkillBadge name={d} />
                          {i < dep.depends.length - 1 && <span className="font-mono text-[9px] text-[rgba(239,239,239,.25)] mx-0.5">+</span>}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-[rgba(239,239,239,.38)] mt-1">{dep.reason}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════ 014 — SELF-HEALING ═══════════ */}
          <section id="healing" ref={el => { sectionRefs.current['healing'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>014 — Self-Healing</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Self-Healing Rules</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              Automated repair rules
            </p>
            <div className="mt-4 border border-[rgba(204,255,0,.2)] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(204,255,0,.2)] hover:bg-transparent">
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">detect</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">repair</TableHead>
                    <TableHead className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(204,255,0,.5)]">severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {HEALING_RULES.map((rule, idx) => (
                    <TableRow key={idx} className="border-[rgba(204,255,0,.15)] hover:bg-[rgba(204,255,0,.05)]">
                      <TableCell className="font-mono text-[10px] text-[rgba(239,239,239,.58)]">{rule.detect}</TableCell>
                      <TableCell className="font-mono text-[10px] text-[#00ffff]">{rule.repair}</TableCell>
                      <TableCell><SeverityBadge severity={rule.severity} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* ═══════════ 015 — FAQ ═══════════ */}
          <section id="faq" ref={el => { sectionRefs.current['faq'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)]">
            <SectionLabel>015 — FAQ</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">FAQ</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              {FAQ_DATA.length} questions
            </p>
            <div className="mt-4">
              <Accordion type="multiple" className="space-y-0">
                {FAQ_DATA.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border border-[rgba(204,255,0,.2)] rounded-none data-[state=open]:bg-[#0f0f0f]">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[rgba(204,255,0,.05)] font-mono text-xs text-[#efefef] text-left [&>svg]:text-[#ccff00]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 font-mono text-[11px] text-[rgba(239,239,239,.58)] leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* ═══════════ 016 — DIRECTORY ═══════════ */}
          <section id="directory" ref={el => { sectionRefs.current['directory'] = el }} className="py-8 border-t border-[rgba(204,255,0,.2)] pb-24">
            <SectionLabel>016 — Directory</SectionLabel>
            <h2 className="mt-3 font-bold text-xl uppercase tracking-[0.1em]">Full Skill Directory</h2>
            <p className="mt-1 font-mono text-[10px] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
              {INSTALLED_SKILLS.length} skills across {ALL_CATEGORIES.length} categories
            </p>
            {/* Search + Category filter */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(239,239,239,.25)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="search skills..."
                  className="w-full bg-[#0f0f0f] border border-[rgba(204,255,0,.2)] rounded-none pl-8 pr-8 py-2 font-mono text-xs text-[#efefef] placeholder:text-[rgba(239,239,239,.25)] outline-none focus:border-[rgba(204,255,0,.5)]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgba(239,239,239,.25)] hover:text-[#efefef]">
                    <X size={12} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-0 border border-[rgba(204,255,0,.2)]">
                <button
                  onClick={() => setDirCategory('All')}
                  className={`px-3 py-2 font-mono text-[9px] tracking-wider uppercase border-r border-[rgba(204,255,0,.2)] ${
                    dirCategory === 'All' ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'text-[rgba(239,239,239,.38)] hover:text-[#efefef]'
                  }`}
                >
                  all
                </button>
                {ALL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setDirCategory(cat)}
                    className={`px-3 py-2 font-mono text-[9px] tracking-wider uppercase border-r border-[rgba(204,255,0,.2)] last:border-r-0 ${
                      dirCategory === cat ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'text-[rgba(239,239,239,.38)] hover:text-[#efefef]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {/* Skills grid */}
            <div className="mt-4 font-mono text-[9px] text-[rgba(239,239,239,.38)] tracking-wider uppercase">
              showing {filteredSkills.length} of {INSTALLED_SKILLS.length}
            </div>
            <div className="mt-2 border border-[rgba(204,255,0,.2)]">
              {filteredSkills.length === 0 ? (
                <div className="p-8 text-center font-mono text-xs text-[rgba(239,239,239,.25)]">no skills match your query</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {filteredSkills.map((skill, idx) => {
                    const health = getHealthBadge(skill.healthScore)
                    return (
                      <div
                        key={skill.name}
                        className={`p-4 bg-[#0f0f0f] hover:shadow-[6px_6px_0_rgba(204,255,0,.15)] transition-shadow duration-200 border border-[rgba(204,255,0,.1)] ${
                          idx < filteredSkills.length - 1 ? '' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <HealthDot score={skill.healthScore} />
                            <span className="font-mono text-xs text-[#efefef]">{skill.name}</span>
                            {skill.isNew && (
                              <span className="font-mono text-[7px] text-[#ccff00] uppercase tracking-wider border border-[#ccff00]/30 px-1">new</span>
                            )}
                          </div>
                          <span className={`font-mono text-[8px] px-1 py-0.5 border rounded-none uppercase tracking-wider shrink-0 ${health.bg} ${health.text} ${health.border}`}>
                            {skill.healthScore}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[9px] text-[rgba(239,239,239,.38)] leading-relaxed">{skill.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-mono text-[8px] px-1 py-0.5 border border-[rgba(204,255,0,.15)] text-[rgba(239,239,239,.38)] uppercase tracking-wider">
                            {skill.category}
                          </span>
                          <span className="font-mono text-[8px] text-[rgba(239,239,239,.25)]">
                            {skill.source}
                          </span>
                          <span className="font-mono text-[8px] text-[#00ffff]">
                            {skill.installs}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

        </div>

        {/* ─── FOOTER ─── */}
        <footer className="mt-auto border-t border-[rgba(204,255,0,.2)] bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[rgba(239,239,239,.25)]">
                SKILLS://DEV · {INSTALLED_SKILLS.length} skills · {SKILL_COMBOS.length} stacks
              </span>
              <Link href="/" className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ccff00] hover:underline">
                ← back to public portal
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
