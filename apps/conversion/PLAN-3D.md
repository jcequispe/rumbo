# Plan — Web de compra "jamás vista" para E·Sencia / Agenda Renacer 2027

Base: el [análisis psicológico de marca](#perfil-%E2%86%92-decisiones) de esta conversación, más la
mecánica cinematográfica de `cinematic-scroll-landing` / `3d-website-architect`, **reskineada por
completo**: esas guías están pensadas para marcas frías/tech (fondos oscuros, niebla, grano de
película). Esta marca es cálida y maternal (Cuidadora/Sabia). Tomamos la **mecánica** (scroll
choreography, capa de atmósfera compartida, una sola gramática de transición, presupuesto de
rendimiento) y la vestimos en dorado/crema/salvia/rosa, nunca en negro ni neón.

## Decisión de fondo: NO copiar "3D genérico de Awwwards"

Un héroe con una esfera 3D rotando es exactamente lo que hace *todo el mundo* ahora — ya no
sorprende, y además contradice el perfil (Cuidadora no compite por espectáculo). Lo "jamás visto"
no va a salir de más polígonos; va a salir de que **cada pieza de movimiento esté anclada a un
objeto real de sus propias fotos** (la pluma dorada, el anillado, las páginas) en vez de ser
decoración genérica. Esa es la apuesta central del plan.

## Perfil → decisiones

| Hallazgo del perfil | Decisión de UI/UX |
|---|---|
| Cuidadora, nunca confronta | Cero countdown agresivo, cero "quedan 3 unidades" — ya lo decidimos antes, se mantiene |
| Paleta sin color de alta energía | El "plus" cinematográfico usa luz cálida y dorado, nunca neón ni azules fríos |
| Lenguaje de coaching/terapia (Estado A→B) | Esa pieza real de su material se vuelve la animación central de Beneficios, no un adorno inventado |
| Script a mano + pluma dorada en sus fotos | Microinteracción insignia: el titular del hero se "escribe" con trazo dorado, como si la pluma de sus propias fotos lo escribiera |
| Fotografía aspiracional, no funcional | El recorrido "por dentro" se siente como hojear el libro real, no como un visor de producto de e-commerce |
| Sin urgencia falsa | El "plus" nunca sacrifica claridad del precio/CTA por espectáculo — un único "money shot" por sección, nunca 5 animaciones compitiendo |

## El "plus": 4 piezas, cada una con un porqué

1. **Titular "escrito a pluma" (hero).** El h1 se dibuja con un trazo SVG dorado (stroke-dasharray)
   en vez de un fundido genérico — 1.2s, una sola vez, respeta `prefers-reduced-motion` (aparece
   completo sin animar). Reutiliza el gold real de la marca (`#9c7129`). Costo: bajo, cero 3D,
   altísimo valor distintivo porque nadie en esta categoría lo hace.
2. **"Por dentro" como hojeada real, no galería.** En vez de 3 fotos sueltas, una secuencia
   scroll-scrubbed (como ya probamos en `folio-3d-demo`): si el cliente nos manda un video corto
   del objeto físico abriéndose/pasando páginas con la luz pegándole al dorado, lo convertimos en
   fotogramas y el scroll controla `video.currentTime` — cero WebGL, carga como una imagen, se
   siente 3D. Si no hay video aún, alternativa B: 3 fotos reales ya migradas con un crossfade +
   parallax de profundidad (mismo efecto, menor "wow", cero dependencia nueva).
3. **"Estado A → Estado B" como transformación en vivo.** Es contenido real suyo (la lista con ✕ y
   ✓). Al hacer scroll por Beneficios, cada fila pasa de ✕ a ✓ con un trazo dorado que "tacha y
   corrige" — no inventamos la idea, la animamos.
4. **Capa de atmósfera compartida.** Un solo `position: fixed` detrás de todo (igual que indica
   `cinematic-scroll-landing`): no niebla oscura — luz dorada muy tenue que respira lentamente,
   montada una vez en el layout, nunca por sección.

## Lo que decidimos NO hacer (y por qué)

- **Scroll infinito.** Es una página de *compra*: tiene que terminar en el CTA. `cinematic-scroll-landing`
  lo marca explícito como prohibido en páginas de conversión.
- **Three.js/WebGL en el hero** salvo que el cliente confirme un modelo 3D real del producto — un
  cover genérico en 3D se ve plástico; su producto es papel con relieve y foil, eso se demuestra
  mejor con video real que con un render.
- **Más de un "momento cinematográfico" por scroll.** Un solo efecto grande por sección; el resto
  son microinteracciones de 150–300ms (hover, tap, foco).

## Pregunta que bloquea la Pieza 2 (la más fuerte del plan)

¿El cliente puede grabar ~10–15s de la agenda física abriéndose / pasando páginas, con luz que le
pegue al dorado? Con eso, la Pieza 2 sale muy por encima de cualquier producto 3D genérico y sin
instalar Three.js. Sin eso, seguimos con la Alternativa B (fotos + parallax) hasta que exista.

## Presupuesto técnico

- **Librerías nuevas:** `lenis` (scroll suave, ~6 KB). GSAP y `ScrollTrigger` ya están instalados.
  Nada de Three.js por ahora (se evalúa solo si llega video real o si se decide un modelo 3D).
- **Rendimiento:** LCP ≤ 2.5s — el hero muestra texto y la portada real (ya optimizada) de
  inmediato; las animaciones son una mejora que llega después, nunca bloquean el primer pintado.
- **`prefers-reduced-motion`:** todo el plan tiene su versión estática — nunca se oculta contenido,
  solo se quita el movimiento.
- **Móvil:** el trazo del titular y las transiciones funcionan igual; el "hojeado" por video pesa
  poco (es un `<video>`, no un motor 3D) así que no penaliza batería/CPU en gama media.
- **Largo de scroll:** el recorrido completo de la página sube de ~9 a ~11 "pantallas" por la
  secuencia de Beneficios animada — reportado aquí para que quede documentado, dentro del límite
  razonable para una página de una sola compra.

## Fases de entrega

1. **Fase 1 (hoy):** Lenis + GSAP ScrollTrigger como motor de scroll del sitio; titular del hero
   "escrito a pluma"; capa de atmósfera dorada compartida. Sin dependencias nuevas de peso, sin
   assets nuevos.
2. **Fase 2:** "Estado A → Estado B" animado en Beneficios, usando ya las imágenes reales migradas.
3. **Fase 3 (depende de la pregunta de arriba):** secuencia "por dentro" — video real scroll-scrubbed,
   o alternativa de fotos + parallax si no hay video todavía.
4. **Verificación:** capturas en escritorio y móvil, consola sin errores, `prefers-reduced-motion`
   probado, Lighthouse rápido de LCP.

Empezamos por la Fase 1 ahora mismo.
