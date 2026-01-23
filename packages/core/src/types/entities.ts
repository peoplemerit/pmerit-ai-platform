/**
 * AIXORD Entity Types
 * 
 * Database entity types for artifacts, bindings, licenses,
 * projects, sessions, and teams.
 * 
 * @module @aixord/core/types/entities
 */

import type { 
  ArtifactType, 
  BindingMethod, 
  RealityClass, 
  Phase, 
  Kingdom, 
  ExecutionMode,
  LicenseType,
} from './state';
import type { GateID, TaskClass } from './governance';

// ============================================================================
// BASE ENTITY
// ============================================================================

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  /** Unique identifier */
  id: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt?: string;
}

// ============================================================================
// USER ENTITIES
// ============================================================================

/**
 * User entity
 */
export interface User extends BaseEntity {
  /** User email */
  email: string;
  
  /** Display name */
  name?: string;
  
  /** Last active timestamp */
  lastActiveAt: string;
  
  /** User preferences */
  preferences?: UserPreferences;
}

/**
 * User preferences
 */
export interface UserPreferences {
  /** Default citation mode */
  defaultCitationMode?: 'strict' | 'standard' | 'minimal';
  
  /** Default continuity mode */
  defaultContinuityMode?: 'standard' | 'strict' | 'auto_handoff';
  
  /** Default folder structure */
  defaultFolderStructure?: 'aixord_standard' | 'user_controlled';
  
  /** Theme preference */
  theme?: 'light' | 'dark' | 'system';
  
  /** Notification preferences */
  notifications?: {
    checkpoint_warnings: boolean;
    gate_blocks: boolean;
    sync_errors: boolean;
  };
}

// ============================================================================
// LICENSE ENTITIES
// ============================================================================

/**
 * License entity
 */
export interface License extends BaseEntity {
  /** Owner user ID */
  userId: string;
  
  /** License type */
  type: LicenseType;
  
  /** License code */
  code: string;
  
  /** Maximum allowed seats/activations */
  maxSeats: number;
  
  /** Valid from date */
  validFrom: string;
  
  /** Valid until date (null = never expires) */
  validUntil?: string | null;
  
  /** Current activation count */
  activationCount?: number;
  
  /** License metadata */
  metadata?: LicenseMetadata;
}

/**
 * License metadata
 */
export interface LicenseMetadata {
  /** Purchase source */
  source?: 'gumroad' | 'stripe' | 'manual' | 'gift';
  
  /** Purchase order/transaction ID */
  transactionId?: string;
  
  /** Notes */
  notes?: string;
}

/**
 * License activation record
 */
export interface LicenseActivation extends BaseEntity {
  /** License ID */
  licenseId: string;
  
  /** Device fingerprint */
  deviceFingerprint: string;
  
  /** User agent string */
  userAgent?: string;
  
  /** Last seen timestamp */
  lastSeenAt: string;
  
  /** IP address (hashed) */
  ipHash?: string;
}

/**
 * License validation result
 */
export interface LicenseValidationResult {
  /** Whether license is valid */
  valid: boolean;
  
  /** License type if valid */
  type?: LicenseType;
  
  /** Error message if invalid */
  error?: string;
  
  /** Error code */
  errorCode?: 'INVALID' | 'EXPIRED' | 'SEATS_EXCEEDED' | 'NOT_FOUND';
  
  /** Remaining days until expiration */
  daysRemaining?: number;
  
  /** Remaining seats */
  seatsRemaining?: number;
}

// ============================================================================
// PROJECT ENTITIES
// ============================================================================

/**
 * Project entity
 */
export interface Project extends BaseEntity {
  /** Owner user ID */
  userId: string;
  
  /** Team ID (if shared) */
  teamId?: string;
  
  /** Project name */
  name: string;
  
  /** Project objective */
  objective: string;
  
  /** Project description */
  description?: string;
  
  /** Reality classification */
  realityClass: RealityClass;
  
  /** Conserved scopes (for brownfield) */
  conservedScopes?: string[];
  
  /** Replaceable scopes (for brownfield) */
  replaceableScopes?: string[];
  
  /** Archive timestamp (null = not archived) */
  archivedAt?: string | null;
  
  /** Current session number */
  currentSessionNumber?: number;
  
  /** Project tags */
  tags?: string[];
}

/**
 * Project state entity (current state)
 */
export interface ProjectState extends BaseEntity {
  /** Project ID */
  projectId: string;
  
  /** Full state JSON */
  stateJson: object;
  
  /** State version (increments on each update) */
  version: number;
}

/**
 * State history entry
 */
export interface StateHistoryEntry extends BaseEntity {
  /** Project ID */
  projectId: string;
  
