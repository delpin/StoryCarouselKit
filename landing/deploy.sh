#!/bin/bash

# Script to deploy landing page to GitHub Pages
# Usage: ./deploy.sh [repository-url]

set -e

REPO_URL=${1:-"https://github.com/your-username/your-landing-repo.git"}

echo "🚀 Deploying StoryKit landing page to GitHub Pages..."
echo "Repository: $REPO_URL"

# Build the landing page
echo "📦 Building landing page..."
npm run build

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found. Build failed."
    exit 1
fi

# Create temporary directory for deployment
TEMP_DIR=$(mktemp -d)
echo "📁 Using temporary directory: $TEMP_DIR"

# Copy dist contents to temp directory
cp -r dist/* "$TEMP_DIR/"

# Initialize git repo in temp directory
cd "$TEMP_DIR"
git init
git add .
git commit -m "Deploy StoryKit landing page $(date)"

# Force push to gh-pages branch (or main for user/org pages)
echo "⬆️ Pushing to GitHub Pages..."
if [[ $REPO_URL == *".github.io.git" ]]; then
    # For user/org pages, deploy to main branch
    git push -f "$REPO_URL" main
    echo "✅ Deployed to main branch (user/org pages)"
else
    # For project pages, deploy to gh-pages branch
    git push -f "$REPO_URL" main:gh-pages
    echo "✅ Deployed to gh-pages branch"
fi

# Cleanup
cd -
rm -rf "$TEMP_DIR"

echo ""
echo "🎉 Landing page deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your repository settings"
echo "2. Navigate to Pages section"
echo "3. Set source to:"
if [[ $REPO_URL == *".github.io.git" ]]; then
    echo "   - Branch: main"
else
    echo "   - Branch: gh-pages"
fi
echo "4. Your landing page will be available at:"
if [[ $REPO_URL == *".github.io.git" ]]; then
    echo "   https://your-username.github.io"
else
    echo "   https://your-username.github.io/repository-name"
fi