#!/usr/bin/env bash
# Télécharge les images d'origine de cybersecurite.cd dans le dossier images/
set -euo pipefail
cd "$(dirname "$0")/../images"
base="https://cybersecurite.cd/wp-content/uploads"
for f in \
  2023/07/logo-ACFichier-10@150x-8.png \
  2023/07/cropped-logo-ACFichier-10@150x-8-270x270.png \
  2023/08/femme-tenue-cadenas-ordinateur-portable-removebg-preview.png \
  2023/09/about-home-1024x682.jpg \
  2023/07/premium.png \
  2023/07/Kaspersky.png \
  2023/07/logo-shirudo.png \
  2023/07/copemeco-1024x989.jpg
do
  echo "-> $(basename "$f")"
  curl -fsSL -o "$(basename "$f")" "$base/$f"
done
