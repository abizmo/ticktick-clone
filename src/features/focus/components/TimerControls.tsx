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

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
  Platform,
} from 'react-native';
import {useFocusStore} from '../store/focusStore';

/**
 * TimerControls Component
 *
 * Renders control buttons for the Focus timer with proper state management
 * and user feedback.
 *
 * @returns React.JSX.Element
 */
const TimerControls: React.FC = (): React.JSX.Element => {
  // Subscribe to store state and actions
  const timerState = useFocusStore(state => state.timerState);
  const settings = useFocusStore(state => state.settings);
  const currentSession = useFocusStore(state => state.currentSession);
  const startFocus = useFocusStore(state => state.startFocus);
  const pauseFocus = useFocusStore(state => state.pauseFocus);
  const resumeFocus = useFocusStore(state => state.resumeFocus);
  const stopFocus = useFocusStore(state => state.stopFocus);

  // Local state for button interactions
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handle start button press
   */
  const handleStart = async (): Promise<void> => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      // Provide tactile feedback
      if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      }

      await startFocus();
    } catch (error) {
      console.error('[TimerControls] Error starting focus:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle pause button press
   */
  const handlePause = (): void => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      // Provide tactile feedback
      if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      }

      pauseFocus();
    } catch (error) {
      console.error('[TimerControls] Error pausing focus:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle resume button press
   */
  const handleResume = (): void => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      // Provide tactile feedback
      if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      }

      resumeFocus();
    } catch (error) {
      console.error('[TimerControls] Error resuming focus:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle stop button press with optional confirmation
   */
  const handleStop = (): void => {
    if (isProcessing) {
      return;
    }

    const performStop = async (): Promise<void> => {
      try {
        setIsProcessing(true);

        // Provide tactile feedback
        if (Platform.OS === 'ios') {
          Vibration.vibrate(100);
        }

        await stopFocus();
      } catch (error) {
        console.error('[TimerControls] Error stopping focus:', error);
      } finally {
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
            onPress: () => setIsProcessing(false),
          },
          {
            text: 'Stop',
            style: 'destructive',
            onPress: performStop,
          },
        ],
        {cancelable: true, onDismiss: () => setIsProcessing(false)},
      );
    } else {
      performStop();
    }
  };

  /**
   * Check if pause button should be disabled
   */
  const isPauseDisabled = (): boolean => {
    return timerState.pausesUsed >= settings.maxPausesPerSession;
  };

  /**
   * Get pause counter text
   */
  const getPauseCounterText = (): string => {
    return `${timerState.pausesUsed}/${settings.maxPausesPerSession} pauses`;
  };

  // Render different button sets based on timer status
  const renderControls = (): React.JSX.Element => {
    switch (timerState.status) {
      case 'idle':
        return (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleStart}
            disabled={isProcessing}
            accessibilityLabel="Start Focus session"
            accessibilityRole="button"
            accessibilityHint="Begins a new Focus session with the current settings">
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Start
            </Text>
          </TouchableOpacity>
        );

      case 'running':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                isPauseDisabled() && styles.disabledButton,
              ]}
              onPress={handlePause}
              disabled={isProcessing || isPauseDisabled()}
              accessibilityLabel={
                isPauseDisabled()
                  ? 'Pause limit reached'
                  : 'Pause Focus session'
              }
              accessibilityRole="button"
              accessibilityHint={
                isPauseDisabled()
                  ? 'You have reached the maximum number of pauses for this session'
                  : 'Temporarily pauses the current Focus session'
              }>
              <Text
                style={[
                  styles.buttonText,
                  styles.secondaryButtonText,
                  isPauseDisabled() && styles.disabledButtonText,
                ]}>
                Pause
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.destructiveButton]}
              onPress={handleStop}
              disabled={isProcessing}
              accessibilityLabel="Stop Focus session"
              accessibilityRole="button"
              accessibilityHint="Ends the current Focus session and saves your progress">
              <Text style={[styles.buttonText, styles.destructiveButtonText]}>
                Stop
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'paused':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleResume}
              disabled={isProcessing}
              accessibilityLabel="Resume Focus session"
              accessibilityRole="button"
              accessibilityHint="Continues the paused Focus session">
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Resume
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.destructiveButton]}
              onPress={handleStop}
              disabled={isProcessing}
              accessibilityLabel="Stop Focus session"
              accessibilityRole="button"
              accessibilityHint="Ends the current Focus session and saves your progress">
              <Text style={[styles.buttonText, styles.destructiveButtonText]}>
                Stop
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return <View />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Pause Counter (only show when session is active) */}
      {currentSession && (
        <View style={styles.pauseCounter}>
          <Text
            style={[
              styles.pauseCounterText,
              isPauseDisabled() && styles.pauseCounterTextWarning,
            ]}
            accessibilityLabel={`Pauses used: ${getPauseCounterText()}`}
            accessibilityRole="text">
            {getPauseCounterText()}
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
    color: '#8E8E93',
    textAlign: 'center',
  },
  pauseCounterTextWarning: {
    color: '#FF3B30',
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
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
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
    color: '#007AFF',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#8E8E93',
  },
});

export default React.memo(TimerControls);
