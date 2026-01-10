/**
 * Focus Settings Screen
 *
 * Allows users to configure Pomodoro timer settings including:
 * - Work duration (5-60 min, default: 25)
 * - Short break duration (1-30 min, default: 5)
 * - Long break duration (5-60 min, default: 15)
 * - Pomodoros before long break (2-8, default: 4)
 * - Max pauses per session (0-5, default: 3)
 * - Confirm stop toggle (default: true)
 *
 * @module FocusSettingsScreen
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useFocusStore} from '../store/focusStore';
import {
  DEFAULT_FOCUS_SETTINGS,
  VALIDATION_RANGES,
  isValidWorkDuration,
  isValidShortBreak,
  isValidLongBreak,
  isValidPomosBeforeLongBreak,
  isValidMaxPauses,
} from '../constants/defaults';
import ErrorBoundary from '../components/ErrorBoundary';
import logger from '../utils/logger';

/**
 * Props for FocusSettingsScreen component
 */
interface FocusSettingsScreenProps {
  navigation: {
    goBack: () => void;
  };
}

/**
 * Props for SettingInput component
 */
interface SettingInputProps {
  label: string;
  value: number;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  hint: string;
  hasError: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
}

/**
 * Reusable input component for numeric settings
 *
 * @param props - SettingInput props
 * @returns React.JSX.Element
 */
const SettingInput: React.FC<SettingInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  hint,
  hasError,
  accessibilityLabel,
  accessibilityHint,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, hasError && styles.textInputError]}
        value={value.toString()}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType="numeric"
        returnKeyType="done"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      />
      <Text style={[styles.hintText, hasError && styles.hintTextError]}>
        {hint}
      </Text>
    </View>
  );
};

/**
 * Section container component
 *
 * @param title - Section title
 * @param children - Section content
 * @returns React.JSX.Element
 */
const SettingSection: React.FC<{title: string; children: React.ReactNode}> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

/**
 * Focus Settings Screen Component
 *
 * Provides a settings interface for configuring Pomodoro timer parameters.
 * Matches the visual style of the main SettingsScreen component.
 *
 * @param props - FocusSettingsScreen props
 * @returns React.JSX.Element
 */
