/**
 * Focus Feature - Zustand Store
 *
 * This is the global state management for the Focus feature using Zustand.
 * It integrates TimerService, SessionService, and StorageService to provide
 * a reactive state for UI components.
 *
 * Architecture:
 * - TimerService: Handles countdown/timer logic with drift correction
 * - SessionService: Manages session lifecycle and statistics
 * - StorageService: Persists data to AsyncStorage
 * - FocusStore: Orchestrates all services and provides reactive state
 *
 * @module focusStore
 */

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
import type {
  FocusStoreState,
  FocusSettings,
  FocusSession,
  TodayStats,
  Task,
} from '../types/focus.types';

// Services
import {TimerService, createTimerService} from '../services/timerService';
import * as sessionService from '../services/sessionService';
import * as storageService from '../services/storageService';

// Utils
import * as pomodoroCalculator from '../utils/pomodoroCalculator';

// Constants
import {
  DEFAULT_FOCUS_SETTINGS,
  INITIAL_TIMER_STATE,
  INITIAL_TODAY_STATS,
} from '../constants/defaults';

// ============================================================================
// Timer Service Instance
// ============================================================================

/**
 * Shared TimerService instance for the Focus store
 * Created once and reused across the store lifecycle
 */
let timerServiceInstance: TimerService | null = null;

/**
 * Get or create the TimerService instance
 */
const getTimerService = (): TimerService => {
  if (!timerServiceInstance) {
    timerServiceInstance = createTimerService();
  }
  return timerServiceInstance;
};

// ============================================================================
// Store Implementation
// ============================================================================

/**
 * Focus Store
 *
 * Manages global state for the Focus feature including:
 * - Timer state (current time, phase, status)
 * - Current session tracking
 * - User settings
 * - Session history
 * - Statistics
 */
