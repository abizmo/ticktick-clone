import {
  mockLists,
  mockTasks,
  focusTasks,
  Task,
  TaskList,
} from '../../src/data/mockData';

describe('mockData', () => {
  describe('TypeScript Interfaces', () => {
    it('should have valid Task interface properties', () => {
      const task: Task = mockTasks[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('listId');
      expect(task).toHaveProperty('createdAt');
    });

    it('should have valid TaskList interface properties', () => {
      const list: TaskList = mockLists[0];
      expect(list).toHaveProperty('id');
      expect(list).toHaveProperty('name');
      expect(list).toHaveProperty('color');
      expect(list).toHaveProperty('icon');
      expect(list).toHaveProperty('taskCount');
    });
  });

  describe('mockLists', () => {
    it('should export an array of lists', () => {
      expect(Array.isArray(mockLists)).toBe(true);
      expect(mockLists.length).toBeGreaterThan(0);
    });

    it('should have exactly 5 lists', () => {
      expect(mockLists.length).toBe(5);
    });

    it('should have all required properties for each list', () => {
      mockLists.forEach(list => {
        expect(list.id).toBeDefined();
        expect(list.name).toBeDefined();
        expect(list.color).toBeDefined();
        expect(list.icon).toBeDefined();
        expect(typeof list.taskCount).toBe('number');
      });
    });

    it('should have unique IDs for each list', () => {
      const ids = mockLists.map(list => list.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(mockLists.length);
    });

    it('should have valid color hex codes', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      mockLists.forEach(list => {
        expect(list.color).toMatch(hexColorRegex);
      });
    });

    it('should include expected default lists', () => {
      const listNames = mockLists.map(list => list.name);
      expect(listNames).toContain('Inbox');
      expect(listNames).toContain('Work');
      expect(listNames).toContain('Personal');
      expect(listNames).toContain('Shopping');
      expect(listNames).toContain('Health');
    });
  });

  describe('mockTasks', () => {
    it('should export an array of tasks', () => {
      expect(Array.isArray(mockTasks)).toBe(true);
      expect(mockTasks.length).toBeGreaterThan(0);
    });

    it('should have exactly 8 tasks', () => {
      expect(mockTasks.length).toBe(8);
    });

    it('should have all required properties for each task', () => {
      mockTasks.forEach(task => {
        expect(task.id).toBeDefined();
        expect(task.title).toBeDefined();
        expect(typeof task.completed).toBe('boolean');
        expect(task.priority).toBeDefined();
        expect(task.listId).toBeDefined();
        expect(task.createdAt).toBeInstanceOf(Date);
      });
    });

    it('should have unique IDs for each task', () => {
      const ids = mockTasks.map(task => task.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(mockTasks.length);
    });

    it('should have valid priority values', () => {
      const validPriorities = ['low', 'medium', 'high'];
      mockTasks.forEach(task => {
        expect(validPriorities).toContain(task.priority);
      });
    });

    it('should have tasks with all three priority levels', () => {
      const priorities = mockTasks.map(task => task.priority);
      expect(priorities).toContain('low');
      expect(priorities).toContain('medium');
      expect(priorities).toContain('high');
    });

    it('should have both completed and incomplete tasks', () => {
      const hasCompleted = mockTasks.some(task => task.completed);
      const hasIncomplete = mockTasks.some(task => !task.completed);
      expect(hasCompleted).toBe(true);
      expect(hasIncomplete).toBe(true);
    });

    it('should have tasks with and without due dates', () => {
      const hasDueDate = mockTasks.some(task => task.dueDate);
      const noDueDate = mockTasks.some(task => !task.dueDate);
      expect(hasDueDate).toBe(true);
      expect(noDueDate).toBe(true);
    });

    it('should have tasks with and without descriptions', () => {
      const hasDescription = mockTasks.some(task => task.description);
      const noDescription = mockTasks.some(task => !task.description);
      expect(hasDescription).toBe(true);
      expect(noDescription).toBe(true);
    });

    it('should have valid listId references', () => {
      const listIds = mockLists.map(list => list.id);
      mockTasks.forEach(task => {
        expect(listIds).toContain(task.listId);
      });
    });

    it('should have due dates as Date objects when present', () => {
      mockTasks
        .filter(task => task.dueDate)
        .forEach(task => {
          expect(task.dueDate).toBeInstanceOf(Date);
        });
    });

    it('should have createdAt dates before or equal to due dates', () => {
      mockTasks
        .filter(task => task.dueDate)
        .forEach(task => {
          expect(task.createdAt.getTime()).toBeLessThanOrEqual(
            task.dueDate!.getTime(),
          );
        });
    });
  });

  describe('focusTasks', () => {
    it('should export an array of focus tasks', () => {
      expect(Array.isArray(focusTasks)).toBe(true);
    });

    it('should only include incomplete tasks', () => {
      focusTasks.forEach(task => {
        expect(task.completed).toBe(false);
      });
    });

    it('should only include high priority or due soon tasks', () => {
      const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

      focusTasks.forEach(task => {
        const isHighPriority = task.priority === 'high';
        const isDueSoon =
          task.dueDate && new Date(task.dueDate) <= oneDayFromNow;
        expect(isHighPriority || isDueSoon).toBe(true);
      });
    });

    it('should be a subset of mockTasks', () => {
      const mockTaskIds = mockTasks.map(task => task.id);
      focusTasks.forEach(task => {
        expect(mockTaskIds).toContain(task.id);
      });
    });

    it('should not include completed tasks even if high priority', () => {
      const completedHighPriority = mockTasks.filter(
        task => task.completed && task.priority === 'high',
      );
      completedHighPriority.forEach(task => {
        expect(focusTasks).not.toContainEqual(task);
      });
    });

    it('should include all incomplete high priority tasks', () => {
      const incompleteHighPriority = mockTasks.filter(
        task => !task.completed && task.priority === 'high',
      );
      incompleteHighPriority.forEach(task => {
        expect(focusTasks).toContainEqual(task);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have consistent data between lists and tasks', () => {
      const listIds = mockLists.map(list => list.id);
      const uniqueListIdsInTasks = [
        ...new Set(mockTasks.map(task => task.listId)),
      ];

      uniqueListIdsInTasks.forEach(listId => {
        expect(listIds).toContain(listId);
      });
    });

    it('should not have null or undefined values in required fields', () => {
      mockTasks.forEach(task => {
        expect(task.id).not.toBeNull();
        expect(task.id).not.toBeUndefined();
        expect(task.title).not.toBeNull();
        expect(task.title).not.toBeUndefined();
        expect(task.listId).not.toBeNull();
        expect(task.listId).not.toBeUndefined();
      });

      mockLists.forEach(list => {
        expect(list.id).not.toBeNull();
        expect(list.id).not.toBeUndefined();
        expect(list.name).not.toBeNull();
        expect(list.name).not.toBeUndefined();
      });
    });

    it('should have non-empty string values for titles and names', () => {
      mockTasks.forEach(task => {
        expect(task.title.trim().length).toBeGreaterThan(0);
      });

      mockLists.forEach(list => {
        expect(list.name.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle tasks without optional fields', () => {
      const taskWithoutOptionals = mockTasks.find(
        task => !task.description && !task.dueDate,
      );
      expect(taskWithoutOptionals).toBeDefined();
      if (taskWithoutOptionals) {
        expect(taskWithoutOptionals.id).toBeDefined();
        expect(taskWithoutOptionals.title).toBeDefined();
        expect(typeof taskWithoutOptionals.completed).toBe('boolean');
      }
    });

    it('should maintain referential integrity', () => {
      const usedListIds = new Set(mockTasks.map(task => task.listId));
      usedListIds.forEach(listId => {
        const list = mockLists.find(l => l.id === listId);
        expect(list).toBeDefined();
      });
    });
  });
});
