/**
 * Local extension configuration and defaults.
 * Later this will load user settings from storage and sync with webapp.
 */
export interface ExtensionConfig {
  strictMode: boolean;
}

export const DEFAULT_CONFIG: ExtensionConfig = {
  strictMode: true
};
