# PMERIT Platform Deployment Guide

**Version:** 1.0  
**Last Updated:** November 2024  
**Target Environment:** Cloudflare Pages (Production)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Deployment Process](#deployment-process)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Rollback Procedures](#rollback-procedures)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers the complete deployment process for the PMERIT AI Educational Platform to production at https://pmerit.com.

### Deployment Architecture

- **Frontend Hosting:** Cloudflare Pages
- **API Backend:** Cloudflare Workers
- **Database:** Neon PostgreSQL
- **Domain:** pmerit.com
- **CDN:** Cloudflare Global Network

### Key URLs

- **Production:** https://pmerit.com
- **Preview:** https://pmerit-ai-platform.pages.dev
- **API:** https://pmerit-api-worker.peoplemerit.workers.dev

---

## Prerequisites

### Required Access

- [ ] GitHub repository write access
- [ ] Cloudflare Pages dashboard access
- [ ] Cloudflare Workers dashboard access
- [ ] Neon database console access

### Required Tools

```bash
# Verify required tools are installed
git --version          # Git 2.0+
curl --version         # cURL 7.0+
jq --version           # jq 1.6+ (for JSON parsing)
```

### Environment Setup

```bash
# Clone repository
git clone https://github.com/peoplemerit/pmerit-ai-platform.git
cd pmerit-ai-platform

# Ensure on main branch
git checkout main
git pull origin main
```

---

## Pre-Deployment Checklist

### Automated Pre-Deployment Check

Run the automated pre-deployment verification script:

```bash
./scripts/pre-deployment-check.sh
```

This script verifies:
- ✅ Git repository status (clean, on main, up to date)
- ✅ Code quality (no console.log, minimal TODOs)
- ✅ Security (no hardcoded secrets, HTTPS usage)
- ✅ Configuration files (wrangler.toml, CNAME, _headers)
- ✅ Required files present
- ✅ Asset optimization
- ✅ Documentation present

### Manual Verification Checklist

#### Code Quality
- [ ] All pull requests merged to `main` branch
- [ ] No merge conflicts
- [ ] Code review completed
- [ ] No `console.log()` statements in production code
- [ ] No commented-out code blocks
- [ ] All TODO comments resolved or documented

#### Testing
- [ ] All test scenarios pass
- [ ] Zero P0 (Critical) bugs
- [ ] Zero P1 (High) bugs
- [ ] P2/P3 bugs documented and triaged
- [ ] Cross-browser testing complete

#### Performance
- [ ] Lighthouse scores meet targets:
  - Performance ≥85
  - Accessibility ≥90
  - Best Practices ≥90
  - SEO ≥90

#### Assets
- [ ] All images compressed/optimized (<200KB each)
- [ ] Unused CSS/JS removed
- [ ] Fonts optimized (woff2 format)
- [ ] Favicon.ico present (16×16, 32×32, 48×48)

#### Configuration
- [ ] Environment variables set in Cloudflare Pages dashboard
- [ ] `wrangler.toml` configured for production
- [ ] CORS headers configured correctly
- [ ] Database migrations applied to production database

#### Security
- [ ] No API keys or secrets in code
- [ ] HTTPS enforced
- [ ] Input validation on all forms
- [ ] SQL injection protection (parameterized queries)

#### Legal & Compliance
- [ ] Privacy Policy page exists
- [ ] Terms of Service page exists
- [ ] Accessibility statement page exists
- [ ] Contact page with support email

---

## Deployment Process

### Method 1: Automatic Deployment (Recommended)

Cloudflare Pages automatically deploys when changes are pushed to the `main` branch.

```bash
# Ensure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Verify clean working directory
git status
# Should show: "nothing to commit, working tree clean"

# Push to trigger deployment (if needed)
git push origin main
```

**What Happens Next:**
1. Cloudflare detects the push to `main`
2. Builds the site automatically
3. Deploys to production (https://pmerit.com)
4. Updates typically complete in 2-3 minutes

**Monitor Deployment:**
1. Visit Cloudflare Pages dashboard
2. Navigate to `pmerit-ai-platform` project
3. Click "Deployments" tab
4. Watch deployment progress

### Method 2: Manual Deployment via Dashboard

If automatic deployment fails or you need to redeploy:

1. **Access Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Select your account
   - Go to "Pages" → "pmerit-ai-platform"

2. **Trigger Manual Deployment**
   - Click "Deployments" tab
   - Click "Create deployment" button
   - Select `main` branch
   - Click "Deploy"

3. **Monitor Progress**
   - Wait for build to complete (~2 minutes)
   - Check deployment status
   - Verify "Deployment successful" message

---

## Post-Deployment Verification

### Step 1: DNS & SSL Verification

```bash
# Verify DNS resolution
nslookup pmerit.com

# Verify SSL certificate
echo | openssl s_client -servername pmerit.com -connect pmerit.com:443 2>/dev/null | openssl x509 -noout -dates
```

**Manual Checks:**
- [ ] Visit https://pmerit.com (padlock shows in browser)
- [ ] Test HTTP → HTTPS redirect: http://pmerit.com
- [ ] Verify SSL certificate is valid (not expired)

### Step 2: Run Automated Smoke Tests

```bash
# Run production smoke tests
./scripts/production-smoke-test.sh https://pmerit.com

# Expected output: All tests passed
```

### Step 3: Manual Verification Checklist

#### Home Page
- [ ] Navigate to https://pmerit.com
- [ ] Page loads in <3 seconds
- [ ] No console errors (F12 → Console)
- [ ] Header/footer display correctly
- [ ] Language switcher works
- [ ] "Start Assessment" button works
- [ ] All images load
- [ ] Favicon displays

#### Assessment Flow
- [ ] Navigate to `/assessment-entry.html`
- [ ] Accept consent
- [ ] Click "Begin Assessment"
- [ ] Complete first 10 questions
- [ ] Verify progress bar updates
- [ ] Test auto-save (close tab, reopen, verify resume modal)
- [ ] Complete all 120 questions
- [ ] Submit assessment
- [ ] View processing screen
- [ ] View results page

#### Assessment Results
- [ ] Chart.js radar chart renders correctly
- [ ] Big Five scores display
- [ ] Top 10 careers display with fit scores
- [ ] Holland Code (RIASEC) displays
- [ ] "Export PDF" button works
- [ ] "Share Results" button works

#### API Health
```bash
# Test API endpoints
curl https://pmerit-api-worker.peoplemerit.workers.dev/health
curl https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/db/health
curl https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/db/status
```

### Step 4: Performance Testing

```bash
# Run Lighthouse audit
# Use Chrome DevTools → Lighthouse
# Or use CLI:
npx lighthouse https://pmerit.com --view
```

**Target Scores:**
- Performance: ≥85
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90

### Step 5: Cross-Browser Quick Check

Test on:
- [ ] Chrome (Desktop): Assessment flow works
- [ ] Firefox (Desktop): Assessment flow works
- [ ] Safari (Desktop): Assessment flow works
- [ ] Mobile Safari (iPhone): Touch interactions work
- [ ] Mobile Chrome (Android): Touch interactions work

---

## Post-Deployment Monitoring

### Automated API Monitoring

Set up continuous monitoring for the first 24 hours:

```bash
# Run monitoring script (checks every 15 minutes)
./scripts/monitor-api.sh

# Or run in background
nohup ./scripts/monitor-api.sh > /dev/null 2>&1 &

# Check logs
tail -f logs/api-monitoring.log
```

### Manual Monitoring Checklist

#### First Hour
- [ ] Check Cloudflare Pages deployment status
- [ ] Monitor API health endpoints
- [ ] Watch for console errors
- [ ] Check Cloudflare Workers logs

#### First 24 Hours
- [ ] Run API monitoring script every 15 minutes
- [ ] Check error logs in Cloudflare dashboard
- [ ] Monitor user feedback channels
- [ ] Track completion rates

#### First Week
Monitor key metrics:

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Uptime | 99.9% | <99% |
| API Response Time | <500ms | >2s |
| Error Rate | <1% | >5% |
| Assessment Completion | >80% | <60% |
| Lighthouse Performance | ≥85 | <80 |
| Page Load Time | <3s | >5s |

---

## Rollback Procedures

### When to Rollback

**Rollback Immediately if:**
- Critical security vulnerability discovered
- Complete feature failure (assessment doesn't work)
- Data loss occurring
- API completely down

**Do NOT Rollback for:**
- Minor cosmetic issues (fix forward instead)
- Single browser compatibility issue
- Low-priority bugs

### Option 1: Git Revert (Recommended)

```bash
# Revert the last commit
git revert HEAD

# Push to trigger redeployment
git push origin main

# Cloudflare will automatically deploy the reverted version
```

### Option 2: Rollback via Cloudflare Dashboard

1. Go to Cloudflare Pages dashboard
2. Navigate to `pmerit-ai-platform` → Deployments
3. Find the last working deployment
4. Click "..." menu → "Rollback to this deployment"
5. Confirm rollback
6. Wait for rollback to complete (~1 minute)

### Option 3: Deploy Previous Commit

```bash
# Identify last good commit
git log --oneline

# Create new branch from good commit
git checkout -b hotfix/rollback <good-commit-sha>

# Push to trigger deployment
git push origin hotfix/rollback

# Then merge to main if needed
```

### Post-Rollback Actions

1. **Verify Rollback Success**
   ```bash
   ./scripts/production-smoke-test.sh https://pmerit.com
   ```

2. **Document Issue**
   - Create GitHub issue describing the problem
   - Add "production-incident" label
   - Document timeline and impact

3. **Communicate Status**
   - Notify team of rollback
   - Update status page (if available)
   - Post to internal channels

4. **Root Cause Analysis**
   - Investigate what went wrong
   - Document findings
   - Implement preventive measures

---

## Troubleshooting

### Deployment Failed

**Problem:** Cloudflare Pages deployment fails

**Solutions:**
1. Check build logs in Cloudflare dashboard
2. Verify `wrangler.toml` configuration
3. Check for build errors
4. Try manual deployment via dashboard

### Site Not Loading

**Problem:** https://pmerit.com returns errors or doesn't load

**Solutions:**
1. Verify DNS records in Cloudflare DNS settings
2. Check SSL certificate status
3. Verify deployment status (should show "Active")
4. Check browser console for errors
5. Try clearing browser cache

### API Endpoints Failing

**Problem:** API calls return errors or timeout

**Solutions:**
1. Check Workers deployment status
2. Verify environment variables in Workers dashboard
3. Check database connectivity
4. Review Workers logs for errors
5. Test endpoints directly:
   ```bash
   curl -v https://pmerit-api-worker.peoplemerit.workers.dev/health
   ```

### Database Connection Issues

**Problem:** Database queries fail or timeout

**Solutions:**
1. Check Neon database status
2. Verify connection string in Workers environment
3. Check database activity in Neon console
4. Verify IP allowlist (if configured)
5. Test connection:
   ```bash
   curl https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/db/health
   ```

### Performance Issues

**Problem:** Site is slow or unresponsive

**Solutions:**
1. Run Lighthouse audit to identify bottlenecks
2. Check asset sizes (images should be <200KB)
3. Verify CDN caching is working
4. Check for console errors
5. Monitor API response times

### SSL Certificate Issues

**Problem:** SSL certificate warnings or errors

**Solutions:**
1. Verify certificate status in Cloudflare SSL/TLS settings
2. Check certificate expiration date
3. Ensure "Full (strict)" SSL mode is enabled
4. Wait for certificate provisioning (can take up to 24 hours for new domains)

---

## Emergency Contacts

### During Deployment

- **Project Lead:** [Contact info]
- **DevOps Lead:** [Contact info]
- **Database Admin:** [Contact info]

### Support Channels

- **Email:** support@pmerit.com
- **GitHub Issues:** https://github.com/peoplemerit/pmerit-ai-platform/issues
- **Slack:** #pmerit-launch (if available)

---

## Deployment Checklist Quick Reference

```
Pre-Deployment:
□ Run ./scripts/pre-deployment-check.sh
□ Verify all tests pass
□ Review manual checklist items
□ Backup database (if needed)

Deployment:
□ Push to main branch OR trigger manual deployment
□ Monitor deployment progress
□ Wait for "Deployment successful"

Post-Deployment:
□ Verify SSL certificate
□ Run ./scripts/production-smoke-test.sh
□ Complete manual verification checklist
□ Run Lighthouse audit
□ Start API monitoring
□ Monitor for first 24 hours

If Issues:
□ Follow rollback procedures
□ Document incident
□ Notify team
□ Conduct root cause analysis
```

---

## Success Criteria

✅ **Deployment is successful when:**

1. Platform accessible at https://pmerit.com
2. All smoke tests pass
3. Zero P0/P1 bugs in production
4. Lighthouse scores meet targets
5. API endpoints responding correctly
6. Database connected and queries work
7. No console errors on any page
8. Monitoring active and reporting data
9. Team notified and ready to support

---

**Last Updated:** November 2024  
**Document Version:** 1.0  
**Maintained by:** PMERIT Platform Team
