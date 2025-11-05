# Career Matching Algorithm Documentation

## Overview
This document describes the Career Matching algorithm implemented in /functions/api/algorithms/CareerMatcher.js.
It follows the project's decisions for DB API, BLS key storage, KV caching, and Holland code weighting.

## Key Decisions (applied)
- DatabaseHelper method: searchCareersByPersonality(bigFive, hollandCode, limit)
  - Returns an array of career objects and is used to pre-filter candidate careers.
- BLS API key storage: environment variable BLS_API_KEY.
  - Local dev: .dev.vars or similar (do not commit secrets).
  - Production: Cloudflare dashboard or secret management.
- Caching: Cloudflare Workers KV with key format `bls:{onetCode}`, TTL 86400s (24 hours).
  - Fallback: in-memory Map for local dev/tests.
- Holland Code weighting: Order matters.
  - 1st letter (primary): 50%
  - 2nd letter (secondary): 30%
  - 3rd letter (tertiary): 20%

## Algorithm Components

### 1. Big Five Personality Matching
- Trait scoring:
  - traitScore = 100 - |userPercentile - careerPreferredPercentile|
  - Multiply traitScore by trait importance weight (career-specific or default equal weights).
  - Weighted average normalized to 0-100.
- Weight of this component: 60% of final score.

### 2. Holland Code Compatibility
- Uses RIASEC hexagon adjacency distances.
- For each user letter in order (up to first 3), compute minimal adjacency distance to career letters.
- Convert distance to a 0-100 score: 100 - (distance * 20).
- Apply order weights (50/30/20) and compute weighted average.
- Weight of this component: 40% of final score.

### 3. Final Score
- finalScore = (bigFiveScore * 0.6) + (hollandScore * 0.4)
- Rounded to integer 0..100.

## Data Sources
- Internal career database (DatabaseHelper) with careers.onet_code or soc_code.
- BLS API for wage/growth; requires SOC->series id mapping stored in DB/config.
  - [HUMAN REVIEW NEEDED] Provide mapping for SOC -> BLS series IDs or use O*NET.
- O*NET web services as fallback if BLS mapping fails.

## Caching (BLS enrichment)
- Cloudflare Workers KV recommended; binding provided to CareerEnrichmentService as kvBinding.
- Key format: bls:{onetCode}
- TTL: 86400 seconds (24 hours)
- Fallback: in-memory cache for local tests.

## Usage Example
```js
const service = new CareerMatchingService(env.DB, {
  apiKey: env.BLS_API_KEY,
  kvBinding: env.PMERIT_BLS_DATA_KV
});
const recommendations = await service.getRecommendations({ bigFive, hollandCode: 'IAE' }, 10);
```

## Testing
- Tests should mock DatabaseHelper.searchCareersByPersonality and provide a mock KV binding.
- BLSClient can be constructed with a mock fetch and apiKey for unit tests.

## Human Review Points
- Confirm SOC -> BLS series mapping strategy (BLS uses timeseries series IDs).
- Confirm whether to persist BLS API key in Cloudflare environment or a secrets manager.
- Confirm wording/tone for rationale outputs and potential localization.