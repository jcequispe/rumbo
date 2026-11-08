export interface Edition { id: string; label: string; color: string; image: string }
export interface Tier { qty: number; total: number; perUnit?: number }

export interface Content {
  version: 1
  site: string
  brand: { wordmark: string; email: string }
  whatsapp: { number: string; orderMessage: string }
  topBanner?: string
  hero: {
    image: string
    ctaPrimary: string
    video?: { src: string; srcWebm?: string; poster: string }
  }
  marquee: string[]
  socialProof: { eyebrow: string; stat: string; text: string }
  editions: Edition[]
  testimonials: { quote: string; name: string; place?: string; tag?: string }[]
  priceFaq: { eyebrow: string; question: string; answer: string }
  formats: { image: string; items: { id: string; name: string; detail: string }[] }
  features: { category: string; title: string; body: string; image?: string }[]
  collage: string[]
  details: { eyebrow: string; title: string; materials: { label: string; detail: string }[] }
  sizeSpec: { eyebrow: string; title: string; detail: string; weights: string[]; image: string }
  giftBonus: { tag: string; stamp: string; title: string; detail: string; valueNote: string; multiNote: string; image: string }
  unboxing: { text: string; image: string }
  pricing: {
    currency: string
    highlightQty: number
    productOne: string
    productMany: string
    unitOne: string
    unitMany: string
    perUnitLabel: string
    buyLabel: string
    eyebrow: string
    title: string
    tiers: Tier[]
    deadlineNote: string
    afterNote: string
    mixNote: string
    payNote: string
  }
  ui: { formatTag: string; editionCta: string; faqTag: string; faqTitle: string; faqSub: string }
  faq: { q: string; a: string }[]
  manifesto: { eyebrow: string; titleTop: string; titleBottom: string }
  footer: { links: string[]; legal: string; address: string }
}
