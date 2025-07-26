#!/bin/bash
echo "🛑 Stopping Gabriel AI Cloudflare Tunnel..."

if [ -f ~/.cloudflared/tunnel.pid ]; then
    PID=$(cat ~/.cloudflared/tunnel.pid)
    kill $PID
    rm ~/.cloudflared/tunnel.pid
    echo "✅ Tunnel stopped"
else
    echo "⚠️ No tunnel PID file found"
    pkill cloudflared
    echo "✅ Killed any running cloudflared processes"
fi
