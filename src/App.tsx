import { useEffect } from 'react'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import Experience from './components/Experience'
import VariantSwitcher from './components/VariantSwitcher'
import { Testimonials, ForWhom, Closing, WhatsAppBar } from './components/Sections'
import { initSmoothScroll } from './lib/smoothScroll'

export default function App() {
  useEffect(() => {
    initSmoothScroll()
  }, [])

  return (
    <div className="site" id="top">
      <VariantSwitcher />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <Experience />
      <ForWhom />
      <Testimonials />
      <Closing />
      <WhatsAppBar />
    </div>
  )
}
