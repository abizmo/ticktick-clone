/**
 * Notification Service
 *
 * Handles local notifications for the Focus feature using Notifee.
 * Sends notifications when work intervals and breaks complete.
 *
 * Features:
 * - Request notification permissions
 * - Show local notifications
 * - Cancel notifications
 * - Handle permission states
 * - Android notification channels
 *
 * Platform Support:
 * - Android: API 21+ (no Firebase required)
 * - iOS: Requires user authorization
 *
 * Limitations:
 * - Notifications work best when app is in foreground or recently backgrounded
 * - Background timer execution is limited by OS (iOS: ~30s, Android: variable)
 * - For true background support, would need Headless JS (Android) or Background Modes (iOS)
 *
 * @module notificationService
 */

import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import {Platform} from 'react-native';

import logger from '../utils/logger';

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
  vibrate?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const CHANNEL_ID = 'focus-timer';
const CHANNEL_NAME = 'Focus Timer';

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
 * Sets up notification channels (Android).
 *
 * @example
 * ```typescript
 * import * as notificationService from './notificationService';
 *
 * // In App.tsx or index.js
 * notificationService.configure();
 * ```
 */
export const configure = async (): Promise<void> => {
  if (isConfigured) {
    logger.info('Notification service already configured', {
      component: 'notificationService',
      action: 'configure',
    });
    return;
  }

  try {
    // Create notification channel (Android only)
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: CHANNEL_ID,
        name: CHANNEL_NAME,
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
      logger.info('Android notification channel created', {
        component: 'notificationService',
        action: 'configure',
      });
    }

    isConfigured = true;
    logger.info('Notification service configured successfully', {
      component: 'notificationService',
      action: 'configure',
    });
  } catch (error) {
    logger.error('Notification service configuration failed', {
      component: 'notificationService',
      action: 'configure',
      error,
    });
  }
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
    await configure();
  }

  try {
    const settings = await notifee.requestPermission();

    logger.debug('Notification permission settings retrieved', {
      component: 'notificationService',
      action: 'requestPermissions',
      data: {settings},
    });

    // Check if permissions were granted
    const granted =
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

    permissionStatus = granted ? 'granted' : 'denied';

    logger.info(`Notification permission ${granted ? 'granted' : 'denied'}`, {
      component: 'notificationService',
      action: 'requestPermissions',
      data: {granted},
    });

    return granted;
  } catch (error) {
    logger.error('Notification permission request failed', {
      component: 'notificationService',
      action: 'requestPermissions',
      error,
    });
    permissionStatus = 'denied';
    return false;
  }
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
    await configure();
  }

  try {
    const settings = await notifee.getNotificationSettings();

    logger.debug('Current notification settings retrieved', {
      component: 'notificationService',
      action: 'checkPermissions',
      data: {settings},
    });

    // Determine status
    const granted =
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

    permissionStatus = granted ? 'granted' : 'denied';

    return permissionStatus;
  } catch (error) {
    logger.error('Failed to check notification permissions', {
      component: 'notificationService',
      action: 'checkPermissions',
      error,
    });
    return 'denied';
  }
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
export const showLocalNotification = async (
  config: NotificationConfig,
): Promise<void> => {
  // Ensure service is configured
  if (!isConfigured) {
    await configure();
  }

  // Check permission status
  if (permissionStatus === 'denied') {
    logger.warn('Cannot show notification: permissions denied', {
      component: 'notificationService',
      action: 'showLocalNotification',
    });
    return;
  }

  try {
    await notifee.displayNotification({
      title: config.title,
      body: config.message,
      android: {
        channelId: CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        sound: config.playSound !== false ? 'default' : undefined,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: config.playSound !== false ? 'default' : undefined,
      },
    });

    logger.info('Local notification sent', {
      component: 'notificationService',
      action: 'showLocalNotification',
      data: {title: config.title},
    });
  } catch (error) {
    logger.error('Failed to show local notification', {
      component: 'notificationService',
      action: 'showLocalNotification',
      error,
      data: {config},
    });
  }
};

/**
 * Cancel all notifications
 *
 * @example
 * ```typescript
 * // User stopped Focus session - cancel all notifications
 * cancelAllNotifications();
 * ```
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await notifee.cancelAllNotifications();
    logger.info('All notifications cancelled', {
      component: 'notificationService',
      action: 'cancelAllNotifications',
    });
  } catch (error) {
    logger.error('Failed to cancel all notifications', {
      component: 'notificationService',
      action: 'cancelAllNotifications',
      error,
    });
  }
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
export const showWorkCompleteNotification = async (
  breakDuration: number,
): Promise<void> => {
  await showLocalNotification({
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
export const showBreakCompleteNotification = async (
  isLongBreak: boolean,
): Promise<void> => {
  await showLocalNotification({
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
export const cleanup = async (): Promise<void> => {
  await cancelAllNotifications();
  logger.info('Notification service cleanup complete', {
    component: 'notificationService',
    action: 'cleanup',
  });
};
