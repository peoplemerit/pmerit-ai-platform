/**
 * Gates Tests
 * 
 * Tests for gate checking, transitions, and dependencies.
 */

import { describe, it, expect } from 'vitest';
import { createDefaultState } from '../src/types/state';
import {
  checkGate,
  checkAllGates,
  getPassedGates,
  getFailedGates,
  getFailedBlockingGates,
  canPassGate,
  canEnterPhase,
  checkExecutionEligibility,
  getSetupProgress,
  formatGatesForHeader,
  getFirstBlockingGate,
} from '../src/gates/checker';
import {
  updateGate,
  transitionPhase,
  setLicenseValidated,
  setDisclaimerAccepted,
  setRealityClassification,
  setFormulaApproved,
  setFormulaBound,
  incrementMessageCount,
} from '../src/gates/transitions';
import { BLOCKING_GATES, GATE_ORDER } from '../src/types/governance';

describe('Gate Checking', () => {
  describe('checkGate', () => {
    it('should return passed=true for a passed gate', () => {
      const state = createDefaultState();
      state.gates.LIC = 1;
      
      const result = checkGate(state, 'LIC');
      
      expect(result.passed).toBe(true);
      expect(result.gate.id).toBe('LIC');
    });
    
    it('should return passed=false with reason for unpassed gate', () => {
      const state = createDefaultState();
      
      const result = checkGate(state, 'LIC');
      
      expect(result.passed).toBe(false);
      expect(result.reason).toBeDefined();
      expect(result.requiredAction).toBeDefined();
    });
    
    it('should include halt condition for blocking gates', () => {
      const state = createDefaultState();
      
      const result = checkGate(state, 'RA');
      
      expect(result.passed).toBe(false);
      expect(result.haltCondition).toBeDefined();
      expect(result.haltCondition?.code).toBe('H-RA1');
    });
  });
  
  describe('checkAllGates', () => {
    it('should return results for all gates', () => {
      const state = createDefaultState();
      
      const results = checkAllGates(state);
      
      expect(results.size).toBe(GATE_ORDER.length);
      
      for (const gateId of GATE_ORDER) {
        expect(results.has(gateId)).toBe(true);
      }
    });
  });
  
  describe('getPassedGates / getFailedGates', () => {
    it('should correctly separate passed and failed gates', () => {
      const state = createDefaultState();
      state.gates.LIC = 1;
      state.gates.DIS = 1;
      
      const passed = getPassedGates(state);
      const failed = getFailedGates(state);
      
      expect(passed).toContain('LIC');
      expect(passed).toContain('DIS');
      expect(passed).not.toContain('TIR');
      
      expect(failed).toContain('TIR');
      expect(failed).not.toContain('LIC');
    });
  });
  
  describe('getFailedBlockingGates', () => {
    it('should return only blocking gates that are not passed', () => {
      const state = createDefaultState();
      state.gates.LIC = 1;
      
      const failed = getFailedBlockingGates(state);
      
      expect(failed).not.toContain('LIC');
      expect(failed).toContain('DIS');
      expect(failed).toContain('RA');
    });
  });
});

