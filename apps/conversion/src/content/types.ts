export interface Edition { id: string; label: string; color: string; image: string; tags?: string[] }
export interface Tier { qty: number; total: number; perUnit?: number; note?: string }

export interface Content {
  version: 1
  site: string
  brand: { wordmark: string; email: string }
  whatsapp: { number: string }
  topBanner?: string
  nav: { links: { label: string; href: string }[] }
  hero: {
    eyebrow: string
    title: string
    titleAccent: string
    sub: string
    image: string
    ctaPrimary: string
    ctaSecondary: string
    chips?: string[]
    assurances: string[]
  }
  problem: { eyebrow: string; title: string; body: string; points: string[] }
  benefits: { eyebrow: string; title: string; items: { title: string; body: string; image: string }[] }
  editionsSection: { eyebrow: string; title: string; sub: string; cta: string; reassure?: string[] }
  editions: Edition[]
  formats: { eyebrow: string; title: string; body: string; image: string; items: { id: string; name: string; detail: string }[] }
  details: {
    eyebrow: string
    title: string
    image: string
    materials: { label: string; detail: string }[]
    size: string
  }
  proof: {
    verified?: boolean
    eyebrow: string
    title: string
    stat: string
    statText: string
    testimonials: { quote: string; name: string; place?: string; tag?: string }[]
  }
  demo: {
    eyebrow: string
    title: string
    sub: string
    note: string
    weekLabel: string
    days: string[]
    daysLong: string[]
    states: { empty: string; done: string; rest: string }
    habitsLabel: string
    habits: string[]
    ringLabel: string
    messages: { zero: string; some: string; most: string; all: string }
    cta: string
    reset: string
  }
  finder: {
    eyebrow: string
    title: string
    sub: string
    step: string
    questions: { q: string; options: { label: string; tags: string[] }[] }[]
    resultEyebrow: string
    resultCta: string
    alsoLike: string
    restart: string
  }
  steps: { eyebrow: string; title: string; items: { title: string; body: string }[] }
  pricing: {
    currency: string
    eyebrow: string
    title: string
    maxQty: number
    tiersNote: string
    productOne: string
    productMany: string
    unitOne: string
    unitMany: string
    perUnitLabel: string
    buyLabel: string
    deadline?: string
    deadlineLabel?: string
    tiers: Tier[]
    mixNote: string
    payNote: string
  }
  gift: { tag: string; title: string; note: string; image: string }
  unboxing: { title: string; body: string; image: string }
  guarantee: { title: string; body: string }
  faq: { q: string; a: string }[]
  finalCta: { title: string; sub: string; cta: string }
  cart: {
    title: string
    open: string
    close: string
    addCta: string
    added: string
    empty: string
    emptyHint: string
    emptyCta: string
    decrease: string
    increase: string
    remove: string
    total: string
    savings: string
    checkout: string
    keepShopping: string
    note: string
    max: string
    viewCart: string
    messageIntro: string
    messageLine: string
    messageTotal: string
  }
  ui: {
    fromPrice: string
    savings: string
    stickyCta: string
    faqEyebrow: string
    faqTitle: string
    faqSub: string
    daysShort: string
    hoursShort: string
    minutesShort: string
    whatsappCta: string
    perDay: string
    nudge: string
    nudgeSave: string
    nudgeBest: string
    heroPick: string
    chosen: string
    pickOne: string
  }
  footer: { links: string[]; legal: string; address: string }
}
