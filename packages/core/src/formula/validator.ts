/**
 * AIXORD Formula Validator
 * 
 * Validates the AIXORD Formula chain:
 * Project_Docs → Master_Scope → Deliverables → Steps → Production-Ready System
 * 
 * @module @aixord/core/formula/validator
 */

import type { AIXORDState } from '../types/state';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Formula element in the chain
 */
export type FormulaElement = 
  | 'PROJECT_DOCS'
  | 'MASTER_SCOPE'
  | 'DELIVERABLES'
  | 'STEPS'
  | 'SYSTEM';

/**
 * Formula chain order
 */
export const FORMULA_CHAIN: FormulaElement[] = [
  'PROJECT_DOCS',
  'MASTER_SCOPE',
  'DELIVERABLES',
  'STEPS',
  'SYSTEM',
];

/**
 * Deliverable definition
 */
export interface Deliverable {
  /** Deliverable ID (e.g., D1, D2) */
  id: string;
  
  /** Deliverable name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Status */
  status: DeliverableStatus;
  
  /** Steps */
  steps: Step[];
  
  /** Dependencies (other deliverable IDs) */
  dependencies: string[];
}

/**
 * Deliverable status
 */
export type DeliverableStatus = 
  | 'PENDING'
  | 'ACTIVE'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'LOCKED';

/**
 * Step definition
 */
export interface Step {
  /** Step ID (e.g., D1.S1, D1.S2) */
  id: string;
  
  /** Step name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Status */
  status: StepStatus;
  
  /** Output artifact */
  output?: string;
}

/**
 * Step status
 */
export type StepStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SKIPPED';

/**
 * Master scope structure
 */
export interface MasterScope {
  /** Project name */
  project: string;
  
  /** Objective */
  objective: string;
  
  /** All deliverables */
  deliverables: Deliverable[];
  
  /** External dependencies */
  externalDependencies?: string[];
  
  /** Quality requirements */
  qualityRequirements?: string[];
}

/**
 * Formula validation result
 */
export interface FormulaValidationResult {
  /** Whether formula is valid */
  valid: boolean;
  
  /** Validation errors */
  errors: FormulaError[];
  
  /** Validation warnings */
  warnings: FormulaWarning[];
  
  /** Chain status */
  chainStatus: ChainStatus;
}

/**
 * Formula error
 */
export interface FormulaError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Affected element */
  element?: FormulaElement;
  
  /** Affected deliverable */
  deliverableId?: string;
  
  /** Resolution */
  resolution: string;
}

/**
 * Formula warning
 */
export interface FormulaWarning {
  /** Warning code */
  code: string;
  
  /** Warning message */
  message: string;
  
  /** Affected element */
  element?: FormulaElement;
}

/**
 * Chain status
 */
export interface ChainStatus {
  /** Project docs status */
  projectDocs: ElementStatus;
  
  /** Master scope status */
  masterScope: ElementStatus;
  
  /** Deliverables status */
  deliverables: ElementStatus;
  
  /** Steps status */
  steps: ElementStatus;
  
  /** System status */
  system: ElementStatus;
}

/**
 * Element status
 */
export interface ElementStatus {
  /** Whether element exists */
  exists: boolean;
  
  /** Whether element is valid */
  valid: boolean;
  
  /** Whether element is bound */
  bound: boolean;
  
  /** Completion percentage */
  completion: number;
}

// ============================================================================
// FORMULA VALIDATION
// ============================================================================

/**
 * Validate master scope structure
 */
export function validateMasterScope(scope: MasterScope): FormulaValidationResult {
  const errors: FormulaError[] = [];
  const warnings: FormulaWarning[] = [];
  
  // Check project name
  if (!scope.project || scope.project.trim() === '') {
    errors.push({
      code: 'MISSING_PROJECT',
      message: 'Master scope missing project name',
      element: 'MASTER_SCOPE',
      resolution: 'Add project name to master scope',
    });
  }
  
  // Check objective
  if (!scope.objective || scope.objective.trim() === '') {
    errors.push({
      code: 'MISSING_OBJECTIVE',
      message: 'Master scope missing objective',
      element: 'MASTER_SCOPE',
      resolution: 'Add objective to master scope',
    });
  }
  
  // Check deliverables
  if (!scope.deliverables || scope.deliverables.length === 0) {
    errors.push({
      code: 'NO_DELIVERABLES',
      message: 'Master scope has no deliverables',
      element: 'DELIVERABLES',
      resolution: 'Add at least one deliverable',
    });
  } else {
    // Validate each deliverable
    for (const deliverable of scope.deliverables) {
      const deliverableErrors = validateDeliverable(deliverable, scope.deliverables);
      errors.push(...deliverableErrors.errors);
      warnings.push(...deliverableErrors.warnings);
    }
    
    // Check for cycles in dependencies
    const cycleCheck = checkDependencyCycles(scope.deliverables);
    if (cycleCheck.hasCycle) {
      errors.push({
        code: 'DEPENDENCY_CYCLE',
        message: `Dependency cycle detected: ${cycleCheck.cycle?.join(' → ')}`,
        element: 'DELIVERABLES',
        resolution: 'Remove cyclic dependencies',
      });
    }
  }
  
  // Build chain status
  const chainStatus = buildChainStatus(scope);
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    chainStatus,
  };
}

