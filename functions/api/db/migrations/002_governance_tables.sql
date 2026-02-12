-- ============================================================================
-- PMERIT Governance System Tables Migration
-- Migration: 002_governance_tables.sql
-- Created: February 12, 2026
-- Purpose: Mathematical Governance System with Work Unit Conservation
-- ============================================================================
--
-- This migration creates the governance system tables:
-- 1. projects - Project tracking with work unit conservation
-- 2. scopes - Deliverable scopes with DMAIC readiness metrics
-- 3. scope_dependencies - DAG dependencies between scopes
-- 4. approval_gates - Human-in-the-loop approval gates
-- 5. project_audit_log - Immutable audit trail
--
-- Prerequisites:
-- - Neon PostgreSQL database with Hyperdrive connection
-- - 'users' table must exist with 'id' column
--
-- Mathematical Formulas:
-- - Conservation: EXECUTION_TOTAL = FORMULA_EXECUTION + VERIFIED_REALITY
-- - Readiness: R = L × P × V (Logic × Procedural × Validation)
-- - Transfer: WU_transferred = WU_candidate × R
-- ============================================================================

-- ============================================================================
-- TABLE: projects
-- Purpose: Track projects with work unit conservation
-- ============================================================================

CREATE TABLE IF NOT EXISTS projects (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Owner Reference
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Project Details
    title VARCHAR(255) NOT NULL,
    objective TEXT NOT NULL,
    
    -- Work Unit Tracking (Conservation Formula)
    -- Conservation Law: execution_total_wu = formula_execution_wu + verified_reality_wu
    execution_total_wu DECIMAL(10,2) DEFAULT 0 NOT NULL,
    formula_execution_wu DECIMAL(10,2) DEFAULT 0 NOT NULL,
    verified_reality_wu DECIMAL(10,2) DEFAULT 0 NOT NULL,
    
    -- AIXORD Phase Tracking
    current_phase VARCHAR(50) NOT NULL DEFAULT 'DECISION' 
        CHECK (current_phase IN ('DECISION', 'IDEATION', 'EXECUTION', 'OPTIMIZATION', 'REFLECTION', 'DOCUMENTATION')),
    
    -- Governance Metadata
    ideation_gate_passed BOOLEAN DEFAULT FALSE NOT NULL,
    locked_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Conservation Constraint (enforces mathematical accuracy within 0.01 tolerance)
    CONSTRAINT conservation_check CHECK (
        ABS(execution_total_wu - (formula_execution_wu + verified_reality_wu)) < 0.01
    )
);

-- ============================================================================
-- TABLE: scopes
-- Purpose: Deliverable scopes with DMAIC readiness metrics
-- ============================================================================

CREATE TABLE IF NOT EXISTS scopes (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Project Reference
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Scope Details
    scope_name VARCHAR(100) NOT NULL,
    
    -- Work Unit Allocation
    allocated_wu DECIMAL(10,2) NOT NULL CHECK (allocated_wu >= 0),
    verified_wu DECIMAL(10,2) DEFAULT 0 NOT NULL CHECK (verified_wu >= 0),
    
    -- DMAIC Readiness Metric Components (R = L × P × V)
    -- Each score is 0-1 scale based on DMAIC validation
    logic_score DECIMAL(3,2) DEFAULT 0 NOT NULL CHECK (logic_score BETWEEN 0 AND 1),
    procedural_score DECIMAL(3,2) DEFAULT 0 NOT NULL CHECK (procedural_score BETWEEN 0 AND 1),
    validation_score DECIMAL(3,2) DEFAULT 0 NOT NULL CHECK (validation_score BETWEEN 0 AND 1),
    
    -- Computed Readiness Score (R = L × P × V)
    readiness_score DECIMAL(3,2) GENERATED ALWAYS AS (
        logic_score * procedural_score * validation_score
    ) STORED,
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'PLANNED' NOT NULL
        CHECK (status IN ('PLANNED', 'UNLOCKED', 'IN_PROGRESS', 'READY_FOR_VERIFICATION', 'VERIFIED', 'LOCKED')),
    
    -- Acceptance Criteria (JSON array of criteria objects)
    acceptance_criteria JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    unlocked_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    locked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraint: verified_wu cannot exceed allocated_wu
    CONSTRAINT wu_allocation_check CHECK (verified_wu <= allocated_wu)
);

-- ============================================================================
-- TABLE: scope_dependencies
-- Purpose: DAG dependencies between scopes
-- ============================================================================

CREATE TABLE IF NOT EXISTS scope_dependencies (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Scope References
    scope_id UUID NOT NULL REFERENCES scopes(id) ON DELETE CASCADE,
    depends_on_scope_id UUID NOT NULL REFERENCES scopes(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT no_self_dependency CHECK (scope_id != depends_on_scope_id),
    CONSTRAINT unique_dependency UNIQUE (scope_id, depends_on_scope_id)
);

-- ============================================================================
-- TABLE: approval_gates
-- Purpose: Human-in-the-loop approval gates
-- ============================================================================

CREATE TABLE IF NOT EXISTS approval_gates (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    scope_id UUID REFERENCES scopes(id) ON DELETE CASCADE,
    
    -- Gate Details
    gate_type VARCHAR(50) NOT NULL
        CHECK (gate_type IN ('IDEATION', 'SCOPE_VERIFICATION', 'PHASE_TRANSITION', 'PROJECT_COMPLETION')),
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'FEEDBACK_REQUESTED')),
    
    -- Approval Metadata
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approval_message TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraint: Either project_id or scope_id must be set (not both)
    CONSTRAINT gate_reference_check CHECK (
        (project_id IS NOT NULL AND scope_id IS NULL) OR
        (project_id IS NULL AND scope_id IS NOT NULL)
    )
);

