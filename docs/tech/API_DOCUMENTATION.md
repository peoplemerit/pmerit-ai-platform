# PMERIT API Documentation

**Base URL:** `https://pmerit.com`  
**API Version:** 1.0  
**Protocol:** HTTPS only  
**Last Updated:** November 2025

---

## 📋 Overview

The PMERIT API provides endpoints for career assessment, AI chat, text-to-speech, and database operations. All endpoints are serverless functions deployed on Cloudflare's global edge network for low latency worldwide.

### Key Features

- ✅ **No authentication required** (current version) - Public access for assessments
- ✅ **RESTful design** - Standard HTTP methods and status codes
- ✅ **JSON responses** - All responses in JSON format
- ✅ **CORS enabled** - Cross-origin requests supported
- ✅ **Edge deployment** - Low latency from anywhere
- ✅ **Auto-scaling** - Handles traffic spikes automatically

### Base URL Structure

```
Production:  https://pmerit.com/api/{endpoint}
Development: http://localhost:8080/api/{endpoint}
```

---

## 🔐 Authentication

### Current Version (1.0)

**No authentication required.** All endpoints are publicly accessible.

### Future Versions (1.1+)

Authentication will be implemented using JWT tokens:

```http
Authorization: Bearer <token>
```

**Planned features:**
- User registration and login
- API key for developers
- Rate limiting per user/API key
- Protected endpoints for user-specific data

---

## 🌐 Core Endpoints

### Health Check

Check if the API is operational.

**Endpoint:** `GET /api/health`

**Request:**

```bash
curl https://pmerit.com/api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-09T12:34:56Z",
  "version": "1.0.0",
  "region": "auto"
}
```

**Status Codes:**
- `200 OK` - API is operational
- `500 Internal Server Error` - API is experiencing issues

---

## 🗄️ Database Endpoints

### Database Health Check

Check if database connection is operational.

**Endpoint:** `GET /api/v1/db/health`

**Request:**

```bash
curl https://pmerit.com/api/v1/db/health
```

**Response (Success):**

```json
{
  "status": "healthy",
  "connected": true,
  "timestamp": "2025-11-09T12:34:56Z",
  "responseTime": 45
}
```

**Response (Error):**

```json
{
  "status": "unhealthy",
  "connected": false,
  "error": "Connection timeout",
  "timestamp": "2025-11-09T12:34:56Z"
}
```

**Status Codes:**
- `200 OK` - Database is healthy
- `503 Service Unavailable` - Database connection failed

---

### Database Status

Get detailed database connection information.

**Endpoint:** `GET /api/v1/db/status`

**Request:**

```bash
curl https://pmerit.com/api/v1/db/status
```

**Response:**

```json
{
  "connected": true,
  "version": "PostgreSQL 15.3",
  "database": "pmerit_prod",
  "poolSize": 10,
  "activeConnections": 3,
  "idleConnections": 7,
  "hyperdrive": {
    "enabled": true,
    "region": "auto"
  },
  "latency": {
    "p50": 25,
    "p95": 45,
    "p99": 80
  }
}
```

**Status Codes:**
- `200 OK` - Status retrieved successfully
- `500 Internal Server Error` - Unable to retrieve status

---

### List Tables

List all tables in the database.

**Endpoint:** `GET /api/v1/db/tables`

**Request:**

```bash
curl https://pmerit.com/api/v1/db/tables
```

**Response:**

```json
{
  "tables": [
    {
      "name": "users",
      "rowCount": 1523,
      "sizeBytes": 524288
    },
    {
      "name": "assessment_sessions",
      "rowCount": 3402,
      "sizeBytes": 2097152
    },
    {
      "name": "assessment_results",
      "rowCount": 2847,
      "sizeBytes": 4194304
    },
    {
      "name": "careers",
      "rowCount": 96,
      "sizeBytes": 1048576
    }
  ],
  "totalTables": 4,
  "timestamp": "2025-11-09T12:34:56Z"
}
```

**Status Codes:**
- `200 OK` - Tables retrieved successfully
- `500 Internal Server Error` - Database query failed

---

## 📝 Assessment Endpoints

### Start Assessment

Create a new assessment session.

**Endpoint:** `POST /api/v1/assessment/start`

**Request Body:**

```json
{
  "userId": null,
  "consent": {
    "privacy": true,
    "data": true,
    "terms": true
  }
}
```

