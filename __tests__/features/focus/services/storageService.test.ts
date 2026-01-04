/**
 * Unit tests for storageService
 *
 * Tests all AsyncStorage operations for Focus feature including
 * settings, sessions, and current session management.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveFocusSettings,
  loadFocusSettings,
  saveFocusSession,
  loadFocusSessions,
  getTodaySessions,
  clearAllSessions,
  saveCurrentSession,
  loadCurrentSession,
  clearAllFocusData,
  getStorageStats,
} from '../../../../src/features/focus/services/storageService';
import {FocusSettings, FocusSession, StorageKeys} from '../../../../src/features/focus/types/focus.types';
import {DEFAULT_FOCUS_SETTINGS} from '../../../../src/features/focus/constants/defaults';

// ============================================================================
// Test Helpers
// ============================================================================

const createMockSettings = (overrides?: Partial<FocusSettings>): FocusSettings => ({
  pomoWorkDuration: 25,
  pomoShortBreak: 5,
  pomoLongBreak: 15,
  pomosBeforeLongBreak: 4,
  maxPausesPerSession: 3,
  confirmStop: true,
  ...overrides,
});

const createMockSession = (overrides?: Partial<FocusSession>): FocusSession => {
  const now = new Date('2026-01-03T10:00:00.000Z');
  return {
    id: 'session_123',
    userId: undefined,
    taskId: 'task_1',
    mode: 'pomodoro',
    startTime: now,
    endTime: undefined,
    durationSeconds: 1500,
    pausesCount: 0,
    pomodorosCompleted: 1,
    status: 'completed',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

// ============================================================================
// Settings Operations Tests
// ============================================================================

describe('storageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveFocusSettings', () => {
    it('should save settings to AsyncStorage', async () => {
      const settings = createMockSettings();

      await saveFocusSettings(settings);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.FOCUS_SETTINGS,
        JSON.stringify(settings),
      );
    });

    it('should save custom settings', async () => {
      const settings = createMockSettings({
        pomoWorkDuration: 30,
        pomoShortBreak: 10,
      });

      await saveFocusSettings(settings);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.FOCUS_SETTINGS,
        JSON.stringify(settings),
      );
    });

    it('should throw error when AsyncStorage fails', async () => {
      const settings = createMockSettings();
      const error = new Error('Storage full');

      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(saveFocusSettings(settings)).rejects.toThrow(
        'Failed to save Focus settings',
      );
    });

    it('should log error when AsyncStorage fails', async () => {
      const settings = createMockSettings();
      const error = new Error('Storage full');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(saveFocusSettings(settings)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving Focus settings:',
        error,
      );
    });
  });

  describe('loadFocusSettings', () => {
    it('should load settings from AsyncStorage', async () => {
      const settings = createMockSettings();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(settings),
      );

      const result = await loadFocusSettings();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        StorageKeys.FOCUS_SETTINGS,
      );
      expect(result).toEqual(settings);
    });

    it('should return default settings when no settings saved', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await loadFocusSettings();

      expect(result).toEqual(DEFAULT_FOCUS_SETTINGS);
    });

    it('should return default settings on parse error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json');

      const result = await loadFocusSettings();

      expect(result).toEqual(DEFAULT_FOCUS_SETTINGS);
    });

    it('should return default settings on AsyncStorage error', async () => {
      const error = new Error('Storage error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      const result = await loadFocusSettings();

      expect(result).toEqual(DEFAULT_FOCUS_SETTINGS);
    });

    it('should log error on failure', async () => {
      const error = new Error('Storage error');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      await loadFocusSettings();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading Focus settings:',
        error,
      );
    });
  });

  // ==========================================================================
  // Session Operations Tests
  // ==========================================================================

  describe('saveFocusSession', () => {
    it('should save new session to empty storage', async () => {
      const session = createMockSession();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await saveFocusSession(session);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.FOCUS_SESSIONS,
        JSON.stringify([session]),
      );
    });

    it('should prepend new session to existing sessions', async () => {
      const existingSession = createMockSession({id: 'session_old'});
      const newSession = createMockSession({id: 'session_new'});

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([existingSession]),
      );

      await saveFocusSession(newSession);

      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const savedSessions = JSON.parse(savedData);

      expect(savedSessions).toHaveLength(2);
      expect(savedSessions[0].id).toBe('session_new');
      expect(savedSessions[1].id).toBe('session_old');
    });

    it('should throw error when save fails', async () => {
      const session = createMockSession();
      const error = new Error('Storage full');

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(saveFocusSession(session)).rejects.toThrow(
        'Failed to save Focus session',
      );
    });

    it('should log error when save fails', async () => {
      const session = createMockSession();
      const error = new Error('Storage full');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(saveFocusSession(session)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving Focus session:',
        error,
      );
    });
  });

  describe('loadFocusSessions', () => {
    it('should return empty array when no sessions saved', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await loadFocusSessions();

      expect(result).toEqual([]);
    });

    it('should load sessions from AsyncStorage', async () => {
      const sessions = [
        createMockSession({id: 'session_1'}),
        createMockSession({id: 'session_2'}),
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(sessions),
      );

      const result = await loadFocusSessions();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('session_1');
      expect(result[1].id).toBe('session_2');
    });

    it('should convert date strings to Date objects', async () => {
      const session = createMockSession();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([session]),
      );

      const result = await loadFocusSessions();

      expect(result[0].startTime).toBeInstanceOf(Date);
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should handle sessions with endTime', async () => {
      const session = createMockSession({
        endTime: new Date('2026-01-03T10:25:00.000Z'),
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([session]),
      );

      const result = await loadFocusSessions();

      expect(result[0].endTime).toBeInstanceOf(Date);
    });

    it('should handle sessions without endTime', async () => {
      const session = createMockSession({endTime: undefined});

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([session]),
      );

      const result = await loadFocusSessions();

      expect(result[0].endTime).toBeUndefined();
    });

    it('should apply limit when specified', async () => {
      const sessions = [
        createMockSession({id: 'session_1'}),
        createMockSession({id: 'session_2'}),
        createMockSession({id: 'session_3'}),
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(sessions),
      );

      const result = await loadFocusSessions(2);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('session_1');
      expect(result[1].id).toBe('session_2');
    });

    it('should ignore limit when 0 or negative', async () => {
      const sessions = [
        createMockSession({id: 'session_1'}),
        createMockSession({id: 'session_2'}),
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(sessions),
      );

      const result = await loadFocusSessions(0);

      expect(result).toHaveLength(2);
    });

    it('should return empty array on parse error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json');

      const result = await loadFocusSessions();

      expect(result).toEqual([]);
    });

    it('should return empty array on AsyncStorage error', async () => {
      const error = new Error('Storage error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      const result = await loadFocusSessions();

      expect(result).toEqual([]);
    });

    it('should log error on failure', async () => {
      const error = new Error('Storage error');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      await loadFocusSessions();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading Focus sessions:',
        error,
      );
    });
  });

  describe('getTodaySessions', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-03T15:30:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return only sessions from today', async () => {
      const todaySession = createMockSession({
        id: 'today',
        startTime: new Date('2026-01-03T10:00:00.000Z'),
      });
      const yesterdaySession = createMockSession({
        id: 'yesterday',
        startTime: new Date('2026-01-02T10:00:00.000Z'),
      });
      const tomorrowSession = createMockSession({
        id: 'tomorrow',
        startTime: new Date('2026-01-04T10:00:00.000Z'),
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([todaySession, yesterdaySession, tomorrowSession]),
      );

      const result = await getTodaySessions();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('today');
    });

    it('should return multiple sessions from today', async () => {
      const session1 = createMockSession({
        id: 'session_1',
        startTime: new Date('2026-01-03T08:00:00.000Z'),
      });
      const session2 = createMockSession({
        id: 'session_2',
        startTime: new Date('2026-01-03T14:00:00.000Z'),
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([session1, session2]),
      );

      const result = await getTodaySessions();

      expect(result).toHaveLength(2);
    });

    it('should return empty array when no sessions today', async () => {
      const yesterdaySession = createMockSession({
        startTime: new Date('2026-01-02T10:00:00.000Z'),
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([yesterdaySession]),
      );

      const result = await getTodaySessions();

      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      const error = new Error('Storage error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      const result = await getTodaySessions();

      expect(result).toEqual([]);
    });

    it('should log error on failure', async () => {
      const error = new Error('Storage error');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      await getTodaySessions();

      // getTodaySessions calls loadFocusSessions which logs the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading Focus sessions:',
        error,
      );
    });
  });

  describe('clearAllSessions', () => {
    it('should remove sessions from AsyncStorage', async () => {
      await clearAllSessions();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        StorageKeys.FOCUS_SESSIONS,
      );
    });

    it('should throw error when removal fails', async () => {
      const error = new Error('Storage error');

      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(clearAllSessions()).rejects.toThrow(
        'Failed to clear Focus sessions',
      );
    });

    it('should log error when removal fails', async () => {
      const error = new Error('Storage error');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(clearAllSessions()).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error clearing Focus sessions:',
        error,
      );
    });
  });

  // ==========================================================================
  // Current Session Operations Tests
  // ==========================================================================

  describe('saveCurrentSession', () => {
    it('should save current session to AsyncStorage', async () => {
      const session = createMockSession();

      await saveCurrentSession(session);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.CURRENT_SESSION,
        JSON.stringify(session),
      );
    });

    it('should remove current session when null', async () => {
      await saveCurrentSession(null);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        StorageKeys.CURRENT_SESSION,
      );
    });

    it('should throw error when save fails', async () => {
      const session = createMockSession();
      const error = new Error('Storage error');

      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(saveCurrentSession(session)).rejects.toThrow(
        'Failed to save current session',
      );
    });

    it('should throw error when remove fails', async () => {
      const error = new Error('Storage error');

      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(saveCurrentSession(null)).rejects.toThrow(
        'Failed to save current session',
      );
    });

    it('should log error on failure', async () => {
      const session = createMockSession();
      const error = new Error('Storage error');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(saveCurrentSession(session)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving current session:',
        error,
      );
    });
  });

  describe('loadCurrentSession', () => {
    it('should return null when no current session', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await loadCurrentSession();

      expect(result).toBeNull();
    });

    it('should load current session from AsyncStorage', async () => {
      const session = createMockSession();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(session),
      );

      const result = await loadCurrentSession();

      expect(result).not.toBeNull();
      expect(result?.id).toBe(session.id);
    });

    it('should convert date strings to Date objects', async () => {
      const session = createMockSession();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(session),
      );

      const result = await loadCurrentSession();

      expect(result?.startTime).toBeInstanceOf(Date);
      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle session with endTime', async () => {
      const session = createMockSession({
        endTime: new Date('2026-01-03T10:25:00.000Z'),
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(session),
      );

      const result = await loadCurrentSession();

      expect(result?.endTime).toBeInstanceOf(Date);
    });

    it('should return null on parse error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json');

      const result = await loadCurrentSession();

      expect(result).toBeNull();
    });

    it('should return null on AsyncStorage error', async () => {
      const error = new Error('Storage error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      const result = await loadCurrentSession();

      expect(result).toBeNull();
    });

    it('should log error on failure', async () => {
      const error = new Error('Storage error');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      await loadCurrentSession();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading current session:',
        error,
      );
    });
  });

  // ==========================================================================
  // Utility Functions Tests
  // ==========================================================================

  describe('clearAllFocusData', () => {
    it('should remove all Focus data from AsyncStorage', async () => {
      await clearAllFocusData();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        StorageKeys.FOCUS_SETTINGS,
        StorageKeys.FOCUS_SESSIONS,
        StorageKeys.CURRENT_SESSION,
      ]);
    });

    it('should throw error when removal fails', async () => {
      const error = new Error('Storage error');

      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValueOnce(error);

      await expect(clearAllFocusData()).rejects.toThrow(
        'Failed to clear all Focus data',
      );
    });

    it('should log error on failure', async () => {
      const error = new Error('Storage error');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValueOnce(error);

      await expect(clearAllFocusData()).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error clearing all Focus data:',
        error,
      );
    });
  });

  describe('getStorageStats', () => {
    it('should return stats for all stored data', async () => {
      const settings = createMockSettings();
      const sessions = [
        createMockSession({startTime: new Date('2026-01-03T10:00:00.000Z')}),
        createMockSession({startTime: new Date('2026-01-02T10:00:00.000Z')}),
      ];
      const currentSession = createMockSession();

      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-03T15:30:00.000Z'));

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(sessions)) // loadFocusSessions
        .mockResolvedValueOnce(JSON.stringify(sessions)) // getTodaySessions
        .mockResolvedValueOnce(JSON.stringify(settings)) // loadFocusSettings
        .mockResolvedValueOnce(JSON.stringify(currentSession)); // loadCurrentSession

      const result = await getStorageStats();

      expect(result).toEqual({
        totalSessions: 2,
        todaySessions: 1,
        hasSettings: true,
        hasCurrentSession: true,
      });

      jest.useRealTimers();
    });

    it('should return zero stats when no data', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getStorageStats();

      expect(result).toEqual({
        totalSessions: 0,
        todaySessions: 0,
        hasSettings: true, // Returns default settings
        hasCurrentSession: false,
      });
    });

    it('should return zero stats on error', async () => {
      const error = new Error('Storage error');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

      const result = await getStorageStats();

      expect(result).toEqual({
        totalSessions: 0,
        todaySessions: 0,
        hasSettings: true, // loadFocusSettings returns default settings on error
        hasCurrentSession: false,
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
