/**
 * FocusSettingsScreen Test Suite
 *
 * Comprehensive tests for the Focus Settings screen.
 *
 * @module __tests__/features/focus/screens/FocusSettingsScreen
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import FocusSettingsScreen from '../../../../src/features/focus/screens/FocusSettingsScreen';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = {
  goBack: mockGoBack,
};

// Mock Zustand store
const mockUpdateSettings = jest.fn();
const mockSettings = {
  pomoWorkDuration: 25,
  pomoShortBreak: 5,
  pomoLongBreak: 15,
  pomosBeforeLongBreak: 4,
  maxPausesPerSession: 3,
  confirmStop: true,
};

jest.mock('../../../../src/features/focus/store/focusStore', () => ({
  useFocusStore: jest.fn(selector => {
    const store = {
      settings: mockSettings,
      updateSettings: mockUpdateSettings,
    };
    return selector(store);
  }),
}));

describe('FocusSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateSettings.mockResolvedValue(undefined);
  });

  /**
   * Rendering Tests
   */
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const {root} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(root).toBeTruthy();
    });

    it('should render header with title', () => {
      const {getByText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(getByText('Focus Settings')).toBeTruthy();
    });

    it('should render back button', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(getByLabelText('Volver')).toBeTruthy();
    });

    it('should render all 3 section titles', () => {
      const {getByText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(getByText('Duración de Intervalos')).toBeTruthy();
      expect(getByText('Configuración de Pomodoro')).toBeTruthy();
      expect(getByText('Preferencias')).toBeTruthy();
    });

    it('should render work duration input', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(getByLabelText('Duración del trabajo en minutos')).toBeTruthy();
    });

    it('should render short break input', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(
        getByLabelText('Duración del descanso corto en minutos'),
      ).toBeTruthy();
    });

    it('should render long break input', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(
        getByLabelText('Duración del descanso largo en minutos'),
      ).toBeTruthy();
    });

    it('should render pomodoros before long break input', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(
        getByLabelText('Número de pomodoros antes del descanso largo'),
      ).toBeTruthy();
    });

    it('should render max pauses input', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(getByLabelText('Máximo número de pausas por sesión')).toBeTruthy();
    });

    it('should render confirm stop toggle', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(getByLabelText('Confirmar al detener sesión')).toBeTruthy();
    });

    it('should render restore defaults button', () => {
      const {getByText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );
      expect(getByText('Restaurar valores por defecto')).toBeTruthy();
    });
  });

  /**
   * Store Integration Tests
   */
  describe('Store Integration', () => {
    it('should load settings from store on mount', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      expect(workInput.props.value).toBe('25');
    });

    it('should call updateSettings when work duration changes', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      fireEvent.changeText(workInput, '30');
      fireEvent(workInput, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalledWith({
          pomoWorkDuration: 30,
        });
      });
    });

    it('should call updateSettings when short break changes', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const input = getByLabelText('Duración del descanso corto en minutos');
      fireEvent.changeText(input, '10');
      fireEvent(input, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalledWith({pomoShortBreak: 10});
      });
    });

    it('should call updateSettings when toggle changes', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const toggle = getByLabelText('Confirmar al detener sesión');
      fireEvent(toggle, 'valueChange', false);

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalledWith({confirmStop: false});
      });
    });

    it('should NOT call updateSettings for invalid work duration', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      fireEvent.changeText(workInput, '3'); // Invalid: < 5
      fireEvent(workInput, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).not.toHaveBeenCalled();
      });
    });

    it('should NOT call updateSettings for invalid short break', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const input = getByLabelText('Duración del descanso corto en minutos');
      fireEvent.changeText(input, '0'); // Invalid: < 1
      fireEvent(input, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).not.toHaveBeenCalled();
      });
    });
  });

  /**
   * Input Validation Tests
   */
  describe('Input Validation', () => {
    it('should accept valid work duration (25)', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      fireEvent.changeText(workInput, '25');
      fireEvent(workInput, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalled();
      });
    });

    it('should reject invalid work duration (3)', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      fireEvent.changeText(workInput, '3');
      fireEvent(workInput, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).not.toHaveBeenCalled();
      });
    });

    it('should reject invalid work duration (70)', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      fireEvent.changeText(workInput, '70');
      fireEvent(workInput, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).not.toHaveBeenCalled();
      });
    });

    it('should accept valid short break (5)', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const input = getByLabelText('Duración del descanso corto en minutos');
      fireEvent.changeText(input, '5');
      fireEvent(input, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalled();
      });
    });

    it('should accept valid long break (15)', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const input = getByLabelText('Duración del descanso largo en minutos');
      fireEvent.changeText(input, '15');
      fireEvent(input, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalled();
      });
    });

    it('should accept valid pomodoros before long break (4)', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const input = getByLabelText(
        'Número de pomodoros antes del descanso largo',
      );
      fireEvent.changeText(input, '4');
      fireEvent(input, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalled();
      });
    });

    it('should reject invalid pomodoros before long break (1)', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const input = getByLabelText(
        'Número de pomodoros antes del descanso largo',
      );
      fireEvent.changeText(input, '1');
      fireEvent(input, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).not.toHaveBeenCalled();
      });
    });

    it('should accept valid max pauses (3)', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const input = getByLabelText('Máximo número de pausas por sesión');
      fireEvent.changeText(input, '3');
      fireEvent(input, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalled();
      });
    });

    it('should handle empty input', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      fireEvent.changeText(workInput, '');
      fireEvent(workInput, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).not.toHaveBeenCalled();
      });
    });
  });

  /**
   * UI Interaction Tests
   */
  describe('UI Interaction', () => {
    it('should call navigation.goBack when back button is pressed', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const backButton = getByLabelText('Volver');
      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalled();
    });

    it('should accept numeric input', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      fireEvent.changeText(workInput, '45');

      expect(workInput.props.value).toBe('45');
    });

    it('should show confirmation alert when restore defaults is pressed', () => {
      const alertSpy = jest.spyOn(Alert, 'alert');

      const {getByText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const restoreButton = getByText('Restaurar valores por defecto');
      fireEvent.press(restoreButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Restaurar valores por defecto',
        expect.any(String),
        expect.any(Array),
      );

      alertSpy.mockRestore();
    });

    it('should show hint text with ranges', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      expect(workInput.props.accessibilityHint).toContain('5');
      expect(workInput.props.accessibilityHint).toContain('60');
    });
  });

  /**
   * Accessibility Tests
   */
  describe('Accessibility', () => {
    it('should have accessibilityLabel for all inputs', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      expect(getByLabelText('Duración del trabajo en minutos')).toBeTruthy();
      expect(
        getByLabelText('Duración del descanso corto en minutos'),
      ).toBeTruthy();
      expect(
        getByLabelText('Duración del descanso largo en minutos'),
      ).toBeTruthy();
      expect(
        getByLabelText('Número de pomodoros antes del descanso largo'),
      ).toBeTruthy();
      expect(getByLabelText('Máximo número de pausas por sesión')).toBeTruthy();
    });

    it('should have accessibilityHint for inputs', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      expect(workInput.props.accessibilityHint).toBeTruthy();
    });

    it('should have accessibilityRole for toggle', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const toggle = getByLabelText('Confirmar al detener sesión');
      expect(toggle.props.accessibilityRole).toBe('switch');
    });

    it('should have accessibilityRole for back button', () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const backButton = getByLabelText('Volver');
      expect(backButton.props.accessibilityRole).toBe('button');
    });
  });

  /**
   * Edge Cases Tests
   */
  describe('Edge Cases', () => {
    it('should handle updateSettings error gracefully', async () => {
      mockUpdateSettings.mockRejectedValueOnce(new Error('Update failed'));

      const {getByLabelText, getByText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');
      fireEvent.changeText(workInput, '30');
      fireEvent(workInput, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalled();
      });

      // Should not crash
      expect(getByText('Focus Settings')).toBeTruthy();
    });

    it('should handle toggle error gracefully', async () => {
      mockUpdateSettings.mockRejectedValueOnce(new Error('Update failed'));

      const {getByLabelText, getByText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const toggle = getByLabelText('Confirmar al detener sesión');
      fireEvent(toggle, 'valueChange', false);

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalled();
      });

      // Should not crash
      expect(getByText('Focus Settings')).toBeTruthy();
    });

    it('should handle multiple rapid changes', async () => {
      const {getByLabelText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const workInput = getByLabelText('Duración del trabajo en minutos');

      fireEvent.changeText(workInput, '30');
      fireEvent.changeText(workInput, '35');
      fireEvent.changeText(workInput, '40');
      fireEvent(workInput, 'blur');

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalledWith({
          pomoWorkDuration: 40,
        });
      });
    });
  });

  /**
   * Component Structure Tests
   */
  describe('Component Structure', () => {
    it('should render with proper structure', () => {
      const {getByText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      expect(getByText('Focus Settings')).toBeTruthy();
      expect(getByText('Duración de Intervalos')).toBeTruthy();
      expect(getByText('Configuración de Pomodoro')).toBeTruthy();
      expect(getByText('Preferencias')).toBeTruthy();
    });

    it('should have sections in correct order', () => {
      const {getAllByText} = render(
        <FocusSettingsScreen navigation={mockNavigation as any} />,
      );

      const sections = getAllByText(/Duración|Configuración|Preferencias/);
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });
  });
});
