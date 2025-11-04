# Assessment API Endpoints - Documentation

## Overview

This document describes the 5 RESTful API endpoints for the PMERIT assessment system. These endpoints enable the complete assessment workflow from starting a new session through retrieving final results.

## Base URL

```
Production: https://pmerit.com/api/v1/assessment
Development: http://localhost:8080/api/v1/assessment
```

## Authentication

All endpoints support both authenticated and anonymous users. Authentication is optional for public assessments.

## CORS

All endpoints include CORS headers to support cross-origin requests:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

---

## Endpoints

### 1. Start Assessment

**Endpoint:** `POST /api/v1/assessment/start`

**Description:** Initialize a new assessment session with user consent.

**Request Body:**
```json
{
  "userId": 123,  // Optional: User ID (null for anonymous)
  "consent": {
    "privacy": true,
    "data": true,
    "terms": true
  }
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Assessment session started",
  "resumable": false,
  "startedAt": "2025-11-03T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "All consent fields are required (privacy, data, terms)"
}
```

**Example:**
```javascript
const response = await fetch('/api/v1/assessment/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: null,
    consent: {
      privacy: true,
      data: true,
      terms: true
    }
  })
});

const data = await response.json();
console.log('Session ID:', data.sessionId);
```

---

### 2. Save Progress

**Endpoint:** `POST /api/v1/assessment/save`

**Description:** Auto-save assessment progress. Typically called every 5 questions.

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "currentQuestion": 10,
  "answers": {
    "O1_1": 4,
    "O1_2": 3,
    "O1_3": 5,
    "O1_4": 4,
    "O2_1": 2,
    "C1_1": 3,
    "C1_2": 4,
    "C1_3": 5,
    "C1_4": 3,
    "C2_1": 4
  }
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "saved": true,
  "currentQuestion": 10,
  "answerCount": 10,
  "message": "Progress saved",
  "updatedAt": "2025-11-03T10:35:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "sessionId is required"
}
```

**Example:**
```javascript
// Auto-save every 5 questions
if (questionNumber % 5 === 0) {
  await fetch('/api/v1/assessment/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: currentSessionId,
      currentQuestion: questionNumber,
      answers: allAnswers
    })
  });
}
```

---

### 3. Submit Assessment

**Endpoint:** `POST /api/v1/assessment/submit`

**Description:** Submit completed assessment for processing. Calculates Big Five scores, Holland Code, and generates career recommendations.

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "answers": {
    "O1_1": 4, "O1_2": 3, "O1_3": 5, ... // All 120 answers
  }
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "resultId": "660f8500-e29b-41d4-a716-446655440001",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Assessment completed successfully",
  "completedAt": "2025-11-03T10:45:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Expected 120 answers, got 115"
}
```

**Notes:**
- Must provide exactly 120 answers
- Returns `resultId` - use this to fetch full results
- Processing time: typically < 2 seconds

**Example:**
```javascript
const response = await fetch('/api/v1/assessment/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: currentSessionId,
    answers: all120Answers
  })
});

const { resultId } = await response.json();

// Fetch full results
const resultsResponse = await fetch(`/api/v1/assessment/results/${resultId}`);
const results = await resultsResponse.json();
```

---

### 4. Get Results

**Endpoint:** `GET /api/v1/assessment/results/:resultId`

**Description:** Retrieve completed assessment results including Big Five scores, Holland Code, and career recommendations.

**URL Parameter:**
- `resultId` - UUID of the assessment result

**Success Response (200 OK):**
```json
{
  "success": true,
  "result": {
    "resultId": "660f8500-e29b-41d4-a716-446655440001",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "bigFive": {
      "openness": {
        "raw": 4.2,
        "percentile": 85,
        "label": "Very High"
      },
      "conscientiousness": {
        "raw": 3.8,
        "percentile": 70,
        "label": "High"
      },
      "extraversion": {
        "raw": 2.9,
        "percentile": 45,
        "label": "Moderate"
      },
      "agreeableness": {
        "raw": 3.5,
        "percentile": 60,
        "label": "High"
      },
      "neuroticism": {
        "raw": 2.2,
        "percentile": 30,
        "label": "Low"
      }
    },
    "hollandCode": "IAE",
    "careerMatches": [
      {
        "rank": 1,
        "career_id": "c001",
        "title": "Data Scientist",
        "fit_score": 95,
        "rationale": "Your high Openness and Investigative interests...",
        "salary": {
          "median": 98000,
          "range": "$60,000-$150,000"
        },
        "growth_outlook": "Much faster than average",
        "education_required": "Bachelor's degree"
      }
      // ... 9 more careers
    ],
    "completedAt": "2025-11-03T10:45:00Z",
    "user": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Results not found"
}
```

