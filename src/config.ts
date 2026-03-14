/**
 * Centralized Configuration File
 * 
 * Configuration is loaded in three stages:
 * 1. Initial defaults from environment variables (build-time)
 * 2. Runtime overrides from public/config.json (deployment-time)
 * 3. Window object overrides (if set by server/script)
 * 
 * To externalize at runtime:
 * - Deploy with different public/config.json files for each environment
 * - Or set window.appConfig before the app loads
 */

// Build-time configuration from environment variables
const BUILD_TIME_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const BUILD_TIME_DEBUG = import.meta.env.VITE_DEBUG === 'true';
const ENVIRONMENT = import.meta.env.MODE || 'development';

// Runtime configuration (will be populated by loadConfig)
let RUNTIME_CONFIG = {
  api: {
    baseURL: BUILD_TIME_API_URL,
  },
  environment: ENVIRONMENT,
  debugMode: BUILD_TIME_DEBUG,
};

/**
 * Load runtime configuration from public/config.json
 * This allows changing the backend URL after deployment without rebuilding
 */
export async function loadRuntimeConfig() {
  try {
    const configPath = '/config.json';
    const response = await fetch(configPath, {
      cache: 'no-store', // Don't cache config file
    });

    if (response.ok) {
      const runtimeConfig = await response.json();
      
      // Merge with defaults, allowing partial overrides
      RUNTIME_CONFIG = {
        api: {
          baseURL: runtimeConfig.api?.baseURL || RUNTIME_CONFIG.api.baseURL,
        },
        environment: runtimeConfig.environment || RUNTIME_CONFIG.environment,
        debugMode: runtimeConfig.debug !== undefined ? runtimeConfig.debug : RUNTIME_CONFIG.debugMode,
      };

      console.log(`[CONFIG] Loaded runtime configuration from ${configPath}`);
    } else {
      console.warn(`[CONFIG] Runtime config file not found at ${configPath}, using build-time config`);
    }
  } catch (error) {
    console.warn('[CONFIG] Failed to load runtime configuration:', error);
    console.log('[CONFIG] Using build-time configuration as fallback');
  }

  // Allow window.appConfig to override everything (useful for direct server injection)
  if (typeof window !== 'undefined' && (window as any).appConfig) {
    RUNTIME_CONFIG = {
      ...RUNTIME_CONFIG,
      ...(window as any).appConfig,
    };
    console.log('[CONFIG] Applied window.appConfig overrides');
  }

  logConfig();
  return RUNTIME_CONFIG;
}

/**
 * Get current configuration
 */
export function getConfig() {
  return RUNTIME_CONFIG;
}

/**
 * Update configuration at runtime (useful for debugging)
 */
export function updateConfig(updates: Partial<typeof RUNTIME_CONFIG>) {
  RUNTIME_CONFIG = {
    ...RUNTIME_CONFIG,
    ...updates,
  };
  logConfig();
}

/**
 * Log current configuration
 */
function logConfig() {
  const baseURL = RUNTIME_CONFIG.api.baseURL;
  const env = RUNTIME_CONFIG.environment;
  const debug = RUNTIME_CONFIG.debugMode;

  console.log('%c[CONFIG]', 'color: #4CAF50; font-weight: bold;', {
    'Environment': env,
    'API Base URL': baseURL,
    'Debug Mode': debug,
    'Config Mode': 'Runtime Externalizable',
  });
}

// Export current config for use in the app
export const config = RUNTIME_CONFIG;

export default config;
