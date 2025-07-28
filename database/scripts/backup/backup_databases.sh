#!/bin/bash
# Backup Pmerit AI databases

BACKUP_DIR="./database/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🗄️ Backing up Pmerit AI databases..."

# Backup each database
docker exec pmerit-core-db pg_dump -U pmerit_admin pmerit_core > "$BACKUP_DIR/pmerit_core_backup.sql"
docker exec pmerit-ai-db pg_dump -U pmerit_admin pmerit_ai > "$BACKUP_DIR/pmerit_ai_backup.sql"

# Backup Redis
docker exec pmerit-redis redis-cli --rdb /data/dump.rdb
docker cp pmerit-redis:/data/dump.rdb "$BACKUP_DIR/redis_backup.rdb"

echo "✅ Backup completed: $BACKUP_DIR"