/**
 * Validate a single deliverable
 */
function validateDeliverable(
  deliverable: Deliverable,
  allDeliverables: Deliverable[]
): { errors: FormulaError[]; warnings: FormulaWarning[] } {
  const errors: FormulaError[] = [];
  const warnings: FormulaWarning[] = [];
  
  // Check ID format
  if (!deliverable.id || !deliverable.id.match(/^D\d+$/)) {
    errors.push({
      code: 'INVALID_DELIVERABLE_ID',
      message: `Invalid deliverable ID format: ${deliverable.id}`,
      deliverableId: deliverable.id,
      resolution: 'Use format D1, D2, D3, etc.',
    });
  }
  
  // Check name
  if (!deliverable.name || deliverable.name.trim() === '') {
    errors.push({
      code: 'MISSING_DELIVERABLE_NAME',
      message: `Deliverable ${deliverable.id} has no name`,
      deliverableId: deliverable.id,
      resolution: 'Add name to deliverable',
    });
  }
  
  // Check steps
  if (!deliverable.steps || deliverable.steps.length === 0) {
    warnings.push({
      code: 'NO_STEPS',
      message: `Deliverable ${deliverable.id} has no steps defined`,
    });
  } else {
    // Validate step IDs
    for (const step of deliverable.steps) {
      if (!step.id.startsWith(`${deliverable.id}.S`)) {
        errors.push({
          code: 'INVALID_STEP_ID',
          message: `Step ${step.id} should be in format ${deliverable.id}.S1, ${deliverable.id}.S2, etc.`,
          deliverableId: deliverable.id,
          resolution: `Rename step to ${deliverable.id}.S[n]`,
        });
      }
    }
  }
  
  // Check dependencies exist
  for (const depId of deliverable.dependencies) {
    const exists = allDeliverables.some(d => d.id === depId);
    if (!exists) {
      errors.push({
        code: 'MISSING_DEPENDENCY',
        message: `Deliverable ${deliverable.id} depends on non-existent ${depId}`,
        deliverableId: deliverable.id,
        resolution: `Add ${depId} to master scope or remove dependency`,
      });
    }
  }
  
  return { errors, warnings };
}

/**
 * Check for dependency cycles (DAG validation)
 */
function checkDependencyCycles(deliverables: Deliverable[]): {
  hasCycle: boolean;
  cycle?: string[];
} {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];
  
  function dfs(id: string): boolean {
    visited.add(id);
    recursionStack.add(id);
    path.push(id);
    
    const deliverable = deliverables.find(d => d.id === id);
    if (deliverable) {
      for (const depId of deliverable.dependencies) {
        if (!visited.has(depId)) {
          if (dfs(depId)) return true;
        } else if (recursionStack.has(depId)) {
          // Found cycle
          path.push(depId);
          return true;
        }
      }
    }
    
    path.pop();
    recursionStack.delete(id);
    return false;
  }
  
  for (const deliverable of deliverables) {
    if (!visited.has(deliverable.id)) {
      if (dfs(deliverable.id)) {
        // Extract cycle from path
        const cycleStart = path.indexOf(path[path.length - 1]);
        const cycle = path.slice(cycleStart);
        return { hasCycle: true, cycle };
      }
    }
  }
  
  return { hasCycle: false };
}

/**
 * Build chain status from master scope
 */