**Parameters:**
- `userId` (number | null) - User ID if authenticated, null for anonymous
- `consent` (object) - Required consent acknowledgments
  - `privacy` (boolean) - Privacy policy accepted
  - `data` (boolean) - Data collection consented
  - `terms` (boolean) - Terms of service accepted

**Request Example:**

```bash
curl -X POST https://pmerit.com/api/v1/assessment/start \
  -H "Content-Type: application/json" \
  -d '{
    "userId": null,
    "consent": {
      "privacy": true,
      "data": true,
      "terms": true
    }
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Assessment session started",
  "resumable": false,
  "startedAt": "2025-11-09T12:34:56Z"
}
```

**Response (Error - Missing Consent):**

```json
{
  "success": false,
  "error": "All consent fields are required (privacy, data, terms)"
}
```

**Status Codes:**
- `201 Created` - Session created successfully
- `400 Bad Request` - Invalid request body or missing consent
- `500 Internal Server Error` - Server error creating session

---

### Save Assessment Progress

Save user progress (auto-save functionality).

**Endpoint:** `POST /api/v1/assessment/save`

**Request Body:**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "currentQuestion": 10,
  "answers": {
    "O1_1": 4,
    "O1_2": 3,
    "O1_3": 5,
    "O1_4": 2,
    "O2_1": 4,
    "O2_2": 3,
    "O2_3": 5,
    "O2_4": 4,
    "O3_1": 3,
    "O3_2": 4
  }
}
```

**Parameters:**
- `sessionId` (string) - UUID of the session
- `currentQuestion` (number) - Current question number (0-119)
- `answers` (object) - Map of question IDs to answers (1-5)

**Request Example:**

```bash
curl -X POST https://pmerit.com/api/v1/assessment/save \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "currentQuestion": 10,
    "answers": {
      "O1_1": 4,
      "O1_2": 3
    }
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "saved": true,
  "currentQuestion": 10,
  "answerCount": 10,
  "updatedAt": "2025-11-09T12:35:30Z"
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Session not found"
}
```

**Status Codes:**
- `200 OK` - Progress saved successfully
- `400 Bad Request` - Invalid session ID or data
- `404 Not Found` - Session not found
- `500 Internal Server Error` - Error saving progress

---

### Submit Assessment

Submit completed assessment and get results.

**Endpoint:** `POST /api/v1/assessment/submit`

**Request Body:**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "answers": {
    "O1_1": 4,
    "O1_2": 3,
    "O1_3": 5,
    "O1_4": 2,
    ...
    "N6_4": 3
  }
}
```

**Parameters:**
- `sessionId` (string) - UUID of the session
- `answers` (object) - Complete map of all 120 question IDs to answers (1-5)

**Request Example:**

```bash
curl -X POST https://pmerit.com/api/v1/assessment/submit \
  -H "Content-Type: application/json" \
  -d @complete-answers.json
```

**Response (Success):**

```json
{
  "success": true,
  "resultId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
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
      "label": "Low (Emotionally Stable)"
    }
  },
  "hollandCode": "IAE",
  "careerMatches": [
    {
      "careerId": "c001",
      "title": "Data Scientist",
      "fitScore": 95,
      "onetCode": "15-2051.00",
      "salaryMedian": 95000,
      "salaryRange": {
        "min": 60000,
        "max": 150000
      },
      "growthOutlook": "Much faster than average",
      "requiredEducation": "Bachelor's degree",
      "topSkills": [
        "Python",
        "Machine Learning",
        "Statistics",
        "Data Visualization"
      ],
      "workEnvironment": "Office, remote-friendly",
      "rationale": "Your high openness and analytical thinking align perfectly with data science careers. Your conscientiousness suggests you'll excel at detailed analysis."
    }
    // ... 9 more career matches
  ],
  "completedAt": "2025-11-09T12:40:15Z",
  "processingTime": 2.5
}
```

**Response (Error - Incomplete):**

```json
{
  "success": false,
  "error": "Expected 120 answers, got 95"
}
```

**Response (Error - Already Completed):**

```json
{
  "success": false,
  "error": "Assessment already completed"
}
```

**Status Codes:**
- `200 OK` - Assessment processed successfully
- `400 Bad Request` - Invalid data (wrong number of answers, etc.)
- `404 Not Found` - Session not found
- `500 Internal Server Error` - Error processing assessment

