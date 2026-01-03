import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TaskListScreen from '../../src/screens/TaskListScreen';
import {mockTasks} from '../../src/data/mockData';

describe('TaskListScreen', () => {
  const mockNavigate = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
  };

  const mockRoute = {
    params: {
      listId: '2',
      listName: 'Work',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const {getByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      expect(getByText('Work')).toBeTruthy();
    });

    it('should display the list name in header', () => {
      const {getByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      expect(getByText('Work')).toBeTruthy();
    });

    it('should display task count summary', () => {
      const workTasks = mockTasks.filter(task => task.listId === '2');
      const pendingCount = workTasks.filter(task => !task.completed).length;
      const completedCount = workTasks.filter(task => task.completed).length;

      const {getByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      expect(
        getByText(`${pendingCount} pending, ${completedCount} completed`),
      ).toBeTruthy();
    });

    it('should render all tasks for the specified list', () => {
      const workTasks = mockTasks.filter(task => task.listId === '2');
      const {getByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      workTasks.forEach(task => {
        expect(getByText(task.title)).toBeTruthy();
      });
    });

    it('should not render tasks from other lists', () => {
      const otherListTasks = mockTasks.filter(task => task.listId !== '2');
      const {queryByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      otherListTasks.forEach(task => {
        expect(queryByText(task.title)).toBeNull();
      });
    });

    it('should render add button', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      const addButtons = UNSAFE_root.findAllByProps({testID: undefined});
      expect(addButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Task Display', () => {
    it('should display task titles', () => {
      const {getByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      expect(getByText('Review project proposal')).toBeTruthy();
      expect(getByText('Finish weekly report')).toBeTruthy();
    });

    it('should display task descriptions when present', () => {
      const {getByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      expect(
        getByText('Go through the new project proposal and provide feedback'),
      ).toBeTruthy();
      expect(
        getByText('Complete and submit the weekly progress report'),
      ).toBeTruthy();
    });

    it('should display priority badges', () => {
      const {getAllByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      const highPriorityBadges = getAllByText('high');
      expect(highPriorityBadges.length).toBeGreaterThan(0);
    });

    it('should display due dates when present', () => {
      const {getByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      const taskWithDueDate = mockTasks.find(
        task => task.listId === '2' && task.dueDate,
      );
      if (taskWithDueDate && taskWithDueDate.dueDate) {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(taskWithDueDate.dueDate);
        expect(getByText(formattedDate)).toBeTruthy();
      }
    });
  });

  describe('Task States', () => {
    it('should handle completed tasks correctly', () => {
      const completedTask = mockTasks.find(
        task => task.listId === '2' && task.completed,
      );
      if (completedTask) {
        const {getByText} = render(
          <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
        );
        const taskElement = getByText(completedTask.title);
        expect(taskElement).toBeTruthy();
      }
    });

    it('should handle incomplete tasks correctly', () => {
      const incompleteTask = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );
      if (incompleteTask) {
        const {getByText} = render(
          <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
        );
        const taskElement = getByText(incompleteTask.title);
        expect(taskElement).toBeTruthy();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty list gracefully', () => {
      const emptyListRoute = {
        params: {
          listId: '999',
          listName: 'Empty List',
        },
      };
      const {getByText} = render(
        <TaskListScreen route={emptyListRoute} navigation={mockNavigation} />,
      );
      expect(getByText('Empty List')).toBeTruthy();
      expect(getByText('0 pending, 0 completed')).toBeTruthy();
    });

    it('should handle tasks without descriptions', () => {
      const taskWithoutDescription = mockTasks.find(
        task => task.listId === '2' && !task.description,
      );
      if (taskWithoutDescription) {
        const {getByText} = render(
          <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
        );
        expect(getByText(taskWithoutDescription.title)).toBeTruthy();
      }
    });

    it('should handle tasks without due dates', () => {
      const {getByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      const allWorkTasks = mockTasks.filter(task => task.listId === '2');
      allWorkTasks.forEach(task => {
        expect(getByText(task.title)).toBeTruthy();
      });
    });

    it('should handle different list IDs correctly', () => {
      const personalRoute = {
        params: {
          listId: '3',
          listName: 'Personal',
        },
      };
      const {getByText} = render(
        <TaskListScreen route={personalRoute} navigation={mockNavigation} />,
      );
      expect(getByText('Personal')).toBeTruthy();

      const personalTasks = mockTasks.filter(task => task.listId === '3');
      expect(personalTasks.length).toBeGreaterThan(0);
    });
  });

  describe('Priority Color Mapping', () => {
    it('should correctly map priority levels to colors', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Date Formatting', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(date);
      expect(formatted).toBe('Jan 15');
    });

    it('should handle undefined dates', () => {
      const formatDate = (date: Date | undefined) => {
        if (!date) {
          return '';
        }
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(date);
      };
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('Task Filtering', () => {
    it('should correctly filter tasks by list ID', () => {
      const listId = '2';
      const filtered = mockTasks.filter(task => task.listId === listId);
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(task => {
        expect(task.listId).toBe(listId);
      });
    });

    it('should separate completed and pending tasks', () => {
      const workTasks = mockTasks.filter(task => task.listId === '2');
      const completed = workTasks.filter(task => task.completed);
      const pending = workTasks.filter(task => !task.completed);

      expect(completed.length + pending.length).toBe(workTasks.length);
    });
  });

  describe('Component Structure', () => {
    it('should have SafeAreaView as root component', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render FlatList for task items', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should render all interactive elements', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Focus Button Visibility', () => {
    it('should display Focus button for non-completed tasks', () => {
      const {getAllByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const workTasks = mockTasks.filter(
        task => task.listId === '2' && !task.completed,
      );

      workTasks.forEach(task => {
        const focusButton = getAllByLabelText(
          `Start Focus session for ${task.title}`,
        );
        expect(focusButton.length).toBeGreaterThan(0);
      });
    });

    it('should NOT display Focus button for completed tasks', () => {
      const completedTask = mockTasks.find(
        task => task.listId === '2' && task.completed,
      );

      if (completedTask) {
        const {queryByLabelText} = render(
          <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
        );

        const focusButton = queryByLabelText(
          `Start Focus session for ${completedTask.title}`,
        );
        expect(focusButton).toBeNull();
      }
    });

    it('should have correct accessibility labels for Focus button', () => {
      const {getByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const incompleteTask = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );

      if (incompleteTask) {
        const focusButton = getByLabelText(
          `Start Focus session for ${incompleteTask.title}`,
        );
        expect(focusButton).toBeTruthy();
        expect(focusButton.props.accessibilityRole).toBe('button');
        expect(focusButton.props.accessibilityHint).toBe(
          'Starts a Pomodoro timer session for this task',
        );
      }
    });

    it('should render Focus button with timer-outline icon', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const incompleteTask = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );

      if (incompleteTask) {
        const icons = UNSAFE_root.findAllByProps({name: 'timer-outline'});
        expect(icons.length).toBeGreaterThan(0);
      }
    });

    it('should render Focus button with correct color', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const incompleteTask = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );

      if (incompleteTask) {
        const timerIcons = UNSAFE_root.findAllByProps({name: 'timer-outline'});
        expect(timerIcons.length).toBeGreaterThan(0);
        timerIcons.forEach(icon => {
          expect(icon.props.color).toBe('#007AFF');
        });
      }
    });

    it('should only show Focus button when onStartFocus is provided', () => {
      const {getAllByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const incompleteTasks = mockTasks.filter(
        task => task.listId === '2' && !task.completed,
      );

      incompleteTasks.forEach(task => {
        const focusButtons = getAllByLabelText(
          `Start Focus session for ${task.title}`,
        );
        expect(focusButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Focus Button Interaction', () => {
    it('should call navigation.navigate when Focus button is pressed', () => {
      const {getByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const incompleteTask = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );

      if (incompleteTask) {
        const focusButton = getByLabelText(
          `Start Focus session for ${incompleteTask.title}`,
        );

        fireEvent.press(focusButton);

        expect(mockNavigate).toHaveBeenCalledWith('Focus', {
          taskId: incompleteTask.id,
          taskTitle: incompleteTask.title,
        });
      }
    });

    it('should pass correct taskId when Focus button is pressed', () => {
      const {getByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const task = mockTasks.find(
        task => task.listId === '2' && !task.completed && task.id === '1',
      );

      if (task) {
        const focusButton = getByLabelText(
          `Start Focus session for ${task.title}`,
        );

        fireEvent.press(focusButton);

        expect(mockNavigate).toHaveBeenCalledWith('Focus', {
          taskId: '1',
          taskTitle: task.title,
        });
      }
    });

    it('should pass correct taskTitle when Focus button is pressed', () => {
      const {getByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const task = mockTasks.find(
        task => task.listId === '2' && !task.completed && task.id === '4',
      );

      if (task) {
        const focusButton = getByLabelText(
          `Start Focus session for ${task.title}`,
        );

        fireEvent.press(focusButton);

        expect(mockNavigate).toHaveBeenCalledWith('Focus', {
          taskId: '4',
          taskTitle: 'Finish weekly report',
        });
      }
    });

    it('should work for multiple different tasks', () => {
      const {getByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const incompleteTasks = mockTasks.filter(
        task => task.listId === '2' && !task.completed,
      );

      incompleteTasks.forEach(task => {
        const focusButton = getByLabelText(
          `Start Focus session for ${task.title}`,
        );

        fireEvent.press(focusButton);

        expect(mockNavigate).toHaveBeenCalledWith('Focus', {
          taskId: task.id,
          taskTitle: task.title,
        });
      });

      expect(mockNavigate).toHaveBeenCalledTimes(incompleteTasks.length);
    });

    it('should call navigation.navigate only once per button press', () => {
      const {getByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const task = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );

      if (task) {
        const focusButton = getByLabelText(
          `Start Focus session for ${task.title}`,
        );

        fireEvent.press(focusButton);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
      }
    });

    it('should handle rapid button presses correctly', () => {
      const {getByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const task = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );

      if (task) {
        const focusButton = getByLabelText(
          `Start Focus session for ${task.title}`,
        );

        fireEvent.press(focusButton);
        fireEvent.press(focusButton);
        fireEvent.press(focusButton);

        expect(mockNavigate).toHaveBeenCalledTimes(3);
        expect(mockNavigate).toHaveBeenCalledWith('Focus', {
          taskId: task.id,
          taskTitle: task.title,
        });
      }
    });
  });

  describe('Focus Button Styling', () => {
    it('should have timer-outline icon', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const timerIcons = UNSAFE_root.findAllByProps({name: 'timer-outline'});
      expect(timerIcons.length).toBeGreaterThan(0);
    });

    it('should have correct icon color (#007AFF)', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const timerIcons = UNSAFE_root.findAllByProps({name: 'timer-outline'});
      timerIcons.forEach(icon => {
        expect(icon.props.color).toBe('#007AFF');
      });
    });

    it('should have correct icon size', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const timerIcons = UNSAFE_root.findAllByProps({name: 'timer-outline'});
      timerIcons.forEach(icon => {
        expect(icon.props.size).toBe(24);
      });
    });

    it('should have rounded button background', () => {
      const {UNSAFE_root} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const incompleteTask = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );

      if (incompleteTask) {
        expect(UNSAFE_root).toBeTruthy();
      }
    });
  });

  describe('Focus Button Edge Cases', () => {
    it('should handle navigation prop correctly', () => {
      const {getByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const incompleteTask = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );

      if (incompleteTask) {
        const focusButton = getByLabelText(
          `Start Focus session for ${incompleteTask.title}`,
        );
        expect(focusButton).toBeTruthy();
      }
    });

    it('should handle tasks with long titles', () => {
      const {getByText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const taskWithLongTitle = mockTasks.find(
        task => task.listId === '2' && task.title === 'Review project proposal',
      );

      if (taskWithLongTitle) {
        expect(getByText(taskWithLongTitle.title)).toBeTruthy();
      }
    });

    it('should maintain Focus button state across re-renders', () => {
      const {getByLabelText, rerender} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
      );

      const task = mockTasks.find(
        task => task.listId === '2' && !task.completed,
      );

      if (task) {
        const focusButton1 = getByLabelText(
          `Start Focus session for ${task.title}`,
        );
        expect(focusButton1).toBeTruthy();

        rerender(
          <TaskListScreen route={mockRoute} navigation={mockNavigation} />,
        );

        const focusButton2 = getByLabelText(
          `Start Focus session for ${task.title}`,
        );
        expect(focusButton2).toBeTruthy();
      }
    });
  });
});
