'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clipboard, X, Trash2, Copy, ChevronUp } from 'lucide-react'

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────
export interface ClipboardItem {
  id: string
  text: string
  timestamp: number
  label?: string
}

interface ClipboardBasketState {
  items: ClipboardItem[]
  addItem: (text: string, label?: string) => void
  removeItem: (id: string) => void
  clearAll: () => void
  copyAll: () => void
  copyItem: (id: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ClipboardBasketContext = createContext<ClipboardBasketState | null>(null)

const MAX_ITEMS = 50
const STORAGE_KEY = 'clipboard-basket-items'

// ──────────────────────────────────────────────────────────
// PROVIDER
// ──────────────────────────────────────────────────────────
export function ClipboardBasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ClipboardItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw)
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage full or unavailable
    }
  }, [items])

  const addItem = useCallback((text: string, label?: string) => {
    const newItem: ClipboardItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      timestamp: Date.now(),
      label,
    }
    setItems(prev => {
      const updated = [newItem, ...prev]
      if (updated.length > MAX_ITEMS) {
        return updated.slice(0, MAX_ITEMS)
      }
      return updated
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
  }, [])

  const copyAll = useCallback(() => {
    if (items.length === 0) return
    const allText = items.map(item => item.text).join('\n')
    navigator.clipboard.writeText(allText)
  }, [items])

  const copyItem = useCallback((id: string) => {
    const item = items.find(i => i.id === id)
    if (item) {
      navigator.clipboard.writeText(item.text)
    }
  }, [items])

  return (
    <ClipboardBasketContext.Provider value={{ items, addItem, removeItem, clearAll, copyAll, copyItem, isOpen, setIsOpen }}>
      {children}
    </ClipboardBasketContext.Provider>
  )
}

export function useClipboardBasket() {
  const ctx = useContext(ClipboardBasketContext)
  if (!ctx) throw new Error('useClipboardBasket must be used within ClipboardBasketProvider')
  return ctx
}

export function useClipboardBasketSafe() {
  const ctx = useContext(ClipboardBasketContext)
  if (!ctx) {
    return {
      items: [] as ClipboardItem[],
      addItem: () => {},
      removeItem: () => {},
      clearAll: () => {},
      copyAll: () => {},
      copyItem: () => {},
      isOpen: false,
      setIsOpen: () => {},
    }
  }
  return ctx
}

// ──────────────────────────────────────────────────────────
// FLOATING BASKET BUTTON + DRAWER
// ──────────────────────────────────────────────────────────
export function ClipboardBasketFloating() {
  const { items, removeItem, clearAll, copyAll, copyItem, isOpen, setIsOpen } = useClipboardBasket()
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleCopyAll = useCallback(() => {
    copyAll()
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }, [copyAll])

  const handleCopyItem = useCallback((id: string) => {
    copyItem(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }, [copyItem])

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'just now'
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h ago`
    return d.toLocaleDateString()
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 lg:bottom-6 lg:right-6 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 flex items-center justify-center hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
        aria-label={`Clipboard basket: ${items.length} items`}
      >
        <Clipboard className="h-5 w-5 lg:h-6 lg:w-6" />
        {items.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {items.length > 99 ? '99+' : items.length}
          </motion.span>
        )}
      </motion.button>

      {/* Drawer/panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 lg:initial-none max-h-[80vh] rounded-t-2xl bg-background border-t border-border shadow-2xl flex flex-col
                lg:fixed lg:inset-x-auto lg:right-6 lg:bottom-24 lg:w-96 lg:max-h-[70vh] lg:rounded-2xl lg:border"
              style={typeof window !== 'undefined' && window.innerWidth >= 1024 ? {
                right: '1.5rem',
                bottom: '6rem',
                left: 'auto',
                width: '24rem',
              } : {}}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <Clipboard className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-sm">Clipboard Basket</h3>
                  <span className="text-xs text-muted-foreground">({items.length})</span>
                </div>
                <div className="flex items-center gap-1">
                  {items.length > 0 && (
                    <>
                      <button
                        onClick={handleCopyAll}
                        className="text-xs px-2.5 py-1.5 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors min-h-[32px]"
                      >
                        {copiedAll ? '✓ Copied!' : 'Copy All'}
                      </button>
                      <button
                        onClick={clearAll}
                        className="text-xs px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors min-h-[32px]"
                      >
                        Clear All
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors ml-1"
                    aria-label="Close clipboard basket"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Drag handle (mobile) */}
              <div className="flex justify-center py-1 lg:hidden">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Items list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: 'thin' }}>
                {items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Clipboard className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>No copied items yet</p>
                    <p className="text-xs mt-1">Click copy buttons to add items here</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      layout
                      className="group flex items-start gap-2 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs break-all leading-relaxed">
                          {expandedId === item.id
                            ? item.text
                            : item.text.length > 120
                              ? item.text.slice(0, 120) + '…'
                              : item.text
                          }
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.label && (
                            <span className="text-[10px] text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              {item.label}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">{formatTime(item.timestamp)}</span>
                          {item.text.length > 120 && (
                            <button
                              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                              className="text-[10px] text-blue-500 hover:underline"
                            >
                              {expandedId === item.id ? 'less' : 'more'}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => handleCopyItem(item.id)}
                          className="p-1.5 rounded-md hover:bg-emerald-500/10 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                          aria-label="Copy item"
                        >
                          {copiedId === item.id ? (
                            <span className="text-emerald-500 text-xs">✓</span>
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-md hover:bg-red-500/10 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-3 border-t border-border text-[10px] text-muted-foreground text-center shrink-0">
                  {items.length}/{MAX_ITEMS} items · Oldest removed when full
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
