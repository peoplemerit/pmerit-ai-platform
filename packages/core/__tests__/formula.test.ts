/**
 * Formula Tests
 * 
 * Tests for formula conservation and validation.
 */

import { describe, it, expect } from 'vitest';
import { createDefaultState } from '../src/types/state';
import {
  checkConservation,
  validateConservation,
  getScopeStatus,
  canModifyScope,
  canRebuildScope,
  getModifiableScopes,
  getConservationSummary,
} from '../src/formula/conservation';
import {
  validateMasterScope,
  isFormulaReadyForBinding,
  getTopologicalOrder,
  getEligibleDeliverables,
  getBlockedDeliverables,
  type MasterScope,
  type Deliverable,
} from '../src/formula/validator';

describe('Conservation Law', () => {
  describe('checkConservation', () => {
    it('should allow all actions in GREENFIELD', () => {
      const state = createDefaultState();
      state.reality.class = 'GREENFIELD';
      
      const result = checkConservation(state, {
        scopeId: 'anything',
        action: 'REBUILD',
      });
      
      expect(result.satisfied).toBe(true);
    });
    
    it('should block rebuilding conserved scope in BROWNFIELD-EXTEND', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database'];
      
      const result = checkConservation(state, {
        scopeId: 'database',
        action: 'REBUILD',
      });
      
      expect(result.satisfied).toBe(false);
      expect(result.violation?.type).toBe('CONSERVED_REBUILD');
      expect(result.violation?.haltCode).toBe('H-RA2');
    });
    
    it('should allow modifying conserved scope in BROWNFIELD-EXTEND (extension)', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database'];
      
      const result = checkConservation(state, {
        scopeId: 'database',
        action: 'MODIFY',
      });
      
      expect(result.satisfied).toBe(true);
    });
    
    it('should allow rebuilding unlocked scope', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database'];
      state.reality.unlockedScopes = ['database'];
      
      const result = checkConservation(state, {
        scopeId: 'database',
        action: 'REBUILD',
      });
      
      expect(result.satisfied).toBe(true);
    });
    
    it('should allow rebuilding replaceable scope', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-REPLACE';
      state.reality.replaceableScopes = ['frontend'];
      
      const result = checkConservation(state, {
        scopeId: 'frontend',
        action: 'REBUILD',
      });
      
      expect(result.satisfied).toBe(true);
    });
  });
  
  describe('validateConservation', () => {
    it('should pass for valid GREENFIELD state', () => {
      const state = createDefaultState();
      state.reality.class = 'GREENFIELD';
      
      const result = validateConservation(state);
      
      expect(result.valid).toBe(true);
    });
    
    it('should fail for GREENFIELD with conserved scopes', () => {
      const state = createDefaultState();
      state.reality.class = 'GREENFIELD';
      state.reality.conservedScopes = ['something'];
      
      const result = validateConservation(state);
      
      expect(result.valid).toBe(false);
      expect(result.issues[0].type).toBe('SCOPE_MISMATCH');
    });
    
    it('should fail when unlocked scope not in conserved', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database'];
      state.reality.unlockedScopes = ['frontend']; // Not in conserved
      
      const result = validateConservation(state);
      
      expect(result.valid).toBe(false);
    });
  });
  
  describe('getScopeStatus', () => {
    it('should return NEW for GREENFIELD', () => {
      const state = createDefaultState();
      state.reality.class = 'GREENFIELD';
      
      expect(getScopeStatus(state, 'anything')).toBe('NEW');
    });
    
    it('should return CONSERVED for conserved scope', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database'];
      
      expect(getScopeStatus(state, 'database')).toBe('CONSERVED');
    });
    
    it('should return UNLOCKED for unlocked scope', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database'];
      state.reality.unlockedScopes = ['database'];
      
      expect(getScopeStatus(state, 'database')).toBe('UNLOCKED');
    });
    
    it('should return REPLACEABLE for replaceable scope', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-REPLACE';
      state.reality.replaceableScopes = ['frontend'];
      
      expect(getScopeStatus(state, 'frontend')).toBe('REPLACEABLE');
    });
  });
  
  describe('canModifyScope / canRebuildScope', () => {
    it('should allow modifying non-conserved scopes', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database'];
      
      expect(canModifyScope(state, 'frontend')).toBe(true);
      expect(canModifyScope(state, 'database')).toBe(false);
    });
    
    it('should allow rebuilding new scopes', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database'];
      
      expect(canRebuildScope(state, 'frontend')).toBe(true);
      expect(canRebuildScope(state, 'database')).toBe(false);
    });
  });
  
  describe('getConservationSummary', () => {
    it('should return correct summary', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database', 'auth'];
      state.reality.unlockedScopes = ['auth'];
      state.reality.replaceableScopes = ['frontend'];
      
      const summary = getConservationSummary(state);
      
      expect(summary.reality).toBe('BROWNFIELD-EXTEND');
      expect(summary.conserved).toBe(2);
      expect(summary.unlocked).toBe(1);
      expect(summary.replaceable).toBe(1);
    });
  });
});

