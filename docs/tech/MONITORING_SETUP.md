# PMERIT Monitoring Setup Guide

**Version:** 1.0  
**Last Updated:** November 2024  
**Purpose:** Post-deployment monitoring and alerting configuration

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Monitoring Architecture](#monitoring-architecture)
3. [API Health Monitoring](#api-health-monitoring)
4. [Cloudflare Analytics](#cloudflare-analytics)
5. [Error Tracking](#error-tracking)
6. [Performance Monitoring](#performance-monitoring)
7. [Database Monitoring](#database-monitoring)
8. [Alert Configuration](#alert-configuration)
9. [Incident Response](#incident-response)

---

## Overview

This guide covers the monitoring setup for the PMERIT platform after production deployment.

### Monitoring Objectives

- **Uptime:** Ensure 99.9% availability
- **Performance:** Track response times and load times
- **Errors:** Detect and alert on errors quickly
- **Usage:** Monitor user activity and engagement
- **Security:** Track suspicious activity

### Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Uptime | 99.9% | <99% |
| API Response Time | <500ms | >2s |
| Error Rate | <1% | >5% |
| Assessment Completion | >80% | <60% |
| Page Load Time | <3s | >5s |
| Lighthouse Performance | ≥85 | <80 |

---

## Monitoring Architecture

### Components

```
┌─────────────────────────────────────────────┐
│           PMERIT Platform                    │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (Cloudflare Pages)                │
│  ├─── Cloudflare Analytics                  │
│  └─── Browser Error Tracking                │
│                                             │
│  API (Cloudflare Workers)                   │
│  ├─── Workers Logs                          │
│  ├─── Health Monitoring                     │
│  └─── API Response Time Tracking            │
│                                             │
│  Database (Neon PostgreSQL)                 │
│  ├─── Connection Monitoring                 │
│  └─── Query Performance                     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## API Health Monitoring

### Automated Monitoring Script

The `monitor-api.sh` script continuously checks API health endpoints.

#### Setup

```bash
# Make script executable (if not already)
chmod +x scripts/monitor-api.sh

# Run monitoring (checks every 15 minutes by default)
./scripts/monitor-api.sh

# Run with custom interval (5 minutes = 300 seconds)
./scripts/monitor-api.sh 300

# Run in background
nohup ./scripts/monitor-api.sh > /dev/null 2>&1 &

# To stop background monitoring
pkill -f monitor-api.sh
```

#### What It Monitors

- ✅ API health endpoint (`/health`)
- ✅ Database health endpoint (`/api/v1/db/health`)
- ✅ Database status endpoint (`/api/v1/db/status`)
- ✅ AI chat endpoint (`/api/v1/ai/chat`)

#### Log Files

Monitoring logs are stored in `logs/api-monitoring.log`

```bash
# View real-time logs
tail -f logs/api-monitoring.log

# View last 100 lines
tail -n 100 logs/api-monitoring.log

# Search for failures
grep "Failed" logs/api-monitoring.log
```

### First 24 Hours Monitoring

**Critical Period:** Monitor intensively for the first 24 hours after deployment.

#### Recommended Schedule:

| Time Period | Check Interval | Action |
|-------------|---------------|--------|
| 0-2 hours | Every 5 minutes | Manual monitoring |
| 2-8 hours | Every 15 minutes | Automated script |
| 8-24 hours | Every 30 minutes | Automated script |
| After 24 hours | Every 1-2 hours | Automated script |

#### Setup for First 24 Hours:

```bash
# Terminal 1: Run monitoring script
./scripts/monitor-api.sh 300  # 5 minutes

# Terminal 2: Watch logs
watch -n 60 'tail -n 20 logs/api-monitoring.log'

# Terminal 3: Watch Cloudflare logs (see below)
```

---

## Cloudflare Analytics

### Enable Cloudflare Web Analytics

1. **Access Dashboard**
   - Go to: https://dash.cloudflare.com
   - Select your account
   - Navigate to "Pages" → "pmerit-ai-platform"

2. **Enable Analytics**
   - Click "Analytics" tab
   - Enable "Web Analytics"
   - Copy tracking snippet (if needed)

3. **View Analytics**
   - Visit analytics dashboard regularly
   - Monitor page views, bandwidth, requests
   - Check geographic distribution

### Key Metrics to Monitor

#### Traffic Metrics
- **Page Views:** Total visits per day
- **Unique Visitors:** Individual users per day
- **Bandwidth:** Data transferred
- **Requests:** Total HTTP requests

#### Performance Metrics
- **Response Time:** Average response time
- **Cache Hit Ratio:** Percentage of cached requests
- **Origin Response Time:** Time to fetch from origin

#### Geographic Distribution
- **Top Countries:** Where users are accessing from
- **Traffic Patterns:** Peak usage times

### Setting Up Alerts

1. Go to Cloudflare dashboard
2. Navigate to "Notifications"
3. Click "Add" to create new notification
4. Select notification types:
   - Downtime alerts
   - Traffic anomalies
   - Error rate spikes

---

## Error Tracking

### Cloudflare Workers Logs

#### Access Real-Time Logs

1. **Via Dashboard:**
   - Go to: https://dash.cloudflare.com
   - Navigate to "Workers & Pages"
   - Select "pmerit-api"
   - Click "Logs" tab
   - Enable "Real-time Logs"

2. **Via Wrangler CLI:**
   ```bash
   # Install wrangler if not installed
   npm install -g wrangler
   
   # Login to Cloudflare
   wrangler login
   
   # Tail logs
   wrangler tail pmerit-api
   ```

#### What to Look For

- **Error Messages:** Any 500 errors or exceptions
- **Slow Requests:** Requests taking >2 seconds
- **Failed Database Queries:** Connection errors
- **Rate Limiting:** Too many requests from single IP

### Browser Error Tracking

#### Console Error Monitoring

Add client-side error tracking to detect issues users encounter:

```javascript
// Monitor for JavaScript errors
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    // Optionally send to monitoring service
});

// Monitor for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    // Optionally send to monitoring service
});
```

#### Manual Check

Regularly check for console errors:

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Document and fix any errors

---

## Performance Monitoring

### Lighthouse Monitoring

Run regular Lighthouse audits to track performance over time.

#### Daily Lighthouse Check

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://pmerit.com --output=html --output-path=./reports/lighthouse-$(date +%Y%m%d).html

# Run with specific categories
lighthouse https://pmerit.com --only-categories=performance,accessibility --view
```

#### Automated Lighthouse Monitoring

Create a cron job to run daily:

```bash
# Edit crontab
crontab -e

# Add daily Lighthouse check at 2 AM
0 2 * * * cd /path/to/project && lighthouse https://pmerit.com --output=json --output-path=./reports/lighthouse-$(date +\%Y\%m\%d).json
```

#### Track Metrics Over Time

Keep a log of Lighthouse scores:

| Date | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| 2024-11-09 | 88 | 92 | 95 | 93 |
| 2024-11-10 | ___ | ___ | ___ | ___ |
| 2024-11-11 | ___ | ___ | ___ | ___ |

### Core Web Vitals Monitoring

Monitor Core Web Vitals through:

1. **Cloudflare Web Analytics**
   - Automatically tracks Web Vitals
   - View in Analytics dashboard

2. **Google Search Console**
   - Add site to Search Console
   - View Core Web Vitals report
   - Get notified of issues

3. **Real User Monitoring (RUM)**
   ```javascript
   // Track page load time
   window.addEventListener('load', function() {
       const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
       console.log('Page load time:', loadTime, 'ms');
   });
   ```

---

## Database Monitoring

### Neon Console Monitoring

1. **Access Neon Dashboard**
   - Go to: https://console.neon.tech
   - Select your project
   - View database metrics

2. **Key Metrics to Monitor**
   - **Connection Count:** Active database connections
   - **Query Performance:** Slow query log
   - **Storage Usage:** Database size
   - **CPU Usage:** Database compute usage

### Database Health Checks

#### Automated Health Check

The monitoring script checks database health every 15 minutes:

```bash
# Check database health
curl https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/db/health

# Expected response:
# {"status":"connected","database":"neondb"}
```

#### Manual Database Check

```bash
# Check database status
curl https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/db/status

# Expected response includes:
# - Table count
# - Database size
# - Connection status
```

### Connection Pool Monitoring

Monitor for connection pool exhaustion:

- **Warning Signs:**
  - Increasing connection errors
  - Timeout errors
  - Slow database queries

- **Resolution:**
  - Review connection pool settings
  - Check for connection leaks
  - Scale database if needed

---

## Alert Configuration

### Alert Thresholds

Configure alerts based on these thresholds:

| Metric | Warning | Critical |
|--------|---------|----------|
| API Response Time | >1s | >2s |
| Error Rate | >2% | >5% |
| Uptime | <99.5% | <99% |
| Database Connections | >80% | >95% |
| Page Load Time | >4s | >5s |

### Alert Channels

#### Email Alerts

Set up email notifications:

1. Cloudflare dashboard → Notifications
2. Add email address
3. Select alert types
4. Save configuration

#### Slack Alerts (Optional)

If using Slack:

1. Create #pmerit-alerts channel
2. Set up incoming webhook
3. Configure alerts to post to Slack

#### SMS Alerts (Optional)

For critical alerts:

1. Use service like Twilio
2. Configure for P0 incidents only
3. Alert on-call engineer

### Alert Response Times

| Priority | Response Time | Resolution Time |
|----------|--------------|-----------------|
| P0 (Critical) | <15 minutes | <2 hours |
| P1 (High) | <1 hour | <8 hours |
| P2 (Medium) | <4 hours | <48 hours |
| P3 (Low) | <24 hours | <1 week |

---

## Incident Response

### Incident Severity Levels

#### P0 - Critical
- **Definition:** Site down, data loss, security breach
- **Examples:**
  - Production site returns 500 errors
  - Database is inaccessible
  - Security vulnerability actively exploited
- **Action:** Immediate response, consider rollback

#### P1 - High
- **Definition:** Major feature broken, affects many users
- **Examples:**
  - Assessment submission fails
  - Results page doesn't load
  - API consistently slow (>5s)
- **Action:** High priority fix within 8 hours

#### P2 - Medium
- **Definition:** Feature partially broken, workaround exists
- **Examples:**
  - PDF export occasionally fails
  - Some styling issues on specific browser
  - Slow performance on old devices
- **Action:** Fix in next deployment cycle

#### P3 - Low
- **Definition:** Cosmetic issue, minor inconvenience
- **Examples:**
  - Button alignment off by 2px
  - Typo in text
  - Minor animation glitch
- **Action:** Fix when convenient

### Incident Response Workflow

```
┌─────────────────┐
│  Detect Issue   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Assess Impact  │  ← Determine severity (P0-P3)
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Notify Team    │  ← Alert relevant stakeholders
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Investigate    │  ← Check logs, reproduce issue
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Fix Issue      │  ← Deploy fix or rollback
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Verify Fix     │  ← Run smoke tests
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Post-Mortem    │  ← Document learnings
└─────────────────┘
```

### Incident Documentation Template

```markdown
# Incident Report: [Title]

**Date:** YYYY-MM-DD
**Duration:** X hours Y minutes
**Severity:** P0/P1/P2/P3
**Status:** Resolved/Ongoing

## Summary
Brief description of the incident

## Impact
- Number of users affected
- Features affected
- Revenue impact (if applicable)

## Timeline
- HH:MM - Issue detected
- HH:MM - Team notified
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - Issue resolved

## Root Cause
Technical explanation of what went wrong

## Resolution
How the issue was fixed

## Prevention
Steps to prevent similar issues in future

## Action Items
- [ ] Action 1
- [ ] Action 2
- [ ] Action 3
```

---

## Monitoring Checklist

### First Hour After Deployment

- [ ] Run production smoke tests
- [ ] Start API monitoring script
- [ ] Check Cloudflare deployment status
- [ ] Monitor Workers logs in real-time
- [ ] Verify database connectivity
- [ ] Watch for console errors
- [ ] Check user feedback channels

### First 24 Hours

- [ ] API monitoring running continuously
- [ ] Check error logs every 2 hours
- [ ] Monitor API response times
- [ ] Track assessment completion rates
- [ ] Review Cloudflare analytics
- [ ] Check for performance degradation
- [ ] Monitor database activity

### First Week

- [ ] Run daily Lighthouse audits
- [ ] Review weekly analytics report
- [ ] Check for error trends
- [ ] Monitor uptime statistics
- [ ] Review user feedback
- [ ] Optimize based on metrics
- [ ] Document any issues found

### Ongoing

- [ ] Weekly Lighthouse checks
- [ ] Monthly performance review
- [ ] Quarterly capacity planning
- [ ] Regular security audits
- [ ] Continuous error monitoring

---

## Tools and Resources

### Essential Tools

- **curl** - API testing
- **jq** - JSON parsing
- **Lighthouse** - Performance auditing
- **Chrome DevTools** - Debugging
- **Cloudflare Dashboard** - Analytics and logs

### Helpful Commands

```bash
# Monitor API health
./scripts/monitor-api.sh

# Run smoke tests
./scripts/production-smoke-test.sh

# Check API response time
curl -w "@curl-format.txt" -o /dev/null -s https://pmerit-api-worker.peoplemerit.workers.dev/health

# View logs
tail -f logs/api-monitoring.log

# Run Lighthouse
lighthouse https://pmerit.com --view
```

### External Services (Optional)

Consider integrating:

- **Sentry** - Error tracking
- **Datadog** - APM monitoring
- **PagerDuty** - Incident management
- **Uptime Robot** - Uptime monitoring
- **New Relic** - Performance monitoring

---

## Contact Information

### On-Call Rotation

| Time Period | Primary | Secondary |
|-------------|---------|-----------|
| Weekdays 9-5 | [Name] | [Name] |
| Weekdays 5-9 | [Name] | [Name] |
| Weekends | [Name] | [Name] |

### Escalation Path

1. **L1 Support** - Monitor alerts, basic troubleshooting
2. **L2 Engineering** - Investigate issues, deploy fixes
3. **L3 Senior Engineering** - Complex issues, architecture decisions
4. **Management** - Business impact, major incidents

### Support Channels

- **Email:** support@pmerit.com
- **Slack:** #pmerit-alerts
- **GitHub:** https://github.com/peoplemerit/pmerit-ai-platform/issues
- **Phone:** [Emergency contact number]

---

## Success Criteria

✅ **Monitoring is successful when:**

1. Automated monitoring running continuously
2. All key metrics being tracked
3. Alerts configured and tested
4. Team knows how to respond to incidents
5. Logs are being collected and reviewed
6. Performance trends are visible
7. Issues are detected before users report them

---

**Last Updated:** November 2024  
**Document Version:** 1.0  
**Maintained by:** PMERIT Operations Team
