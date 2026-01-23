/**
 * AIXORD Variant Loader
 * 
 * Loading, caching, and management of variant configurations.
 * 
 * @module @aixord/core/variants/loader
 */

import type { VariantConfig, ProviderID, VariantMetadata } from '../types/variants';
import { VariantInstance } from './interface';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Variant load result
 */
export interface VariantLoadResult {
  /** Whether load was successful */
  success: boolean;
  
  /** Loaded variant instance */
  variant?: VariantInstance;
  
  /** Error message if failed */
  error?: string;
}

/**
 * Variant registry entry
 */
interface RegistryEntry {
  /** Variant metadata */
  metadata: VariantMetadata;
  
  /** Variant config (null if not loaded) */
  config: VariantConfig | null;
  
  /** Cached instance */
  instance: VariantInstance | null;
}

// ============================================================================
// VARIANT LOADER
// ============================================================================

/**
 * Variant loader and registry
 */
export class VariantLoader {
  /** Registered variants */
  private registry: Map<string, RegistryEntry> = new Map();
  
  /** Default variant per provider */
  private defaults: Map<ProviderID, string> = new Map();
  
  /** Currently active variant */
  private activeVariant: VariantInstance | null = null;
  
  // --------------------------------------------------------------------------
  // REGISTRATION
  // --------------------------------------------------------------------------
  
  /**
   * Register a variant config
   */
  register(config: VariantConfig, isDefault = false): void {
    const metadata: VariantMetadata = {
      id: config.id,
      provider: config.provider,
      version: config.version,
      name: config.name,
      description: config.description,
      isDefault,
      updatedAt: new Date().toISOString(),
      supportedTiers: config.tiers.map(t => t.code),
    };
    
    this.registry.set(config.id, {
      metadata,
      config,
      instance: null,
    });
    
    if (isDefault) {
      this.defaults.set(config.provider, config.id);
    }
  }
  
  /**
   * Register variant from JSON
   */
  registerFromJSON(json: string, isDefault = false): VariantLoadResult {
    try {
      const config = JSON.parse(json) as VariantConfig;
      this.register(config, isDefault);
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: `Failed to parse variant JSON: ${e instanceof Error ? e.message : 'Unknown error'}`,
      };
    }
  }
  
  /**
   * Unregister a variant
   */
  unregister(variantId: string): boolean {
    const entry = this.registry.get(variantId);
    if (!entry) return false;
    
    // Remove from defaults if needed
    const provider = entry.metadata.provider;
    if (this.defaults.get(provider) === variantId) {
      this.defaults.delete(provider);
    }
    
    this.registry.delete(variantId);
    return true;
  }
  
  // --------------------------------------------------------------------------
  // LOADING
  // --------------------------------------------------------------------------
  
  /**
   * Load a variant by ID
   */
  load(variantId: string): VariantLoadResult {
    const entry = this.registry.get(variantId);
    if (!entry) {
      return {
        success: false,
        error: `Variant not found: ${variantId}`,
      };
    }
    
    if (!entry.config) {
      return {
        success: false,
        error: `Variant config not loaded: ${variantId}`,
      };
    }
    
    // Create instance if not cached
    if (!entry.instance) {
      entry.instance = new VariantInstance(entry.config);
    }
    
    return {
      success: true,
      variant: entry.instance,
    };
  }
  
  /**
   * Load default variant for a provider
   */
  loadDefault(provider: ProviderID): VariantLoadResult {
    const defaultId = this.defaults.get(provider);
    if (!defaultId) {
      return {
        success: false,
        error: `No default variant for provider: ${provider}`,
      };
    }
    
    return this.load(defaultId);
  }
  
  /**
   * Load and activate a variant
   */
  loadAndActivate(variantId: string): VariantLoadResult {
    const result = this.load(variantId);
    if (result.success && result.variant) {
      this.activeVariant = result.variant;
    }
    return result;
  }
  
  /**
   * Load and activate default variant for provider
   */
  loadAndActivateDefault(provider: ProviderID): VariantLoadResult {
    const result = this.loadDefault(provider);
    if (result.success && result.variant) {
      this.activeVariant = result.variant;
    }
    return result;
  }
  
  // --------------------------------------------------------------------------
  // ACTIVE VARIANT
  // --------------------------------------------------------------------------
  
  /**
   * Get active variant
   */
  getActive(): VariantInstance | null {
    return this.activeVariant;
  }
  
  /**
   * Set active variant
   */
  setActive(variant: VariantInstance): void {
    this.activeVariant = variant;
  }
  
  /**
   * Clear active variant
   */
  clearActive(): void {
    this.activeVariant = null;
  }
  
  // --------------------------------------------------------------------------
  // QUERIES
  // --------------------------------------------------------------------------
  
  /**
   * Get all registered variant metadata
   */
  getAll(): VariantMetadata[] {
    return Array.from(this.registry.values()).map(e => e.metadata);
  }
  
  /**
   * Get variants by provider
   */
  getByProvider(provider: ProviderID): VariantMetadata[] {
    return this.getAll().filter(m => m.provider === provider);
  }
  
  /**
   * Get variant metadata
   */
  getMetadata(variantId: string): VariantMetadata | undefined {
    return this.registry.get(variantId)?.metadata;
  }
  
  /**
   * Check if variant exists
   */
  has(variantId: string): boolean {
    return this.registry.has(variantId);
  }
  
  /**
   * Get default variant ID for provider
   */
  getDefaultId(provider: ProviderID): string | undefined {
    return this.defaults.get(provider);
  }
  
  /**
   * Get all provider IDs with registered variants
   */
  getProviders(): ProviderID[] {
    const providers = new Set<ProviderID>();
    for (const entry of this.registry.values()) {
      providers.add(entry.metadata.provider);
    }
    return Array.from(providers);
  }
  
  // --------------------------------------------------------------------------
  // CACHE MANAGEMENT
  // --------------------------------------------------------------------------
  
  /**
   * Clear cached instances
   */
  clearCache(): void {
    for (const entry of this.registry.values()) {
      entry.instance = null;
    }
  }
  
  /**
   * Clear specific variant cache
   */
  clearVariantCache(variantId: string): void {
    const entry = this.registry.get(variantId);
    if (entry) {
      entry.instance = null;
    }
  }
  
  /**
   * Get cache stats
   */
  getCacheStats(): {
    total: number;
    loaded: number;
    cached: number;
  } {
    let loaded = 0;
    let cached = 0;
    
    for (const entry of this.registry.values()) {
      if (entry.config) loaded++;
      if (entry.instance) cached++;
    }
    
    return {
      total: this.registry.size,
      loaded,
      cached,
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Global variant loader instance
 */
let globalLoader: VariantLoader | null = null;

/**
 * Get or create global variant loader
 */
export function getVariantLoader(): VariantLoader {
  if (!globalLoader) {
    globalLoader = new VariantLoader();
  }
  return globalLoader;
}

/**
 * Reset global variant loader (for testing)
 */
export function resetVariantLoader(): void {
  globalLoader = null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Quick load a variant by ID
 */
export function loadVariant(variantId: string): VariantInstance | null {
  const loader = getVariantLoader();
  const result = loader.load(variantId);
  return result.variant || null;
}

/**
 * Quick load default variant for provider
 */
export function loadDefaultVariant(provider: ProviderID): VariantInstance | null {
  const loader = getVariantLoader();
  const result = loader.loadDefault(provider);
  return result.variant || null;
}

/**
 * Get active variant
 */
export function getActiveVariant(): VariantInstance | null {
  return getVariantLoader().getActive();
}
