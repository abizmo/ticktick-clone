/**
 * TimerControls Component
 *
 * Provides control buttons for the Focus timer including Start, Pause, Resume, and Stop.
 * Handles pause limits, confirmation dialogs, and proper accessibility.
 *
 * Features:
 * - Context-aware button display (Start/Pause/Resume/Stop)
 * - Pause limit enforcement with visual feedback
 * - Stop confirmation dialog (when enabled in settings)
 * - Tactile feedback on button press
 * - Full accessibility support
 * - Responsive button sizing
 *
 * @module TimerControls
 */

import React, {useState, useMemo, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
  Platform,
  Animated,
  AccessibilityInfo,
} from 'react-native';
import {useFocusStore} from '../store/focusStore';
import {AccessibleColors} from '../utils/colorContrast';
import logger from '../utils/logger';

/**
 * TimerControls Component
 *
 * Renders control buttons for the Focus timer with proper state management
 * and user feedback.
 *
 * @returns React.JSX.Element
 */
const TimerControls: React.FC = (): React.JSX.Element => {
  // Subscribe to store state and actions - use separate selectors to avoid re-render loops
  const timerState = useFocusStore(state => state.timerState);
  const settings = useFocusStore(state => state.settings);
  const currentSession = useFocusStore(state => state.currentSession);
  const startFocus = useFocusStore(state => state.startFocus);
  const pauseFocus = useFocusStore(state => state.pauseFocus);
  const resumeFocus = useFocusStore(state => state.resumeFocus);
  const stopFocus = useFocusStore(state => state.stopFocus);

  // Local state for button interactions
  const [isProcessing, setIsProcessing] = useState(false);

  // Animation values for press feedback
  const startButtonScale = useRef(new Animated.Value(1)).current;
  const pauseButtonScale = useRef(new Animated.Value(1)).current;
  const resumeButtonScale = useRef(new Animated.Value(1)).current;
  const stopButtonScale = useRef(new Animated.Value(1)).current;

  /**
   * Create press animation for buttons
   */
  const createPressAnimation = useCallback((animValue: Animated.Value) => {
    return {
      onPressIn: () => {
        Animated.spring(animValue, {
          toValue: 0.95,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
      },
      onPressOut: () => {
        Animated.spring(animValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
      },
    };
  }, []);

  /**
   * Handle start button press
   * Memoized to prevent re-creating function on every render
   */
  const handleStart = useCallback(async (): Promise<void> => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      // Provide tactile feedback
      if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      }

      // Announce action to screen reader
      AccessibilityInfo.announceForAccessibility('Starting Focus session');

      await startFocus();
    } catch (error) {
      logger.error('Failed to start focus session', {
        component: 'TimerControls',
        action: 'handleStart',
        error,
      });
      AccessibilityInfo.announceForAccessibility(
        'Failed to start Focus session',
      );
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, startFocus]);

  /**
   * Handle pause button press
   * Memoized to prevent re-creating function on every render
   */
  const handlePause = useCallback((): void => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      // Provide tactile feedback
      if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      }

      // Announce action to screen reader
      AccessibilityInfo.announceForAccessibility('Pausing Focus session');

      pauseFocus();
    } catch (error) {
      logger.error('Failed to pause focus session', {
        component: 'TimerControls',
        action: 'handlePause',
        error,
      });
      AccessibilityInfo.announceForAccessibility(
        'Failed to pause Focus session',
      );
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, pauseFocus]);

  /**
   * Handle resume button press
   * Memoized to prevent re-creating function on every render
   */
  const handleResume = useCallback((): void => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      // Provide tactile feedback
      if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      }

      // Announce action to screen reader
      AccessibilityInfo.announceForAccessibility('Resuming Focus session');

      resumeFocus();
    } catch (error) {
      logger.error('Failed to resume focus session', {
        component: 'TimerControls',
        action: 'handleResume',
        error,
      });
      AccessibilityInfo.announceForAccessibility(
        'Failed to resume Focus session',
      );
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, resumeFocus]);

  /**
   * Handle stop button press with optional confirmation
   * Memoized to prevent re-creating function on every render
   *
   * Fixed Issue #15: Race condition prevention
   * - Set isProcessing BEFORE showing confirmation dialog
   * - Use ref to track if stop is already in progress
   * - Properly handle async stopFocus with state checks
   */
  const handleStop = useCallback((): void => {
    // Prevent multiple simultaneous stop calls (race condition fix)
    if (isProcessing) {
      logger.warn('Stop already in progress, ignoring duplicate call', {
        component: 'TimerControls',
        action: 'handleStop',
      });
      return;
    }

    // Set processing state immediately to prevent race conditions
    setIsProcessing(true);

    const performStop = async (): Promise<void> => {
      try {
        // Provide tactile feedback
        if (Platform.OS === 'ios') {
          Vibration.vibrate(100);
        }

        // Announce action to screen reader
        AccessibilityInfo.announceForAccessibility('Stopping Focus session');

        // Call stopFocus and wait for completion
        await stopFocus();

        logger.info('Focus session stopped successfully', {
          component: 'TimerControls',
          action: 'performStop',
        });
      } catch (error) {
        logger.error('Failed to stop focus session', {
          component: 'TimerControls',
          action: 'performStop',
          error,
        });
        AccessibilityInfo.announceForAccessibility(
          'Failed to stop Focus session',
        );
      } finally {
        // Always reset processing state
        setIsProcessing(false);
      }
    };

    // Show confirmation dialog if enabled in settings
    if (settings.confirmStop) {
      Alert.alert(
        'Stop Focus Session',
        'Are you sure you want to stop the current session? Your progress will be saved.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              // Reset processing state if user cancels
              setIsProcessing(false);
            },
          },
          {
            text: 'Stop',
            style: 'destructive',
            onPress: () => {
              // Don't reset isProcessing here - let performStop handle it
              performStop();
            },
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {
            // Reset processing state if dialog is dismissed
            setIsProcessing(false);
          },
        },
      );
    } else {
      // No confirmation needed - stop immediately
      performStop();
    }
  }, [isProcessing, settings.confirmStop, stopFocus]);

  /**
   * Check if pause button should be disabled
   * Memoized to prevent recalculation on every render
   */
  const isPauseDisabled = useMemo((): boolean => {
    return timerState.pausesUsed >= settings.maxPausesPerSession;
  }, [timerState.pausesUsed, settings.maxPausesPerSession]);

  /**
   * Get pause counter text
   * Memoized to prevent recalculation on every render
   */
  const pauseCounterText = useMemo((): string => {
    return `${timerState.pausesUsed}/${settings.maxPausesPerSession} pauses`;
  }, [timerState.pausesUsed, settings.maxPausesPerSession]);

  // Render different button sets based on timer status
  const renderControls = (): React.JSX.Element => {
    switch (timerState.status) {
      case 'idle':
        return (
          <Animated.View style={{transform: [{scale: startButtonScale}]}}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                isProcessing && styles.buttonDisabled,
              ]}
              onPress={handleStart}
              disabled={isProcessing}
              accessibilityLabel="Start Focus session"
              accessibilityRole="button"
              accessibilityHint="Begins a new Focus session with the current settings"
              accessibilityState={{disabled: isProcessing}}
              {...createPressAnimation(startButtonScale)}>
              <Text
                style={[
                  styles.buttonText,
                  styles.primaryButtonText,
                  isProcessing && styles.buttonTextDisabled,
                ]}>
                {isProcessing ? 'Starting...' : 'Start'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );

      case 'running':
        return (
          <View style={styles.controlsRow}>
            <Animated.View style={{transform: [{scale: pauseButtonScale}]}}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.secondaryButton,
                  (isPauseDisabled || isProcessing) && styles.disabledButton,
                ]}
                onPress={handlePause}
                disabled={isProcessing || isPauseDisabled}
                accessibilityLabel={
                  isPauseDisabled
                    ? 'Pause limit reached'
                    : 'Pause Focus session'
                }
                accessibilityRole="button"
                accessibilityHint={
                  isPauseDisabled
                    ? 'You have reached the maximum number of pauses for this session'
                    : 'Temporarily pauses the current Focus session'
                }
                accessibilityState={{disabled: isProcessing || isPauseDisabled}}
                {...(!isPauseDisabled && !isProcessing
                  ? createPressAnimation(pauseButtonScale)
                  : {})}>
                <Text
                  style={[
                    styles.buttonText,
                    styles.secondaryButtonText,
                    (isPauseDisabled || isProcessing) &&
                      styles.disabledButtonText,
                  ]}>
                  {isProcessing ? 'Pausing...' : 'Pause'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{transform: [{scale: stopButtonScale}]}}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.destructiveButton,
                  isProcessing && styles.buttonDisabled,
                ]}
                onPress={handleStop}
                disabled={isProcessing}
                accessibilityLabel="Stop Focus session"
                accessibilityRole="button"
                accessibilityHint="Ends the current Focus session and saves your progress"
                accessibilityState={{disabled: isProcessing}}
                {...createPressAnimation(stopButtonScale)}>
                <Text
                  style={[
                    styles.buttonText,
                    styles.destructiveButtonText,
                    isProcessing && styles.buttonTextDisabled,
                  ]}>
                  {isProcessing ? 'Stopping...' : 'Stop'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        );

      case 'paused':
        return (
          <View style={styles.controlsRow}>
            <Animated.View style={{transform: [{scale: resumeButtonScale}]}}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.primaryButton,
                  isProcessing && styles.buttonDisabled,
                ]}
                onPress={handleResume}
                disabled={isProcessing}
                accessibilityLabel="Resume Focus session"
                accessibilityRole="button"
                accessibilityHint="Continues the paused Focus session"
                accessibilityState={{disabled: isProcessing}}
                {...createPressAnimation(resumeButtonScale)}>
                <Text
                  style={[
                    styles.buttonText,
                    styles.primaryButtonText,
                    isProcessing && styles.buttonTextDisabled,
                  ]}>
                  {isProcessing ? 'Resuming...' : 'Resume'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{transform: [{scale: stopButtonScale}]}}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.destructiveButton,
                  isProcessing && styles.buttonDisabled,
                ]}
                onPress={handleStop}
                disabled={isProcessing}
                accessibilityLabel="Stop Focus session"
                accessibilityRole="button"
                accessibilityHint="Ends the current Focus session and saves your progress"
                accessibilityState={{disabled: isProcessing}}
                {...createPressAnimation(stopButtonScale)}>
                <Text
                  style={[
                    styles.buttonText,
                    styles.destructiveButtonText,
                    isProcessing && styles.buttonTextDisabled,
                  ]}>
                  {isProcessing ? 'Stopping...' : 'Stop'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        );

      default:
        return <View />;
    }
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="Timer controls">
      {/* Pause Counter (only show when session is active) */}
      {currentSession && (
        <View
          style={styles.pauseCounter}
          accessible={true}
          accessibilityLabel={`Pause counter: ${pauseCounterText}${
            isPauseDisabled ? '. Pause limit reached.' : ''
          }`}
          accessibilityRole="text">
          <Text
            style={[
              styles.pauseCounterText,
              isPauseDisabled && styles.pauseCounterTextWarning,
            ]}
            accessible={false}
            importantForAccessibility="no">
            {pauseCounterText}
          </Text>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>{renderControls()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  pauseCounter: {
    marginBottom: 16,
  },
  pauseCounterText: {
    fontSize: 14,
    fontWeight: '500',
    color: AccessibleColors.secondary,
    textAlign: 'center',
  },
  pauseCounterTextWarning: {
    color: AccessibleColors.error,
  },
  controlsContainer: {
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: AccessibleColors.primary,
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  destructiveButton: {
    backgroundColor: AccessibleColors.error,
  },
  disabledButton: {
    backgroundColor: '#F2F2F7',
    borderColor: '#E5E5EA',
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: AccessibleColors.primary,
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: AccessibleColors.secondary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTextDisabled: {
    color: AccessibleColors.secondary,
  },
});

export default React.memo(TimerControls);
