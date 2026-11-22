#!/usr/bin/env bash
# Reconstruye la landing (apps/conversion) y la copia a public/conversion/ para que
# Vite la publique tal cual bajo /rumbo/conversion/. Correr antes de commitear cambios en apps/.
set -euo pipefail
cd "$(dirname "$0")/.."

(cd apps/conversion && npm ci --silent && npx tsc -b && npx vite build --base="/rumbo/conversion/")
rm -rf public/conversion
cp -r apps/conversion/dist public/conversion
