/**
 * Notification Service
 *
 * Handles local notifications for the Focus feature.
 * Sends notifications when work intervals and breaks complete.
 *
 * Features:
 * - Request notification permissions
 * - Show local notifications
 * - Schedule notifications
 * - Cancel notifications
 * - Handle permission states
 *
 * Platform Support:
 * - Android: API 33+ (requires POST_NOTIFICATIONS permission)
 * - iOS: Requires user authorization
 *
 * Limitations:
 * - Notifications work best when app is in foreground or recently backgrounded
 * - Background timer execution is limited by OS (iOS: ~30s, Android: variable)
 * - For true background support, would need Headless JS (Android) or Background Modes (iOS)
 *
 * @module notificationService
 */

import PushNotification, {
  PushNotificationPermissions,
} from 'react-native-push-notification';
import {Platform} from 'react-native';

// ============================================================================
// Logger Utility
// ============================================================================

/**
 * Development-only logger
 * Prevents console.log statements in production builds
 */
const logger = {
  log: (...args: any[]): void => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  warn: (...args: any[]): void => {
    if (__DEV__) {
      console.warn(...args);
    }
  },
  error: (...args: any[]): void => {
    // Always log errors, even in production
    console.error(...args);
  },
};

// ============================================================================
// Types
// ============================================================================

/**
 * Notification permission status
 */
export type PermissionStatus = 'granted' | 'denied' | 'not-requested';

/**
 * Notification configuration
 */
interface NotificationConfig {
  title: string;
  message: string;
  playSound?: boolean;
  soundName?: string;
  vibrate?: boolean;
  vibration?: number;
}

// ============================================================================
// State
// ============================================================================

let isConfigured = false;
let permissionStatus: PermissionStatus = 'not-requested';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Configure the notification service
 *
 * Must be called once before using any notification functions.
 * Sets up notification channels (Android) and handlers.
 *
 * @example
 * ```typescript
 * import * as notificationService from './notificationService';
 *
 * // In App.tsx or index.js
 * notificationService.configure();
 * ```
 */
export const configure = (): void => {
  if (isConfigured) {
    logger.log('[NotificationService] Already configured');
    return;
  }

  PushNotification.configure({
    // Called when a notification is opened or received in foreground
    onNotification: notification => {
      logger.log('[NotificationService] Notification received:', notification);

      // Required on iOS only
      if (Platform.OS === 'ios') {
        notification.finish('UIBackgroundFetchResultNoData');
      }
    },

    // Called when user grants/denies permissions (iOS)
    onRegistrationError: err => {
      logger.error('[NotificationService] Registration error:', err);
    },

    // IOS ONLY: Permissions object
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically (default: true)
    popInitialNotification: true,

    // Request permissions on app start (iOS only)
    requestPermissions: false, // We'll request manually when user starts Focus
  });

  // Create notification channel (Android 8.0+)
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'focus-timer', // Required
        channelName: 'Focus Timer', // Required
        channelDescription: 'Notifications for Focus timer intervals',
        playSound: true,
        soundName: 'default',
        importance: 4, // High importance
        vibrate: true,
      },
      created => {
        if (created) {
          logger.log('[NotificationService] Android channel created');
        }
      },
    );
  }

  isConfigured = true;
  logger.log('[NotificationService] Configured successfully');
};

// ============================================================================
// Permission Management
// ============================================================================

/**
 * Request notification permissions
 *
 * On iOS, shows system permission dialog.
 * On Android 13+, shows permission dialog.
 * On Android <13, permissions are granted by default.
 *
 * @returns Promise that resolves to true if granted, false otherwise
 *
 * @example
 * ```typescript
 * const granted = await requestPermissions();
 * if (granted) {
 *   console.log('Notifications enabled');
 * } else {
 *   console.log('User denied notifications');
 * }
 * ```
 */
export const requestPermissions = async (): Promise<boolean> => {
  // Ensure service is configured
  if (!isConfigured) {
    configure();
  }

  return new Promise(resolve => {
    PushNotification.requestPermissions((permissions: PushNotificationPermissions) => {
      logger.log('[NotificationService] Permissions:', permissions);

      // Check if permissions were granted
      // iOS: Check alert permission explicitly
      // Android 13+ (API 33+): Requires explicit permission check
      // Android <13: Permissions granted by default
      const granted =
        Platform.OS === 'ios'
          ? permissions.alert === 1 || permissions.alert === true
          : Platform.Version >= 33
          ? permissions.alert === 1 || permissions.alert === true
          : true;

      permissionStatus = granted ? 'granted' : 'denied';

      logger.log(
        `[NotificationService] Permission ${granted ? 'granted' : 'denied'}`,
      );

      resolve(granted);
    });
  });
};

/**
 * Check current permission status
 *
 * @returns Promise that resolves to current permission status
 *
 * @example
 * ```typescript
 * const status = await checkPermissions();
 * console.log('Permission status:', status);
 * ```
 */
