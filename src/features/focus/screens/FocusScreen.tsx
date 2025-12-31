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
import {
  Timer,
  TimerControls,
  TaskSelector,
  PomodoroProgress,
  SessionHistory,
} from '../components';

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
 * @returns {React.JSX.Element} The rendered FocusScreen component
 */
const FocusScreen: React.FC = (): React.JSX.Element => {
  // Get loadSessions action from store
  const loadSessions = useFocusStore(state => state.loadSessions);

  // Load sessions when component mounts
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

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