export const useFocusStore = create<FocusStoreState>()(
  persist(
    (set, get) => ({
      // ======================================================================
      // Initial State
      // ======================================================================

      timerState: {...INITIAL_TIMER_STATE},
      currentSession: null,
      selectedTask: null,
      settings: {...DEFAULT_FOCUS_SETTINGS},
      sessions: [],
      todayStats: {...INITIAL_TODAY_STATS},

      // ======================================================================
      // Actions
      // ======================================================================

      /**
       * Start a new Focus session
       *
       * Creates a new session, initializes the timer, and sets up event listeners.
       *
       * @param taskId - Optional task ID to associate with the session
       */
      startFocus: (taskId?: string) => {
        const state = get();

        // Validate: No active session
        if (state.currentSession && state.timerState.status !== 'idle') {
          console.warn('[FocusStore] Cannot start: session already active');
          return;
        }

        try {
          // Get current settings
          const {settings, timerState} = state;

          // Create new session
          const newSession = sessionService.createSession(
            taskId,
            timerState.mode,
          );

          // Calculate duration for current phase
          const duration = pomodoroCalculator.getPhaseDuration(
            timerState.currentPhase,
            settings,
          );

          // Start timer service
          const timer = getTimerService();
          timer.start(duration);

          // Set up event listeners
          setupTimerListeners(timer, set, get);

          // Update state
          set({
            currentSession: newSession,
            timerState: {
              ...timerState,
              status: 'running',
              timeRemaining: duration,
            },
          });

          console.log(
            `[FocusStore] Started Focus session (${timerState.currentPhase}, ${duration}s)`,
          );
        } catch (error) {
          console.error('[FocusStore] Error starting Focus:', error);
        }
      },

      /**
       * Pause the current Focus session
       *
       * Pauses the timer and increments pause count.
       * Validates pause limit before pausing.
       */
      pauseFocus: () => {
        const state = get();

        // Validate: Session must be running
        if (!state.currentSession || state.timerState.status !== 'running') {
          console.warn('[FocusStore] Cannot pause: no active session');
          return;
        }

        try {
          const {timerState, settings, currentSession} = state;

          // Validate pause limit
          if (
            !pomodoroCalculator.canPause(
              timerState.pausesUsed,
              settings.maxPausesPerSession,
            )
          ) {
            console.warn('[FocusStore] Cannot pause: limit reached');
            return;
          }

          // Pause timer service
          const timer = getTimerService();
          timer.pause();

          // Update session
          const updatedSession =
            sessionService.incrementPauseCount(currentSession);

          // Update state
          set({
            currentSession: updatedSession,
            timerState: {
              ...timerState,
              status: 'paused',
              pausesUsed: timerState.pausesUsed + 1,
            },
          });

          console.log('[FocusStore] Paused Focus session');
        } catch (error) {
          console.error('[FocusStore] Error pausing Focus:', error);
        }
      },

      /**
       * Resume the paused Focus session
       *
       * Resumes the timer from paused state.
       */
      resumeFocus: () => {
        const state = get();

        // Validate: Session must be paused
        if (!state.currentSession || state.timerState.status !== 'paused') {
          console.warn('[FocusStore] Cannot resume: session not paused');
          return;
        }

        try {
          // Resume timer service
          const timer = getTimerService();
          timer.resume();

          // Update state
          set({
            timerState: {
              ...state.timerState,
              status: 'running',
            },
          });

          console.log('[FocusStore] Resumed Focus session');
        } catch (error) {
          console.error('[FocusStore] Error resuming Focus:', error);
        }
      },

      /**
       * Stop the current Focus session
       *
       * Stops the timer, completes or interrupts the session,
       * saves to storage, and resets state.
       */
      stopFocus: async () => {
        const state = get();

        // Validate: Must have active session
        if (!state.currentSession) {
          console.warn('[FocusStore] Cannot stop: no active session');
          return;
        }

        try {
          const {currentSession, timerState} = state;

          // Stop timer service
          const timer = getTimerService();
          timer.stop();

          // Determine if session was completed or interrupted
          const isCompleted = timerState.timeRemaining <= 0;

          // Update session
          const finalSession = isCompleted
            ? sessionService.completeSession(currentSession)
            : sessionService.interruptSession(currentSession);

          // Save session to storage
          await storageService.saveFocusSession(finalSession);

          // Add to sessions list
          const updatedSessions = [finalSession, ...state.sessions];

          // Reset state
          set({
            currentSession: null,
            timerState: {...INITIAL_TIMER_STATE},
            sessions: updatedSessions,
          });

          // Recalculate today's stats
          get().calculateTodayStats();

          console.log(
            `[FocusStore] Stopped Focus session (${
              isCompleted ? 'completed' : 'interrupted'
            })`,
          );
        } catch (error) {
          console.error('[FocusStore] Error stopping Focus:', error);
        }
      },

      /**
       * Select a task for the Focus session
       *
       * @param task - Task to select (or null to deselect)
       */
      selectTask: (task: Task | null) => {
        set({selectedTask: task});
        console.log(
          `[FocusStore] Selected task: ${task ? task.title : 'None'}`,
        );
      },

      /**
       * Update Focus settings
       *
       * Updates settings and persists to storage.
       *
       * @param newSettings - Partial settings to update
       */
      updateSettings: async (newSettings: Partial<FocusSettings>) => {
        const state = get();

        try {
          // Merge with existing settings
          const updatedSettings = {
            ...state.settings,
            ...newSettings,
          };

          // Save to storage
          await storageService.saveFocusSettings(updatedSettings);

          // Update state
          set({settings: updatedSettings});

          console.log('[FocusStore] Updated settings:', newSettings);
        } catch (error) {
          console.error('[FocusStore] Error updating settings:', error);
        }
      },

      /**
       * Load sessions from storage
       *
       * Loads session history and settings from AsyncStorage.
       */
      loadSessions: async () => {
        try {
          // Load sessions
          const sessions = await storageService.loadFocusSessions();

          // Load settings
          const settings = await storageService.loadFocusSettings();

          // Update state
          set({
            sessions: sessions || [],
            settings: settings || DEFAULT_FOCUS_SETTINGS,
          });

          // Calculate today's stats
          get().calculateTodayStats();

          console.log(
            `[FocusStore] Loaded ${
              sessions?.length || 0
            } sessions from storage`,
          );
        } catch (error) {
          console.error('[FocusStore] Error loading sessions:', error);
        }
      },

      /**
       * Calculate today's statistics
       *
       * Calculates total minutes, pomodoros completed, and session counts
       * for today's date.
       */
      calculateTodayStats: () => {
        const state = get();

        try {
          // Get today's sessions
          const todaySessions = getTodaySessionsSync(state.sessions);

          // Calculate statistics
          const totalMinutes = Math.floor(
            sessionService.calculateTotalDuration(todaySessions) / 60,
          );

          const pomodorosCompleted = sessionService.countPomodoroSessions(
            todaySessions.filter((s: FocusSession) => s.status === 'completed'),
          );

          const sessionsCompleted =
            sessionService.countCompletedSessions(todaySessions);

          const sessionsInterrupted =
            sessionService.countInterruptedSessions(todaySessions);

          // Update state
          const todayStats: TodayStats = {
            totalMinutes,
            pomodorosCompleted,
            sessionsCompleted,
            sessionsInterrupted,
          };

          set({todayStats});

          console.log('[FocusStore] Calculated today stats:', todayStats);
        } catch (error) {
          console.error('[FocusStore] Error calculating stats:', error);
        }
      },
    }),
    {
      name: 'focus-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist settings, sessions, and stats
      // Do NOT persist timerState or currentSession (volatile)
      partialize: state => ({
        settings: state.settings,
        sessions: state.sessions,
        todayStats: state.todayStats,
      }),
    },
  ),
);

