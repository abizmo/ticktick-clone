/**
 * Focus Feature - Default Values and Constants
 *
 * This file contains all default values, constants, and configuration
 * for the Focus feature (Pomodoro Timer).
 *
 * @module defaults
 */

import {FocusSettings, TimerState, TodayStats} from '../types/focus.types';

// ============================================================================
// Timer Intervals (in minutes)
// ============================================================================

/**
 * Default Pomodoro timer intervals
 */
export const TIMER_INTERVALS = {
  /** Default work interval duration (25 minutes) */
  WORK: 25,

  /** Default short break duration (5 minutes) */
  SHORT_BREAK: 5,

  /** Default long break duration (15 minutes) */
  LONG_BREAK: 15,
} as const;

// ============================================================================
// Pomodoro Configuration
// ============================================================================

/**
 * Default number of pomodoros before taking a long break
 */
export const DEFAULT_POMOS_BEFORE_LONG_BREAK = 4;

/**
 * Default maximum number of pauses allowed per session
 */
export const MAX_PAUSES_DEFAULT = 3;

/**
 * Minimum allowed work duration (in minutes)
 */
export const MIN_WORK_DURATION = 5;

/**
 * Maximum allowed work duration (in minutes)
 */
export const MAX_WORK_DURATION = 60;

/**
 * Minimum allowed short break duration (in minutes)
 */
export const MIN_SHORT_BREAK = 1;

/**
 * Maximum allowed short break duration (in minutes)
 */
export const MAX_SHORT_BREAK = 30;

/**
 * Minimum allowed long break duration (in minutes)
 */
export const MIN_LONG_BREAK = 5;

/**
 * Maximum allowed long break duration (in minutes)
 */
export const MAX_LONG_BREAK = 60;

/**
 * Minimum number of pomodoros before long break
 */
export const MIN_POMOS_BEFORE_LONG_BREAK = 2;

/**
 * Maximum number of pomodoros before long break
 */
export const MAX_POMOS_BEFORE_LONG_BREAK = 8;

/**
 * Minimum number of pauses allowed
 */
export const MIN_PAUSES = 0;

/**
 * Maximum number of pauses allowed
 */
export const MAX_PAUSES = 5;

// ============================================================================
// Default Settings
// ============================================================================

/**
 * Default Focus settings
 * These are the initial values when a user first uses the Focus feature
 */
export const DEFAULT_FOCUS_SETTINGS: FocusSettings = {
  pomoWorkDuration: TIMER_INTERVALS.WORK,
  pomoShortBreak: TIMER_INTERVALS.SHORT_BREAK,
  pomoLongBreak: TIMER_INTERVALS.LONG_BREAK,
  pomosBeforeLongBreak: DEFAULT_POMOS_BEFORE_LONG_BREAK,
  maxPausesPerSession: MAX_PAUSES_DEFAULT,
  confirmStop: true,
};

// ============================================================================
// Default Timer State
// ============================================================================

/**
 * Initial timer state when no session is active
 */
export const INITIAL_TIMER_STATE: TimerState = {
  mode: 'pomodoro',
  status: 'idle',
  currentPhase: 'work',
  timeRemaining: TIMER_INTERVALS.WORK * 60, // Convert to seconds
  pomodorosCompleted: 0,
  pausesUsed: 0,
};

// ============================================================================
// Default Statistics
// ============================================================================

/**
 * Initial today's statistics (empty state)
 */
export const INITIAL_TODAY_STATS: TodayStats = {
  totalMinutes: 0,
  pomodorosCompleted: 0,
  sessionsCompleted: 0,
  sessionsInterrupted: 0,
};

// ============================================================================
// Time Conversion Constants
// ============================================================================

/**
 * Seconds in one minute
 */
export const SECONDS_PER_MINUTE = 60;

/**
 * Minutes in one hour
 */
export const MINUTES_PER_HOUR = 60;

/**
 * Seconds in one hour
 */
export const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

/**
 * Milliseconds in one second
 */
export const MILLISECONDS_PER_SECOND = 1000;

// ============================================================================
// Timer Configuration
// ============================================================================

/**
 * Timer tick interval in milliseconds (1 second)
 */
export const TIMER_TICK_INTERVAL = 1000;

/**
 * Minimum session duration to be recorded (in seconds)
 * Sessions shorter than this will not be saved
 */
export const MIN_SESSION_DURATION = 60; // 1 minute

// ============================================================================
// Storage Configuration
// ============================================================================

/**
 * Maximum number of sessions to keep in memory
 */
export const MAX_SESSIONS_IN_MEMORY = 100;

/**
 * Number of days to keep session history
 */
export const SESSION_HISTORY_DAYS = 90; // 3 months

// ============================================================================
// Notification Configuration
// ============================================================================

/**
 * Default notification titles
 */
export const NOTIFICATION_TITLES = {
  WORK_COMPLETE: '¡Pomodoro completado!',
  BREAK_COMPLETE: 'Descanso terminado',
  LONG_BREAK_COMPLETE: 'Descanso largo terminado',
} as const;

/**
 * Default notification messages
 */
export const NOTIFICATION_MESSAGES = {
  SHORT_BREAK: (duration: number) => `Tiempo de descanso (${duration} min)`,
  LONG_BREAK: (duration: number) =>
    `Tiempo de descanso largo (${duration} min)`,
  NEXT_POMODORO: 'Listo para el siguiente pomodoro',
} as const;

// ============================================================================
// UI Configuration
// ============================================================================

/**
 * Colors for different timer phases
 */
export const PHASE_COLORS = {
  work: '#007AFF', // Blue for work
  shortBreak: '#34C759', // Green for short break
  longBreak: '#AF52DE', // Purple for long break
} as const;

/**
 * Icons for different timer phases
 */
export const PHASE_ICONS = {
  work: 'flash',
  shortBreak: 'cafe',
  longBreak: 'bed',
} as const;

// ============================================================================
// Validation Ranges
// ============================================================================

/**
 * Validation ranges for settings
 */
export const VALIDATION_RANGES = {
  workDuration: {min: MIN_WORK_DURATION, max: MAX_WORK_DURATION},
  shortBreak: {min: MIN_SHORT_BREAK, max: MAX_SHORT_BREAK},
  longBreak: {min: MIN_LONG_BREAK, max: MAX_LONG_BREAK},
  pomosBeforeLongBreak: {
    min: MIN_POMOS_BEFORE_LONG_BREAK,
    max: MAX_POMOS_BEFORE_LONG_BREAK,
  },
  maxPauses: {min: MIN_PAUSES, max: MAX_PAUSES},
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a number is within a valid range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate work duration
 */
export const isValidWorkDuration = (duration: number): boolean => {
  return isInRange(duration, MIN_WORK_DURATION, MAX_WORK_DURATION);
};

/**
 * Validate short break duration
 */
export const isValidShortBreak = (duration: number): boolean => {
  return isInRange(duration, MIN_SHORT_BREAK, MAX_SHORT_BREAK);
};

/**
 * Validate long break duration
 */
export const isValidLongBreak = (duration: number): boolean => {
  return isInRange(duration, MIN_LONG_BREAK, MAX_LONG_BREAK);
};

/**
 * Validate pomodoros before long break
 */
export const isValidPomosBeforeLongBreak = (count: number): boolean => {
  return isInRange(
    count,
    MIN_POMOS_BEFORE_LONG_BREAK,
    MAX_POMOS_BEFORE_LONG_BREAK,
  );
};

/**
 * Validate max pauses
 */
export const isValidMaxPauses = (count: number): boolean => {
  return isInRange(count, MIN_PAUSES, MAX_PAUSES);
};
