/**
 * AIXORD State Schema Types
 * 
 * Core type definitions for AIXORD governance state.
 * Based on AIXORD v4.2 specification.
 * 
 * @module @aixord/core/types/state
 */

// ============================================================================
// VERSION & METADATA
// ============================================================================

/** Current AIXORD version this schema supports */
export const AIXORD_VERSION = '4.2' as const;

/** State schema version for migration support */
export const STATE_SCHEMA_VERSION = 1;

// ============================================================================
// LICENSE TYPES
// ============================================================================

/**
 * Valid license types
 */
export type LicenseType = 'STANDARD' | 'MASTER' | 'TEST' | 'GIFT';

/**
 * License validation state
 */
export interface LicenseState {
  /** Email or license code used for validation */
  identifier: string;
  
  /** Type of license */
  type: LicenseType | '';
  
  /** Whether license has been validated */
  validated: boolean;
  
  /** ISO timestamp of validation */
  validatedDate?: string;
}

// ============================================================================
// DISCLAIMER TYPES
// ============================================================================

/**
 * Disclaimer acceptance state
 */
export interface DisclaimerState {
  /** Whether disclaimer has been accepted */
  accepted: boolean;
  
  /** ISO timestamp of acceptance */
  acceptedDate?: string;
  
  /** Identifier used when accepting (for audit) */
  acceptedIdentifier?: string;
}

// ============================================================================
// TIER TYPES
// ============================================================================

/**
 * Platform tier categories
 */
export type TierLevel = 'FREE' | 'PLUS' | 'PRO' | 'TEAM' | 'ENTERPRISE';

/**
 * Platform tier state
 */
export interface TierState {
  /** Platform name (claude, chatgpt, gemini, etc.) */
  platform: string;
  
  /** Tier level */
  level: TierLevel | string;
}

// ============================================================================
// SETUP TYPES
// ============================================================================

/**
 * Setup gate identifiers (9 steps)
 */
export type SetupGate = 
  | 'license'
  | 'disclaimer'
  | 'tier'
  | 'environment'
  | 'folder'
  | 'citation'
  | 'continuity'
  | 'objective'
  | 'reality';

/**
 * Folder structure options
 */
export type FolderOption = 'default' | 'aixord_standard' | 'user_controlled';

/**
 * Citation mode options
 */
export type CitationMode = 'default' | 'strict' | 'standard' | 'minimal';

/**
 * Continuity mode options
 */
export type ContinuityMode = 'default' | 'standard' | 'strict' | 'auto_handoff';

/**
 * Setup completion state
 */
export interface SetupState {
  /** Whether all 9 setup steps are complete */
  complete: boolean;
  
  /** Current step number (1-9) */
  currentStep: number;
  
  /** Individual gate completion status */
  gates: {
    license: boolean;
    disclaimer: boolean;
    tier: boolean;
    environment: boolean;
    folder: FolderOption;
    citation: CitationMode;
    continuity: ContinuityMode;
    objective: boolean;
    reality: boolean;
  };
}

// ============================================================================
// REALITY TYPES
// ============================================================================

/**
 * Reality classification options
 */
export type RealityClass = 'GREENFIELD' | 'BROWNFIELD-EXTEND' | 'BROWNFIELD-REPLACE';

/**
 * Reality absorption state
 */
export interface RealityState {
  /** Reality classification */
  class: RealityClass | '';
  
  /** Scopes that must be conserved (extend-only) */
  conservedScopes: string[];
  
  /** Scopes authorized for replacement */
  replaceableScopes: string[];
  
  /** Scopes that have been unlocked via UNLOCK command */
  unlockedScopes: string[];
}

// ============================================================================
// FORMULA TYPES
// ============================================================================

/**
 * Formula binding state
 */
export interface FormulaState {
  /** Whether formula is bound to current session */
  bound: boolean;
  
  /** Whether formula has been approved by Director */
  approved: boolean;
  
  /** ISO timestamp of approval */
  approvedDate?: string;
  
  /** ISO timestamp of binding */
  boundDate?: string;
  
  /** Formula version identifier */
  version?: string;
}

