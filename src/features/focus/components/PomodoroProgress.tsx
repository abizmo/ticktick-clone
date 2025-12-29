/**
 * PomodoroProgress Component
 *
 * Displays progress indicators for the Pomodoro technique including:
 * - Number of pomodoros completed today
 * - Visual tomato indicators
 * - Next break type information
 * - Minimalist, non-invasive design
 *
 * Features:
 * - Today's pomodoro count with visual indicators
 * - Next break type calculation (short/long)
 * - Horizontal layout with clear typography
 * - Responsive design for different screen sizes
 * - Accessibility support
 *
 * @module PomodoroProgress
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusStore} from '../store/focusStore';

/**
 * PomodoroProgress component props interface
 */
interface PomodoroProgressProps {}

/**
 * PomodoroProgress Component
 *
 * Renders progress indicators for Pomodoro sessions including
 * completed count and next break information.
 *
 * @returns React.JSX.Element
 */
const PomodoroProgress: React.FC<
  PomodoroProgressProps
> = (): React.JSX.Element => {
  // Subscribe to store state
  const todayStats = useFocusStore(state => state.todayStats);
  const timerState = useFocusStore(state => state.timerState);
  const settings = useFocusStore(state => state.settings);

  /**
   * Calculate next break type based on current progress
   */
  const getNextBreakType = (): 'short' | 'long' | null => {
    // If currently in a break, return null
    if (timerState.currentPhase !== 'work') {
      return null;
    }

    // Calculate total pomodoros (today + current session)
    const totalPomodoros =
      todayStats.pomodorosCompleted + timerState.pomodorosCompleted;

    // Check if next break should be long
    const nextPomodoroCount = totalPomodoros + 1;
    const isLongBreak = nextPomodoroCount % settings.pomosBeforeLongBreak === 0;

    return isLongBreak ? 'long' : 'short';
  };

  /**
   * Generate tomato indicators for completed pomodoros
   */
  const renderTomatoIndicators = (): React.JSX.Element[] => {
    const totalCompleted = todayStats.pomodorosCompleted;
    const maxIndicators = 8; // Limit visual indicators to prevent overflow
    const showCount = Math.min(totalCompleted, maxIndicators);

    const indicators: React.JSX.Element[] = [];

    for (let i = 0; i < showCount; i++) {
      indicators.push(
        <Text
          key={i}
          style={styles.tomatoIcon}
          accessibilityLabel="Completed pomodoro">
          🍅
        </Text>,
      );
    }

    // If more than max indicators, show "+X" text
    if (totalCompleted > maxIndicators) {
      indicators.push(
        <Text
          key="overflow"
          style={styles.overflowText}
          accessibilityLabel={`Plus ${
            totalCompleted - maxIndicators
          } more pomodoros`}>
          +{totalCompleted - maxIndicators}
        </Text>,
      );
    }

    return indicators;
  };

  /**
   * Get next break display text
   */
  const getNextBreakText = (): string => {
    const nextBreak = getNextBreakType();

    if (!nextBreak) {
      return '';
    }

    return nextBreak === 'long' ? 'Next: Long Break' : 'Next: Short Break';
  };

  const nextBreakText = getNextBreakText();
  const totalCompleted = todayStats.pomodorosCompleted;

  return (
    <View style={styles.container}>
      {/* Pomodoros Completed Section */}
      <View style={styles.progressSection}>
        <Text
          style={styles.sectionTitle}
          accessibilityLabel="Today's progress"
          accessibilityRole="text">
          Today
        </Text>

        <View style={styles.progressContent}>
          {/* Count Display */}
          <View style={styles.countContainer}>
            <Text
              style={styles.countNumber}
              accessibilityLabel={`${totalCompleted} pomodoros completed today`}
              accessibilityRole="text">
              {totalCompleted}
            </Text>
            <Text style={styles.countLabel}>
              {totalCompleted === 1 ? 'pomodoro' : 'pomodoros'}
            </Text>
          </View>

          {/* Visual Indicators */}
          {totalCompleted > 0 && (
            <View
              style={styles.indicatorsContainer}
              accessibilityLabel={`Visual indicators showing ${totalCompleted} completed pomodoros`}>
              {renderTomatoIndicators()}
            </View>
          )}
        </View>
      </View>

      {/* Next Break Section */}
      {nextBreakText && (
        <View style={styles.nextBreakSection}>
          <Text
            style={styles.nextBreakText}
            accessibilityLabel={nextBreakText}
            accessibilityRole="text">
            {nextBreakText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 8,
  },
  progressSection: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  progressContent: {
    alignItems: 'center',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  countNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginRight: 6,
  },
  countLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  tomatoIcon: {
    fontSize: 16,
  },
  overflowText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 4,
  },
  nextBreakSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'center',
  },
  nextBreakText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34C759',
  },
});

export default React.memo(PomodoroProgress);
