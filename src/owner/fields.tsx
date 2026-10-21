import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useOwner } from './OwnerContext'
import { formatRupiah, jakartaNow, type OpeningHours } from '../content'
import { useLanguage } from '../i18n/LanguageContext'

// Each field renders plain content for visitors and an inline input (dashed outline) in owner mode.

export function EditableText({ value, onChange, label, multiline }: {
  value: string
  onChange: (value: string) => void
  label: string
  multiline?: boolean
}) {
  const { editing } = useOwner()
  const area = useRef<HTMLTextAreaElement>(null)

  // Grow the textarea with its text so headings keep their shape while editing.
  useLayoutEffect(() => {
    const el = area.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value, editing])

  if (!editing) return <>{value}</>
  return multiline
    ? <textarea ref={area} className="owner-field owner-area" value={value} aria-label={label} rows={1} onChange={(event) => onChange(event.target.value)} />
    : <input className="owner-field" value={value} aria-label={label} onChange={(event) => onChange(event.target.value)} />
}

export function EditableNumber({ value, onChange, label, format = String, width = 5 }: {
  value: number
  onChange: (value: number) => void
  label: string
  format?: (value: number) => string
  /** Input width in characters. */
  width?: number
}) {
  const { editing } = useOwner()
  if (!editing) return <>{format(value)}</>
  return (
    <input
      className="owner-field owner-number"
      inputMode="numeric"
      style={{ width: `${width + 1.5}ch` }}
      value={value || ''}
      aria-label={label}
      onChange={(event) => onChange(Number(event.target.value.replace(/\D/g, '').slice(0, 9)) || 0)}
    />
  )
}

export function EditablePrice({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  const { editing } = useOwner()
  if (!editing) return <>{formatRupiah(value)}</>
  return <span className="owner-price">Rp <EditableNumber value={value} onChange={onChange} label={label} width={7} /></span>
}

export function EditableTime({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  const { editing } = useOwner()
  const { t } = useLanguage()
  if (!editing) return <>{t.time(value)}</>
  return <input className="owner-field owner-time" type="time" value={value} aria-label={label} onChange={(event) => onChange(event.target.value || value)} />
}

/** Shrinks an uploaded photo to a small JPEG data URL so it fits in browser storage. */
async function photoToDataUrl(file: File, maxSide = 900): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.8)
}

/** A photo area with an illustrated fallback; in owner mode it gets a change-photo button. */
export function PhotoSlot({ photo, fallback, onChange, label, className, children }: {
  photo?: string
  fallback: CSSProperties
  onChange: (dataUrl: string) => void
  label: string
  className?: string
  children?: ReactNode
}) {
  const { editing } = useOwner()
  const { t } = useLanguage()
  const input = useRef<HTMLInputElement>(null)
  const style = photo ? { backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : fallback
  return (
    <div className={`photo-slot ${className ?? ''}${editing ? ' is-editing' : ''}`} style={style} role="img" aria-label={label}>
      {!photo && children}
      {editing && (
        <>
          <button type="button" className="owner-photo-btn" onClick={() => input.current?.click()}>{t.owner.changePhoto}</button>
          <input
            ref={input}
            type="file"
            accept="image/*"
            hidden
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (file) onChange(await photoToDataUrl(file))
              event.target.value = ''
            }}
          />
        </>
      )}
    </div>
  )
}

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

/** Opening hours; in owner mode each day gets open/close times and a closed toggle. */
export function EditableHours({ hours, onChange }: { hours: OpeningHours; onChange: (hours: OpeningHours) => void }) {
  const { editing } = useOwner()
  const { t } = useLanguage()
  const today = jakartaNow().getDay()
  const setDay = (day: number, slot: [string, string] | null) => onChange({ ...hours, [day]: slot })
  return (
    <table className={`hours${editing ? ' is-editing' : ''}`}>
      <tbody>
        {WEEK_ORDER.map((day) => {
          const slot = hours[day]
          return (
            <tr key={day} className={!editing && day === today ? 'is-today' : ''}>
              <th scope="row">{t.days[day]}</th>
              <td>
                {!editing && (slot ? `${t.time(slot[0])} – ${t.time(slot[1])}` : t.owner.closed)}
                {editing && (
                  <span className="owner-hours">
                    <label className="owner-closed">
                      <input type="checkbox" checked={!slot} onChange={(event) => setDay(day, event.target.checked ? null : ['05:00', '15:00'])} />
                      {t.owner.closed}
                    </label>
                    {slot && (
                      <span className="owner-times">
                        <input className="owner-field owner-time" type="time" value={slot[0]} aria-label={t.owner.opens(t.days[day])} onChange={(event) => setDay(day, [event.target.value || slot[0], slot[1]])} />
                        –
                        <input className="owner-field owner-time" type="time" value={slot[1]} aria-label={t.owner.closes(t.days[day])} onChange={(event) => setDay(day, [slot[0], event.target.value || slot[1]])} />
                      </span>
                    )}
                  </span>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
