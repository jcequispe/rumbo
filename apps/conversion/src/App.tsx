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
import { Demo, Finder } from './components/Experience'
import { CartDrawer, CartToast } from './cart/CartDrawer'
import { CartProvider } from './cart/CartProvider'
import { ContentProvider } from './content/ContentProvider'

function Landing() {
  useReveal()
  return (
    <SelectionProvider>
      <TopBanner />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Demo />
        <Benefits />
        <Finder />
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
