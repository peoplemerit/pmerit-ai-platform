#!/bin/bash
# Gabriel AI Container Manager - Lean Structure
export COMPOSE_PROJECT_NAME="gabriel-lean"

case "$1" in
    start)
        echo "🚀 Starting Gabriel AI Platform (Lean)..."
        docker-compose up -d
        echo ""
        echo "📊 Container Status:"
        docker-compose ps
        ;;
    stop)
        echo "🛑 Stopping Gabriel AI Platform..."
        docker-compose down
        ;;
    restart)
        echo "🔄 Restarting Gabriel AI Platform..."
        docker-compose down
        docker-compose up -d
        ;;
    status)
        echo "📊 Gabriel AI Platform Status:"
        docker-compose ps
        echo ""
        echo "🌍 Platform URLs:"
        echo "  Local: http://localhost:8001"
        echo "  Live Service: https://pmerit-ai-platform.pages.dev"
        echo "  Live Portal: https://pmerit-ai-platform-portal.pages.dev"
        ;;
    logs)
        echo "📜 Gabriel AI Platform Logs:"
        docker-compose logs -f
        ;;
    build)
        echo "🔨 Building Gabriel AI Platform..."
        docker-compose build --no-cache
        docker-compose up -d
        ;;
    clean)
        echo "🧹 Cleaning Gabriel AI Platform..."
        docker-compose down -v
        docker system prune -f
        ;;
    *)
        echo "🚀 Gabriel AI Container Manager (Lean Structure)"
        echo "================================================"
        echo ""
        echo "Usage: $0 {start|stop|restart|status|logs|build|clean}"
        echo ""
        echo "Commands:"
        echo "  start   - Start all containers"
        echo "  stop    - Stop all containers"
        echo "  restart - Restart all containers"
        echo "  status  - Show container status and URLs"
        echo "  logs    - Show container logs"
        echo "  build   - Rebuild and restart containers"
        echo "  clean   - Clean stop and remove volumes"
        echo ""
        echo "🌍 Quick Status Check:"
        docker-compose ps 2>/dev/null || echo "  Containers not running"
        ;;
esac
