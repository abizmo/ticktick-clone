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
} from '../components';

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

  // Load sessions and handle task pre-selection when component mounts
  useEffect(() => {
    loadSessions();

    // Pre-select task if taskId is provided via navigation
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

    // TODO: Add cleanup for async cancellation to prevent memory leaks
    // when component unmounts before loadSessions completes.
    // See GitHub issue for implementation in Phase 7.
  }, [loadSessions, selectTask, route?.params?.taskId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text
            style={styles.headerTitle}
            accessibilityLabel="Focus screen header"
            accessibilityRole="header">
            Focus
          </Text>
        </View>

        {/* Task Selection */}
        <View style={styles.section}>
          <TaskSelector />
        </View>

        {/* Main Timer Display */}
        <View style={styles.timerSection}>
          <Timer />
        </View>

        {/* Timer Control Buttons */}
        <View style={styles.section}>
          <TimerControls />
        </View>

        {/* Pomodoro Progress Indicator */}
        <View style={styles.section}>
          <PomodoroProgress />
        </View>

        {/* Session History List */}
        <View style={styles.historyContainer}>
          <SessionHistory />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    color: '#000000',
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
