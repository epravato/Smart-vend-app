#!/bin/bash
# Deploy VendSmart to GitHub Pages
set -e

echo "Building..."
npx expo export --platform web --output-dir docs

echo "Fixing asset paths for GitHub Pages..."
sed -i '' 's|href="/_expo/|href="/Smart-vend-app/_expo/|g' docs/index.html
sed -i '' 's|src="/_expo/|src="/Smart-vend-app/_expo/|g' docs/index.html
sed -i '' 's|href="/favicon|href="/Smart-vend-app/favicon|g' docs/index.html

BUNDLE=$(ls docs/_expo/static/js/web/*.js)
sed -i '' 's|"/assets/node_modules/|"/Smart-vend-app/assets/node_modules/|g' "$BUNDLE"

echo "Adding .nojekyll..."
touch docs/.nojekyll

echo "Committing and pushing..."
git add -A
git commit -m "Deploy to GitHub Pages"
git push

echo "Done! Live in ~1 minute at https://epravato.github.io/Smart-vend-app/"
