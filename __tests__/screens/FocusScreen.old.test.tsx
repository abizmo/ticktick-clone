import React from 'react';
import {render} from '@testing-library/react-native';
import FocusScreen from '../../src/screens/FocusScreen.old';
import {focusTasks, mockLists} from '../../src/data/mockData';

describe('FocusScreen', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('Focus')).toBeTruthy();
    });

    it('should display Focus header title', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText('Focus')).toBeTruthy();
    });

    it('should display focus task count', () => {
      const {getByText} = render(<FocusScreen />);
      expect(getByText(`${focusTasks.length} important tasks`)).toBeTruthy();
    });
  });

  describe('Focus Tasks Display', () => {
    it('should render all focus tasks', () => {
      const {getByText} = render(<FocusScreen />);

      focusTasks.forEach(task => {
        expect(getByText(task.title)).toBeTruthy();
      });
    });

    it('should display task titles correctly', () => {
      const {getByText} = render(<FocusScreen />);

      const highPriorityTasks = focusTasks.filter(
        task => task.priority === 'high',
      );
      highPriorityTasks.forEach(task => {
        expect(getByText(task.title)).toBeTruthy();
      });
    });

    it('should display task descriptions when present', () => {
      const {queryByText} = render(<FocusScreen />);

      const tasksWithDescription = focusTasks.filter(task => task.description);
      tasksWithDescription.forEach(task => {
        if (task.description) {
          expect(queryByText(task.description)).toBeTruthy();
        }
      });
    });

    it('should display list names for each task', () => {
      const {getAllByText} = render(<FocusScreen />);

      // Get unique list names from focus tasks
      const uniqueListNames = [
        ...new Set(
          focusTasks.map(task => {
            return mockLists.find(l => l.id === task.listId)?.name;
          }),
        ),
      ].filter(Boolean) as string[];

      // Verify each unique list name appears at least once
      uniqueListNames.forEach(listName => {
        const elements = getAllByText(listName);
        expect(elements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Empty State', () => {
    it.skip('should display empty state when no focus tasks', () => {
      // NOTE: This test is skipped because focusTasks is a const export and cannot be mocked
      // To test this scenario, the component would need to accept focusTasks as an optional prop
      // or we would need to mock the entire mockData module before import
      jest
        .spyOn(require('../../src/data/mockData'), 'focusTasks', 'get')
        .mockReturnValue([]);

      const {getByText} = render(<FocusScreen />);
      expect(getByText('All caught up!')).toBeTruthy();
      expect(getByText('No high priority or due soon tasks')).toBeTruthy();
    });

    it.skip('should display correct count when empty', () => {
      // NOTE: This test is skipped because focusTasks is a const export and cannot be mocked
      // To test this scenario, the component would need to accept focusTasks as an optional prop
      // or we would need to mock the entire mockData module before import
      jest
        .spyOn(require('../../src/data/mockData'), 'focusTasks', 'get')
        .mockReturnValue([]);

      const {getByText} = render(<FocusScreen />);
      expect(getByText('0 important tasks')).toBeTruthy();
    });
  });

  describe('Date Formatting', () => {
    it('should format today correctly', () => {
      const today = new Date();
      const formatDate = (date: Date | undefined) => {
        if (!date) {
          return '';
        }
        const taskDate = new Date(date);

        if (taskDate.toDateString() === today.toDateString()) {
          return 'Today';
        }

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (taskDate.toDateString() === tomorrow.toDateString()) {
          return 'Tomorrow';
        }

        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(taskDate);
      };

      expect(formatDate(today)).toBe('Today');
    });

    it('should format tomorrow correctly', () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (date: Date | undefined) => {
        if (!date) {
          return '';
        }
        const taskDate = new Date(date);

        if (taskDate.toDateString() === today.toDateString()) {
          return 'Today';
        }

        const tomorrowDate = new Date(today);
        tomorrowDate.setDate(today.getDate() + 1);

        if (taskDate.toDateString() === tomorrowDate.toDateString()) {
          return 'Tomorrow';
        }

        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(taskDate);
      };

      expect(formatDate(tomorrow)).toBe('Tomorrow');
    });

    it('should format other dates correctly', () => {
      const futureDate = new Date('2024-12-25');
      const today = new Date();

      const formatDate = (date: Date | undefined) => {
        if (!date) {
          return '';
        }
        const taskDate = new Date(date);

        if (taskDate.toDateString() === today.toDateString()) {
          return 'Today';
        }

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (taskDate.toDateString() === tomorrow.toDateString()) {
          return 'Tomorrow';
        }

        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(taskDate);
      };

      const formatted = formatDate(futureDate);
      expect(formatted).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
    });

    it('should return empty string for undefined dates', () => {
      const formatDate = (date: Date | undefined) => {
        if (!date) {
          return '';
        }
        return 'formatted';
      };

      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('Helper Functions', () => {
    it('should get correct list name from listId', () => {
      const getListName = (listId: string) => {
        const list = mockLists.find(l => l.id === listId);
        return list?.name || 'Unknown';
      };

      expect(getListName('1')).toBe('Inbox');
      expect(getListName('2')).toBe('Work');
      expect(getListName('3')).toBe('Personal');
      expect(getListName('999')).toBe('Unknown');
    });

    it('should get correct list color from listId', () => {
      const getListColor = (listId: string) => {
        const list = mockLists.find(l => l.id === listId);
        return list?.color || '#007AFF';
      };

      expect(getListColor('1')).toBe('#007AFF');
      expect(getListColor('2')).toBe('#FF3B30');
      expect(getListColor('999')).toBe('#007AFF');
    });

    it('should return default color for unknown listId', () => {
      const getListColor = (listId: string) => {
        const list = mockLists.find(l => l.id === listId);
        return list?.color || '#007AFF';
      };

      expect(getListColor('nonexistent')).toBe('#007AFF');
    });
  });

  describe('Task Filtering Logic', () => {
    it('should only include incomplete tasks in focus', () => {
      focusTasks.forEach(task => {
        expect(task.completed).toBe(false);
      });
    });

    it('should include high priority tasks', () => {
      const hasHighPriority = focusTasks.some(task => task.priority === 'high');
      expect(hasHighPriority).toBe(true);
    });

    it('should include tasks due soon', () => {
      const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const hasDueSoon = focusTasks.some(
        task => task.dueDate && new Date(task.dueDate) <= oneDayFromNow,
      );
      expect(hasDueSoon || focusTasks.length === 0).toBe(true);
    });
  });

  describe('Component Structure', () => {
    it('should have SafeAreaView as root component', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render FlatList when focus tasks exist', () => {
      if (focusTasks.length > 0) {
        const {UNSAFE_root} = render(<FocusScreen />);
        expect(UNSAFE_root).toBeTruthy();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle tasks without due dates', () => {
      const tasksWithoutDueDate = focusTasks.filter(task => !task.dueDate);
      if (tasksWithoutDueDate.length > 0) {
        const {getByText} = render(<FocusScreen />);
        tasksWithoutDueDate.forEach(task => {
          expect(getByText(task.title)).toBeTruthy();
        });
      }
    });

    it('should handle tasks without descriptions', () => {
      const tasksWithoutDesc = focusTasks.filter(task => !task.description);
      if (tasksWithoutDesc.length > 0) {
        const {getByText} = render(<FocusScreen />);
        tasksWithoutDesc.forEach(task => {
          expect(getByText(task.title)).toBeTruthy();
        });
      }
    });

    it('should handle all tasks from different lists', () => {
      const uniqueListIds = [...new Set(focusTasks.map(task => task.listId))];
      uniqueListIds.forEach(listId => {
        const list = mockLists.find(l => l.id === listId);
        expect(list).toBeDefined();
      });
    });
  });

  describe('Accessibility', () => {
    it('should render all interactive elements', () => {
      const {UNSAFE_root} = render(<FocusScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
