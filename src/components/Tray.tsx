import { COMPARTMENTS, WEEKDAYS, type Weekday } from '../content'
import { useLanguage } from '../i18n/LanguageContext'
import { useOwner } from '../owner/OwnerContext'
import { EditableText } from '../owner/fields'

/** The stainless tray with the chosen day's dish in each compartment (editable in owner mode). */
export default function Tray({ day }: { day: Weekday }) {
  const { content, setDish } = useOwner()
  const { t, pick } = useLanguage()
  const menu = content.menu[day]
  return (
    <figure className="tray" aria-label={t.home.trayLabel(t.days[day])}>
      {COMPARTMENTS.map((compartment) => {
        const { label } = t.compartments[compartment]
        return (
          <div key={compartment} className={`tray-cell cell-${compartment}`}>
            <span className={`food food-${compartment}`} aria-hidden="true" />
            <span className="cell-label">{label}</span>
            <span className="cell-dish">
              <EditableText value={pick(menu[compartment])} onChange={(value) => setDish(day, compartment, value)} label={t.owner.dish(label, t.days[day])} />
            </span>
          </div>
        )
      })}
    </figure>
  )
}

export function DayTabs({ day, onChange }: { day: Weekday; onChange: (day: Weekday) => void }) {
  const { t } = useLanguage()
  return (
    <div className="day-tabs" role="tablist" aria-label={t.home.dayTabs}>
      {WEEKDAYS.map((item) => (
        <button key={item} type="button" role="tab" aria-selected={day === item} onClick={() => onChange(item)}>
          <span className="day-short">{t.daysShort[item]}</span>
          <span className="day-long">{t.days[item]}</span>
        </button>
      ))}
    </div>
  )
}
