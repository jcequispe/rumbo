/**
 * Capa de atmósfera compartida: una sola, fija detrás de todo el contenido
 * (nunca una por sección — ver PLAN-3D.md). Luz dorada muy tenue que respira
 * lentamente; nada oscuro, nada que compita con el texto.
 */
export default function Atmosphere() {
  return <div className="atmosphere" aria-hidden="true" />
}
