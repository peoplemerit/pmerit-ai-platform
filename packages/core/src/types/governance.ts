/**
 * AIXORD Governance Types
 * 
 * Gate definitions, phase transitions, kingdom mappings,
 * execution modes, and halt conditions.
 * 
 * @module @aixord/core/types/governance
 */

import type { GateID, Phase, Kingdom, ExecutionMode } from './state';

// ============================================================================
// GATE DEFINITIONS
// ============================================================================

/**
 * Gate ordering (canonical sequence)
 */
export const GATE_ORDER: GateID[] = [
  'LIC', 'DIS', 'TIR', 'ENV', 'FLD', 'CIT', 'CON', 'OBJ',
  'RA', 'FX', 'PD', 'PR', 'BP', 'MS', 'VA', 'HO',
];

/**
 * Blocking gates (must pass before proceeding)
 */
export const BLOCKING_GATES: GateID[] = [
  'LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA', 'FX', 'PD', 'BP', 'MS',
];

/**
 * Non-blocking gates (can default)
 */
export const NON_BLOCKING_GATES: GateID[] = [
  'FLD', 'CIT', 'CON', 'PR', 'VA', 'HO',
];

/**
 * Setup gates (first 9 in sequence)
 */
export const SETUP_GATES: GateID[] = [
  'LIC', 'DIS', 'TIR', 'ENV', 'FLD', 'CIT', 'CON', 'OBJ', 'RA',
];

/**
 * Gate metadata
 */
export interface GateDefinition {
  /** Gate identifier */
  id: GateID;
  
  /** Human-readable name */
  name: string;
  
  /** Full description */
  description: string;
  
  /** Whether gate blocks progression */
  blocking: boolean;
  
  /** Position in sequence (0-indexed) */
  order: number;
  
  /** Artifact required for this gate (if any) */
  requiredArtifact?: string;
  
  /** Setup step number (1-9 for setup gates, undefined otherwise) */
  setupStep?: number;
}

/**
 * Complete gate definitions
 */
export const GATE_DEFINITIONS: Record<GateID, GateDefinition> = {
  LIC: {
    id: 'LIC',
    name: 'License',
    description: 'License validation required',
    blocking: true,
    order: 0,
    setupStep: 1,
  },
  DIS: {
    id: 'DIS',
    name: 'Disclaimer',
    description: 'Disclaimer acceptance required',
    blocking: true,
    order: 1,
    setupStep: 2,
  },
  TIR: {
    id: 'TIR',
    name: 'Tier',
    description: 'Platform tier detection required',
    blocking: true,
    order: 2,
    setupStep: 3,
  },
  ENV: {
    id: 'ENV',
    name: 'Environment',
    description: 'Environment configuration required',
    blocking: true,
    order: 3,
    setupStep: 4,
  },
  FLD: {
    id: 'FLD',
    name: 'Folder',
    description: 'Folder structure selection',
    blocking: false,
    order: 4,
    setupStep: 5,
  },
  CIT: {
    id: 'CIT',
    name: 'Citation',
    description: 'Citation mode selection',
    blocking: false,
    order: 5,
    setupStep: 6,
  },
  CON: {
    id: 'CON',
    name: 'Continuity',
    description: 'Continuity mode selection',
    blocking: false,
    order: 6,
    setupStep: 7,
  },
  OBJ: {
    id: 'OBJ',
    name: 'Objective',
    description: 'Project objective declaration required',
    blocking: true,
    order: 7,
    setupStep: 8,
  },
  RA: {
    id: 'RA',
    name: 'Reality Absorption',
    description: 'Reality classification required',
    blocking: true,
    order: 8,
    setupStep: 9,
  },
  FX: {
    id: 'FX',
    name: 'Formula',
    description: 'Formula binding required',
    blocking: true,
    order: 9,
    requiredArtifact: 'formula',
  },
  PD: {
    id: 'PD',
    name: 'Project Docs',
    description: 'Project documentation created and saved',
    blocking: true,
    order: 10,
    requiredArtifact: 'projectDocs',
  },
  PR: {
    id: 'PR',
    name: 'Plan Review',
    description: 'Plan analysis completed',
    blocking: false,
    order: 11,
  },
  BP: {
    id: 'BP',
    name: 'Blueprint',
    description: 'Blueprint approved and saved',
    blocking: true,
    order: 12,
    requiredArtifact: 'blueprint',
  },
  MS: {
    id: 'MS',
    name: 'Master Scope',
    description: 'Master scope and DAG confirmed',
    blocking: true,
    order: 13,
    requiredArtifact: 'masterScope',
  },
  VA: {
    id: 'VA',
    name: 'Validation',
    description: 'Evidence/visual audit provided',
    blocking: false,
    order: 14,
  },
  HO: {
    id: 'HO',
    name: 'Handoff',
    description: 'Handoff document saved',
    blocking: false,
    order: 15,
    requiredArtifact: 'handoff',
  },
};

