/**
 * Focus Feature - Storage Service
 *
 * This service handles all AsyncStorage operations for the Focus feature.
 * It provides methods to save and load settings, sessions, and other data.
 *
 * @module storageService
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {FocusSettings, FocusSession, StorageKeys} from '../types/focus.types';
import {DEFAULT_FOCUS_SETTINGS} from '../constants/defaults';

// ============================================================================
// Settings Operations
// ============================================================================

/**
 * Save Focus settings to AsyncStorage
 *
 * @param settings - Focus settings to save
 * @returns Promise that resolves when settings are saved
 * @throws Error if save operation fails
 */
export const saveFocusSettings = async (
  settings: FocusSettings,
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(StorageKeys.FOCUS_SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving Focus settings:', error);
    throw new Error('Failed to save Focus settings');
  }
};

/**
 * Load Focus settings from AsyncStorage
 *
 * @returns Promise that resolves with settings or null if not found
 * @throws Error if load operation fails
 */
export const loadFocusSettings = async (): Promise<FocusSettings | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(StorageKeys.FOCUS_SETTINGS);

    if (jsonValue === null) {
      // No settings saved yet, return default settings
      return DEFAULT_FOCUS_SETTINGS;
    }

    const settings = JSON.parse(jsonValue) as FocusSettings;
    return settings;
  } catch (error) {
    console.error('Error loading Focus settings:', error);
    // Return default settings on error
    return DEFAULT_FOCUS_SETTINGS;
  }
};

// ============================================================================
// Session Operations
// ============================================================================

/**
 * Save a Focus session to AsyncStorage
 * Sessions are stored in an array and appended to existing sessions
 *
 * @param session - Focus session to save
 * @returns Promise that resolves when session is saved
 * @throws Error if save operation fails
 */
export const saveFocusSession = async (
  session: FocusSession,
): Promise<void> => {
  try {
    // Load existing sessions
    const existingSessions = await loadFocusSessions();

    // Add new session to the beginning of the array (most recent first)
    const updatedSessions = [session, ...existingSessions];

    // Save updated sessions array
    const jsonValue = JSON.stringify(updatedSessions);
    await AsyncStorage.setItem(StorageKeys.FOCUS_SESSIONS, jsonValue);
  } catch (error) {
    console.error('Error saving Focus session:', error);
    throw new Error('Failed to save Focus session');
  }
};

/**
 * Load Focus sessions from AsyncStorage
 *
 * @param limit - Optional limit on number of sessions to return
 * @returns Promise that resolves with array of sessions
 * @throws Error if load operation fails
 */
export const loadFocusSessions = async (
  limit?: number,
): Promise<FocusSession[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(StorageKeys.FOCUS_SESSIONS);

    if (jsonValue === null) {
      return [];
    }

    let sessions = JSON.parse(jsonValue) as FocusSession[];

    // Convert date strings back to Date objects
    sessions = sessions.map(session => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: session.endTime ? new Date(session.endTime) : undefined,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
    }));

    // Apply limit if specified
    if (limit && limit > 0) {
      sessions = sessions.slice(0, limit);
    }

    return sessions;
  } catch (error) {
    console.error('Error loading Focus sessions:', error);
    return [];
  }
};

/**
 * Get today's Focus sessions
 * Filters sessions to only include those from today
 *
 * @returns Promise that resolves with array of today's sessions
 */
export const getTodaySessions = async (): Promise<FocusSession[]> => {
  try {
    const allSessions = await loadFocusSessions();

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date at midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Filter sessions that started today
    const todaySessions = allSessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= today && sessionDate < tomorrow;
    });

    return todaySessions;
  } catch (error) {
    console.error("Error getting today's sessions:", error);
    return [];
  }
};

/**
 * Clear all Focus sessions from AsyncStorage
 * This is primarily used for testing and debugging
 *
 * @returns Promise that resolves when sessions are cleared
 * @throws Error if clear operation fails
 */
export const clearAllSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(StorageKeys.FOCUS_SESSIONS);
  } catch (error) {
    console.error('Error clearing Focus sessions:', error);
    throw new Error('Failed to clear Focus sessions');
  }
};

// ============================================================================
// Current Session Operations
// ============================================================================

/**
 * Save the current active session to AsyncStorage
 * This allows resuming a session if the app is closed
 *
 * @param session - Current active session
 * @returns Promise that resolves when session is saved
 */
export const saveCurrentSession = async (
  session: FocusSession | null,
): Promise<void> => {
  try {
    if (session === null) {
      await AsyncStorage.removeItem(StorageKeys.CURRENT_SESSION);
    } else {
      const jsonValue = JSON.stringify(session);
      await AsyncStorage.setItem(StorageKeys.CURRENT_SESSION, jsonValue);
    }
  } catch (error) {
    console.error('Error saving current session:', error);
    throw new Error('Failed to save current session');
  }
};

/**
 * Load the current active session from AsyncStorage
 *
 * @returns Promise that resolves with current session or null
 */
export const loadCurrentSession = async (): Promise<FocusSession | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(StorageKeys.CURRENT_SESSION);

    if (jsonValue === null) {
      return null;
    }

    const session = JSON.parse(jsonValue) as FocusSession;

    // Convert date strings back to Date objects
    return {
      ...session,
      startTime: new Date(session.startTime),
      endTime: session.endTime ? new Date(session.endTime) : undefined,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
    };
  } catch (error) {
    console.error('Error loading current session:', error);
    return null;
  }
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clear all Focus data from AsyncStorage
 * This removes settings, sessions, and current session
 * Use with caution - this is irreversible!
 *
 * @returns Promise that resolves when all data is cleared
 */
export const clearAllFocusData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      StorageKeys.FOCUS_SETTINGS,
      StorageKeys.FOCUS_SESSIONS,
      StorageKeys.CURRENT_SESSION,
    ]);
  } catch (error) {
    console.error('Error clearing all Focus data:', error);
    throw new Error('Failed to clear all Focus data');
  }
};

/**
 * Get storage statistics
 * Returns information about stored data
 *
 * @returns Promise that resolves with storage stats
 */
export const getStorageStats = async (): Promise<{
  totalSessions: number;
  todaySessions: number;
  hasSettings: boolean;
  hasCurrentSession: boolean;
}> => {
  try {
    const [allSessions, todaySessions, settings, currentSession] =
      await Promise.all([
        loadFocusSessions(),
        getTodaySessions(),
        loadFocusSettings(),
        loadCurrentSession(),
      ]);

    return {
      totalSessions: allSessions.length,
      todaySessions: todaySessions.length,
      hasSettings: settings !== null,
      hasCurrentSession: currentSession !== null,
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      totalSessions: 0,
      todaySessions: 0,
      hasSettings: false,
      hasCurrentSession: false,
    };
  }
};
