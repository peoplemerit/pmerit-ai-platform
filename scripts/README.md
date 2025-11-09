# PMERIT Deployment Scripts

This directory contains automation scripts for deployment, monitoring, and verification of the PMERIT platform.

## Scripts Overview

### Pre-Deployment

#### `pre-deployment-check.sh`
**Purpose:** Automated pre-deployment verification  
**Usage:** `./scripts/pre-deployment-check.sh`

Checks:
- Git repository status (clean, on main, up to date)
- Code quality (no console.log, minimal TODOs)
- Security (no hardcoded secrets, HTTPS usage)
- Configuration files (wrangler.toml, CNAME, _headers)
- Required files present
- Asset optimization
- Documentation present

**Exit Codes:**
- `0` - All checks passed, ready for deployment
- `1` - Some checks failed, fix issues before deploying

---

### Post-Deployment

#### `production-smoke-test.sh`
**Purpose:** Quick verification of production deployment  
**Usage:** `./scripts/production-smoke-test.sh [base_url]`

**Examples:**
```bash
# Test production
./scripts/production-smoke-test.sh https://pmerit.com

# Test staging
./scripts/production-smoke-test.sh https://preview.pmerit-ai-platform.pages.dev
```

Tests:
- SSL certificate validity
- HTTPS redirect
- Core pages load correctly
- Assets are accessible
- API health endpoints respond
- API functionality works

**Exit Codes:**
- `0` - All tests passed
- `1` - Some tests failed

---

### Monitoring

#### `monitor-api.sh`
**Purpose:** Continuous API health monitoring  
**Usage:** `./scripts/monitor-api.sh [interval_seconds]`

**Examples:**
```bash
# Check every 15 minutes (default)
./scripts/monitor-api.sh

# Check every 5 minutes
./scripts/monitor-api.sh 300

# Check every hour
./scripts/monitor-api.sh 3600

# Run in background
nohup ./scripts/monitor-api.sh > /dev/null 2>&1 &

# Stop background monitoring
pkill -f monitor-api.sh
```

Monitors:
- API health endpoint (`/health`)
- Database health endpoint (`/api/v1/db/health`)
- Database status endpoint (`/api/v1/db/status`)
- AI chat endpoint (`/api/v1/ai/chat`)

**Logs:** Results are stored in `logs/api-monitoring.log`

**View Logs:**
```bash
# Real-time monitoring
tail -f logs/api-monitoring.log

# View last 100 lines
tail -n 100 logs/api-monitoring.log

# Search for failures
grep "Failed" logs/api-monitoring.log
```

---

## Quick Start Guide

### Before Deployment

1. **Run Pre-Deployment Check:**
   ```bash
   ./scripts/pre-deployment-check.sh
   ```
   
2. **Review Results:**
   - Fix any failed checks
   - Address warnings if critical
   - Ensure "Ready for production deployment" message appears

### After Deployment

1. **Run Smoke Tests:**
   ```bash
   ./scripts/production-smoke-test.sh https://pmerit.com
   ```

2. **Start Monitoring:**
   ```bash
   # For first 24 hours: check every 5 minutes
   ./scripts/monitor-api.sh 300
   ```

3. **Monitor Logs:**
   ```bash
   # In another terminal
   tail -f logs/api-monitoring.log
   ```

---

## Typical Deployment Workflow

```bash
# 1. Pre-deployment verification
./scripts/pre-deployment-check.sh
# ✓ All checks passed

# 2. Deploy to production
git push origin main
# Cloudflare automatically deploys

# 3. Wait for deployment to complete (~2 minutes)

# 4. Run smoke tests
./scripts/production-smoke-test.sh https://pmerit.com
# ✓ All tests passed

# 5. Start continuous monitoring
nohup ./scripts/monitor-api.sh 300 > /dev/null 2>&1 &
# Monitoring every 5 minutes

# 6. Check logs periodically
tail -f logs/api-monitoring.log
```

---

## Environment Variables

Scripts support these environment variables:

### `monitor-api.sh`
- `API_BASE_URL` - Override default API URL (default: `https://pmerit-api.peoplemerit.workers.dev`)
- `LOG_FILE` - Override log file location (default: `./logs/api-monitoring.log`)

**Example:**
```bash
API_BASE_URL=https://staging-api.example.com ./scripts/monitor-api.sh
```

### `production-smoke-test.sh`
- `API_URL` - Override API URL (default: `https://pmerit-api.peoplemerit.workers.dev`)

**Example:**
```bash
API_URL=https://staging-api.example.com ./scripts/production-smoke-test.sh https://staging.example.com
```

---

## Requirements

All scripts require these tools:

- **bash** - Shell (usually pre-installed)
- **curl** - HTTP client (usually pre-installed)
- **git** - Version control (for pre-deployment check)
- **jq** - JSON parsing (optional, for pretty output)
- **openssl** - SSL certificate checking (for smoke tests)

### Install Missing Tools

**macOS:**
```bash
brew install jq
```

**Ubuntu/Debian:**
```bash
sudo apt-get install jq
```

**Windows (WSL):**
```bash
sudo apt-get install jq
```

---

## Troubleshooting

### "Permission denied" when running scripts

**Solution:**
```bash
chmod +x scripts/*.sh
```

### "command not found: jq"

Scripts will work without `jq`, but JSON output won't be pretty-printed.

**Solution:** Install jq (see Requirements above)

### API monitoring script not stopping

**Solution:**
```bash
# Find process
ps aux | grep monitor-api.sh

# Kill process
kill <pid>

# Or kill all matching processes
pkill -f monitor-api.sh
```

### Logs directory doesn't exist

Scripts create the logs directory automatically, but if you get errors:

**Solution:**
```bash
mkdir -p logs
```

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Pre-Deployment Check

on:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run pre-deployment check
        run: ./scripts/pre-deployment-check.sh
```

---

## Related Documentation

- [Deployment Guide](../docs/DEPLOYMENT.md) - Complete deployment process
- [Production Verification](../docs/PRODUCTION_VERIFICATION.md) - Manual verification procedures
- [Monitoring Setup](../docs/MONITORING_SETUP.md) - Comprehensive monitoring guide

---

## Support

For issues or questions:
- **GitHub Issues:** https://github.com/peoplemerit/pmerit-ai-platform/issues
- **Email:** support@pmerit.com
- **Documentation:** See `docs/` directory

---

**Last Updated:** November 2024  
**Maintained by:** PMERIT Operations Team
