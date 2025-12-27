/**
 * Focus Feature - Pomodoro Calculator
 *
 * This utility provides functions to calculate Pomodoro phases, durations,
 * and validate pause limits.
 *
 * @module pomodoroCalculator
 */

import {FocusSettings, PomodoroPhase} from '../types/focus.types';

// ============================================================================
// Phase Calculation
// ============================================================================

/**
 * Get the next phase in the Pomodoro cycle
 *
 * Logic:
 * - After work: Check if it's time for long break, otherwise short break
 * - After short break: Back to work
 * - After long break: Back to work (and reset pomodoro count)
 *
 * @param currentPhase - Current phase
 * @param pomodorosCompleted - Number of pomodoros completed
 * @param settings - Focus settings
 * @returns Next phase in the cycle
 */
export const getNextPhase = (
  currentPhase: PomodoroPhase,
  pomodorosCompleted: number,
  settings: FocusSettings,
): PomodoroPhase => {
  switch (currentPhase) {
    case 'work':
      // After completing work, check if we should take long break
      return shouldTakeLongBreak(pomodorosCompleted, settings)
        ? 'longBreak'
        : 'shortBreak';

    case 'shortBreak':
      // After short break, always go back to work
      return 'work';

    case 'longBreak':
      // After long break, always go back to work
      return 'work';

    default:
      // Fallback to work phase
      return 'work';
  }
};

/**
 * Get the duration for a specific phase
 *
 * @param phase - Pomodoro phase
 * @param settings - Focus settings
 * @returns Duration in seconds
 */
export const getPhaseDuration = (
  phase: PomodoroPhase,
  settings: FocusSettings,
): number => {
  switch (phase) {
    case 'work':
      return settings.pomoWorkDuration * 60; // Convert minutes to seconds

    case 'shortBreak':
      return settings.pomoShortBreak * 60; // Convert minutes to seconds

    case 'longBreak':
      return settings.pomoLongBreak * 60; // Convert minutes to seconds

    default:
      // Fallback to work duration
      return settings.pomoWorkDuration * 60;
  }
};

// ============================================================================
// Break Logic
// ============================================================================

/**
 * Determine if it's time for a long break
 *
 * Long break occurs after completing N pomodoros (work sessions)
 * where N is defined in settings.pomosBeforeLongBreak
 *
 * @param pomodorosCompleted - Number of pomodoros completed
 * @param settings - Focus settings
 * @returns True if should take long break
 */
export const shouldTakeLongBreak = (
  pomodorosCompleted: number,
  settings: FocusSettings,
): boolean => {
  // If no pomodoros completed yet, no long break
  if (pomodorosCompleted === 0) {
    return false;
  }

  // Check if we've completed the required number of pomodoros
  return pomodorosCompleted % settings.pomosBeforeLongBreak === 0;
};

// ============================================================================
// Pause Validation
// ============================================================================

/**
 * Check if user can pause the current session
 *
 * @param pausesUsed - Number of pauses already used
 * @param maxPauses - Maximum pauses allowed
 * @returns True if can pause
 */
export const canPause = (pausesUsed: number, maxPauses: number): boolean => {
  return pausesUsed < maxPauses;
};

/**
 * Get remaining pauses available
 *
 * @param pausesUsed - Number of pauses already used
 * @param maxPauses - Maximum pauses allowed
 * @returns Number of pauses remaining
 */
export const getRemainingPauses = (
  pausesUsed: number,
  maxPauses: number,
): number => {
  return Math.max(0, maxPauses - pausesUsed);
};

// ============================================================================
// Cycle Tracking
// ============================================================================

/**
 * Check if current phase is a work phase
 *
 * @param phase - Pomodoro phase
 * @returns True if work phase
 */
export const isWorkPhase = (phase: PomodoroPhase): boolean => {
  return phase === 'work';
};

/**
 * Check if current phase is a break phase
 *
 * @param phase - Pomodoro phase
 * @returns True if break phase (short or long)
 */
export const isBreakPhase = (phase: PomodoroPhase): boolean => {
  return phase === 'shortBreak' || phase === 'longBreak';
};

/**
 * Check if current phase is a short break
 *
 * @param phase - Pomodoro phase
 * @returns True if short break
 */
export const isShortBreak = (phase: PomodoroPhase): boolean => {
  return phase === 'shortBreak';
};

/**
 * Check if current phase is a long break
 *
 * @param phase - Pomodoro phase
 * @returns True if long break
 */
export const isLongBreak = (phase: PomodoroPhase): boolean => {
  return phase === 'longBreak';
};

/**
 * Get the number of pomodoros until next long break
 *
 * @param pomodorosCompleted - Number of pomodoros completed
 * @param settings - Focus settings
 * @returns Number of pomodoros until long break
 */
export const getPomodorosUntilLongBreak = (
  pomodorosCompleted: number,
  settings: FocusSettings,
): number => {
  const remainder = pomodorosCompleted % settings.pomosBeforeLongBreak;
  return settings.pomosBeforeLongBreak - remainder;
};

/**
 * Calculate total cycle duration (all work + breaks until long break)
 *
 * @param settings - Focus settings
 * @returns Total cycle duration in seconds
 */
export const getTotalCycleDuration = (settings: FocusSettings): number => {
  const workDuration = settings.pomoWorkDuration * 60;
  const shortBreakDuration = settings.pomoShortBreak * 60;
  const longBreakDuration = settings.pomoLongBreak * 60;

  // Number of work sessions
  const workSessions = settings.pomosBeforeLongBreak;

  // Number of short breaks (one less than work sessions)
  const shortBreaks = workSessions - 1;

  // Total duration
  const total =
    workDuration * workSessions +
    shortBreakDuration * shortBreaks +
    longBreakDuration;

  return total;
};

/**
 * Get human-readable phase name
 *
 * @param phase - Pomodoro phase
 * @returns Human-readable phase name
 */
export const getPhaseName = (phase: PomodoroPhase): string => {
  switch (phase) {
    case 'work':
      return 'Focus Time';
    case 'shortBreak':
      return 'Short Break';
    case 'longBreak':
      return 'Long Break';
    default:
      return 'Unknown';
  }
};
