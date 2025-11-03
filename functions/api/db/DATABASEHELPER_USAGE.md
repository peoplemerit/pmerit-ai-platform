# DatabaseHelper Usage Guide

**Version:** 1.0.0  
**Created:** November 2, 2025  
**Issue:** #18 - Database Integration & Schema Verification (Day 3)

---

## 📋 Overview

The `DatabaseHelper` class provides a clean, type-safe interface for all assessment-related database operations. It wraps Cloudflare Hyperdrive (Neon PostgreSQL) with:

- ✅ Comprehensive CRUD operations
- ✅ Input validation
- ✅ Error handling
- ✅ Detailed logging
- ✅ Promise-based async/await
- ✅ Session management
- ✅ Progress tracking
- ✅ Results storage

---

## 🚀 Quick Start

### Initialize DatabaseHelper

```javascript
import DatabaseHelper from './db/DatabaseHelper.js';

// In Cloudflare Workers handler
export async function onRequest(context) {
  const { env } = context;
  
  // Create DatabaseHelper instance with Hyperdrive binding
  const db = new DatabaseHelper(env.DB);
  
  // Now you can use all database methods
  const stats = await db.getAssessmentStats();
  
  return new Response(JSON.stringify(stats));
}
```

---

## 📖 Complete API Reference

### Session Operations

#### 1. Create Assessment Session

**Method:** `createAssessmentSession(data)`

**Purpose:** Start a new assessment session (with or without user)

**Parameters:**
```javascript
{
  userId: number | null,      // User ID or null for anonymous
  consentData: {              // Required consent object
    privacy: boolean,
    data: boolean,
    terms: boolean
  }
}
```

**Returns:** `Promise<string>` - Session UUID

**Example:**
```javascript
// Anonymous user
const sessionId = await db.createAssessmentSession({
  userId: null,
  consentData: {
    privacy: true,
    data: true,
    terms: true
  }
});

// Authenticated user
const sessionId = await db.createAssessmentSession({
  userId: 123,
  consentData: {
    privacy: true,
    data: true,
    terms: true
  }
});
```

**Response:**
```javascript
"550e8400-e29b-41d4-a716-446655440000"
```

---

#### 2. Save Assessment Progress

**Method:** `saveAssessmentProgress(sessionId, data)`

**Purpose:** Auto-save progress every 5 questions

**Parameters:**
```javascript
sessionId: string,           // Session UUID
data: {
  currentQuestion: number,   // 0-119
  answers: {                 // Question ID → Answer value
    "O1": 4,
    "O2": 3,
    ...
  }
}
```

**Returns:** `Promise<Object>` - Confirmation

**Example:**
```javascript
// After answering questions 1-5
const result = await db.saveAssessmentProgress(sessionId, {
  currentQuestion: 5,
  answers: {
    'O1': 4,  // Openness question 1: Answer 4 (Agree)
    'O2': 3,  // Openness question 2: Answer 3 (Neutral)
    'O3': 5,  // Openness question 3: Answer 5 (Strongly Agree)
    'O4': 2,  // Openness question 4: Answer 2 (Disagree)
    'O5': 4   // Openness question 5: Answer 4 (Agree)
  }
});

console.log(result);
// {
//   success: true,
//   saved: true,
//   currentQuestion: 5,
//   answerCount: 5
// }
```

---

#### 3. Resume Assessment

**Method:** `resumeAssessment(sessionId)`

**Purpose:** Continue from saved progress

**Parameters:**
```javascript
sessionId: string  // Session UUID
```

**Returns:** `Promise<Object>` - Session data

**Example:**
```javascript
const session = await db.resumeAssessment(sessionId);

console.log(session);
// {
//   sessionId: "550e8400-...",
//   currentQuestion: 10,
//   answers: { O1: 4, O2: 3, ... },
//   status: "in_progress",
//   startedAt: "2025-11-02T...",
//   updatedAt: "2025-11-02T...",
//   canResume: true
// }
```

**Error Handling:**
```javascript
try {
  const session = await db.resumeAssessment(sessionId);
} catch (error) {
  if (error.message.includes('already completed')) {
    // Redirect to results page
  } else if (error.message.includes('not found')) {
    // Session doesn't exist
  }
}
```

---

#### 4. Get Session Details

**Method:** `getSession(sessionId)`

**Purpose:** Retrieve full session data

**Parameters:**
```javascript
sessionId: string  // Session UUID
```

**Returns:** `Promise<Object | null>` - Session data or null

**Example:**
```javascript
const session = await db.getSession(sessionId);

if (session) {
  console.log('Status:', session.status);
  console.log('Progress:', session.currentQuestion, '/ 120');
  console.log('Answers:', Object.keys(session.answers).length);
}
```

---

### Results Operations

#### 5. Store Assessment Results

**Method:** `storeAssessmentResults(data)`

**Purpose:** Save completed assessment with scores and career matches

