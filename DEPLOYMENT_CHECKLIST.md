# PMERIT Production Deployment Checklist

**Purpose:** Quick reference checklist for production deployment  
**Print this page and check off items as you complete them**

---

## 📋 PRE-DEPLOYMENT

### Code Preparation
- [ ] All PRs merged to `main` branch
- [ ] No merge conflicts
- [ ] Code review completed
- [ ] On `main` branch locally
- [ ] Local branch up to date with origin

### Automated Checks
- [ ] Run `./scripts/pre-deployment-check.sh`
- [ ] All checks passed (or warnings acceptable)
- [ ] No P0/P1 bugs in issue tracker
- [ ] Testing complete (Issue #14)

### Environment Setup
- [ ] Cloudflare Pages dashboard access verified
- [ ] Cloudflare Workers dashboard access verified
- [ ] Neon database console access verified
- [ ] Environment variables set in Cloudflare

### Configuration Verification
- [ ] `wrangler.toml` configured correctly
- [ ] `CNAME` file has correct domain
- [ ] `_headers` file has security headers
- [ ] Database connection string in Workers env

### Documentation Review
- [ ] README.md up to date
- [ ] Privacy Policy exists
- [ ] Terms of Service exists
- [ ] Support email configured

---

## 🚀 DEPLOYMENT

### Deployment Method: Automatic (Recommended)
- [ ] Working directory clean (`git status`)
- [ ] On `main` branch
- [ ] Push to origin: `git push origin main`
- [ ] Cloudflare Pages deployment started
- [ ] Monitor deployment in dashboard
- [ ] Wait for "Deployment successful" (~2 minutes)

### Deployment Method: Manual (If Needed)
- [ ] Open Cloudflare Pages dashboard
- [ ] Navigate to `pmerit-ai-platform`
- [ ] Click "Deployments" tab
- [ ] Click "Create deployment"
- [ ] Select `main` branch
- [ ] Click "Deploy"
- [ ] Wait for completion

### Deployment Verification
- [ ] Deployment status: "Active"
- [ ] Production URL: https://pmerit.com
- [ ] Build logs: No errors
- [ ] Deployment time: < 3 minutes

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Quick Checks (5 minutes)
- [ ] Run `./scripts/production-smoke-test.sh https://pmerit.com`
- [ ] All smoke tests passed
- [ ] Home page loads (https://pmerit.com)
- [ ] No console errors (F12)
- [ ] SSL padlock shows in browser

### SSL & Security (5 minutes)
- [ ] Certificate valid (click padlock → certificate)
- [ ] HTTPS redirect works (test http://pmerit.com)
- [ ] No mixed content warnings
- [ ] Security headers present (check Network tab)

### Core Pages (10 minutes)
- [ ] Home page (/)
- [ ] Assessment entry (/assessment-entry.html)
- [ ] Assessment questions (/assessment-questions.html)
- [ ] Assessment results (/assessment-results.html)
- [ ] Privacy policy (/privacy.html)
- [ ] Support page (/support.html)

### API Health (5 minutes)
```bash
curl https://pmerit-api-worker.peoplemerit.workers.dev/health
curl https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/db/health
curl https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/db/status
```
- [ ] `/health` returns OK
- [ ] `/api/v1/db/health` returns connected
- [ ] `/api/v1/db/status` returns data
- [ ] Response times < 500ms

### Assessment Flow (15 minutes)
- [ ] Navigate to assessment entry
- [ ] Accept consent
- [ ] Begin assessment
- [ ] Answer 10 questions
- [ ] Progress bar updates
- [ ] Test auto-save (close/reopen)
- [ ] Complete all 120 questions
- [ ] Submit assessment
- [ ] View results page

### Results Page (10 minutes)
- [ ] Chart.js radar chart displays
- [ ] Big Five scores show (0-100)
- [ ] Top 10 careers display
- [ ] Holland Code (RIASEC) shows
- [ ] Export PDF works
- [ ] PDF contains all results
- [ ] Share button works
- [ ] Copy link works

### Performance (10 minutes)
- [ ] Run Lighthouse audit
- [ ] Performance ≥ 85: _____
- [ ] Accessibility ≥ 90: _____
- [ ] Best Practices ≥ 90: _____
- [ ] SEO ≥ 90: _____

### Cross-Browser Quick Check (10 minutes)
- [ ] Chrome (Desktop) - Assessment works
- [ ] Firefox (Desktop) - Assessment works
- [ ] Safari (Desktop) - Assessment works
- [ ] Mobile Safari (iPhone) - Assessment works
- [ ] Mobile Chrome (Android) - Assessment works

---

## 📊 MONITORING SETUP

### Start Monitoring (5 minutes)
```bash
# Start API monitoring (every 5 minutes for first 24 hours)
nohup ./scripts/monitor-api.sh 300 > /dev/null 2>&1 &

# Note the process ID: _____
```

- [ ] Monitoring script started
- [ ] Process ID noted
- [ ] Log file created: `logs/api-monitoring.log`

### Cloudflare Analytics (5 minutes)
- [ ] Open Cloudflare dashboard
- [ ] Navigate to pmerit-ai-platform → Analytics
- [ ] Enable Web Analytics
- [ ] Verify data collection starts

### Set Up Alerts (10 minutes)
- [ ] Cloudflare Notifications enabled
- [ ] Email alerts configured
- [ ] Downtime alerts enabled
- [ ] Error rate alerts enabled
- [ ] Team notification channels set up

---

## 🎯 FIRST 24 HOURS MONITORING

### First Hour
- [ ] Monitor API logs every 15 minutes
- [ ] Check Cloudflare deployment logs
- [ ] Watch for console errors
- [ ] Check Workers logs for errors
- [ ] Monitor user feedback channels

### First 4 Hours
- [ ] API monitoring running smoothly
- [ ] No error spikes in logs
- [ ] Response times < 500ms
- [ ] No database connection issues
- [ ] User reports: No critical issues

### First 24 Hours
- [ ] Daily Lighthouse check: _____
- [ ] Error rate: < 1%
- [ ] Uptime: > 99%
- [ ] Assessment completion rate: ____%
- [ ] No P0/P1 incidents

---

## 📝 SIGN-OFF

### Technical Sign-Off
- [ ] DevOps Lead: _________________ Date: _______
- [ ] Backend Lead: ________________ Date: _______
- [ ] Frontend Lead: _______________ Date: _______

### QA Sign-Off
- [ ] QA Lead: ____________________ Date: _______
- [ ] All tests passed
- [ ] Zero P0/P1 bugs
- [ ] Performance targets met

### Business Sign-Off
- [ ] Project Lead: ________________ Date: _______
- [ ] Product Owner: _______________ Date: _______
- [ ] Ready for public announcement

---

## 🚨 ROLLBACK (If Needed)

### When to Rollback
- [ ] Critical security vulnerability
- [ ] Complete feature failure
- [ ] Data loss occurring
- [ ] API completely down

### Rollback Procedure
```bash
# Option 1: Git revert
git revert HEAD
git push origin main

# Option 2: Cloudflare dashboard
# 1. Go to Deployments
# 2. Find last working deployment
# 3. Click "Rollback to this deployment"
```

### Post-Rollback
- [ ] Verify rollback successful
- [ ] Run smoke tests
- [ ] Document incident
- [ ] Notify team
- [ ] Schedule post-mortem

---

## 📞 EMERGENCY CONTACTS

**Project Lead:** ___________________  
**DevOps Lead:** ___________________  
**Database Admin:** ___________________  

**Support Channels:**
- Email: support@pmerit.com
- GitHub: https://github.com/peoplemerit/pmerit-ai-platform/issues
- Slack: #pmerit-launch (if available)

---

## ✅ DEPLOYMENT COMPLETE

### Final Verification
- [ ] All checklist items completed
- [ ] All stakeholders signed off
- [ ] Monitoring active
- [ ] Team notified
- [ ] Documentation updated
- [ ] Ready for Issue #16 (Documentation)

### Deployment Details
**Deployment Date:** _______________  
**Deployment Time:** _______________  
**Git Commit SHA:** _______________  
**Cloudflare Deployment ID:** _______________  
**Total Deployment Time:** _______________  

### Success Metrics
- Uptime (first 24h): _____%
- Error Rate (first 24h): _____%
- Avg Response Time: _____ms
- Assessment Completions: _____
- Issues Reported: P0: ____ P1: ____ P2: ____ P3: ____

---

**Checklist Version:** 1.0  
**Last Updated:** November 2024  
**Maintained by:** PMERIT Operations Team

---

## 📚 Related Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Production Verification](docs/PRODUCTION_VERIFICATION.md)
- [Monitoring Setup](docs/MONITORING_SETUP.md)
- [Scripts README](scripts/README.md)

---

**PRINT THIS PAGE FOR DEPLOYMENT DAY** 📄
