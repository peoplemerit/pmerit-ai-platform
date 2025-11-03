# DatabaseHelper Usage Guide

> **Complete guide to using the DatabaseHelper class for PMERIT Assessment System**

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [API Reference](#api-reference)
  - [Session Operations](#session-operations)
  - [Results Operations](#results-operations)
  - [Analytics Operations](#analytics-operations)
  - [Utility Methods](#utility-methods)
- [Error Handling](#error-handling)
- [Validation Rules](#validation-rules)
- [Examples](#examples)

---

## Overview

The `DatabaseHelper` class provides a complete set of methods for managing assessment sessions, storing results, and querying analytics data in the PMERIT platform. It includes **11 core methods** that handle:

- ✅ Assessment session management (create, save, resume)
- ✅ Results storage and retrieval
- ✅ User history tracking
- ✅ Analytics and statistics
- ✅ Career search (placeholder for Issue #19)
- ✅ Database connectivity testing

### Key Features

- **Type-safe operations** with comprehensive validation
- **UUID-based identifiers** for sessions and results
- **JSONB storage** for complex data structures
- **Foreign key relationships** to users table
- **Automatic status tracking** (started → in_progress → completed)
- **Error handling** with descriptive messages

---

## Quick Start

### 1. Import and Initialize

```javascript
import DatabaseHelper from './functions/api/db/DatabaseHelper.js';

// In your Cloudflare Worker/Pages Function
export async function onRequest(context) {
  const { env } = context;
  
  // Initialize DatabaseHelper with Hyperdrive binding
  const db = new DatabaseHelper(env.DB);
  
  // Now you can use all 11 methods
}
```

### 2. Complete Assessment Flow Example

```javascript
// Step 1: Create a new assessment session
const sessionId = await db.createAssessmentSession({
  userId: 123, // or null for anonymous
  consentData: {
    privacy: true,
    data: true,
    terms: true
  }
});
console.log('Session created:', sessionId);

// Step 2: Save progress (auto-save every 5 questions)
await db.saveAssessmentProgress(sessionId, {
  currentQuestion: 10,
  answers: {
    'O1': 4, 'O2': 3, 'O3': 5, 'O4': 2, 'O5': 4,
    'C1': 3, 'C2': 4, 'C3': 5, 'C4': 3, 'C5': 4
  }
});

// Step 3: Resume later if needed
const resumed = await db.resumeAssessment(sessionId);
console.log('Resume from question:', resumed.currentQuestion);

// Step 4: Store final results
const resultId = await db.storeAssessmentResults({
  sessionId: sessionId,
  userId: 123,
  bigFive: {
    openness: { raw: 4.2, percentile: 85, label: 'Very High' },
    conscientiousness: { raw: 3.8, percentile: 70, label: 'High' },
    extraversion: { raw: 2.9, percentile: 45, label: 'Moderate' },
    agreeableness: { raw: 3.5, percentile: 60, label: 'High' },
    neuroticism: { raw: 2.2, percentile: 30, label: 'Low' }
  },
  hollandCode: 'IAE',
  careerMatches: [
    { career_id: 'c001', title: 'Data Scientist', fit_score: 95 }
  ]
});

// Step 5: Retrieve results
const results = await db.getAssessmentResults(resultId);
console.log('Holland Code:', results.hollandCode);
console.log('Big Five:', results.bigFive);
```

---

## Environment Setup

### Required Environment Variables

The DatabaseHelper requires a **Hyperdrive binding** to connect to Neon PostgreSQL.

#### wrangler.toml Configuration

```toml
# Add to your wrangler.toml
[[hyperdrive]]
binding = "DB"
id = "your-hyperdrive-id"
```

#### Cloudflare Pages Configuration

1. Go to your Pages project settings
2. Navigate to **Settings → Environment Variables**
3. Add binding:
   - **Binding name**: `DB`
   - **Type**: Hyperdrive
   - **Hyperdrive ID**: Your configured Hyperdrive connection

### Database Prerequisites

- **Neon PostgreSQL** database instance
- **Tables created** using `001_assessment_tables.sql` migration
- **`users` table** must exist with `id` column (for foreign keys)

---

## API Reference

### Session Operations

#### `createAssessmentSession(data)`

Creates a new assessment session and returns a UUID session identifier.

**Parameters:**
- `data.userId` (number|null): User ID or null for anonymous sessions
- `data.consentData` (Object): User consent object with privacy/data/terms flags

**Returns:** `Promise<string>` - Session UUID

**Example:**
```javascript
const sessionId = await db.createAssessmentSession({
  userId: null, // Anonymous user
  consentData: {
    privacy: true,
    data: true,
    terms: true,
    timestamp: new Date().toISOString()
  }
});
```

**Throws:**
- `Error` if consentData is missing or invalid
- `Error` if database operation fails

---

#### `saveAssessmentProgress(sessionId, data)`

Saves assessment progress (typically called every 5 questions for auto-save).

**Parameters:**
- `sessionId` (string): UUID of the assessment session
- `data.currentQuestion` (number): Current question index (0-119)
- `data.answers` (Object): Answers object mapping question IDs to values

**Returns:** `Promise<Object>` - Success confirmation with stats

**Example:**
```javascript
const result = await db.saveAssessmentProgress(sessionId, {
  currentQuestion: 25,
  answers: {
    'O1': 4, 'O2': 3, 'O3': 5, // ... up to 25 answers
  }
});

console.log(result);
// {
//   success: true,
//   saved: true,
//   currentQuestion: 25,
//   answerCount: 25
// }
```

**Throws:**
- `Error` if currentQuestion is not between 0-119
- `Error` if answers is not an object
- `Error` if sessionId doesn't exist

---

#### `resumeAssessment(sessionId)`

Resumes an in-progress assessment from saved state.

**Parameters:**
- `sessionId` (string): UUID of the assessment session

**Returns:** `Promise<Object>` - Session data with progress

**Example:**
```javascript
const session = await db.resumeAssessment(sessionId);

console.log(session);
// {
//   sessionId: 'uuid-here',
//   currentQuestion: 25,
//   answers: { O1: 4, O2: 3, ... },
//   status: 'in_progress',
//   startedAt: '2025-11-03T10:00:00Z',
//   updatedAt: '2025-11-03T10:15:00Z',
//   canResume: true
// }
```

**Throws:**
- `Error` if session not found
- `Error` if assessment already completed

---

#### `getSession(sessionId)`

Retrieves complete session data by UUID.

**Parameters:**
- `sessionId` (string): UUID of the assessment session

**Returns:** `Promise<Object|null>` - Session object or null if not found

**Example:**
```javascript
const session = await db.getSession(sessionId);
if (session) {
  console.log('Status:', session.status);
  console.log('Progress:', session.currentQuestion);
}
```

---

### Results Operations

#### `storeAssessmentResults(data)`

Stores completed assessment results with personality scores and career matches.

**Parameters:**
- `data.sessionId` (string): UUID of the assessment session
- `data.userId` (number|null): User ID or null
- `data.bigFive` (Object): Big Five personality scores (required structure)
- `data.hollandCode` (string): 3-letter RIASEC code (e.g., "IAE")
- `data.careerMatches` (Array): Array of career match objects

**Returns:** `Promise<string>` - Result UUID

**Example:**
```javascript
const resultId = await db.storeAssessmentResults({
  sessionId: sessionId,
  userId: 123,
  bigFive: {
    openness: { raw: 4.2, percentile: 85, label: 'Very High' },
    conscientiousness: { raw: 3.8, percentile: 70, label: 'High' },
    extraversion: { raw: 2.9, percentile: 45, label: 'Moderate' },
    agreeableness: { raw: 3.5, percentile: 60, label: 'High' },
    neuroticism: { raw: 2.2, percentile: 30, label: 'Low' }
  },
  hollandCode: 'IAE',
  careerMatches: [
    {
      career_id: 'c001',
      title: 'Data Scientist',
      fit_score: 95,
      onet_code: '15-2051.00',
      salary_median: 95000
    },
    {
      career_id: 'c002',
      title: 'Software Developer',
      fit_score: 92,
      onet_code: '15-1252.00',
      salary_median: 110000
    }
  ]
});
```

**Throws:**
- `Error` if sessionId is missing
- `Error` if Big Five data incomplete (must have all 5 traits)
- `Error` if Holland Code format invalid (must match `[RIASEC]{3}`)
- `Error` if careerMatches is not an array

**Side Effects:**
- Automatically marks the session as `completed`
- Updates session `updated_at` timestamp

---

#### `getAssessmentResults(resultId)`

Retrieves complete assessment results by result UUID.

**Parameters:**
- `resultId` (string): UUID of the assessment result

**Returns:** `Promise<Object>` - Complete results with user info

**Example:**
```javascript
const results = await db.getAssessmentResults(resultId);

console.log(results);
// {
//   resultId: 'uuid',
//   sessionId: 'session-uuid',
//   bigFive: { openness: {...}, ... },
//   hollandCode: 'IAE',
//   careerMatches: [...],
//   completedAt: '2025-11-03T11:00:00Z',
//   createdAt: '2025-11-03T11:00:00Z',
//   user: { email: 'user@example.com', name: 'John Doe' }
// }
```

**Throws:**
- `Error` if result not found

---

#### `getResultsBySession(sessionId)`

Retrieves assessment results by session UUID.

**Parameters:**
- `sessionId` (string): UUID of the assessment session

**Returns:** `Promise<Object|null>` - Results or null if not completed

**Example:**
```javascript
const results = await db.getResultsBySession(sessionId);
if (results) {
  console.log('Assessment completed:', results.completedAt);
} else {
  console.log('Assessment not yet completed');
}
```

---

### Analytics Operations

#### `getUserAssessmentHistory(userId, limit)`

Retrieves user's past assessment results.

**Parameters:**
- `userId` (number): User ID
- `limit` (number): Maximum results to return (default: 10)

**Returns:** `Promise<Array>` - Array of past assessment results

**Example:**
```javascript
const history = await db.getUserAssessmentHistory(123, 5);

history.forEach(result => {
  console.log(`Date: ${result.completedAt}`);
  console.log(`Holland Code: ${result.hollandCode}`);
  console.log(`Openness: ${result.bigFive.openness.percentile}%`);
});
```

**Throws:**
- `Error` if userId is not a number

---

#### `getAssessmentStats()`

Retrieves platform-wide assessment statistics.

**Parameters:** None

**Returns:** `Promise<Object>` - Statistics summary

**Example:**
```javascript
const stats = await db.getAssessmentStats();

console.log(stats);
// {
//   totalSessions: 1250,
//   completedSessions: 890,
//   inProgressSessions: 180,
//   uniqueUsers: 650,
//   totalResults: 890,
//   completionRate: 71
// }
```

---

#### `searchCareersByPersonality(bigFive, hollandCode, limit)`

Searches careers by personality fit (placeholder for Issue #19).

**Parameters:**
- `bigFive` (Object): Big Five personality scores
- `hollandCode` (string): Holland RIASEC code
- `limit` (number): Max results (default: 10)

**Returns:** `Promise<Array>` - Career matches

**Example:**
```javascript
const careers = await db.searchCareersByPersonality(
  bigFiveScores,
  'IAE',
  10
);
```

**Note:** This is a basic implementation. Full career matching algorithm will be implemented in Issue #19.

---

### Utility Methods

#### `testConnection()`

Tests database connectivity.

**Parameters:** None

**Returns:** `Promise<boolean>` - Connection status

**Example:**
```javascript
const connected = await db.testConnection();
if (!connected) {
  console.error('Database connection failed');
}
```

---

#### `getDatabaseInfo()`

Retrieves database version and configuration info.

**Parameters:** None

**Returns:** `Promise<Object>` - Database information

**Example:**
```javascript
const info = await db.getDatabaseInfo();

console.log(info);
// {
//   version: 'PostgreSQL 15.3...',
//   tableCount: 52,
//   connected: true
// }
```

---

## Error Handling

The DatabaseHelper throws descriptive errors for all validation and database issues.

### Common Error Patterns

```javascript
try {
  const sessionId = await db.createAssessmentSession({
    userId: 123,
    consentData: null // Invalid!
  });
} catch (error) {
  console.error('Error:', error.message);
  // Error: consentData is required and must be an object
}
```

### Recommended Error Handling

```javascript
async function createSession(userId, consent) {
  try {
    const db = new DatabaseHelper(env.DB);
    const sessionId = await db.createAssessmentSession({
      userId,
      consentData: consent
    });
    return { success: true, sessionId };
  } catch (error) {
    console.error('[createSession] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

---

## Validation Rules

### Session ID
- Must be a valid UUID string
- Automatically generated by database

### User ID
- Must be a positive integer or `null`
- Foreign key reference to `users.id`

### Current Question
- Must be between **0 and 119** (inclusive)
- Represents progress through 120-question assessment

### Big Five Traits
- Must include all 5 traits:
  - `openness`
  - `conscientiousness`
  - `extraversion`
  - `agreeableness`
  - `neuroticism`
- Each trait must have: `raw`, `percentile`, `label`

### Holland Code
- Must be exactly **3 letters**
- Letters must be from **RIASEC** (no repeats)
- Examples: `IAE`, `RSE`, `ASE`, `RIA`
- Invalid: `XYZ`, `III`, `IA`, `IAER`

### Status Values
- `started`: Session created, no progress
- `in_progress`: User has saved progress
- `completed`: Assessment finished
- `abandoned`: Session expired/abandoned

### Consent Data
- Must be a non-null object
- Typically includes: `privacy`, `data`, `terms` flags

---

## Examples

### Example 1: Anonymous Assessment

```javascript
// Create anonymous session
const sessionId = await db.createAssessmentSession({
  userId: null,
  consentData: { privacy: true, data: true, terms: true }
});

// Complete all 120 questions...
await db.saveAssessmentProgress(sessionId, {
  currentQuestion: 119,
  answers: { /* all 120 answers */ }
});

// Store results
await db.storeAssessmentResults({
  sessionId,
  userId: null,
  bigFive: { /* scores */ },
  hollandCode: 'IAE',
  careerMatches: []
});
```

### Example 2: Authenticated User

```javascript
// Create session for logged-in user
const sessionId = await db.createAssessmentSession({
  userId: 123,
  consentData: { privacy: true, data: true, terms: true }
});

// Later: get user's history
const history = await db.getUserAssessmentHistory(123);
console.log(`User has completed ${history.length} assessments`);
```

### Example 3: Resume Incomplete Assessment

```javascript
// User returns after leaving mid-assessment
try {
  const session = await db.resumeAssessment(sessionId);
  
  // Continue from where they left off
  console.log(`Resume from question ${session.currentQuestion}`);
  console.log(`Already answered: ${Object.keys(session.answers).length}`);
  
} catch (error) {
  if (error.message.includes('already completed')) {
    // Show results instead
    const results = await db.getResultsBySession(sessionId);
    console.log('Assessment already completed!');
  }
}
```

### Example 4: Analytics Dashboard

```javascript
// Get platform statistics
const stats = await db.getAssessmentStats();

// Display on dashboard
const html = `
  <div class="stats">
    <h2>Platform Analytics</h2>
    <p>Total Sessions: ${stats.totalSessions}</p>
    <p>Completed: ${stats.completedSessions}</p>
    <p>Completion Rate: ${stats.completionRate}%</p>
    <p>Unique Users: ${stats.uniqueUsers}</p>
  </div>
`;
```

### Example 5: Worker Function Integration

```javascript
// functions/api/assessment/create-session.js
import DatabaseHelper from '../../db/DatabaseHelper.js';

export async function onRequestPost(context) {
  const { env, request } = context;
  const db = new DatabaseHelper(env.DB);
  
  try {
    const body = await request.json();
    
    const sessionId = await db.createAssessmentSession({
      userId: body.userId || null,
      consentData: body.consent
    });
    
    return new Response(JSON.stringify({
      success: true,
      sessionId
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

---

## Testing

Run the comprehensive test suite:

```bash
# Using Wrangler
wrangler pages dev --local

# Then visit:
http://localhost:8788/api/v1/db/test
```

The test suite validates all 11 methods with:
- ✅ Connection tests
- ✅ Session CRUD operations
- ✅ Progress tracking
- ✅ Results storage
- ✅ User history
- ✅ Analytics
- ✅ Validation rules
- ✅ Edge cases

---

## Summary

The DatabaseHelper provides a complete, production-ready interface for assessment data management:

| Method | Purpose | Returns |
|--------|---------|---------|
| `createAssessmentSession` | Start new assessment | session_id (UUID) |
| `saveAssessmentProgress` | Auto-save progress | Success confirmation |
| `resumeAssessment` | Resume in-progress | Session data |
| `getSession` | Get session details | Session object |
| `storeAssessmentResults` | Store final results | result_id (UUID) |
| `getAssessmentResults` | Get results by result_id | Results object |
| `getResultsBySession` | Get results by session_id | Results object |
| `getUserAssessmentHistory` | Get user's past results | Array of results |
| `getAssessmentStats` | Platform analytics | Statistics object |
| `searchCareersByPersonality` | Career matching | Array of careers |
| `testConnection` | Test DB connection | Boolean |
| `getDatabaseInfo` | DB version info | Info object |

**Total: 11 methods covering all assessment data needs**

---

## Support

For issues, questions, or contributions:
- Reference: Issue #18 - Database Integration & Schema Verification
- Documentation: `/docs/DATABASEHELPER_USAGE.md`
- Schema: `/functions/api/db/migrations/001_assessment_tables.sql`
- Tests: `/functions/api/v1/db/test.js`

---

*Last Updated: November 3, 2025*
