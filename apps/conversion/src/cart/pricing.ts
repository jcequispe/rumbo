import type { Tier } from '../content/types'

/** Mínimo total para `n` agendas combinando los tramos tantas veces como convenga. */
export function bestTotal(tiers: Tier[], n: number): number {
  const best: number[] = [0]
  for (let i = 1; i <= n; i++) {
    let min = Infinity
    for (const t of tiers) if (t.qty <= i) min = Math.min(min, best[i - t.qty] + t.total)
    best[i] = min
  }
  return best[n]
}

export function unitPrice(tiers: Tier[]): number {
  const one = tiers.find((t) => t.qty === 1)
  return one ? one.total : Math.min(...tiers.map((t) => t.total / t.qty))
}

export function savings(tiers: Tier[], n: number): number {
  return Math.max(0, unitPrice(tiers) * n - bestTotal(tiers, n))
}