  /** Full state JSON at this point */
  stateJson: object;
  
  /** Message number when state was captured */
  messageNumber: number;
  
  /** Session number */
  sessionNumber: number;
  
  /** Phase at capture */
  phase?: Phase;
  
  /** Trigger for capture (auto, manual, gate_pass, etc.) */
  trigger?: 'auto' | 'manual' | 'gate_pass' | 'checkpoint' | 'handoff';
}

// ============================================================================
// ARTIFACT ENTITIES
// ============================================================================

/**
 * Artifact entity
 */
export interface Artifact extends BaseEntity {
  /** Project ID */
  projectId: string;
  
  /** Artifact type */
  type: ArtifactType;
  
  /** Artifact name */
  name: string;
  
  /** Storage path (if stored remotely) */
  storagePath?: string;
  
  /** Content hash (SHA-256) */
  contentHash: string;
  
  /** File size in bytes */
  sizeBytes?: number;
  
  /** MIME type */
  mimeType?: string;
  
  /** Artifact metadata */
  metadata?: ArtifactMetadata;
}

/**
 * Artifact metadata
 */
export interface ArtifactMetadata {
  /** Original filename */
  originalFilename?: string;
  
  /** Version string */
  version?: string;
  
  /** Description */
  description?: string;
  
  /** Dependencies (other artifact IDs) */
  dependencies?: string[];
}

/**
 * Artifact binding entity
 */
export interface ArtifactBindingEntity extends BaseEntity {
  /** Artifact ID */
  artifactId: string;
  
  /** Session ID */
  sessionId: string;
  
  /** Binding method */
  method: BindingMethod;
  
  /** Timestamp of binding */
  boundAt: string;
  
  /** Verification status */
  verified?: boolean;
  
  /** Verification timestamp */
  verifiedAt?: string;
}

/**
 * Artifact with binding status (for queries)
 */
export interface ArtifactWithBinding extends Artifact {
  /** Current binding (if any) */
  binding?: ArtifactBindingEntity;
  
  /** Whether artifact is currently bound */
  isBound: boolean;
}

// ============================================================================
// SESSION ENTITIES
// ============================================================================

/**
 * Session entity
 */
export interface Session extends BaseEntity {
  /** Project ID */
  projectId: string;
  
  /** Session number */
  number: number;
  
  /** LLM provider used */
  provider: string;
  
  /** Session start timestamp */
  startedAt: string;
  
  /** Session end timestamp */
  endedAt?: string;
  
  /** Final message count */
  messageCount?: number;
  
  /** Final phase reached */
  finalPhase?: Phase;
  
  /** Whether session ended with handoff */
  hasHandoff?: boolean;
}

/**
 * Handoff entity
 */
export interface Handoff extends BaseEntity {
  /** Session ID */
  sessionId: string;
  
  /** Project ID (denormalized for queries) */
  projectId: string;
  
  /** Handoff content (markdown) */
  content: string;
  
  /** State snapshot at handoff */
  stateJson: object;
  
  /** Session number (denormalized) */
  sessionNumber: number;
  
  /** Previous handoff ID (for chain) */
  previousHandoffId?: string;
}

/**
 * Handoff chain entry (for display)
 */
export interface HandoffChainEntry {
  /** Handoff ID */
  id: string;
  
  /** Session number */
  sessionNumber: number;
  
  /** Created timestamp */
  createdAt: string;
  
  /** Phase at handoff */
  phase: Phase;
  
  /** Summary (first 100 chars of content) */
  summary: string;
}

// ============================================================================
// VARIANT ENTITIES
// ============================================================================

/**
 * Variant entity
 */
export interface Variant extends BaseEntity {
  /** Provider ID (claude, chatgpt, gemini, etc.) */
  provider: string;
  
  /** Variant version */
  version: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Configuration JSON */
  configJson: VariantConfig;
  
  /** Whether this is the default for the provider */
  isDefault: boolean;
  
  /** Whether variant is active */
  isActive: boolean;
}

/**
 * Variant configuration
 */
export interface VariantConfig {
  /** Base AIXORD version */
  aixordVersion: string;
  
  /** Provider-specific adaptations */
  adaptations?: {
    /** Message count thresholds */
    messageThresholds?: {
      warn: number;
      critical: number;
      halt: number;
    };
    
    /** Prompt modifications */
    promptModifications?: {
      /** Prefix added to all prompts */
      prefix?: string;
      
      /** Suffix added to all prompts */
      suffix?: string;
      
      /** Header format override */
      headerFormat?: string;
    };
    
    /** Provider-specific rules */
    rules?: Array<{
      code: string;
      description: string;
      enforcement: 'strict' | 'advisory';
    }>;
  };
  
