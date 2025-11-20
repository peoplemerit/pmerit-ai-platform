\# PMERIT AI SYSTEM - COMPLETE SETUP REQUIREMENTS



\*\*Last Updated:\*\* November 19, 2025 - Session 8  

\*\*Status:\*\* ✅ PRODUCTION READY  

\*\*Worker:\*\* pmerit-api  

\*\*Production URL:\*\* https://pmerit-api.peoplemerit.workers.dev



---



\## 🔧 REQUIRED CLOUDFLARE BINDINGS



\### ✅ VERIFIED BINDINGS (Cloudflare Dashboard)



| Binding Type | Variable Name | Purpose | Status |

|-------------|---------------|---------|--------|

| \*\*Workers AI\*\* | `AI` | LLM inference for all 5 personas | ✅ ACTIVE |

| \*\*Vectorize Index\*\* | `VECTORIZE` | RAG knowledge base (careers, courses) | ✅ ACTIVE |

| **Environment Variable** | `DATABASE_URL` | Neon PostgreSQL connection | ✅ ACTIVE (Secret) |


\### How to Verify Bindings

1\. Go to Cloudflare Dashboard → Workers \& Pages

2\. Click `pmerit-api`

3\. Go to \*\*Settings\*\* tab

4\. Check \*\*Bindings\*\* section (Workers AI, Vectorize)

5\. Check \*\*Environment Variables\*\* section (DATABASE\_URL)



---



\## 🤖 5 AI ENDPOINTS - COMPLETE REFERENCE



\### 1. General AI Chat (PMERIT Assistant)

\*\*Endpoint:\*\* `POST /api/v1/ai/chat`  

\*\*Persona:\*\* Friendly platform guide  

\*\*Model:\*\* `@cf/meta/llama-3.1-8b-instruct`  

\*\*Use Cases:\*\* 

\- General questions about PMERIT

\- Platform navigation help

\- Feature explanations



\*\*Request Example:\*\*

```json

{

&nbsp; "messages": \[

&nbsp;   { "role": "user", "content": "What is PMERIT?" }

&nbsp; ],

&nbsp; "figurative\_mode": false,

&nbsp; "user\_id": "optional-user-id",

&nbsp; "session\_id": "optional-session-id"

}

```



---



\### 2. Customer Support (PMERIT Support)

\*\*Endpoint:\*\* `POST /api/v1/ai/support`  

\*\*Persona:\*\* Professional support agent  

\*\*Model:\*\* `@cf/meta/llama-3.1-8b-instruct`  

\*\*Use Cases:\*\*

\- Technical issues

\- Account problems

\- Bug reports

\- Escalation to human support



\*\*Request Example:\*\*

```json

{

&nbsp; "messages": \[

&nbsp;   { "role": "user", "content": "I can't log in to my account" }

&nbsp; ],

&nbsp; "user\_id": "user-123"

}

```



---



\### 3. Virtual Tutor (Professor Merit)

\*\*Endpoint:\*\* `POST /api/v1/ai/tutor`  

\*\*Persona:\*\* Socratic teaching method  

\*\*Model:\*\* `@cf/meta/llama-3.1-8b-instruct`  

\*\*Use Cases:\*\*

\- Course tutoring

\- Socratic questioning

\- Learning guidance

\- Personalized teaching



\*\*Request Example:\*\*

```json

{

&nbsp; "messages": \[

&nbsp;   { "role": "user", "content": "Explain how variables work in Python" }

&nbsp; ],

&nbsp; "figurative\_mode": true,

&nbsp; "learning\_style": "visual"

}

```



---



\### 4. Assessment Analysis (PMERIT Insight)

\*\*Endpoint:\*\* `POST /api/v1/ai/assessment`  

\*\*Persona:\*\* Career counselor  

\*\*Model:\*\* `@cf/meta/llama-3.1-8b-instruct`  

\*\*Use Cases:\*\*

\- Big Five personality analysis

\- Career path suggestions

\- Strength/weakness insights



