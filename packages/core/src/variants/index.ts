/**
 * AIXORD Variants
 * 
 * Variant configuration, loading, and management.
 * 
 * @module @aixord/core/variants
 */

// Re-export types
export type {
  ProviderID,
  ProviderTier,
  MessageThresholds,
  TierFeatures,
  VariantConfig,
  VariantPrompts,
  VariantRule,
  ProviderSelectors,
  VariantAdaptations,
  VariantMetadata,
} from '../types/variants';

export {
  DEFAULT_THRESHOLDS,
  DEFAULT_HEADER_TEMPLATE,
  getProviderDisplayName,
} from '../types/variants';

// Variant interface
export { VariantInstance, VariantBuilder } from './interface';

// Variant loader
export {
  VariantLoader,
  getVariantLoader,
  resetVariantLoader,
  loadVariant,
  loadDefaultVariant,
  getActiveVariant,
  type VariantLoadResult,
} from './loader';