---

### Get Assessment Results

Retrieve previously completed assessment results.

**Endpoint:** `GET /api/v1/assessment/results/:resultId`

**URL Parameters:**
- `resultId` (string) - UUID of the result

**Request Example:**

```bash
curl https://pmerit.com/api/v1/assessment/results/7c9e6679-7425-40de-944b-e07fc1f90ae7
```

**Response (Success):**

```json
{
  "success": true,
  "resultId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "bigFive": {
    "openness": {
      "raw": 4.2,
      "percentile": 85,
      "label": "Very High"
    },
    ...
  },
  "hollandCode": "IAE",
  "careerMatches": [ ... ],
  "completedAt": "2025-11-09T12:40:15Z",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Note:** `user` field is null for anonymous assessments.

**Response (Error):**

```json
{
  "success": false,
  "error": "Result not found"
}
```

**Status Codes:**
- `200 OK` - Results retrieved successfully
- `404 Not Found` - Result ID not found
- `500 Internal Server Error` - Error retrieving results

---

### Resume Assessment

Resume a previously started assessment.

**Endpoint:** `GET /api/v1/assessment/resume/:sessionId`

**URL Parameters:**
- `sessionId` (string) - UUID of the session

**Request Example:**

```bash
curl https://pmerit.com/api/v1/assessment/resume/550e8400-e29b-41d4-a716-446655440000
```

**Response (Success - Can Resume):**

```json
{
  "success": true,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "currentQuestion": 25,
  "answers": {
    "O1_1": 4,
    "O1_2": 3,
    ...
  },
  "answerCount": 25,
  "status": "in_progress",
  "startedAt": "2025-11-09T12:34:56Z",
  "updatedAt": "2025-11-09T12:37:20Z",
  "canResume": true
}
```

**Response (Already Completed):**

```json
{
  "success": false,
  "error": "Assessment already completed",
  "resultId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "canResume": false
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Session not found"
}
```

**Status Codes:**
- `200 OK` - Session retrieved successfully
- `404 Not Found` - Session not found
- `410 Gone` - Session expired (>30 days old)
- `500 Internal Server Error` - Error retrieving session

---

## 🤖 AI Endpoints

### AI Chat

Send a message to the AI assistant and receive a response.

**Endpoint:** `POST /api/chat`

**Request Body:**

```json
{
  "model": "phi3:mini",
  "messages": [
    {
      "role": "user",
      "content": "What careers match high openness and high conscientiousness?"
    }
  ],
  "stream": false,
  "options": {
    "temperature": 0.7,
    "top_p": 0.9,
    "num_predict": 150
  }
}
```

**Parameters:**
- `model` (string) - AI model to use (default: "phi3:mini")
  - Options: "phi3:mini", "phi3:medium", "llama3:8b"
- `messages` (array) - Conversation history
  - `role` (string) - "user" or "assistant"
  - `content` (string) - Message content
- `stream` (boolean) - Enable streaming responses (default: false)
- `options` (object) - Model parameters
  - `temperature` (number) - Randomness (0-1, default: 0.7)
  - `top_p` (number) - Nucleus sampling (0-1, default: 0.9)
  - `num_predict` (number) - Max tokens to generate

**Request Example:**

```bash
curl -X POST https://pmerit.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "phi3:mini",
    "messages": [
      {
        "role": "user",
        "content": "Explain the Big Five personality traits"
      }
    ],
    "stream": false
  }'
```

**Response (Success):**

```json
{
  "model": "phi3:mini",
  "created_at": "2025-11-09T12:45:30Z",
  "message": {
    "role": "assistant",
    "content": "The Big Five personality traits, also known as OCEAN, are:\n\n1. **Openness** - Creativity and curiosity\n2. **Conscientiousness** - Organization and reliability\n3. **Extraversion** - Social energy and assertiveness\n4. **Agreeableness** - Cooperation and empathy\n5. **Neuroticism** - Emotional stability\n\nThese traits are scientifically validated and used worldwide in psychology and career counseling."
  },
  "done": true,
  "total_duration": 2500000000,
  "prompt_tokens": 15,
  "completion_tokens": 78
}
```

**Response (Error):**

```json
{
  "error": "Failed to connect to AI service",
  "details": "Service temporarily unavailable"
}
```

**Status Codes:**
- `200 OK` - Response generated successfully
- `400 Bad Request` - Invalid request body
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - AI service error

---

### Streaming Chat (SSE)

Stream AI responses in real-time.

**Endpoint:** `POST /api/chat` (with `stream: true`)

**Request:**

```bash
curl -X POST https://pmerit.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "phi3:mini",
    "messages": [{"role": "user", "content": "Tell me about careers"}],
    "stream": true
  }'
