/**
 * AIXORD Formula Conservation
 * 
 * Implementation of the AIXORD Conservation Law:
 * EXECUTION_TOTAL = VERIFIED_REALITY + FORMULA_EXECUTION
 * 
 * @module @aixord/core/formula/conservation
 */

import type { AIXORDState, RealityClass } from '../types/state';
import type { HaltCode } from '../types/governance';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Scope status in conservation context
 */
export type ScopeStatus = 'CONSERVED' | 'UNLOCKED' | 'REPLACEABLE' | 'NEW';

/**
 * Scope definition for conservation tracking
 */
export interface Scope {
  /** Scope identifier */
  id: string;
  
  /** Scope name */
  name: string;
  
  /** Conservation status */
  status: ScopeStatus;
  
  /** Whether scope exists in verified reality */
  inVerifiedReality: boolean;
  
  /** Whether scope is in formula execution */
  inFormulaExecution: boolean;
}

/**
 * Conservation check result
 */
export interface ConservationCheckResult {
  /** Whether conservation law is satisfied */
  satisfied: boolean;
  
  /** Violation details if not satisfied */
  violation?: ConservationViolation;
  
  /** Scope breakdown */
  breakdown: {
    verifiedReality: Scope[];
    formulaExecution: Scope[];
    total: Scope[];
  };
}

/**
 * Conservation violation details
 */
export interface ConservationViolation {
  /** Violation type */
  type: 'CONSERVED_REBUILD' | 'UNDOCUMENTED_EXECUTION' | 'SCOPE_MISMATCH';
  
  /** Violation message */
  message: string;
  
  /** Affected scopes */
  affectedScopes: string[];
  
  /** Resolution */
  resolution: string;
  
  /** Halt code */
  haltCode: HaltCode;
}

/**
 * Execution request for validation
 */
export interface ExecutionRequest {
  /** Requested scope ID */
  scopeId: string;
  
  /** Action type */
  action: 'CREATE' | 'MODIFY' | 'DELETE' | 'REBUILD';
  
  /** Description */
  description?: string;
}

// ============================================================================
// CONSERVATION CHECKER
// ============================================================================

/**
 * Check if an execution request satisfies conservation law
 */
export function checkConservation(
  state: AIXORDState,
  request: ExecutionRequest
): ConservationCheckResult {
  const { reality } = state;
  
  // Greenfield: everything is new, no conservation constraints
  if (reality.class === 'GREENFIELD') {
    return {
      satisfied: true,
      breakdown: {
        verifiedReality: [],
        formulaExecution: [
          {
            id: request.scopeId,
            name: request.scopeId,
            status: 'NEW',
            inVerifiedReality: false,
            inFormulaExecution: true,
          },
        ],
        total: [
          {
            id: request.scopeId,
            name: request.scopeId,
            status: 'NEW',
            inVerifiedReality: false,
            inFormulaExecution: true,
          },
        ],
      },
    };
  }
  
  // Brownfield: check conservation constraints
  const isConserved = reality.conservedScopes.includes(request.scopeId);
  const isUnlocked = reality.unlockedScopes.includes(request.scopeId);
  const isReplaceable = reality.replaceableScopes.includes(request.scopeId);
  
  // Check for conserved scope rebuild without unlock
  if (isConserved && !isUnlocked && request.action === 'REBUILD') {
    return {
      satisfied: false,
      violation: {
        type: 'CONSERVED_REBUILD',
        message: `Scope "${request.scopeId}" is CONSERVED and cannot be rebuilt without explicit unlock`,
        affectedScopes: [request.scopeId],
        resolution: `Issue: UNLOCK: ${request.scopeId} WITH JUSTIFICATION: [reason]`,
        haltCode: 'H-RA2',
      },
      breakdown: buildBreakdown(state, request.scopeId),
    };
  }
  
  // Check for modification of conserved scope
  if (isConserved && !isUnlocked && request.action === 'MODIFY') {
    // Modification of conserved scope is only allowed if extending
    if (reality.class === 'BROWNFIELD-EXTEND') {
      // Extension is okay - we're adding to, not modifying core
      return {
        satisfied: true,
        breakdown: buildBreakdown(state, request.scopeId),
      };
    }
    
    // In BROWNFIELD-REPLACE, modification of conserved (non-replaceable) is violation
    return {
      satisfied: false,
      violation: {
        type: 'CONSERVED_REBUILD',
        message: `Scope "${request.scopeId}" is CONSERVED and cannot be modified`,
        affectedScopes: [request.scopeId],
        resolution: `Issue: UNLOCK: ${request.scopeId} WITH JUSTIFICATION: [reason]`,
        haltCode: 'H-RA2',
      },
      breakdown: buildBreakdown(state, request.scopeId),
    };
  }
  
  // Replaceable scope can be rebuilt/modified
  if (isReplaceable && (request.action === 'REBUILD' || request.action === 'MODIFY')) {
    return {
      satisfied: true,
      breakdown: buildBreakdown(state, request.scopeId),
    };
  }
  
  // Unlocked scope can be rebuilt/modified
  if (isUnlocked && (request.action === 'REBUILD' || request.action === 'MODIFY')) {
    return {
      satisfied: true,
      breakdown: buildBreakdown(state, request.scopeId),
    };
  }
  
  // New scope (not in verified reality)
  if (!isConserved && !isReplaceable) {
    return {
      satisfied: true,
      breakdown: buildBreakdown(state, request.scopeId),
    };
  }
  
  // Default: satisfied
  return {
    satisfied: true,
    breakdown: buildBreakdown(state, request.scopeId),
  };
}

