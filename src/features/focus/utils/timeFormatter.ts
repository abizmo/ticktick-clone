/**
 * Focus Feature - Time Formatter
 *
 * This utility provides functions to format time values for display
 * in the Focus feature UI.
 *
 * @module timeFormatter
 */

// ============================================================================
// Time Formatting
// ============================================================================

/**
 * Format seconds to MM:SS format
 *
 * Examples:
 * - 0 → "00:00"
 * - 59 → "00:59"
 * - 60 → "01:00"
 * - 3661 → "61:01" (allows minutes > 59)
 *
 * @param seconds - Time in seconds
 * @returns Formatted time string (MM:SS)
 */
export const formatTime = (seconds: number): string => {
  // Ensure non-negative
  const totalSeconds = Math.max(0, Math.floor(seconds));

  // Calculate minutes and seconds
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  // Pad with zeros
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(remainingSeconds).padStart(2, '0');

  return `${minutesStr}:${secondsStr}`;
};

/**
 * Format seconds to human-readable duration
 *
 * Examples:
 * - 0 → "0m"
 * - 30 → "0m" (rounds down)
 * - 60 → "1m"
 * - 90 → "1m" (rounds down)
 * - 3600 → "1h"
 * - 3660 → "1h 1m"
 * - 5400 → "1h 30m"
 *
 * @param seconds - Time in seconds
 * @returns Formatted duration string (e.g., "1h 30m", "45m")
 */
export const formatDuration = (seconds: number): string => {
  // Ensure non-negative
  const totalSeconds = Math.max(0, Math.floor(seconds));

  // Calculate hours and minutes
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  // Build formatted string
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Format seconds to long human-readable duration
 *
 * Examples:
 * - 0 → "0 minutes"
 * - 60 → "1 minute"
 * - 120 → "2 minutes"
 * - 3600 → "1 hour"
 * - 3660 → "1 hour 1 minute"
 * - 7200 → "2 hours"
 *
 * @param seconds - Time in seconds
 * @returns Formatted duration string with full words
 */
export const formatDurationLong = (seconds: number): string => {
  // Ensure non-negative
  const totalSeconds = Math.max(0, Math.floor(seconds));

  // Calculate hours and minutes
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  // Build parts array
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }

  // If no hours or minutes, show "0 minutes"
  if (parts.length === 0) {
    return '0 minutes';
  }

  return parts.join(' ');
};

// ============================================================================
// Time Conversion
// ============================================================================

/**
 * Convert seconds to minutes (rounded down)
 *
 * @param seconds - Time in seconds
 * @returns Time in minutes (integer)
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60);
};

/**
 * Convert minutes to seconds
 *
 * @param minutes - Time in minutes
 * @returns Time in seconds
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * Convert seconds to hours (rounded down)
 *
 * @param seconds - Time in seconds
 * @returns Time in hours (integer)
 */
export const secondsToHours = (seconds: number): number => {
  return Math.floor(seconds / 3600);
};

/**
 * Convert hours to seconds
 *
 * @param hours - Time in hours
 * @returns Time in seconds
 */
export const hoursToSeconds = (hours: number): number => {
  return hours * 3600;
};

// ============================================================================
// Time Parsing
// ============================================================================

/**
 * Parse time string to seconds
 *
 * Accepts flexible input formats for user convenience:
 * - "MM:SS" format with 1-2 digit minutes (e.g., "5:30" or "05:30")
 * - "M:SS" format with single digit minutes (e.g., "5:30")
 * - Seconds must always be 2 digits (e.g., "5:05" not "5:5")
 *
 * Note: This parser is intentionally more lenient than formatTime(),
 * which always outputs zero-padded minutes (e.g., "05:30").
 * This follows the principle: "Be liberal in what you accept,
 * conservative in what you send."
 *
 * Examples:
 * - "00:00" → 0
 * - "5:30" → 330 (accepts single digit minutes)
 * - "05:30" → 330 (accepts zero-padded minutes)
 * - "01:30" → 90
 * - "25:00" → 1500
 * - "5:5" → null (seconds must be 2 digits)
 * - "5:60" → null (seconds must be < 60)
 *
 * @param timeString - Time string in M:SS or MM:SS format
 * @returns Time in seconds, or null if invalid format
 */