  /** Full variant prompt (for initial injection) */
  fullPrompt?: string;
  
  /** Compact prompt (for subsequent messages) */
  compactPrompt?: string;
}

// ============================================================================
// TEAM ENTITIES
// ============================================================================

/**
 * Team role
 */
export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER';

/**
 * Team entity
 */
export interface Team extends BaseEntity {
  /** Team name */
  name: string;
  
  /** Owner user ID */
  ownerId: string;
  
  /** Team description */
  description?: string;
  
  /** Team settings */
  settings?: TeamSettings;
  
  /** Member count (denormalized) */
  memberCount?: number;
  
  /** Project count (denormalized) */
  projectCount?: number;
}

/**
 * Team settings
 */
export interface TeamSettings {
  /** Default project visibility */
  defaultProjectVisibility?: 'private' | 'team';
  
  /** Allow members to create projects */
  allowMemberProjects?: boolean;
  
  /** Require admin approval for new members */
  requireAdminApproval?: boolean;
}

/**
 * Team member entity
 */
export interface TeamMember extends BaseEntity {
  /** Team ID */
  teamId: string;
  
  /** User ID */
  userId: string;
  
  /** Member role */
  role: TeamRole;
  
  /** Invitation timestamp */
  invitedAt: string;
  
  /** Acceptance timestamp */
  acceptedAt?: string;
  
  /** Invited by user ID */
  invitedBy?: string;
}

/**
 * Team member with user info (for display)
 */
export interface TeamMemberWithUser extends TeamMember {
  /** User email */
  email: string;
  
  /** User name */
  name?: string;
}

/**
 * Project share permission level
 */
export type ProjectPermission = 'VIEW' | 'EDIT' | 'ADMIN';

/**
 * Project share entity
 */
export interface ProjectShare extends BaseEntity {
  /** Project ID */
  projectId: string;
  
  /** Team ID */
  teamId: string;
  
  /** Permission level */
  permission: ProjectPermission;
}

// ============================================================================
// ANALYTICS ENTITIES
// ============================================================================

/**
 * Event type for analytics
 */
export type AnalyticsEventType =
  | 'session_start'
  | 'session_end'
  | 'gate_pass'
  | 'gate_block'
  | 'violation_detected'
  | 'checkpoint_created'
  | 'handoff_created'
  | 'artifact_bound'
  | 'state_sync'
  | 'error';

/**
 * Analytics event entity
 */
export interface AnalyticsEvent extends BaseEntity {
  /** User ID */
  userId: string;
  
  /** Project ID (if applicable) */
  projectId?: string;
  
  /** Session ID (if applicable) */
  sessionId?: string;
  
  /** Event type */
  eventType: AnalyticsEventType;
  
  /** Event data */
  data?: Record<string, unknown>;
  
  /** Provider */
  provider?: string;
  
  /** Client version */
  clientVersion?: string;
}

/**
 * Aggregated usage stats
 */
export interface UsageStats {
  /** User ID */
  userId: string;
  
  /** Time period */
  period: 'day' | 'week' | 'month';
  
  /** Period start date */
  periodStart: string;
  
  /** Total sessions */
  totalSessions: number;
  
  /** Total messages */
  totalMessages: number;
  
  /** Gates passed */
  gatesPassed: number;
  
  /** Gates blocked */
  gatesBlocked: number;
  
  /** Violations detected */
  violationsDetected: number;
  
  /** Handoffs created */
  handoffsCreated: number;
  
  /** Provider breakdown */
  byProvider?: Record<string, {
    sessions: number;
    messages: number;
  }>;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  /** Items in current page */
  items: T[];
  
  /** Total count */
  total: number;
  
  /** Current page (1-indexed) */
  page: number;
  
  /** Items per page */
  perPage: number;
  
  /** Total pages */
  totalPages: number;
  
  /** Has next page */
  hasNext: boolean;
  
  /** Has previous page */
  hasPrevious: boolean;
}

/**
 * Cursor-based paginated response
 */
export interface CursorPaginatedResponse<T> {
  /** Items */
  items: T[];
  
  /** Next cursor (null if no more) */
  nextCursor: string | null;
  
  /** Previous cursor (null if at start) */
  previousCursor: string | null;
  
  /** Has more items */
  hasMore: boolean;
}

/**
 * API error response
 */
export interface ApiError {
  /** Error code */
  code: string;
  
  /** Human-readable message */
  message: string;
  
  /** Additional details */
  details?: Record<string, unknown>;
  
  /** Stack trace (dev only) */
  stack?: string;
}
