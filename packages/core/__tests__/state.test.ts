/**
 * State Types Tests
 * 
 * Tests for state creation, type guards, and defaults.
 */

import { describe, it, expect } from 'vitest';
import {
  createDefaultState,
  AIXORD_VERSION,
  STATE_SCHEMA_VERSION,
  isLicenseType,
  isRealityClass,
  isPhase,
  isGateID,
  isExecutionMode,
  isBindingMethod,
  PHASE_ORDER,
} from '../src/types/state';

describe('createDefaultState', () => {
  it('should create a valid default state', () => {
    const state = createDefaultState();
    
    expect(state.version).toBe(AIXORD_VERSION);
    expect(state.schemaVersion).toBe(STATE_SCHEMA_VERSION);
  });
  
  it('should initialize setup as incomplete', () => {
    const state = createDefaultState();
    
    expect(state.setup.complete).toBe(false);
    expect(state.setup.currentStep).toBe(1);
  });
  
  it('should initialize all gates to 0', () => {
    const state = createDefaultState();
    
    for (const value of Object.values(state.gates)) {
      expect(value).toBe(0);
    }
  });
  
  it('should initialize all bindings as unbound', () => {
    const state = createDefaultState();
    
    expect(state.bindings.projectDocs.bound).toBe(false);
    expect(state.bindings.formula.bound).toBe(false);
    expect(state.bindings.blueprint.bound).toBe(false);
    expect(state.bindings.masterScope.bound).toBe(false);
    expect(state.bindings.dag.bound).toBe(false);
  });
  
  it('should initialize session at phase SETUP', () => {
    const state = createDefaultState();
    
    expect(state.session.phase).toBe('SETUP');
    expect(state.session.kingdom).toBe('');
    expect(state.session.mode).toBe('STRICT');
    expect(state.session.number).toBe(1);
    expect(state.session.messageCount).toBe(0);
  });
  
  it('should initialize formula as unbound and unapproved', () => {
    const state = createDefaultState();
    
    expect(state.formula.bound).toBe(false);
    expect(state.formula.approved).toBe(false);
  });
  
  it('should initialize license as not validated', () => {
    const state = createDefaultState();
    
    expect(state.license.validated).toBe(false);
    expect(state.license.identifier).toBe('');
    expect(state.license.type).toBe('');
  });
  
  it('should initialize reality as unclassified', () => {
    const state = createDefaultState();
    
    expect(state.reality.class).toBe('');
    expect(state.reality.conservedScopes).toEqual([]);
    expect(state.reality.replaceableScopes).toEqual([]);
    expect(state.reality.unlockedScopes).toEqual([]);
  });
  
  it('should have an updatedAt timestamp', () => {
    const state = createDefaultState();
    
    expect(state.updatedAt).toBeDefined();
    expect(new Date(state.updatedAt!).getTime()).not.toBeNaN();
  });
});

describe('Type Guards', () => {
  describe('isLicenseType', () => {
    it('should return true for valid license types', () => {
      expect(isLicenseType('STANDARD')).toBe(true);
      expect(isLicenseType('MASTER')).toBe(true);
      expect(isLicenseType('TEST')).toBe(true);
      expect(isLicenseType('GIFT')).toBe(true);
    });
    
    it('should return false for invalid license types', () => {
      expect(isLicenseType('INVALID')).toBe(false);
      expect(isLicenseType('')).toBe(false);
      expect(isLicenseType(null)).toBe(false);
      expect(isLicenseType(undefined)).toBe(false);
    });
  });
  
  describe('isRealityClass', () => {
    it('should return true for valid reality classes', () => {
      expect(isRealityClass('GREENFIELD')).toBe(true);
      expect(isRealityClass('BROWNFIELD-EXTEND')).toBe(true);
      expect(isRealityClass('BROWNFIELD-REPLACE')).toBe(true);
    });
    
    it('should return false for invalid reality classes', () => {
      expect(isRealityClass('INVALID')).toBe(false);
      expect(isRealityClass('BROWNFIELD')).toBe(false);
      expect(isRealityClass('')).toBe(false);
    });
  });
  
  describe('isPhase', () => {
    it('should return true for all valid phases', () => {
      for (const phase of PHASE_ORDER) {
        expect(isPhase(phase)).toBe(true);
      }
    });
    
    it('should return false for invalid phases', () => {
      expect(isPhase('INVALID')).toBe(false);
      expect(isPhase('setup')).toBe(false); // lowercase
      expect(isPhase('')).toBe(false);
    });
  });
  
  describe('isGateID', () => {
    it('should return true for valid gate IDs', () => {
      const validGates = [
        'LIC', 'DIS', 'TIR', 'ENV', 'FLD', 'CIT', 'CON', 'OBJ',
        'RA', 'FX', 'PD', 'PR', 'BP', 'MS', 'VA', 'HO',
      ];
      
      for (const gate of validGates) {
        expect(isGateID(gate)).toBe(true);
      }
    });
    
    it('should return false for invalid gate IDs', () => {
      expect(isGateID('INVALID')).toBe(false);
      expect(isGateID('lic')).toBe(false); // lowercase
      expect(isGateID('')).toBe(false);
    });
  });
  
  describe('isExecutionMode', () => {
    it('should return true for valid execution modes', () => {
      expect(isExecutionMode('STRICT')).toBe(true);
      expect(isExecutionMode('SUPERVISED')).toBe(true);
      expect(isExecutionMode('SANDBOX')).toBe(true);
    });
    
    it('should return false for invalid execution modes', () => {
      expect(isExecutionMode('INVALID')).toBe(false);
      expect(isExecutionMode('strict')).toBe(false);
      expect(isExecutionMode('')).toBe(false);
    });
  });
  
  describe('isBindingMethod', () => {
    it('should return true for valid binding methods', () => {
      expect(isBindingMethod('visual')).toBe(true);
      expect(isBindingMethod('textual')).toBe(true);
      expect(isBindingMethod('hash')).toBe(true);
      expect(isBindingMethod('platform')).toBe(true);
      expect(isBindingMethod('attestation')).toBe(true);
    });
    
    it('should return false for invalid binding methods', () => {
      expect(isBindingMethod('INVALID')).toBe(false);
      expect(isBindingMethod('VISUAL')).toBe(false); // uppercase
      expect(isBindingMethod('')).toBe(false);
    });
  });
});
