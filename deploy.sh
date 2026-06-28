#!/bin/bash
# Deploy VendSmart to GitHub Pages
set -e

echo "Building..."
npx expo export --platform web --output-dir docs

BUNDLE=$(ls docs/_expo/static/js/web/*.js)

echo "Fixing index.html paths..."
sed -i '' 's|href="/_expo/|href="/Smart-vend-app/_expo/|g' docs/index.html
sed -i '' 's|src="/_expo/|src="/Smart-vend-app/_expo/|g' docs/index.html
sed -i '' 's|href="/favicon|href="/Smart-vend-app/favicon|g' docs/index.html

echo "Copying fonts to docs/fonts/..."
mkdir -p docs/fonts
cp docs/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/*.ttf docs/fonts/

echo "Patching bundle to use docs/fonts/..."
# Replace long hashed font paths with simple /Smart-vend-app/fonts/FontName.ttf
for f in docs/fonts/*.ttf; do
  filename=$(basename "$f")
  # Strip the hash from the filename to get the base name (e.g. Ionicons.ttf)
  basename_no_hash=$(echo "$filename" | sed 's/\.[a-f0-9]\{32\}\.ttf$/.ttf/')
  # Replace the long path in the bundle with the short fonts/ path
  sed -i '' "s|\"[^\"]*/${filename}\"|\"\/Smart-vend-app\/fonts\/${basename_no_hash}\"|g" "$BUNDLE"
  # Also rename the font file to remove the hash
  mv "docs/fonts/$filename" "docs/fonts/$basename_no_hash"
done

echo "Adding .nojekyll..."
touch docs/.nojekyll

echo "Committing and pushing..."
git add -A
git commit -m "Deploy to GitHub Pages"
git push

echo "Done! Live in ~1 minute at https://epravato.github.io/Smart-vend-app/"