**Parameters:**
```javascript
{
  sessionId: string,           // Session UUID
  userId: number | null,       // User ID or null
  bigFive: {                   // Big Five personality scores
    openness: {
      raw: number,             // Raw score (1-5)
      percentile: number,      // Percentile rank (0-100)
      label: string            // Description
    },
    conscientiousness: { ... },
    extraversion: { ... },
    agreeableness: { ... },
    neuroticism: { ... }
  },
  hollandCode: string,         // 3-letter RIASEC code (e.g., "IAE")
  careerMatches: [             // Top career matches
    {
      career_id: string,
      title: string,
      fit_score: number,       // 0-100
      onet_code: string,
      salary_median: number
    }
  ]
}
```

**Returns:** `Promise<string>` - Result UUID

**Example:**
```javascript
const resultId = await db.storeAssessmentResults({
  sessionId: sessionId,
  userId: 123,
  bigFive: {
    openness: {
      raw: 4.2,
      percentile: 85,
      label: 'Very High'
    },
    conscientiousness: {
      raw: 3.8,
      percentile: 70,
      label: 'High'
    },
    extraversion: {
      raw: 2.9,
      percentile: 45,
      label: 'Moderate'
    },
    agreeableness: {
      raw: 3.5,
      percentile: 60,
      label: 'High'
    },
    neuroticism: {
      raw: 2.2,
      percentile: 30,
      label: 'Low'
    }
  },
  hollandCode: 'IAE',
  careerMatches: [
    {
      career_id: 'c001',
      title: 'Data Scientist',
      fit_score: 95,
      onet_code: '15-2051.00',
      salary_median: 95000,
      growth_outlook: 'Much faster than average'
    },
    {
      career_id: 'c002',
      title: 'Software Developer',
      fit_score: 92,
      onet_code: '15-1252.00',
      salary_median: 110000,
      growth_outlook: 'Faster than average'
    }
  ]
});

console.log('Result ID:', resultId);
// "7c9e6679-7425-40de-944b-e07fc1f90ae7"
```

**Validation:**
- Big Five must include all 5 traits
- Holland Code must be 3 letters from RIASEC
- Career matches must be an array
- Session will be marked as "completed"

---

#### 6. Get Assessment Results

**Method:** `getAssessmentResults(resultId)`

**Purpose:** Retrieve complete assessment results

**Parameters:**
```javascript
resultId: string  // Result UUID
```

**Returns:** `Promise<Object>` - Complete results

**Example:**
```javascript
const results = await db.getAssessmentResults(resultId);

console.log('Holland Code:', results.hollandCode);
console.log('Openness:', results.bigFive.openness.percentile, 'percentile');
console.log('Top Career:', results.careerMatches[0].title);
console.log('Completed:', results.completedAt);
```

**Response Structure:**
```javascript
{
  resultId: "7c9e6679-...",
  sessionId: "550e8400-...",
  bigFive: {
    openness: { raw: 4.2, percentile: 85, label: "Very High" },
    conscientiousness: { ... },
    extraversion: { ... },
    agreeableness: { ... },
    neuroticism: { ... }
  },
  hollandCode: "IAE",
  careerMatches: [
    {
      career_id: "c001",
      title: "Data Scientist",
      fit_score: 95,
      onet_code: "15-2051.00",
      salary_median: 95000
    }
  ],
  completedAt: "2025-11-02T14:30:00Z",
  createdAt: "2025-11-02T14:30:00Z",
  user: {
    email: "user@example.com",
    name: "John Doe"
  } // null for anonymous
}
```

---

#### 7. Get Results by Session

**Method:** `getResultsBySession(sessionId)`

**Purpose:** Get results using session ID instead of result ID

**Parameters:**
```javascript
sessionId: string  // Session UUID
```

**Returns:** `Promise<Object | null>` - Results or null if not completed

**Example:**
```javascript
const results = await db.getResultsBySession(sessionId);

if (results) {
  console.log('Assessment completed!');
  console.log('Result ID:', results.resultId);
} else {
  console.log('Assessment not completed yet');
}
```

---

### User History & Analytics

#### 8. Get User Assessment History

**Method:** `getUserAssessmentHistory(userId, limit)`

**Purpose:** Retrieve user's past assessments

**Parameters:**
```javascript
userId: number,    // User ID
limit: number      // Max results (default: 10)
```

**Returns:** `Promise<Array>` - Past assessments

**Example:**
```javascript
const history = await db.getUserAssessmentHistory(123, 5);

history.forEach(result => {
  console.log(`Completed: ${result.completedAt}`);
  console.log(`Holland Code: ${result.hollandCode}`);
  console.log(`Openness: ${result.bigFive.openness.percentile}%`);
  console.log('---');
});
```

---

#### 9. Get Assessment Statistics

**Method:** `getAssessmentStats()`

**Purpose:** Get platform-wide statistics

**Parameters:** None

**Returns:** `Promise<Object>` - Statistics

