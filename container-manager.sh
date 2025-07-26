#!/bin/bash
# Gabriel AI Container Manager - Simplified
case "$1" in
    start)
        echo "🚀 Starting Gabriel AI Platform..."
        docker-compose up -d
        ;;
    stop)
        echo "🛑 Stopping Gabriel AI Platform..."
        docker-compose down
        ;;
    status)
        echo "📊 Gabriel AI Platform Status:"
        docker-compose ps
        ;;
    logs)
        echo "📜 Gabriel AI Platform Logs:"
        docker-compose logs -f
        ;;
    *)
        echo "Usage: $0 {start|stop|status|logs}"
        echo ""
        echo "🚀 Gabriel AI Container Manager"
        echo "  start   - Start all containers"
        echo "  stop    - Stop all containers" 
        echo "  status  - Show container status"
        echo "  logs    - Show container logs"
        ;;
esac
