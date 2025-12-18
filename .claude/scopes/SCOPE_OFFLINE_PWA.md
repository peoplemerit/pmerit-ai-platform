# PMERIT SUB-SCOPE: Offline & PWA Support

**Version:** 1.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-18
**Status:** NOT IMPLEMENTED
**Phase:** Accessibility Enhancement
**Priority:** P2 - Global Reach Mission

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Progressive Web App with Offline Learning Capability |
| **Target Users** | Learners in low-bandwidth regions |
| **Technology** | Service Workers, IndexedDB, Cache API |
| **Files** | `sw.js` (TBD), `manifest.json` (TBD) |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

PWA and offline support is **NOT IMPLEMENTED**. This is a critical gap for the platform's mission to reach learners in low-bandwidth regions (3+ billion potential users).

### What EXISTS

| Component | Status | Notes |
|-----------|--------|-------|
| Responsive design | EXISTS | Mobile-friendly UI |
| HTTPS | EXISTS | Required for Service Workers |

### What DOES NOT EXIST

| Component | Status | Impact |
|-----------|--------|--------|
| Service Worker | NOT BUILT | No offline capability |
| manifest.json | NOT BUILT | Can't install as app |
| Offline page | NOT BUILT | No graceful offline message |
| Content caching | NOT BUILT | Everything requires network |
| Offline progress sync | NOT BUILT | Progress lost if offline |
| Background sync | NOT BUILT | No queued actions |

### Why This Matters

```
PMERIT Mission: "Liberate people from poverty through education"
Target: 3+ billion potential learners globally

Many of these learners:
• Have intermittent internet access
• Use prepaid mobile data (expensive)
• Access internet at shared locations (libraries, cafes)
• Need to download content for offline study

Without PWA: These learners CANNOT use PMERIT effectively.
```

---

## 3. ARCHITECTURAL DECISIONS (PENDING)

| ID | Decision | Options | Recommendation |
|----|----------|---------|----------------|
| PWA-001 | Caching Strategy | Cache-first vs Network-first | Hybrid (static = cache-first, API = network-first) |
| PWA-002 | Offline Content | All content vs Selected courses | Selected courses (user chooses) |
| PWA-003 | Storage Limit | Per-course limit | 100MB per course |
| PWA-004 | Sync Strategy | Background sync vs Manual | Background sync with fallback |

---

## 4. HANDOFF_DOCUMENT

### PWA Requirements

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PWA FEATURE SET                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  INSTALLABILITY                                                     │
│  ─────────────                                                      │
│  • manifest.json with app metadata                                  │
│  • Service Worker registered                                        │
│  • "Add to Home Screen" prompt                                      │
│  • Standalone app experience                                        │
│                                                                     │
│  OFFLINE CAPABILITY                                                 │
│  ──────────────────                                                 │
│  • App shell cached (header, footer, CSS, JS)                       │
│  • Static pages cached (homepage, dashboard)                        │
│  • API responses cached (courses, pathways)                         │
│  • Offline fallback page when network unavailable                   │
│                                                                     │
│  CONTENT DOWNLOAD                                                   │
│  ─────────────────                                                  │
│  • User can download courses for offline                            │
│  • Download includes lessons, quizzes, AI context                   │
│  • Progress stored locally in IndexedDB                             │
│  • Syncs to server when online                                      │
│                                                                     │
│  BACKGROUND SYNC                                                    │
│  ────────────────                                                   │
│  • Queue actions taken offline                                      │
│  • Sync progress when connection restored                           │
│  • Sync assessment answers                                          │
│  • Handle conflicts gracefully                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### manifest.json (Proposed)

