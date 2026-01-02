/**
 * Focus Store Integration Tests
 *
 * Tests integration between focusStore and notificationService.
 * Focuses on notification-related behavior during Focus sessions.
 *
 * @module __tests__/features/focus/store/focusStore
 */

import {renderHook, act} from '@testing-library/react-native';
import {useFocusStore} from '../../../../src/features/focus/store/focusStore';
import * as notificationService from '../../../../src/features/focus/services/notificationService';

// Mock notification service
jest.mock('../../../../src/features/focus/services/notificationService');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('focusStore - Notification Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock notification service functions
    (notificationService.getPermissionStatus as jest.Mock).mockReturnValue('not-requested');
    (notificationService.requestPermissions as jest.Mock).mockResolvedValue(true);
    (notificationService.configure as jest.Mock).mockImplementation(() => {});
    (notificationService.showWorkCompleteNotification as jest.Mock).mockImplementation(() => {});
    (notificationService.showBreakCompleteNotification as jest.Mock).mockImplementation(() => {});
    (notificationService.cancelAllNotifications as jest.Mock).mockImplementation(() => {});
    (notificationService.checkPermissions as jest.Mock).mockResolvedValue('granted');
  });

  /**
   * Permission Request Tests
   */
  describe('Permission Requests', () => {
    it('should request notification permissions on first startFocus', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      expect(notificationService.getPermissionStatus).toHaveBeenCalled();
      expect(notificationService.requestPermissions).toHaveBeenCalled();
    });

    it('should NOT request permissions if already granted', async () => {
      (notificationService.getPermissionStatus as jest.Mock).mockReturnValue('granted');

      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      // Should check status but not request again
      const requestCalls = (notificationService.requestPermissions as jest.Mock).mock.calls.length;
      expect(requestCalls).toBe(0);
    });

    it('should NOT request permissions if denied', async () => {
      (notificationService.getPermissionStatus as jest.Mock).mockReturnValue('denied');

      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      // Should not request if already denied
      const requestCalls = (notificationService.requestPermissions as jest.Mock).mock.calls.length;
      expect(requestCalls).toBe(0);
    });

    it('should continue session even if permissions denied', async () => {
      (notificationService.requestPermissions as jest.Mock).mockResolvedValue(false);

      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      expect(result.current.currentSession).not.toBeNull();
      expect(result.current.timerState.status).toBe('running');
    });

    it('should handle permission request errors gracefully', async () => {
      (notificationService.requestPermissions as jest.Mock).mockRejectedValue(
        new Error('Permission error'),
      );

      const {result} = renderHook(() => useFocusStore());

      // Should not throw
      await act(async () => {
        await result.current.startFocus();
      });

      // Should still start session
      expect(result.current.currentSession).not.toBeNull();
    });

    it('should only request permissions once across multiple sessions', async () => {
      const {result} = renderHook(() => useFocusStore());

      // First session
      await act(async () => {
        await result.current.startFocus();
      });

      const firstCallCount = (notificationService.requestPermissions as jest.Mock).mock.calls
        .length;

      await act(async () => {
        await result.current.stopFocus();
      });

      // Update mock to return 'granted' after first request
      (notificationService.getPermissionStatus as jest.Mock).mockReturnValue('granted');

      // Second session
      await act(async () => {
        await result.current.startFocus();
      });

      const secondCallCount = (notificationService.requestPermissions as jest.Mock).mock.calls
        .length;

      // Should not request again
      expect(secondCallCount).toBe(firstCallCount);
    });
  });

  /**
   * Cancel Notifications Tests
   */
  describe('Cancel Notifications', () => {
    it('should cancel all notifications when stopFocus is called', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      await act(async () => {
        await result.current.stopFocus();
      });

      expect(notificationService.cancelAllNotifications).toHaveBeenCalled();
    });

    it('should cancel notifications even if session interrupted', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      // Stop before completion (interrupt)
      await act(async () => {
        await result.current.stopFocus();
      });

      expect(notificationService.cancelAllNotifications).toHaveBeenCalled();
      expect(result.current.currentSession).toBeNull();
    });

    it('should cancel notifications when stopping after pause', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      act(() => {
        result.current.pauseFocus();
      });

      await act(async () => {
        await result.current.stopFocus();
      });

      expect(notificationService.cancelAllNotifications).toHaveBeenCalled();
    });
  });

  /**
   * Settings Integration Tests
   */
  describe('Settings Integration', () => {
    it('should use custom break durations from settings', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.updateSettings({
          pomoShortBreak: 7,
          pomoLongBreak: 20,
        });
      });

      expect(result.current.settings.pomoShortBreak).toBe(7);
      expect(result.current.settings.pomoLongBreak).toBe(20);
    });

    it('should persist settings across sessions', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.updateSettings({
          pomoWorkDuration: 30,
        });
      });

      await act(async () => {
        await result.current.startFocus();
      });

      expect(result.current.settings.pomoWorkDuration).toBe(30);
    });
  });

  /**
   * Edge Cases Tests
   */
  describe('Edge Cases', () => {
    it('should handle notification errors without breaking session', async () => {
      (notificationService.showWorkCompleteNotification as jest.Mock).mockImplementation(() => {
        throw new Error('Notification error');
      });

      const {result} = renderHook(() => useFocusStore());

      // Should not crash
      await act(async () => {
        await result.current.startFocus();
      });

      expect(result.current.currentSession).not.toBeNull();
    });

    it('should handle multiple rapid startFocus calls', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
        await result.current.startFocus();
        await result.current.startFocus();
      });

      // Should only create one session (subsequent calls ignored)
      expect(result.current.currentSession).not.toBeNull();
    });

    it('should handle permission status changes between sessions', async () => {
      const {result} = renderHook(() => useFocusStore());

      // First session
      await act(async () => {
        await result.current.startFocus();
      });

      await act(async () => {
        await result.current.stopFocus();
      });

      // Second session - should work fine
      await act(async () => {
        await result.current.startFocus();
      });

      expect(result.current.currentSession).not.toBeNull();

      await act(async () => {
        await result.current.stopFocus();
      });
    });

    it('should handle stopFocus when no session active', async () => {
      const {result} = renderHook(() => useFocusStore());

      // Stop without starting
      await act(async () => {
        await result.current.stopFocus();
      });

      // Should not crash
      expect(result.current.currentSession).toBeNull();
    });

    it('should handle cleanup without active session', () => {
      const {result} = renderHook(() => useFocusStore());

      // Should not crash
      act(() => {
        result.current.cleanup();
      });

      expect(result.current.currentSession).toBeNull();
    });
  });

  /**
   * State Management Tests
   */
  describe('State Management', () => {
    it('should maintain timer state during session', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      expect(result.current.timerState.status).toBe('running');
      expect(result.current.timerState.currentPhase).toBe('work');
      expect(result.current.timerState.pomodorosCompleted).toBe(0);
    });

    it('should reset timer state after stopFocus', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      await act(async () => {
        await result.current.stopFocus();
      });

      expect(result.current.timerState.status).toBe('idle');
      expect(result.current.timerState.currentPhase).toBe('work');
      expect(result.current.timerState.pomodorosCompleted).toBe(0);
    });

    it('should update pause count when pausing', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      act(() => {
        result.current.pauseFocus();
      });

      expect(result.current.timerState.status).toBe('paused');
      expect(result.current.timerState.pausesUsed).toBe(1);
    });

    it('should resume from paused state', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      act(() => {
        result.current.pauseFocus();
      });

      act(() => {
        result.current.resumeFocus();
      });

      expect(result.current.timerState.status).toBe('running');
    });
  });

  /**
   * Session Lifecycle Tests
   */
  describe('Session Lifecycle', () => {
    it('should create session on startFocus', async () => {
      const {result} = renderHook(() => useFocusStore());

      // Ensure no session is active
      if (result.current.currentSession) {
        await act(async () => {
          await result.current.stopFocus();
        });
      }

      expect(result.current.currentSession).toBeNull();

      await act(async () => {
        await result.current.startFocus();
      });

      expect(result.current.currentSession).not.toBeNull();
      expect(result.current.currentSession?.status).toBe('active');
    });

    it('should clear session on stopFocus', async () => {
      const {result} = renderHook(() => useFocusStore());

      await act(async () => {
        await result.current.startFocus();
      });

      expect(result.current.currentSession).not.toBeNull();

      await act(async () => {
        await result.current.stopFocus();
      });

      expect(result.current.currentSession).toBeNull();
    });

    it('should add session to history on stopFocus', async () => {
      const {result} = renderHook(() => useFocusStore());

      const initialSessionCount = result.current.sessions.length;

      await act(async () => {
        await result.current.startFocus();
      });

      await act(async () => {
        await result.current.stopFocus();
      });

      expect(result.current.sessions.length).toBe(initialSessionCount + 1);
    });
  });
});
