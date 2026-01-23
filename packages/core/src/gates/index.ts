/**
 * AIXORD Gates
 * 
 * Gate checking, transitions, and definitions.
 * 
 * @module @aixord/core/gates
 */

// Re-export definitions from governance types
export {
  GATE_ORDER,
  BLOCKING_GATES,
  NON_BLOCKING_GATES,
  SETUP_GATES,
  GATE_DEFINITIONS,
  type GateDefinition,
} from '../types/governance';

// Gate checking
export * from './checker';

// Gate transitions
export * from './transitions';