export const parseTimeString = (timeString: string): number | null => {
  // Validate format: 1-2 digit minutes, colon, 2 digit seconds
  // Examples: "5:30", "05:30", "25:00"
  const timeRegex = /^(\d{1,2}):(\d{2})$/;
  const match = timeString.match(timeRegex);

  if (!match) {
    return null;
  }

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);

  // Validate seconds range (must be 0-59)
  if (seconds >= 60) {
    return null;
  }

  return minutes * 60 + seconds;
};

// ============================================================================
// Time Validation
// ============================================================================

/**
 * Check if a time value is valid (non-negative)
 *
 * @param seconds - Time in seconds
 * @returns True if valid
 */
export const isValidTime = (seconds: number): boolean => {
  return seconds >= 0 && Number.isFinite(seconds);
};

/**
 * Clamp time value to a valid range
 *
 * @param seconds - Time in seconds
 * @param min - Minimum allowed value (default: 0)
 * @param max - Maximum allowed value (default: 24 hours)
 * @returns Clamped time value
 */
export const clampTime = (
  seconds: number,
  min: number = 0,
  max: number = 86400, // 24 hours
): number => {
  return Math.max(min, Math.min(max, seconds));
};

// ============================================================================
// Relative Time
// ============================================================================

/**
 * Get time remaining as percentage
 *
 * Returns a precise decimal percentage for calculations.
 * For UI display (progress bars), consider using Math.floor()
 * on the result to avoid unpredictable rounding jumps.
 *
 * @param timeRemaining - Time remaining in seconds
 * @param totalDuration - Total duration in seconds
 * @returns Percentage (0-100, may include decimals)
 *
 * @example
 * // For calculations (precise)
 * const percent = getTimeRemainingPercentage(75, 100); // 75.0
 *
 * @example
 * // For UI progress bar (smooth)
 * const displayPercent = Math.floor(getTimeRemainingPercentage(75.7, 100)); // 75
 */
export const getTimeRemainingPercentage = (
  timeRemaining: number,
  totalDuration: number,
): number => {
  if (totalDuration === 0) {
    return 0;
  }

  const percentage = (timeRemaining / totalDuration) * 100;
  return Math.max(0, Math.min(100, percentage));
};

/**
 * Get elapsed time as percentage
 *
 * Returns a precise decimal percentage for calculations.
 * For UI display (progress bars), consider using Math.floor()
 * on the result to avoid unpredictable rounding jumps.
 *
 * @param timeRemaining - Time remaining in seconds
 * @param totalDuration - Total duration in seconds
 * @returns Percentage (0-100, may include decimals)
 *
 * @example
 * // For calculations (precise)
 * const percent = getElapsedPercentage(25, 100); // 75.0
 *
 * @example
 * // For UI progress bar (smooth)
 * const displayPercent = Math.floor(getElapsedPercentage(25, 100)); // 75
 */
export const getElapsedPercentage = (
  timeRemaining: number,
  totalDuration: number,
): number => {
  return 100 - getTimeRemainingPercentage(timeRemaining, totalDuration);
};

/**
 * Format time remaining with context
 *
 * Examples:
 * - 30 seconds → "30s left"
 * - 90 seconds → "1m left"
 * - 3600 seconds → "1h left"
 *
 * @param seconds - Time remaining in seconds
 * @returns Formatted string with context
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) {
    return "Time's up!";
  }

  if (seconds < 60) {
    return `${seconds}s left`;
  }

  const duration = formatDuration(seconds);
  return `${duration} left`;
};