\*\*Request Example:\*\*

```json

{

&nbsp; "messages": \[

&nbsp;   { 

&nbsp;     "role": "user", 

&nbsp;     "content": "Analyze this: Openness: 85, Conscientiousness: 70, Extraversion: 60, Agreeableness: 75, Neuroticism: 40" 

&nbsp;   }

&nbsp; ],

&nbsp; "figurative\_mode": false

}

```



---



\### 5. Career Matching (PMERIT Pathfinder)

\*\*Endpoint:\*\* `POST /api/v1/ai/careers`  

\*\*Persona:\*\* Strategic career advisor  

\*\*Model:\*\* `@cf/meta/llama-3.1-8b-instruct`  

\*\*Use Cases:\*\*

\- Career recommendations

\- Job market insights

\- Remote career guidance

\- Skill gap analysis



\*\*Request Example:\*\*

```json

{

&nbsp; "messages": \[

&nbsp;   { "role": "user", "content": "What remote careers match my profile?" }

&nbsp; ],

&nbsp; "user\_id": "user-123"

}

```



---



\## 📊 AI MODEL CONFIGURATION



\### Current Model Tier Strategy

```javascript

const CONFIG = {

&nbsp; MODELS: {

&nbsp;   SIMPLE: '@cf/meta/llama-3.1-8b-instruct',     // Quick queries

&nbsp;   STANDARD: '@cf/meta/llama-3.1-8b-instruct',   // Conversations  

&nbsp;   ADVANCED: '@cf/meta/llama-3.1-8b-instruct',   // Can upgrade to 70B

&nbsp;   EXPERT: '@cf/meta/llama-3.1-8b-instruct'      // Can upgrade to 70B

&nbsp; },

&nbsp; 

&nbsp; MODEL\_COSTS: {

&nbsp;   SIMPLE: 0.50,      // per 1M tokens

&nbsp;   STANDARD: 0.50,

&nbsp;   ADVANCED: 2.00,    // if using 70B

&nbsp;   EXPERT: 2.00

&nbsp; }

};

```



\### Available Models (Workers AI)

\- \*\*Primary:\*\* `@cf/meta/llama-3.1-8b-instruct` (fast, cost-effective)

\- \*\*Future:\*\* `@cf/meta/llama-3-70b-instruct` (powerful, for ADVANCED/EXPERT)



---



\## ⚖️ LEGAL COMPLIANCE



\### ✅ Open Source License

\- \*\*Model:\*\* Meta Llama 3.1

\- \*\*License:\*\* Meta Community License (commercial use allowed)

\- \*\*Attribution:\*\* "Powered by Meta Llama 3.1"

\- \*\*Branding:\*\* Legal to call "PMERIT AI"



\### ✅ Required Disclaimers

All AI responses include:

\- "AS-IS" warranty disclaimer

\- No professional advice guarantee

\- Automated content notice

\- Third-party model acknowledgment



\*\*Location:\*\* `/docs/legal/AI\_TERMS\_OF\_SERVICE.md`



---



\## 🌐 FRONTEND INTEGRATION



\### chat.js Configuration

\*\*File:\*\* `E:\\pmerit\\pmerit-ai-platform\\assets\\js\\chat.js`



\*\*Current API URL:\*\*

```javascript

const API\_URL = 'https://pmerit-api.peoplemerit.workers.dev/api/v1/ai/chat';

```



\*\*⚠️ CRITICAL:\*\* This URL must NEVER change unless pmerit-api worker is renamed.



\### How to Call AI from Frontend

```javascript

const response = await fetch('https://pmerit-api.peoplemerit.workers.dev/api/v1/ai/chat', {

&nbsp; method: 'POST',

&nbsp; headers: { 'Content-Type': 'application/json' },

&nbsp; body: JSON.stringify({

&nbsp;   messages: conversationHistory,

&nbsp;   user\_id: currentUserId,

&nbsp;   session\_id: currentSessionId

&nbsp; })

});



// Handle streaming response

const reader = response.body.getReader();

const decoder = new TextDecoder();



while (true) {

&nbsp; const { done, value } = await reader.read();

&nbsp; if (done) break;

&nbsp; 

&nbsp; const chunk = decoder.decode(value);

&nbsp; console.log(chunk); // AI response chunk

}

```



