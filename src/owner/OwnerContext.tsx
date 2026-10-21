import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DEFAULT_CONTENT, mergeContent, type Compartment, type SiteContent, type TextKey, type Weekday } from '../content'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * Light editing: the owner edits a draft in place and "Simpan" publishes it. In this demo the
 * published content lives in the visitor's browser (localStorage), falling back to memory when
 * storage is blocked. A real build would save to the kitchen's own content store instead.
 */
const STORAGE_KEY = 'mbg-content-v2'

export type Toast = 'saved' | 'reset'

interface OwnerState {
  /** What the page shows: the draft while editing, otherwise the published content. */
  content: SiteContent
  editing: boolean
  dirty: boolean
  toast: Toast | null
  start: () => void
  update: (patch: Partial<SiteContent>) => void
  /** Sets the current language's version of a text field. */
  updateText: (key: TextKey, value: string) => void
  setDish: (day: Weekday, compartment: Compartment, value: string) => void
  save: () => void
  cancel: () => void
  resetDemo: () => void
}

const OwnerContext = createContext<OwnerState | null>(null)

function load(): SiteContent {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? mergeContent(JSON.parse(saved) as Partial<SiteContent>) : DEFAULT_CONTENT
  } catch {
    return DEFAULT_CONTENT
  }
}

function persist(content: SiteContent | null) {
  try {
    if (content) localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    else localStorage.removeItem(STORAGE_KEY)
  } catch { /* quota or private mode: keep in memory */ }
}

export function OwnerProvider({ children }: { children: ReactNode }) {
  const { lang, t } = useLanguage()
  const [published, setPublished] = useState(load)
  // `?pemilik` in the URL opens owner mode straight away (handy for screen recordings).
  const [draft, setDraft] = useState<SiteContent | null>(() => new URLSearchParams(window.location.search).has('pemilik') ? published : null)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const start = useCallback(() => setDraft((current) => current ?? published), [published])
  const update = useCallback((patch: Partial<SiteContent>) => setDraft((current) => current && { ...current, ...patch }), [])
  const updateText = useCallback((key: TextKey, value: string) => {
    setDraft((current) => current && { ...current, [key]: { ...current[key], [lang]: value } })
  }, [lang])
  const setDish = useCallback((day: Weekday, compartment: Compartment, value: string) => {
    setDraft((current) => current && {
      ...current,
      menu: { ...current.menu, [day]: { ...current.menu[day], [compartment]: { ...current.menu[day][compartment], [lang]: value } } },
    })
  }, [lang])

  const dirty = useMemo(() => !!draft && JSON.stringify(draft) !== JSON.stringify(published), [draft, published])

  const save = useCallback(() => {
    if (!draft) return
    const next = { ...draft, updatedAt: new Date().toISOString() }
    persist(next)
    setPublished(next)
    setDraft(null)
    setToast('saved')
  }, [draft])

  const cancel = useCallback(() => {
    if (dirty && !window.confirm(t.owner.confirmDiscard)) return
    setDraft(null)
  }, [dirty, t])

  const resetDemo = useCallback(() => {
    persist(null)
    setPublished(DEFAULT_CONTENT)
    setDraft(null)
    setToast('reset')
  }, [])

  const value = useMemo<OwnerState>(() => ({
    content: draft ?? published,
    editing: !!draft,
    dirty,
    toast,
    start,
    update,
    updateText,
    setDish,
    save,
    cancel,
    resetDemo,
  }), [draft, published, dirty, toast, start, update, updateText, setDish, save, cancel, resetDemo])

  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>
}

export function useOwner(): OwnerState {
  const state = useContext(OwnerContext)
  if (!state) throw new Error('useOwner must be used inside <OwnerProvider>')
  return state
}
