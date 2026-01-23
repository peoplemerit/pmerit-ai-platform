/**
 * AIXORD State Validation Schema
 * 
 * Zod schemas for runtime validation of AIXORD state.
 * 
 * @module @aixord/core/validation/schema
 */

import { z } from 'zod';
import { AIXORD_VERSION, STATE_SCHEMA_VERSION, PHASE_ORDER } from '../types/state';
import { GATE_ORDER } from '../types/governance';

// ============================================================================
// PRIMITIVE SCHEMAS
// ============================================================================

/**
 * License type schema
 */
export const licenseTypeSchema = z.enum(['STANDARD', 'MASTER', 'TEST', 'GIFT']);

/**
 * Reality class schema
 */
export const realityClassSchema = z.enum([
  'GREENFIELD',
  'BROWNFIELD-EXTEND',
  'BROWNFIELD-REPLACE',
]);

/**
 * Phase schema
 */
export const phaseSchema = z.enum([
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
]);

/**
 * Kingdom schema
 */
export const kingdomSchema = z.enum(['', 'IDEATION', 'BLUEPRINT', 'REALIZATION']);

/**
 * Execution mode schema
 */
export const executionModeSchema = z.enum(['STRICT', 'SUPERVISED', 'SANDBOX']);

/**
 * Binding method schema
 */
export const bindingMethodSchema = z.enum([
  'visual',
  'textual',
  'hash',
  'platform',
  'attestation',
]);

/**
 * Gate ID schema
 */
export const gateIdSchema = z.enum([
  'LIC', 'DIS', 'TIR', 'ENV', 'FLD', 'CIT', 'CON', 'OBJ',
  'RA', 'FX', 'PD', 'PR', 'BP', 'MS', 'VA', 'HO',
]);

/**
 * Gate value schema (0 or 1)
 */
export const gateValueSchema = z.union([z.literal(0), z.literal(1)]);

/**
 * Folder option schema
 */
export const folderOptionSchema = z.enum(['default', 'aixord_standard', 'user_controlled']);

/**
 * Citation mode schema
 */
export const citationModeSchema = z.enum(['default', 'strict', 'standard', 'minimal']);

/**
 * Continuity mode schema
 */
export const continuityModeSchema = z.enum(['default', 'standard', 'strict', 'auto_handoff']);

/**
 * ISO datetime string schema
 */
export const isoDatetimeSchema = z.string().datetime({ offset: true }).optional();

// ============================================================================
// COMPONENT SCHEMAS
// ============================================================================

/**
 * License state schema
 */
export const licenseStateSchema = z.object({
  identifier: z.string(),
  type: z.union([licenseTypeSchema, z.literal('')]),
  validated: z.boolean(),
  validatedDate: isoDatetimeSchema,
});

/**
 * Disclaimer state schema
 */
export const disclaimerStateSchema = z.object({
  accepted: z.boolean(),
  acceptedDate: isoDatetimeSchema,
  acceptedIdentifier: z.string().optional(),
});

/**
 * Tier state schema
 */
export const tierStateSchema = z.object({
  platform: z.string(),
  level: z.string(),
});

/**
 * Setup gates schema
 */
export const setupGatesSchema = z.object({
  license: z.boolean(),
  disclaimer: z.boolean(),
  tier: z.boolean(),
  environment: z.boolean(),
  folder: folderOptionSchema,
  citation: citationModeSchema,
  continuity: continuityModeSchema,
  objective: z.boolean(),
  reality: z.boolean(),
});

/**
 * Setup state schema
 */
export const setupStateSchema = z.object({
  complete: z.boolean(),
  currentStep: z.number().int().min(1).max(9),
  gates: setupGatesSchema,
});

/**
 * Reality state schema
 */
export const realityStateSchema = z.object({
  class: z.union([realityClassSchema, z.literal('')]),
  conservedScopes: z.array(z.string()),
  replaceableScopes: z.array(z.string()),
  unlockedScopes: z.array(z.string()),
});

/**
 * Formula state schema
 */
export const formulaStateSchema = z.object({
  bound: z.boolean(),
  approved: z.boolean(),
  approvedDate: isoDatetimeSchema,
  boundDate: isoDatetimeSchema,
  version: z.string().optional(),
});

/**
 * Artifact binding schema
 */
export const artifactBindingSchema = z.object({
  bound: z.boolean(),
  method: bindingMethodSchema.optional(),
  timestamp: isoDatetimeSchema,
  contentHash: z.string().optional(),
});

/**
 * Bindings state schema
 */
export const bindingsStateSchema = z.object({
  projectDocs: artifactBindingSchema,
  formula: artifactBindingSchema,
  blueprint: artifactBindingSchema,
  masterScope: artifactBindingSchema,
  dag: artifactBindingSchema,
});

/**
 * Session state schema
 */
export const sessionStateSchema = z.object({
  number: z.number().int().min(1),
  messageCount: z.number().int().min(0),
  phase: phaseSchema,
  kingdom: kingdomSchema,
  mode: executionModeSchema,
  provider: z.string().optional(),
  startedAt: isoDatetimeSchema,
});

/**
 * Gates state schema (all gates)
 */
export const gatesStateSchema = z.object({
  LIC: gateValueSchema,
  DIS: gateValueSchema,
  TIR: gateValueSchema,
  ENV: gateValueSchema,
  FLD: gateValueSchema,
  CIT: gateValueSchema,
  CON: gateValueSchema,
  OBJ: gateValueSchema,
  RA: gateValueSchema,
  FX: gateValueSchema,
  PD: gateValueSchema,
  PR: gateValueSchema,
  BP: gateValueSchema,
  MS: gateValueSchema,
  VA: gateValueSchema,
  HO: gateValueSchema,
});

/**
 * Project info schema
 */
export const projectInfoSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  objective: z.string(),
  description: z.string().optional(),
});

// ============================================================================
// MAIN STATE SCHEMA
// ============================================================================

/**
 * Complete AIXORD state schema
 */
export const aixordStateSchema = z.object({
  version: z.string(),
  schemaVersion: z.number().int(),
  setup: setupStateSchema,
  license: licenseStateSchema,
  disclaimer: disclaimerStateSchema,
  tier: tierStateSchema,
  reality: realityStateSchema,
  formula: formulaStateSchema,
  bindings: bindingsStateSchema,
  session: sessionStateSchema,
  gates: gatesStateSchema,
  project: projectInfoSchema,
  updatedAt: isoDatetimeSchema,
});

/**
 * Partial state schema (for updates)
 */
export const partialAixordStateSchema = aixordStateSchema.partial();

// ============================================================================
// TYPE INFERENCE
// ============================================================================

/**
 * Inferred AIXORD state type from schema
 */
export type AIXORDStateFromSchema = z.infer<typeof aixordStateSchema>;

/**
 * Inferred partial state type
 */
export type PartialAIXORDState = z.infer<typeof partialAixordStateSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate a complete AIXORD state
 */
export function validateState(state: unknown): z.SafeParseReturnType<unknown, AIXORDStateFromSchema> {
  return aixordStateSchema.safeParse(state);
}

/**
 * Validate a partial state (for updates)
 */
export function validatePartialState(state: unknown): z.SafeParseReturnType<unknown, PartialAIXORDState> {
  return partialAixordStateSchema.safeParse(state);
}

/**
 * Parse and return state or throw
 */
export function parseState(state: unknown): AIXORDStateFromSchema {
  return aixordStateSchema.parse(state);
}

/**
 * Parse partial state or throw
 */
export function parsePartialState(state: unknown): PartialAIXORDState {
  return partialAixordStateSchema.parse(state);
}