```

**Response (Server-Sent Events):**

```
data: {"message": {"content": "There"}, "done": false}

data: {"message": {"content": " are"}, "done": false}

data: {"message": {"content": " many"}, "done": false}

...

data: {"message": {"content": "."}, "done": true, "total_duration": 3000000000}
```

**JavaScript Client Example:**

```javascript
const response = await fetch('https://pmerit.com/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'phi3:mini',
    messages: [{ role: 'user', content: 'Hello!' }],
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      console.log(data.message.content);
      
      if (data.done) {
        console.log('Stream complete');
      }
    }
  }
}
```

---

## 🔊 Text-to-Speech Endpoints

### Generate Speech

Convert text to speech with lip-sync data.

**Endpoint:** `POST /api/tts`

**Request Body:**

```json
{
  "text": "Welcome to PMERIT! Let's explore your career potential.",
  "voice": "alloy",
  "speed": 1.0
}
```

**Parameters:**
- `text` (string) - Text to convert to speech (max 5000 characters)
- `voice` (string) - Voice to use (default: "alloy")
  - Options: "alloy", "echo", "fable", "onyx", "nova", "shimmer"
- `speed` (number) - Speech speed multiplier (0.5-2.0, default: 1.0)

**Request Example:**

```bash
curl -X POST https://pmerit.com/api/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, welcome to PMERIT!",
    "voice": "alloy",
    "speed": 1.0
  }'
```

**Response (Success):**

```json
{
  "audioUrl": "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhgCAgICA...",
  "visemes": [
    { "v": "sil", "t": 0.0 },
    { "v": "PP", "t": 0.1 },
    { "v": "aa", "t": 0.2 },
    { "v": "L", "t": 0.35 },
    { "v": "O", "t": 0.5 },
    { "v": "sil", "t": 1.2 }
  ],
  "duration": 1.2,
  "voice": "alloy",
  "charCount": 26,
  "timestamp": "2025-11-09T12:50:00Z"
}
```

**Response Fields:**
- `audioUrl` (string) - Base64-encoded audio data or URL
- `visemes` (array) - Lip-sync phoneme data
  - `v` (string) - Viseme/phoneme identifier
  - `t` (number) - Timestamp in seconds
- `duration` (number) - Audio duration in seconds
- `voice` (string) - Voice used
- `charCount` (number) - Number of characters processed

**Viseme Values:**
Visemes for lip-sync animation:
- `sil` - Silence
- `PP` - P, B, M sounds (lips closed)
- `FF` - F, V sounds (lower lip to teeth)
- `TH` - TH sounds
- `DD` - D, T, N sounds
- `kk` - K, G sounds
- `CH` - CH, J, SH sounds
- `SS` - S, Z sounds
- `nn` - N, NG sounds
- `RR` - R sound
- `aa` - A sound (open mouth)
- `E` - E sound
- `I` - I sound
- `O` - O sound
- `U` - U sound

**Response (Error - Text Too Long):**

```json
{
  "error": "Text too long",
  "message": "Text must be 5000 characters or less",
  "charCount": 6543,
  "maxChars": 5000
}
```

**Response (Error):**

```json
{
  "error": "Invalid input",
  "message": "Text is required and must be a non-empty string"
}
```

**Status Codes:**
- `200 OK` - Audio generated successfully
- `400 Bad Request` - Invalid input (missing text, too long, etc.)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - TTS service error

---

## 📊 Rate Limiting

### Current Version (1.0)

**No rate limiting** - Open beta access for all users.

### Future Versions (1.1+)

Rate limits will be implemented:

| Tier | Requests/Minute | Requests/Hour | Requests/Day |
|------|----------------|---------------|--------------|
| **Anonymous** | 10 | 100 | 1,000 |
| **Free Account** | 30 | 300 | 3,000 |
| **Pro Account** | 100 | 1,000 | 10,000 |
| **Enterprise** | Unlimited | Unlimited | Unlimited |

**Rate Limit Headers:**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1699545600
```