describe('Gate Transitions', () => {
  describe('canPassGate', () => {
    it('should allow passing a gate when prerequisites are met', () => {
      const state = createDefaultState();
      
      const result = canPassGate(state, 'LIC');
      
      expect(result.allowed).toBe(true);
      expect(result.newValue).toBe(1);
    });
    
    it('should block passing a gate when prerequisites are not met', () => {
      const state = createDefaultState();
      // TIR requires LIC and DIS to be passed first
      
      const result = canPassGate(state, 'TIR');
      
      expect(result.allowed).toBe(false);
      expect(result.blockedBy).toContain('LIC');
      expect(result.blockedBy).toContain('DIS');
    });
    
    it('should return allowed=true for already passed gates', () => {
      const state = createDefaultState();
      state.gates.LIC = 1;
      
      const result = canPassGate(state, 'LIC');
      
      expect(result.allowed).toBe(true);
    });
  });
  
  describe('updateGate', () => {
    it('should update gate and return new state', () => {
      const state = createDefaultState();
      
      const result = updateGate(state, 'LIC', 1);
      
      expect(result.success).toBe(true);
      expect(result.gates.LIC).toBe(1);
      expect(result.updatedGates).toContain('LIC');
    });
    
    it('should fail if prerequisites not met', () => {
      const state = createDefaultState();
      
      const result = updateGate(state, 'TIR', 1);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

describe('Phase Entry', () => {
  describe('canEnterPhase', () => {
    it('should allow entering SETUP with no gates', () => {
      const state = createDefaultState();
      
      const result = canEnterPhase(state, 'SETUP');
      
      expect(result.allowed).toBe(true);
    });
    
    it('should block entering DISCOVER without required gates', () => {
      const state = createDefaultState();
      
      const result = canEnterPhase(state, 'DISCOVER');
      
      expect(result.allowed).toBe(false);
      expect(result.missingGates.length).toBeGreaterThan(0);
    });
    
    it('should allow entering DISCOVER with all required gates', () => {
      const state = createDefaultState();
      state.gates.LIC = 1;
      state.gates.DIS = 1;
      state.gates.TIR = 1;
      state.gates.ENV = 1;
      state.gates.OBJ = 1;
      state.gates.RA = 1;
      
      const result = canEnterPhase(state, 'DISCOVER');
      
      expect(result.allowed).toBe(true);
    });
  });
  
  describe('transitionPhase', () => {
    it('should transition phase when requirements met', () => {
      const state = createDefaultState();
      state.gates.LIC = 1;
      state.gates.DIS = 1;
      state.gates.TIR = 1;
      state.gates.ENV = 1;
      state.gates.OBJ = 1;
      state.gates.RA = 1;
      
      const result = transitionPhase(state, 'DISCOVER');
      
      expect(result.success).toBe(true);
      expect(result.state.session.phase).toBe('DISCOVER');
      expect(result.state.session.kingdom).toBe('IDEATION');
      expect(result.phaseTransition?.from).toBe('SETUP');
      expect(result.phaseTransition?.to).toBe('DISCOVER');
    });
    
    it('should fail transition when requirements not met', () => {
      const state = createDefaultState();
      
      const result = transitionPhase(state, 'EXECUTE');
      
      expect(result.success).toBe(false);
    });
  });
});

describe('License/Disclaimer Transitions', () => {
  describe('setLicenseValidated', () => {
    it('should validate license and pass gate', () => {
      const state = createDefaultState();
      
      const result = setLicenseValidated(state, 'test@example.com', 'STANDARD');
      
      expect(result.success).toBe(true);
      expect(result.state.license.validated).toBe(true);
      expect(result.state.license.identifier).toBe('test@example.com');
      expect(result.state.license.type).toBe('STANDARD');
      expect(result.state.gates.LIC).toBe(1);
      expect(result.state.setup.gates.license).toBe(true);
    });
  });
  
  describe('setDisclaimerAccepted', () => {
    it('should accept disclaimer and pass gate', () => {
      const state = createDefaultState();
      
      const result = setDisclaimerAccepted(state, 'test@example.com');
      
      expect(result.success).toBe(true);
      expect(result.state.disclaimer.accepted).toBe(true);
      expect(result.state.disclaimer.acceptedIdentifier).toBe('test@example.com');
      expect(result.state.gates.DIS).toBe(1);
    });
  });
});

describe('Reality Classification', () => {
  describe('setRealityClassification', () => {
    it('should set GREENFIELD classification', () => {
      const state = createDefaultState();
      
      const result = setRealityClassification(state, 'GREENFIELD');
      
      expect(result.success).toBe(true);
      expect(result.state.reality.class).toBe('GREENFIELD');
      expect(result.state.gates.RA).toBe(1);
    });
    
    it('should set BROWNFIELD-EXTEND with scopes', () => {
      const state = createDefaultState();
      
      const result = setRealityClassification(
        state,
        'BROWNFIELD-EXTEND',
        ['database', 'auth'],
        ['frontend']
      );
      
      expect(result.success).toBe(true);
      expect(result.state.reality.class).toBe('BROWNFIELD-EXTEND');
      expect(result.state.reality.conservedScopes).toContain('database');
      expect(result.state.reality.conservedScopes).toContain('auth');
      expect(result.state.reality.replaceableScopes).toContain('frontend');
    });
  });
});

describe('Formula Binding', () => {
  describe('setFormulaApproved and setFormulaBound', () => {
    it('should require approval before binding', () => {
      const state = createDefaultState();
      
      const bindResult = setFormulaBound(state);
      
      expect(bindResult.success).toBe(false);
      expect(bindResult.error).toContain('approved');
    });
    
    it('should allow binding after approval', () => {
      const state = createDefaultState();
      
      const approveResult = setFormulaApproved(state);
      expect(approveResult.success).toBe(true);
      
      const bindResult = setFormulaBound(approveResult.state);
      
      expect(bindResult.success).toBe(true);
      expect(bindResult.state.formula.bound).toBe(true);
      expect(bindResult.state.gates.FX).toBe(1);
      expect(bindResult.state.bindings.formula.bound).toBe(true);
    });
  });
});

describe('Session Management', () => {
  describe('incrementMessageCount', () => {
    it('should increment message count', () => {
      const state = createDefaultState();
      
      let result = incrementMessageCount(state);
      expect(result.state.session.messageCount).toBe(1);
      
      result = incrementMessageCount(result.state);
      expect(result.state.session.messageCount).toBe(2);
    });
  });
});

describe('Execution Eligibility', () => {
  describe('checkExecutionEligibility', () => {
    it('should fail with incomplete setup', () => {
      const state = createDefaultState();
      
      const result = checkExecutionEligibility(state);
      
      expect(result.eligible).toBe(false);
      expect(result.blockers.length).toBeGreaterThan(0);
    });
  });
});

describe('Setup Progress', () => {
  describe('getSetupProgress', () => {
    it('should track setup progress correctly', () => {
      const state = createDefaultState();
      state.gates.LIC = 1;
      state.gates.DIS = 1;
      
      const progress = getSetupProgress(state);
      
      expect(progress.current).toBe(2);
      expect(progress.total).toBe(9);
      expect(progress.passed).toContain('LIC');
      expect(progress.passed).toContain('DIS');
      expect(progress.remaining).toContain('TIR');
    });
  });
});

describe('Formatting', () => {
  describe('formatGatesForHeader', () => {
    it('should format gates correctly', () => {
      const state = createDefaultState();
      state.gates.LIC = 1;
      state.gates.DIS = 1;
      
      const formatted = formatGatesForHeader(state);
      
      expect(formatted).toContain('LIC●');
      expect(formatted).toContain('DIS●');
      expect(formatted).toContain('TIR○');
    });
  });
});

describe('Blocking Gate Detection', () => {
  describe('getFirstBlockingGate', () => {
    it('should return first blocking gate that is not passed', () => {
      const state = createDefaultState();
      
      const first = getFirstBlockingGate(state);
      
      expect(first).toBe('LIC');
    });
    
    it('should return null when all blocking gates passed', () => {
      const state = createDefaultState();
      for (const gate of BLOCKING_GATES) {
        state.gates[gate] = 1;
      }
      
      const first = getFirstBlockingGate(state);
      
      expect(first).toBeNull();
    });
  });
});
