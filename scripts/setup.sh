#!/usr/bin/env bash
set -euo pipefail

# Get the project name from the directory name or first argument
PROJECT_NAME="${1:-$(basename "$(pwd)")}"

echo "Setting up project: $PROJECT_NAME"

# Update package.json name
sed -i "s/\"name\": \"react-supabase-template\"/\"name\": \"$PROJECT_NAME\"/" package.json

# Update supabase project_id
sed -i "s/project_id = \"react-supabase-template\"/project_id = \"$PROJECT_NAME\"/" supabase/config.toml

# Update README title
sed -i "1s/.*/# ${PROJECT_NAME}/" README.md

# Remove this setup script
rm -f scripts/setup.sh
rmdir scripts 2>/dev/null || true

echo "Done! Project renamed to: $PROJECT_NAME"
echo ""
echo "Next steps:"
echo "  1. pnpm install"
echo "  2. pnpm db:start"
echo "  3. pnpm db:gen-types"
echo "  4. pnpm dev"
