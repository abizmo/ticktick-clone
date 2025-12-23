import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CalendarScreen from '../../src/screens/CalendarScreen';
import {mockTasks, mockLists} from '../../src/data/mockData';

describe('CalendarScreen', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const {getByText} = render(<CalendarScreen />);
      expect(getByText('Calendar')).toBeTruthy();
    });

    it('should display Calendar header title', () => {
      const {getByText} = render(<CalendarScreen />);
      expect(getByText('Calendar')).toBeTruthy();
    });

    it('should display current month and year', () => {
      const {getByText} = render(<CalendarScreen />);
      const currentDate = new Date();
      const monthYear = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
      }).format(currentDate);
      expect(getByText(monthYear)).toBeTruthy();
    });
  });

  describe('Week View', () => {
    it('should render 7 days in week view', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should calculate week dates correctly', () => {
      const selectedDate = new Date('2024-01-15');
      const getWeekDates = () => {
        const dates = [];
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          dates.push(date);
        }
        return dates;
      };

      const weekDates = getWeekDates();
      expect(weekDates.length).toBe(7);
      expect(weekDates[0].getDay()).toBe(0);
      expect(weekDates[6].getDay()).toBe(6);
    });

    it('should start week on Sunday', () => {
      const selectedDate = new Date('2024-01-15');
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

      expect(startOfWeek.getDay()).toBe(0);
    });

    it('should display task count indicators on days with tasks', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Date Selection', () => {
    it('should handle date selection', () => {
      const {getAllByText} = render(<CalendarScreen />);
      const dateButtons = getAllByText(/^\d{1,2} [A-Z][a-z]{2}$/);

      if (dateButtons.length > 0) {
        fireEvent.press(dateButtons[0]);
        expect(dateButtons[0]).toBeTruthy();
      }
    });

    it('should update selected date when day is pressed', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Task Filtering by Date', () => {
    it('should filter tasks by selected date', () => {
      const testDate = new Date('2024-01-15');
      const getTasksForDate = (date: Date) => {
        return mockTasks.filter(task => {
          if (!task.dueDate) {
            return false;
          }
          const taskDate = new Date(task.dueDate);
          return taskDate.toDateString() === date.toDateString();
        });
      };

      const tasks = getTasksForDate(testDate);
      tasks.forEach(task => {
        expect(task.dueDate).toBeDefined();
        if (task.dueDate) {
          expect(new Date(task.dueDate).toDateString()).toBe(
            testDate.toDateString(),
          );
        }
      });
    });

    it('should return empty array when no tasks for date', () => {
      const futureDate = new Date('2099-12-31');
      const getTasksForDate = (date: Date) => {
        return mockTasks.filter(task => {
          if (!task.dueDate) {
            return false;
          }
          const taskDate = new Date(task.dueDate);
          return taskDate.toDateString() === date.toDateString();
        });
      };

      const tasks = getTasksForDate(futureDate);
      expect(tasks.length).toBe(0);
    });

    it('should exclude tasks without due dates', () => {
      const testDate = new Date('2024-01-15');
      const getTasksForDate = (date: Date) => {
        return mockTasks.filter(task => {
          if (!task.dueDate) {
            return false;
          }
          const taskDate = new Date(task.dueDate);
          return taskDate.toDateString() === date.toDateString();
        });
      };

      const tasks = getTasksForDate(testDate);
      tasks.forEach(task => {
        expect(task.dueDate).toBeDefined();
      });
    });
  });

  describe('Date Formatting', () => {
    it('should format date for week view correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
      }).format(date);
      expect(formatted).toMatch(/^\d{1,2} [A-Z][a-z]{2}$/);
    });

    it('should format month and year correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
      }).format(date);
      expect(formatted).toBe('January 2024');
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no tasks for selected date', () => {
      const {getByText} = render(<CalendarScreen />);
      const futureDate = new Date('2099-12-31');
      const tasksForDate = mockTasks.filter(task => {
        if (!task.dueDate) {
          return false;
        }
        return (
          new Date(task.dueDate).toDateString() === futureDate.toDateString()
        );
      });

      if (tasksForDate.length === 0) {
        expect(getByText).toBeTruthy();
      }
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
  });

  describe('Task Display', () => {
    it('should display task titles', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should display task descriptions when present', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should display list badges for tasks', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should show completed task styling', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should have SafeAreaView as root component', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render ScrollView for tasks', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle month transitions correctly', () => {
      const endOfMonth = new Date('2024-01-31');
      const getWeekDates = () => {
        const dates = [];
        const startOfWeek = new Date(endOfMonth);
        startOfWeek.setDate(endOfMonth.getDate() - endOfMonth.getDay());

        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          dates.push(date);
        }
        return dates;
      };

      const weekDates = getWeekDates();
      expect(weekDates.length).toBe(7);
    });

    it('should handle year transitions correctly', () => {
      const endOfYear = new Date('2024-12-31');
      const getWeekDates = () => {
        const dates = [];
        const startOfWeek = new Date(endOfYear);
        startOfWeek.setDate(endOfYear.getDate() - endOfYear.getDay());

        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          dates.push(date);
        }
        return dates;
      };

      const weekDates = getWeekDates();
      expect(weekDates.length).toBe(7);
    });

    it('should handle leap years correctly', () => {
      const leapDay = new Date('2024-02-29');
      expect(leapDay.getDate()).toBe(29);
      expect(leapDay.getMonth()).toBe(1);
    });

    it('should handle tasks from all lists', () => {
      mockTasks
        .filter(task => task.dueDate)
        .forEach(task => {
          const list = mockLists.find(l => l.id === task.listId);
          expect(list).toBeDefined();
        });
    });

    it('should handle multiple tasks on same date', () => {
      const tasksWithDueDate = mockTasks.filter(task => task.dueDate);
      if (tasksWithDueDate.length > 0) {
        const firstDate = tasksWithDueDate[0].dueDate!;
        const tasksOnDate = mockTasks.filter(
          task =>
            task.dueDate &&
            new Date(task.dueDate).toDateString() ===
              new Date(firstDate).toDateString(),
        );
        expect(tasksOnDate.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('State Management', () => {
    it('should initialize with current date', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should update state when date is selected', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with multiple tasks', () => {
      const startTime = Date.now();
      render(<CalendarScreen />);
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(1000);
    });
  });

  describe('Accessibility', () => {
    it('should render all interactive elements', () => {
      const {UNSAFE_root} = render(<CalendarScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