// ============================================================================
// ARTIFACT BINDING TYPES
// ============================================================================

/**
 * Artifact binding method
 */
export type BindingMethod = 'visual' | 'textual' | 'hash' | 'platform' | 'attestation';

/**
 * Single artifact binding state
 */
export interface ArtifactBinding {
  /** Whether artifact is bound to current session */
  bound: boolean;
  
  /** Method used to confirm binding */
  method?: BindingMethod;
  
  /** ISO timestamp of binding */
  timestamp?: string;
  
  /** Content hash for verification */
  contentHash?: string;
}

/**
 * Artifact type identifiers
 */
export type ArtifactType = 
  | 'projectDocs'
  | 'formula'
  | 'blueprint'
  | 'masterScope'
  | 'dag'
  | 'handoff'
  | 'other';

/**
 * All artifact bindings
 */
export interface BindingsState {
  projectDocs: ArtifactBinding;
  formula: ArtifactBinding;
  blueprint: ArtifactBinding;
  masterScope: ArtifactBinding;
  dag: ArtifactBinding;
}

// ============================================================================
// PHASE & KINGDOM TYPES
// ============================================================================

/**
 * AIXORD phases in canonical order
 */
export type Phase = 
  | 'SETUP'
  | 'DISCOVER'
  | 'BRAINSTORM'
  | 'PLAN'
  | 'BLUEPRINT'
  | 'SCOPE'
  | 'EXECUTE'
  | 'AUDIT'
  | 'VERIFY'
  | 'LOCK';

/**
 * Phase ordering for comparison
 */
export const PHASE_ORDER: Phase[] = [
  'SETUP',
  'DISCOVER',
  'BRAINSTORM',
  'PLAN',
  'BLUEPRINT',
  'SCOPE',
  'EXECUTE',
  'AUDIT',
  'VERIFY',
  'LOCK',
];

/**
 * AIXORD kingdoms
 */
export type Kingdom = '' | 'IDEATION' | 'BLUEPRINT' | 'REALIZATION';

/**
 * Execution mode
 */
export type ExecutionMode = 'STRICT' | 'SUPERVISED' | 'SANDBOX';

// ============================================================================
// SESSION TYPES
// ============================================================================

/**
 * Current session state
 */
export interface SessionState {
  /** Session number (increments per HANDOFF) */
  number: number;
  
  /** Messages sent in current session */
  messageCount: number;
  
  /** Current phase */
  phase: Phase;
  
  /** Current kingdom */
  kingdom: Kingdom;
  
  /** Execution mode */
  mode: ExecutionMode;
  
  /** Provider ID (claude, chatgpt, etc.) */
  provider?: string;
  
  /** ISO timestamp of session start */
  startedAt?: string;
}

// ============================================================================
// GATE TYPES
// ============================================================================

/**
 * Gate identifiers
 */
export type GateID = 
  | 'LIC'  // License
  | 'DIS'  // Disclaimer
  | 'TIR'  // Tier
  | 'ENV'  // Environment
  | 'FLD'  // Folder
  | 'CIT'  // Citation
  | 'CON'  // Continuity
  | 'OBJ'  // Objective
  | 'RA'   // Reality Absorption
  | 'FX'   // Formula
  | 'PD'   // Project Docs
  | 'PR'   // Plan Review
  | 'BP'   // Blueprint
  | 'MS'   // Master Scope
  | 'VA'   // Validation/Evidence
  | 'HO';  // Handoff

/**
 * Gate value (0 = not passed, 1 = passed)
 */
export type GateValue = 0 | 1;

/**
 * All gates state
 */
export type GatesState = Record<GateID, GateValue>;

// ============================================================================
// PROJECT TYPES
// ============================================================================

/**
 * Project information
 */
export interface ProjectInfo {
  /** Project ID (from webapp) */
  id?: string;
  
  /** Project name */
  name: string;
  
  /** Project objective (1-2 sentences) */
  objective: string;
  
  /** Project description */
  description?: string;
}

// ============================================================================
// MAIN STATE TYPE
// ============================================================================

/**
 * Complete AIXORD state
 * 
 * This is the canonical state object that flows between
 * the extension and webapp.
 */
