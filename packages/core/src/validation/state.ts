/**
 * AIXORD State Validation
 * 
 * Business rule validation for AIXORD state beyond schema validation.
 * Checks gate dependencies, phase consistency, artifact bindings, etc.
 * 
 * @module @aixord/core/validation/state
 */

import type { AIXORDState, GateID, Phase, RealityClass } from '../types/state';
import { PHASE_ORDER, isPhase, isGateID } from '../types/state';
import {
  BLOCKING_GATES,
  GATE_ORDER,
  PHASE_DEFINITIONS,
  PHASE_KINGDOM_MAP,
  getRequiredGatesForPhase,
  isPhaseAtOrAfter,
} from '../types/governance';
import type { HaltCode } from '../types/governance';

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

/**
 * Single validation error
 */
export interface ValidationError {
  /** Error code */
  code: string;
  
  /** Field path (e.g., 'gates.FX') */
  path: string;
  
  /** Human-readable message */
  message: string;
  
  /** Severity */
  severity: 'error' | 'warning';
  
  /** Related halt code (if applicable) */
  haltCode?: HaltCode;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether state is valid */
  valid: boolean;
  
  /** Validation errors */
  errors: ValidationError[];
  
  /** Validation warnings */
  warnings: ValidationError[];
}

// ============================================================================
// VALIDATORS
// ============================================================================

/**
 * Validate setup completion consistency
 */
export function validateSetupConsistency(state: AIXORDState): ValidationError[] {
  const errors: ValidationError[] = [];
  const { setup, gates } = state;
  
  // If setup is complete, all setup gates should be true
  if (setup.complete) {
    if (!setup.gates.license) {
      errors.push({
        code: 'SETUP_INCONSISTENT',
        path: 'setup.gates.license',
        message: 'Setup marked complete but license gate not passed',
        severity: 'error',
      });
    }
    if (!setup.gates.disclaimer) {
      errors.push({
        code: 'SETUP_INCONSISTENT',
        path: 'setup.gates.disclaimer',
        message: 'Setup marked complete but disclaimer gate not passed',
        severity: 'error',
      });
    }
    if (!setup.gates.tier) {
      errors.push({
        code: 'SETUP_INCONSISTENT',
        path: 'setup.gates.tier',
        message: 'Setup marked complete but tier gate not passed',
        severity: 'error',
      });
    }
    if (!setup.gates.environment) {
      errors.push({
        code: 'SETUP_INCONSISTENT',
        path: 'setup.gates.environment',
        message: 'Setup marked complete but environment gate not passed',
        severity: 'error',
      });
    }
    if (!setup.gates.objective) {
      errors.push({
        code: 'SETUP_INCONSISTENT',
        path: 'setup.gates.objective',
        message: 'Setup marked complete but objective gate not passed',
        severity: 'error',
      });
    }
    if (!setup.gates.reality) {
      errors.push({
        code: 'SETUP_INCONSISTENT',
        path: 'setup.gates.reality',
        message: 'Setup marked complete but reality gate not passed',
        severity: 'error',
      });
    }
    
    // Verify main gates match setup gates
    if (gates.LIC !== 1) {
      errors.push({
        code: 'GATE_SYNC_ERROR',
        path: 'gates.LIC',
        message: 'Setup license passed but main gate not synced',
        severity: 'error',
      });
    }
    if (gates.DIS !== 1) {
      errors.push({
        code: 'GATE_SYNC_ERROR',
        path: 'gates.DIS',
        message: 'Setup disclaimer passed but main gate not synced',
        severity: 'error',
      });
    }
  }
  
  // Setup step should be 1-9
  if (setup.currentStep < 1 || setup.currentStep > 9) {
    errors.push({
      code: 'INVALID_SETUP_STEP',
      path: 'setup.currentStep',
      message: `Setup step must be 1-9, got ${setup.currentStep}`,
      severity: 'error',
    });
  }
  
  return errors;
}

/**
 * Validate license state
 */
export function validateLicenseState(state: AIXORDState): ValidationError[] {
  const errors: ValidationError[] = [];
  const { license, gates } = state;
  
  // If license is validated, should have identifier and type
  if (license.validated) {
    if (!license.identifier) {
      errors.push({
        code: 'LICENSE_MISSING_IDENTIFIER',
        path: 'license.identifier',
        message: 'License validated but no identifier provided',
        severity: 'error',
      });
    }
    if (!license.type) {
      errors.push({
        code: 'LICENSE_MISSING_TYPE',
        path: 'license.type',
        message: 'License validated but no type set',
        severity: 'error',
      });
    }
    
    // Gate should be passed
    if (gates.LIC !== 1) {
      errors.push({
        code: 'GATE_LICENSE_MISMATCH',
        path: 'gates.LIC',
        message: 'License validated but gate not passed',
        severity: 'error',
      });
    }
  }
  
  return errors;
}

/**
 * Validate reality state
 */