/**
 * Build scope breakdown for a given scope
 */
function buildBreakdown(
  state: AIXORDState,
  targetScopeId: string
): ConservationCheckResult['breakdown'] {
  const { reality } = state;
  
  const verifiedReality: Scope[] = [
    ...reality.conservedScopes.map(id => ({
      id,
      name: id,
      status: reality.unlockedScopes.includes(id) ? 'UNLOCKED' as const : 'CONSERVED' as const,
      inVerifiedReality: true,
      inFormulaExecution: false,
    })),
    ...reality.replaceableScopes.map(id => ({
      id,
      name: id,
      status: 'REPLACEABLE' as const,
      inVerifiedReality: true,
      inFormulaExecution: true, // Can be in formula execution
    })),
  ];
  
  const isInVerified = reality.conservedScopes.includes(targetScopeId) ||
                       reality.replaceableScopes.includes(targetScopeId);
  
  const formulaExecution: Scope[] = isInVerified
    ? []
    : [{
        id: targetScopeId,
        name: targetScopeId,
        status: 'NEW',
        inVerifiedReality: false,
        inFormulaExecution: true,
      }];
  
  return {
    verifiedReality,
    formulaExecution,
    total: [...verifiedReality, ...formulaExecution],
  };
}

// ============================================================================
// CONSERVATION VALIDATION
// ============================================================================

/**
 * Validate that execution stays within conservation bounds
 */
export function validateConservation(state: AIXORDState): {
  valid: boolean;
  issues: ConservationViolation[];
} {
  const issues: ConservationViolation[] = [];
  
  // Check for basic consistency
  if (state.reality.class === 'GREENFIELD') {
    // Greenfield should not have conserved scopes
    if (state.reality.conservedScopes.length > 0) {
      issues.push({
        type: 'SCOPE_MISMATCH',
        message: 'GREENFIELD reality should not have conserved scopes',
        affectedScopes: state.reality.conservedScopes,
        resolution: 'Remove conserved scopes or change reality classification',
        haltCode: 'H-FX4',
      });
    }
  }
  
  // Check that unlocked scopes are subset of conserved
  for (const scope of state.reality.unlockedScopes) {
    if (!state.reality.conservedScopes.includes(scope)) {
      issues.push({
        type: 'SCOPE_MISMATCH',
        message: `Unlocked scope "${scope}" is not in conserved scopes`,
        affectedScopes: [scope],
        resolution: 'Add scope to conserved list or remove from unlocked',
        haltCode: 'H-FX4',
      });
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================================================
// SCOPE MANAGEMENT
// ============================================================================

/**
 * Get scope status
 */
export function getScopeStatus(state: AIXORDState, scopeId: string): ScopeStatus {
  const { reality } = state;
  
  if (reality.class === 'GREENFIELD') {
    return 'NEW';
  }
  
  if (reality.unlockedScopes.includes(scopeId)) {
    return 'UNLOCKED';
  }
  
  if (reality.conservedScopes.includes(scopeId)) {
    return 'CONSERVED';
  }
  
  if (reality.replaceableScopes.includes(scopeId)) {
    return 'REPLACEABLE';
  }
  
  return 'NEW';
}

/**
 * Check if scope can be modified
 */
export function canModifyScope(state: AIXORDState, scopeId: string): boolean {
  const status = getScopeStatus(state, scopeId);
  return status !== 'CONSERVED';
}

/**
 * Check if scope can be rebuilt
 */
export function canRebuildScope(state: AIXORDState, scopeId: string): boolean {
  const status = getScopeStatus(state, scopeId);
  return status === 'NEW' || status === 'UNLOCKED' || status === 'REPLACEABLE';
}

/**
 * Get all modifiable scopes
 */
export function getModifiableScopes(state: AIXORDState): string[] {
  const { reality } = state;
  
  if (reality.class === 'GREENFIELD') {
    return []; // All scopes are new in greenfield
  }
  
  return [
    ...reality.unlockedScopes,
    ...reality.replaceableScopes,
  ];
}

/**
 * Get conservation summary
 */
export function getConservationSummary(state: AIXORDState): {
  reality: RealityClass | '';
  conserved: number;
  unlocked: number;
  replaceable: number;
  formula: string;
} {
  const { reality } = state;
  
  return {
    reality: reality.class,
    conserved: reality.conservedScopes.length,
    unlocked: reality.unlockedScopes.length,
    replaceable: reality.replaceableScopes.length,
    formula: reality.class === 'GREENFIELD'
      ? 'EXECUTION = FORMULA (no verified reality)'
      : `EXECUTION = VERIFIED[${reality.conservedScopes.length}] + FORMULA`,
  };
}