// ============================================================================
// PHASE DEFINITIONS
// ============================================================================

/**
 * Phase metadata
 */
export interface PhaseDefinition {
  /** Phase identifier */
  id: Phase;
  
  /** Human-readable name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Kingdom this phase belongs to */
  kingdom: Kingdom;
  
  /** Position in sequence (0-indexed) */
  order: number;
  
  /** Gates that must be passed to enter this phase */
  requiredGates: GateID[];
  
  /** Gates that can be completed in this phase */
  completableGates: GateID[];
}

/**
 * Phase-Kingdom mapping
 */
export const PHASE_KINGDOM_MAP: Record<Phase, Kingdom> = {
  SETUP: '',
  DISCOVER: 'IDEATION',
  BRAINSTORM: 'IDEATION',
  PLAN: 'BLUEPRINT',
  BLUEPRINT: 'BLUEPRINT',
  SCOPE: 'BLUEPRINT',
  EXECUTE: 'REALIZATION',
  AUDIT: 'REALIZATION',
  VERIFY: 'REALIZATION',
  LOCK: 'REALIZATION',
};

/**
 * Complete phase definitions
 */
export const PHASE_DEFINITIONS: Record<Phase, PhaseDefinition> = {
  SETUP: {
    id: 'SETUP',
    name: 'Setup',
    description: 'Initial session configuration',
    kingdom: '',
    order: 0,
    requiredGates: [],
    completableGates: ['LIC', 'DIS', 'TIR', 'ENV', 'FLD', 'CIT', 'CON', 'OBJ', 'RA'],
  },
  DISCOVER: {
    id: 'DISCOVER',
    name: 'Discover',
    description: 'Explore and understand the problem space',
    kingdom: 'IDEATION',
    order: 1,
    requiredGates: ['LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA'],
    completableGates: ['PD'],
  },
  BRAINSTORM: {
    id: 'BRAINSTORM',
    name: 'Brainstorm',
    description: 'Generate and evaluate solutions',
    kingdom: 'IDEATION',
    order: 2,
    requiredGates: ['LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA'],
    completableGates: ['PD'],
  },
  PLAN: {
    id: 'PLAN',
    name: 'Plan',
    description: 'Create formula and detailed plan',
    kingdom: 'BLUEPRINT',
    order: 3,
    requiredGates: ['LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA', 'PD'],
    completableGates: ['FX', 'PR'],
  },
  BLUEPRINT: {
    id: 'BLUEPRINT',
    name: 'Blueprint',
    description: 'Convert plan to buildable specification',
    kingdom: 'BLUEPRINT',
    order: 4,
    requiredGates: ['LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA', 'FX', 'PD', 'PR'],
    completableGates: ['BP'],
  },
  SCOPE: {
    id: 'SCOPE',
    name: 'Scope',
    description: 'Define master scope and dependencies',
    kingdom: 'BLUEPRINT',
    order: 5,
    requiredGates: ['LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA', 'FX', 'PD', 'PR', 'BP'],
    completableGates: ['MS'],
  },
  EXECUTE: {
    id: 'EXECUTE',
    name: 'Execute',
    description: 'Implement deliverables',
    kingdom: 'REALIZATION',
    order: 6,
    requiredGates: ['LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA', 'FX', 'PD', 'PR', 'BP', 'MS'],
    completableGates: [],
  },
  AUDIT: {
    id: 'AUDIT',
    name: 'Audit',
    description: 'Review and assess quality',
    kingdom: 'REALIZATION',
    order: 7,
    requiredGates: ['LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA', 'FX', 'PD', 'PR', 'BP', 'MS'],
    completableGates: ['VA'],
  },
  VERIFY: {
    id: 'VERIFY',
    name: 'Verify',
    description: 'Verify completion and quality',
    kingdom: 'REALIZATION',
    order: 8,
    requiredGates: ['LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA', 'FX', 'PD', 'PR', 'BP', 'MS', 'VA'],
    completableGates: [],
  },
  LOCK: {
    id: 'LOCK',
    name: 'Lock',
    description: 'Finalize and lock deliverables',
    kingdom: 'REALIZATION',
    order: 9,
    requiredGates: ['LIC', 'DIS', 'TIR', 'ENV', 'OBJ', 'RA', 'FX', 'PD', 'PR', 'BP', 'MS', 'VA'],
    completableGates: ['HO'],
  },
};

