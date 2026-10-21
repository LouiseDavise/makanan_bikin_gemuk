import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { business, stoedio } from '../config'
import { useLanguage } from '../i18n/LanguageContext'
import { useOwner } from '../owner/OwnerContext'
import { useWhatsApp } from './WhatsApp'
import LanguagePicker, { LanguageSwitch } from './LanguagePicker'
import Stoe from './Stoe'

export function Logo() {
  const { t } = useLanguage()
  return (
    <Link to="/" className="logo" aria-label={t.layout.homeLabel(business.name)}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="4" y="10" width="56" height="44" rx="12" fill="#c3cad1" />
        <rect x="9" y="15" width="20" height="14" rx="5" fill="#3f8f3a" />
        <rect x="32" y="15" width="11" height="14" rx="5" fill="#f2a93b" />
        <rect x="46" y="15" width="9" height="14" rx="4" fill="#d9a35b" />
        <rect x="9" y="32" width="30" height="17" rx="6" fill="#fffaf0" />
        <rect x="42" y="32" width="13" height="17" rx="5" fill="#c4612b" />
      </svg>
      <span>Makanan<br /><b>Bikin Gemuk</b></span>
    </Link>
  )
}

function OwnerBar() {
  const { editing, dirty, save, cancel } = useOwner()
  const { t } = useLanguage()
  if (!editing) return null
  return (
    <div className="owner-bar" role="region" aria-label={t.owner.mode}>
      <Stoe pose="wave" scale={2} />
      <p><b>{t.owner.mode}</b><span> · {t.owner.hint}</span><small>{t.owner.editingLang}</small></p>
      <div className="owner-bar-actions">
        <button type="button" className="btn btn-small btn-ghost-light" onClick={cancel}>{t.owner.cancel}</button>
        <button type="button" className="btn btn-small btn-save" onClick={save} disabled={!dirty}>{t.owner.save}</button>
      </div>
    </div>
  )
}

/** Scroll to the top on page change, or to `#id` when the link has one. */
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
}

export default function Layout() {
  const { content, editing, start, resetDemo, toast } = useOwner()
  const { t, pick } = useLanguage()
  const openWhatsApp = useWhatsApp()
  const l = t.layout
  const nav = [
    { to: '/', label: l.nav.home },
    { to: '/menu', label: l.nav.menu },
    { to: '/sekolah', label: l.nav.schools },
    { to: '/kontak', label: l.nav.contact },
  ]
  const updated = new Intl.DateTimeFormat(t.locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' })
  useScrollOnNavigate()

  return (
    <div className={`app${editing ? ' is-editing' : ''}`}>
      <div className="top-stack">
        {business.demo && (
          <div className="demo-banner" role="note">
            <span>{l.demoBy} <b>STOEDIO</b>. {l.demoFictional(business.name)}</span>
            <a href={stoedio.url}>{l.demoCta}</a>
          </div>
        )}
        <OwnerBar />
      </div>

      <header className="site-header">
        <div className="wrap header-inner">
          <Logo />
          <nav className="site-nav" aria-label={l.navLabel}>
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>{item.label}</NavLink>
            ))}
          </nav>
          <LanguageSwitch />
          <button type="button" className="btn btn-wa btn-small" onClick={() => openWhatsApp(l.generalMessage(business.name))}>{l.order}</button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div>
            <Logo />
            <p className="muted">{pick(content.address)}</p>
            {content.updatedAt && <p className="muted small">{l.updatedAt} {updated.format(new Date(content.updatedAt))}</p>}
          </div>
          <div className="footer-credit">
            <Stoe pose="front" scale={3} />
            <p>{l.creditBy} <b>Stoe</b> {l.creditFrom} <a href={stoedio.url}>STOEDIO</a>.<br /><span className="muted small">{l.creditNote}</span></p>
          </div>
        </div>
        {business.demo && (
          <div className="wrap footer-demo">
            <button type="button" className="link-button" onClick={resetDemo}>{l.resetDemo}</button>
          </div>
        )}
      </footer>

      <div className="floaters">
        {!editing && (
          <button type="button" className="owner-toggle" onClick={start}>
            <span aria-hidden="true">✎</span> {t.owner.mode}{business.demo && <small>{t.owner.try}</small>}
          </button>
        )}
        <button type="button" className="wa-float" aria-label={l.chat} onClick={() => openWhatsApp(l.generalMessage(business.name))}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
        </button>
      </div>

      {toast && (
        <div className="toast" role="status">
          <Stoe pose="happy" scale={2} />
          <span>{toast === 'saved' ? t.owner.toastSaved : t.owner.toastReset}</span>
        </div>
      )}

      <LanguagePicker />
    </div>
  )
}