**Example:**
```javascript
const stats = await db.getAssessmentStats();

console.log('Total Sessions:', stats.totalSessions);
console.log('Completed:', stats.completedSessions);
console.log('In Progress:', stats.inProgressSessions);
console.log('Unique Users:', stats.uniqueUsers);
console.log('Completion Rate:', stats.completionRate + '%');
```

**Response:**
```javascript
{
  totalSessions: 1523,
  completedSessions: 1247,
  inProgressSessions: 276,
  uniqueUsers: 892,
  totalResults: 1247,
  completionRate: 82  // percentage
}
```

---

### Utility Methods

#### 10. Test Connection

**Method:** `testConnection()`

**Purpose:** Verify database connectivity

**Example:**
```javascript
const isConnected = await db.testConnection();
console.log('Connected:', isConnected);
```

---

#### 11. Get Database Info

**Method:** `getDatabaseInfo()`

**Purpose:** Get database version and metadata

**Example:**
```javascript
const info = await db.getDatabaseInfo();
console.log('Version:', info.version);
console.log('Tables:', info.tableCount);
console.log('Connected:', info.connected);
```

---

## 🎯 Complete Usage Example

### Assessment Flow (Start to Finish)

```javascript
import DatabaseHelper from './db/DatabaseHelper.js';

/**
 * Complete assessment flow example
 */
export async function handleAssessmentFlow(env) {
  const db = new DatabaseHelper(env.DB);

  // 1. Start assessment
  console.log('Step 1: Creating session...');
  const sessionId = await db.createAssessmentSession({
    userId: null,
    consentData: {
      privacy: true,
      data: true,
      terms: true
    }
  });
  console.log('Session ID:', sessionId);

  // 2. Answer questions 1-5
  console.log('\nStep 2: Answering questions 1-5...');
  await db.saveAssessmentProgress(sessionId, {
    currentQuestion: 5,
    answers: {
      'O1': 4, 'O2': 3, 'O3': 5, 'O4': 2, 'O5': 4
    }
  });
  console.log('Progress saved: 5/120 questions');

  // 3. User closes browser
  console.log('\n[User closes browser]');

  // 4. User returns and resumes
  console.log('\nStep 3: Resuming assessment...');
  const resumed = await db.resumeAssessment(sessionId);
  console.log('Resumed at question:', resumed.currentQuestion);
  console.log('Previous answers:', Object.keys(resumed.answers).length);

  // 5. Continue answering (simulate completing all 120)
  console.log('\nStep 4: Completing assessment...');
  await db.saveAssessmentProgress(sessionId, {
    currentQuestion: 119,
    answers: { /* all 120 answers */ }
  });

  // 6. Submit and calculate scores
  console.log('\nStep 5: Calculating scores...');
  const resultId = await db.storeAssessmentResults({
    sessionId,
    userId: null,
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
  console.log('Result ID:', resultId);

  // 7. Retrieve and display results
  console.log('\nStep 6: Retrieving results...');
  const results = await db.getAssessmentResults(resultId);
  console.log('Holland Code:', results.hollandCode);
  console.log('Top Career:', results.careerMatches[0].title);
  console.log('Fit Score:', results.careerMatches[0].fit_score + '%');

  // 8. Get platform stats
  console.log('\nStep 7: Platform statistics...');
  const stats = await db.getAssessmentStats();
  console.log('Completion Rate:', stats.completionRate + '%');

  return results;
}
```

---

## 🚨 Error Handling

### Best Practices

```javascript
async function safeAssessmentOperation(db) {
  try {
    const sessionId = await db.createAssessmentSession({
      userId: null,
      consentData: { privacy: true, data: true, terms: true }
    });
    
    return { success: true, sessionId };
    
  } catch (error) {
    console.error('Assessment operation failed:', error);
    
    // Categorize errors
    if (error.message.includes('consentData')) {
      return { success: false, error: 'Invalid consent data' };
    } else if (error.message.includes('connection')) {
      return { success: false, error: 'Database connection failed' };
    } else {
      return { success: false, error: 'Unknown error occurred' };
    }
  }
}
```

---

## 📊 Integration with API Endpoints

### Example: Assessment Start Endpoint

```javascript
// /functions/api/v1/assessment/start.js
import DatabaseHelper from '../../../db/DatabaseHelper.js';

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
      sessionId,
      message: 'Assessment session started'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
```

---

## ✅ Testing

### Run Tests

```bash
# Via API endpoint (after deployment)
curl https://pmerit.com/api/v1/db/test

# Expected output:
# {
#   "success": true,
#   "passed": 25,
#   "failed": 0,
#   "tests": [...]
# }
```

---

## 📚 Next Steps

1. **Deploy DatabaseHelper** to Cloudflare Workers
2. **Run test suite** to verify all operations
3. **Integrate with API endpoints** (Issue #17)
4. **Add career matching** (Issue #19)

---

**Documentation Version:** 1.0  
**Last Updated:** November 2, 2025  
**Status:** Complete & Ready for Use
