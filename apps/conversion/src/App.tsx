import VariantSwitcher from './components/VariantSwitcher'
import {
  Benefits,
  Details,
  EditionPicker,
  Faq,
  FinalCta,
  Footer,
  Hero,
  Nav,
  Pricing,
  Problem,
  Proof,
  SelectionProvider,
  Steps,
  StickyBar,
  TopBanner,
  Unboxing,
  useReveal,
} from './components/Sections'
import { Demo } from './components/Experience'
import { CartDrawer, CartToast } from './cart/CartDrawer'
import { CartProvider } from './cart/CartProvider'
import { ContentProvider } from './content/ContentProvider'
import Atmosphere from './components/Atmosphere'
import { useScrollEngine } from './scroll'

function Landing() {
  useReveal()
  useScrollEngine()
  return (
    <SelectionProvider>
      <TopBanner />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Demo />
        <Benefits />
        <EditionPicker />
        <Details />
        <Proof />
        <Steps />
        <Pricing />
        <Unboxing />
        <Faq />
        <FinalCta />
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
      <VariantSwitcher />
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