export function validateRealityState(state: AIXORDState): ValidationError[] {
  const errors: ValidationError[] = [];
  const { reality, gates, session } = state;
  
  // If past setup, reality must be classified
  if (session.phase !== 'SETUP' && !reality.class) {
    errors.push({
      code: 'REALITY_NOT_CLASSIFIED',
      path: 'reality.class',
      message: 'Reality not classified but phase is past SETUP',
      severity: 'error',
      haltCode: 'H-RA1',
    });
  }
  
  // If brownfield, should have scope lists
  if (reality.class === 'BROWNFIELD-EXTEND' || reality.class === 'BROWNFIELD-REPLACE') {
    if (reality.conservedScopes.length === 0 && reality.replaceableScopes.length === 0) {
      errors.push({
        code: 'BROWNFIELD_NO_SCOPES',
        path: 'reality.conservedScopes',
        message: 'Brownfield reality declared but no scopes listed',
        severity: 'warning',
      });
    }
  }
  
  // Unlocked scopes should be subset of conserved
  for (const scope of reality.unlockedScopes) {
    if (!reality.conservedScopes.includes(scope)) {
      errors.push({
        code: 'UNLOCKED_NOT_CONSERVED',
        path: 'reality.unlockedScopes',
        message: `Unlocked scope "${scope}" not in conserved scopes`,
        severity: 'error',
      });
    }
  }
  
  // Reality gate consistency
  if (reality.class && gates.RA !== 1) {
    errors.push({
      code: 'GATE_REALITY_MISMATCH',
      path: 'gates.RA',
      message: 'Reality classified but gate not passed',
      severity: 'error',
    });
  }
  
  return errors;
}

/**
 * Validate formula state
 */
export function validateFormulaState(state: AIXORDState): ValidationError[] {
  const errors: ValidationError[] = [];
  const { formula, gates, session, bindings } = state;
  
  // Formula must be bound before Blueprint phase
  if (isPhaseAtOrAfter(session.phase, 'BLUEPRINT') && !formula.bound) {
    errors.push({
      code: 'FORMULA_NOT_BOUND',
      path: 'formula.bound',
      message: 'Formula not bound but phase is at or past BLUEPRINT',
      severity: 'error',
      haltCode: 'H-FX1',
    });
  }
  
  // If formula is bound, should be approved
  if (formula.bound && !formula.approved) {
    errors.push({
      code: 'FORMULA_NOT_APPROVED',
      path: 'formula.approved',
      message: 'Formula bound but not approved',
      severity: 'warning',
    });
  }
  
  // Formula binding should match artifact binding
  if (formula.bound && !bindings.formula.bound) {
    errors.push({
      code: 'FORMULA_BINDING_MISMATCH',
      path: 'bindings.formula.bound',
      message: 'Formula state shows bound but artifact not bound',
      severity: 'error',
    });
  }
  
  // Gate consistency
  if (formula.bound && gates.FX !== 1) {
    errors.push({
      code: 'GATE_FORMULA_MISMATCH',
      path: 'gates.FX',
      message: 'Formula bound but gate not passed',
      severity: 'error',
    });
  }
  
  return errors;
}

/**
 * Validate gate dependencies and ordering
 */
export function validateGateDependencies(state: AIXORDState): ValidationError[] {
  const errors: ValidationError[] = [];
  const { gates } = state;
  
  // Check that blocking gates are passed in order
  let lastPassedIndex = -1;
  
  for (let i = 0; i < GATE_ORDER.length; i++) {
    const gateId = GATE_ORDER[i];
    const gateValue = gates[gateId];
    
    if (gateValue === 1) {
      // Check that all prior blocking gates are passed
      for (let j = 0; j < i; j++) {
        const priorGateId = GATE_ORDER[j];
        if (BLOCKING_GATES.includes(priorGateId) && gates[priorGateId] === 0) {
          errors.push({
            code: 'GATE_ORDER_VIOLATION',
            path: `gates.${gateId}`,
            message: `Gate ${gateId} passed but prior blocking gate ${priorGateId} not passed`,
            severity: 'error',
            haltCode: 'H-GA1',
          });
        }
      }
      lastPassedIndex = i;
    }
  }
  
  return errors;
}

/**
 * Validate phase for required gates
 */
export function validatePhaseGates(state: AIXORDState): ValidationError[] {
  const errors: ValidationError[] = [];
  const { session, gates } = state;
  const { phase } = session;
  
  // Get required gates for current phase
  const requiredGates = getRequiredGatesForPhase(phase);
  
  for (const gateId of requiredGates) {
    if (gates[gateId] !== 1) {
      errors.push({
        code: 'PHASE_GATE_NOT_MET',
        path: `gates.${gateId}`,
        message: `Phase ${phase} requires gate ${gateId} but it is not passed`,
        severity: 'error',
        haltCode: 'H-GA1',
      });
    }
  }
  
  return errors;
}

