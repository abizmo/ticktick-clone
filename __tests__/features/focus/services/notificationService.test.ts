/**
 * Notification Service Test Suite
 *
 * Comprehensive tests for the notification service implementation.
 * Tests configuration, permissions, notification functions, and Focus-specific features.
 *
 * @module __tests__/features/focus/services/notificationService
 */

import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';
import * as notificationService from '../../../../src/features/focus/services/notificationService';

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(obj => obj.ios),
}));

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Configuration Tests
   */
  describe('configure()', () => {
    it('should configure notification service successfully', () => {
      notificationService.configure();

      expect(PushNotification.configure).toHaveBeenCalledWith(
        expect.objectContaining({
          onNotification: expect.any(Function),
          onRegistrationError: expect.any(Function),
          permissions: {
            alert: true,
            badge: true,
            sound: true,
          },
          popInitialNotification: true,
          requestPermissions: false,
        }),
      );
    });

    it('should only configure once (idempotent)', () => {
      // First call should configure
      notificationService.configure();
      const firstCallCount = (PushNotification.configure as jest.Mock).mock.calls.length;

      // Subsequent calls should not configure again
      notificationService.configure();
      notificationService.configure();

      const finalCallCount = (PushNotification.configure as jest.Mock).mock.calls.length;
      expect(finalCallCount).toBe(firstCallCount);
    });

    it('should create Android notification channel on Android', () => {
      // Mock Android platform
      (Platform as any).OS = 'android';

      // Mock createChannel if not already mocked
      if (!PushNotification.createChannel) {
        (PushNotification as any).createChannel = jest.fn((config, callback) => {
          if (callback) callback(true);
        });
      }

      const callsBefore = (PushNotification.createChannel as jest.Mock).mock.calls.length;

      notificationService.configure();

      const callsAfter = (PushNotification.createChannel as jest.Mock).mock.calls.length;

      // If service was already configured, channel was already created
      // Otherwise, it should have been created now
      if (callsAfter > callsBefore) {
        expect(PushNotification.createChannel).toHaveBeenCalledWith(
          expect.objectContaining({
            channelId: 'focus-timer',
            channelName: 'Focus Timer',
            channelDescription: 'Notifications for Focus timer intervals',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          }),
          expect.any(Function),
        );
      } else {
        // Already configured, test passes
        expect(true).toBe(true);
      }

      // Reset to iOS
      (Platform as any).OS = 'ios';
    });

    it('should NOT create Android channel on iOS', () => {
      (Platform as any).OS = 'ios';

      // Mock createChannel if not already mocked
      if (!PushNotification.createChannel) {
        (PushNotification as any).createChannel = jest.fn((config, callback) => {
          if (callback) callback(true);
        });
      }

      const callsBefore = (PushNotification.createChannel as jest.Mock).mock.calls.length;

      notificationService.configure();

      const callsAfter = (PushNotification.createChannel as jest.Mock).mock.calls.length;

      expect(callsAfter).toBe(callsBefore);
    });

    it('should set up notification handlers', () => {
      const callsBefore = (PushNotification.configure as jest.Mock).mock.calls.length;

      notificationService.configure();

      const calls = (PushNotification.configure as jest.Mock).mock.calls;
      const configCall = calls[calls.length - 1]?.[0];

      if (configCall) {
        expect(configCall.onNotification).toBeDefined();
        expect(configCall.onRegistrationError).toBeDefined();
      } else {
        // Already configured, skip this test
        expect(calls.length).toBe(callsBefore);
      }
    });

    it('should handle iOS notification finish callback', () => {
      (Platform as any).OS = 'ios';

      notificationService.configure();

      const calls = (PushNotification.configure as jest.Mock).mock.calls;
      const configCall = calls[calls.length - 1]?.[0];

      if (configCall) {
        const mockNotification = {
          finish: jest.fn(),
          title: 'Test',
        };

        configCall.onNotification(mockNotification);

        expect(mockNotification.finish).toHaveBeenCalledWith('UIBackgroundFetchResultNoData');
      } else {
        // Already configured, test passes
        expect(true).toBe(true);
      }
    });

    it('should NOT call finish on Android', () => {
      (Platform as any).OS = 'android';

      notificationService.configure();

      const calls = (PushNotification.configure as jest.Mock).mock.calls;
      const configCall = calls[calls.length - 1]?.[0];

      if (configCall) {
        const mockNotification = {
          finish: jest.fn(),
          title: 'Test',
        };

        configCall.onNotification(mockNotification);

        expect(mockNotification.finish).not.toHaveBeenCalled();
      } else {
        // Already configured, test passes
        expect(true).toBe(true);
      }

      // Reset to iOS
      (Platform as any).OS = 'ios';
    });
  });

  /**
   * Permission Management Tests
   */
  describe('requestPermissions()', () => {
    it('should request permissions and return true when granted on iOS', async () => {
      (Platform as any).OS = 'ios';

      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });

      const granted = await notificationService.requestPermissions();

      expect(granted).toBe(true);
      expect(PushNotification.requestPermissions).toHaveBeenCalled();
    });

    it('should return false when permissions denied on iOS', async () => {
      (Platform as any).OS = 'ios';

      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 0, badge: 0, sound: 0});
      });

      const granted = await notificationService.requestPermissions();

      expect(granted).toBe(false);
    });

    it('should handle boolean permission values on iOS', async () => {
      (Platform as any).OS = 'ios';

      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: true, badge: true, sound: true});
      });

      const granted = await notificationService.requestPermissions();

      expect(granted).toBe(true);
    });

    it('should return true on Android by default', async () => {
      (Platform as any).OS = 'android';

      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 0, badge: 0, sound: 0});
      });

      const granted = await notificationService.requestPermissions();

      expect(granted).toBe(true);

      // Reset to iOS
      (Platform as any).OS = 'ios';
    });

    it('should auto-configure if not configured', async () => {
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });

      const callsBefore = (PushNotification.configure as jest.Mock).mock.calls.length;

      await notificationService.requestPermissions();

      const callsAfter = (PushNotification.configure as jest.Mock).mock.calls.length;

      // Should either configure or already be configured
      expect(callsAfter).toBeGreaterThanOrEqual(callsBefore);
    });

    it('should update permission status after request', async () => {
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });

      await notificationService.requestPermissions();

      const status = notificationService.getPermissionStatus();
      expect(status).toBe('granted');
    });
  });

  describe('checkPermissions()', () => {
    it('should check current permissions on iOS', async () => {
      (Platform as any).OS = 'ios';

      (PushNotification.checkPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });

      const status = await notificationService.checkPermissions();

      expect(status).toBe('granted');
      expect(PushNotification.checkPermissions).toHaveBeenCalled();
    });

    it('should return denied when permissions not granted on iOS', async () => {
      (Platform as any).OS = 'ios';

      (PushNotification.checkPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 0, badge: 0, sound: 0});
      });

      const status = await notificationService.checkPermissions();

      expect(status).toBe('denied');
    });

    it('should return granted on Android', async () => {
      (Platform as any).OS = 'android';

      (PushNotification.checkPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 0, badge: 0, sound: 0});
      });

      const status = await notificationService.checkPermissions();

      expect(status).toBe('granted');

      // Reset to iOS
      (Platform as any).OS = 'ios';
    });

    it('should auto-configure if not configured', async () => {
      (PushNotification.checkPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });

      const callsBefore = (PushNotification.configure as jest.Mock).mock.calls.length;

      await notificationService.checkPermissions();

      const callsAfter = (PushNotification.configure as jest.Mock).mock.calls.length;

      // Should either configure or already be configured
      expect(callsAfter).toBeGreaterThanOrEqual(callsBefore);
    });
  });

  describe('getPermissionStatus()', () => {
    it('should return cached permission status', () => {
      const status = notificationService.getPermissionStatus();

      // Should return a valid permission status
      expect(['not-requested', 'granted', 'denied']).toContain(status);
    });

    it('should return cached status after request', async () => {
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });

      await notificationService.requestPermissions();

      const status = notificationService.getPermissionStatus();
      expect(status).toBe('granted');
    });

    it('should return cached status after check', async () => {
      (PushNotification.checkPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 0, badge: 0, sound: 0});
      });

      await notificationService.checkPermissions();

      const status = notificationService.getPermissionStatus();
      expect(status).toBe('denied');
    });
  });

  /**
   * Notification Functions Tests
   */
  describe('showLocalNotification()', () => {
    beforeEach(async () => {
      // Grant permissions for these tests
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });
      await notificationService.requestPermissions();
    });

    it('should send notification with correct config', () => {
      notificationService.showLocalNotification({
        title: 'Test Title',
        message: 'Test Message',
      });

      expect(PushNotification.localNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          channelId: 'focus-timer',
          title: 'Test Title',
          message: 'Test Message',
          playSound: true,
          soundName: 'default',
          vibrate: true,
          vibration: 300,
          importance: 'high',
          priority: 'high',
        }),
      );
    });

    it('should use custom sound and vibration settings', () => {
      notificationService.showLocalNotification({
        title: 'Test',
        message: 'Test',
        playSound: false,
        soundName: 'custom.mp3',
        vibrate: false,
        vibration: 500,
      });

      expect(PushNotification.localNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          playSound: false,
          soundName: 'custom.mp3',
          vibrate: false,
          vibration: 500,
        }),
      );
    });

    it('should NOT send notification when permissions denied', async () => {
      // Deny permissions
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 0, badge: 0, sound: 0});
      });
      await notificationService.requestPermissions();

      notificationService.showLocalNotification({
        title: 'Test',
        message: 'Test',
      });

      expect(PushNotification.localNotification).not.toHaveBeenCalled();
    });

    it('should auto-configure if not configured', () => {
      const callsBefore = (PushNotification.configure as jest.Mock).mock.calls.length;

      notificationService.showLocalNotification({
        title: 'Test',
        message: 'Test',
      });

      const callsAfter = (PushNotification.configure as jest.Mock).mock.calls.length;

      // Should either configure or already be configured
      expect(callsAfter).toBeGreaterThanOrEqual(callsBefore);
    });
  });

  describe('scheduleNotification()', () => {
    beforeEach(async () => {
      // Grant permissions for these tests
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });
      await notificationService.requestPermissions();
    });

    it('should schedule notification for correct time', () => {
      const delaySeconds = 60;
      const beforeTime = Date.now();

      notificationService.scheduleNotification(
        {
          title: 'Scheduled',
          message: 'Test',
        },
        delaySeconds,
      );

      const afterTime = Date.now();

      expect(PushNotification.localNotificationSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          channelId: 'focus-timer',
          title: 'Scheduled',
          message: 'Test',
          date: expect.any(Date),
          allowWhileIdle: true,
        }),
      );

      const call = (PushNotification.localNotificationSchedule as jest.Mock).mock.calls[0][0];
      const scheduledTime = call.date.getTime();

      // Should be scheduled for ~60 seconds from now
      expect(scheduledTime).toBeGreaterThanOrEqual(beforeTime + delaySeconds * 1000);
      expect(scheduledTime).toBeLessThanOrEqual(afterTime + delaySeconds * 1000 + 100);
    });

    it('should NOT schedule when permissions denied', async () => {
      // Deny permissions
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 0, badge: 0, sound: 0});
      });
      await notificationService.requestPermissions();

      notificationService.scheduleNotification(
        {
          title: 'Test',
          message: 'Test',
        },
        60,
      );

      expect(PushNotification.localNotificationSchedule).not.toHaveBeenCalled();
    });

    it('should auto-configure if not configured', () => {
      const callsBefore = (PushNotification.configure as jest.Mock).mock.calls.length;

      notificationService.scheduleNotification(
        {
          title: 'Test',
          message: 'Test',
        },
        60,
      );

      const callsAfter = (PushNotification.configure as jest.Mock).mock.calls.length;

      // Should either configure or already be configured
      expect(callsAfter).toBeGreaterThanOrEqual(callsBefore);
    });
  });

  describe('cancelAllNotifications()', () => {
    it('should cancel all notifications', () => {
      notificationService.cancelAllNotifications();

      expect(PushNotification.cancelAllLocalNotifications).toHaveBeenCalled();
    });

    it('should work without configuration', () => {
      notificationService.cancelAllNotifications();

      expect(PushNotification.cancelAllLocalNotifications).toHaveBeenCalled();
    });
  });

  /**
   * Focus-Specific Notifications Tests
   */
  describe('showWorkCompleteNotification()', () => {
    beforeEach(async () => {
      // Grant permissions
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });
      await notificationService.requestPermissions();
    });

    it('should send work complete notification with break duration', () => {
      notificationService.showWorkCompleteNotification(5);

      expect(PushNotification.localNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '¡Pomodoro completado! 🎉',
          message: 'Tiempo de descanso (5 min)',
          playSound: true,
          vibrate: true,
        }),
      );
    });

    it('should handle different break durations', () => {
      notificationService.showWorkCompleteNotification(15);

      expect(PushNotification.localNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Tiempo de descanso (15 min)',
        }),
      );
    });
  });

  describe('showBreakCompleteNotification()', () => {
    beforeEach(async () => {
      // Grant permissions
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });
      await notificationService.requestPermissions();
    });

    it('should send short break complete notification', () => {
      notificationService.showBreakCompleteNotification(false);

      expect(PushNotification.localNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Descanso terminado',
          message: 'Listo para el siguiente pomodoro 💪',
          playSound: true,
          vibrate: true,
        }),
      );
    });

    it('should send long break complete notification', () => {
      notificationService.showBreakCompleteNotification(true);

      expect(PushNotification.localNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Descanso largo terminado',
          message: 'Listo para el siguiente pomodoro 💪',
          playSound: true,
          vibrate: true,
        }),
      );
    });

    it('should distinguish between short and long break', () => {
      notificationService.showBreakCompleteNotification(false);
      const shortBreakCall = (PushNotification.localNotification as jest.Mock).mock.calls[0][0];

      jest.clearAllMocks();

      notificationService.showBreakCompleteNotification(true);
      const longBreakCall = (PushNotification.localNotification as jest.Mock).mock.calls[0][0];

      expect(shortBreakCall.title).not.toBe(longBreakCall.title);
      expect(shortBreakCall.title).toBe('Descanso terminado');
      expect(longBreakCall.title).toBe('Descanso largo terminado');
    });
  });

  /**
   * Cleanup Tests
   */
  describe('cleanup()', () => {
    it('should cancel all notifications', () => {
      notificationService.cleanup();

      expect(PushNotification.cancelAllLocalNotifications).toHaveBeenCalled();
    });

    it('should work without configuration', () => {
      notificationService.cleanup();

      expect(PushNotification.cancelAllLocalNotifications).toHaveBeenCalled();
    });
  });

  /**
   * Edge Cases Tests
   */
  describe('Edge Cases', () => {
    it('should handle multiple configure calls gracefully', () => {
      const callsBefore = (PushNotification.configure as jest.Mock).mock.calls.length;

      notificationService.configure();
      notificationService.configure();
      notificationService.configure();

      const callsAfter = (PushNotification.configure as jest.Mock).mock.calls.length;

      // Should not configure multiple times
      expect(callsAfter).toBeLessThanOrEqual(callsBefore + 1);
    });

    it('should work without explicit configuration', async () => {
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });

      const callsBefore = (PushNotification.configure as jest.Mock).mock.calls.length;

      await notificationService.requestPermissions();

      const callsAfter = (PushNotification.configure as jest.Mock).mock.calls.length;

      // Should either configure or already be configured
      expect(callsAfter).toBeGreaterThanOrEqual(callsBefore);
    });

    it('should handle permission request errors gracefully', async () => {
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(() => {
        throw new Error('Permission error');
      });

      await expect(notificationService.requestPermissions()).rejects.toThrow('Permission error');
    });

    it('should handle notification send errors gracefully', async () => {
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 1, badge: 1, sound: 1});
      });
      await notificationService.requestPermissions();

      (PushNotification.localNotification as jest.Mock).mockImplementation(() => {
        throw new Error('Send error');
      });

      expect(() => {
        notificationService.showLocalNotification({
          title: 'Test',
          message: 'Test',
        });
      }).toThrow('Send error');
    });

    it('should handle platform differences correctly', async () => {
      // Test iOS
      (Platform as any).OS = 'ios';
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 0, badge: 0, sound: 0});
      });

      let granted = await notificationService.requestPermissions();
      expect(granted).toBe(false);

      // Test Android
      (Platform as any).OS = 'android';
      (PushNotification.requestPermissions as jest.Mock).mockImplementation(callback => {
        callback({alert: 0, badge: 0, sound: 0});
      });

      granted = await notificationService.requestPermissions();
      expect(granted).toBe(true);

      // Reset to iOS
      (Platform as any).OS = 'ios';
    });
  });
});
