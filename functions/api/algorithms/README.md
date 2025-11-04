# Career Matching Algorithm

This directory contains the core career matching algorithm that powers the PMERIT assessment system.

## Overview

The career matching system uses validated psychological models to recommend careers based on personality assessment results:

1. **Big Five Personality Traits** (60% weight)
2. **Holland Code (RIASEC)** (40% weight)

## Directory Structure

```
functions/api/
├── algorithms/          # Core matching algorithms
│   ├── CareerMatcher.js       # Main algorithm implementation
│   └── example-usage.js       # Usage examples
├── integrations/        # External API integrations
│   └── BLSClient.js          # Bureau of Labor Statistics API
├── services/            # Business logic services
│   ├── CareerEnrichmentService.js    # Data enrichment
│   └── CareerMatchingService.js      # Main orchestration
└── tests/               # Test suites
    ├── career-matching.test.js       # Comprehensive tests (22 tests)
    └── run-tests.js                  # Test runner
```

## Quick Start

### Basic Usage

```javascript
import CareerMatchingService from './services/CareerMatchingService.js';

// Initialize with database connection
const service = new CareerMatchingService(env.DB);

// Get recommendations
const recommendations = await service.getRecommendations({
  bigFive: {
    openness: { raw: 4.2, percentile: 85, label: 'Very High' },
    conscientiousness: { raw: 3.8, percentile: 70, label: 'High' },
    extraversion: { raw: 2.9, percentile: 45, label: 'Moderate' },
    agreeableness: { raw: 3.5, percentile: 60, label: 'High' },
    neuroticism: { raw: 2.2, percentile: 30, label: 'Low' }
  },
  hollandCode: 'IAE'
}, 10);
```

### Response Format

```javascript
[
  {
    rank: 1,
    career_id: 'c001',
    title: 'Data Scientist',
    fit_score: 92,
    rationale: 'Your high creativity and openness...',
    salary: {
      median: 100910,
      range: '$60,000-$140,000'
    },
    growth_outlook: 'Much faster than average',
    education_required: "Master's degree",
    holland_codes: 'IAE',
    onet_code: '15-2051.00'
  },
  // ... more recommendations
]
```

## Algorithm Details

### Big Five Trait Matching (60%)

Calculates personality fit by comparing user scores to career requirements:

- Each trait is compared (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)
- Traits are weighted by importance for each career
- Closer matches score higher

### Holland Code Compatibility (40%)

Uses the hexagonal model of vocational interests:

```
       R (Realistic)
      / \
     I   C (Conventional)
     |   |
     A   E (Enterprising)
      \ /
       S (Social)
```

- Adjacent types: High compatibility (80%)
- Opposite types: Low compatibility (20%)
- Position in 3-letter code matters (1st > 2nd > 3rd)

## Testing

Run the test suite:

```bash
cd functions/api/tests
node run-tests.js
```

All 22 tests should pass:
- ✓ Basic matching (4 tests)
- ✓ Holland compatibility (4 tests)
- ✓ Big Five matching (2 tests)
- ✓ Fit score calculation (2 tests)
- ✓ BLS API integration (2 tests)
- ✓ Career enrichment (2 tests)
- ✓ End-to-end workflow (3 tests)
- ✓ Error handling (3 tests)

## Documentation

For complete documentation, see:
- `/docs/CAREER_MATCHING_ALGORITHM.md` - Full algorithm documentation
- Code comments (JSDoc) in each file

## Integration

This algorithm is designed to integrate with:
- **Issue #17**: Assessment API `/submit` endpoint
- **Issue #18**: DatabaseHelper for career queries

## Performance

- **Target**: < 500ms for 10 recommendations
- **Caching**: 24-hour TTL for BLS data
- **Optimization**: Parallel enrichment, efficient queries

## Dependencies

- **Database**: Requires `careers` table with trait importance weights
- **BLS API**: Optional for real-time labor statistics
- **DatabaseHelper**: From Issue #18

## Human Review Points

⚠️ The following items require human validation:

1. **BLS API Integration**: SOC code to series ID mapping incomplete
2. **Trait Weights**: Validate career-specific importance weights
3. **Algorithm Weights**: Confirm 60/40 split (Big Five/Holland)
4. **Career Data**: Ensure database has accurate trait requirements

## Support

- **Issue Tracker**: peoplemerit/pmerit-ai-platform#19
- **Documentation**: `/docs/CAREER_MATCHING_ALGORITHM.md`
- **Tests**: Run with `node run-tests.js`

---

**Status**: ✅ Implemented and tested  
**Version**: 1.0.0  
**Last Updated**: November 3, 2025
