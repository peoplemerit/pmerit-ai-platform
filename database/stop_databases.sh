#!/bin/bash
# Stop Pmerit AI databases

echo "🛑 Stopping Pmerit AI Database Infrastructure..."

cd database
docker-compose -f docker-compose.db.yml down

echo "✅ Databases stopped"
