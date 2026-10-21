import { business } from '../config'
import { useLanguage } from '../i18n/LanguageContext'
import { LANGS, STRINGS } from '../i18n/strings'
import Stoe from './Stoe'

/** First-visit pop-up: the site waits behind it until the visitor picks a language. */
export default function LanguagePicker() {
  const { chosen, setLang } = useLanguage()
  if (chosen) return null
  return (
    <div className="modal lang-modal" role="dialog" aria-modal="true" aria-labelledby="lang-title">
      <div className="modal-card lang-card">
        <Stoe pose="wave" scale={3} />
        <p className="lang-name">{business.name}</p>
        <h2 id="lang-title">Pilih bahasa<span>Choose your language</span></h2>
        <div className="lang-options">
          {LANGS.map((lang) => (
            <button key={lang} type="button" className="lang-option" lang={lang} onClick={() => setLang(lang)} autoFocus={lang === 'id'}>
              <b>{lang.toUpperCase()}</b>
              {STRINGS[lang].langName}
            </button>
          ))}
        </div>
        <p className="muted small">Bisa diganti kapan saja di menu atas · You can switch anytime at the top</p>
      </div>
    </div>
  )
}

/** Compact ID | EN switch for the header. */
export function LanguageSwitch() {
  const { lang, t, setLang } = useLanguage()
  return (
    <div className="lang-switch" role="group" aria-label={t.layout.language}>
      {LANGS.map((item) => (
        <button key={item} type="button" aria-pressed={lang === item} lang={item} onClick={() => setLang(item)} aria-label={STRINGS[item].langName}>
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
