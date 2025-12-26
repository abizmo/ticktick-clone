/**
 * Focus Feature - TypeScript Type Definitions
 *
 * This file contains all TypeScript interfaces and types for the Focus feature
 * implementing the Pomodoro Timer functionality.
 *
 * @module focus.types
 */

// ============================================================================
// Session Types
// ============================================================================

/**
 * Represents a Focus session (Pomodoro or Stopwatch)
 *
 * @interface FocusSession
 */
export interface FocusSession {
  /** Unique identifier for the session */
  id: string;

  /** Optional user ID (for future multi-user support) */
  userId?: string;

  /** Optional task ID associated with this session */
  taskId?: string;

  /** Mode of the session: Pomodoro or Stopwatch */
  mode: FocusMode;

  /** Timestamp when the session started */
  startTime: Date;

  /** Timestamp when the session ended (undefined if still active) */
  endTime?: Date;

  /** Total duration of the session in seconds */
  durationSeconds: number;

  /** Number of times the session was paused */
  pausesCount: number;

  /** Current status of the session */
  status: SessionStatus;

  /** Timestamp when the record was created */
  createdAt: Date;

  /** Timestamp when the record was last updated */
  updatedAt: Date;
}

/**
 * Mode of Focus session
 */
export type FocusMode = 'pomodoro' | 'stopwatch';

/**
 * Status of a Focus session
 */
export type SessionStatus = 'active' | 'completed' | 'interrupted';

// ============================================================================
// Settings Types
// ============================================================================

/**
 * User settings for Focus feature
 *
 * @interface FocusSettings
 */
export interface FocusSettings {
  /** Duration of work interval in minutes (Pomodoro) */
  pomoWorkDuration: number;

  /** Duration of short break in minutes (Pomodoro) */
  pomoShortBreak: number;

  /** Duration of long break in minutes (Pomodoro) */
  pomoLongBreak: number;

  /** Number of pomodoros before taking a long break */
  pomosBeforeLongBreak: number;

  /** Maximum number of pauses allowed per session */
  maxPausesPerSession: number;

  /** Whether to show confirmation dialog when stopping a session */
  confirmStop: boolean;
}

// ============================================================================
// Timer State Types
// ============================================================================

/**
 * Current state of the timer
 *
 * @interface TimerState
 */
export interface TimerState {
  /** Current mode: Pomodoro or Stopwatch */
  mode: FocusMode;

  /** Current status of the timer */
  status: TimerStatus;

  /** Current phase (only relevant for Pomodoro mode) */
  currentPhase: PomodoroPhase;

  /** Time remaining in seconds (countdown for Pomodoro, count up for Stopwatch) */
  timeRemaining: number;

  /** Number of pomodoros completed in current session */
  pomodorosCompleted: number;

  /** Number of pauses used in current session */
  pausesUsed: number;
}

/**
 * Status of the timer
 */
export type TimerStatus = 'idle' | 'running' | 'paused';

/**
 * Phase of Pomodoro cycle
 */
export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

// ============================================================================
// Statistics Types
// ============================================================================

/**
 * Statistics for today's Focus sessions
 *
 * @interface TodayStats
 */
export interface TodayStats {
  /** Total minutes of focus time today */
  totalMinutes: number;

  /** Number of pomodoros completed today */
  pomodorosCompleted: number;

  /** Number of sessions completed today */
  sessionsCompleted: number;

  /** Number of sessions interrupted today */
  sessionsInterrupted: number;
}

/**
 * Weekly statistics
 *
 * @interface WeeklyStats
 */
export interface WeeklyStats {
  /** Total minutes for each day of the week (0 = Sunday) */
  dailyMinutes: number[];

  /** Total pomodoros for the week */
  totalPomodoros: number;

  /** Average daily focus time in minutes */
  averageDailyMinutes: number;

  /** Best day of the week (0-6) */
  bestDay: number;
}

// ============================================================================
// Store Types
// ============================================================================

/**
 * Complete state shape for Focus store (Zustand)
 *
 * @interface FocusStoreState
 */
export interface FocusStoreState {
  // ========== State ==========
  /** Current timer state */
  timerState: TimerState;

  /** Current active session (null if no session) */
  currentSession: FocusSession | null;

  /** Currently selected task (null if no task selected) */
  selectedTask: Task | null;

  /** User settings for Focus */
  settings: FocusSettings;

  /** All sessions (loaded from storage) */
  sessions: FocusSession[];

  /** Statistics for today */
  todayStats: TodayStats;

  // ========== Actions ==========
  /** Start a new Focus session */
  startFocus: (taskId?: string) => void;

  /** Pause the current session */
  pauseFocus: () => void;

  /** Resume the paused session */
  resumeFocus: () => void;

  /** Stop the current session */
  stopFocus: () => void;

  /** Select a task for the Focus session */
  selectTask: (task: Task | null) => void;

  /** Update Focus settings */
  updateSettings: (settings: Partial<FocusSettings>) => void;

  /** Load sessions from storage */
  loadSessions: () => Promise<void>;

  /** Calculate today's statistics */
  calculateTodayStats: () => void;
}

/**
 * Task interface (imported from existing data model)
 * This is a reference to the existing Task type
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  listId: string;
  createdAt: Date;
}

// ============================================================================
// Service Types
// ============================================================================

/**
 * Timer event types
 */
export type TimerEvent = 'tick' | 'complete' | 'pause' | 'resume' | 'stop';

/**
 * Timer event callback
 */
export type TimerEventCallback = (data?: any) => void;

/**
 * Storage keys for AsyncStorage
 */
export enum StorageKeys {
  FOCUS_SETTINGS = '@focus_settings',
  FOCUS_SESSIONS = '@focus_sessions',
  CURRENT_SESSION = '@focus_current_session',
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Partial update for FocusSession
 */
export type FocusSessionUpdate = Partial<
  Omit<FocusSession, 'id' | 'createdAt'>
>;

/**
 * Filter options for loading sessions
 */
export interface SessionFilters {
  /** Filter by date range */
  startDate?: Date;
  endDate?: Date;

  /** Filter by task ID */
  taskId?: string;

  /** Filter by status */
  status?: SessionStatus;

  /** Filter by mode */
  mode?: FocusMode;

  /** Limit number of results */
  limit?: number;
}

/**
 * Result of session creation
 */
export interface CreateSessionResult {
  session: FocusSession;
  success: boolean;
  error?: string;
}

/**
 * Result of session update
 */
export interface UpdateSessionResult {
  session: FocusSession;
  success: boolean;
  error?: string;
}
