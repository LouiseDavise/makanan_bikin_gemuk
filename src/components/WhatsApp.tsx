import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { business, stoedio, waLink } from '../config'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * `openWhatsApp(message)` opens a chat with the kitchen. In the demo there is no real kitchen
 * number, so it previews the message instead and offers to send it to STOEDIO.
 */
const WhatsAppContext = createContext<(message: string) => void>(() => {})

export function useWhatsApp() {
  return useContext(WhatsAppContext)
}

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<string | null>(null)
  const open = useCallback((message: string) => {
    if (!business.demo && business.whatsapp) window.open(waLink(business.whatsapp, message), '_blank', 'noopener')
    else setPreview(message)
  }, [])

  return (
    <WhatsAppContext.Provider value={open}>
      {children}
      {preview && <WhatsAppPreview message={preview} onClose={() => setPreview(null)} />}
    </WhatsAppContext.Provider>
  )
}

function WhatsAppPreview({ message, onClose }: { message: string; onClose: () => void }) {
  const { t } = useLanguage()
  const w = t.whatsapp
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const tryLink = waLink(stoedio.whatsapp, `${w.toStoedio(business.name)}${message}`)

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={w.dialog} onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <p className="modal-eyebrow">{w.eyebrow}</p>
        <div className="wa-bubble">{message}</div>
        <p className="modal-note">{w.note}</p>
        <div className="modal-actions">
          <a className="btn btn-wa" href={tryLink} target="_blank" rel="noreferrer">{w.tryStoedio}</a>
          <a className="btn btn-ghost" href={`${stoedio.url}/#contact`}>{w.wantSite}</a>
          <button type="button" className="btn btn-ghost" onClick={onClose}>{w.close}</button>
        </div>
      </div>
    </div>
  )
}
