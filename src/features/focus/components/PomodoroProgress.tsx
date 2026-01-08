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

import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusStore} from '../store/focusStore';
import {AccessibleColors} from '../utils/colorContrast';

/**
 * PomodoroProgress Component
 *
 * Renders progress indicators for Pomodoro sessions including
 * completed count and next break information.
 *
 * @returns React.JSX.Element
 */
const PomodoroProgress: React.FC = (): React.JSX.Element => {
  // Subscribe to store state - use separate selectors to avoid re-render loops
  const todayStats = useFocusStore(state => state.todayStats);
  const timerState = useFocusStore(state => state.timerState);
  const settings = useFocusStore(state => state.settings);

  /**
   * Calculate next break type based on current progress
   * Memoized to prevent recalculation on every render
   */
  const getNextBreakType = useMemo((): 'short' | 'long' | null => {
    // If currently in a break, return null
    if (timerState.currentPhase !== 'work') {
      return null;
    }

    // Validate configuration for long break interval
    const pomosBeforeLongBreak = settings.pomosBeforeLongBreak;
    if (
      typeof pomosBeforeLongBreak !== 'number' ||
      !Number.isFinite(pomosBeforeLongBreak) ||
      pomosBeforeLongBreak <= 0
    ) {
      // Fallback: treat next break as a short break when configuration is invalid
      return 'short';
    }

    // Calculate total pomodoros (today + current session)
    const totalPomodoros =
      todayStats.pomodorosCompleted + timerState.pomodorosCompleted;

    // Check if next break should be long
    const nextPomodoroCount = totalPomodoros + 1;
    const isLongBreak = nextPomodoroCount % pomosBeforeLongBreak === 0;

    return isLongBreak ? 'long' : 'short';
  }, [
    timerState.currentPhase,
    timerState.pomodorosCompleted,
    todayStats.pomodorosCompleted,
    settings.pomosBeforeLongBreak,
  ]);

  /**
   * Generate tomato indicators for completed pomodoros
   * Memoized to prevent re-creating array on every render (Issue #20)
   */
  const tomatoIndicators = useMemo((): React.JSX.Element[] => {
    const totalCompleted = todayStats.pomodorosCompleted;
    const maxIndicators = 8; // Limit visual indicators to prevent overflow
    const showCount = Math.min(totalCompleted, maxIndicators);

    const indicators: React.JSX.Element[] = [];

    for (let i = 0; i < showCount; i++) {
      indicators.push(
        <Text
          key={i}
          style={styles.tomatoIcon}
          accessible={false}
          importantForAccessibility="no">
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
          accessible={false}
          importantForAccessibility="no">
          +{totalCompleted - maxIndicators}
        </Text>,
      );
    }

    return indicators;
  }, [todayStats.pomodorosCompleted]);

  /**
   * Get next break display text
   * Memoized to prevent recalculation on every render
   */
  const nextBreakText = useMemo((): string => {
    const nextBreak = getNextBreakType;

    if (!nextBreak) {
      return '';
    }

    return nextBreak === 'long' ? 'Next: Long Break' : 'Next: Short Break';
  }, [getNextBreakType]);

  const totalCompleted = todayStats.pomodorosCompleted;

  // Create comprehensive accessibility label for the entire component
  const containerAccessibilityLabel = useMemo(() => {
    let label = `Today's progress: ${totalCompleted} ${
      totalCompleted === 1 ? 'pomodoro' : 'pomodoros'
    } completed.`;
    if (nextBreakText) {
      label += ` ${nextBreakText}`;
    }
    if (totalCompleted === 0) {
      label += ' No pomodoros completed yet today.';
    }
    return label;
  }, [totalCompleted, nextBreakText]);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={containerAccessibilityLabel}>
      {/* Pomodoros Completed Section */}
      <View style={styles.progressSection} accessible={false}>
        <Text
          style={styles.sectionTitle}
          accessible={false}
          importantForAccessibility="no">
          Today
        </Text>

        <View style={styles.progressContent} accessible={false}>
          {/* Count Display */}
          <View style={styles.countContainer} accessible={false}>
            <Text
              style={styles.countNumber}
              accessible={false}
              importantForAccessibility="no">
              {totalCompleted}
            </Text>
            <Text
              style={styles.countLabel}
              accessible={false}
              importantForAccessibility="no">
              {totalCompleted === 1 ? 'pomodoro' : 'pomodoros'}
            </Text>
          </View>

          {/* Visual Indicators */}
          {totalCompleted > 0 && (
            <View
              style={styles.indicatorsContainer}
              accessible={false}
              importantForAccessibility="no">
              {tomatoIndicators}
            </View>
          )}
        </View>
      </View>

      {/* Next Break Section */}
      {nextBreakText && (
        <View style={styles.nextBreakSection} accessible={false}>
          <Text
            style={styles.nextBreakText}
            accessible={false}
            importantForAccessibility="no">
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
    color: AccessibleColors.secondary,
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
    color: AccessibleColors.primary,
    marginRight: 6,
  },
  countLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: AccessibleColors.secondary,
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
    color: AccessibleColors.secondary,
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
    color: AccessibleColors.success,
  },
});

export default React.memo(PomodoroProgress);
