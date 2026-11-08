# Plan de evolución — Landing «Conversión» (Agenda Áurea)

**Tesis:** una landing de producto ya no es un folleto con botón. Es una *experiencia de compra* que
(1) demuestra la promesa en vez de contarla, (2) reduce la parálisis de elección, (3) hace que el precio se sienta
justo y (4) se adapta a quien la mira. Todo con honestidad: nada de reseñas ni cifras inventadas.

## Auditoría (estado de partida)

| Hallazgo | Severidad | Fuente |
|---|---|---|
| Testimonios y cifra «[cifra pendiente]» se muestran como reales | 4 (confianza/legal) | Influence + CRO |
| La promesa («sin culpa por los días en blanco») solo se *dice*; nada la demuestra | 3 | CRO: prueba en el punto de fricción |
| 10 portadas sin guía → parálisis de elección | 3 | Nielsen 6 (reconocer, no recordar) / Hick |
| El precio es una tabla; no hay anclaje al uso diario ni empuje honesto al siguiente tramo | 3 | Pricing psychology |
| Orientación en el scroll: sin indicador de progreso | 2 | Krug: Trunk test |
| La página no reacciona a la elección del usuario (portada) | 2 | Personalización / endowment |
| Objeciones (envío, cambio, pago) lejos del botón de agregar | 3 | O/CO: contra-objeción en la fricción |
| Sticky móvil no recuerda qué elegiste | 1 | Visibilidad del estado |

## Pilares y acciones

1. **Prueba honesta de confianza.** Los testimonios solo se muestran con `proof.verified: true` en el YAML.
   Mientras no haya reseñas reales, la sección y la cifra se ocultan. (Cumple el límite ético de las skills.)
2. **«Pruébala antes de comprarla».** Mini‑agenda interactiva: una semana tipo y 3 hábitos de ejemplo. Tocas
   un día: hecho → descanso → vacío. La semana *siempre* suma en positivo; un día en blanco no es rojo. La
   promesa del hero se vive en 10 segundos. (Demostración > afirmación.)
3. **«Encuentra tu portada».** Test de 3 preguntas con etiquetas de estilo por portada → recomienda una y
   una segunda opción, y la deja elegida. Reduce 10 opciones a 1 (Hick) sin quitar libertad.
4. **La página se tiñe con tu portada.** Variable `--ed` global: barra de progreso, escenario del configurador,
   puntos y brillo del cierre toman el color elegido. Un solo color de acción (coral) para CTAs.
5. **Configurador con presencia.** Inclinación suave de la portada con el puntero (solo punteros finos y sin
   *reduced motion*), flechas del teclado en los colores, resumen de lo elegido.
6. **Precio como microeconomía honesta.** «Menos de S/ 0.24 al día durante 2027» (cálculo real sobre 365 días)
   y barra hacia el siguiente tramo: «Agrega 1 más y cada una baja a S/ 90». Se ve en el configurador y el carrito.
7. **Contra-objeciones junto al botón.** Tres garantías cortas (cambio, pago, envío) bajo «Agregar al carrito».
8. **Orientación y ritmo.** Barra de progreso de lectura en la nav; titular del hero con entrada palabra a palabra;
   selector rápido de color en el hero (entrada directa al configurador).
9. **Móvil primero.** Sticky bar con el color elegido, objetivos táctiles ≥ 44 px, sin scroll horizontal.
10. **Calidad invisible.** `prefers-reduced-motion` respetado, foco visible, `aria-live` en resultados,
    contraste AA, cero dependencias nuevas, contenido 100 % en YAML.

## Qué NO hacemos (decisión consciente)

- Urgencia falsa, stock inventado, contadores que se reinician.
- 3D/WebGL: la agenda es un objeto cálido y táctil; el peso y la complejidad restarían a la conversión.
- Más CTAs de colores: una sola acción dominante.

## Métricas a vigilar al publicar (cuando haya tráfico)

Clics en «Elegir mi portada» · uso del test y de la demo · adiciones al carrito por sesión · pedidos por WhatsApp
iniciados · % que llega a Precios. Probar primero (ICE alto): demo en hero vs. después del problema; test de portada
visible vs. oculto.
