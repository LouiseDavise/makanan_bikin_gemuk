import { useState } from 'react'
import type { FormEvent } from 'react'
import { business } from '../config'
import { WEEKDAYS, formatRupiah, type Weekday } from '../content'
import { useLanguage } from '../i18n/LanguageContext'
import { useOwner } from '../owner/OwnerContext'
import { EditableNumber, EditablePrice, EditableText, EditableTime } from '../owner/fields'
import { useWhatsApp } from '../components/WhatsApp'

export default function Schools() {
  const { content, update, updateText } = useOwner()
  const { t, pick } = useLanguage()
  const openWhatsApp = useWhatsApp()
  const [school, setSchool] = useState('')
  const [contact, setContact] = useState('')
  const [address, setAddress] = useState('')
  const [students, setStudents] = useState(100)
  const [days, setDays] = useState<Weekday[]>(WEEKDAYS)
  const [start, setStart] = useState('')
  const [notes, setNotes] = useState('')
  const s = t.schools
  const delivery = `${t.time(content.delivery[0])}–${t.time(content.delivery[1])}`

  const perDay = students * content.price
  const perWeek = perDay * days.length
  const belowMinimum = students < content.minOrder
  const missing = !school.trim() ? s.missingSchool : belowMinimum ? s.missingMin(content.minOrder) : !days.length ? s.missingDays : null

  const toggleDay = (day: Weekday) => setDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort())

  function submit(event: FormEvent) {
    event.preventDefault()
    if (missing) return
    const m = s.message
    const dateFormat = new Intl.DateTimeFormat(t.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const lines = [
      m.greeting(business.name),
      '',
      `${m.school}: ${school.trim()}`,
      contact.trim() ? `${m.contact}: ${contact.trim()}` : null,
      m.quantity(students),
      `${m.days}: ${days.map((day) => t.days[day]).join(', ')}`,
      start ? `${m.start}: ${dateFormat.format(new Date(`${start}T00:00`))}` : null,
      address.trim() ? `${m.address}: ${address.trim()}` : null,
      notes.trim() ? `${m.notes}: ${notes.trim()}` : null,
      '',
      m.estimate(students, formatRupiah(content.price), days.length, formatRupiah(perWeek)),
      m.closing,
    ]
    openWhatsApp(lines.filter((line) => line !== null).join('\n'))
  }

  return (
    <>
      <section className="page-head wrap">
        <p className="eyebrow">{s.eyebrow}</p>
        <h1>{s.title}</h1>
        <p className="lead">{s.lead}</p>
      </section>

      <section className="section wrap">
        <div className="facts">
          <div className="fact">
            <span className="muted">{s.price}</span>
            <b><EditablePrice value={content.price} onChange={(price) => update({ price })} label={t.owner.fields.price} /></b>
            <span className="muted small">{s.priceNote}</span>
          </div>
          <div className="fact">
            <span className="muted">{s.min}</span>
            <b><EditableNumber value={content.minOrder} onChange={(minOrder) => update({ minOrder })} label={t.owner.fields.minOrder} width={4} /> {s.portions}</b>
            <span className="muted small">{s.minNote}</span>
          </div>
          <div className="fact">
            <span className="muted">{s.delivery}</span>
            <b>
              <EditableTime value={content.delivery[0]} onChange={(from) => update({ delivery: [from, content.delivery[1]] })} label={t.owner.fields.deliveryFrom} />
              –
              <EditableTime value={content.delivery[1]} onChange={(to) => update({ delivery: [content.delivery[0], to] })} label={t.owner.fields.deliveryTo} />
            </b>
            <span className="muted small">{s.deliveryNote}</span>
          </div>
          <div className="fact">
            <span className="muted">{s.deadline}</span>
            <b><EditableText value={pick(content.deadline)} onChange={(value) => updateText('deadline', value)} label={t.owner.fields.deadline} /></b>
            <span className="muted small">{s.deadlineNote}</span>
          </div>
        </div>
      </section>

      <section className="section wrap" id="pesan">
        <form className="order" onSubmit={submit}>
          <div className="order-fields">
            <h2>{s.formTitle}</h2>
            <label>
              {s.school}
              <input value={school} onChange={(event) => setSchool(event.target.value)} placeholder={s.schoolPlaceholder} autoComplete="organization" />
            </label>
            <label>
              {s.contact}
              <input value={contact} onChange={(event) => setContact(event.target.value)} placeholder={s.contactPlaceholder} autoComplete="name" />
            </label>
            <label>
              {s.students}
              <span className="stepper">
                <button type="button" aria-label={s.less} onClick={() => setStudents((value) => Math.max(0, value - 10))}>−</button>
                <input inputMode="numeric" value={students || ''} onChange={(event) => setStudents(Number(event.target.value.replace(/\D/g, '').slice(0, 5)) || 0)} aria-describedby="min-hint" />
                <button type="button" aria-label={s.more} onClick={() => setStudents((value) => value + 10)}>+</button>
              </span>
              <span id="min-hint" className={`hint${belowMinimum ? ' is-warning' : ''}`}>{s.minHint(content.minOrder)}</span>
            </label>
            <fieldset>
              <legend>{s.days}</legend>
              <div className="day-picks">
                {WEEKDAYS.map((day) => (
                  <label key={day} className={days.includes(day) ? 'is-on' : ''}>
                    <input type="checkbox" checked={days.includes(day)} onChange={() => toggleDay(day)} />
                    {t.daysShort[day]}
                  </label>
                ))}
              </div>
            </fieldset>
            <label>
              <span>{s.start} <span className="muted">{s.optional}</span></span>
              <input type="date" value={start} onChange={(event) => setStart(event.target.value)} />
            </label>
            <label>
              <span>{s.address} <span className="muted">{s.optional}</span></span>
              <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder={s.addressPlaceholder} autoComplete="street-address" />
            </label>
            <label>
              <span>{s.notes} <span className="muted">{s.optional}</span></span>
              <textarea rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={s.notesPlaceholder} />
            </label>
          </div>

          <aside className="order-summary" aria-live="polite">
            <p className="muted">{s.estimate}</p>
            <dl>
              <div><dt>{students} × {formatRupiah(content.price)}</dt><dd>{formatRupiah(perDay)} {s.perDay}</dd></div>
              <div><dt>{s.daysPerWeek(days.length)}</dt><dd>× {days.length}</dd></div>
            </dl>
            <p className="total"><span>{s.total}</span><b>{formatRupiah(perWeek)}</b></p>
            <p className="muted small">{s.summaryNote(delivery)}</p>
            <button type="submit" className="btn btn-wa btn-block" disabled={!!missing}>{s.submit}</button>
            {missing && <p className="hint">{missing}</p>}
          </aside>
        </form>
      </section>
    </>
  )
}
