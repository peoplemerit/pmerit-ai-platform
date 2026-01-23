/**
 * Validation Tests
 * 
 * Tests for state schema and business rule validation.
 */

import { describe, it, expect } from 'vitest';
import { createDefaultState } from '../src/types/state';
import {
  validateState,
  parseState,
  aixordStateSchema,
} from '../src/validation/schema';
import {
  validateAIXORDState,
  isValidState,
  getBlockingErrors,
  validateSetupConsistency,
  validateLicenseState,
  validateRealityState,
  validateFormulaState,
  validateGateDependencies,
  validatePhaseGates,
} from '../src/validation/state';

describe('Schema Validation', () => {
  describe('validateState', () => {
    it('should validate a correct default state', () => {
      const state = createDefaultState();
      
      const result = validateState(state);
      
      expect(result.success).toBe(true);
    });
    
    it('should reject invalid gate values', () => {
      const state = createDefaultState();
      (state.gates as any).LIC = 2; // Invalid: should be 0 or 1
      
      const result = validateState(state);
      
      expect(result.success).toBe(false);
    });
    
    it('should reject invalid phase', () => {
      const state = createDefaultState();
      (state.session as any).phase = 'INVALID';
      
      const result = validateState(state);
      
      expect(result.success).toBe(false);
    });
    
    it('should reject negative message count', () => {
      const state = createDefaultState();
      state.session.messageCount = -1;
      
      const result = validateState(state);
      
      expect(result.success).toBe(false);
    });
    
    it('should reject invalid setup step', () => {
      const state = createDefaultState();
      state.setup.currentStep = 10; // Max is 9
      
      const result = validateState(state);
      
      expect(result.success).toBe(false);
    });
  });
  
  describe('parseState', () => {
    it('should return parsed state for valid input', () => {
      const state = createDefaultState();
      
      const parsed = parseState(state);
      
      expect(parsed.version).toBe(state.version);
    });
    
    it('should throw for invalid input', () => {
      const invalid = { invalid: 'state' };
      
      expect(() => parseState(invalid)).toThrow();
    });
  });
});

describe('Business Rule Validation', () => {
  describe('validateSetupConsistency', () => {
    it('should pass for consistent incomplete setup', () => {
      const state = createDefaultState();
      
      const errors = validateSetupConsistency(state);
      
      expect(errors).toHaveLength(0);
    });
    
    it('should fail when setup marked complete but gates not passed', () => {
      const state = createDefaultState();
      state.setup.complete = true;
      // But all gates are still false
      
      const errors = validateSetupConsistency(state);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.code === 'SETUP_INCONSISTENT')).toBe(true);
    });
  });
  
  describe('validateLicenseState', () => {
    it('should pass for unvalidated license', () => {
      const state = createDefaultState();
      
      const errors = validateLicenseState(state);
      
      expect(errors).toHaveLength(0);
    });
    
    it('should fail for validated license without identifier', () => {
      const state = createDefaultState();
      state.license.validated = true;
      // But no identifier
      
      const errors = validateLicenseState(state);
      
      expect(errors.some(e => e.code === 'LICENSE_MISSING_IDENTIFIER')).toBe(true);
    });
    
    it('should fail for validated license without type', () => {
      const state = createDefaultState();
      state.license.validated = true;
      state.license.identifier = 'test@example.com';
      // But no type
      
      const errors = validateLicenseState(state);
      
      expect(errors.some(e => e.code === 'LICENSE_MISSING_TYPE')).toBe(true);
    });
  });
  
  describe('validateRealityState', () => {
    it('should fail when past SETUP without reality classification', () => {
      const state = createDefaultState();
      state.session.phase = 'DISCOVER';
      // But reality.class is empty
      
      const errors = validateRealityState(state);
      
      expect(errors.some(e => e.code === 'REALITY_NOT_CLASSIFIED')).toBe(true);
      expect(errors.some(e => e.haltCode === 'H-RA1')).toBe(true);
    });
    
    it('should warn for brownfield without scope lists', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      // But no scopes defined
      
      const errors = validateRealityState(state);
      
      expect(errors.some(e => 
        e.code === 'BROWNFIELD_NO_SCOPES' && e.severity === 'warning'
      )).toBe(true);
    });
    
    it('should fail for unlocked scope not in conserved', () => {
      const state = createDefaultState();
      state.reality.class = 'BROWNFIELD-EXTEND';
      state.reality.conservedScopes = ['database'];
      state.reality.unlockedScopes = ['frontend']; // Not in conserved
      
      const errors = validateRealityState(state);
      
      expect(errors.some(e => e.code === 'UNLOCKED_NOT_CONSERVED')).toBe(true);
    });
  });
  
  describe('validateFormulaState', () => {
    it('should fail when formula not bound at BLUEPRINT phase', () => {
      const state = createDefaultState();
      state.session.phase = 'BLUEPRINT';
      // Formula not bound
      
      const errors = validateFormulaState(state);
      
      expect(errors.some(e => e.code === 'FORMULA_NOT_BOUND')).toBe(true);
      expect(errors.some(e => e.haltCode === 'H-FX1')).toBe(true);
    });
    
    it('should warn when formula bound but not approved', () => {
      const state = createDefaultState();
      state.formula.bound = true;
      // But not approved
      
      const errors = validateFormulaState(state);
      
      expect(errors.some(e => 
        e.code === 'FORMULA_NOT_APPROVED' && e.severity === 'warning'
      )).toBe(true);
    });
  });
  
  describe('validateGateDependencies', () => {
    it('should pass for correctly ordered gates', () => {
      const state = createDefaultState();
      state.gates.LIC = 1;
      state.gates.DIS = 1;
      state.gates.TIR = 1;
      
      const errors = validateGateDependencies(state);
      
      expect(errors).toHaveLength(0);
    });
    
    it('should fail for out-of-order gates', () => {
      const state = createDefaultState();
      // Skip LIC but pass TIR
      state.gates.TIR = 1;
      
      const errors = validateGateDependencies(state);
      
      expect(errors.some(e => e.code === 'GATE_ORDER_VIOLATION')).toBe(true);
    });
  });
  
  describe('validatePhaseGates', () => {
    it('should fail when phase requires unpassed gates', () => {
      const state = createDefaultState();
      state.session.phase = 'DISCOVER';
      // No gates passed
      
      const errors = validatePhaseGates(state);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.code === 'PHASE_GATE_NOT_MET')).toBe(true);
    });
  });
});

describe('Full State Validation', () => {
  describe('validateAIXORDState', () => {
    it('should return valid for correct default state', () => {
      const state = createDefaultState();
      
      const result = validateAIXORDState(state);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should accumulate multiple errors', () => {
      const state = createDefaultState();
      state.setup.complete = true; // Inconsistent
      state.session.phase = 'DISCOVER'; // Without gates
      
      const result = validateAIXORDState(state);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
  
  describe('isValidState', () => {
    it('should return true for valid state', () => {
      const state = createDefaultState();
      
      expect(isValidState(state)).toBe(true);
    });
    
    it('should return false for invalid state', () => {
      const state = createDefaultState();
      state.setup.complete = true; // Inconsistent
      
      expect(isValidState(state)).toBe(false);
    });
  });
  
  describe('getBlockingErrors', () => {
    it('should return only errors with halt codes', () => {
      const state = createDefaultState();
      state.session.phase = 'BLUEPRINT';
      // Formula not bound - has halt code
      // Also setup inconsistencies - no halt code
      
      const blocking = getBlockingErrors(state);
      
      expect(blocking.every(e => e.haltCode !== undefined)).toBe(true);
    });
  });
});
