// Barra de revisión interna — NO es parte del diseño final de ninguna
// variante. Deja elegir entre las 4 propuestas de landing page desde
// cualquiera de ellas. Mismo componente (adaptado) en las 4 apps.
const VARIANTS = [
  { path: '/rumbo/', label: 'Rumbo — cinemático' },
  { path: '/rumbo/agenda-aurea/', label: 'Agenda Áurea — ledger' },
  { path: '/rumbo/imperfecta/', label: 'Imperfecta — dorado' },
  { path: '/rumbo/conversion/', label: 'Conversión — Imperfecta+' },
]

export default function VariantSwitcher() {
  const current = typeof window !== 'undefined' ? window.location.pathname : VARIANTS[0].path

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        height: 32,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: '#111',
        color: '#eee',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '12px',
      }}
    >
      <span style={{ opacity: 0.7 }}>Vista previa interna —</span>
      <select
        value={VARIANTS.find((v) => v.path === current)?.path ?? VARIANTS[0].path}
        onChange={(e) => {
          window.location.href = e.target.value
        }}
        style={{
          background: '#222',
          color: '#eee',
          border: '1px solid #444',
          borderRadius: 4,
          padding: '2px 6px',
          fontSize: '12px',
        }}
      >
        {VARIANTS.map((v) => (
          <option key={v.path} value={v.path}>
            {v.label}
          </option>
        ))}
      </select>
    </div>
  )
}