// ============================================================================
// Timer Event Listeners
// ============================================================================

/**
 * Set up event listeners for TimerService
 *
 * Connects TimerService events to Zustand state updates.
 *
 * @param timer - TimerService instance
 * @param set - Zustand set function
 * @param get - Zustand get function
 */
const setupTimerListeners = (
  timer: TimerService,
  set: (
    partial:
      | Partial<FocusStoreState>
      | ((state: FocusStoreState) => Partial<FocusStoreState>),
  ) => void,
  get: () => FocusStoreState,
): void => {
  // Remove any existing listeners to prevent duplicates
  timer.removeAllListeners();

  /**
   * Handle tick event
   * Updates timeRemaining in state
   */
  timer.on('tick', (timeRemaining: number) => {
    const state = get();
    set({
      timerState: {
        ...state.timerState,
        timeRemaining,
      },
    });
  });

  /**
   * Handle complete event
   * Transitions to next phase or completes session
   */
  timer.on('complete', async () => {
    const state = get();
    const {timerState, settings} = state;

    console.log('[FocusStore] Timer completed');

    // If in work phase, increment pomodoros
    const isWorkPhase = pomodoroCalculator.isWorkPhase(timerState.currentPhase);

    const newPomodorosCompleted = isWorkPhase
      ? timerState.pomodorosCompleted + 1
      : timerState.pomodorosCompleted;

    // Calculate next phase
    const nextPhase = pomodoroCalculator.getNextPhase(
      timerState.currentPhase,
      newPomodorosCompleted,
      settings,
    );

    // Get duration for next phase
    const nextDuration = pomodoroCalculator.getPhaseDuration(
      nextPhase,
      settings,
    );

    // Auto-start next phase
    timer.start(nextDuration);

    // Update state
    set({
      timerState: {
        ...timerState,
        currentPhase: nextPhase,
        timeRemaining: nextDuration,
        pomodorosCompleted: newPomodorosCompleted,
        status: 'running',
      },
    });

    console.log(`[FocusStore] Transitioned to ${nextPhase} (${nextDuration}s)`);
  });

  /**
   * Handle pause event
   * Updates status to paused
   */
  timer.on('pause', () => {
    const state = get();
    set({
      timerState: {
        ...state.timerState,
        status: 'paused',
      },
    });
  });

  /**
   * Handle resume event
   * Updates status to running
   */
  timer.on('resume', () => {
    const state = get();
    set({
      timerState: {
        ...state.timerState,
        status: 'running',
      },
    });
  });
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get today's sessions synchronously from sessions array
 * (Helper for calculateTodayStats)
 *
 * @param sessions - Array of all sessions
 * @returns Array of sessions from today
 */
const getTodaySessionsSync = (sessions: FocusSession[]): FocusSession[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });
};
