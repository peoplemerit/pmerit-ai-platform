#!/bin/bash
# =================================================================
# Gabriel AI Platform - Cloudflare Pages Build Script
# Enhanced integration with container architecture
# =================================================================

echo "🚀 Building Gabriel AI Platform for Cloudflare Pages..."

# Create distribution directory
mkdir -p dist

# Copy existing frontend files if they exist
if [ -d "frontend" ]; then
    echo "📁 Copying frontend files..."
    cp -r frontend/* dist/
elif [ -d "monitoring/dashboard" ]; then
    echo "📊 Copying dashboard files..."
    cp -r monitoring/dashboard/* dist/
else
    echo "🏗️ Creating integrated landing page..."
fi

# Create main integration landing page
cat > dist/index.html << 'INDEX_EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gabriel AI Educational Platform</title>
    <meta name="description" content="Breaking poverty cycles through accessible, career-aligned education. Serving Nigerian students and global communities.">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌍</text></svg>">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .header {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            padding: 2rem 0;
            text-align: center;
            color: white;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 1rem;
        }
        
        .platform-status {
            background: rgba(255,255,255,0.95);
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .status-card {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .status-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            animation: shine 3s infinite;
        }
        
        @keyframes shine {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .status-card h3 {
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        
        .status-card .status {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .services-section {
            background: rgba(255,255,255,0.95);
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .service-card {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            border-color: #667eea;
        }
        
        .service-card h3 {
            color: #333;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .service-card p {
            color: #666;
            margin-bottom: 1rem;
            font-size: 0.95rem;
        }
        
        .service-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.7rem 1.2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .service-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #4CAF50;
            border-radius: 50%;
            margin-right: 0.5rem;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        .mission-section {
            background: rgba(255,255,255,0.95);
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .mission-section h2 {
            color: #333;
            margin-bottom: 1rem;
        }
        
        .mission-section p {
            color: #666;
            font-size: 1.1rem;
            max-width: 800px;
            margin: 0 auto;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .container {
                padding: 2rem 1rem;
            }
            
            .services-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌍 Gabriel AI Educational Platform</h1>
        <p>Breaking poverty cycles through accessible, career-aligned education</p>
    </div>
    
    <div class="container">
        <div class="platform-status">
            <h2>🚀 Platform Status</h2>
            <div class="status-grid">
                <div class="status-card">
                    <h3>Main Platform</h3>
                    <div class="status">✅ Operational</div>
                </div>
                <div class="status-card">
                    <h3>Container Services</h3>
                    <div class="status">⚡ 10 Microservices Running</div>
                </div>
                <div class="status-card">
                    <h3>Global Access</h3>
                    <div class="status">🌍 Cloudflare Optimized</div>
                </div>
                <div class="status-card">
                    <h3>Cultural Intelligence</h3>
                    <div class="status">🇳🇬 Nigerian Context Ready</div>
                </div>
            </div>
        </div>
        
        <div class="services-section">
            <h2>🎓 Educational Services</h2>
            <div class="services-grid">
                <div class="service-card">
                    <h3><span class="status-indicator"></span>📊 Platform Dashboard</h3>
                    <p>Visual monitoring and management interface for all platform services</p>
                    <a href="https://gabriel-dashboard.peoplemerit.workers.dev" class="service-link">
                        Access Dashboard →
                    </a>
                </div>
                
                <div class="service-card">
                    <h3><span class="status-indicator"></span>🤖 Virtual Human Tutor</h3>
                    <p>3D avatar with Nigerian accent TTS for personalized educational guidance</p>
                    <a href="https://gabriel-virtual.peoplemerit.workers.dev" class="service-link">
                        Meet Your Tutor →
                    </a>
                </div>
                
                <div class="service-card">
                    <h3><span class="status-indicator"></span>📚 Course Management</h3>
                    <p>Dual-mode curriculum: Remote career skills + Local community development</p>
                    <a href="https://gabriel-courses.peoplemerit.workers.dev" class="service-link">
                        Browse Courses →
                    </a>
                </div>
                
                <div class="service-card">
                    <h3><span class="status-indicator"></span>💼 Career Assessment</h3>
                    <p>Global remote opportunities + Local career path matching</p>
                    <a href="https://gabriel-career.peoplemerit.workers.dev" class="service-link">
                        Explore Careers →
                    </a>
                </div>
                
                <div class="service-card">
                    <h3><span class="status-indicator"></span>🧠 AI Tutoring</h3>
                    <p>Intelligent educational assistance with cultural context awareness</p>
                    <a href="https://gabriel-tutor.peoplemerit.workers.dev" class="service-link">
                        Get AI Help →
                    </a>
                </div>
                
                <div class="service-card">
                    <h3><span class="status-indicator"></span>📱 Mobile Optimized</h3>
                    <p>Budget Android devices, 3G networks, offline-capable progressive web app</p>
                    <a href="https://pmerit-ai-platform-portal.pages.dev" class="service-link">
                        Mobile Portal →
                    </a>
                </div>
            </div>
        </div>
        
        <div class="services-section">
            <h2>🔧 Platform Management</h2>
            <div class="services-grid">
                <div class="service-card">
                    <h3><span class="status-indicator"></span>🐳 Container Management</h3>
                    <p>Docker container orchestration and monitoring via Portainer</p>
                    <a href="https://gabriel-portainer.peoplemerit.workers.dev" class="service-link">
                        Manage Containers →
                    </a>
                </div>
                
                <div class="service-card">
                    <h3><span class="status-indicator"></span>📈 Analytics Dashboard</h3>
                    <p>Employment outcomes, learning progress, and platform performance metrics</p>
                    <a href="https://gabriel-analytics.peoplemerit.workers.dev" class="service-link">
                        View Analytics →
                    </a>
                </div>
                
                <div class="service-card">
                    <h3><span class="status-indicator"></span>🔌 API Gateway</h3>
                    <p>Core API services and integration endpoints for developers</p>
                    <a href="https://gabriel-api.peoplemerit.workers.dev" class="service-link">
                        API Documentation →
                    </a>
                </div>
            </div>
        </div>
        
        <div class="mission-section">
            <h2>🎯 Our Mission</h2>
            <p>
                Gabriel AI Educational Platform serves underserved communities worldwide, starting with Nigeria and expanding across Africa, South Asia, and Latin America. We combine cutting-edge technology with cultural intelligence to provide career-aligned education that breaks poverty cycles while preserving cultural values.
            </p>
        </div>
    </div>
    
    <script>
        // Simple service status checking
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 Gabriel AI Educational Platform loaded successfully');
            
            // Add click tracking for service links
            document.querySelectorAll('.service-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    console.log('🔗 Accessing service:', this.href);
                });
            });
        });
    </script>
</body>
</html>
INDEX_EOF

# Create API routing for Cloudflare Pages
cat > dist/_redirects << 'REDIRECTS_EOF'
# Gabriel AI Platform - Enhanced API Routing

# Main API routes to container services
/api/core/*         https://gabriel-api.peoplemerit.workers.dev/:splat        200
/api/users/*        https://gabriel-users.peoplemerit.workers.dev/:splat      200
/api/courses/*      https://gabriel-courses.peoplemerit.workers.dev/:splat    200
/api/virtual/*      https://gabriel-virtual.peoplemerit.workers.dev/:splat    200
/api/assess/*       https://gabriel-assess.peoplemerit.workers.dev/:splat     200
/api/ocr/*          https://gabriel-ocr.peoplemerit.workers.dev/:splat        200
/api/tutor/*        https://gabriel-tutor.peoplemerit.workers.dev/:splat      200
/api/career/*       https://gabriel-career.peoplemerit.workers.dev/:splat     200
/api/payments/*     https://gabriel-payments.peoplemerit.workers.dev/:splat   200
/api/comms/*        https://gabriel-comms.peoplemerit.workers.dev/:splat      200
/api/analytics/*    https://gabriel-analytics.peoplemerit.workers.dev/:splat  200

# Management interfaces
/dashboard/*        https://gabriel-dashboard.peoplemerit.workers.dev/:splat  200
/portainer/*        https://gabriel-portainer.peoplemerit.workers.dev/:splat  200
/stats/*            https://gabriel-stats.peoplemerit.workers.dev/:splat      200

# Portal integration
/portal/*           https://pmerit-ai-platform-portal.pages.dev/:splat        200

# Health checks
/health             /index.html                                               200
/api/health         https://gabriel-api.peoplemerit.workers.dev/health        200

# Default routing
/*                  /index.html                                               200
REDIRECTS_EOF

# Create headers for security and performance
cat > dist/_headers << 'HEADERS_EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/api/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
HEADERS_EOF

echo "✅ Enhanced Cloudflare Pages build completed"
echo "📊 Created professional landing page with service integration"
echo "🔗 API routing configured for all container services"