// ============================================================================
// KINGDOM DEFINITIONS
// ============================================================================

/**
 * Kingdom metadata
 */
export interface KingdomDefinition {
  /** Kingdom identifier */
  id: Kingdom;
  
  /** Human-readable name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Phases in this kingdom */
  phases: Phase[];
}

/**
 * Complete kingdom definitions
 */
export const KINGDOM_DEFINITIONS: Record<Kingdom, KingdomDefinition> = {
  '': {
    id: '',
    name: 'Pre-Kingdom',
    description: 'Before project work begins',
    phases: ['SETUP'],
  },
  IDEATION: {
    id: 'IDEATION',
    name: 'Ideation',
    description: 'Explore, discover, decide',
    phases: ['DISCOVER', 'BRAINSTORM'],
  },
  BLUEPRINT: {
    id: 'BLUEPRINT',
    name: 'Blueprint',
    description: 'Convert intent to buildable form',
    phases: ['PLAN', 'BLUEPRINT', 'SCOPE'],
  },
  REALIZATION: {
    id: 'REALIZATION',
    name: 'Realization',
    description: 'Execute, verify, lock',
    phases: ['EXECUTE', 'AUDIT', 'VERIFY', 'LOCK'],
  },
};

// ============================================================================
// EXECUTION MODE DEFINITIONS
// ============================================================================

/**
 * Execution mode metadata
 */
export interface ExecutionModeDefinition {
  /** Mode identifier */
  id: ExecutionMode;
  
  /** Human-readable name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Whether batch approval is allowed */
  batchApproval: boolean;
  
  /** Whether per-action approval is required */
  perActionApproval: boolean;
}

/**
 * Complete execution mode definitions
 */
export const EXECUTION_MODE_DEFINITIONS: Record<ExecutionMode, ExecutionModeDefinition> = {
  STRICT: {
    id: 'STRICT',
    name: 'Strict',
    description: 'Every action requires explicit approval',
    batchApproval: false,
    perActionApproval: true,
  },
  SUPERVISED: {
    id: 'SUPERVISED',
    name: 'Supervised',
    description: 'Batch approval allowed',
    batchApproval: true,
    perActionApproval: false,
  },
  SANDBOX: {
    id: 'SANDBOX',
    name: 'Sandbox',
    description: 'Pre-authorized exploration scope',
    batchApproval: true,
    perActionApproval: false,
  },
};