**Rate Limit Exceeded Response:**

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60,
  "limit": 100,
  "resetAt": "2025-11-09T13:00:00Z"
}
```

---

## ❌ Error Handling

### Standard Error Response Format

All errors follow this format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": "Additional context (optional)",
  "timestamp": "2025-11-09T12:34:56Z",
  "requestId": "req_123abc456def"
}
```

### Error Codes

| Code | HTTP Status | Description | Solution |
|------|------------|-------------|----------|
| `VALIDATION_ERROR` | 400 | Invalid request data | Check request format and required fields |
| `MISSING_CONSENT` | 400 | Consent not provided | Include all consent fields |
| `INCOMPLETE_ASSESSMENT` | 400 | Missing answers | Provide all 120 answers |
| `SESSION_NOT_FOUND` | 404 | Session doesn't exist | Verify session ID |
| `RESULT_NOT_FOUND` | 404 | Result doesn't exist | Verify result ID |
| `SESSION_EXPIRED` | 410 | Session too old | Start new assessment |
| `ALREADY_COMPLETED` | 400 | Assessment already done | Cannot resubmit |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait before retrying |
| `DATABASE_ERROR` | 500 | Database connection failed | Retry later or contact support |
| `AI_SERVICE_ERROR` | 500 | AI service unavailable | Retry later |
| `TTS_SERVICE_ERROR` | 500 | TTS service failed | Retry later |
| `INTERNAL_ERROR` | 500 | Unknown server error | Contact support |

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Success with no response body
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required (future)
- `403 Forbidden` - Access denied (future)
- `404 Not Found` - Resource not found
- `410 Gone` - Resource no longer available
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily down

---

## 🧪 Testing & Examples

### cURL Examples

#### Complete Assessment Flow

```bash
# 1. Start assessment
SESSION_ID=$(curl -X POST https://pmerit.com/api/v1/assessment/start \
  -H "Content-Type: application/json" \
  -d '{
    "userId": null,
    "consent": {"privacy": true, "data": true, "terms": true}
  }' | jq -r '.sessionId')

echo "Session ID: $SESSION_ID"

# 2. Save progress
curl -X POST https://pmerit.com/api/v1/assessment/save \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"currentQuestion\": 10,
    \"answers\": {\"O1_1\": 4, \"O1_2\": 3}
  }"

# 3. Resume assessment
curl "https://pmerit.com/api/v1/assessment/resume/$SESSION_ID"

# 4. Submit complete assessment (with all 120 answers)
RESULT_ID=$(curl -X POST https://pmerit.com/api/v1/assessment/submit \
  -H "Content-Type: application/json" \
  -d @complete-answers.json | jq -r '.resultId')

echo "Result ID: $RESULT_ID"

# 5. Get results
curl "https://pmerit.com/api/v1/assessment/results/$RESULT_ID" | jq
```

#### AI Chat

```bash
curl -X POST https://pmerit.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "phi3:mini",
    "messages": [
      {"role": "user", "content": "What is the Big Five personality model?"}
    ]
  }' | jq '.message.content'
```

#### Text-to-Speech

```bash
curl -X POST https://pmerit.com/api/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, welcome to PMERIT!",
    "voice": "alloy",
    "speed": 1.0
  }' | jq
```

---

### JavaScript Examples

#### Assessment Client

