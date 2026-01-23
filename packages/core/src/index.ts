/**
 * AIXORD Core
 *
 * Core types, validation, gates, formula, and variant management
 * for the AIXORD Enforcement Platform.
 *
 * @module @aixord/core
 */

// Version info
export const CORE_VERSION = '1.0.0';

// Types
export * from './types';

// Validation
export * from './validation';

// Gates
export * from './gates';

// Formula
export * from './formula';

// Variants - explicit exports to avoid collision with types
export {
  DEFAULT_THRESHOLDS,
  DEFAULT_HEADER_TEMPLATE,
  getProviderDisplayName,
  VariantInstance,
  VariantBuilder,
  VariantLoader,
  getVariantLoader,
  resetVariantLoader,
  loadVariant,
  loadDefaultVariant,
  getActiveVariant,
} from './variants';

export type { VariantLoadResult } from './variants';
