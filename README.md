# Rumbo — Agenda Renacer 2027 (E·Sencia)

Landing de un solo producto, publicada en GitHub Pages:
`https://jcequispe.github.io/rumbo/conversion/` (`/rumbo/` redirige ahí).

## Cómo está armado

- `apps/conversion/` — el código de la landing (React + Vite).
- `public/conversion/` — esa misma landing **ya compilada**; es lo que se publica.
- Raíz del repo — solo una página que redirige a la landing y un `404.html` que hace lo mismo
  (así los enlaces viejos no quedan rotos). Su `vite.config.ts` incluye un service worker que se
  desinstala solo, para limpiar el de una versión anterior.

El contenido (textos, precios, WhatsApp, fotos) no está en este repo: se descarga al abrir la
página desde `agenda-aurea-content` (`sites/conversion/content.yml`). Cambiar un texto o una foto
no requiere recompilar nada aquí.

## Cambiar el código de la landing

```bash
./scripts/build-variants.sh   # recompila apps/conversion → public/conversion
git add apps public && git commit
```

Se trabaja en `develop` y se mergea a `master`; el push a `master` publica (`.github/workflows/ci-cd.yml`).

## Historial

Antes este repo tenía otras landings (`imperfecta`, `agenda-aurea` y la app raíz "Rumbo").
Se retiraron; siguen en el historial. Para recuperarlas: `git checkout pre-limpieza-landings`.
