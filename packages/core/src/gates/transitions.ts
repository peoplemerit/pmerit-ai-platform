/**
 * AIXORD Gate Transitions
 * 
 * State update functions for gate transitions.
 * 
 * @module @aixord/core/gates/transitions
 */

import type { AIXORDState, GateID, Phase, GateValue } from '../types/state';
import { createDefaultState } from '../types/state';
import {
  SETUP_GATES,
  PHASE_DEFINITIONS,
  PHASE_KINGDOM_MAP,
} from '../types/governance';
import { canPassGate, getGateForSetupStep, areAllSetupGatesPassed } from './checker';

// ============================================================================
// TYPES
// ============================================================================

/**
 * State update result
 */
export interface StateUpdateResult {
  /** Updated state */
  state: AIXORDState;
  
  /** Whether update was successful */
  success: boolean;
  
  /** Error message if failed */
  error?: string;
  
  /** Gates that were updated */
  updatedGates?: GateID[];
  
  /** Phase transition that occurred */
  phaseTransition?: {
    from: Phase;
    to: Phase;
  };
}

// ============================================================================
// GATE UPDATES
// ============================================================================

/**
 * Update a single gate and handle side effects
 */
export function updateGate(
  state: AIXORDState,
  gateId: GateID,
  value: GateValue
): StateUpdateResult {
  // Check if we can pass this gate
  if (value === 1) {
    const canPass = canPassGate(state, gateId);
    if (!canPass.allowed) {
      return {
        state,
        success: false,
        error: canPass.error,
      };
    }
  }
  
  // Update the gate
  const newGates = {
    ...state.gates,
    [gateId]: value,
  };
  
  let newState: AIXORDState = {
    ...state,
    gates: newGates,
    updatedAt: new Date().toISOString(),
  };
  
  // Handle setup gate side effects
  if (SETUP_GATES.includes(gateId) && value === 1) {
    newState = handleSetupGatePass(newState, gateId);
  }
  
  return {
    state: newState,
    success: true,
    updatedGates: [gateId],
  };
}

/**
 * Handle setup gate pass side effects
 */
function handleSetupGatePass(state: AIXORDState, gateId: GateID): AIXORDState {
  let newState = { ...state };
  
  // Sync setup gates with main gates
  switch (gateId) {
    case 'LIC':
      newState.setup = {
        ...newState.setup,
        gates: { ...newState.setup.gates, license: true },
      };
      break;
    case 'DIS':
      newState.setup = {
        ...newState.setup,
        gates: { ...newState.setup.gates, disclaimer: true },
      };
      break;
    case 'TIR':
      newState.setup = {
        ...newState.setup,
        gates: { ...newState.setup.gates, tier: true },
      };
      break;
    case 'ENV':
      newState.setup = {
        ...newState.setup,
        gates: { ...newState.setup.gates, environment: true },
      };
      break;
    case 'OBJ':
      newState.setup = {
        ...newState.setup,
        gates: { ...newState.setup.gates, objective: true },
      };
      break;
    case 'RA':
      newState.setup = {
        ...newState.setup,
        gates: { ...newState.setup.gates, reality: true },
      };
      break;
  }
  
  // Advance setup step if appropriate
  const setupStep = SETUP_GATES.indexOf(gateId) + 1;
  if (setupStep > newState.setup.currentStep) {
    newState.setup = {
      ...newState.setup,
      currentStep: Math.min(setupStep + 1, 9),
    };
  }
  
  // Check if setup is complete
  if (areAllSetupGatesPassed(newState)) {
    newState.setup = {
      ...newState.setup,
      complete: true,
      currentStep: 9,
    };
    
    // Transition to DISCOVER phase
    newState.session = {
      ...newState.session,
      phase: 'DISCOVER',
      kingdom: 'IDEATION',
    };
  }
  
  return newState;
}

// ============================================================================
// PHASE TRANSITIONS
// ============================================================================

/**
 * Transition to a new phase
 */
