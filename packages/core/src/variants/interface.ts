/**
 * AIXORD Variant Interface
 * 
 * Runtime interface for interacting with loaded variants.
 * 
 * @module @aixord/core/variants/interface
 */

import type { AIXORDState } from '../types/state';
import type {
  VariantConfig,
  ProviderID,
  ProviderTier,
  MessageThresholds,
  VariantPrompts,
  VariantRule,
} from '../types/variants';
import { DEFAULT_THRESHOLDS, DEFAULT_HEADER_TEMPLATE } from '../types/variants';

// ============================================================================
// VARIANT INSTANCE
// ============================================================================

/**
 * Active variant instance with runtime methods
 */
export class VariantInstance {
  private config: VariantConfig;
  private activeTier: ProviderTier | null = null;
  
  constructor(config: VariantConfig) {
    this.config = config;
  }
  
  // --------------------------------------------------------------------------
  // GETTERS
  // --------------------------------------------------------------------------
  
  /** Get variant ID */
  get id(): string {
    return this.config.id;
  }
  
  /** Get provider ID */
  get provider(): ProviderID {
    return this.config.provider;
  }
  
  /** Get variant version */
  get version(): string {
    return this.config.version;
  }
  
  /** Get variant name */
  get name(): string {
    return this.config.name;
  }
  
  /** Get full config */
  get rawConfig(): VariantConfig {
    return this.config;
  }
  
  /** Get prompts */
  get prompts(): VariantPrompts {
    return this.config.prompts;
  }
  
  /** Get rules */
  get rules(): VariantRule[] {
    return this.config.rules;
  }
  
  /** Get active tier */
  get tier(): ProviderTier | null {
    return this.activeTier;
  }
  
  // --------------------------------------------------------------------------
  // TIER MANAGEMENT
  // --------------------------------------------------------------------------
  
  /**
   * Set active tier by code
   */
  setTier(tierCode: string): boolean {
    const tier = this.config.tiers.find(t => t.code === tierCode);
    if (tier) {
      this.activeTier = tier;
      return true;
    }
    return false;
  }
  
  /**
   * Get available tiers
   */
  getAvailableTiers(): ProviderTier[] {
    return this.config.tiers;
  }
  
  /**
   * Get message thresholds for active tier
   */
  getThresholds(): MessageThresholds {
    if (this.activeTier) {
      return this.activeTier.thresholds;
    }
    return DEFAULT_THRESHOLDS[this.config.provider] || DEFAULT_THRESHOLDS.custom;
  }
  
  // --------------------------------------------------------------------------
  // PROMPT GENERATION
  // --------------------------------------------------------------------------
  
  /**
   * Generate system prompt for initial injection
   */
  getSystemPrompt(): string {
    return this.config.prompts.system;
  }
  
  /**
   * Generate header for message injection
   */
  generateHeader(state: AIXORDState): string {
    const template = this.config.prompts.header || DEFAULT_HEADER_TEMPLATE;
    
    // Format gates
    const gatesStr = Object.entries(state.gates)
      .map(([k, v]) => `${k}${v === 1 ? '???' : '???'}`)
      .join('');
    
    return template
      .replace('{phase}', state.session.phase)
      .replace('{reality}', state.reality.class || 'UNSET')
      .replace('{formula}', state.formula.bound ? 'BOUND' : 'UNBOUND')
      .replace('{gates}', gatesStr)
      .replace('{msg}', String(state.session.messageCount))
      .replace('{session}', String(state.session.number))
      .replace('{mode}', state.session.mode);
  }
  
  /**
   * Generate setup prompt
   */
  getSetupPrompt(step: number): string {
    if (this.config.prompts.setup) {
      return this.config.prompts.setup.replace('{step}', String(step));
    }
    return `[AIXORD Setup Step ${step}/9]`;
  }
  
  /**
   * Generate checkpoint prompt
   */
  getCheckpointPrompt(state: AIXORDState): string {
    if (this.config.prompts.checkpoint) {
      return this.config.prompts.checkpoint
        .replace('{phase}', state.session.phase)
        .replace('{msg}', String(state.session.messageCount));
    }
    return `[CHECKPOINT at message ${state.session.messageCount}]`;
  }
  
  /**
   * Generate handoff prompt
   */
  getHandoffPrompt(state: AIXORDState): string {
    if (this.config.prompts.handoff) {
      return this.config.prompts.handoff
        .replace('{session}', String(state.session.number))
        .replace('{phase}', state.session.phase);
    }
    return `[HANDOFF | Session ${state.session.number} | Phase ${state.session.phase}]`;
  }
  
  // --------------------------------------------------------------------------
  // RULE CHECKING
  // --------------------------------------------------------------------------
  
  /**
   * Get active rules (not disabled)
   */
  getActiveRules(): VariantRule[] {
    return this.config.rules.filter(r => r.enforcement !== 'disabled');
  }
  
