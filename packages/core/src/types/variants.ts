/**
 * AIXORD Variant Types
 * 
 * Type definitions for LLM provider-specific variants.
 * 
 * @module @aixord/core/types/variants
 */

// ============================================================================
// PROVIDER TYPES
// ============================================================================

/**
 * Supported LLM providers
 */
export type ProviderID = 'claude' | 'chatgpt' | 'gemini' | 'custom';

/**
 * Provider tier levels
 */
export interface ProviderTier {
  /** Provider ID */
  provider: ProviderID;
  
  /** Tier name (Free, Pro, Team, etc.) */
  name: string;
  
  /** Tier code */
  code: string;
  
  /** Message thresholds */
  thresholds: MessageThresholds;
  
  /** Feature flags */
  features: TierFeatures;
}

/**
 * Message count thresholds
 */
export interface MessageThresholds {
  /** Warning threshold */
  warn: number;
  
  /** Critical threshold */
  critical: number;
  
  /** Hard limit (force checkpoint) */
  halt: number;
  
  /** Auto-checkpoint interval */
  autoCheckpoint?: number;
}

/**
 * Tier feature flags
 */
export interface TierFeatures {
  /** Extended context available */
  extendedContext: boolean;
  
  /** File uploads supported */
  fileUploads: boolean;
  
  /** Code execution available */
  codeExecution: boolean;
  
  /** Web search available */
  webSearch: boolean;
  
  /** Image generation available */
  imageGeneration: boolean;
}

// ============================================================================
// VARIANT CONFIGURATION
// ============================================================================

/**
 * Complete variant configuration
 */
export interface VariantConfig {
  /** Variant identifier */
  id: string;
  
  /** Provider ID */
  provider: ProviderID;
  
  /** Variant version */
  version: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Base AIXORD version this variant targets */
  aixordVersion: string;
  
  /** Tier configurations */
  tiers: ProviderTier[];
  
  /** Prompt configurations */
  prompts: VariantPrompts;
  
  /** Provider-specific rules */
  rules: VariantRule[];
  
  /** DOM selectors (for extension) */
  selectors?: ProviderSelectors;
  
  /** Behavioral adaptations */
  adaptations?: VariantAdaptations;
}

/**
 * Variant prompt templates
 */
export interface VariantPrompts {
  /** Full system prompt (for initial injection) */
  system: string;
  
  /** Compact header template */
  header: string;
  
  /** Setup sequence prompt */
  setup?: string;
  
  /** Checkpoint prompt */
  checkpoint?: string;
  
  /** Handoff prompt */
  handoff?: string;
}

/**
 * Provider-specific rule
 */
export interface VariantRule {
  /** Rule code (e.g., L-CL1) */
  code: string;
  
  /** Rule description */
  description: string;
  
  /** Enforcement level */
  enforcement: 'strict' | 'advisory' | 'disabled';
  
  /** Trigger conditions */
  triggers?: string[];
  
  /** Resolution action */
  resolution?: string;
}

/**
 * DOM selectors for browser extension
 */
export interface ProviderSelectors {
  /** Input field selector */
  inputField: string;
  
  /** Send button selector */
  sendButton: string;
  
  /** Response container selector */
  responseContainer: string;
  
  /** Individual message selector */
  messageElement: string;
  
  /** Conversation list selector */
  conversationList?: string;
  
  /** New chat button selector */
  newChatButton?: string;
  
  /** Model selector dropdown */
  modelSelector?: string;
}

/**
 * Behavioral adaptations for specific provider weaknesses
 */
export interface VariantAdaptations {
  /** Verbosity control settings */
  verbosity?: {
    /** Default mode */
    defaultMode: 'brief' | 'standard' | 'detailed';
    
    /** Strip disclaimers */
    stripDisclaimers: boolean;
    
    /** Strip moral framing */
    stripMoralFraming: boolean;
  };
  
  /** Safety override settings */
  safetyOverrides?: {
    /** Allow benign misclassification recovery */
    allowBenignRecovery: boolean;
    
    /** Governance takes precedence */
    governancePrecedence: boolean;
  };
  
  /** Self-correction settings */
  selfCorrection?: {
    /** Require reassessment on challenge */
    requireReassessment: boolean;
    
    /** Multi-step validation checkpoints */
    validationCheckpoints: boolean;
  };
  
  /** Alignment drift prevention */
  alignmentDrift?: {
    /** Restate constraints at phase boundaries */
    restateAtPhases: boolean;
    
    /** Message count for checkpoint prompt */
    checkpointPromptAt: number;
    
    /** Verify long-context conclusions */
    verifyLongContext: boolean;
  };
}

// ============================================================================
// VARIANT METADATA
// ============================================================================

/**
 * Variant metadata for listing/selection
 */
export interface VariantMetadata {
  /** Variant ID */
  id: string;
  
  /** Provider */
  provider: ProviderID;
  
  /** Version */
  version: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Whether this is the default for the provider */
  isDefault: boolean;
  
  /** Last updated timestamp */
  updatedAt: string;
  
  /** Supported tier codes */
  supportedTiers: string[];
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

/**
 * Default message thresholds by provider
 */
export const DEFAULT_THRESHOLDS: Record<ProviderID, MessageThresholds> = {
  claude: {
    warn: 15,
    critical: 20,
    halt: 25,
    autoCheckpoint: 30,
  },
  chatgpt: {
    warn: 20,
    critical: 30,
    halt: 40,
    autoCheckpoint: 50,
  },
  gemini: {
    warn: 15,
    critical: 25,
    halt: 35,
    autoCheckpoint: 40,
  },
  custom: {
    warn: 15,
    critical: 20,
    halt: 25,
  },
};

/**
 * Default header template
 */
export const DEFAULT_HEADER_TEMPLATE = 
  '[AIXORD|Phase:{phase}|Reality:{reality}|Formula:{formula}|Gates:{gates}|Msg:{msg}]';

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: ProviderID): string {
  switch (provider) {
    case 'claude':
      return 'Claude (Anthropic)';
    case 'chatgpt':
      return 'ChatGPT (OpenAI)';
    case 'gemini':
      return 'Gemini (Google)';
    case 'custom':
      return 'Custom Provider';
    default:
      return provider;
  }
}