function buildChainStatus(scope: MasterScope): ChainStatus {
  const totalDeliverables = scope.deliverables.length;
  const completedDeliverables = scope.deliverables.filter(
    d => d.status === 'COMPLETED' || d.status === 'VERIFIED' || d.status === 'LOCKED'
  ).length;
  
  let totalSteps = 0;
  let completedSteps = 0;
  
  for (const deliverable of scope.deliverables) {
    totalSteps += deliverable.steps.length;
    completedSteps += deliverable.steps.filter(
      s => s.status === 'COMPLETED'
    ).length;
  }
  
  return {
    projectDocs: {
      exists: true,
      valid: !!scope.project && !!scope.objective,
      bound: false, // Would need state to check
      completion: 100,
    },
    masterScope: {
      exists: true,
      valid: totalDeliverables > 0,
      bound: false,
      completion: 100,
    },
    deliverables: {
      exists: totalDeliverables > 0,
      valid: true,
      bound: false,
      completion: totalDeliverables > 0
        ? Math.round((completedDeliverables / totalDeliverables) * 100)
        : 0,
    },
    steps: {
      exists: totalSteps > 0,
      valid: true,
      bound: false,
      completion: totalSteps > 0
        ? Math.round((completedSteps / totalSteps) * 100)
        : 0,
    },
    system: {
      exists: completedDeliverables === totalDeliverables && totalDeliverables > 0,
      valid: completedDeliverables === totalDeliverables,
      bound: false,
      completion: totalDeliverables > 0
        ? Math.round((completedDeliverables / totalDeliverables) * 100)
        : 0,
    },
  };
}

// ============================================================================
// FORMULA STATE CHECKS
// ============================================================================

/**
 * Check if formula is ready for binding
 */
export function isFormulaReadyForBinding(
  state: AIXORDState,
  scope: MasterScope
): { ready: boolean; reason?: string } {
  // Check reality gate
  if (state.gates.RA !== 1) {
    return { ready: false, reason: 'Reality gate not passed' };
  }
  
  // Validate the scope
  const validation = validateMasterScope(scope);
  if (!validation.valid) {
    return {
      ready: false,
      reason: `Formula validation failed: ${validation.errors[0]?.message}`,
    };
  }
  
  return { ready: true };
}

/**
 * Get formula refusal message
 */
export function getFormulaRefusalMessage(violation: string): string {
  return `
⛔ FORMULA VIOLATION

This request cannot be processed because it violates the AIXORD Formula:

Project_Docs → Master_Scope → Deliverables → Steps → Production-Ready System

Violation: ${violation}

The Formula is non-negotiable.
`.trim();
}

// ============================================================================
// DAG HELPERS
// ============================================================================

/**
 * Get deliverables in topological order (respecting dependencies)
 */
export function getTopologicalOrder(deliverables: Deliverable[]): Deliverable[] {
  const result: Deliverable[] = [];
  const visited = new Set<string>();
  
  function visit(id: string) {
    if (visited.has(id)) return;
    
    const deliverable = deliverables.find(d => d.id === id);
    if (!deliverable) return;
    
    // Visit dependencies first
    for (const depId of deliverable.dependencies) {
      visit(depId);
    }
    
    visited.add(id);
    result.push(deliverable);
  }
  
  for (const deliverable of deliverables) {
    visit(deliverable.id);
  }
  
  return result;
}

/**
 * Get eligible deliverables (all dependencies completed)
 */
export function getEligibleDeliverables(deliverables: Deliverable[]): Deliverable[] {
  return deliverables.filter(d => {
    // Skip if already completed
    if (d.status === 'COMPLETED' || d.status === 'VERIFIED' || d.status === 'LOCKED') {
      return false;
    }
    
    // Check all dependencies are completed
    for (const depId of d.dependencies) {
      const dep = deliverables.find(x => x.id === depId);
      if (!dep || (dep.status !== 'COMPLETED' && dep.status !== 'VERIFIED' && dep.status !== 'LOCKED')) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Get blocked deliverables (waiting on dependencies)
 */
export function getBlockedDeliverables(deliverables: Deliverable[]): Array<{
  deliverable: Deliverable;
  blockedBy: string[];
}> {
  const result: Array<{ deliverable: Deliverable; blockedBy: string[] }> = [];
  
  for (const d of deliverables) {
    if (d.status === 'COMPLETED' || d.status === 'VERIFIED' || d.status === 'LOCKED') {
      continue;
    }
    
    const blockedBy: string[] = [];
    for (const depId of d.dependencies) {
      const dep = deliverables.find(x => x.id === depId);
      if (!dep || (dep.status !== 'COMPLETED' && dep.status !== 'VERIFIED' && dep.status !== 'LOCKED')) {
        blockedBy.push(depId);
      }
    }
    
    if (blockedBy.length > 0) {
      result.push({ deliverable: d, blockedBy });
    }
  }
  
  return result;
}
