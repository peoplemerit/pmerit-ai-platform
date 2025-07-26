#!/bin/bash
echo "🌐 Starting Gabriel AI Cloudflare Tunnel..."
echo "=========================================="

# Start tunnel in background
cloudflared tunnel run gabriel-ai-platform &

# Save PID for stopping later
echo $! > ~/.cloudflared/tunnel.pid

echo "✅ Tunnel started! Your Gabriel AI platform is now globally accessible:"
echo ""
echo "🎨 Main Dashboard:    https://gabriel-dashboard.peoplemerit.workers.dev"
echo "🐳 Portainer:         https://gabriel-portainer.peoplemerit.workers.dev"
echo "🌍 Core API:          https://gabriel-api.peoplemerit.workers.dev"
echo "👥 User Management:   https://gabriel-users.peoplemerit.workers.dev"
echo "📚 Course Management: https://gabriel-courses.peoplemerit.workers.dev"
echo "🤖 Virtual Human:     https://gabriel-virtual.peoplemerit.workers.dev"
echo "📊 Assessment:        https://gabriel-assess.peoplemerit.workers.dev"
echo "📷 OCR Processing:    https://gabriel-ocr.peoplemerit.workers.dev"
echo "🧠 AI Tutoring:       https://gabriel-tutor.peoplemerit.workers.dev"
echo "💼 Career Services:   https://gabriel-career.peoplemerit.workers.dev"
echo "💳 Payments:          https://gabriel-payments.peoplemerit.workers.dev"
echo "💬 Communication:     https://gabriel-comms.peoplemerit.workers.dev"
echo "📈 Analytics:         https://gabriel-analytics.peoplemerit.workers.dev"
echo "📊 Container Stats:   https://gabriel-stats.peoplemerit.workers.dev"
echo "📈 Grafana:           https://gabriel-grafana.peoplemerit.workers.dev"
echo "🔧 Container Manager: https://gabriel-manager.peoplemerit.workers.dev"
echo ""
echo "🔐 All connections secured via Cloudflare SSL"
echo "🌍 Accessible from any device, anywhere in the world"
