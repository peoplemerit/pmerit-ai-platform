#!/bin/bash
# =================================================================
# Gabriel AI Platform - Cloudflare Tunnel Setup
# Enable secure global access to your containerized platform
# =================================================================

echo "🌐 Gabriel AI Platform - Cloudflare Tunnel Setup"
echo "==============================================="

# =================================================================
# Step 1: Install Cloudflare Tunnel (cloudflared)
# =================================================================
echo ""
echo "📥 Installing Cloudflare Tunnel (cloudflared)..."

# Download and install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb

echo "✅ Cloudflared installed successfully"

# =================================================================
# Step 2: Create Cloudflare Tunnel Configuration
# =================================================================
echo ""
echo "🔧 Creating Cloudflare Tunnel configuration..."

# Create tunnel configuration directory
mkdir -p ~/.cloudflared

# Create tunnel configuration file
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: gabriel-ai-platform
credentials-file: ~/.cloudflared/gabriel-ai-platform.json

ingress:
  # Gabriel AI Main Dashboard
  - hostname: gabriel-dashboard.peoplemerit.workers.dev
    service: http://localhost:9904
    
  # Portainer Docker Management
  - hostname: gabriel-portainer.peoplemerit.workers.dev
    service: http://localhost:9900
    
  # Gabriel AI Core API
  - hostname: gabriel-api.peoplemerit.workers.dev
    service: http://localhost:9000
    
  # Gabriel AI Services
  - hostname: gabriel-users.peoplemerit.workers.dev
    service: http://localhost:9001
    
  - hostname: gabriel-courses.peoplemerit.workers.dev
    service: http://localhost:9002
    
  - hostname: gabriel-virtual.peoplemerit.workers.dev
    service: http://localhost:9003
    
  - hostname: gabriel-assess.peoplemerit.workers.dev
    service: http://localhost:9004
    
  - hostname: gabriel-ocr.peoplemerit.workers.dev
    service: http://localhost:9005
    
  - hostname: gabriel-tutor.peoplemerit.workers.dev
    service: http://localhost:9006
    
  - hostname: gabriel-career.peoplemerit.workers.dev
    service: http://localhost:9007
    
  - hostname: gabriel-payments.peoplemerit.workers.dev
    service: http://localhost:9008
    
  - hostname: gabriel-comms.peoplemerit.workers.dev
    service: http://localhost:9009
    
  - hostname: gabriel-analytics.peoplemerit.workers.dev
    service: http://localhost:9010
    
  # Container Stats Dashboard
  - hostname: gabriel-stats.peoplemerit.workers.dev
    service: http://localhost:9901
    
  # Grafana Analytics
  - hostname: gabriel-grafana.peoplemerit.workers.dev
    service: http://localhost:9902
    
  # Container Manager
  - hostname: gabriel-manager.peoplemerit.workers.dev
    service: http://localhost:9903
    
  # Catch-all rule (must be last)
  - service: http_status:404
EOF

echo "✅ Tunnel configuration created"

# =================================================================
# Step 3: Setup Instructions
# =================================================================
echo ""
echo "🚀 CLOUDFLARE TUNNEL SETUP INSTRUCTIONS"
echo "======================================="
echo ""
echo "📋 Manual Setup Steps (One-time only):"
echo ""
echo "1️⃣ Login to Cloudflare:"
echo "   cloudflared tunnel login"
echo "   (This will open browser - login to your Cloudflare account)"
echo ""
echo "2️⃣ Create the tunnel:"
echo "   cloudflared tunnel create gabriel-ai-platform"
echo ""
echo "3️⃣ Configure DNS (will be automated):"
echo "   cloudflared tunnel route dns gabriel-ai-platform gabriel-dashboard.peoplemerit.workers.dev"
echo "   cloudflared tunnel route dns gabriel-ai-platform gabriel-portainer.peoplemerit.workers.dev"
echo "   cloudflared tunnel route dns gabriel-ai-platform gabriel-api.peoplemerit.workers.dev"
echo ""
echo "4️⃣ Start the tunnel:"
echo "   cloudflared tunnel run gabriel-ai-platform"
echo ""

# =================================================================
# Step 4: Create Automation Scripts
# =================================================================
echo ""
echo "🔧 Creating automation scripts..."

# Start tunnel script
cat > start-cloudflare-tunnel.sh << 'EOF'
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
EOF

chmod +x start-cloudflare-tunnel.sh

# Stop tunnel script
cat > stop-cloudflare-tunnel.sh << 'EOF'
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
EOF

chmod +x stop-cloudflare-tunnel.sh

# Create systemd service for auto-start
cat > gabriel-tunnel.service << 'EOF'
[Unit]
Description=Gabriel AI Platform Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=gabriel-ai
WorkingDirectory=/home/gabriel-ai/gabriel-ai-platform-docker
ExecStart=/usr/local/bin/cloudflared tunnel run gabriel-ai-platform
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Automation scripts created"

# =================================================================
# Step 5: Quick Setup Commands
# =================================================================
echo ""
echo "⚡ QUICK SETUP COMMANDS"
echo "======================"
echo ""
echo "Run these commands in order:"
echo ""
echo "# 1. Login to Cloudflare"
echo "cloudflared tunnel login"
echo ""
echo "# 2. Create tunnel"
echo "cloudflared tunnel create gabriel-ai-platform"
echo ""
echo "# 3. Setup DNS routes"
echo "cloudflared tunnel route dns gabriel-ai-platform gabriel-dashboard.peoplemerit.workers.dev"
echo "cloudflared tunnel route dns gabriel-ai-platform gabriel-portainer.peoplemerit.workers.dev"
echo "cloudflared tunnel route dns gabriel-ai-platform gabriel-api.peoplemerit.workers.dev"
echo ""
echo "# 4. Start tunnel"
echo "./start-cloudflare-tunnel.sh"
echo ""
echo "# 5. (Optional) Enable auto-start on boot"
echo "sudo cp gabriel-tunnel.service /etc/systemd/system/"
echo "sudo systemctl enable gabriel-tunnel"
echo "sudo systemctl start gabriel-tunnel"
echo ""

# =================================================================
# Alternative: Simple Single Service Tunnel
# =================================================================
echo ""
echo "🔄 ALTERNATIVE: Simple Single Service Setup"
echo "==========================================="
echo ""
echo "For quick testing, you can expose just the main dashboard:"
echo ""
echo "# Quick tunnel for dashboard only"
echo "cloudflared tunnel --url http://localhost:9904"
echo ""
echo "# Quick tunnel for Portainer only"
echo "cloudflared tunnel --url http://localhost:9900"
echo ""

echo ""
echo "🎉 CLOUDFLARE TUNNEL SETUP COMPLETE!"
echo "===================================="
echo ""
echo "🌍 After setup, your Gabriel AI platform will be accessible globally:"
echo "   📱 From any mobile device"
echo "   💻 From any computer"
echo "   🌐 From anywhere in the world"
echo "   🔒 Secured with Cloudflare SSL"
echo ""
echo "🚀 Perfect for managing your educational platform remotely!"
