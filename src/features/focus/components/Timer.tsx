/**
 * Timer Component
 *
 * Displays the main circular timer with time remaining, current phase,
 * and visual progress indicator. This is the centerpiece of the Focus feature.
 *
 * Features:
 * - Large, centered circular timer display
 * - MM:SS time format with large, readable font
 * - Animated progress circle around the timer
 * - Phase-based color coding (Work/Short Break/Long Break)
 * - Smooth animations for phase transitions
 * - Responsive design for different screen sizes
 *
 * @module Timer
 */

import React, {useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  AccessibilityInfo,
} from 'react-native';
import {useFocusStore} from '../store/focusStore';
import {formatTime} from '../utils/timeFormatter';
import {getAccessiblePhaseColor} from '../utils/colorContrast';

const STROKE_WIDTH = 8;

/**
 * Timer Component
 *
 * Renders the main circular timer display with progress indicator.
 * Integrates with the focus store to display current timer state.
 *
 * @returns React.JSX.Element
 */
const Timer: React.FC = (): React.JSX.Element => {
  // Get responsive dimensions
  const {width: screenWidth} = useWindowDimensions();
  const TIMER_SIZE = Math.min(screenWidth * 0.7, 280);

  // Subscribe to timer state from store - use separate selectors to avoid re-render loops
  const timerState = useFocusStore(state => state.timerState);
  const settings = useFocusStore(state => state.settings);

  // Animated values for progress segments
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Calculate progress percentage for visual indicator
  // Memoized to prevent recalculation on every render
  const progress = useMemo((): number => {
    if (timerState.status === 'idle') {
      return 0;
    }

    // Get total duration for current phase
    let totalDuration: number;
    switch (timerState.currentPhase) {
      case 'work':
        totalDuration = settings.pomoWorkDuration * 60;
        break;
      case 'shortBreak':
        totalDuration = settings.pomoShortBreak * 60;
        break;
      case 'longBreak':
        totalDuration = settings.pomoLongBreak * 60;
        break;
      default:
        totalDuration = settings.pomoWorkDuration * 60;
    }

    // Calculate elapsed percentage (0-100)
    const elapsed = totalDuration - timerState.timeRemaining;
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  }, [
    timerState.status,
    timerState.currentPhase,
    timerState.timeRemaining,
    settings.pomoWorkDuration,
    settings.pomoShortBreak,
    settings.pomoLongBreak,
  ]);

  // Get phase-specific colors (accessible)
  // Memoized to prevent recalculation on every render
  const phaseColor = useMemo((): string => {
    return getAccessiblePhaseColor(timerState.currentPhase);
  }, [timerState.currentPhase]);

  // Get phase display name
  // Memoized to prevent recalculation on every render
  const phaseDisplayName = useMemo((): string => {
    switch (timerState.currentPhase) {
      case 'work':
        return 'Work';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Work';
    }
  }, [timerState.currentPhase]);

  // Animate progress changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false, // Changed to false for transform scale
    }).start();
  }, [progress, progressAnim]);

  // Announce phase changes to screen readers
  useEffect(() => {
    const announcePhaseChange = () => {
      const message = `${phaseDisplayName} phase. ${formatTime(
        timerState.timeRemaining,
      )} remaining.`;
      AccessibilityInfo.announceForAccessibility(message);
    };

    // Only announce when timer is running and phase actually changes
    if (timerState.status === 'running') {
      announcePhaseChange();
    }
  }, [
    timerState.currentPhase,
    timerState.status,
    phaseDisplayName,
    timerState.timeRemaining,
  ]);

  // Announce timer status changes
  useEffect(() => {
    const announceStatusChange = () => {
      let message = '';
      switch (timerState.status) {
        case 'running':
          message = `Timer started. ${phaseDisplayName} phase for ${formatTime(
            timerState.timeRemaining,
          )}.`;
          break;
        case 'paused':
          message = `Timer paused. ${formatTime(
            timerState.timeRemaining,
          )} remaining in ${phaseDisplayName} phase.`;
          break;
        case 'idle':
          message = 'Timer stopped.';
          break;
      }
      if (message) {
        AccessibilityInfo.announceForAccessibility(message);
      }
    };

    // Announce status changes with a slight delay to avoid conflicts
    const timeoutId = setTimeout(announceStatusChange, 100);
    return () => clearTimeout(timeoutId);
  }, [timerState.status, phaseDisplayName, timerState.timeRemaining]);

  // Calculate rotation for progress segments
  // We'll use 4 segments to create a proper circular progress
  const getSegmentStyle = (segmentIndex: number) => {
    const segmentProgress = progressAnim.interpolate({
      inputRange: [
        (segmentIndex - 1) * 25,
        segmentIndex * 25,
        (segmentIndex + 1) * 25,
      ],
      outputRange: ['0deg', '90deg', '90deg'],
      extrapolate: 'clamp',
    });

    const segmentOpacity = progressAnim.interpolate({
      inputRange: [(segmentIndex - 1) * 25, segmentIndex * 25],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return {
      transform: [{rotate: segmentProgress}],
      opacity: segmentOpacity,
    };
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Focus timer. ${phaseDisplayName} phase. ${formatTime(
        timerState.timeRemaining,
      )} remaining. Status: ${timerState.status}. Progress: ${Math.round(
        progress,
      )}% complete.`}
      accessibilityRole="adjustable">
      {/* Circular Progress Indicator */}
      <View
        style={[
          styles.timerContainer,
          {width: TIMER_SIZE, height: TIMER_SIZE},
        ]}>
        {/* Background Circle */}
        <View
          style={[
            styles.circle,
            {
              width: TIMER_SIZE,
              height: TIMER_SIZE,
              borderRadius: TIMER_SIZE / 2,
              borderColor: `${phaseColor}20`,
            },
          ]}
          accessible={false}
        />

        {/* Progress Segments - 4 quarters for accurate progress */}
        <View
          style={[
            styles.progressContainer,
            {width: TIMER_SIZE, height: TIMER_SIZE},
          ]}
          accessible={false}>
          {/* Top-Right Quarter (0-25%) */}
          <Animated.View
            style={[
              styles.progressSegment,
              {
                width: TIMER_SIZE,
                height: TIMER_SIZE,
                borderRadius: TIMER_SIZE / 2,
                borderColor: phaseColor,
                borderTopColor: phaseColor,
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
              },
              getSegmentStyle(1),
            ]}
            accessible={false}
          />
          {/* Bottom-Right Quarter (25-50%) */}
          <Animated.View
            style={[
              styles.progressSegment,
              {
                width: TIMER_SIZE,
                height: TIMER_SIZE,
                borderRadius: TIMER_SIZE / 2,
                borderColor: phaseColor,
                borderTopColor: 'transparent',
                borderRightColor: phaseColor,
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
              },
              getSegmentStyle(2),
            ]}
            accessible={false}
          />
          {/* Bottom-Left Quarter (50-75%) */}
          <Animated.View
            style={[
              styles.progressSegment,
              {
                width: TIMER_SIZE,
                height: TIMER_SIZE,
                borderRadius: TIMER_SIZE / 2,
                borderColor: phaseColor,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: phaseColor,
                borderLeftColor: 'transparent',
              },
              getSegmentStyle(3),
            ]}
            accessible={false}
          />
          {/* Top-Left Quarter (75-100%) */}
          <Animated.View
            style={[
              styles.progressSegment,
              {
                width: TIMER_SIZE,
                height: TIMER_SIZE,
                borderRadius: TIMER_SIZE / 2,
                borderColor: phaseColor,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: phaseColor,
              },
              getSegmentStyle(4),
            ]}
            accessible={false}
          />
        </View>

        {/* Timer Content */}
        <View style={styles.timerContent} accessible={false}>
          {/* Time Display */}
          <Text
            style={[styles.timeText, {color: phaseColor}]}
            accessible={false}
            importantForAccessibility="no">
            {formatTime(timerState.timeRemaining)}
          </Text>

          {/* Phase Label */}
          <Text
            style={[styles.phaseText, {color: phaseColor}]}
            accessible={false}
            importantForAccessibility="no">
            {phaseDisplayName}
          </Text>

          {/* Status Indicator */}
          {timerState.status !== 'idle' && (
            <View
              style={[styles.statusIndicator, {backgroundColor: phaseColor}]}
              accessible={false}>
              <Text
                style={styles.statusText}
                accessible={false}
                importantForAccessibility="no">
                {timerState.status === 'running' ? '●' : '⏸'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  timerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderWidth: STROKE_WIDTH,
    borderColor: '#E5E5E7',
  },
  progressContainer: {
    position: 'absolute',
  },
  progressSegment: {
    position: 'absolute',
    borderWidth: STROKE_WIDTH,
  },
  timerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default React.memo(Timer);
