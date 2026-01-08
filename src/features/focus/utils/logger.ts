/**
 * Logger Utility
 *
 * Provides structured logging for the Focus feature with different log levels.
 * Only logs in development mode to avoid performance impact in production.
 *
 * Features:
 * - Log levels: error, warn, info, debug
 * - Structured context (component, action, data)
 * - Development-only logging (except errors)
 * - Prepared for future error tracking service integration
 *
 * @module logger
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Log level
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Log context
 */
export interface LogContext {
  component?: string;
  action?: string;
  data?: any;
  error?: Error | unknown;
}

// ============================================================================
// Logger Implementation
// ============================================================================

/**
 * Format log message with context
 *
 * @param level - Log level
 * @param message - Log message
 * @param context - Optional context
 * @returns Formatted log message
 */
const formatMessage = (
  level: LogLevel,
  message: string,
  context?: LogContext,
): string => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (!context) {
    return `${prefix} ${message}`;
  }

  const parts: string[] = [prefix];

  if (context.component) {
    parts.push(`[${context.component}]`);
  }

  if (context.action) {
    parts.push(`[${context.action}]`);
  }

  parts.push(message);

  return parts.join(' ');
};

/**
 * Log error message
 *
 * Always logs, even in production, as errors are critical.
 *
 * @param message - Error message
 * @param context - Optional context
 *
 * @example
 * ```typescript
 * logger.error('Failed to save session', {
 *   component: 'focusStore',
 *   action: 'stopFocus',
 *   error: error,
 * });
 * ```
 */
export const error = (message: string, context?: LogContext): void => {
  const formattedMessage = formatMessage('error', message, context);
  console.error(formattedMessage);

  if (context?.error) {
    console.error('Error details:', context.error);
  }

  if (context?.data) {
    console.error('Additional data:', context.data);
  }

  // TODO: Send to error tracking service (e.g., Sentry)
  // if (errorTrackingService) {
  //   errorTrackingService.captureException(context?.error || new Error(message), {
  //     tags: {
  //       component: context?.component,
  //       action: context?.action,
  //     },
  //     extra: context?.data,
  //   });
  // }
};

/**
 * Log warning message
 *
 * Only logs in development mode.
 *
 * @param message - Warning message
 * @param context - Optional context
 *
 * @example
 * ```typescript
 * logger.warn('Pause limit reached', {
 *   component: 'TimerControls',
 *   action: 'handlePause',
 *   data: {pausesUsed: 3, maxPauses: 3},
 * });
 * ```
 */
export const warn = (message: string, context?: LogContext): void => {
  if (!__DEV__) {
    return;
  }

  const formattedMessage = formatMessage('warn', message, context);
  console.warn(formattedMessage);

  if (context?.data) {
    console.warn('Additional data:', context.data);
  }
};

/**
 * Log info message
 *
 * Only logs in development mode.
 *
 * @param message - Info message
 * @param context - Optional context
 *
 * @example
 * ```typescript
 * logger.info('Session started', {
 *   component: 'focusStore',
 *   action: 'startFocus',
 *   data: {duration: 1500, phase: 'work'},
 * });
 * ```
 */
export const info = (message: string, context?: LogContext): void => {
  if (!__DEV__) {
    return;
  }

  const formattedMessage = formatMessage('info', message, context);
  console.log(formattedMessage);

  if (context?.data) {
    console.log('Additional data:', context.data);
  }
};

/**
 * Log debug message
 *
 * Only logs in development mode.
 *
 * @param message - Debug message
 * @param context - Optional context
 *
 * @example
 * ```typescript
 * logger.debug('Timer tick', {
 *   component: 'timerService',
 *   action: 'tick',
 *   data: {timeRemaining: 1234},
 * });
 * ```
 */
export const debug = (message: string, context?: LogContext): void => {
  if (!__DEV__) {
    return;
  }

  const formattedMessage = formatMessage('debug', message, context);
  console.log(formattedMessage);

  if (context?.data) {
    console.log('Additional data:', context.data);
  }
};

/**
 * Default export with all log methods
 */
export default {
  error,
  warn,
  info,
  debug,
};
