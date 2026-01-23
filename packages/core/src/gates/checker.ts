/**
 * AIXORD Gate Checker
 * 
 * Gate validation, transition checking, and blocking logic.
 * 
 * @module @aixord/core/gates/checker
 */

import type { AIXORDState, GateID, Phase, GateValue } from '../types/state';
import {
  GATE_ORDER,
  BLOCKING_GATES,
  SETUP_GATES,
  GATE_DEFINITIONS,
  PHASE_DEFINITIONS,
  type GateDefinition,
  type HaltCondition,
  HALT_CONDITIONS,
} from '../types/governance';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Gate check result
 */
export interface GateCheckResult {
  /** Whether gate is passed */
  passed: boolean;
  
  /** Gate definition */
  gate: GateDefinition;
  
  /** Reason if not passed */
  reason?: string;
  
  /** Required action to pass */
  requiredAction?: string;
  
  /** Blocking halt condition */
  haltCondition?: HaltCondition;
}

/**
 * Gate transition result
 */
export interface GateTransitionResult {
  /** Whether transition is allowed */
  allowed: boolean;
  
  /** New gate value */
  newValue: GateValue;
  
  /** Blocked by these gates */
  blockedBy?: GateID[];
  
  /** Error message */
  error?: string;
}

/**
 * Phase entry check result
 */
export interface PhaseEntryResult {
  /** Whether phase can be entered */
  allowed: boolean;
  
  /** Missing gates */
  missingGates: GateID[];
  
  /** Blocking gates (subset of missing that are blocking) */
  blockingGates: GateID[];
  
  /** Error message */
  error?: string;
}

/**
 * Execution eligibility result
 */
export interface ExecutionEligibilityResult {
  /** Whether execution is allowed */
  eligible: boolean;
  
  /** All gate statuses */
  gateStatuses: Array<{
    id: GateID;
    passed: boolean;
    required: boolean;
    blocking: boolean;
  }>;
  
  /** Blocking issues */
  blockers: string[];
  
  /** Halt condition if blocked */
  haltCondition?: HaltCondition;
}

// ============================================================================
// GATE CHECKING
// ============================================================================

/**
 * Check if a specific gate is passed
 */
export function checkGate(state: AIXORDState, gateId: GateID): GateCheckResult {
  const gate = GATE_DEFINITIONS[gateId];
  const value = state.gates[gateId];
  const passed = value === 1;
  
  if (passed) {
    return { passed: true, gate };
  }
  
  // Determine reason and required action based on gate
  let reason: string;
  let requiredAction: string;
  let haltCondition: HaltCondition | undefined;
  
  switch (gateId) {
    case 'LIC':
      reason = 'License not validated';
      requiredAction = 'Provide valid license email or authorization code';
      break;
    case 'DIS':
      reason = 'Disclaimer not accepted';
      requiredAction = 'Accept disclaimer with "I ACCEPT: [identifier]"';
      break;
    case 'TIR':
      reason = 'Platform tier not detected';
      requiredAction = 'Specify your platform tier';
      break;
    case 'ENV':
      reason = 'Environment not configured';
      requiredAction = 'Confirm environment with ENV-CONFIRMED or ENV-MODIFY';
      break;
    case 'OBJ':
      reason = 'Project objective not declared';
      requiredAction = 'Declare project objective in 1-2 sentences';
      break;
    case 'RA':
      reason = 'Reality not classified';
      requiredAction = 'Declare GREENFIELD, BROWNFIELD-EXTEND, or BROWNFIELD-REPLACE';
      haltCondition = HALT_CONDITIONS['H-RA1'];
      break;
    case 'FX':
      reason = 'Formula not bound';
      requiredAction = 'Create, approve, and bind Formula';
      haltCondition = HALT_CONDITIONS['H-FX1'];
      break;
    case 'PD':
      reason = 'Project documents not created';
      requiredAction = 'Create and save project documentation';
      break;
    case 'PR':
      reason = 'Plan review not completed';
      requiredAction = 'Complete plan analysis and review';
      break;
    case 'BP':
      reason = 'Blueprint not approved';
      requiredAction = 'Approve and save Blueprint';
      break;
    case 'MS':
      reason = 'Master scope not confirmed';
      requiredAction = 'Confirm Master Scope and DAG';
      break;
    case 'VA':
      reason = 'Validation evidence not provided';
      requiredAction = 'Provide evidence or visual audit';
      break;
    case 'HO':
      reason = 'Handoff not saved';
      requiredAction = 'Save HANDOFF document';
      break;
    default:
      reason = `Gate ${gateId} not passed`;
      requiredAction = `Complete requirements for ${gateId}`;
  }
  
  if (gate.blocking && !haltCondition) {
    haltCondition = HALT_CONDITIONS['H-GA1'];
  }
  
  return {
    passed: false,
    gate,
    reason,
    requiredAction,
    haltCondition: gate.blocking ? haltCondition : undefined,
  };
}