export interface AIXORDState {
  /** AIXORD version */
  version: string;
  
  /** State schema version for migrations */
  schemaVersion: number;
  
  /** Setup completion state */
  setup: SetupState;
  
  /** License validation state */
  license: LicenseState;
  
  /** Disclaimer acceptance state */
  disclaimer: DisclaimerState;
  
  /** Platform tier state */
  tier: TierState;
  
  /** Reality classification state */
  reality: RealityState;
  
  /** Formula binding state */
  formula: FormulaState;
  
  /** Artifact bindings */
  bindings: BindingsState;
  
  /** Current session state */
  session: SessionState;
  
  /** Gate completion state */
  gates: GatesState;
  
  /** Project information */
  project: ProjectInfo;
  
  /** ISO timestamp of last update */
  updatedAt?: string;
}

// ============================================================================
// DEFAULT STATE FACTORY
// ============================================================================

/**
 * Create a new default AIXORD state
 */
export function createDefaultState(): AIXORDState {
  return {
    version: AIXORD_VERSION,
    schemaVersion: STATE_SCHEMA_VERSION,
    
    setup: {
      complete: false,
      currentStep: 1,
      gates: {
        license: false,
        disclaimer: false,
        tier: false,
        environment: false,
        folder: 'default',
        citation: 'default',
        continuity: 'default',
        objective: false,
        reality: false,
      },
    },
    
    license: {
      identifier: '',
      type: '',
      validated: false,
    },
    
    disclaimer: {
      accepted: false,
    },
    
    tier: {
      platform: '',
      level: '',
    },
    
    reality: {
      class: '',
      conservedScopes: [],
      replaceableScopes: [],
      unlockedScopes: [],
    },
    
    formula: {
      bound: false,
      approved: false,
    },
    
    bindings: {
      projectDocs: { bound: false },
      formula: { bound: false },
      blueprint: { bound: false },
      masterScope: { bound: false },
      dag: { bound: false },
    },
    
    session: {
      number: 1,
      messageCount: 0,
      phase: 'SETUP',
      kingdom: '',
      mode: 'STRICT',
    },
    
    gates: {
      LIC: 0,
      DIS: 0,
      TIR: 0,
      ENV: 0,
      FLD: 0,
      CIT: 0,
      CON: 0,
      OBJ: 0,
      RA: 0,
      FX: 0,
      PD: 0,
      PR: 0,
      BP: 0,
      MS: 0,
      VA: 0,
      HO: 0,
    },
    
    project: {
      name: '',
      objective: '',
    },
    
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if a value is a valid LicenseType
 */
export function isLicenseType(value: unknown): value is LicenseType {
  return value === 'STANDARD' || value === 'MASTER' || value === 'TEST' || value === 'GIFT';
}

/**
 * Check if a value is a valid RealityClass
 */
export function isRealityClass(value: unknown): value is RealityClass {
  return (
    value === 'GREENFIELD' ||
    value === 'BROWNFIELD-EXTEND' ||
    value === 'BROWNFIELD-REPLACE'
  );
}

/**
 * Check if a value is a valid Phase
 */
export function isPhase(value: unknown): value is Phase {
  return PHASE_ORDER.includes(value as Phase);
}

/**
 * Check if a value is a valid GateID
 */
export function isGateID(value: unknown): value is GateID {
  const validGates: GateID[] = [
    'LIC', 'DIS', 'TIR', 'ENV', 'FLD', 'CIT', 'CON', 'OBJ',
    'RA', 'FX', 'PD', 'PR', 'BP', 'MS', 'VA', 'HO',
  ];
  return validGates.includes(value as GateID);
}

/**
 * Check if a value is a valid ExecutionMode
 */
export function isExecutionMode(value: unknown): value is ExecutionMode {
  return value === 'STRICT' || value === 'SUPERVISED' || value === 'SANDBOX';
}

/**
 * Check if a value is a valid BindingMethod
 */
export function isBindingMethod(value: unknown): value is BindingMethod {
  return (
    value === 'visual' ||
    value === 'textual' ||
    value === 'hash' ||
    value === 'platform' ||
    value === 'attestation'
  );
}
