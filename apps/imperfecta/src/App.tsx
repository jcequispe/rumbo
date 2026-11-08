import VariantSwitcher from './components/VariantSwitcher'
import {
  DetailsCollage,
  EditionPicker,
  Faq,
  FeatureCarousel,
  Footer,
  FormatPicker,
  GiftBonus,
  Hero,
  Manifesto,
  Marquee,
  MaterialsList,
  Nav,
  PriceFaqStrip,
  PricingSelector,
  SizeSpec,
  SocialProof,
  StickyBuyBar,
  Testimonials,
  TopBanner,
  Unboxing,
} from './components/Sections'
import { ContentProvider } from './content/ContentProvider'
import './App.css'

function App() {
  return (
    <div className="site">
      <VariantSwitcher />
      <ContentProvider>
      <TopBanner />
      <Nav />
      <Hero />
      <Marquee />
      <EditionPicker />
      <SocialProof />
      <Testimonials />
      <PriceFaqStrip />
      <FormatPicker />
      <FeatureCarousel />
      <DetailsCollage />
      <MaterialsList />
      <SizeSpec />
      <GiftBonus />
      <Unboxing />
      <PricingSelector />
      <Faq />
      <Manifesto />
      <Footer />
      <StickyBuyBar />
      </ContentProvider>
    </div>
  )
}

export default App