/**
 * Check multiple gates
 */
export function checkGates(state: AIXORDState, gateIds: GateID[]): Map<GateID, GateCheckResult> {
  const results = new Map<GateID, GateCheckResult>();
  
  for (const gateId of gateIds) {
    results.set(gateId, checkGate(state, gateId));
  }
  
  return results;
}

/**
 * Check all gates
 */
export function checkAllGates(state: AIXORDState): Map<GateID, GateCheckResult> {
  return checkGates(state, GATE_ORDER);
}

/**
 * Get all passed gates
 */
export function getPassedGates(state: AIXORDState): GateID[] {
  return GATE_ORDER.filter(gateId => state.gates[gateId] === 1);
}

/**
 * Get all failed gates
 */
export function getFailedGates(state: AIXORDState): GateID[] {
  return GATE_ORDER.filter(gateId => state.gates[gateId] === 0);
}

/**
 * Get failed blocking gates
 */
export function getFailedBlockingGates(state: AIXORDState): GateID[] {
  return BLOCKING_GATES.filter(gateId => state.gates[gateId] === 0);
}

// ============================================================================
// GATE TRANSITIONS
// ============================================================================

/**
 * Check if a gate can be transitioned (passed)
 */
export function canPassGate(state: AIXORDState, gateId: GateID): GateTransitionResult {
  const gate = GATE_DEFINITIONS[gateId];
  const currentValue = state.gates[gateId];
  
  // Already passed
  if (currentValue === 1) {
    return {
      allowed: true,
      newValue: 1,
    };
  }
  
  // Check if all prior blocking gates are passed
  const gateIndex = GATE_ORDER.indexOf(gateId);
  const blockedBy: GateID[] = [];
  
  for (let i = 0; i < gateIndex; i++) {
    const priorGateId = GATE_ORDER[i];
    if (BLOCKING_GATES.includes(priorGateId) && state.gates[priorGateId] === 0) {
      blockedBy.push(priorGateId);
    }
  }
  
  if (blockedBy.length > 0) {
    return {
      allowed: false,
      newValue: 0,
      blockedBy,
      error: `Cannot pass ${gateId}: blocked by ${blockedBy.join(', ')}`,
    };
  }
  
  return {
    allowed: true,
    newValue: 1,
  };
}

/**
 * Pass a gate (returns new gates state)
 */
export function passGate(
  state: AIXORDState,
  gateId: GateID
): { gates: AIXORDState['gates']; success: boolean; error?: string } {
  const canPass = canPassGate(state, gateId);
  
  if (!canPass.allowed) {
    return {
      gates: state.gates,
      success: false,
      error: canPass.error,
    };
  }
  
  return {
    gates: {
      ...state.gates,
      [gateId]: 1 as GateValue,
    },
    success: true,
  };
}

/**
 * Reset a gate (returns new gates state)
 * Note: This should be used carefully, mainly for testing or recovery
 */
export function resetGate(
  state: AIXORDState,
  gateId: GateID
): { gates: AIXORDState['gates']; success: boolean } {
  return {
    gates: {
      ...state.gates,
      [gateId]: 0 as GateValue,
    },
    success: true,
  };
}

// ============================================================================
// PHASE CHECKS
// ============================================================================

/**
 * Check if a phase can be entered
 */
export function canEnterPhase(state: AIXORDState, phase: Phase): PhaseEntryResult {
  const phaseDefinition = PHASE_DEFINITIONS[phase];
  const requiredGates = phaseDefinition.requiredGates;
  
  const missingGates: GateID[] = [];
  const blockingGates: GateID[] = [];
  
  for (const gateId of requiredGates) {
    if (state.gates[gateId] === 0) {
      missingGates.push(gateId);
      if (BLOCKING_GATES.includes(gateId)) {
        blockingGates.push(gateId);
      }
    }
  }
  
  if (blockingGates.length > 0) {
    return {
      allowed: false,
      missingGates,
      blockingGates,
      error: `Cannot enter ${phase}: missing blocking gates ${blockingGates.join(', ')}`,
    };
  }
  
  return {
    allowed: true,
    missingGates,
    blockingGates: [],
  };
}

