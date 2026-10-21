import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { business } from '../config'
import { COMPARTMENTS, openStatus, todaySchoolDay } from '../content'
import { useLanguage } from '../i18n/LanguageContext'
import { useOwner } from '../owner/OwnerContext'
import { EditablePrice, EditableText, PhotoSlot } from '../owner/fields'
import Tray, { DayTabs } from '../components/Tray'
import { useWhatsApp } from '../components/WhatsApp'

const PHOTOS = [
  { id: 'dapur', emoji: '🧑‍🍳', look: 'linear-gradient(150deg, #f6d9a8, #e9a64b)' },
  { id: 'masak', emoji: '🍳', look: 'linear-gradient(150deg, #cfe6c4, #6aa95a)' },
  { id: 'antar', emoji: '🚐', look: 'linear-gradient(150deg, #d6dde4, #8f9ba8)' },
]

export default function Home() {
  const { content, update, updateText } = useOwner()
  const { t, pick } = useLanguage()
  const openWhatsApp = useWhatsApp()
  const [day, setDay] = useState(todaySchoolDay)
  const status = useMemo(() => openStatus(content.hours, t), [content.hours, t])
  const h = t.home
  const delivery = `${t.time(content.delivery[0])}–${t.time(content.delivery[1])}`

  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className={`status ${status.open ? 'is-open' : ''}`}><i aria-hidden="true" />{status.label}</p>
          <h1>
            <EditableText multiline value={pick(content.headline)} onChange={(value) => updateText('headline', value)} label={t.owner.fields.headline} />
            <span className="hero-price">
              <EditablePrice value={content.price} onChange={(price) => update({ price })} label={t.owner.fields.price} />
              <small>{h.perPortion}</small>
            </span>
          </h1>
          <p className="lead"><EditableText multiline value={pick(content.lead)} onChange={(value) => updateText('lead', value)} label={t.owner.fields.lead} /></p>
          <div className="ctas">
            <button type="button" className="btn btn-wa" onClick={() => openWhatsApp(t.layout.generalMessage(business.name))}>{h.ctaWhatsApp}</button>
            <Link to="/sekolah" className="btn btn-ghost">{h.ctaCalculate}</Link>
          </div>
          <p className="hero-facts muted">{h.facts(content.minOrder, delivery)}</p>
        </div>

        <div className="hero-tray">
          <p className="tray-caption">{h.trayCaption} <b>{t.days[day]}</b></p>
          <Tray day={day} />
          <DayTabs day={day} onChange={setDay} />
        </div>
      </section>

      <section className="section wrap">
        <p className="eyebrow">{h.trayEyebrow}</p>
        <h2>{h.trayTitle}</h2>
        <ul className="legend">
          {COMPARTMENTS.map((compartment) => (
            <li key={compartment}>
              <span className={`swatch food-${compartment}`} aria-hidden="true" />
              <b>{t.compartments[compartment].label}</b>
              <span className="muted">{t.compartments[compartment].hint}</span>
            </li>
          ))}
        </ul>
        <p className="muted narrow">{h.trayText}</p>
      </section>

      <section className="section wrap">
        <p className="eyebrow">{h.whyEyebrow}</p>
        <h2>{h.whyTitle}</h2>
        <div className="cards">
          <article className="card">
            <span className="card-icon" aria-hidden="true">🧼</span>
            <h3>{h.hygieneTitle}</h3>
            <p>{h.hygieneText}</p>
          </article>
          <article className="card">
            <span className="card-icon" aria-hidden="true">🥗</span>
            <h3>{h.nutritionTitle}</h3>
            <p>{h.nutritionText}</p>
          </article>
          <article className="card">
            <span className="card-icon" aria-hidden="true">⏰</span>
            <h3>{h.onTimeTitle}</h3>
            <p>{h.onTimeText(delivery)}</p>
          </article>
        </div>
      </section>

      <section className="section wrap">
        <p className="eyebrow">{h.photosEyebrow}</p>
        <h2>{h.photosTitle}</h2>
        <div className="gallery">
          {PHOTOS.map((photo) => (
            <figure key={photo.id}>
              <PhotoSlot
                photo={content.photos[photo.id]}
                fallback={{ background: photo.look }}
                onChange={(dataUrl) => update({ photos: { ...content.photos, [photo.id]: dataUrl } })}
                label={h.photos[photo.id]}
              >
                <span className="photo-emoji" aria-hidden="true">{photo.emoji}</span>
              </PhotoSlot>
              <figcaption>{h.photos[photo.id]}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="cta-band">
          <div>
            <h2>{h.bandTitle}</h2>
            <p>{h.bandText(pick(content.deadline))}</p>
          </div>
          <Link to="/sekolah" className="btn btn-light">{h.bandButton}</Link>
        </div>
      </section>
    </>
  )
}