// ============================================================================
// HALT CONDITIONS
// ============================================================================

/**
 * Halt condition codes
 */
export type HaltCode =
  | 'H-AU1'  // Missing/ambiguous approval
  | 'H-AU2'  // Silence without auto-approve
  | 'H-AB1'  // Unbound artifact referenced
  | 'H-AB2'  // Resume without rebind
  | 'H-GA1'  // Gate blocked
  | 'H-RA1'  // Reality not classified
  | 'H-RA2'  // Conserved scope rebuild
  | 'H-FX1'  // Formula unbound
  | 'H-FX4'  // Conservation violation
  | 'H-PS3'  // Path + credentials detected
  | 'H-ST1'; // State conflict

/**
 * Halt condition definition
 */
export interface HaltCondition {
  /** Halt code */
  code: HaltCode;
  
  /** Short message */
  message: string;
  
  /** Resolution instructions */
  resolution: string;
  
  /** Severity level */
  severity: 'warning' | 'error' | 'critical';
  
  /** Related law */
  law: string;
}

/**
 * All halt conditions
 */
export const HALT_CONDITIONS: Record<HaltCode, HaltCondition> = {
  'H-AU1': {
    code: 'H-AU1',
    message: 'Missing or ambiguous approval',
    resolution: 'Provide explicit APPROVED or EXECUTE command',
    severity: 'error',
    law: 'L-AU1',
  },
  'H-AU2': {
    code: 'H-AU2',
    message: 'Silence without auto-approve scope',
    resolution: 'Provide explicit approval or set AUTO-APPROVE:[scope]',
    severity: 'error',
    law: 'L-AU2',
  },
  'H-AB1': {
    code: 'H-AB1',
    message: 'Unbound artifact referenced',
    resolution: 'Bind artifact with BIND:[artifact] command',
    severity: 'error',
    law: 'L-AB1',
  },
  'H-AB2': {
    code: 'H-AB2',
    message: 'Resume/recover without artifact rebind',
    resolution: 'Confirm all artifacts are rebound before proceeding',
    severity: 'error',
    law: 'L-AB2',
  },
  'H-GA1': {
    code: 'H-GA1',
    message: 'Required gate not passed',
    resolution: 'Complete gate requirements before proceeding',
    severity: 'error',
    law: 'L-GA1',
  },
  'H-RA1': {
    code: 'H-RA1',
    message: 'Reality classification not declared',
    resolution: 'Declare GREENFIELD, BROWNFIELD-EXTEND, or BROWNFIELD-REPLACE',
    severity: 'error',
    law: 'L-RA1',
  },
  'H-RA2': {
    code: 'H-RA2',
    message: 'Attempted rebuild of conserved scope',
    resolution: 'Use UNLOCK:[scope] WITH JUSTIFICATION:[reason]',
    severity: 'critical',
    law: 'L-RA2',
  },
  'H-FX1': {
    code: 'H-FX1',
    message: 'Formula not bound before Blueprint phase',
    resolution: 'Create and bind Formula before proceeding',
    severity: 'error',
    law: 'L-FX2',
  },
  'H-FX4': {
    code: 'H-FX4',
    message: 'Conservation law violated',
    resolution: 'Execution cannot exceed documented scope',
    severity: 'critical',
    law: 'L-FX4',
  },
  'H-PS3': {
    code: 'H-PS3',
    message: 'Path + credentials/payment/identity detected',
    resolution: 'Redact sensitive information before proceeding',
    severity: 'critical',
    law: 'L-PS3',
  },
  'H-ST1': {
    code: 'H-ST1',
    message: 'State/HANDOFF conflict detected',
    resolution: 'Artifacts take precedence; resolve conflict manually',
    severity: 'error',
    law: 'L-AB6',
  },
};

// ============================================================================
// TASK CLASSIFICATION
// ============================================================================

/**
 * Task complexity class
 */
