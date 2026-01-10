/**
 * FocusScreen - Main Focus Feature Screen
 *
 * Integrates all Focus feature components into a cohesive screen layout:
 * - Timer: Circular timer display (main component)
 * - TimerControls: Start/pause/stop controls
 * - TaskSelector: Task selection modal
 * - PomodoroProgress: Pomodoro session counter
 * - SessionHistory: Historical session data
 *
 * Layout is responsive and scrollable for different screen sizes.
 *
 * @module FocusScreen
 */

import React, {useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {useFocusStore} from '../store/focusStore';
import {mockTasks} from '../../../data/mockData';
import {
  Timer,
  TimerControls,
  TaskSelector,
  PomodoroProgress,
  SessionHistory,
  ErrorBoundary,
} from '../components';
import logger from '../utils/logger';

/**
 * Props for FocusScreen
 */
interface FocusScreenProps {
  route?: {
    params?: {
      taskId?: string;
      taskTitle?: string;
    };
  };
}

/**
 * FocusScreen Component
 *
 * Main screen that brings together all Focus feature components
 * in a clean, scrollable layout. Handles responsive design and
 * proper spacing between components.
 *
 * Integrates with Zustand store to load sessions on mount and
 * provides a centralized location for all Focus feature functionality.
 *
 * Supports pre-selecting a task when navigated from TaskListScreen
 * via the taskId route parameter.
 *
 * @param {FocusScreenProps} props - Component props including optional route params
 * @returns {React.JSX.Element} The rendered FocusScreen component
 */
const FocusScreen: React.FC<FocusScreenProps> = ({
  route,
}): React.JSX.Element => {
  // Get actions from store
  const loadSessions = useFocusStore(state => state.loadSessions);
  const selectTask = useFocusStore(state => state.selectTask);

  // Load sessions on mount
  useEffect(() => {
    // Flag to track if component is still mounted
    let isMounted = true;

    // Async function to load sessions with cancellation support (Issue #27)
    const loadData = async () => {
      await loadSessions();
    };

    // Start loading (don't await to avoid blocking)
    loadData().catch(error => {
      // Only log error if component is still mounted
      if (isMounted) {
        logger.error('Failed to load sessions on mount', {
          component: 'FocusScreen',
          action: 'loadData',
          error,
        });
      }
    });

    // Cleanup function to prevent memory leaks (Issue #27)
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Handle task pre-selection from navigation params
  useEffect(() => {
    const taskId = route?.params?.taskId;
    if (taskId) {
      const task = mockTasks.find(t => t.id === taskId);
      if (task) {
        selectTask(task);
        if (__DEV__) {
          console.log('[FocusScreen] Pre-selected task:', task.title);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.taskId]); // Only run when taskId changes

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('FocusScreen error caught by ErrorBoundary', {
          component: 'FocusScreen',
          action: 'render',
          error,
          data: {componentStack: errorInfo.componentStack},
        });
      }}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          accessible={true}
          accessibilityLabel="Focus screen. Swipe up and down to navigate between timer, controls, and session history."
          accessibilityRole="scrollbar">
          {/* Header Section */}
          <View
            style={styles.header}
            accessible={true}
            accessibilityRole="header">
            <Text
              style={styles.headerTitle}
              accessible={false}
              importantForAccessibility="no">
              Focus
            </Text>
          </View>

          {/* Task Selection */}
          <View
            style={styles.section}
            accessible={true}
            accessibilityLabel="Task selection section">
            <TaskSelector />
          </View>

          {/* Main Timer Display */}
          <View
            style={styles.timerSection}
            accessible={true}
            accessibilityLabel="Timer display section">
            <Timer />
          </View>

          {/* Timer Control Buttons */}
          <View
            style={styles.section}
            accessible={true}
            accessibilityLabel="Timer controls section">
            <TimerControls />
          </View>

          {/* Pomodoro Progress Indicator */}
          <View
            style={styles.section}
            accessible={true}
            accessibilityLabel="Progress tracking section">
            <PomodoroProgress />
          </View>

          {/* Session History List */}
          <View
            style={styles.historyContainer}
            accessible={true}
            accessibilityLabel="Session history section">
            <SessionHistory />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

/**
 * Component Styles
 *
 * Responsive layout with proper spacing and typography.
 * Follows React Native styling best practices.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000', // Keep black for headers as it has perfect contrast
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  timerSection: {
    marginBottom: 24,
    alignItems: 'center',
    paddingVertical: 8,
  },
  historyContainer: {
    flex: 1,
    marginTop: 8,
    minHeight: 200,
  },
});

export default FocusScreen;
