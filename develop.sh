#!/bin/bash
# Gabriel AI Service Platform - Development Workflow
echo "🚀 Gabriel AI Service Platform Development"
echo "========================================="

# Start Docker containers
echo "Starting containers..."
docker-compose up -d

# Show status
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🌍 Platform URLs:"
echo "  Local Development: http://localhost:8001"
echo "  Live Service: https://pmerit-ai-platform.pages.dev"
echo "  Live Portal: https://pmerit-ai-platform-portal.pages.dev"

echo ""
echo "💻 Development Commands:"
echo "  git add . && git commit -m 'feat: description' && git push  # Deploy changes"
echo "  docker-compose logs -f [service]                           # View logs"
echo "  docker-compose restart [service]                           # Restart service"