```json
{
  "name": "PMERIT - Free AI-Powered Education",
  "short_name": "PMERIT",
  "description": "Free education to liberate people from poverty",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#4f46e5",
  "orientation": "any",
  "icons": [
    {
      "src": "/assets/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["education", "productivity"],
  "screenshots": [
    {
      "src": "/assets/screenshots/dashboard.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Strategy (Proposed)

```javascript
// sw.js
const CACHE_VERSION = 'pmerit-v1';
const STATIC_CACHE = 'pmerit-static-v1';
const DYNAMIC_CACHE = 'pmerit-dynamic-v1';
const OFFLINE_CACHE = 'pmerit-offline-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/portal/dashboard.html',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/js/auth.js',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Fetch event - cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets: cache-first
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match('/offline.html');
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  const db = await openDB('pmerit-offline');
  const pendingProgress = await db.getAll('pendingProgress');

  for (const progress of pendingProgress) {
    try {
      await fetch('/api/v1/progress/sync', {
        method: 'POST',
        body: JSON.stringify(progress)
      });
      await db.delete('pendingProgress', progress.id);
    } catch {
      // Will retry on next sync
    }
  }
}
```

### Offline Content Download UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  📥 DOWNLOAD FOR OFFLINE                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  HTML & CSS Fundamentals                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Size: 45 MB (15 lessons, 3 quizzes)                         │   │
│  │ [████████████████░░░░] 78% downloading...                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  JavaScript Essentials                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Size: 62 MB (15 lessons, 3 quizzes)                         │   │
│  │ [Download for Offline]                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  💾 Storage Used: 45 MB / 500 MB available                          │
│                                                                     │
│  ⚠️ Downloaded courses available offline.                           │
│  Progress will sync when you reconnect.                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### IndexedDB Schema (Proposed)

```javascript
// Database: pmerit-offline
const DB_SCHEMA = {
  stores: [
    {
      name: 'downloadedCourses',
      keyPath: 'courseId',
      indexes: ['downloadedAt', 'lastAccessed']
    },
    {
      name: 'lessons',
      keyPath: 'lessonId',
      indexes: ['courseId', 'moduleId']
    },
    {
      name: 'progress',
      keyPath: 'lessonId',
      indexes: ['courseId', 'syncStatus']
    },
    {
      name: 'pendingSync',
      keyPath: 'id',
      autoIncrement: true,
      indexes: ['type', 'createdAt']
    }
  ]
};
```

---

## 5. RESEARCH_FINDINGS

*No implementation yet - awaiting specification approval*

### Browser Support

| Browser | Service Worker | IndexedDB | Background Sync |
|---------|----------------|-----------|-----------------|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ❌ (polyfill) |
| Safari | ✅ | ✅ | ❌ (polyfill) |
| Edge | ✅ | ✅ | ✅ |
| Samsung Internet | ✅ | ✅ | ✅ |

### Storage Considerations

| Platform | Storage Limit | Notes |
|----------|---------------|-------|
| Chrome | 60% of disk | Can request more |
| Firefox | 50% of disk | Per-origin |
| Safari | 1GB default | Prompts user if more needed |
| Mobile | Varies | Limited on low-end devices |

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | HTTPS | Service Workers require secure context |
| **Requires** | SCOPE_PROGRESS | Progress sync when online |
| **Enables** | Low-bandwidth access | Core mission requirement |
| **Enables** | Mobile app experience | Install to home screen |
| **Enables** | Reliable learning | Content available offline |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: PWA Foundation
- [ ] manifest.json created with app metadata
- [ ] Service Worker registered
- [ ] "Add to Home Screen" works on mobile
- [ ] App launches in standalone mode

### Phase 2: Basic Offline
- [ ] App shell cached (header, footer, CSS, JS)
- [ ] Offline fallback page displays
- [ ] Static pages work offline
- [ ] Cached API responses served offline

### Phase 3: Content Download
- [ ] User can download courses for offline
- [ ] Download progress indicator
- [ ] Storage usage displayed
- [ ] Downloaded content accessible offline

### Phase 4: Sync & Progress
- [ ] Progress stored in IndexedDB
- [ ] Background sync when online
- [ ] Conflict resolution strategy
- [ ] Sync status indicator

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 62 | 2025-12-18 | Scope file created |

---

*Last Updated: 2025-12-18 (Session 62)*