describe('Formula Validation', () => {
  const createValidScope = (): MasterScope => ({
    project: 'Test Project',
    objective: 'Test the formula validator',
    deliverables: [
      {
        id: 'D1',
        name: 'Core Package',
        status: 'PENDING',
        steps: [
          { id: 'D1.S1', name: 'Create types', status: 'PENDING' },
          { id: 'D1.S2', name: 'Create validation', status: 'PENDING' },
        ],
        dependencies: [],
      },
      {
        id: 'D2',
        name: 'Extension Shell',
        status: 'PENDING',
        steps: [
          { id: 'D2.S1', name: 'Create manifest', status: 'PENDING' },
        ],
        dependencies: ['D1'],
      },
    ],
  });
  
  describe('validateMasterScope', () => {
    it('should validate a correct master scope', () => {
      const scope = createValidScope();
      
      const result = validateMasterScope(scope);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should fail for missing project name', () => {
      const scope = createValidScope();
      scope.project = '';
      
      const result = validateMasterScope(scope);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_PROJECT')).toBe(true);
    });
    
    it('should fail for missing objective', () => {
      const scope = createValidScope();
      scope.objective = '';
      
      const result = validateMasterScope(scope);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_OBJECTIVE')).toBe(true);
    });
    
    it('should fail for no deliverables', () => {
      const scope = createValidScope();
      scope.deliverables = [];
      
      const result = validateMasterScope(scope);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'NO_DELIVERABLES')).toBe(true);
    });
    
    it('should fail for invalid deliverable ID format', () => {
      const scope = createValidScope();
      scope.deliverables[0].id = 'invalid';
      
      const result = validateMasterScope(scope);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_DELIVERABLE_ID')).toBe(true);
    });
    
    it('should fail for missing dependency', () => {
      const scope = createValidScope();
      scope.deliverables[1].dependencies = ['D99']; // Non-existent
      
      const result = validateMasterScope(scope);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_DEPENDENCY')).toBe(true);
    });
    
    it('should detect dependency cycles', () => {
      const scope = createValidScope();
      // Create a cycle: D1 -> D2 -> D1
      scope.deliverables[0].dependencies = ['D2'];
      
      const result = validateMasterScope(scope);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'DEPENDENCY_CYCLE')).toBe(true);
    });
  });
  
  describe('isFormulaReadyForBinding', () => {
    it('should require reality gate passed', () => {
      const state = createDefaultState();
      const scope = createValidScope();
      
      const result = isFormulaReadyForBinding(state, scope);
      
      expect(result.ready).toBe(false);
      expect(result.reason).toContain('Reality gate');
    });
    
    it('should be ready with valid scope and gate', () => {
      const state = createDefaultState();
      state.gates.RA = 1;
      const scope = createValidScope();
      
      const result = isFormulaReadyForBinding(state, scope);
      
      expect(result.ready).toBe(true);
    });
  });
  
  describe('Topological Ordering', () => {
    it('should order deliverables by dependencies', () => {
      const deliverables: Deliverable[] = [
        { id: 'D3', name: 'Third', status: 'PENDING', steps: [], dependencies: ['D2'] },
        { id: 'D1', name: 'First', status: 'PENDING', steps: [], dependencies: [] },
        { id: 'D2', name: 'Second', status: 'PENDING', steps: [], dependencies: ['D1'] },
      ];
      
      const ordered = getTopologicalOrder(deliverables);
      
      const d1Index = ordered.findIndex(d => d.id === 'D1');
      const d2Index = ordered.findIndex(d => d.id === 'D2');
      const d3Index = ordered.findIndex(d => d.id === 'D3');
      
      expect(d1Index).toBeLessThan(d2Index);
      expect(d2Index).toBeLessThan(d3Index);
    });
  });
  
  describe('getEligibleDeliverables', () => {
    it('should return deliverables with completed dependencies', () => {
      const deliverables: Deliverable[] = [
        { id: 'D1', name: 'First', status: 'COMPLETED', steps: [], dependencies: [] },
        { id: 'D2', name: 'Second', status: 'PENDING', steps: [], dependencies: ['D1'] },
        { id: 'D3', name: 'Third', status: 'PENDING', steps: [], dependencies: ['D2'] },
      ];
      
      const eligible = getEligibleDeliverables(deliverables);
      
      expect(eligible).toHaveLength(1);
      expect(eligible[0].id).toBe('D2');
    });
  });
  
  describe('getBlockedDeliverables', () => {
    it('should return deliverables blocked by dependencies', () => {
      const deliverables: Deliverable[] = [
        { id: 'D1', name: 'First', status: 'PENDING', steps: [], dependencies: [] },
        { id: 'D2', name: 'Second', status: 'PENDING', steps: [], dependencies: ['D1'] },
        { id: 'D3', name: 'Third', status: 'PENDING', steps: [], dependencies: ['D1', 'D2'] },
      ];
      
      const blocked = getBlockedDeliverables(deliverables);
      
      expect(blocked).toHaveLength(2);
      expect(blocked.find(b => b.deliverable.id === 'D2')?.blockedBy).toContain('D1');
      expect(blocked.find(b => b.deliverable.id === 'D3')?.blockedBy).toContain('D1');
      expect(blocked.find(b => b.deliverable.id === 'D3')?.blockedBy).toContain('D2');
    });
  });
});