---



\## 🔧 TROUBLESHOOTING GUIDE



\### ❌ "AI service temporarily unavailable"



\*\*Possible Causes:\*\*

1\. Workers AI binding missing

2\. DATABASE\_URL not set

3\. Worker not deployed

4\. CORS issues



\*\*Fix:\*\*

```bash

\# 1. Check bindings in Cloudflare dashboard

\# 2. Verify deployment

cd E:\\pmerit\\pmerit-api-worker

npx wrangler deploy



\# 3. Test endpoint directly

curl https://pmerit-api.peoplemerit.workers.dev/

```



---



\### ❌ "env.AI is undefined"



\*\*Cause:\*\* Workers AI binding not configured



\*\*Fix:\*\*

1\. Go to Cloudflare Dashboard

2\. Click `pmerit-api` worker

3\. Settings → Bindings

4\. Add Workers AI binding with variable name `AI`



---



\### ❌ Frontend can't connect to API



\*\*Cause:\*\* Wrong API URL in chat.js



\*\*Fix:\*\*

```javascript

// ✅ CORRECT URL

const API\_URL = 'https://pmerit-api.peoplemerit.workers.dev/api/v1/ai/chat';



// ❌ WRONG - Don't use these

// 'https://pmerit-db-worker...' (deleted)

// 'http://localhost...' (local only)

```



---



\## 📈 FUTURE ENHANCEMENTS



\### Phase 1: Model Optimization (Upcoming)

\- \[ ] Upgrade ADVANCED tier to Llama 3 70B

\- \[ ] Implement Cloudflare KV caching

\- \[ ] Add query classification tuning



\### Phase 2: RAG System (In Progress)

\- \[x] Vectorize binding added

\- \[ ] Import 96 careers to vector DB

\- \[ ] Enable career knowledge retrieval

\- \[ ] Course content embedding



\### Phase 3: Advanced Features

\- \[ ] Figurative language content library

\- \[ ] Multi-language support (Yoruba, Igbo, Hausa)

\- \[ ] User preference learning

\- \[ ] A/B testing literal vs figurative modes



---



\## ✅ VERIFICATION CHECKLIST



Before deploying AI changes, verify:



\- \[ ] Workers AI binding exists (`AI` variable)

\- \[ ] Vectorize binding exists (`VECTORIZE` variable)

\- \[ ] DATABASE\_URL environment variable set

\- \[ ] All 5 endpoints return 200 on health check

\- \[ ] Frontend chat.js uses correct API URL

\- \[ ] Legal disclaimers displayed to users

\- \[ ] No console errors in production

\- \[ ] Streaming responses working



---



\## 📞 QUICK REFERENCE



\*\*Worker Name:\*\* pmerit-api  

\*\*Production URL:\*\* https://pmerit-api.peoplemerit.workers.dev  

\*\*Health Check:\*\* `GET /`  

\*\*Model:\*\* Meta Llama 3.1 8B Instruct  

\*\*Cost:\*\* ~$0.50 per 1M tokens  

\*\*Monthly Budget:\*\* $0 (free tier covers usage)



---



\## 🚨 CRITICAL RULES



1\. \*\*NEVER delete pmerit-api worker\*\* - it's the only AI backend

2\. \*\*NEVER change API URLs\*\* without updating frontend

3\. \*\*ALWAYS verify bindings\*\* after redeployment

4\. \*\*ALWAYS test in production\*\* after changes

5\. \*\*DOCUMENT changes\*\* in this file immediately



---



\*\*Created:\*\* November 19, 2025 - Session 8  

\*\*Last Verified:\*\* November 19, 2025  

\*\*Next Review:\*\* Before any AI-related changes