  /**
   * Get strict rules only
   */
  getStrictRules(): VariantRule[] {
    return this.config.rules.filter(r => r.enforcement === 'strict');
  }
  
  /**
   * Check if a rule is active
   */
  isRuleActive(ruleCode: string): boolean {
    const rule = this.config.rules.find(r => r.code === ruleCode);
    return rule ? rule.enforcement !== 'disabled' : false;
  }
  
  /**
   * Get rule by code
   */
  getRule(ruleCode: string): VariantRule | undefined {
    return this.config.rules.find(r => r.code === ruleCode);
  }
  
  // --------------------------------------------------------------------------
  // ADAPTATION CHECKS
  // --------------------------------------------------------------------------
  
  /**
   * Check if disclaimers should be stripped
   */
  shouldStripDisclaimers(): boolean {
    return this.config.adaptations?.verbosity?.stripDisclaimers ?? false;
  }
  
  /**
   * Check if moral framing should be stripped
   */
  shouldStripMoralFraming(): boolean {
    return this.config.adaptations?.verbosity?.stripMoralFraming ?? false;
  }
  
  /**
   * Get default verbosity mode
   */
  getDefaultVerbosity(): 'brief' | 'standard' | 'detailed' {
    return this.config.adaptations?.verbosity?.defaultMode ?? 'standard';
  }
  
  /**
   * Check if governance takes precedence over safety
   */
  governanceTakesPrecedence(): boolean {
    return this.config.adaptations?.safetyOverrides?.governancePrecedence ?? false;
  }
  
  /**
   * Get checkpoint prompt threshold
   */
  getCheckpointPromptThreshold(): number {
    return this.config.adaptations?.alignmentDrift?.checkpointPromptAt ?? 20;
  }
  
  // --------------------------------------------------------------------------
  // SELECTOR ACCESS
  // --------------------------------------------------------------------------
  
  /**
   * Get DOM selectors (for extension)
   */
  getSelectors(): VariantConfig['selectors'] {
    return this.config.selectors;
  }
  
  /**
   * Get a specific selector
   */
  getSelector(key: keyof NonNullable<VariantConfig['selectors']>): string | undefined {
    return this.config.selectors?.[key];
  }
}

// ============================================================================
// VARIANT BUILDER
// ============================================================================

/**
 * Builder for creating variant configurations
 */
export class VariantBuilder {
  private config: Partial<VariantConfig> = {};
  
  /**
   * Set basic info
   */
  withInfo(
    id: string,
    provider: ProviderID,
    version: string,
    name: string
  ): VariantBuilder {
    this.config.id = id;
    this.config.provider = provider;
    this.config.version = version;
    this.config.name = name;
    return this;
  }
  
  /**
   * Set description
   */
  withDescription(description: string): VariantBuilder {
    this.config.description = description;
    return this;
  }
  
  /**
   * Set AIXORD version
   */
  forAixordVersion(version: string): VariantBuilder {
    this.config.aixordVersion = version;
    return this;
  }
  
  /**
   * Add tier
   */
  addTier(tier: ProviderTier): VariantBuilder {
    if (!this.config.tiers) {
      this.config.tiers = [];
    }
    this.config.tiers.push(tier);
    return this;
  }
  
  /**
   * Set prompts
   */
  withPrompts(prompts: VariantPrompts): VariantBuilder {
    this.config.prompts = prompts;
    return this;
  }
  
  /**
   * Add rule
   */
  addRule(rule: VariantRule): VariantBuilder {
    if (!this.config.rules) {
      this.config.rules = [];
    }
    this.config.rules.push(rule);
    return this;
  }
  
  /**
   * Set selectors
   */
  withSelectors(selectors: VariantConfig['selectors']): VariantBuilder {
    this.config.selectors = selectors;
    return this;
  }
  
  /**
   * Set adaptations
   */
  withAdaptations(adaptations: VariantConfig['adaptations']): VariantBuilder {
    this.config.adaptations = adaptations;
    return this;
  }
  
  /**
   * Build the variant config
   */
  build(): VariantConfig {
    // Validate required fields
    if (!this.config.id) throw new Error('Variant ID required');
    if (!this.config.provider) throw new Error('Provider required');
    if (!this.config.version) throw new Error('Version required');
    if (!this.config.name) throw new Error('Name required');
    if (!this.config.prompts) throw new Error('Prompts required');
    
    return {
      id: this.config.id,
      provider: this.config.provider,
      version: this.config.version,
      name: this.config.name,
      description: this.config.description,
      aixordVersion: this.config.aixordVersion || '4.2',
      tiers: this.config.tiers || [],
      prompts: this.config.prompts,
      rules: this.config.rules || [],
      selectors: this.config.selectors,
      adaptations: this.config.adaptations,
    };
  }
  
  /**
   * Build and create instance
   */
  buildInstance(): VariantInstance {
    return new VariantInstance(this.build());
  }
}