/**
 * Validate session state
 */
export function validateSessionState(state: AIXORDState): ValidationError[] {
  const errors: ValidationError[] = [];
  const { session } = state;
  
  // Phase-Kingdom consistency
  const expectedKingdom = PHASE_KINGDOM_MAP[session.phase];
  if (session.kingdom !== expectedKingdom) {
    errors.push({
      code: 'KINGDOM_PHASE_MISMATCH',
      path: 'session.kingdom',
      message: `Phase ${session.phase} should have kingdom "${expectedKingdom}" but has "${session.kingdom}"`,
      severity: 'warning',
    });
  }
  
  // Session number should be positive
  if (session.number < 1) {
    errors.push({
      code: 'INVALID_SESSION_NUMBER',
      path: 'session.number',
      message: `Session number must be >= 1, got ${session.number}`,
      severity: 'error',
    });
  }
  
  // Message count should not be negative
  if (session.messageCount < 0) {
    errors.push({
      code: 'INVALID_MESSAGE_COUNT',
      path: 'session.messageCount',
      message: `Message count cannot be negative, got ${session.messageCount}`,
      severity: 'error',
    });
  }
  
  return errors;
}

/**
 * Validate artifact bindings
 */
export function validateBindings(state: AIXORDState): ValidationError[] {
  const errors: ValidationError[] = [];
  const { bindings, session, gates } = state;
  
  // Check phase-required bindings
  if (isPhaseAtOrAfter(session.phase, 'BLUEPRINT')) {
    if (gates.PD === 1 && !bindings.projectDocs.bound) {
      errors.push({
        code: 'BINDING_MISSING',
        path: 'bindings.projectDocs',
        message: 'Project docs gate passed but artifact not bound',
        severity: 'warning',
      });
    }
  }
  
  if (isPhaseAtOrAfter(session.phase, 'SCOPE')) {
    if (gates.BP === 1 && !bindings.blueprint.bound) {
      errors.push({
        code: 'BINDING_MISSING',
        path: 'bindings.blueprint',
        message: 'Blueprint gate passed but artifact not bound',
        severity: 'warning',
      });
    }
  }
  
  if (isPhaseAtOrAfter(session.phase, 'EXECUTE')) {
    if (gates.MS === 1 && !bindings.masterScope.bound) {
      errors.push({
        code: 'BINDING_MISSING',
        path: 'bindings.masterScope',
        message: 'Master scope gate passed but artifact not bound',
        severity: 'warning',
      });
    }
  }
  
  // Bound artifacts should have timestamps
  for (const [key, binding] of Object.entries(bindings)) {
    if (binding.bound && !binding.timestamp) {
      errors.push({
        code: 'BINDING_NO_TIMESTAMP',
        path: `bindings.${key}.timestamp`,
        message: `Artifact ${key} is bound but has no timestamp`,
        severity: 'warning',
      });
    }
  }
  
  return errors;
}

/**
 * Validate project info
 */
export function validateProjectInfo(state: AIXORDState): ValidationError[] {
  const errors: ValidationError[] = [];
  const { project, setup, gates } = state;
  
  // If objective gate passed, should have objective
  if (gates.OBJ === 1 && !project.objective) {
    errors.push({
      code: 'PROJECT_NO_OBJECTIVE',
      path: 'project.objective',
      message: 'Objective gate passed but no objective set',
      severity: 'error',
    });
  }
  
  // Objective should not be empty if setup.gates.objective is true
  if (setup.gates.objective && !project.objective.trim()) {
    errors.push({
      code: 'PROJECT_EMPTY_OBJECTIVE',
      path: 'project.objective',
      message: 'Objective marked complete but is empty',
      severity: 'error',
    });
  }
  
  return errors;
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Validate complete AIXORD state
 */
export function validateAIXORDState(state: AIXORDState): ValidationResult {
  const allErrors: ValidationError[] = [];
  
  // Run all validators
  allErrors.push(...validateSetupConsistency(state));
  allErrors.push(...validateLicenseState(state));
  allErrors.push(...validateRealityState(state));
  allErrors.push(...validateFormulaState(state));
  allErrors.push(...validateGateDependencies(state));
  allErrors.push(...validatePhaseGates(state));
  allErrors.push(...validateSessionState(state));
  allErrors.push(...validateBindings(state));
  allErrors.push(...validateProjectInfo(state));
  
  // Separate errors and warnings
  const errors = allErrors.filter(e => e.severity === 'error');
  const warnings = allErrors.filter(e => e.severity === 'warning');
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if state is valid (quick check)
 */
export function isValidState(state: AIXORDState): boolean {
  const result = validateAIXORDState(state);
  return result.valid;
}

/**
 * Get blocking errors (errors that would cause HALT)
 */
export function getBlockingErrors(state: AIXORDState): ValidationError[] {
  const result = validateAIXORDState(state);
  return result.errors.filter(e => e.haltCode);
}
