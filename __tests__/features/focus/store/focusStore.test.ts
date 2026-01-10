/**
 * Integration tests for focusStore
 *
 * These are integration tests that verify how the Zustand store integrates
 * with all services (timer, session, storage, notification) and manages
 * complex workflows like session lifecycle, phase transitions, and error handling.
 *
 * Test Strategy:
 * - Mock all external services (timer, session, storage, notification)
 * - Test store actions and state transitions
 * - Verify service integrations and correct method calls
 * - Test error handling and edge cases
 * - Use fake timers for time-based tests
 */

import {act} from '@testing-library/react-native';
import {useFocusStore} from '../../../../src/features/focus/store/focusStore';
import * as timerServiceModule from '../../../../src/features/focus/services/timerService';
import * as sessionService from '../../../../src/features/focus/services/sessionService';
import * as storageService from '../../../../src/features/focus/services/storageService';
import * as notificationService from '../../../../src/features/focus/services/notificationService';
import {
  DEFAULT_FOCUS_SETTINGS,
  INITIAL_TIMER_STATE,
  INITIAL_TODAY_STATS,
} from '../../../../src/features/focus/constants/defaults';
import type {
  FocusSession,
  FocusSettings,
  Task,
} from '../../../../src/features/focus/types/focus.types';

// ============================================================================
// Mocks
// ============================================================================

// Mock all services
jest.mock('../../../../src/features/focus/services/timerService');
jest.mock('../../../../src/features/focus/services/sessionService');
jest.mock('../../../../src/features/focus/services/storageService');
jest.mock('../../../../src/features/focus/services/notificationService');

// Mock AsyncStorage (used by Zustand persist)
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Create a mock TimerService instance
 */
const createMockTimerService = () => {
  const listeners: {[key: string]: Function[]} = {};

  return {
    start: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
    getStatus: jest.fn(() => 'idle'),
    getTimeRemaining: jest.fn(() => 0),
    isRunning: jest.fn(() => false),
    on: jest.fn((event: string, callback: Function) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    }),
    removeAllListeners: jest.fn(() => {
      Object.keys(listeners).forEach(key => {
        listeners[key] = [];
      });
    }),
    emit: (event: string, ...args: any[]) => {
      if (listeners[event]) {
        listeners[event].forEach(callback => callback(...args));
      }
    },
    _listeners: listeners,
  };
};

/**
 * Create a mock FocusSession
 */
