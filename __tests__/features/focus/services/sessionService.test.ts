/**
 * Unit tests for sessionService
 *
 * Tests all session management functions including creation, updates,
 * completion, interruption, duration calculations, and statistics.
 */

import {
  createSession,
  updateSession,
  completeSession,
  interruptSession,
  incrementPauseCount,
  calculateDuration,
  getElapsedTime,
  formatDuration,
  isSessionActive,
  isSessionCompleted,
  isSessionInterrupted,
  meetsMinimumDuration,
  calculateTotalDuration,
  countCompletedSessions,
  countInterruptedSessions,
  countPomodoroSessions,
  calculateTotalPomodoros,
  countStopwatchSessions,
  getSessionsForTask,
  calculateCompletionRate,
} from '../../../../src/features/focus/services/sessionService';
import {FocusSession, FocusMode} from '../../../../src/features/focus/types/focus.types';

// ============================================================================
// Test Helpers
// ============================================================================

const createMockSession = (overrides?: Partial<FocusSession>): FocusSession => {
  const now = new Date('2026-01-03T10:00:00.000Z');
  return {
    id: 'session_123',
    userId: undefined,
    taskId: 'task_1',
    mode: 'pomodoro',
    startTime: now,
    endTime: undefined,
    durationSeconds: 0,
    pausesCount: 0,
    pomodorosCompleted: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

// ============================================================================
// Session Creation Tests
// ============================================================================

describe('sessionService', () => {
  describe('createSession', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(1735898400000); // 2026-01-03T10:00:00.000Z
      jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create a session with default mode (pomodoro)', () => {
      const session = createSession();

      expect(session).toMatchObject({
        userId: undefined,
        taskId: undefined,
        mode: 'pomodoro',
        durationSeconds: 0,
        pausesCount: 0,
        pomodorosCompleted: 0,
        status: 'active',
      });
      expect(session.id).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(session.startTime).toBeInstanceOf(Date);
      expect(session.createdAt).toBeInstanceOf(Date);
      expect(session.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a session with taskId', () => {
      const session = createSession('task_123');

      expect(session.taskId).toBe('task_123');
      expect(session.mode).toBe('pomodoro');
    });

    it('should create a session with stopwatch mode', () => {
      const session = createSession(undefined, 'stopwatch');

      expect(session.mode).toBe('stopwatch');
      expect(session.taskId).toBeUndefined();
    });

    it('should create a session with both taskId and mode', () => {
      const session = createSession('task_456', 'stopwatch');

      expect(session.taskId).toBe('task_456');
      expect(session.mode).toBe('stopwatch');
    });

    it('should generate unique session IDs', () => {
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.111111111)
        .mockReturnValueOnce(0.222222222);

      const session1 = createSession();
      const session2 = createSession();

      expect(session1.id).not.toBe(session2.id);
    });

    it('should set all timestamps to the same value', () => {
      const session = createSession();

      expect(session.startTime.getTime()).toBe(session.createdAt.getTime());
      expect(session.startTime.getTime()).toBe(session.updatedAt.getTime());
    });
  });

  // ==========================================================================
  // Session Updates Tests
  // ==========================================================================

  describe('updateSession', () => {
    it('should update session with new data', () => {
      const originalSession = createMockSession();
      const updates = {
        durationSeconds: 300,
        pausesCount: 1,
      };

      const updatedSession = updateSession(originalSession, updates);

      expect(updatedSession.durationSeconds).toBe(300);
      expect(updatedSession.pausesCount).toBe(1);
      expect(updatedSession.id).toBe(originalSession.id);
    });

    it('should update the updatedAt timestamp', () => {
      const originalSession = createMockSession({
        updatedAt: new Date('2026-01-03T09:00:00.000Z'),
      });

      const updatedSession = updateSession(originalSession, {pausesCount: 1});

      expect(updatedSession.updatedAt.getTime()).toBeGreaterThan(
        originalSession.updatedAt.getTime(),
      );
    });

    it('should preserve original session data not in updates', () => {
      const originalSession = createMockSession({
        taskId: 'task_original',
        mode: 'pomodoro',
      });

      const updatedSession = updateSession(originalSession, {pausesCount: 2});

      expect(updatedSession.taskId).toBe('task_original');
      expect(updatedSession.mode).toBe('pomodoro');
    });

    it('should allow updating multiple fields', () => {
      const originalSession = createMockSession();
      const updates = {
        durationSeconds: 600,
        pausesCount: 3,
        pomodorosCompleted: 2,
        status: 'completed' as const,
      };

      const updatedSession = updateSession(originalSession, updates);

      expect(updatedSession).toMatchObject(updates);
    });
  });

  describe('completeSession', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should mark session as completed', () => {
      const session = createMockSession({
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      jest.setSystemTime(new Date('2026-01-03T10:25:00.000Z'));

      const completedSession = completeSession(session);

      expect(completedSession.status).toBe('completed');
      expect(completedSession.endTime).toBeInstanceOf(Date);
      expect(completedSession.durationSeconds).toBe(1500); // 25 minutes
    });

    it('should calculate duration correctly', () => {
      const session = createMockSession({
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      jest.setSystemTime(new Date('2026-01-03T10:05:30.000Z'));

      const completedSession = completeSession(session);

      expect(completedSession.durationSeconds).toBe(330); // 5 minutes 30 seconds
    });

    it('should update the updatedAt timestamp', () => {
      const session = createMockSession();
      const completedSession = completeSession(session);

      expect(completedSession.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('interruptSession', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should mark session as interrupted', () => {
      const session = createMockSession({
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      jest.setSystemTime(new Date('2026-01-03T10:10:00.000Z'));

      const interruptedSession = interruptSession(session);

      expect(interruptedSession.status).toBe('interrupted');
      expect(interruptedSession.endTime).toBeInstanceOf(Date);
      expect(interruptedSession.durationSeconds).toBe(600); // 10 minutes
    });

    it('should calculate duration correctly', () => {
      const session = createMockSession({
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      jest.setSystemTime(new Date('2026-01-03T10:03:45.000Z'));

      const interruptedSession = interruptSession(session);

      expect(interruptedSession.durationSeconds).toBe(225); // 3 minutes 45 seconds
    });
  });

  describe('incrementPauseCount', () => {
    it('should increment pause count by 1', () => {
      const session = createMockSession({pausesCount: 0});

      const updatedSession = incrementPauseCount(session);

      expect(updatedSession.pausesCount).toBe(1);
    });

    it('should increment from existing pause count', () => {
      const session = createMockSession({pausesCount: 3});

      const updatedSession = incrementPauseCount(session);

      expect(updatedSession.pausesCount).toBe(4);
    });

    it('should update the updatedAt timestamp', () => {
      const session = createMockSession({
        updatedAt: new Date('2026-01-03T09:00:00.000Z'),
      });

      const updatedSession = incrementPauseCount(session);

      expect(updatedSession.updatedAt.getTime()).toBeGreaterThan(
        session.updatedAt.getTime(),
      );
    });
  });

  // ==========================================================================
  // Duration Calculations Tests
  // ==========================================================================

  describe('calculateDuration', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should calculate duration from start to now', () => {
      const session = createMockSession({
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      jest.setSystemTime(new Date('2026-01-03T10:15:00.000Z'));

      const duration = calculateDuration(session);

      expect(duration).toBe(900); // 15 minutes
    });

    it('should calculate duration with custom end time', () => {
      const session = createMockSession({
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      const endTime = new Date('2026-01-03T10:30:00.000Z');
      const duration = calculateDuration(session, endTime);

      expect(duration).toBe(1800); // 30 minutes
    });

    it('should return 0 for negative duration', () => {
      const session = createMockSession({
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      const endTime = new Date('2026-01-03T09:00:00.000Z'); // Before start
      const duration = calculateDuration(session, endTime);

      expect(duration).toBe(0);
    });

    it('should floor fractional seconds', () => {
      const session = createMockSession({
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      const endTime = new Date('2026-01-03T10:00:05.999Z'); // 5.999 seconds
      const duration = calculateDuration(session, endTime);

      expect(duration).toBe(5); // Floored to 5 seconds
    });
  });

  describe('getElapsedTime', () => {
    it('should return durationSeconds for completed session', () => {
      const session = createMockSession({
        status: 'completed',
        durationSeconds: 1500,
      });

      const elapsed = getElapsedTime(session);

      expect(elapsed).toBe(1500);
    });

    it('should return durationSeconds for interrupted session', () => {
      const session = createMockSession({
        status: 'interrupted',
        durationSeconds: 600,
      });

      const elapsed = getElapsedTime(session);

      expect(elapsed).toBe(600);
    });

    it('should calculate duration for active session', () => {
      jest.useFakeTimers();

      const session = createMockSession({
        status: 'active',
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      jest.setSystemTime(new Date('2026-01-03T10:10:00.000Z'));

      const elapsed = getElapsedTime(session);

      expect(elapsed).toBe(600); // 10 minutes

      jest.useRealTimers();
    });
  });

  describe('formatDuration', () => {
    it('should format seconds only', () => {
      expect(formatDuration(30)).toBe('30s');
      expect(formatDuration(59)).toBe('59s');
    });

    it('should format minutes only', () => {
      expect(formatDuration(60)).toBe('1m');
      expect(formatDuration(300)).toBe('5m');
      expect(formatDuration(3540)).toBe('59m');
    });

    it('should format hours only', () => {
      expect(formatDuration(3600)).toBe('1h');
      expect(formatDuration(7200)).toBe('2h');
    });

    it('should format hours and minutes', () => {
      expect(formatDuration(3660)).toBe('1h 1m');
      expect(formatDuration(5400)).toBe('1h 30m');
      expect(formatDuration(7380)).toBe('2h 3m');
    });

    it('should handle zero', () => {
      expect(formatDuration(0)).toBe('0s');
    });
  });

  // ==========================================================================
  // Session Validation Tests
  // ==========================================================================

  describe('isSessionActive', () => {
    it('should return true for active session', () => {
      const session = createMockSession({status: 'active'});
      expect(isSessionActive(session)).toBe(true);
    });

    it('should return false for completed session', () => {
      const session = createMockSession({status: 'completed'});
      expect(isSessionActive(session)).toBe(false);
    });

    it('should return false for interrupted session', () => {
      const session = createMockSession({status: 'interrupted'});
      expect(isSessionActive(session)).toBe(false);
    });
  });

  describe('isSessionCompleted', () => {
    it('should return true for completed session', () => {
      const session = createMockSession({status: 'completed'});
      expect(isSessionCompleted(session)).toBe(true);
    });

    it('should return false for active session', () => {
      const session = createMockSession({status: 'active'});
      expect(isSessionCompleted(session)).toBe(false);
    });
  });

  describe('isSessionInterrupted', () => {
    it('should return true for interrupted session', () => {
      const session = createMockSession({status: 'interrupted'});
      expect(isSessionInterrupted(session)).toBe(true);
    });

    it('should return false for completed session', () => {
      const session = createMockSession({status: 'completed'});
      expect(isSessionInterrupted(session)).toBe(false);
    });
  });

  describe('meetsMinimumDuration', () => {
    it('should return true when session meets default minimum (60s)', () => {
      const session = createMockSession({
        durationSeconds: 60,
        endTime: new Date(),
      });

      expect(meetsMinimumDuration(session)).toBe(true);
    });

    it('should return false when session is below default minimum', () => {
      const session = createMockSession({
        durationSeconds: 59,
        endTime: new Date(),
      });

      expect(meetsMinimumDuration(session)).toBe(false);
    });

    it('should return true when session meets custom minimum', () => {
      const session = createMockSession({
        durationSeconds: 120,
        endTime: new Date(),
      });

      expect(meetsMinimumDuration(session, 120)).toBe(true);
    });

    it('should calculate duration for active session', () => {
      jest.useFakeTimers();

      const session = createMockSession({
        status: 'active',
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });

      jest.setSystemTime(new Date('2026-01-03T10:02:00.000Z'));

      expect(meetsMinimumDuration(session, 120)).toBe(true);

      jest.useRealTimers();
    });
  });

  // ==========================================================================
  // Session Statistics Tests
  // ==========================================================================

  describe('calculateTotalDuration', () => {
    it('should return 0 for empty array', () => {
      expect(calculateTotalDuration([])).toBe(0);
    });

    it('should calculate total duration for single session', () => {
      const sessions = [createMockSession({durationSeconds: 1500})];

      expect(calculateTotalDuration(sessions)).toBe(1500);
    });

    it('should calculate total duration for multiple sessions', () => {
      const sessions = [
        createMockSession({durationSeconds: 1500}),
        createMockSession({durationSeconds: 900}),
        createMockSession({durationSeconds: 600}),
      ];

      expect(calculateTotalDuration(sessions)).toBe(3000);
    });
  });

  describe('countCompletedSessions', () => {
    it('should return 0 for empty array', () => {
      expect(countCompletedSessions([])).toBe(0);
    });

    it('should count only completed sessions', () => {
      const sessions = [
        createMockSession({status: 'completed'}),
        createMockSession({status: 'interrupted'}),
        createMockSession({status: 'completed'}),
        createMockSession({status: 'active'}),
      ];

      expect(countCompletedSessions(sessions)).toBe(2);
    });
  });

  describe('countInterruptedSessions', () => {
    it('should return 0 for empty array', () => {
      expect(countInterruptedSessions([])).toBe(0);
    });

    it('should count only interrupted sessions', () => {
      const sessions = [
        createMockSession({status: 'completed'}),
        createMockSession({status: 'interrupted'}),
        createMockSession({status: 'interrupted'}),
        createMockSession({status: 'active'}),
      ];

      expect(countInterruptedSessions(sessions)).toBe(2);
    });
  });

  describe('countPomodoroSessions', () => {
    it('should return 0 for empty array', () => {
      expect(countPomodoroSessions([])).toBe(0);
    });

    it('should count only pomodoro sessions', () => {
      const sessions = [
        createMockSession({mode: 'pomodoro'}),
        createMockSession({mode: 'stopwatch'}),
        createMockSession({mode: 'pomodoro'}),
        createMockSession({mode: 'stopwatch'}),
      ];

      expect(countPomodoroSessions(sessions)).toBe(2);
    });
  });

  describe('calculateTotalPomodoros', () => {
    it('should return 0 for empty array', () => {
      expect(calculateTotalPomodoros([])).toBe(0);
    });

    it('should sum pomodorosCompleted from all sessions', () => {
      const sessions = [
        createMockSession({pomodorosCompleted: 4}),
        createMockSession({pomodorosCompleted: 2}),
        createMockSession({pomodorosCompleted: 3}),
      ];

      expect(calculateTotalPomodoros(sessions)).toBe(9);
    });

    it('should handle sessions with undefined pomodorosCompleted', () => {
      const sessions = [
        createMockSession({pomodorosCompleted: 4}),
        createMockSession({pomodorosCompleted: 0}),
      ];

      expect(calculateTotalPomodoros(sessions)).toBe(4);
    });
  });

  describe('countStopwatchSessions', () => {
    it('should return 0 for empty array', () => {
      expect(countStopwatchSessions([])).toBe(0);
    });

    it('should count only stopwatch sessions', () => {
      const sessions = [
        createMockSession({mode: 'pomodoro'}),
        createMockSession({mode: 'stopwatch'}),
        createMockSession({mode: 'stopwatch'}),
        createMockSession({mode: 'pomodoro'}),
      ];

      expect(countStopwatchSessions(sessions)).toBe(2);
    });
  });

  describe('getSessionsForTask', () => {
    it('should return empty array when no sessions match', () => {
      const sessions = [
        createMockSession({taskId: 'task_1'}),
        createMockSession({taskId: 'task_2'}),
      ];

      expect(getSessionsForTask(sessions, 'task_3')).toEqual([]);
    });

    it('should return sessions for specific task', () => {
      const sessions = [
        createMockSession({id: 'session_1', taskId: 'task_1'}),
        createMockSession({id: 'session_2', taskId: 'task_2'}),
        createMockSession({id: 'session_3', taskId: 'task_1'}),
      ];

      const result = getSessionsForTask(sessions, 'task_1');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('session_1');
      expect(result[1].id).toBe('session_3');
    });

    it('should handle sessions without taskId', () => {
      const sessions = [
        createMockSession({taskId: 'task_1'}),
        createMockSession({taskId: undefined}),
      ];

      expect(getSessionsForTask(sessions, 'task_1')).toHaveLength(1);
    });
  });

  describe('calculateCompletionRate', () => {
    it('should return 0 for empty array', () => {
      expect(calculateCompletionRate([])).toBe(0);
    });

    it('should calculate completion rate as percentage', () => {
      const sessions = [
        createMockSession({status: 'completed'}),
        createMockSession({status: 'completed'}),
        createMockSession({status: 'interrupted'}),
        createMockSession({status: 'interrupted'}),
      ];

      expect(calculateCompletionRate(sessions)).toBe(50);
    });

    it('should round to nearest integer', () => {
      const sessions = [
        createMockSession({status: 'completed'}),
        createMockSession({status: 'interrupted'}),
        createMockSession({status: 'interrupted'}),
      ];

      expect(calculateCompletionRate(sessions)).toBe(33); // 33.33% rounded
    });

    it('should return 100 for all completed sessions', () => {
      const sessions = [
        createMockSession({status: 'completed'}),
        createMockSession({status: 'completed'}),
      ];

      expect(calculateCompletionRate(sessions)).toBe(100);
    });

    it('should return 0 for no completed sessions', () => {
      const sessions = [
        createMockSession({status: 'interrupted'}),
        createMockSession({status: 'active'}),
      ];

      expect(calculateCompletionRate(sessions)).toBe(0);
    });
  });
});
