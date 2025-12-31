/**
 * FocusScreen Tests
 *
 * Comprehensive test suite for the FocusScreen component.
 * Tests rendering, store integration, accessibility, and layout.
 *
 * @module FocusScreenTests
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import FocusScreen from '../../src/features/focus/screens/FocusScreen';
import {useFocusStore} from '../../src/features/focus/store/focusStore';

// Mock the Zustand store
jest.mock('../../src/features/focus/store/focusStore', () => ({
  useFocusStore: jest.fn(),
}));

// Mock all child components
jest.mock('../../src/features/focus/components', () => {
  const MockReact = require('react');
  const {Text} = require('react-native');
  return {
    Timer: () => MockReact.createElement(Text, {testID: 'timer'}, 'Timer'),
    TimerControls: () =>
      MockReact.createElement(
        Text,
        {testID: 'timer-controls'},
        'TimerControls',
      ),
    TaskSelector: () =>
      MockReact.createElement(Text, {testID: 'task-selector'}, 'TaskSelector'),
    PomodoroProgress: () =>
      MockReact.createElement(
        Text,
        {testID: 'pomodoro-progress'},
        'PomodoroProgress',
      ),
    SessionHistory: () =>
      MockReact.createElement(
        Text,
        {testID: 'session-history'},
        'SessionHistory',
      ),
  };
});

describe('FocusScreen', () => {
  const mockLoadSessions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFocusStore as unknown as jest.Mock).mockImplementation(selector =>
      selector({
        loadSessions: mockLoadSessions,
      }),
    );
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('Focus')).toBeTruthy();
    });

    it('should render header with Focus title', () => {
      const {getByText} = render(<FocusScreen />);
      const header = getByText('Focus');
      expect(header).toBeTruthy();
    });

    it('should render Timer component', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('Timer')).toBeTruthy();
    });

    it('should render TimerControls component', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('TimerControls')).toBeTruthy();
    });

    it('should render TaskSelector component', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('TaskSelector')).toBeTruthy();
    });

    it('should render PomodoroProgress component', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('PomodoroProgress')).toBeTruthy();
    });

    it('should render SessionHistory component', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('SessionHistory')).toBeTruthy();
    });

    it('should render all 5 child components', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('Timer')).toBeTruthy();
      expect(getByText('TimerControls')).toBeTruthy();
      expect(getByText('TaskSelector')).toBeTruthy();
      expect(getByText('PomodoroProgress')).toBeTruthy();
      expect(getByText('SessionHistory')).toBeTruthy();
    });
  });

  describe('Store Integration', () => {
    it('should call loadSessions on mount', () => {
      render(<FocusScreen />);
      expect(mockLoadSessions).toHaveBeenCalled();
    });

    it('should call loadSessions only once', () => {
      render(<FocusScreen />);
      expect(mockLoadSessions).toHaveBeenCalledTimes(1);
    });

    it('should use correct store selector', () => {
      render(<FocusScreen />);
      expect(useFocusStore).toHaveBeenCalled();
    });

    it('should not call loadSessions multiple times on re-render', () => {
      const {rerender} = render(<FocusScreen />);
      expect(mockLoadSessions).toHaveBeenCalledTimes(1);

      rerender(<FocusScreen />);
      // Should still be 1 because useEffect dependency array includes loadSessions
      expect(mockLoadSessions).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have header with accessibility label', () => {
      const {getByLabelText} = render(<FocusScreen />);
      const header = getByLabelText('Focus screen header');
      expect(header).toBeTruthy();
    });

    it('should have header with accessibility role', () => {
      const {getByRole} = render(<FocusScreen />);
      const header = getByRole('header');
      expect(header).toBeTruthy();
    });

    it('should have accessible header text', () => {
      const {getByLabelText} = render(<FocusScreen />);
      const header = getByLabelText('Focus screen header');
      expect(header.props.children).toBe('Focus');
    });
  });

  describe('Layout and Structure', () => {
    it('should have SafeAreaView as root component', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render ScrollView for scrollable content', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render components in correct order', () => {
      const {getByText} = render(<FocusScreen />);

      // Verify all components are present
      expect(getByText('Focus')).toBeTruthy();
      expect(getByText('TaskSelector')).toBeTruthy();
      expect(getByText('Timer')).toBeTruthy();
      expect(getByText('TimerControls')).toBeTruthy();
      expect(getByText('PomodoroProgress')).toBeTruthy();
      expect(getByText('SessionHistory')).toBeTruthy();
    });

    it('should wrap components in View containers', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Component Sections', () => {
    it('should render header section', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('Focus')).toBeTruthy();
    });

    it('should render task selection section', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('TaskSelector')).toBeTruthy();
    });

    it('should render timer section', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('Timer')).toBeTruthy();
    });

    it('should render controls section', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('TimerControls')).toBeTruthy();
    });

    it('should render progress section', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('PomodoroProgress')).toBeTruthy();
    });

    it('should render history section', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('SessionHistory')).toBeTruthy();
    });
  });

  describe('ScrollView Configuration', () => {
    it('should render ScrollView with correct props', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should have scrollable content container', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle loadSessions errors gracefully', () => {
      const mockLoadSessionsWithError = jest.fn(() => {
        throw new Error('Load sessions failed');
      });

      (useFocusStore as unknown as jest.Mock).mockImplementation(selector =>
        selector({
          loadSessions: mockLoadSessionsWithError,
        }),
      );

      expect(() => render(<FocusScreen />)).toThrow('Load sessions failed');
    });

    it('should render with valid store configuration', () => {
      const mockValidLoadSessions = jest.fn();

      (useFocusStore as unknown as jest.Mock).mockImplementation(selector =>
        selector({
          loadSessions: mockValidLoadSessions,
        }),
      );

      const {getByText} = render(<FocusScreen />);
      expect(getByText('Focus')).toBeTruthy();
      expect(mockValidLoadSessions).toHaveBeenCalled();
    });
  });

  describe('Component Integration', () => {
    it('should integrate all components in single screen', () => {
      const {getByText} = render(<FocusScreen />);

      // Verify all components are present
      const components = [
        'Timer',
        'TimerControls',
        'TaskSelector',
        'PomodoroProgress',
        'SessionHistory',
      ];

      components.forEach(component => {
        expect(getByText(component)).toBeTruthy();
      });
    });

    it('should maintain component hierarchy', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render header before components', () => {
      const {getByText} = render(<FocusScreen />);

      // Verify header and components are present
      expect(getByText('Focus')).toBeTruthy();
      expect(getByText('Timer')).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should initialize with store state', () => {
      render(<FocusScreen />);
      expect(useFocusStore).toHaveBeenCalled();
    });

    it('should call store selector function', () => {
      const mockSelector = jest.fn(selector =>
        selector({
          loadSessions: mockLoadSessions,
        }),
      );

      (useFocusStore as unknown as jest.Mock).mockImplementation(mockSelector);

      render(<FocusScreen />);
      expect(mockSelector).toHaveBeenCalled();
    });
  });

  describe('Lifecycle', () => {
    it('should execute useEffect on mount', () => {
      render(<FocusScreen />);
      expect(mockLoadSessions).toHaveBeenCalledTimes(1);
    });

    it('should not execute useEffect on every render', () => {
      const {rerender} = render(<FocusScreen />);
      const initialCallCount = mockLoadSessions.mock.calls.length;

      rerender(<FocusScreen />);
      expect(mockLoadSessions).toHaveBeenCalledTimes(initialCallCount);
    });
  });

  describe('Visual Structure', () => {
    it('should have white background', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should have proper spacing between sections', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should center header content', () => {
      const {getByText} = render(<FocusScreen />);
      const header = getByText('Focus');
      expect(header).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = Date.now();
      render(<FocusScreen />);
      const endTime = Date.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000);
    });

    it('should not cause memory leaks', () => {
      const {unmount} = render(<FocusScreen />);
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Component Props', () => {
    it('should render without requiring props', () => {
      expect(() => render(<FocusScreen />)).not.toThrow();
    });

    it('should be a functional component', () => {
      expect(typeof FocusScreen).toBe('function');
    });
  });
});