/**
 * Get the next phase that can be entered
 */
export function getNextAllowedPhase(state: AIXORDState): Phase | null {
  const currentPhaseIndex = PHASE_DEFINITIONS[state.session.phase].order;
  
  // Check each subsequent phase
  const phases: Phase[] = [
    'SETUP', 'DISCOVER', 'BRAINSTORM', 'PLAN', 'BLUEPRINT',
    'SCOPE', 'EXECUTE', 'AUDIT', 'VERIFY', 'LOCK',
  ];
  
  for (let i = currentPhaseIndex + 1; i < phases.length; i++) {
    const phase = phases[i];
    const canEnter = canEnterPhase(state, phase);
    if (canEnter.allowed) {
      return phase;
    }
  }
  
  return null;
}

// ============================================================================
// EXECUTION ELIGIBILITY
// ============================================================================

/**
 * Check if execution is eligible (all required gates for EXECUTE phase)
 */
export function checkExecutionEligibility(state: AIXORDState): ExecutionEligibilityResult {
  const executePhase = PHASE_DEFINITIONS['EXECUTE'];
  const requiredGates = executePhase.requiredGates;
  const blockers: string[] = [];
  
  const gateStatuses = GATE_ORDER.map(gateId => {
    const passed = state.gates[gateId] === 1;
    const required = requiredGates.includes(gateId);
    const blocking = BLOCKING_GATES.includes(gateId);
    
    if (required && !passed) {
      blockers.push(`Gate ${gateId} not passed`);
    }
    
    return { id: gateId, passed, required, blocking };
  });
  
  // Additional checks beyond gates
  if (!state.formula.bound) {
    blockers.push('Formula not bound');
  }
  
  if (!state.reality.class) {
    blockers.push('Reality not classified');
  }
  
  if (!state.setup.complete) {
    blockers.push('Setup not complete');
  }
  
  const eligible = blockers.length === 0;
  
  return {
    eligible,
    gateStatuses,
    blockers,
    haltCondition: eligible ? undefined : HALT_CONDITIONS['H-GA1'],
  };
}

// ============================================================================
// SETUP GATES
// ============================================================================

/**
 * Get setup step for a gate
 */
export function getSetupStepForGate(gateId: GateID): number | undefined {
  return GATE_DEFINITIONS[gateId].setupStep;
}

/**
 * Get gate for a setup step
 */
export function getGateForSetupStep(step: number): GateID | undefined {
  for (const gateId of SETUP_GATES) {
    if (GATE_DEFINITIONS[gateId].setupStep === step) {
      return gateId;
    }
  }
  return undefined;
}

/**
 * Check if all setup gates are passed
 */
export function areAllSetupGatesPassed(state: AIXORDState): boolean {
  return SETUP_GATES.every(gateId => state.gates[gateId] === 1);
}

/**
 * Get current setup progress
 */
export function getSetupProgress(state: AIXORDState): {
  current: number;
  total: number;
  passed: GateID[];
  remaining: GateID[];
  currentGate?: GateID;
} {
  const passed = SETUP_GATES.filter(gateId => state.gates[gateId] === 1);
  const remaining = SETUP_GATES.filter(gateId => state.gates[gateId] === 0);
  const currentGate = remaining[0];
  
  return {
    current: passed.length,
    total: SETUP_GATES.length,
    passed,
    remaining,
    currentGate,
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Format gates as string for header display
 */
export function formatGatesForHeader(state: AIXORDState): string {
  return GATE_ORDER.map(gateId => {
    const passed = state.gates[gateId] === 1;
    return `${gateId}${passed ? '●' : '○'}`;
  }).join('');
}

/**
 * Format gates as compact string
 */
export function formatGatesCompact(state: AIXORDState): string {
  return GATE_ORDER.map(gateId => {
    return `${gateId}:${state.gates[gateId]}`;
  }).join('|');
}

/**
 * Get first blocking gate (for determining halt)
 */
export function getFirstBlockingGate(state: AIXORDState, forPhase?: Phase): GateID | null {
  const requiredGates = forPhase
    ? PHASE_DEFINITIONS[forPhase].requiredGates
    : BLOCKING_GATES;
  
  for (const gateId of requiredGates) {
    if (BLOCKING_GATES.includes(gateId) && state.gates[gateId] === 0) {
      return gateId;
    }
  }
  
  return null;
}
