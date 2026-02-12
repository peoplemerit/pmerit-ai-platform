# PMERIT Governance System Integration

## Overview

This document describes the mathematical governance system integrated into the PMERIT platform. The system provides autonomous agent execution with human-in-the-loop approval gates, work unit conservation tracking, and DMAIC-based readiness metrics.

## Table of Contents

1. [Architecture](#architecture)
2. [Database Schema](#database-schema)
3. [Work Unit Conservation](#work-unit-conservation)
4. [Readiness Metric](#readiness-metric)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [Usage Guide](#usage-guide)
8. [Testing](#testing)

## Architecture

The governance system consists of three main layers:

1. **Database Layer**: PostgreSQL tables with conservation constraints
2. **API Layer**: Cloudflare Pages Functions for project management
3. **Frontend Layer**: Vanilla JavaScript UI components

### Technology Stack

- **Database**: Neon PostgreSQL (via Hyperdrive)
- **Backend**: Cloudflare Pages Functions
- **Frontend**: Vanilla JavaScript, CSS
- **API**: RESTful JSON endpoints

## Database Schema

### Tables Created

#### 1. `projects`
Tracks projects with work unit conservation.

**Key Columns**:
- `execution_total_wu`: Total work units allocated
- `formula_execution_wu`: Work units from AI planning
- `verified_reality_wu`: Work units verified through validation
- `current_phase`: AIXORD phase (DECISION, IDEATION, EXECUTION, etc.)
- `ideation_gate_passed`: Boolean flag for gate status

**Conservation Constraint**:
```sql
CHECK (ABS(execution_total_wu - (formula_execution_wu + verified_reality_wu)) < 0.01)
```

#### 2. `scopes`
Deliverable scopes with DMAIC readiness metrics.

**Key Columns**:
- `allocated_wu`: Work units allocated to this scope
- `verified_wu`: Work units verified (calculated from readiness)
- `logic_score`, `procedural_score`, `validation_score`: DMAIC components (0-1)
- `readiness_score`: Computed column `= logic_score × procedural_score × validation_score`

#### 3. `scope_dependencies`
DAG dependencies between scopes.

**Constraints**:
- No self-dependencies
- Unique dependency pairs

#### 4. `approval_gates`
Human-in-the-loop approval gates.

**Gate Types**:
- `IDEATION`: Pre-execution planning approval
- `SCOPE_VERIFICATION`: Individual scope approval
- `PHASE_TRANSITION`: Move between AIXORD phases
- `PROJECT_COMPLETION`: Final project approval

#### 5. `project_audit_log`
Immutable audit trail of all state transitions.

**Tracked Events**:
- Project creation
- Scope creation
- Scope verification
- Gate approvals
- WU transfers

## Work Unit Conservation

### Conservation Formula

```
EXECUTION_TOTAL = FORMULA_EXECUTION + VERIFIED_REALITY
```

### Explanation

- **EXECUTION_TOTAL**: Total work units budgeted for the project
- **FORMULA_EXECUTION**: Work units from AI agent planning (theoretical)
- **VERIFIED_REALITY**: Work units verified through human validation (actual)

### Enforcement

The conservation formula is enforced at the **database level** using a CHECK constraint. Any transaction that violates the formula will be rejected.

### Work Unit Transfer

When a scope is verified:

1. Calculate readiness score: `R = L × P × V`
2. Calculate transfer amount: `WU_transferred = allocated_wu × R`
3. Update project WU:
   - `formula_execution_wu -= WU_transferred`
   - `verified_reality_wu += WU_transferred`

This transfers work units from theoretical planning to verified reality.

## Readiness Metric

### Formula

```
R = L × P × V
```

Where:
- **L** (Logic): Requirements clarity, DAG completeness (0-1)
- **P** (Procedural): Process adherence, methodology (0-1)
- **V** (Validation): Acceptance criteria met, verification (0-1)

### Scoring Guidelines

#### Logic Score (L)

| Score | Description |
|-------|-------------|
| 0.0   | No requirements defined |
| 0.2   | Requirements exist but unclear |
| 0.5   | Requirements clear, some gaps |
| 0.8   | Requirements well-defined |
| 1.0   | Perfect logical consistency |

#### Procedural Score (P)

| Score | Description |
|-------|-------------|
| 0.0   | No process followed |
| 0.2   | Minimal process adherence |
| 0.5   | Process mostly followed |
| 0.8   | Process strictly followed |
| 1.0   | Perfect procedural compliance |

#### Validation Score (V)

| Score | Description |
|-------|-------------|
| 0.0   | No validation performed |
| 0.2   | Basic validation started |
| 0.5   | Partial acceptance criteria met |
| 0.8   | Most criteria met |
| 1.0   | All criteria met, fully verified |

### Example Calculation

```
L = 0.9 (Requirements well-defined)
P = 0.8 (Process strictly followed)
V = 0.7 (Most criteria met)

R = 0.9 × 0.8 × 0.7 = 0.504

If allocated_wu = 100 WU:
WU_transferred = 100 × 0.504 = 50.4 WU
```

## API Endpoints

### Project Creation

**Endpoint**: `POST /api/v1/projects/create`

**Request Body**:
```json
{
  "userId": 123,
  "title": "My Project",
  "objective": "Build governance system",
  "execution_total_wu": 1000
}
```

**Response**:
```json
{
  "success": true,
  "projectId": "uuid-here",
  "project": {
    "id": "uuid-here",
    "title": "My Project",
    "execution_total_wu": 1000,
    "formula_execution_wu": 1000,
    "verified_reality_wu": 0,
    "current_phase": "DECISION"
  }
}
```

### Create Scope

**Endpoint**: `POST /api/v1/projects/:id/scopes`

**Request Body**:
```json
{
  "scopeName": "Database Schema",
  "allocated_wu": 200,
  "acceptance_criteria": [
    {"criterion": "All tables created"},
    {"criterion": "Constraints verified"},
    {"criterion": "Indexes added"}
  ]
}
```

### Verify Scope

**Endpoint**: `POST /api/v1/projects/:id/scopes/:scopeId/verify`

**Request Body**:
```json
{
  "logic_score": 0.9,
  "procedural_score": 0.8,
  "validation_score": 0.7
}
```

**Response**:
```json
{
  "success": true,
  "wu_transferred": 50.4,
  "readiness_score": 0.504,
  "formula": {
    "calculation": "0.9 × 0.8 × 0.7 = 0.504",
    "transfer": "WU_transferred = 100 × 0.504 = 50.4"
  }
}
```

### Check Ideation Gate

**Endpoint**: `POST /api/v1/projects/:id/gates/ideation`

**Checks**:
- All scopes have acceptance criteria
- Total allocated WU matches project total
- At least one scope exists

### Get Dashboard

**Endpoint**: `GET /api/v1/projects/:id/dashboard`

**Response**: Complete project metrics including conservation status, scope readiness, and approval gates.

### Get Reconciliation

**Endpoint**: `GET /api/v1/projects/:id/reconciliation`

**Response**: AIXORD Reconciliation Triad (PLANNED vs CLAIMED vs VERIFIED) with divergence detection.

## Frontend Components

### 1. ProjectsAPI (`/assets/js/api/projects-api.js`)

JavaScript API client for all project endpoints.

**Usage**:
```javascript
// Create project
const result = await ProjectsAPI.createProject({
  userId: 123,
  title: "My Project",
  objective: "Build system",
  execution_total_wu: 1000
});

// Verify scope
const verification = await ProjectsAPI.verifyScope(
  projectId, 
  scopeId,
  { logic_score: 0.9, procedural_score: 0.8, validation_score: 0.7 }
);
```

### 2. GovernanceDashboard (`/assets/js/governance/governance-dashboard.js`)

Main dashboard controller that renders project metrics.

**Features**:
- Auto-refresh every 30 seconds
- Conservation status visualization
- Scope readiness breakdown
- Approval gate cards

**Usage**:
```javascript
GovernanceDashboard.init(projectId);
```

### 3. ApprovalGateUI (`/assets/js/governance/approval-gate-ui.js`)

Modal-based UI for approval gates and scope verification.

**Features**:
- Real-time readiness calculation
- WU transfer preview
- DMAIC score input with help text

**Usage**:
```javascript
ApprovalGateUI.init();
ApprovalGateUI.showScopeVerification(projectId, scopeId, scope);
ApprovalGateUI.showIdeationGate(projectId);
```

### 4. Governance Dashboard Page (`/governance-dashboard.html`)

Complete dashboard page with all components integrated.

**URL**: `/governance-dashboard.html?projectId=uuid-here`

## Usage Guide

### 1. Create a Project

```javascript
const project = await ProjectsAPI.createProject({
  userId: 123,
  title: "Website Redesign",
  objective: "Modernize company website",
  execution_total_wu: 500
});
```

### 2. Add Scopes

```javascript
const scope1 = await ProjectsAPI.createScope(project.projectId, {
  scopeName: "Frontend Development",
  allocated_wu: 200,
  acceptance_criteria: [
    { criterion: "All pages responsive" },
    { criterion: "Accessibility AA compliant" }
  ]
});

const scope2 = await ProjectsAPI.createScope(project.projectId, {
  scopeName: "Backend API",
  allocated_wu: 300,
  acceptance_criteria: [
    { criterion: "All endpoints documented" },
    { criterion: "100% test coverage" }
  ]
});
```

### 3. Check Ideation Gate

```javascript
const gateCheck = await ProjectsAPI.checkIdeationGate(project.projectId);

if (gateCheck.gate_status === 'PASSED') {
  console.log('Ready for execution phase');
} else {
  console.log('Gate failed:', gateCheck.messages);
}
```

### 4. Verify Scopes

```javascript
// Developer completes frontend work
const verification = await ProjectsAPI.verifyScope(
  project.projectId,
  scope1.scopeId,
  {
    logic_score: 0.95,  // Requirements well-defined
    procedural_score: 0.90,  // Process followed
    validation_score: 0.85   // Most criteria met
  }
);

console.log(`Transferred ${verification.wu_transferred} WU to verified reality`);
```

### 5. Monitor Dashboard

```javascript
const dashboard = await ProjectsAPI.getDashboard(project.projectId);

console.log('Conservation status:', dashboard.conservation.is_valid);
console.log('Completion rate:', dashboard.metrics.completion_rate + '%');
console.log('Avg readiness:', dashboard.metrics.average_readiness);
```

### 6. Reconciliation Check

```javascript
const reconciliation = await ProjectsAPI.getReconciliation(project.projectId);

if (reconciliation.reconciliation.status === 'DIVERGENT') {
  console.log('Divergences found:', reconciliation.reconciliation.divergences);
}
```

## Testing

### Database Migration Testing

```sql
-- Apply migration
\i functions/api/db/migrations/002_governance_tables.sql

-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE '%project%';

-- Test conservation constraint
INSERT INTO projects (user_id, title, objective, execution_total_wu, formula_execution_wu, verified_reality_wu)
VALUES (1, 'Test', 'Test objective', 100, 50, 50);  -- Should succeed

INSERT INTO projects (user_id, title, objective, execution_total_wu, formula_execution_wu, verified_reality_wu)
VALUES (1, 'Test', 'Test objective', 100, 60, 50);  -- Should fail (conservation violation)
```

### API Testing

Use curl or Postman to test endpoints:

```bash
# Create project
curl -X POST http://localhost:8788/api/v1/projects/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Test Project",
    "objective": "Testing governance system",
    "execution_total_wu": 100
  }'

# Create scope
curl -X POST http://localhost:8788/api/v1/projects/{PROJECT_ID}/scopes \
  -H "Content-Type: application/json" \
  -d '{
    "scopeName": "Test Scope",
    "allocated_wu": 50,
    "acceptance_criteria": [{"criterion": "Test complete"}]
  }'

# Verify scope
curl -X POST http://localhost:8788/api/v1/projects/{PROJECT_ID}/scopes/{SCOPE_ID}/verify \
  -H "Content-Type: application/json" \
  -d '{
    "logic_score": 0.9,
    "procedural_score": 0.8,
    "validation_score": 0.7
  }'
```

### Frontend Testing

1. Open `/governance-dashboard.html?projectId=uuid-here`
2. Verify all sections render correctly
3. Test scope verification modal
4. Verify real-time WU calculations
5. Check conservation status display

## Maintenance

### Database Indexes

Monitor query performance and add indexes as needed:

```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
WHERE schemaname = 'public' AND tablename LIKE '%project%';
```

### Audit Log Cleanup

Archive old audit logs periodically:

```sql
-- Archive logs older than 90 days
INSERT INTO project_audit_log_archive 
SELECT * FROM project_audit_log 
WHERE created_at < NOW() - INTERVAL '90 days';

DELETE FROM project_audit_log 
WHERE created_at < NOW() - INTERVAL '90 days';
```

## Security Considerations

1. **SQL Injection**: All queries use parameterized statements
2. **XSS Prevention**: All user input is escaped before rendering
3. **Authorization**: Verify user owns project before allowing modifications
4. **Rate Limiting**: Consider adding rate limits to API endpoints
5. **Audit Trail**: All actions logged for accountability

## Future Enhancements

1. **Scope Dependencies**: Implement DAG visualization and dependency checking
2. **Batch Operations**: Allow bulk scope creation and verification
3. **Notifications**: Email/webhook notifications for gate approvals
4. **Analytics Dashboard**: Historical trends and insights
5. **Export/Import**: Project templates and data export
6. **Webhooks**: Integrate with external systems (Slack, GitHub, etc.)

## References

- [DMAIC Methodology](https://en.wikipedia.org/wiki/DMAIC)
- [AIXORD Governance Framework](../project/Pmerit_Project_Document.md)
- [Work Unit Conservation Theory](../handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md)

## Support

For issues or questions:
- Create GitHub issue in `peoplemerit/pmerit-ai-platform`
- Check documentation in `/docs/` directory
- Review existing projects for examples

---

**Last Updated**: February 12, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
