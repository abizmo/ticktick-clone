/**
 * Mock for react-native-push-notification
 *
 * Provides mock implementations for all notification functions
 * used in the Focus feature.
 */

const mockPushNotification = {
  configure: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  popInitialNotification: jest.fn(),
  abandonPermissions: jest.fn(),
  checkPermissions: jest.fn(callback => {
    callback({alert: 1, badge: 1, sound: 1});
  }),
  requestPermissions: jest.fn(callback => {
    callback({alert: 1, badge: 1, sound: 1});
  }),
  registerNotificationActions: jest.fn(),
  clearAllNotifications: jest.fn(),
  createChannel: jest.fn((config, callback) => {
    if (callback) {
      callback(true);
    }
  }),
};

export default mockPushNotification;
