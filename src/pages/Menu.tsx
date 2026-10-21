import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COMPARTMENTS, WEEKDAYS, jakartaNow, todaySchoolDay } from '../content'
import { useLanguage } from '../i18n/LanguageContext'
import { useOwner } from '../owner/OwnerContext'
import { EditablePrice, EditableText } from '../owner/fields'
import Tray, { DayTabs } from '../components/Tray'

export default function Menu() {
  const { content, update, setDish, editing } = useOwner()
  const { t, pick } = useLanguage()
  const [day, setDay] = useState(todaySchoolDay)
  // Real weekday (0 = Sunday), so nothing is marked "today" on weekends.
  const today = jakartaNow().getDay()
  const m = t.menu

  return (
    <>
      <section className="page-head wrap">
        <p className="eyebrow">{m.eyebrow}</p>
        <h1>{m.title}</h1>
        <p className="lead">{m.leadBefore}<EditablePrice value={content.price} onChange={(price) => update({ price })} label={t.owner.fields.price} />{m.leadAfter}</p>
      </section>

      <section className="section wrap menu-feature">
        <div>
          <DayTabs day={day} onChange={setDay} />
          <Tray day={day} />
        </div>
        <div className="menu-feature-copy">
          <h2>{t.days[day]}</h2>
          <ul className="dish-list">
            {COMPARTMENTS.map((compartment) => (
              <li key={compartment}>
                <span className={`swatch food-${compartment}`} aria-hidden="true" />
                <span className="muted">{t.compartments[compartment].label}</span>
                <b>{pick(content.menu[day][compartment])}</b>
              </li>
            ))}
          </ul>
          {editing && <p className="owner-tip">{m.ownerTip}</p>}
        </div>
      </section>

      <section className="section wrap">
        <h2>{m.weekTitle}</h2>
        <div className="week">
          {WEEKDAYS.map((item) => (
            <article key={item} className={`week-day${item === today ? ' is-today' : ''}`}>
              <h3>{t.days[item]}{item === today && <em>{m.today}</em>}</h3>
              <dl>
                {COMPARTMENTS.map((compartment) => {
                  const { label } = t.compartments[compartment]
                  return (
                    <div key={compartment}>
                      <dt>{label}</dt>
                      <dd><EditableText value={pick(content.menu[item][compartment])} onChange={(value) => setDish(item, compartment, value)} label={t.owner.dish(label, t.days[item])} /></dd>
                    </div>
                  )
                })}
              </dl>
            </article>
          ))}
        </div>
        <p className="muted small note">{m.note}</p>
        <div className="ctas">
          <Link to="/sekolah" className="btn btn-primary">{m.orderCta}</Link>
        </div>
      </section>
    </>
  )
}
