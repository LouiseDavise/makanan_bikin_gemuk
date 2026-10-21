import { Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { WhatsAppProvider } from './components/WhatsApp'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import { OwnerProvider } from './owner/OwnerContext'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Schools from './pages/Schools'
import Contact from './pages/Contact'

function NotFound() {
  const { t } = useLanguage()
  return (
    <section className="page-head wrap">
      <h1>{t.notFound.title}</h1>
      <p className="lead"><Link to="/">{t.notFound.back}</Link></p>
    </section>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <OwnerProvider>
        <WhatsAppProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="sekolah" element={<Schools />} />
              <Route path="kontak" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </WhatsAppProvider>
      </OwnerProvider>
    </LanguageProvider>
  )
}
