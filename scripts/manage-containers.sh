#!/bin/bash

case "$1" in
    "start")
        echo "🚀 Starting Gabriel AI Platform..."
        docker-compose up -d
        ;;
    "stop")
        echo "🛑 Stopping Gabriel AI Platform..."
        docker-compose down
        ;;
    "restart")
        echo "🔄 Restarting Gabriel AI Platform..."
        docker-compose down && docker-compose up -d
        ;;
    "status")
        echo "📊 Gabriel AI Platform Status:"
        docker-compose ps
        echo ""
        echo "📈 Resource Usage:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
        ;;
    "logs")
        if [ -n "$2" ]; then
            docker-compose logs -f $2
        else
            docker-compose logs -f
        fi
        ;;
    "build")
        echo "🏗️ Rebuilding containers..."
        docker-compose build --no-cache
        ;;
    *)
        echo "Gabriel AI Container Management"
        echo "Usage: $0 {start|stop|restart|status|logs [service]|build}"
        ;;
esac