export type TaskClass = 'TRIVIAL' | 'SIMPLE' | 'STANDARD' | 'COMPLEX';

/**
 * Task class definition
 */
export interface TaskClassDefinition {
  /** Class identifier */
  id: TaskClass;
  
  /** Human-readable name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Typical duration */
  duration: string;
  
  /** Required formula level */
  requiredFormula: 'none' | 'minimal' | 'full' | 'full+risk';
}

/**
 * Complete task class definitions
 */
export const TASK_CLASS_DEFINITIONS: Record<TaskClass, TaskClassDefinition> = {
  TRIVIAL: {
    id: 'TRIVIAL',
    name: 'Trivial',
    description: 'Quick, reversible, no dependencies',
    duration: '<5 min',
    requiredFormula: 'none',
  },
  SIMPLE: {
    id: 'SIMPLE',
    name: 'Simple',
    description: 'Single deliverable',
    duration: '<1 hour',
    requiredFormula: 'minimal',
  },
  STANDARD: {
    id: 'STANDARD',
    name: 'Standard',
    description: 'Multi-deliverable, dependencies',
    duration: 'Hours to days',
    requiredFormula: 'full',
  },
  COMPLEX: {
    id: 'COMPLEX',
    name: 'Complex',
    description: 'Multi-session, high risk',
    duration: 'Days to weeks',
    requiredFormula: 'full+risk',
  },
};

// ============================================================================
// CONFIDENCE LEVELS
// ============================================================================

/**
 * AI confidence level
 */
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';

/**
 * Confidence level definition
 */
export interface ConfidenceLevelDefinition {
  /** Level identifier */
  id: ConfidenceLevel;
  
  /** Display indicator */
  indicator: string;
  
  /** Description */
  description: string;
}

/**
 * Complete confidence level definitions
 */
export const CONFIDENCE_DEFINITIONS: Record<ConfidenceLevel, ConfidenceLevelDefinition> = {
  HIGH: {
    id: 'HIGH',
    indicator: '🟢',
    description: 'Multiple authoritative sources',
  },
  MEDIUM: {
    id: 'MEDIUM',
    indicator: '🟡',
    description: 'Single source or inference',
  },
  LOW: {
    id: 'LOW',
    indicator: '🔴',
    description: 'AI reasoning only',
  },
  UNVERIFIED: {
    id: 'UNVERIFIED',
    indicator: '⚠️',
    description: 'Recommend verification',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get gate definition by ID
 */
export function getGateDefinition(gateId: GateID): GateDefinition {
  return GATE_DEFINITIONS[gateId];
}

/**
 * Get phase definition by ID
 */
export function getPhaseDefinition(phase: Phase): PhaseDefinition {
  return PHASE_DEFINITIONS[phase];
}

/**
 * Check if a gate is blocking
 */
export function isBlockingGate(gateId: GateID): boolean {
  return BLOCKING_GATES.includes(gateId);
}

/**
 * Check if a gate is a setup gate
 */
export function isSetupGate(gateId: GateID): boolean {
  return SETUP_GATES.includes(gateId);
}

/**
 * Get kingdom for a phase
 */
export function getKingdomForPhase(phase: Phase): Kingdom {
  return PHASE_KINGDOM_MAP[phase];
}

/**
 * Compare two phases (returns -1, 0, or 1)
 */
export function comparePhases(a: Phase, b: Phase): number {
  const orderA = PHASE_DEFINITIONS[a].order;
  const orderB = PHASE_DEFINITIONS[b].order;
  return orderA - orderB;
}

/**
 * Check if phase A is at or after phase B
 */
export function isPhaseAtOrAfter(current: Phase, target: Phase): boolean {
  return comparePhases(current, target) >= 0;
}

/**
 * Get required gates for entering a phase
 */
export function getRequiredGatesForPhase(phase: Phase): GateID[] {
  return PHASE_DEFINITIONS[phase].requiredGates;
}