const FocusSettingsScreen: React.FC<FocusSettingsScreenProps> = ({
  navigation,
}) => {
  // Get settings from store
  const settings = useFocusStore(state => state.settings);
  const updateSettings = useFocusStore(state => state.updateSettings);

  // Local state for form inputs
  const [workDuration, setWorkDuration] = useState(settings.pomoWorkDuration);
  const [shortBreak, setShortBreak] = useState(settings.pomoShortBreak);
  const [longBreak, setLongBreak] = useState(settings.pomoLongBreak);
  const [pomosBeforeLongBreak, setPomosBeforeLongBreak] = useState(
    settings.pomosBeforeLongBreak,
  );
  const [maxPauses, setMaxPauses] = useState(settings.maxPausesPerSession);
  const [confirmStop, setConfirmStop] = useState(settings.confirmStop);

  // Error states for validation
  const [workDurationError, setWorkDurationError] = useState(false);
  const [shortBreakError, setShortBreakError] = useState(false);
  const [longBreakError, setLongBreakError] = useState(false);
  const [pomosBeforeLongBreakError, setPomosBeforeLongBreakError] =
    useState(false);
  const [maxPausesError, setMaxPausesError] = useState(false);

  // Update local state when store settings change
  useEffect(() => {
    setWorkDuration(settings.pomoWorkDuration);
    setShortBreak(settings.pomoShortBreak);
    setLongBreak(settings.pomoLongBreak);
    setPomosBeforeLongBreak(settings.pomosBeforeLongBreak);
    setMaxPauses(settings.maxPausesPerSession);
    setConfirmStop(settings.confirmStop);
  }, [settings]);

  /**
   * Handle work duration change and validation
   *
   * @param text - Input text
   */
  const handleWorkDurationChange = (text: string) => {
    const value = parseInt(text, 10) || 0;
    setWorkDuration(value);
  };

  /**
   * Validate and save work duration
   */
  const handleWorkDurationBlur = async () => {
    const isValid = isValidWorkDuration(workDuration);
    setWorkDurationError(!isValid);

    if (isValid) {
      try {
        await updateSettings({pomoWorkDuration: workDuration});
        AccessibilityInfo.announceForAccessibility(
          `Work duration updated to ${workDuration} minutes`,
        );
      } catch (error) {
        logger.error('Failed to update work duration', {
          component: 'FocusSettingsScreen',
          action: 'handleWorkDurationBlur',
          error,
          data: {workDuration},
        });
        Alert.alert(
          'Error',
          'Failed to save work duration. Please try again.',
          [{text: 'OK'}],
        );
        AccessibilityInfo.announceForAccessibility(
          'Failed to update work duration',
        );
      }
    } else {
      AccessibilityInfo.announceForAccessibility(
        `Invalid work duration. Please enter a value between ${VALIDATION_RANGES.workDuration.min} and ${VALIDATION_RANGES.workDuration.max} minutes`,
      );
    }
  };

  /**
   * Handle short break change and validation
   *
   * @param text - Input text
   */
  const handleShortBreakChange = (text: string) => {
    const value = parseInt(text, 10) || 0;
    setShortBreak(value);
  };

  /**
   * Validate and save short break
   */
  const handleShortBreakBlur = async () => {
    const isValid = isValidShortBreak(shortBreak);
    setShortBreakError(!isValid);

    if (isValid) {
      try {
        await updateSettings({pomoShortBreak: shortBreak});
        AccessibilityInfo.announceForAccessibility(
          `Short break duration updated to ${shortBreak} minutes`,
        );
      } catch (error) {
        logger.error('Failed to update short break', {
          component: 'FocusSettingsScreen',
          action: 'handleShortBreakBlur',
          error,
          data: {shortBreak},
        });
        Alert.alert(
          'Error',
          'Failed to save short break duration. Please try again.',
          [{text: 'OK'}],
        );
        AccessibilityInfo.announceForAccessibility(
          'Failed to update short break duration',
        );
      }
    } else {
      AccessibilityInfo.announceForAccessibility(
        `Invalid short break duration. Please enter a value between ${VALIDATION_RANGES.shortBreak.min} and ${VALIDATION_RANGES.shortBreak.max} minutes`,
      );
    }
  };

  /**
   * Handle long break change and validation
   *
   * @param text - Input text
   */
  const handleLongBreakChange = (text: string) => {
    const value = parseInt(text, 10) || 0;
    setLongBreak(value);
  };

  /**
   * Validate and save long break
   */
  const handleLongBreakBlur = async () => {
    const isValid = isValidLongBreak(longBreak);
    setLongBreakError(!isValid);

    if (isValid) {
      try {
        await updateSettings({pomoLongBreak: longBreak});
        AccessibilityInfo.announceForAccessibility(
          `Long break duration updated to ${longBreak} minutes`,
        );
      } catch (error) {
        logger.error('Failed to update long break', {
          component: 'FocusSettingsScreen',
          action: 'handleLongBreakBlur',
          error,
          data: {longBreak},
        });
        Alert.alert(
          'Error',
          'Failed to save long break duration. Please try again.',
          [{text: 'OK'}],
        );
        AccessibilityInfo.announceForAccessibility(
          'Failed to update long break duration',
        );
      }
    } else {
      AccessibilityInfo.announceForAccessibility(
        `Invalid long break duration. Please enter a value between ${VALIDATION_RANGES.longBreak.min} and ${VALIDATION_RANGES.longBreak.max} minutes`,
      );
    }
  };

  /**
   * Handle pomodoros before long break change and validation
   *
   * @param text - Input text
   */
  const handlePomosBeforeLongBreakChange = (text: string) => {
    const value = parseInt(text, 10) || 0;
    setPomosBeforeLongBreak(value);
  };

  /**
   * Validate and save pomodoros before long break
   */
  const handlePomosBeforeLongBreakBlur = async () => {
    const isValid = isValidPomosBeforeLongBreak(pomosBeforeLongBreak);
    setPomosBeforeLongBreakError(!isValid);

    if (isValid) {
      try {
        await updateSettings({pomosBeforeLongBreak});
        AccessibilityInfo.announceForAccessibility(
          `Pomodoros before long break updated to ${pomosBeforeLongBreak}`,
        );
      } catch (error) {
        logger.error('Failed to update pomodoros before long break', {
          component: 'FocusSettingsScreen',
          action: 'handlePomosBeforeLongBreakBlur',
          error,
          data: {pomosBeforeLongBreak},
        });
        Alert.alert(
          'Error',
          'Failed to save pomodoros before long break. Please try again.',
          [{text: 'OK'}],
        );
        AccessibilityInfo.announceForAccessibility(
          'Failed to update pomodoros before long break',
        );
      }
    } else {
      AccessibilityInfo.announceForAccessibility(
        `Invalid value. Please enter a number between ${VALIDATION_RANGES.pomosBeforeLongBreak.min} and ${VALIDATION_RANGES.pomosBeforeLongBreak.max}`,
      );
    }
  };

  /**
   * Handle max pauses change and validation
   *
   * @param text - Input text
   */
  const handleMaxPausesChange = (text: string) => {
    const value = parseInt(text, 10) || 0;
    setMaxPauses(value);
  };

  /**
   * Validate and save max pauses
   */
  const handleMaxPausesBlur = async () => {
    const isValid = isValidMaxPauses(maxPauses);
    setMaxPausesError(!isValid);

    if (isValid) {
      try {
        await updateSettings({maxPausesPerSession: maxPauses});
        AccessibilityInfo.announceForAccessibility(
          `Maximum pauses per session updated to ${maxPauses}`,
        );
      } catch (error) {
        logger.error('Failed to update max pauses', {
          component: 'FocusSettingsScreen',
          action: 'handleMaxPausesBlur',
          error,
          data: {maxPauses},
        });
        Alert.alert(
          'Error',
          'Failed to save maximum pauses. Please try again.',
          [{text: 'OK'}],
        );
        AccessibilityInfo.announceForAccessibility(
          'Failed to update maximum pauses',
        );
      }
    } else {
      AccessibilityInfo.announceForAccessibility(
        `Invalid value. Please enter a number between ${VALIDATION_RANGES.maxPauses.min} and ${VALIDATION_RANGES.maxPauses.max}`,
      );
    }
  };

  /**
   * Handle confirm stop toggle change
   *
   * @param value - Toggle value
   */
  const handleConfirmStopChange = async (value: boolean) => {
    setConfirmStop(value);
    try {
      await updateSettings({confirmStop: value});
      AccessibilityInfo.announceForAccessibility(
        `Confirm stop ${value ? 'enabled' : 'disabled'}`,
      );
    } catch (error) {
      logger.error('Failed to update confirm stop', {
        component: 'FocusSettingsScreen',
        action: 'handleConfirmStopChange',
        error,
        data: {confirmStop: value},
      });
      Alert.alert(
        'Error',
        'Failed to save confirm stop setting. Please try again.',
        [{text: 'OK'}],
      );
      AccessibilityInfo.announceForAccessibility(
        'Failed to update confirm stop setting',
      );
      // Revert on error
      setConfirmStop(!value);
    }
  };

  /**
   * Restore default settings
   */
  const handleRestoreDefaults = () => {
    Alert.alert(
      'Restaurar valores por defecto',
      '¿Estás seguro de que quieres restaurar todos los valores por defecto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateSettings(DEFAULT_FOCUS_SETTINGS);
              // Clear all error states
              setWorkDurationError(false);
              setShortBreakError(false);
              setLongBreakError(false);
              setPomosBeforeLongBreakError(false);
              setMaxPausesError(false);
            } catch (error) {
              logger.error('Failed to restore default settings', {
                component: 'FocusSettingsScreen',
                action: 'handleRestoreDefaults',
                error,
              });
              Alert.alert(
                'Error',
                'Failed to restore default settings. Please try again.',
                [{text: 'OK'}],
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('FocusSettingsScreen error caught by ErrorBoundary', {
          component: 'FocusSettingsScreen',
          action: 'render',
          error,
          data: {componentStack: errorInfo.componentStack},
        });
      }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigation.goBack}
            accessibilityLabel="Volver"
            accessibilityRole="button">
            <Icon name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Focus Settings</Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <SettingSection title="Duración de Intervalos">
            <SettingInput
              label="Trabajo"
              value={workDuration}
              onChangeText={handleWorkDurationChange}
              onBlur={handleWorkDurationBlur}
              hint={`${VALIDATION_RANGES.workDuration.min}-${VALIDATION_RANGES.workDuration.max} minutos`}
              hasError={workDurationError}
              accessibilityLabel="Duración del trabajo en minutos"
              accessibilityHint={`Debe estar entre ${VALIDATION_RANGES.workDuration.min} y ${VALIDATION_RANGES.workDuration.max} minutos`}
            />

            <SettingInput
              label="Descanso corto"
              value={shortBreak}
              onChangeText={handleShortBreakChange}
              onBlur={handleShortBreakBlur}
              hint={`${VALIDATION_RANGES.shortBreak.min}-${VALIDATION_RANGES.shortBreak.max} minutos`}
              hasError={shortBreakError}
              accessibilityLabel="Duración del descanso corto en minutos"
              accessibilityHint={`Debe estar entre ${VALIDATION_RANGES.shortBreak.min} y ${VALIDATION_RANGES.shortBreak.max} minutos`}
            />

            <SettingInput
              label="Descanso largo"
              value={longBreak}
              onChangeText={handleLongBreakChange}
              onBlur={handleLongBreakBlur}
              hint={`${VALIDATION_RANGES.longBreak.min}-${VALIDATION_RANGES.longBreak.max} minutos`}
              hasError={longBreakError}
              accessibilityLabel="Duración del descanso largo en minutos"
              accessibilityHint={`Debe estar entre ${VALIDATION_RANGES.longBreak.min} y ${VALIDATION_RANGES.longBreak.max} minutos`}
            />
          </SettingSection>

          <SettingSection title="Configuración de Pomodoro">
            <SettingInput
              label="Pomodoros antes de descanso largo"
              value={pomosBeforeLongBreak}
              onChangeText={handlePomosBeforeLongBreakChange}
              onBlur={handlePomosBeforeLongBreakBlur}
              hint={`${VALIDATION_RANGES.pomosBeforeLongBreak.min}-${VALIDATION_RANGES.pomosBeforeLongBreak.max} pomodoros`}
              hasError={pomosBeforeLongBreakError}
              accessibilityLabel="Número de pomodoros antes del descanso largo"
              accessibilityHint={`Debe estar entre ${VALIDATION_RANGES.pomosBeforeLongBreak.min} y ${VALIDATION_RANGES.pomosBeforeLongBreak.max}`}
            />

            <SettingInput
              label="Máximo de pausas"
              value={maxPauses}
              onChangeText={handleMaxPausesChange}
              onBlur={handleMaxPausesBlur}
              hint={`${VALIDATION_RANGES.maxPauses.min}-${VALIDATION_RANGES.maxPauses.max} pausas por sesión`}
              hasError={maxPausesError}
              accessibilityLabel="Máximo número de pausas por sesión"
              accessibilityHint={`Debe estar entre ${VALIDATION_RANGES.maxPauses.min} y ${VALIDATION_RANGES.maxPauses.max}`}
            />
          </SettingSection>

          <SettingSection title="Preferencias">
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>
                    Confirmar al detener sesión
                  </Text>
                  <Text style={styles.settingSubtitle}>
                    Pedir confirmación antes de detener una sesión activa
                  </Text>
                </View>
              </View>
              <Switch
                value={confirmStop}
                onValueChange={handleConfirmStopChange}
                trackColor={{false: '#e1e1e1', true: '#007AFF'}}
                thumbColor={confirmStop ? '#fff' : '#f4f3f4'}
                accessibilityLabel="Confirmar al detener sesión"
                accessibilityHint="Activa o desactiva la confirmación antes de detener una sesión"
                accessibilityRole="switch"
                accessibilityState={{checked: confirmStop}}
              />
            </View>
          </SettingSection>

          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestoreDefaults}
              accessibilityLabel="Restaurar valores por defecto"
              accessibilityHint="Restaura todas las configuraciones a sus valores por defecto"
              accessibilityRole="button">
              <Text style={styles.restoreButtonText}>
                Restaurar valores por defecto
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  sectionContent: {
    backgroundColor: 'white',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e1e1',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },
  textInputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  hintText: {
    fontSize: 14,
    color: '#666',
  },
  hintTextError: {
    color: '#FF3B30',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e1e1',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bottomSection: {
    padding: 20,
    marginBottom: 40,
  },
  restoreButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
});

export default FocusSettingsScreen;