const createMockSession = (overrides?: Partial<FocusSession>): FocusSession => {
  const now = new Date();
  return {
    id: 'session_123',
    mode: 'pomodoro',
    startTime: now,
    durationSeconds: 0,
    pausesCount: 0,
    pomodorosCompleted: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Create a mock Task
 */
const createMockTask = (overrides?: Partial<Task>): Task => {
  return {
    id: 'task_1',
    title: 'Test Task',
    completed: false,
    priority: 'medium',
    listId: 'list_1',
    createdAt: new Date(),
    ...overrides,
  };
};

/**
 * Reset store to initial state
 */
const resetStore = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = useFocusStore.getState();
  act(() => {
    useFocusStore.setState({
      timerState: {...INITIAL_TIMER_STATE},
      currentSession: null,
      selectedTask: null,
      settings: {...DEFAULT_FOCUS_SETTINGS},
      sessions: [],
      todayStats: {...INITIAL_TODAY_STATS},
      error: null,
    });
  });
};

// ============================================================================
// Tests
// ============================================================================

describe('focusStore', () => {
  let mockTimerService: ReturnType<typeof createMockTimerService>;

  beforeEach(() => {
    // Reset store
    resetStore();

    // Create fresh mock timer service
    mockTimerService = createMockTimerService();

    // Mock getTimerService to return our mock
    jest
      .spyOn(timerServiceModule, 'getTimerService')
      .mockReturnValue(mockTimerService as any);

    // Setup default mock implementations
    jest
      .spyOn(sessionService, 'createSession')
      .mockImplementation((taskId, mode) => createMockSession({taskId, mode}));

    jest
      .spyOn(sessionService, 'updateSession')
      .mockImplementation((session, updates) => ({...session, ...updates}));

    jest
      .spyOn(sessionService, 'completeSession')
      .mockImplementation(session => ({
        ...session,
        status: 'completed',
        endTime: new Date(),
      }));

    jest
      .spyOn(sessionService, 'interruptSession')
      .mockImplementation(session => ({
        ...session,
        status: 'interrupted',
        endTime: new Date(),
      }));

    jest
      .spyOn(sessionService, 'incrementPauseCount')
      .mockImplementation(session => ({
        ...session,
        pausesCount: session.pausesCount + 1,
      }));

    jest.spyOn(sessionService, 'calculateTotalDuration').mockReturnValue(1500);

    jest.spyOn(sessionService, 'calculateTotalPomodoros').mockReturnValue(2);

    jest.spyOn(sessionService, 'countCompletedSessions').mockReturnValue(1);

    jest.spyOn(sessionService, 'countInterruptedSessions').mockReturnValue(0);

    jest.spyOn(storageService, 'saveFocusSession').mockResolvedValue(undefined);

    jest
      .spyOn(storageService, 'saveFocusSettings')
      .mockResolvedValue(undefined);

    jest
      .spyOn(storageService, 'saveCurrentSession')
      .mockResolvedValue(undefined);

    jest.spyOn(storageService, 'loadFocusSessions').mockResolvedValue([]);

    jest
      .spyOn(storageService, 'loadFocusSettings')
      .mockResolvedValue(DEFAULT_FOCUS_SETTINGS);

    jest.spyOn(storageService, 'loadCurrentSession').mockResolvedValue(null);

    jest
      .spyOn(notificationService, 'getPermissionStatus')
      .mockReturnValue('granted');

    jest
      .spyOn(notificationService, 'requestPermissions')
      .mockResolvedValue(true);

    jest
      .spyOn(notificationService, 'showWorkCompleteNotification')
      .mockImplementation(() => {});

    jest
      .spyOn(notificationService, 'showBreakCompleteNotification')
      .mockImplementation(() => {});

    jest
      .spyOn(notificationService, 'cancelAllNotifications')
      .mockResolvedValue(undefined);

    // Use fake timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // ==========================================================================
  // Initialization Tests
  // ==========================================================================

  describe('Initialization', () => {
    it('should have correct initial state', () => {
      const state = useFocusStore.getState();

      expect(state.timerState).toEqual(INITIAL_TIMER_STATE);
      expect(state.currentSession).toBeNull();
      expect(state.selectedTask).toBeNull();
      expect(state.settings).toEqual(DEFAULT_FOCUS_SETTINGS);
      expect(state.sessions).toEqual([]);
      expect(state.todayStats).toEqual(INITIAL_TODAY_STATS);
      expect(state.error).toBeNull();
    });

    it('should load settings from storage on init', async () => {
      const customSettings: FocusSettings = {
        ...DEFAULT_FOCUS_SETTINGS,
        pomoWorkDuration: 30,
        pomoShortBreak: 10,
      };

      jest
        .spyOn(storageService, 'loadFocusSettings')
        .mockResolvedValue(customSettings);

      await act(async () => {
        await useFocusStore.getState().loadSessions();
      });

      const state = useFocusStore.getState();
      expect(state.settings).toEqual(customSettings);
    });

    it('should load sessions from storage on init', async () => {
      const mockSessions = [
        createMockSession({id: 'session_1'}),
        createMockSession({id: 'session_2'}),
      ];

      jest
        .spyOn(storageService, 'loadFocusSessions')
        .mockResolvedValue(mockSessions);

      await act(async () => {
        await useFocusStore.getState().loadSessions();
      });

      const state = useFocusStore.getState();
      expect(state.sessions).toEqual(mockSessions);
    });

    it('should restore current session from storage (crash recovery)', async () => {
      const mockSession = createMockSession({pomodorosCompleted: 2});

      jest
        .spyOn(storageService, 'loadCurrentSession')
        .mockResolvedValue(mockSession);

      await act(async () => {
        await useFocusStore.getState().loadSessions();
      });

      const state = useFocusStore.getState();
      expect(state.currentSession).toEqual(mockSession);
    });
  });

  // ==========================================================================
  // Focus Session Lifecycle Tests
  // ==========================================================================

  describe('Focus Session Lifecycle', () => {
    describe('startFocus', () => {
      it('should create session and start timer', async () => {
        await act(async () => {
          await useFocusStore.getState().startFocus();
        });

        const state = useFocusStore.getState();

        // Verify session created
        expect(sessionService.createSession).toHaveBeenCalledWith(
          undefined,
          'pomodoro',
        );
        expect(state.currentSession).not.toBeNull();

        // Verify timer started with correct duration (25 min = 1500 sec)
        expect(mockTimerService.start).toHaveBeenCalledWith(1500);

        // Verify state updated
        expect(state.timerState.status).toBe('running');
        expect(state.timerState.timeRemaining).toBe(1500);
      });

      it('should save session to storage immediately for crash recovery', async () => {
        await act(async () => {
          await useFocusStore.getState().startFocus();
        });

        expect(storageService.saveCurrentSession).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'session_123',
            status: 'active',
          }),
        );
      });

      it('should start with task ID when provided', async () => {
        await act(async () => {
          await useFocusStore.getState().startFocus('task_1');
        });

        expect(sessionService.createSession).toHaveBeenCalledWith(
          'task_1',
          'pomodoro',
        );
      });

      it('should request notification permissions on first start', async () => {
        jest
          .spyOn(notificationService, 'getPermissionStatus')
          .mockReturnValue('not-requested');

        await act(async () => {
          await useFocusStore.getState().startFocus();
        });

        expect(notificationService.requestPermissions).toHaveBeenCalled();
      });

      it('should not request permissions if already granted', async () => {
        jest
          .spyOn(notificationService, 'getPermissionStatus')
          .mockReturnValue('granted');

        await act(async () => {
          await useFocusStore.getState().startFocus();
        });

        expect(notificationService.requestPermissions).not.toHaveBeenCalled();
      });

      it('should continue if notification permissions denied', async () => {
        jest
          .spyOn(notificationService, 'getPermissionStatus')
          .mockReturnValue('not-requested');
        jest
          .spyOn(notificationService, 'requestPermissions')
          .mockResolvedValue(false);

        await act(async () => {
          await useFocusStore.getState().startFocus();
        });

        const state = useFocusStore.getState();
        expect(state.currentSession).not.toBeNull();
        expect(state.timerState.status).toBe('running');
      });

      it('should not start if session already active', async () => {
        // Start first session
        await act(async () => {
          await useFocusStore.getState().startFocus();
        });

        jest.clearAllMocks();

        // Try to start second session
        await act(async () => {
          await useFocusStore.getState().startFocus();
        });

        // Should not create new session
        expect(sessionService.createSession).not.toHaveBeenCalled();
        expect(mockTimerService.start).not.toHaveBeenCalled();
      });

      it('should set error state on failure', async () => {
        jest
          .spyOn(storageService, 'saveCurrentSession')
          .mockRejectedValue(new Error('Storage error'));

        await act(async () => {
          await useFocusStore.getState().startFocus();
        });

        const state = useFocusStore.getState();
        expect(state.error).not.toBeNull();
        expect(state.error?.type).toBe('session_error');
        expect(state.error?.message).toContain('Failed to start Focus session');
      });

      it('should setup timer event listeners', async () => {
        await act(async () => {
          await useFocusStore.getState().startFocus();
        });

        expect(mockTimerService.on).toHaveBeenCalledWith(
          'tick',
          expect.any(Function),
        );
        expect(mockTimerService.on).toHaveBeenCalledWith(
          'complete',
          expect.any(Function),
        );
      });
    });

    describe('pauseFocus', () => {
      beforeEach(async () => {
        // Start a session first
        await act(async () => {
          await useFocusStore.getState().startFocus();
        });
        jest.clearAllMocks();
      });

      it('should pause timer and increment pause count', () => {
        act(() => {
          useFocusStore.getState().pauseFocus();
        });

        const state = useFocusStore.getState();

        expect(mockTimerService.pause).toHaveBeenCalled();
        expect(state.timerState.status).toBe('paused');
        expect(state.timerState.pausesUsed).toBe(1);
      });

      it('should increment session pause count', () => {
        act(() => {
          useFocusStore.getState().pauseFocus();
        });

        expect(sessionService.incrementPauseCount).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'session_123',
          }),
        );
      });

      it('should not pause if no active session', () => {
        resetStore();

        act(() => {
          useFocusStore.getState().pauseFocus();
        });

        expect(mockTimerService.pause).not.toHaveBeenCalled();
      });

      it('should not pause if max pauses reached', () => {
        // Set pausesUsed to max (3)
        act(() => {
          useFocusStore.setState({
            timerState: {
              ...useFocusStore.getState().timerState,
              pausesUsed: 3,
            },
          });
        });

        act(() => {
          useFocusStore.getState().pauseFocus();
        });

        expect(mockTimerService.pause).not.toHaveBeenCalled();
      });

      it('should set error state on failure', () => {
        jest.spyOn(mockTimerService, 'pause').mockImplementation(() => {
          throw new Error('Timer error');
        });

        act(() => {
          useFocusStore.getState().pauseFocus();
        });

        const state = useFocusStore.getState();
        expect(state.error).not.toBeNull();
        expect(state.error?.type).toBe('timer_error');
      });
    });

    describe('resumeFocus', () => {
      beforeEach(async () => {
        // Start and pause a session
        await act(async () => {
          await useFocusStore.getState().startFocus();
        });
        act(() => {
          useFocusStore.getState().pauseFocus();
        });
        jest.clearAllMocks();
      });

      it('should resume timer', () => {
        act(() => {
          useFocusStore.getState().resumeFocus();
        });

        const state = useFocusStore.getState();

        expect(mockTimerService.resume).toHaveBeenCalled();
        expect(state.timerState.status).toBe('running');
      });

      it('should not resume if session not paused', () => {
        resetStore();

        act(() => {
          useFocusStore.getState().resumeFocus();
        });

        expect(mockTimerService.resume).not.toHaveBeenCalled();
      });

      it('should set error state on failure', () => {
        jest.spyOn(mockTimerService, 'resume').mockImplementation(() => {
          throw new Error('Timer error');
        });

        act(() => {
          useFocusStore.getState().resumeFocus();
        });

        const state = useFocusStore.getState();
        expect(state.error).not.toBeNull();
        expect(state.error?.type).toBe('timer_error');
      });
    });

    describe('stopFocus', () => {
      beforeEach(async () => {
        // Start a session
        await act(async () => {
          await useFocusStore.getState().startFocus();
        });
        jest.clearAllMocks();
      });

      it('should stop timer and save completed session', async () => {
        // Set timeRemaining to 0 to simulate completion
        act(() => {
          useFocusStore.setState({
            timerState: {
              ...useFocusStore.getState().timerState,
              timeRemaining: 0,
            },
          });
        });

        await act(async () => {
          await useFocusStore.getState().stopFocus();
        });

        expect(mockTimerService.stop).toHaveBeenCalled();
        expect(sessionService.completeSession).toHaveBeenCalled();
        expect(storageService.saveFocusSession).toHaveBeenCalled();
      });

      it('should save interrupted session if time remaining', async () => {
        await act(async () => {
          await useFocusStore.getState().stopFocus();
        });

        expect(sessionService.interruptSession).toHaveBeenCalled();
        expect(storageService.saveFocusSession).toHaveBeenCalled();
      });

      it('should cancel all notifications', async () => {
        await act(async () => {
          await useFocusStore.getState().stopFocus();
        });

        expect(notificationService.cancelAllNotifications).toHaveBeenCalled();
      });

      it('should clear current session from storage', async () => {
        await act(async () => {
          await useFocusStore.getState().stopFocus();
        });

        expect(storageService.saveCurrentSession).toHaveBeenCalledWith(null);
      });

      it('should reset timer state', async () => {
        await act(async () => {
          await useFocusStore.getState().stopFocus();
        });

        const state = useFocusStore.getState();
        expect(state.timerState).toEqual(INITIAL_TIMER_STATE);
        expect(state.currentSession).toBeNull();
      });

      it('should add session to sessions list', async () => {
        await act(async () => {
          await useFocusStore.getState().stopFocus();
        });

        const state = useFocusStore.getState();
        expect(state.sessions.length).toBe(1);
      });

      it('should recalculate today stats after stop', async () => {
        await act(async () => {
          await useFocusStore.getState().stopFocus();
        });

        const state = useFocusStore.getState();
        expect(state.todayStats.totalMinutes).toBe(25); // 1500 seconds / 60
        expect(state.todayStats.pomodorosCompleted).toBe(2);
      });

      it('should not stop if no active session', async () => {
        resetStore();

        await act(async () => {
          await useFocusStore.getState().stopFocus();
        });

        expect(mockTimerService.stop).not.toHaveBeenCalled();
      });

      it('should restore session on storage error', async () => {
        jest
          .spyOn(storageService, 'saveFocusSession')
          .mockRejectedValue(new Error('Storage error'));

        await act(async () => {
          await useFocusStore.getState().stopFocus();
        });

        const state = useFocusStore.getState();
        expect(state.currentSession).not.toBeNull();
        expect(state.error).not.toBeNull();
        expect(state.error?.type).toBe('storage_save_failed');
      });

      it('should prevent duplicate calls (race condition)', async () => {
        // Call stopFocus twice simultaneously
        await act(async () => {
          const promise1 = useFocusStore.getState().stopFocus();
          const promise2 = useFocusStore.getState().stopFocus();
          await Promise.all([promise1, promise2]);
        });

        // Should only save once
        expect(storageService.saveFocusSession).toHaveBeenCalledTimes(1);
      });
    });
  });

  // ==========================================================================
  // Phase Transitions Tests
  // ==========================================================================

  describe('Phase Transitions', () => {
    beforeEach(async () => {
      // Start a session
      await act(async () => {
        await useFocusStore.getState().startFocus();
      });
      jest.clearAllMocks();
    });

    it('should transition from work to short break', async () => {
      await act(async () => {
        // Emit complete event from timer
        mockTimerService.emit('complete');
      });

      const state = useFocusStore.getState();

      expect(state.timerState.currentPhase).toBe('shortBreak');
      expect(state.timerState.pomodorosCompleted).toBe(1);
      expect(mockTimerService.start).toHaveBeenCalledWith(300); // 5 min
    });

    it('should transition from short break to work', async () => {
      // First transition to short break
      await act(async () => {
        mockTimerService.emit('complete');
      });

      jest.clearAllMocks();

      // Then transition back to work
      await act(async () => {
        mockTimerService.emit('complete');
      });

      const state = useFocusStore.getState();

      expect(state.timerState.currentPhase).toBe('work');
      expect(mockTimerService.start).toHaveBeenCalledWith(1500); // 25 min
    });

    it('should transition to long break after 4 pomodoros', async () => {
      // Complete 3 full cycles (work + break)
      for (let i = 0; i < 3; i++) {
        await act(async () => {
          mockTimerService.emit('complete'); // Work -> Break
        });
        await act(async () => {
          mockTimerService.emit('complete'); // Break -> Work
        });
      }

      // Complete 4th work phase (should transition to long break)
      await act(async () => {
        mockTimerService.emit('complete');
      });

      const state = useFocusStore.getState();

      expect(state.timerState.currentPhase).toBe('longBreak');
      expect(state.timerState.pomodorosCompleted).toBe(4);
      expect(mockTimerService.start).toHaveBeenCalledWith(900); // 15 min
    });

    it('should reset pomodoro count after long break', async () => {
      // Set to long break with 4 pomodoros
      act(() => {
        useFocusStore.setState({
          timerState: {
            ...useFocusStore.getState().timerState,
            currentPhase: 'longBreak',
            pomodorosCompleted: 4,
          },
        });
      });

      await act(async () => {
        mockTimerService.emit('complete');
      });

      const state = useFocusStore.getState();

      expect(state.timerState.pomodorosCompleted).toBe(0);
      expect(state.timerState.currentPhase).toBe('work');
    });

    it('should send work complete notification', async () => {
      await act(async () => {
        mockTimerService.emit('complete');
      });

      expect(
        notificationService.showWorkCompleteNotification,
      ).toHaveBeenCalledWith(5); // Short break duration
    });

    it('should send break complete notification', async () => {
      // Transition to break
      await act(async () => {
        mockTimerService.emit('complete');
      });

      jest.clearAllMocks();

      // Complete break
      await act(async () => {
        mockTimerService.emit('complete');
      });

      expect(
        notificationService.showBreakCompleteNotification,
      ).toHaveBeenCalledWith(false); // Not long break
    });

    it('should send long break complete notification', async () => {
      // Set to long break
      act(() => {
        useFocusStore.setState({
          timerState: {
            ...useFocusStore.getState().timerState,
            currentPhase: 'longBreak',
          },
        });
      });

      await act(async () => {
        mockTimerService.emit('complete');
      });

      expect(
        notificationService.showBreakCompleteNotification,
      ).toHaveBeenCalledWith(true); // Is long break
    });

    it('should save intermediate progress after work phase', async () => {
      await act(async () => {
        mockTimerService.emit('complete');
      });

      expect(storageService.saveCurrentSession).toHaveBeenCalledWith(
        expect.objectContaining({
          pomodorosCompleted: 1,
        }),
      );
    });

    it('should not crash if session stopped during transition', async () => {
      // Stop session
      await act(async () => {
        await useFocusStore.getState().stopFocus();
      });

      // Try to emit complete event
      await act(async () => {
        mockTimerService.emit('complete');
      });

      // Should stop timer and not crash
      expect(mockTimerService.stop).toHaveBeenCalled();
    });

    it('should update timer state on tick events', () => {
      act(() => {
        mockTimerService.emit('tick', 1499);
      });

      const state = useFocusStore.getState();
      expect(state.timerState.timeRemaining).toBe(1499);
    });
  });

  // ==========================================================================
  // Task Selection Tests
  // ==========================================================================

  describe('Task Selection', () => {
    it('should select a task', () => {
      const task = createMockTask();

      act(() => {
        useFocusStore.getState().selectTask(task);
      });

      const state = useFocusStore.getState();
      expect(state.selectedTask).toEqual(task);
    });

    it('should deselect task when null passed', () => {
      const task = createMockTask();

      act(() => {
        useFocusStore.getState().selectTask(task);
      });

      act(() => {
        useFocusStore.getState().selectTask(null);
      });

      const state = useFocusStore.getState();
      expect(state.selectedTask).toBeNull();
    });

    it('should allow changing task', () => {
      const task1 = createMockTask({id: 'task_1', title: 'Task 1'});
      const task2 = createMockTask({id: 'task_2', title: 'Task 2'});

      act(() => {
        useFocusStore.getState().selectTask(task1);
      });

      act(() => {
        useFocusStore.getState().selectTask(task2);
      });

      const state = useFocusStore.getState();
      expect(state.selectedTask).toEqual(task2);
    });
  });

  // ==========================================================================
  // Settings Management Tests
  // ==========================================================================

  describe('Settings Management', () => {
    it('should update settings', async () => {
      const newSettings = {
        pomoWorkDuration: 30,
        pomoShortBreak: 10,
      };

      await act(async () => {
        await useFocusStore.getState().updateSettings(newSettings);
      });

      const state = useFocusStore.getState();
      expect(state.settings.pomoWorkDuration).toBe(30);
      expect(state.settings.pomoShortBreak).toBe(10);
    });

    it('should save settings to storage', async () => {
      const newSettings = {
        pomoWorkDuration: 30,
      };

      await act(async () => {
        await useFocusStore.getState().updateSettings(newSettings);
      });

      expect(storageService.saveFocusSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          pomoWorkDuration: 30,
        }),
      );
    });

    it('should validate settings before saving', async () => {
      const invalidSettings = {
        pomoWorkDuration: 100, // Max is 60
      };

      await expect(async () => {
        await act(async () => {
          await useFocusStore.getState().updateSettings(invalidSettings);
        });
      }).rejects.toThrow();

      const state = useFocusStore.getState();
      expect(state.error).not.toBeNull();
      expect(state.error?.type).toBe('validation_error');
    });

    it('should reject invalid work duration', async () => {
      await expect(async () => {
        await act(async () => {
          await useFocusStore.getState().updateSettings({pomoWorkDuration: 3});
        });
      }).rejects.toThrow();
    });

    it('should reject invalid short break', async () => {
      await expect(async () => {
        await act(async () => {
          await useFocusStore.getState().updateSettings({pomoShortBreak: 0});
        });
      }).rejects.toThrow();
    });

    it('should reject invalid long break', async () => {
      await expect(async () => {
        await act(async () => {
          await useFocusStore.getState().updateSettings({pomoLongBreak: 100});
        });
      }).rejects.toThrow();
    });

    it('should reject invalid pomos before long break', async () => {
      await expect(async () => {
        await act(async () => {
          await useFocusStore
            .getState()
            .updateSettings({pomosBeforeLongBreak: 1});
        });
      }).rejects.toThrow();
    });

    it('should reject invalid max pauses', async () => {
      await expect(async () => {
        await act(async () => {
          await useFocusStore
            .getState()
            .updateSettings({maxPausesPerSession: 10});
        });
      }).rejects.toThrow();
    });

    it('should set error state on storage failure', async () => {
      jest
        .spyOn(storageService, 'saveFocusSettings')
        .mockRejectedValue(new Error('Storage error'));

      await expect(async () => {
        await act(async () => {
          await useFocusStore.getState().updateSettings({pomoWorkDuration: 30});
        });
      }).rejects.toThrow();

      const state = useFocusStore.getState();
      expect(state.error).not.toBeNull();
      expect(state.error?.type).toBe('storage_save_failed');
    });

    it('should not update state if save fails', async () => {
      jest
        .spyOn(storageService, 'saveFocusSettings')
        .mockRejectedValue(new Error('Storage error'));

      const originalSettings = useFocusStore.getState().settings;

      await expect(async () => {
        await act(async () => {
          await useFocusStore.getState().updateSettings({pomoWorkDuration: 30});
        });
      }).rejects.toThrow();

      const state = useFocusStore.getState();
      expect(state.settings).toEqual(originalSettings);
    });

    it('should clear error before updating', async () => {
      // Set an error
      act(() => {
        useFocusStore.setState({
          error: {
            type: 'timer_error',
            severity: 'error',
            message: 'Test error',
            timestamp: new Date(),
            dismissible: true,
          },
        });
      });

      await act(async () => {
        await useFocusStore.getState().updateSettings({pomoWorkDuration: 30});
      });

      const state = useFocusStore.getState();
      expect(state.error).toBeNull();
    });
  });

  // ==========================================================================
  // Session History Tests
  // ==========================================================================

  describe('Session History', () => {
    it('should load sessions from storage', async () => {
      const mockSessions = [
        createMockSession({id: 'session_1'}),
        createMockSession({id: 'session_2'}),
      ];

      jest
        .spyOn(storageService, 'loadFocusSessions')
        .mockResolvedValue(mockSessions);

      await act(async () => {
        await useFocusStore.getState().loadSessions();
      });

      const state = useFocusStore.getState();
      expect(state.sessions).toEqual(mockSessions);
    });

    it('should not reload if session is active', async () => {
      // Start a session
      await act(async () => {
        await useFocusStore.getState().startFocus();
      });

      jest.clearAllMocks();

      await act(async () => {
        await useFocusStore.getState().loadSessions();
      });

      expect(storageService.loadFocusSessions).not.toHaveBeenCalled();
    });

    it('should calculate today stats after loading', async () => {
      const today = new Date();
      const mockSessions = [
        createMockSession({
          id: 'session_1',
          startTime: today,
          status: 'completed',
        }),
      ];

      jest
        .spyOn(storageService, 'loadFocusSessions')
        .mockResolvedValue(mockSessions);

      await act(async () => {
        await useFocusStore.getState().loadSessions();
      });

      const state = useFocusStore.getState();
      expect(state.todayStats.totalMinutes).toBe(25);
      expect(state.todayStats.pomodorosCompleted).toBe(2);
    });

    it('should handle storage load failure', async () => {
      jest
        .spyOn(storageService, 'loadFocusSessions')
        .mockRejectedValue(new Error('Storage error'));

      await act(async () => {
        await useFocusStore.getState().loadSessions();
      });

      const state = useFocusStore.getState();
      expect(state.error).not.toBeNull();
      expect(state.error?.type).toBe('storage_load_failed');
      expect(state.sessions).toEqual([]);
      expect(state.settings).toEqual(DEFAULT_FOCUS_SETTINGS);
    });

    it('should handle corrupted data', async () => {
      jest
        .spyOn(storageService, 'loadFocusSessions')
        .mockRejectedValue(new Error('JSON parse error'));

      await expect(async () => {
        await act(async () => {
          await useFocusStore.getState().loadSessions();
        });
      }).rejects.toThrow();

      const state = useFocusStore.getState();
      expect(state.error).not.toBeNull();
      expect(state.error?.type).toBe('storage_corrupted');
      expect(state.error?.severity).toBe('critical');
    });

    it('should clear error before loading', async () => {
      // Set an error
      act(() => {
        useFocusStore.setState({
          error: {
            type: 'timer_error',
            severity: 'error',
            message: 'Test error',
            timestamp: new Date(),
            dismissible: true,
          },
        });
      });

      await act(async () => {
        await useFocusStore.getState().loadSessions();
      });

      const state = useFocusStore.getState();
      expect(state.error).toBeNull();
    });
  });

  // ==========================================================================
  // Today Stats Calculation Tests
  // ==========================================================================

  describe('Today Stats Calculation', () => {
    it('should calculate total minutes from today sessions', () => {
      const today = new Date();
      const mockSessions = [
        createMockSession({
          id: 'session_1',
          startTime: today,
          status: 'completed',
        }),
      ];

      act(() => {
        useFocusStore.setState({sessions: mockSessions});
      });

      act(() => {
        useFocusStore.getState().calculateTodayStats();
      });

      const state = useFocusStore.getState();
      expect(state.todayStats.totalMinutes).toBe(25); // 1500 / 60
    });

    it('should count pomodoros from completed sessions only', () => {
      const today = new Date();
      const mockSessions = [
        createMockSession({
          id: 'session_1',
          startTime: today,
          status: 'completed',
        }),
        createMockSession({
          id: 'session_2',
          startTime: today,
          status: 'interrupted',
        }),
      ];

      act(() => {
        useFocusStore.setState({sessions: mockSessions});
      });

      act(() => {
        useFocusStore.getState().calculateTodayStats();
      });

      const state = useFocusStore.getState();
      expect(state.todayStats.pomodorosCompleted).toBe(2);
    });

    it('should count completed and interrupted sessions', () => {
      const today = new Date();
      const mockSessions = [
        createMockSession({
          id: 'session_1',
          startTime: today,
          status: 'completed',
        }),
        createMockSession({
          id: 'session_2',
          startTime: today,
          status: 'interrupted',
        }),
      ];

      // Update mocks to return correct counts
      jest.spyOn(sessionService, 'countCompletedSessions').mockReturnValue(1);
      jest.spyOn(sessionService, 'countInterruptedSessions').mockReturnValue(1);

      act(() => {
        useFocusStore.setState({sessions: mockSessions});
      });

      act(() => {
        useFocusStore.getState().calculateTodayStats();
      });

      const state = useFocusStore.getState();
      expect(state.todayStats.sessionsCompleted).toBe(1);
      expect(state.todayStats.sessionsInterrupted).toBe(1);
    });

    it('should only include today sessions', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const mockSessions = [
        createMockSession({
          id: 'session_1',
          startTime: today,
          status: 'completed',
        }),
        createMockSession({
          id: 'session_2',
          startTime: yesterday,
          status: 'completed',
        }),
      ];

      act(() => {
        useFocusStore.setState({sessions: mockSessions});
      });

      act(() => {
        useFocusStore.getState().calculateTodayStats();
      });

      // Should only count today's session
      expect(sessionService.calculateTotalDuration).toHaveBeenCalledWith([
        mockSessions[0],
      ]);
    });

    it('should handle empty sessions array', () => {
      // Update mocks to return zero values for empty array
      jest.spyOn(sessionService, 'calculateTotalDuration').mockReturnValue(0);
      jest.spyOn(sessionService, 'calculateTotalPomodoros').mockReturnValue(0);
      jest.spyOn(sessionService, 'countCompletedSessions').mockReturnValue(0);
      jest.spyOn(sessionService, 'countInterruptedSessions').mockReturnValue(0);

      act(() => {
        useFocusStore.setState({sessions: []});
      });

      act(() => {
        useFocusStore.getState().calculateTodayStats();
      });

      const state = useFocusStore.getState();
      expect(state.todayStats).toEqual(INITIAL_TODAY_STATS);
    });
  });

  // ==========================================================================
  // Notifications Integration Tests
  // ==========================================================================

  describe('Notifications Integration', () => {
    beforeEach(async () => {
      await act(async () => {
        await useFocusStore.getState().startFocus();
      });
      jest.clearAllMocks();
    });

    it('should send notification on work complete', async () => {
      await act(async () => {
        mockTimerService.emit('complete');
      });

      expect(
        notificationService.showWorkCompleteNotification,
      ).toHaveBeenCalledWith(5);
    });

    it('should send notification on break complete', async () => {
      // Complete work phase
      await act(async () => {
        mockTimerService.emit('complete');
      });

      jest.clearAllMocks();

      // Complete break phase
      await act(async () => {
        mockTimerService.emit('complete');
      });

      expect(
        notificationService.showBreakCompleteNotification,
      ).toHaveBeenCalledWith(false);
    });

    it('should cancel notifications on stop', async () => {
      await act(async () => {
        await useFocusStore.getState().stopFocus();
      });

      expect(notificationService.cancelAllNotifications).toHaveBeenCalled();
    });

    it('should handle notification errors gracefully', async () => {
      // Mock notification to fail silently (as it does in real implementation)
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      jest
        .spyOn(notificationService, 'showWorkCompleteNotification')
        .mockImplementation(() => {
          // Notification service should handle errors internally
          // and not throw to prevent breaking the timer flow
        });

      await act(async () => {
        mockTimerService.emit('complete');
      });

      // Should continue with phase transition even if notification fails
      const state = useFocusStore.getState();
      expect(state.timerState.currentPhase).toBe('shortBreak');

      consoleErrorSpy.mockRestore();
    });
  });

  // ==========================================================================
  // Cleanup Tests
  // ==========================================================================

  describe('Cleanup', () => {
    it('should remove all timer listeners', () => {
      act(() => {
        useFocusStore.getState().cleanup();
      });

      expect(mockTimerService.removeAllListeners).toHaveBeenCalled();
    });

    it('should stop timer', () => {
      act(() => {
        useFocusStore.getState().cleanup();
      });

      expect(mockTimerService.stop).toHaveBeenCalled();
    });

    it('should not crash on cleanup error', () => {
      jest.spyOn(mockTimerService, 'stop').mockImplementation(() => {
        throw new Error('Cleanup error');
      });

      expect(() => {
        act(() => {
          useFocusStore.getState().cleanup();
        });
      }).not.toThrow();
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================

  describe('Error Handling', () => {
    it('should clear error', () => {
      act(() => {
        useFocusStore.setState({
          error: {
            type: 'timer_error',
            severity: 'error',
            message: 'Test error',
            timestamp: new Date(),
            dismissible: true,
          },
        });
      });

      act(() => {
        useFocusStore.getState().clearError();
      });

      const state = useFocusStore.getState();
      expect(state.error).toBeNull();
    });

    it('should create dismissible errors', async () => {
      jest
        .spyOn(storageService, 'saveCurrentSession')
        .mockRejectedValue(new Error('Storage error'));

      await act(async () => {
        await useFocusStore.getState().startFocus();
      });

      const state = useFocusStore.getState();
      expect(state.error?.dismissible).toBe(true);
    });

    it('should include error details', async () => {
      jest
        .spyOn(storageService, 'saveCurrentSession')
        .mockRejectedValue(new Error('Storage error'));

      await act(async () => {
        await useFocusStore.getState().startFocus();
      });

      const state = useFocusStore.getState();
      expect(state.error?.details).toBe('Storage error');
    });

    it('should set error timestamp', async () => {
      jest
        .spyOn(storageService, 'saveCurrentSession')
        .mockRejectedValue(new Error('Storage error'));

      await act(async () => {
        await useFocusStore.getState().startFocus();
      });

      const state = useFocusStore.getState();
      expect(state.error?.timestamp).toBeInstanceOf(Date);
    });
  });
});
