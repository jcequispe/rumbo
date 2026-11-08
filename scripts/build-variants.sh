#!/usr/bin/env bash
# Reconstruye las variantes React de apps/ y las copia a public/<slug>/ para que
# Vite las publique tal cual bajo /rumbo/<slug>/. Correr antes de commitear cambios en apps/.
set -euo pipefail
cd "$(dirname "$0")/.."

for app in imperfecta conversion; do
  (cd "apps/$app" && npm ci --silent && npx tsc -b && npx vite build --base="/rumbo/$app/")
  rm -rf "public/$app"
  cp -r "apps/$app/dist" "public/$app"
done
