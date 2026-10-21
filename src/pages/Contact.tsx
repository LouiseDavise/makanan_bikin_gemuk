import { business } from '../config'
import { useLanguage } from '../i18n/LanguageContext'
import { useOwner } from '../owner/OwnerContext'
import { EditableHours, EditableText } from '../owner/fields'
import { useWhatsApp } from '../components/WhatsApp'

export default function Contact() {
  const { content, update, updateText } = useOwner()
  const { t, pick } = useLanguage()
  const openWhatsApp = useWhatsApp()
  const c = t.contact

  return (
    <>
      <section className="page-head wrap">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1>{c.title}</h1>
        <p className="lead">{c.lead}</p>
      </section>

      <section className="section wrap contact">
        <div className="contact-info">
          <h2>{c.address}</h2>
          <p className="address"><EditableText multiline value={pick(content.address)} onChange={(value) => updateText('address', value)} label={t.owner.fields.address} /></p>
          <p>
            WhatsApp: {business.phoneDisplay}<br />
            Email: <a href={`mailto:${business.email}`}>{business.email}</a>
          </p>
          <button type="button" className="btn btn-wa" onClick={() => openWhatsApp(t.layout.generalMessage(business.name))}>{c.chat}</button>

          <h2 className="hours-title">{c.hours}</h2>
          <EditableHours hours={content.hours} onChange={(hours) => update({ hours })} />
          <p className="muted small">{c.hoursNote}</p>
        </div>
        <iframe
          className="map"
          title={c.map(business.name)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&z=14&output=embed&hl=${t.locale.slice(0, 2)}`}
        />
      </section>
    </>
  )
}
