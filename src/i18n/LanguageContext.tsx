import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { LANGS, STRINGS, type Lang, type Localized, type Strings } from './strings'

const STORAGE_KEY = 'mbg-lang'

interface LanguageState {
  lang: Lang
  t: Strings
  /** False until the visitor picks a language (first visit), which shows the picker. */
  chosen: boolean
  setLang: (lang: Lang) => void
  /** The current language's version of owner-editable text. */
  pick: (text: Localized) => string
}

const LanguageContext = createContext<LanguageState | null>(null)

/** `?lang=en` (or `id`) in the URL, then the saved choice; null on a first visit. */
function initialLang(): Lang | null {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (LANGS.includes(fromUrl as Lang)) return fromUrl as Lang
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return LANGS.includes(saved as Lang) ? saved as Lang : null
  } catch {
    return null
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState(initialLang)
  const lang = choice ?? 'id'
  const t = STRINGS[lang]

  const setLang = useCallback((next: Lang) => {
    setChoice(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* private mode: ask again next visit */ }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [lang, t])

  const value = useMemo<LanguageState>(() => ({
    lang,
    t,
    chosen: choice !== null,
    setLang,
    pick: (text) => text[lang],
  }), [lang, t, choice, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageState {
  const state = useContext(LanguageContext)
  if (!state) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return state
}
