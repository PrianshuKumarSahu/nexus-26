/**
 * @fileoverview Structured logger utility for consistent, parseable log output.
 * Provides info, warn, error, and debug levels with ISO-8601 timestamps.
 *
 * @module logger
 */

/** Log levels available in the logger. */
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

/**
 * Formats and outputs a log message to the appropriate console channel.
 *
 * @param level   - The severity level of the log entry.
 * @param message - The primary log message.
 * @param context - Optional additional context (will be JSON-serialised if an object).
 * @param args    - Additional variadic arguments forwarded to the console method.
 */
const log = (level: LogLevel, message: string, context?: unknown, ...args: unknown[]): void => {
  const timestamp = new Date().toISOString();
  const contextStr = context !== undefined
    ? ` | context=${typeof context === 'object' ? JSON.stringify(context) : String(context)}`
    : '';
  const formatted = `[${level}] ${timestamp} - ${message}${contextStr}`;

  switch (level) {
    case 'ERROR': console.error(formatted, ...args); break;
    case 'WARN':  console.warn(formatted, ...args);  break;
    case 'DEBUG': console.debug(formatted, ...args); break;
    default:      console.log(formatted, ...args);   break;
  }
};

/**
 * Application logger with four severity levels.
 * All methods accept an optional structured `context` parameter for
 * machine-readable log analysis.
 *
 * @example
 * logger.info('Server started', { port: 3001 });
 * logger.error('Request failed', { route: '/api/chat', status: 500 });
 */
export const logger = {
  /**
   * Logs an informational message.
   * @param message - Log message.
   * @param context - Optional structured context.
   * @param args    - Additional variadic arguments.
   */
  info: (message: string, context?: unknown, ...args: unknown[]): void => {
    log('INFO', message, context, ...args);
  },

  /**
   * Logs a warning message for non-critical issues.
   * @param message - Log message.
   * @param context - Optional structured context.
   * @param args    - Additional variadic arguments.
   */
  warn: (message: string, context?: unknown, ...args: unknown[]): void => {
    log('WARN', message, context, ...args);
  },

  /**
   * Logs an error message for critical failures.
   * @param message - Log message.
   * @param context - Optional structured context (Error objects recommended).
   * @param args    - Additional variadic arguments.
   */
  error: (message: string, context?: unknown, ...args: unknown[]): void => {
    log('ERROR', message, context, ...args);
  },

  /**
   * Logs a debug message. Useful for development diagnostics.
   * @param message - Log message.
   * @param context - Optional structured context.
   * @param args    - Additional variadic arguments.
   */
  debug: (message: string, context?: unknown, ...args: unknown[]): void => {
    log('DEBUG', message, context, ...args);
  },
};