export function transitionPhase(
  state: AIXORDState,
  newPhase: Phase
): StateUpdateResult {
  const phaseDef = PHASE_DEFINITIONS[newPhase];
  const currentPhaseDef = PHASE_DEFINITIONS[state.session.phase];
  
  // Check if all required gates are passed
  for (const gateId of phaseDef.requiredGates) {
    if (state.gates[gateId] !== 1) {
      return {
        state,
        success: false,
        error: `Cannot enter ${newPhase}: gate ${gateId} not passed`,
      };
    }
  }
  
  // Check phase ordering (can't skip forward too much or go backward without acknowledgment)
  if (phaseDef.order < currentPhaseDef.order) {
    // Regression - allowed but should be tracked
    console.warn(`Phase regression from ${state.session.phase} to ${newPhase}`);
  }
  
  const newKingdom = PHASE_KINGDOM_MAP[newPhase];
  
  const newState: AIXORDState = {
    ...state,
    session: {
      ...state.session,
      phase: newPhase,
      kingdom: newKingdom,
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
    phaseTransition: {
      from: state.session.phase,
      to: newPhase,
    },
  };
}

// ============================================================================
// SETUP TRANSITIONS
// ============================================================================

/**
 * Advance to next setup step
 */
export function advanceSetupStep(state: AIXORDState): StateUpdateResult {
  if (state.setup.complete) {
    return {
      state,
      success: false,
      error: 'Setup is already complete',
    };
  }
  
  const currentStep = state.setup.currentStep;
  const currentGateId = getGateForSetupStep(currentStep);
  
  if (currentGateId && state.gates[currentGateId] !== 1) {
    return {
      state,
      success: false,
      error: `Current setup step gate ${currentGateId} not passed`,
    };
  }
  
  const nextStep = Math.min(currentStep + 1, 9);
  
  const newState: AIXORDState = {
    ...state,
    setup: {
      ...state.setup,
      currentStep: nextStep,
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
  };
}

/**
 * Complete setup (all 9 steps done)
 */
export function completeSetup(state: AIXORDState): StateUpdateResult {
  // Verify all setup gates are passed
  if (!areAllSetupGatesPassed(state)) {
    return {
      state,
      success: false,
      error: 'Not all setup gates are passed',
    };
  }
  
  const newState: AIXORDState = {
    ...state,
    setup: {
      ...state.setup,
      complete: true,
      currentStep: 9,
    },
    session: {
      ...state.session,
      phase: 'DISCOVER',
      kingdom: 'IDEATION',
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
    phaseTransition: {
      from: 'SETUP',
      to: 'DISCOVER',
    },
  };
}

// ============================================================================
// LICENSE UPDATES
// ============================================================================

/**
 * Set license validated
 */
export function setLicenseValidated(
  state: AIXORDState,
  identifier: string,
  type: 'STANDARD' | 'MASTER' | 'TEST' | 'GIFT'
): StateUpdateResult {
  const newState: AIXORDState = {
    ...state,
    license: {
      identifier,
      type,
      validated: true,
      validatedDate: new Date().toISOString(),
    },
    gates: {
      ...state.gates,
      LIC: 1,
    },
    setup: {
      ...state.setup,
      gates: {
        ...state.setup.gates,
        license: true,
      },
      currentStep: state.setup.currentStep === 1 ? 2 : state.setup.currentStep,
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
    updatedGates: ['LIC'],
  };
}

// ============================================================================
// DISCLAIMER UPDATES
// ============================================================================

/**
 * Set disclaimer accepted
 */
export function setDisclaimerAccepted(
  state: AIXORDState,
  acceptedIdentifier: string
): StateUpdateResult {
  const newState: AIXORDState = {
    ...state,
    disclaimer: {
      accepted: true,
      acceptedDate: new Date().toISOString(),
      acceptedIdentifier,
    },
    gates: {
      ...state.gates,
      DIS: 1,
    },
    setup: {
      ...state.setup,
      gates: {
        ...state.setup.gates,
        disclaimer: true,
      },
      currentStep: state.setup.currentStep === 2 ? 3 : state.setup.currentStep,
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
    updatedGates: ['DIS'],
  };
}

// ============================================================================
// REALITY UPDATES
// ============================================================================

/**
 * Set reality classification
 */
export function setRealityClassification(
  state: AIXORDState,
  realityClass: 'GREENFIELD' | 'BROWNFIELD-EXTEND' | 'BROWNFIELD-REPLACE',
  conservedScopes: string[] = [],
  replaceableScopes: string[] = []
): StateUpdateResult {
  const newState: AIXORDState = {
    ...state,
    reality: {
      class: realityClass,
      conservedScopes,
      replaceableScopes,
      unlockedScopes: [],
    },
    gates: {
      ...state.gates,
      RA: 1,
    },
    setup: {
      ...state.setup,
      gates: {
        ...state.setup.gates,
        reality: true,
      },
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
    updatedGates: ['RA'],
  };
}

/**
 * Unlock a conserved scope
 */
export function unlockConservedScope(
  state: AIXORDState,
  scope: string,
  _justification: string // Logged but not stored in state
): StateUpdateResult {
  if (!state.reality.conservedScopes.includes(scope)) {
    return {
      state,
      success: false,
      error: `Scope "${scope}" is not in conserved scopes`,
    };
  }
  
  if (state.reality.unlockedScopes.includes(scope)) {
    return {
      state,
      success: false,
      error: `Scope "${scope}" is already unlocked`,
    };
  }
  
  const newState: AIXORDState = {
    ...state,
    reality: {
      ...state.reality,
      unlockedScopes: [...state.reality.unlockedScopes, scope],
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
  };
}

// ============================================================================
// FORMULA UPDATES
// ============================================================================

/**
 * Set formula approved
 */
export function setFormulaApproved(state: AIXORDState): StateUpdateResult {
  const newState: AIXORDState = {
    ...state,
    formula: {
      ...state.formula,
      approved: true,
      approvedDate: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
  };
}

/**
 * Set formula bound
 */
export function setFormulaBound(state: AIXORDState): StateUpdateResult {
  if (!state.formula.approved) {
    return {
      state,
      success: false,
      error: 'Formula must be approved before binding',
    };
  }
  
  const newState: AIXORDState = {
    ...state,
    formula: {
      ...state.formula,
      bound: true,
      boundDate: new Date().toISOString(),
    },
    gates: {
      ...state.gates,
      FX: 1,
    },
    bindings: {
      ...state.bindings,
      formula: {
        bound: true,
        timestamp: new Date().toISOString(),
      },
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
    updatedGates: ['FX'],
  };
}

// ============================================================================
// SESSION UPDATES
// ============================================================================

/**
 * Increment message count
 */
export function incrementMessageCount(state: AIXORDState): StateUpdateResult {
  const newState: AIXORDState = {
    ...state,
    session: {
      ...state.session,
      messageCount: state.session.messageCount + 1,
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
  };
}

/**
 * Start new session (after handoff)
 */
export function startNewSession(
  state: AIXORDState,
  provider: string
): StateUpdateResult {
  const newState: AIXORDState = {
    ...state,
    session: {
      ...state.session,
      number: state.session.number + 1,
      messageCount: 0,
      provider,
      startedAt: new Date().toISOString(),
    },
    // Reset artifact bindings - they need to be rebound
    bindings: {
      projectDocs: { bound: false },
      formula: { bound: false },
      blueprint: { bound: false },
      masterScope: { bound: false },
      dag: { bound: false },
    },
    // Formula remains conceptually bound but artifact needs rebind
    formula: {
      ...state.formula,
      bound: false, // Needs rebind confirmation
    },
    gates: {
      ...state.gates,
      HO: 0, // Reset handoff gate
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
  };
}

/**
 * Set execution mode
 */
export function setExecutionMode(
  state: AIXORDState,
  mode: 'STRICT' | 'SUPERVISED' | 'SANDBOX'
): StateUpdateResult {
  const newState: AIXORDState = {
    ...state,
    session: {
      ...state.session,
      mode,
    },
    updatedAt: new Date().toISOString(),
  };
  
  return {
    state: newState,
    success: true,
  };
}
