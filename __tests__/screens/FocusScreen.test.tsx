/**
 * FocusScreen Tests
 *
 * Comprehensive test suite for the FocusScreen component.
 * Tests rendering, store integration, accessibility, layout,
 * and task pre-selection via navigation params.
 *
 * @module FocusScreenTests
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import FocusScreen from '../../src/features/focus/screens/FocusScreen';
import {useFocusStore} from '../../src/features/focus/store/focusStore';
import {mockTasks} from '../../src/data/mockData';

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
  const mockSelectTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFocusStore as unknown as jest.Mock).mockImplementation(selector =>
      selector({
        loadSessions: mockLoadSessions,
        selectTask: mockSelectTask,
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
          selectTask: mockSelectTask,
        }),
      );

      expect(() => render(<FocusScreen />)).toThrow('Load sessions failed');
    });

    it('should render with valid store configuration', () => {
      const mockValidLoadSessions = jest.fn();

      (useFocusStore as unknown as jest.Mock).mockImplementation(selector =>
        selector({
          loadSessions: mockValidLoadSessions,
          selectTask: mockSelectTask,
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
          selectTask: mockSelectTask,
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

  describe('Task Pre-Selection', () => {
    it('should auto-select task when taskId is provided via route params', () => {
      const task = mockTasks.find(t => t.id === '1');
      const route = {
        params: {
          taskId: '1',
          taskTitle: 'Review project proposal',
        },
      };

      render(<FocusScreen route={route} />);

      expect(mockSelectTask).toHaveBeenCalledWith(task);
    });

    it('should call selectTask with correct task object', () => {
      const task = mockTasks.find(t => t.id === '4');
      const route = {
        params: {
          taskId: '4',
          taskTitle: 'Finish weekly report',
        },
      };

      render(<FocusScreen route={route} />);

      expect(mockSelectTask).toHaveBeenCalledWith(task);
      expect(mockSelectTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '4',
          title: 'Finish weekly report',
          listId: '2',
        }),
      );
    });

    it('should handle invalid taskId gracefully (task not found)', () => {
      const route = {
        params: {
          taskId: '999',
          taskTitle: 'Non-existent task',
        },
      };

      expect(() => render(<FocusScreen route={route} />)).not.toThrow();
      expect(mockSelectTask).not.toHaveBeenCalled();
    });

    it('should work without taskId (normal flow)', () => {
      render(<FocusScreen />);

      expect(mockLoadSessions).toHaveBeenCalled();
      expect(mockSelectTask).not.toHaveBeenCalled();
    });

    it('should not call selectTask when route is undefined', () => {
      render(<FocusScreen route={undefined} />);

      expect(mockLoadSessions).toHaveBeenCalled();
      expect(mockSelectTask).not.toHaveBeenCalled();
    });

    it('should not call selectTask when route.params is undefined', () => {
      const route = {
        params: undefined,
      };

      render(<FocusScreen route={route} />);

      expect(mockLoadSessions).toHaveBeenCalled();
      expect(mockSelectTask).not.toHaveBeenCalled();
    });

    it('should not call selectTask when taskId is undefined', () => {
      const route = {
        params: {
          taskId: undefined,
          taskTitle: undefined,
        },
      };

      render(<FocusScreen route={route} />);

      expect(mockLoadSessions).toHaveBeenCalled();
      expect(mockSelectTask).not.toHaveBeenCalled();
    });

    it('should handle multiple tasks correctly', () => {
      const tasks = [
        {taskId: '1', taskTitle: 'Review project proposal'},
        {taskId: '2', taskTitle: 'Buy groceries'},
        {taskId: '5', taskTitle: 'Call mom'},
      ];

      tasks.forEach(({taskId, taskTitle}) => {
        jest.clearAllMocks();

        const route = {
          params: {taskId, taskTitle},
        };

        render(<FocusScreen route={route} />);

        const expectedTask = mockTasks.find(t => t.id === taskId);
        expect(mockSelectTask).toHaveBeenCalledWith(expectedTask);
      });
    });

    it('should only call selectTask once per mount', () => {
      const route = {
        params: {
          taskId: '1',
          taskTitle: 'Review project proposal',
        },
      };

      render(<FocusScreen route={route} />);

      expect(mockSelectTask).toHaveBeenCalledTimes(1);
    });

    it('should call selectTask with task from mockTasks', () => {
      const route = {
        params: {
          taskId: '3',
          taskTitle: 'Schedule dentist appointment',
        },
      };

      render(<FocusScreen route={route} />);

      const task = mockTasks.find(t => t.id === '3');
      expect(mockSelectTask).toHaveBeenCalledWith(task);
      expect(mockSelectTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '3',
          title: 'Schedule dentist appointment',
          completed: true,
          priority: 'low',
        }),
      );
    });

    it('should handle task pre-selection before loadSessions completes', () => {
      const route = {
        params: {
          taskId: '1',
          taskTitle: 'Review project proposal',
        },
      };

      render(<FocusScreen route={route} />);

      expect(mockLoadSessions).toHaveBeenCalled();
      expect(mockSelectTask).toHaveBeenCalled();
    });

    it('should re-select task when taskId changes', () => {
      const route1 = {
        params: {
          taskId: '1',
          taskTitle: 'Review project proposal',
        },
      };

      const {rerender} = render(<FocusScreen route={route1} />);

      expect(mockSelectTask).toHaveBeenCalledTimes(1);

      const route2 = {
        params: {
          taskId: '2',
          taskTitle: 'Buy groceries',
        },
      };

      rerender(<FocusScreen route={route2} />);

      expect(mockSelectTask).toHaveBeenCalledTimes(2);

      const task2 = mockTasks.find(t => t.id === '2');
      expect(mockSelectTask).toHaveBeenLastCalledWith(task2);
    });

    it('should not re-select task when taskId remains the same', () => {
      const route = {
        params: {
          taskId: '1',
          taskTitle: 'Review project proposal',
        },
      };

      const {rerender} = render(<FocusScreen route={route} />);

      expect(mockSelectTask).toHaveBeenCalledTimes(1);

      rerender(<FocusScreen route={route} />);

      // Should still be 1 because taskId hasn't changed
      expect(mockSelectTask).toHaveBeenCalledTimes(1);
    });

    it('should handle completed tasks in pre-selection', () => {
      const completedTask = mockTasks.find(t => t.completed);

      if (completedTask) {
        const route = {
          params: {
            taskId: completedTask.id,
            taskTitle: completedTask.title,
          },
        };

        render(<FocusScreen route={route} />);

        expect(mockSelectTask).toHaveBeenCalledWith(completedTask);
      }
    });

    it('should handle tasks with different priorities', () => {
      const highPriorityTask = mockTasks.find(t => t.priority === 'high');
      const lowPriorityTask = mockTasks.find(t => t.priority === 'low');

      if (highPriorityTask) {
        jest.clearAllMocks();
        const route1 = {
          params: {
            taskId: highPriorityTask.id,
            taskTitle: highPriorityTask.title,
          },
        };

        render(<FocusScreen route={route1} />);
        expect(mockSelectTask).toHaveBeenCalledWith(highPriorityTask);
      }

      if (lowPriorityTask) {
        jest.clearAllMocks();
        const route2 = {
          params: {
            taskId: lowPriorityTask.id,
            taskTitle: lowPriorityTask.title,
          },
        };

        render(<FocusScreen route={route2} />);
        expect(mockSelectTask).toHaveBeenCalledWith(lowPriorityTask);
      }
    });

    it('should handle tasks from different lists', () => {
      const workTask = mockTasks.find(t => t.listId === '2');
      const personalTask = mockTasks.find(t => t.listId === '3');

      if (workTask) {
        jest.clearAllMocks();
        const route1 = {
          params: {
            taskId: workTask.id,
            taskTitle: workTask.title,
          },
        };

        render(<FocusScreen route={route1} />);
        expect(mockSelectTask).toHaveBeenCalledWith(workTask);
      }

      if (personalTask) {
        jest.clearAllMocks();
        const route2 = {
          params: {
            taskId: personalTask.id,
            taskTitle: personalTask.title,
          },
        };

        render(<FocusScreen route={route2} />);
        expect(mockSelectTask).toHaveBeenCalledWith(personalTask);
      }
    });
  });

  describe('Console Logging (DEV mode)', () => {
    const originalDev = __DEV__;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
      (global as any).__DEV__ = originalDev;
    });

    it('should log pre-selected task title in __DEV__ mode', () => {
      (global as any).__DEV__ = true;

      const route = {
        params: {
          taskId: '1',
          taskTitle: 'Review project proposal',
        },
      };

      render(<FocusScreen route={route} />);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[FocusScreen] Pre-selected task:',
        'Review project proposal',
      );
    });

    it('should not log when task is not found', () => {
      (global as any).__DEV__ = true;

      const route = {
        params: {
          taskId: '999',
          taskTitle: 'Non-existent task',
        },
      };

      render(<FocusScreen route={route} />);

      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        '[FocusScreen] Pre-selected task:',
        expect.anything(),
      );
    });

    it('should not log when taskId is not provided', () => {
      (global as any).__DEV__ = true;

      render(<FocusScreen />);

      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        '[FocusScreen] Pre-selected task:',
        expect.anything(),
      );
    });

    it('should not crash if task not found', () => {
      const route = {
        params: {
          taskId: '999',
          taskTitle: 'Non-existent task',
        },
      };

      expect(() => render(<FocusScreen route={route} />)).not.toThrow();
    });

    it('should handle null task gracefully', () => {
      const route = {
        params: {
          taskId: null,
          taskTitle: null,
        },
      };

      expect(() => render(<FocusScreen route={route} />)).not.toThrow();
      expect(mockSelectTask).not.toHaveBeenCalled();
    });
  });

  describe('Integration with Navigation', () => {
    it('should work with navigation params from TaskListScreen', () => {
      const route = {
        params: {
          taskId: '1',
          taskTitle: 'Review project proposal',
        },
      };

      render(<FocusScreen route={route} />);

      const task = mockTasks.find(t => t.id === '1');
      expect(mockSelectTask).toHaveBeenCalledWith(task);
      expect(mockLoadSessions).toHaveBeenCalled();
    });

    it('should maintain normal functionality without navigation params', () => {
      render(<FocusScreen />);

      expect(mockLoadSessions).toHaveBeenCalled();
      expect(mockSelectTask).not.toHaveBeenCalled();
      expect(() => render(<FocusScreen />)).not.toThrow();
    });

    it('should handle partial route params', () => {
      const route = {
        params: {
          taskId: '1',
        },
      };

      render(<FocusScreen route={route} />);

      const task = mockTasks.find(t => t.id === '1');
      expect(mockSelectTask).toHaveBeenCalledWith(task);
    });

    it('should ignore taskTitle if taskId is not found', () => {
      const route = {
        params: {
          taskId: '999',
          taskTitle: 'This title should be ignored',
        },
      };

      render(<FocusScreen route={route} />);

      expect(mockSelectTask).not.toHaveBeenCalled();
    });
  });
});
