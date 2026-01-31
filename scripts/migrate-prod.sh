#!/usr/bin/env bash
set -e

echo "⚠️  You are about to run SQL against:"
echo "$DATABASE_URL"

read -p "Type DEPLOY to continue: " confirm

if [ "$confirm" != "DEPLOY" ]; then
  echo "Aborted."
  exit 1
fi

for file in src/db/init/*.sql; do
  echo "Running $file"
  psql "$DATABASE_URL" -f "$file"
done
echo "✅ Migration complete."
