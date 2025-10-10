/**
 * Logger utility for the application
 * 
 * In production, errors are logged but warnings and logs are suppressed
 * to avoid exposing sensitive information in browser console.
 * 
 * Usage:
 * ```ts
 * import { logger } from '@/lib/logger';
 * 
 * logger.error('Failed to fetch data:', error);
 * logger.warn('Deprecated feature used');
 * logger.log('Debug info:', data);
 * ```
 */

type LogLevel = 'error' | 'warn' | 'log';

interface Logger {
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
}

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Creates a logger that respects the environment
 */
function createLogger(): Logger {
  return {
    // Always log errors (but sanitize in production)
    error: (...args: unknown[]) => {
      if (isDevelopment) {
        console.error(...args);
      } else {
        // In production, log a generic error message
        console.error('An error occurred. Check server logs for details.');
      }
    },

    // Only log warnings in development
    warn: (...args: unknown[]) => {
      if (isDevelopment) {
        console.warn(...args);
      }
    },

    // Only log debug info in development
    log: (...args: unknown[]) => {
      if (isDevelopment) {
        console.log(...args);
      }
    },
  };
}

export const logger = createLogger();

/**
 * Helper to log errors with context
 */
export function logError(context: string, error: unknown): void {
  logger.error(`[${context}]`, error);
}

/**
 * Helper to log warnings with context
 */
export function logWarning(context: string, message: string, data?: unknown): void {
  logger.warn(`[${context}]`, message, data);
}

/**
 * Helper to log info with context
 */
export function logInfo(context: string, message: string, data?: unknown): void {
  logger.log(`[${context}]`, message, data);
}
