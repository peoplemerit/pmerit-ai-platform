#!/bin/bash
# Gabriel AI Service Platform - Lean Development Workflow
export COMPOSE_PROJECT_NAME="gabriel-lean"

echo "🚀 Gabriel AI Service Platform Development (Lean)"
echo "================================================="

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
echo "  ./container-manager.sh status                           # Check status"
echo "  ./container-manager.sh logs                             # View logs"
echo "  ./container-manager.sh restart                          # Restart services"
echo "  git add . && git commit -m 'feat: description' && git push  # Deploy changes"

echo ""
echo "🎯 Ready for lean Gabriel AI development!"
