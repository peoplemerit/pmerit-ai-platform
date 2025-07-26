# 🌍 Gabriel AI Educational Platform - Integrated Architecture

**Breaking poverty cycles through accessible, career-aligned education**

## 🎯 Platform Overview

Gabriel AI is a Docker-containerized, globally accessible educational platform designed to serve underserved communities worldwide, starting with Nigeria and expanding across Africa, South Asia, and Latin America.

### 🚀 Quick Access

- **🎨 Main Platform**: https://pmerit-ai-platform.pages.dev
- **🔧 Admin Portal**: https://pmerit-ai-platform-portal.pages.dev
- **📊 Dashboard**: https://gabriel-dashboard.peoplemerit.workers.dev
- **🐳 Container Management**: https://gabriel-portainer.peoplemerit.workers.dev

## 🐳 Container Architecture (Ports 9000-9010)

| Service | Port | Purpose | Global URL |
|---------|------|---------|------------|
| **Gabriel Core** | 9000 | API Gateway & Cultural Intelligence Router | gabriel-api.peoplemerit.workers.dev |
| **User Management** | 9001 | Authentication & Nigerian University Integration | gabriel-users.peoplemerit.workers.dev |
| **Course Management** | 9002 | Dual-Mode Curriculum (Remote/Local Career) | gabriel-courses.peoplemerit.workers.dev |
| **Virtual Human** | 9003 | 3D Avatar & Nigerian Accent TTS | gabriel-virtual.peoplemerit.workers.dev |
| **Assessment Engine** | 9004 | Portfolio Validation & Employer Readiness | gabriel-assess.peoplemerit.workers.dev |
| **OCR Processing** | 9005 | Mobile Camera Optimization | gabriel-ocr.peoplemerit.workers.dev |
| **AI Tutoring** | 9006 | Cultural Context Educational AI | gabriel-tutor.peoplemerit.workers.dev |
| **Career Assessment** | 9007 | Global Remote + Local Opportunity Matching | gabriel-career.peoplemerit.workers.dev |
| **Payment Processing** | 9008 | Nigerian Mobile Money & Global Cards | gabriel-payments.peoplemerit.workers.dev |
| **Communication** | 9009 | Multi-Language Chat & Cultural Styles | gabriel-comms.peoplemerit.workers.dev |
| **Analytics** | 9010 | Employment Outcome & Impact Tracking | gabriel-analytics.peoplemerit.workers.dev |

## 🌐 Dual-Mode Platform

### 🌍 Remote Career Mode
- Global skills development (Software dev, Digital marketing, VA services)
- International job placement assistance  
- Cross-cultural competency training
- Remote work readiness certification

### 🏘️ Local Career Mode
- Regional skills development (Agriculture, Local business, Community development)
- Cultural preservation integration
- Local economic opportunity matching
- Community-centered project development

## 💻 Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Git

### Quick Start
```bash
# Clone repository
git clone https://github.com/peoplemerit/pmerit-ai-platform.git
cd pmerit-ai-platform

# Start all containers
docker-compose up -d

# Monitor container health
./scripts/monitor-containers.sh

# Access dashboard
open https://gabriel-dashboard.peoplemerit.workers.dev
```

### Local Development
```bash
# Development mode with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View container logs
docker-compose logs -f gabriel-core

# Check container resource usage
docker stats
```

## 🌍 Global Deployment Strategy

### Development Environment
- **HP Laptop**: Full 10-container development and production hosting
- **Resource Monitoring**: Automated migration triggers when >1000 users or >85% CPU/80% memory

### Production Scaling
- **Dell PowerEdge R740**: Enterprise container orchestration for 10,000+ students
- **Cloudflare Global**: Edge deployment with Nigerian mobile network optimization

## 🎓 Mission Impact

### Target Communities
- Nigerian students and underserved youth
- Rural communities across Africa
- South Asian educational initiatives  
- Latin American development programs

### Success Metrics
- Employment placement rates
- Income improvement tracking
- Cultural preservation integration
- Mobile accessibility (3G networks, budget Android devices)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Test with container environment: `docker-compose up -d`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open Pull Request

## 📱 Mobile-First Design

- Optimized for budget Android devices
- <3 second load times on 3G networks
- Offline-capable progressive web app
- Cultural UI adaptations for Nigerian context

## 🔐 Security & Privacy

- Container isolation for security
- Cultural data privacy compliance
- Secure payment processing (Nigerian mobile money)
- GDPR compliance for global operations

## 📞 Support & Community

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/peoplemerit/pmerit-ai-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/peoplemerit/pmerit-ai-platform/discussions)

---

Built with ❤️ for Nigerian students and global communities 🇳🇬🌍

**Gabriel AI Educational Platform**: Where technology meets cultural intelligence to break poverty cycles through accessible education.
# Gabriel AI Platform - Enhanced Integration