```javascript
class PMERITAssessmentClient {
  constructor(baseUrl = 'https://pmerit.com') {
    this.baseUrl = baseUrl;
    this.sessionId = null;
  }

  async startAssessment(userId = null) {
    const response = await fetch(`${this.baseUrl}/api/v1/assessment/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        consent: {
          privacy: true,
          data: true,
          terms: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to start assessment: ${response.status}`);
    }

    const data = await response.json();
    this.sessionId = data.sessionId;
    return data;
  }

  async saveProgress(currentQuestion, answers) {
    const response = await fetch(`${this.baseUrl}/api/v1/assessment/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        currentQuestion,
        answers
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to save progress: ${response.status}`);
    }

    return await response.json();
  }

  async submitAssessment(answers) {
    const response = await fetch(`${this.baseUrl}/api/v1/assessment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        answers
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to submit assessment: ${response.status}`);
    }

    return await response.json();
  }

  async getResults(resultId) {
    const response = await fetch(
      `${this.baseUrl}/api/v1/assessment/results/${resultId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to get results: ${response.status}`);
    }

    return await response.json();
  }

  async resumeAssessment(sessionId) {
    const response = await fetch(
      `${this.baseUrl}/api/v1/assessment/resume/${sessionId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to resume assessment: ${response.status}`);
    }

    const data = await response.json();
    this.sessionId = sessionId;
    return data;
  }
}

// Usage Example
const client = new PMERITAssessmentClient();

// Start new assessment
const session = await client.startAssessment();
console.log('Session started:', session.sessionId);

// Save progress every 5 questions
await client.saveProgress(5, {
  'O1_1': 4,
  'O1_2': 3,
  'O1_3': 5,
  'O1_4': 2,
  'O2_1': 4
});

// Submit complete assessment
const results = await client.submitAssessment(allAnswers);
console.log('Holland Code:', results.hollandCode);
console.log('Top Career:', results.careerMatches[0].title);

// Get results later
const savedResults = await client.getResults(results.resultId);
```

#### AI Chat Client with Streaming

```javascript
async function streamChat(message) {
  const response = await fetch('https://pmerit.com/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'phi3:mini',
      messages: [{ role: 'user', content: message }],
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.message?.content) {
            fullResponse += data.message.content;
            // Update UI in real-time
            document.getElementById('response').textContent = fullResponse;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }

  return fullResponse;
}

// Usage
streamChat('What careers match high openness?');
```

#### TTS Client with Audio Playback

```javascript
async function speakText(text, voice = 'alloy') {
  try {
    const response = await fetch('https://pmerit.com/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, speed: 1.0 })
    });

    if (!response.ok) {
      throw new Error(`TTS failed: ${response.status}`);
    }

    const data = await response.json();

    // Play audio
    const audio = new Audio(data.audioUrl);
    await audio.play();

    // Use visemes for lip-sync
    console.log('Visemes:', data.visemes);
    // Implement lip-sync with your 3D avatar

    return data;
  } catch (error) {
    console.error('TTS error:', error);
    throw error;
  }
}

// Usage
speakText('Welcome to your personalized career assessment!');
```

---

## 📈 Changelog

### Version 1.0.0 (November 2025)

**Initial Release**

- ✅ Assessment endpoints (start, save, submit, results, resume)
- ✅ AI chat endpoint with streaming support
- ✅ Text-to-speech endpoint with visemes
- ✅ Database health and status endpoints
- ✅ CORS support for cross-origin requests
- ✅ Error handling and validation
- ✅ Edge deployment on Cloudflare

---

## 🔮 Roadmap

### Version 1.1 (Q1 2026)

- 🔐 **Authentication:** JWT-based user authentication
- 📊 **Analytics:** Assessment analytics and insights
- 👤 **User Profiles:** Save multiple assessments per user
- 📧 **Email Integration:** Email results and reminders
- 🔄 **Webhooks:** Real-time notifications for completed assessments

### Version 1.2 (Q2 2026)

- 🌍 **Multi-language:** Support for multiple languages
- 📱 **Mobile SDK:** Native mobile app SDK
- 🔍 **Career Search:** Advanced career search and filtering
- 💼 **Job Matching:** Integration with job boards
- 📚 **Learning Paths:** Personalized course recommendations

### Version 2.0 (Q3 2026)

- 🤝 **Team Assessments:** Organization and team features
- 📊 **Advanced Analytics:** Detailed reports and comparisons
- 🔌 **Public API:** Developer API with documentation
- 🏢 **Enterprise Features:** SSO, custom branding, white-label

---

## 📞 Support

### Technical Support

**Email:** api-support@pmerit.com

**Response Time:** Within 24 hours

**Include:**
- Endpoint and HTTP method
- Request body (sanitized)
- Response status code
- Error message
- Timestamp

### API Status

**Status Page:** https://status.pmerit.com

Monitor:
- API uptime
- Response times
- Incident history
- Scheduled maintenance

### Community

**GitHub Discussions:** [github.com/peoplemerit/pmerit-ai-platform/discussions](https://github.com/peoplemerit/pmerit-ai-platform/discussions)

**Discord:** [discord.gg/pmerit](https://discord.gg/pmerit)

---

## 📄 License

PMERIT API is provided under the MIT License. See [LICENSE](../LICENSE) for details.

---

**API Version:** 1.0.0  
**Documentation Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** PMERIT Development Team

**Questions?** Contact api-support@pmerit.com