**Example:**
```javascript
const response = await fetch(`/api/v1/assessment/results/${resultId}`);
const { result } = await response.json();

console.log('Big Five Openness:', result.bigFive.openness);
console.log('Holland Code:', result.hollandCode);
console.log('Top Career:', result.careerMatches[0].title);
```

---

### 5. Resume Assessment

**Endpoint:** `GET /api/v1/assessment/resume/:sessionId`

**Description:** Resume an incomplete assessment from saved progress.

**URL Parameter:**
- `sessionId` - UUID of the assessment session

**Success Response (200 OK):**
```json
{
  "success": true,
  "session": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "currentQuestion": 45,
    "answers": {
      "O1_1": 4, "O1_2": 3, ... // 45 saved answers
    },
    "status": "in_progress",
    "startedAt": "2025-11-03T10:30:00Z",
    "updatedAt": "2025-11-03T10:40:00Z",
    "canResume": true
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Assessment already completed",
  "canResume": false
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Session not found"
}
```

**Example:**
```javascript
const response = await fetch(`/api/v1/assessment/resume/${sessionId}`);
const { session } = await response.json();

if (session.canResume) {
  // Continue from question
  startAssessmentFromQuestion(session.currentQuestion, session.answers);
}
```

---

## Complete Workflow Example

```javascript
// 1. Start assessment
const startResponse = await fetch('/api/v1/assessment/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: null,
    consent: { privacy: true, data: true, terms: true }
  })
});
const { sessionId } = await startResponse.json();

// 2. Answer questions and auto-save
const answers = {};
for (let i = 1; i <= 120; i++) {
  // Get user answer for question i
  answers[getQuestionId(i)] = getUserAnswer();
  
  // Auto-save every 5 questions
  if (i % 5 === 0) {
    await fetch('/api/v1/assessment/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        currentQuestion: i,
        answers
      })
    });
  }
}

// 3. Submit completed assessment
const submitResponse = await fetch('/api/v1/assessment/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId,
    answers
  })
});
const { resultId } = await submitResponse.json();

// 4. Get full results
const resultsResponse = await fetch(`/api/v1/assessment/results/${resultId}`);
const { result } = await resultsResponse.json();

// Display results to user
displayBigFive(result.bigFive);
displayHollandCode(result.hollandCode);
displayCareerMatches(result.careerMatches);
```

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created (start endpoint)
- `204 No Content` - OPTIONS preflight
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Performance

**Target Response Times:**
- Start endpoint: < 200ms
- Save endpoint: < 200ms
- Submit endpoint: < 2000ms (includes career matching)
- Results endpoint: < 100ms
- Resume endpoint: < 200ms

---

## Data Models

### Big Five Trait Score
```typescript
{
  raw: number,        // 1.0 - 5.0
  percentile: number, // 0 - 100
  label: string       // "Very Low", "Low", "Moderate", "High", "Very High"
}
```

### Holland Code
- 3-letter code using RIASEC letters
- Example: "IAE" (Investigative, Artistic, Enterprising)
- Letters represent: R=Realistic, I=Investigative, A=Artistic, S=Social, E=Enterprising, C=Conventional

### Career Match
```typescript
{
  rank: number,
  career_id: string,
  title: string,
  fit_score: number,        // 0-100
  rationale: string,
  salary: {
    median: number,
    range: string
  },
  growth_outlook: string,
  education_required: string
}
```

---

## Dependencies

These endpoints integrate with:
- **DatabaseHelper** (Issue #18) - Database operations
- **CareerMatchingService** (Issue #19) - Career recommendations
- **BigFiveScoring** - IPIP-NEO-120 scoring algorithm
- **HollandCodeCalculator** - RIASEC calculation

---

## Security

- All endpoints sanitize error messages to avoid exposing internal details
- UUIDs used for session and result IDs (not sequential)
- No sensitive data in error responses
- CORS configured for cross-origin requests
- Generic error messages in production

---

## Testing

Run the test suite:
```bash
cd functions/api/tests
node -e "import('./assessment-endpoints.test.js').then(m => m.runTests())"
```

Expected output: All tests passing (4/4)

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/peoplemerit/pmerit-ai-platform/issues
- Email: support@pmerit.com

---

## Version History

- **1.0.0** (November 4, 2025) - Initial release
  - All 5 endpoints implemented
  - Big Five scoring algorithm
  - Holland Code calculation
  - Comprehensive tests
  - Security review completed
