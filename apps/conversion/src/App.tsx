import {
  Benefits,
  BuyBox,
  Details,
  Faq,
  FinalCta,
  Footer,
  Hero,
  Nav,
  Problem,
  Proof,
  SelectionProvider,
  Steps,
  StickyBar,
  TopBanner,
  TrustBar,
  useReveal,
} from './components/Sections'
import { useParallax } from './components/Experience'
import { CartDrawer, CartToast } from './cart/CartDrawer'
import { CartProvider } from './cart/CartProvider'
import { ContentProvider } from './content/ContentProvider'
import Atmosphere from './components/Atmosphere'
import { useScrollEngine } from './scroll'

function Landing() {
  useReveal()
  useScrollEngine()
  useParallax()
  return (
    <SelectionProvider>
      <TopBanner />
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Benefits />
        <Details />
        <Proof />
        <Steps />
        <BuyBox />
        <FinalCta />
        <Faq />
      </main>
      <Footer />
      <StickyBar />
    </SelectionProvider>
  )
}

export default function App() {
  return (
    <>
      <Atmosphere />
      <ContentProvider>
        <CartProvider>
          <Landing />
          <CartDrawer />
          <CartToast />
        </CartProvider>
      </ContentProvider>
    </>
  )
}
