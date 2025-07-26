#!/bin/bash

echo "🖥️ Gabriel AI Platform - Dell Server Migration"
echo "=============================================="
echo ""
echo "🚚 Preparing container migration to Dell PowerEdge R740..."
echo ""

# Export container data
echo "📦 Exporting container data..."
mkdir -p migration-backup
docker-compose exec gabriel-db pg_dump -U gabriel_user gabriel_ai > migration-backup/database.sql
docker run --rm -v gabriel-ai-platform-docker_gabriel_db_data:/data -v $(pwd)/migration-backup:/backup alpine tar czf /backup/db-data.tar.gz -C /data .

# Create migration package
echo "📋 Creating migration package..."
tar czf migration-backup/gabriel-ai-containers.tar.gz \
    docker-compose.yml \
    containers/ \
    scripts/ \
    shared/ \
    data/

echo "✅ Migration package created: migration-backup/"
echo ""
echo "📋 Next steps for Dell server:"
echo "1. Copy migration-backup/ to Dell server"
echo "2. Run: tar xzf gabriel-ai-containers.tar.gz"
echo "3. Run: docker-compose up -d"
echo "4. Import database: psql -U gabriel_user -d gabriel_ai < database.sql"
echo ""
echo "🌐 Update DNS: Point domains to Dell server IP"
