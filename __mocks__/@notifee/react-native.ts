/**
 * Mock for @notifee/react-native
 * Used in tests to simulate notification behavior
 */

export enum AuthorizationStatus {
  NOT_DETERMINED = -1,
  DENIED = 0,
  AUTHORIZED = 1,
  PROVISIONAL = 2,
}

export enum AndroidImportance {
  NONE = 0,
  MIN = 1,
  LOW = 2,
  DEFAULT = 3,
  HIGH = 4,
  MAX = 5,
}

// Mock state
let mockPermissionStatus = AuthorizationStatus.AUTHORIZED;
let mockChannelCreated = false;
const mockNotifications: any[] = [];

// Mock implementation
const notifee = {
  // Request permissions
  requestPermission: jest.fn(async () => ({
    authorizationStatus: mockPermissionStatus,
  })),

  // Get notification settings
  getNotificationSettings: jest.fn(async () => ({
    authorizationStatus: mockPermissionStatus,
  })),

  // Create channel (Android)
  createChannel: jest.fn(async (channel: any) => {
    mockChannelCreated = true;
    return channel.id;
  }),

  // Display notification
  displayNotification: jest.fn(async (notification: any) => {
    mockNotifications.push(notification);
    return `notification-${mockNotifications.length}`;
  }),

  // Cancel all notifications
  cancelAllNotifications: jest.fn(async () => {
    mockNotifications.length = 0;
  }),

  // Cancel notification by ID
  cancelNotification: jest.fn(async (id: string) => {
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
  }),

  // Get displayed notifications
  getDisplayedNotifications: jest.fn(async () => mockNotifications),

  // Mock helpers for testing
  __setPermissionStatus: (status: AuthorizationStatus) => {
    mockPermissionStatus = status;
  },

  __getNotifications: () => mockNotifications,

  __reset: () => {
    mockPermissionStatus = AuthorizationStatus.AUTHORIZED;
    mockChannelCreated = false;
    mockNotifications.length = 0;
    jest.clearAllMocks();
  },
};

export default notifee;