export const checkPermissions = async (): Promise<PermissionStatus> => {
  // Ensure service is configured
  if (!isConfigured) {
    configure();
  }

  return new Promise(resolve => {
    PushNotification.checkPermissions((permissions: PushNotificationPermissions) => {
      logger.log('[NotificationService] Current permissions:', permissions);

      // Determine status
      if (Platform.OS === 'ios') {
        const granted = permissions.alert === 1 || permissions.alert === true;
        permissionStatus = granted ? 'granted' : 'denied';
      } else {
        // Android: assume granted unless explicitly denied
        permissionStatus = 'granted';
      }

      resolve(permissionStatus);
    });
  });
};

/**
 * Get cached permission status (synchronous)
 *
 * @returns Current cached permission status
 */
export const getPermissionStatus = (): PermissionStatus => {
  return permissionStatus;
};

// ============================================================================
// Notification Functions
// ============================================================================

/**
 * Show a local notification immediately
 *
 * @param config - Notification configuration
 *
 * @example
 * ```typescript
 * showLocalNotification({
 *   title: '¡Pomodoro completado!',
 *   message: 'Tiempo de descanso (5 min)',
 *   playSound: true,
 *   vibrate: true,
 * });
 * ```
 */
export const showLocalNotification = (config: NotificationConfig): void => {
  // Ensure service is configured
  if (!isConfigured) {
    configure();
  }

  // Check permission status
  if (permissionStatus === 'denied') {
    logger.warn(
      '[NotificationService] Cannot show notification: permissions denied',
    );
    return;
  }

  PushNotification.localNotification({
    channelId: 'focus-timer', // Android only
    title: config.title,
    message: config.message,
    playSound: config.playSound ?? true,
    soundName: config.soundName ?? 'default',
    vibrate: config.vibrate ?? true,
    vibration: config.vibration ?? 300,
    importance: 'high', // Android only
    priority: 'high', // Android only
  });

  logger.log('[NotificationService] Notification sent:', config.title);
};

/**
 * Schedule a notification for later
 *
 * @param config - Notification configuration
 * @param delaySeconds - Delay in seconds before showing notification
 *
 * @example
 * ```typescript
 * // Schedule notification in 25 minutes
 * scheduleNotification(
 *   {
 *     title: 'Work interval complete',
 *     message: 'Time for a break!',
 *   },
 *   25 * 60
 * );
 * ```
 */
export const scheduleNotification = (
  config: NotificationConfig,
  delaySeconds: number,
): void => {
  // Ensure service is configured
  if (!isConfigured) {
    configure();
  }

  // Check permission status
  if (permissionStatus === 'denied') {
    logger.warn(
      '[NotificationService] Cannot schedule notification: permissions denied',
    );
    return;
  }

  const fireDate = new Date(Date.now() + delaySeconds * 1000);

  PushNotification.localNotificationSchedule({
    channelId: 'focus-timer', // Android only
    title: config.title,
    message: config.message,
    date: fireDate,
    playSound: config.playSound ?? true,
    soundName: config.soundName ?? 'default',
    vibrate: config.vibrate ?? true,
    vibration: config.vibration ?? 300,
    importance: 'high', // Android only
    priority: 'high', // Android only
    allowWhileIdle: true, // Android only - allow notification even in doze mode
  });

  logger.log(
    `[NotificationService] Notification scheduled for ${fireDate.toLocaleTimeString()}:`,
    config.title,
  );
};

/**
 * Cancel all scheduled and displayed notifications
 *
 * @example
 * ```typescript
 * // User stopped Focus session - cancel all notifications
 * cancelAllNotifications();
 * ```
 */
export const cancelAllNotifications = (): void => {
  PushNotification.cancelAllLocalNotifications();
  logger.log('[NotificationService] All notifications cancelled');
};

// ============================================================================
// Focus-Specific Notifications
// ============================================================================

/**
 * Show notification when work interval completes
 *
 * @param breakDuration - Duration of the break in minutes
 *
 * @example
 * ```typescript
 * // Work complete, 5 minute break
 * showWorkCompleteNotification(5);
 * ```
 */
export const showWorkCompleteNotification = (breakDuration: number): void => {
  showLocalNotification({
    title: '¡Pomodoro completado! 🎉',
    message: `Tiempo de descanso (${breakDuration} min)`,
    playSound: true,
    vibrate: true,
  });
};

/**
 * Show notification when break completes
 *
 * @param isLongBreak - Whether this was a long break
 *
 * @example
 * ```typescript
 * // Short break complete
 * showBreakCompleteNotification(false);
 *
 * // Long break complete
 * showBreakCompleteNotification(true);
 * ```
 */
export const showBreakCompleteNotification = (isLongBreak: boolean): void => {
  showLocalNotification({
    title: isLongBreak ? 'Descanso largo terminado' : 'Descanso terminado',
    message: 'Listo para el siguiente pomodoro 💪',
    playSound: true,
    vibrate: true,
  });
};

// ============================================================================
// Cleanup
// ============================================================================

/**
 * Abandon all pending notifications and reset state
 *
 * Call this when unmounting the Focus feature or on app shutdown.
 */
export const cleanup = (): void => {
  cancelAllNotifications();
  logger.log('[NotificationService] Cleanup complete');
};