-- ============================================================================
-- TABLE: project_audit_log
-- Purpose: Immutable audit trail for all project state transitions
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_audit_log (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- References
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    scope_id UUID REFERENCES scopes(id) ON DELETE SET NULL,
    
    -- Event Details
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    
    -- Work Unit Snapshot (for conservation tracking)
    execution_total_wu DECIMAL(10,2),
    formula_execution_wu DECIMAL(10,2),
    verified_reality_wu DECIMAL(10,2),
    
    -- Timestamp (immutable - no updated_at)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES for projects
-- ============================================================================

-- Index 1: Fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_projects_user_id 
    ON projects(user_id, created_at DESC);

-- Index 2: Filter by current phase
CREATE INDEX IF NOT EXISTS idx_projects_current_phase 
    ON projects(current_phase);

-- Index 3: Find locked projects
CREATE INDEX IF NOT EXISTS idx_projects_locked 
    ON projects(locked_at) 
    WHERE locked_at IS NOT NULL;

-- ============================================================================
-- INDEXES for scopes
-- ============================================================================

-- Index 1: Fast lookup by project
CREATE INDEX IF NOT EXISTS idx_scopes_project_id 
    ON scopes(project_id, created_at DESC);

-- Index 2: Filter by status
CREATE INDEX IF NOT EXISTS idx_scopes_status 
    ON scopes(project_id, status);

-- Index 3: Readiness score for analytics
CREATE INDEX IF NOT EXISTS idx_scopes_readiness 
    ON scopes(project_id, readiness_score DESC);

-- ============================================================================
-- INDEXES for scope_dependencies
-- ============================================================================

-- Index 1: Fast lookup of dependencies for a scope
CREATE INDEX IF NOT EXISTS idx_scope_deps_scope_id 
    ON scope_dependencies(scope_id);

-- Index 2: Fast lookup of dependent scopes
CREATE INDEX IF NOT EXISTS idx_scope_deps_depends_on 
    ON scope_dependencies(depends_on_scope_id);

-- ============================================================================
-- INDEXES for approval_gates
-- ============================================================================

-- Index 1: Fast lookup by project
CREATE INDEX IF NOT EXISTS idx_approval_gates_project_id 
    ON approval_gates(project_id, created_at DESC)
    WHERE project_id IS NOT NULL;

-- Index 2: Fast lookup by scope
CREATE INDEX IF NOT EXISTS idx_approval_gates_scope_id 
    ON approval_gates(scope_id, created_at DESC)
    WHERE scope_id IS NOT NULL;

-- Index 3: Filter by status
CREATE INDEX IF NOT EXISTS idx_approval_gates_status 
    ON approval_gates(status, created_at DESC);

-- Index 4: Lookup by gate type
CREATE INDEX IF NOT EXISTS idx_approval_gates_type 
    ON approval_gates(gate_type, status);

-- ============================================================================
-- INDEXES for project_audit_log
-- ============================================================================

-- Index 1: Fast lookup by project (most common query)
CREATE INDEX IF NOT EXISTS idx_audit_log_project_id 
    ON project_audit_log(project_id, created_at DESC);

-- Index 2: Fast lookup by scope
CREATE INDEX IF NOT EXISTS idx_audit_log_scope_id 
    ON project_audit_log(scope_id, created_at DESC)
    WHERE scope_id IS NOT NULL;

-- Index 3: Filter by event type
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type 
    ON project_audit_log(event_type, created_at DESC);

-- Index 4: Time-based queries
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at 
    ON project_audit_log(created_at DESC);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE projects IS 'Project tracking with work unit conservation and AIXORD phase management';
COMMENT ON COLUMN projects.execution_total_wu IS 'Total work units allocated to project (conservation formula)';
COMMENT ON COLUMN projects.formula_execution_wu IS 'Work units from AI agent execution planning';
COMMENT ON COLUMN projects.verified_reality_wu IS 'Work units verified through human validation';
COMMENT ON CONSTRAINT conservation_check ON projects IS 'Enforces mathematical conservation: TOTAL = FORMULA + VERIFIED (±0.01 tolerance)';

COMMENT ON TABLE scopes IS 'Deliverable scopes with DMAIC readiness metrics (R = L × P × V)';
COMMENT ON COLUMN scopes.logic_score IS 'Logic component of readiness (0-1): requirements clarity, DAG completeness';
COMMENT ON COLUMN scopes.procedural_score IS 'Procedural component of readiness (0-1): process adherence, methodology';
COMMENT ON COLUMN scopes.validation_score IS 'Validation component of readiness (0-1): acceptance criteria met, verification';
COMMENT ON COLUMN scopes.readiness_score IS 'Computed readiness: R = L × P × V (determines WU transfer ratio)';

COMMENT ON TABLE scope_dependencies IS 'DAG dependencies ensuring proper execution order';
COMMENT ON TABLE approval_gates IS 'Human-in-the-loop approval gates for governance control';
COMMENT ON TABLE project_audit_log IS 'Immutable audit trail of all project state transitions';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name IN ('projects', 'scopes', 'scope_dependencies', 'approval_gates', 'project_audit_log');

-- Check conservation constraint
-- SELECT constraint_name, check_clause 
-- FROM information_schema.check_constraints 
-- WHERE constraint_name = 'conservation_check';

-- Verify computed column
-- SELECT column_name, column_default, is_generated, generation_expression
-- FROM information_schema.columns 
-- WHERE table_name = 'scopes' AND column_name = 'readiness_score';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
