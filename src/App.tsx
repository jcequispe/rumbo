import { useEffect } from 'react'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import Experience from './components/Experience'
import SoundToggle from './components/SoundToggle'
import { Testimonials, ForWhom, Closing, WhatsAppBar } from './components/Sections'
import { initSmoothScroll } from './lib/smoothScroll'

export default function App() {
  useEffect(() => {
    initSmoothScroll()
  }, [])

  return (
    <div className="site" id="top">
      <Cursor />
      <ScrollProgress />
      <Nav />
      <SoundToggle />
      <Experience />
      <ForWhom />
      <Testimonials />
      <Closing />
      <WhatsAppBar />
    </div>
  )
}
