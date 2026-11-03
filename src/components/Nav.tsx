import Logo from './Logo'
import './nav.css'

export default function Nav() {
  return (
    <header className="site-nav">
      <a href="#top" className="site-nav-logo" aria-label="Rumbo — inicio">
        <Logo />
      </a>
      <nav className="site-nav-links" aria-label="Secciones">
        <a href="#edicion">La edición</a>
        <a href="#recorrido">Qué hay adentro</a>
        <a href="#testimonios">Testimonios</a>
      </nav>
      {/* lleva al carrito real en #edicion — nunca abre WhatsApp directo,
          así nadie se salta la elección de color/cantidad */}
      <a className="site-nav-cta" href="#edicion">
        Pedir
      </a>
    </header>
  )
}
