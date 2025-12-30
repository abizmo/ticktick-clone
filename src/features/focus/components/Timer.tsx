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

import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import {useFocusStore} from '../store/focusStore';
import {formatTime} from '../utils/timeFormatter';

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

  // Subscribe to timer state from store
  const timerState = useFocusStore(state => state.timerState);
  const settings = useFocusStore(state => state.settings);

  // Animated values for progress segments
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Calculate progress percentage for visual indicator
  const getProgress = (): number => {
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
  };

  // Get phase-specific colors
  const getPhaseColor = (): string => {
    switch (timerState.currentPhase) {
      case 'work':
        return '#007AFF'; // Blue
      case 'shortBreak':
        return '#34C759'; // Green
      case 'longBreak':
        return '#AF52DE'; // Purple
      default:
        return '#007AFF';
    }
  };

  // Get phase display name
  const getPhaseDisplayName = (): string => {
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
  };

  const progress = getProgress();
  const phaseColor = getPhaseColor();

  // Animate progress changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false, // Changed to false for transform scale
    }).start();
  }, [progress, progressAnim]);

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
    <View style={styles.container}>
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
        />

        {/* Progress Segments - 4 quarters for accurate progress */}
        <View
          style={[
            styles.progressContainer,
            {width: TIMER_SIZE, height: TIMER_SIZE},
          ]}>
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
          />
        </View>

        {/* Timer Content */}
        <View style={styles.timerContent}>
          {/* Time Display */}
          <Text
            style={[styles.timeText, {color: phaseColor}]}
            accessibilityLabel={`Time remaining: ${formatTime(
              timerState.timeRemaining,
            )}`}
            accessibilityRole="text">
            {formatTime(timerState.timeRemaining)}
          </Text>

          {/* Phase Label */}
          <Text
            style={styles.phaseText}
            accessibilityLabel={`Current phase: ${getPhaseDisplayName()}`}
            accessibilityRole="text">
            {getPhaseDisplayName()}
          </Text>

          {/* Status Indicator */}
          {timerState.status !== 'idle' && (
            <View
              style={[styles.statusIndicator, {backgroundColor: phaseColor}]}>
              <Text
                style={styles.statusText}
                accessibilityLabel={
                  timerState.status === 'running' ? 'Running' : 'Paused'
                }
                accessibilityRole="text">
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
    color: '#007AFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
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
