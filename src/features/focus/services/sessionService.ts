/**
 * Focus Feature - Session Service
 *
 * This service handles business logic for Focus sessions.
 * It provides methods to create, update, complete, and manage sessions.
 *
 * @module sessionService
 */

import {
  FocusSession,
  FocusMode,
  FocusSessionUpdate,
} from '../types/focus.types';

// ============================================================================
// Session Creation
// ============================================================================

/**
 * Create a new Focus session
 *
 * @param taskId - Optional task ID to associate with session
 * @param mode - Focus mode ('pomodoro' or 'stopwatch')
 * @returns New FocusSession object
 */
export const createSession = (
  taskId?: string,
  mode: FocusMode = 'pomodoro',
): FocusSession => {
  const now = new Date();

  const session: FocusSession = {
    id: generateSessionId(),
    userId: undefined, // Will be set when multi-user support is added
    taskId: taskId,
    mode: mode,
    startTime: now,
    endTime: undefined,
    durationSeconds: 0,
    pausesCount: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  return session;
};

/**
 * Generate a unique session ID
 * Uses timestamp + random string for uniqueness
 *
 * @returns Unique session ID
 */
const generateSessionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `session_${timestamp}_${random}`;
};

// ============================================================================
// Session Updates
// ============================================================================

/**
 * Update a Focus session with new data
 *
 * @param session - Session to update
 * @param updates - Partial updates to apply
 * @returns Updated FocusSession object
 */
export const updateSession = (
  session: FocusSession,
  updates: FocusSessionUpdate,
): FocusSession => {
  const updatedSession: FocusSession = {
    ...session,
    ...updates,
    updatedAt: new Date(),
  };

  return updatedSession;
};

/**
 * Complete a Focus session
 * Sets end time, calculates duration, and marks as completed
 *
 * @param session - Session to complete
 * @returns Completed FocusSession object
 */
export const completeSession = (session: FocusSession): FocusSession => {
  const now = new Date();
  const duration = calculateDuration(session, now);

  const completedSession: FocusSession = {
    ...session,
    endTime: now,
    durationSeconds: duration,
    status: 'completed',
    updatedAt: now,
  };

  return completedSession;
};

/**
 * Interrupt a Focus session
 * Sets end time, calculates duration, and marks as interrupted
 *
 * @param session - Session to interrupt
 * @returns Interrupted FocusSession object
 */
export const interruptSession = (session: FocusSession): FocusSession => {
  const now = new Date();
  const duration = calculateDuration(session, now);

  const interruptedSession: FocusSession = {
    ...session,
    endTime: now,
    durationSeconds: duration,
    status: 'interrupted',
    updatedAt: now,
  };

  return interruptedSession;
};

/**
 * Increment pause count for a session
 *
 * @param session - Session to update
 * @returns Updated session with incremented pause count
 */
export const incrementPauseCount = (session: FocusSession): FocusSession => {
  return updateSession(session, {
    pausesCount: session.pausesCount + 1,
  });
};

// ============================================================================
// Duration Calculations
// ============================================================================

/**
 * Calculate duration of a session in seconds
 *
 * @param session - Session to calculate duration for
 * @param endTime - Optional end time (defaults to now)
 * @returns Duration in seconds
 */
export const calculateDuration = (
  session: FocusSession,
  endTime?: Date,
): number => {
  const end = endTime || new Date();
  const start = new Date(session.startTime);

  // Calculate difference in milliseconds
  const diffMs = end.getTime() - start.getTime();

  // Convert to seconds
  const diffSeconds = Math.floor(diffMs / 1000);

  // Ensure non-negative
  return Math.max(0, diffSeconds);
};

/**
 * Get elapsed time for an active session
 *
 * @param session - Active session
 * @returns Elapsed time in seconds
 */
export const getElapsedTime = (session: FocusSession): number => {
  if (session.status !== 'active') {
    return session.durationSeconds;
  }

  return calculateDuration(session);
};

/**
 * Format duration in seconds to human-readable string
 *
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "1h 23m", "45m", "30s")
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

// ============================================================================
// Session Validation
// ============================================================================

/**
 * Check if a session is active
 *
 * @param session - Session to check
 * @returns True if session is active
 */
export const isSessionActive = (session: FocusSession): boolean => {
  return session.status === 'active';
};

/**
 * Check if a session is completed
 *
 * @param session - Session to check
 * @returns True if session is completed
 */
export const isSessionCompleted = (session: FocusSession): boolean => {
  return session.status === 'completed';
};

/**
 * Check if a session is interrupted
 *
 * @param session - Session to check
 * @returns True if session is interrupted
 */
export const isSessionInterrupted = (session: FocusSession): boolean => {
  return session.status === 'interrupted';
};

/**
 * Check if a session meets minimum duration requirement
 *
 * @param session - Session to check
 * @param minDurationSeconds - Minimum duration in seconds (default: 60)
 * @returns True if session meets minimum duration
 */
export const meetsMinimumDuration = (
  session: FocusSession,
  minDurationSeconds: number = 60,
): boolean => {
  const duration = session.endTime
    ? session.durationSeconds
    : calculateDuration(session);

  return duration >= minDurationSeconds;
};

// ============================================================================
// Session Statistics
// ============================================================================

/**
 * Calculate total duration from multiple sessions
 *
 * @param sessions - Array of sessions
 * @returns Total duration in seconds
 */
export const calculateTotalDuration = (sessions: FocusSession[]): number => {
  return sessions.reduce((total, session) => {
    return total + session.durationSeconds;
  }, 0);
};

/**
 * Count completed sessions
 *
 * @param sessions - Array of sessions
 * @returns Number of completed sessions
 */
export const countCompletedSessions = (sessions: FocusSession[]): number => {
  return sessions.filter(session => session.status === 'completed').length;
};

/**
 * Count interrupted sessions
 *
 * @param sessions - Array of sessions
 * @returns Number of interrupted sessions
 */
export const countInterruptedSessions = (sessions: FocusSession[]): number => {
  return sessions.filter(session => session.status === 'interrupted').length;
};

/**
 * Count Pomodoro sessions
 *
 * @param sessions - Array of sessions
 * @returns Number of Pomodoro sessions
 */
export const countPomodoroSessions = (sessions: FocusSession[]): number => {
  return sessions.filter(session => session.mode === 'pomodoro').length;
};

/**
 * Count Stopwatch sessions
 *
 * @param sessions - Array of sessions
 * @returns Number of Stopwatch sessions
 */
export const countStopwatchSessions = (sessions: FocusSession[]): number => {
  return sessions.filter(session => session.mode === 'stopwatch').length;
};

/**
 * Get sessions for a specific task
 *
 * @param sessions - Array of sessions
 * @param taskId - Task ID to filter by
 * @returns Filtered array of sessions
 */
export const getSessionsForTask = (
  sessions: FocusSession[],
  taskId: string,
): FocusSession[] => {
  return sessions.filter(session => session.taskId === taskId);
};

/**
 * Calculate completion rate
 *
 * @param sessions - Array of sessions
 * @returns Completion rate as percentage (0-100)
 */
export const calculateCompletionRate = (sessions: FocusSession[]): number => {
  if (sessions.length === 0) {
    return 0;
  }

  const completed = countCompletedSessions(sessions);
  return Math.round((completed / sessions.length) * 100);
};
