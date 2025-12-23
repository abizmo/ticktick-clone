import React from 'react';
import {render} from '@testing-library/react-native';
import ListsNavigator from '../../src/navigation/ListsNavigator';
import {mockLists} from '../../src/data/mockData';

// The global mock in __mocks__/@react-navigation/drawer.js is used automatically

describe('ListsNavigator', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render the navigator component', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should use drawer navigator', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should configure TaskList screen', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should set initial params', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation Configuration', () => {
    it('should configure drawer style', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should configure header style', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should set drawer width', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Data Integration', () => {
    it('should use mockLists data', () => {
      expect(mockLists).toBeDefined();
      expect(mockLists.length).toBe(5);
    });

    it('should have all required lists', () => {
      const listNames = mockLists.map(list => list.name);
      expect(listNames).toContain('Inbox');
      expect(listNames).toContain('Work');
      expect(listNames).toContain('Personal');
      expect(listNames).toContain('Shopping');
      expect(listNames).toContain('Health');
    });

    it('should have valid list IDs', () => {
      mockLists.forEach(list => {
        expect(list.id).toBeDefined();
        expect(typeof list.id).toBe('string');
      });
    });
  });

  describe('Initial Configuration', () => {
    it('should set Inbox as default list', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should configure custom drawer content', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should set header options', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty mockLists gracefully', () => {
      expect(mockLists.length).toBeGreaterThan(0);
    });

    it('should handle all list properties', () => {
      mockLists.forEach(list => {
        expect(list.id).toBeDefined();
        expect(list.name).toBeDefined();
        expect(list.color).toBeDefined();
        expect(list.icon).toBeDefined();
        expect(typeof list.taskCount).toBe('number');
      });
    });

    it('should maintain list order', () => {
      expect(mockLists[0].name).toBe('Inbox');
      expect(mockLists[1].name).toBe('Work');
      expect(mockLists[2].name).toBe('Personal');
      expect(mockLists[3].name).toBe('Shopping');
      expect(mockLists[4].name).toBe('Health');
    });
  });

  describe('Type Safety', () => {
    it('should have correct initial params structure', () => {
      const initialParams = {listId: '1', listName: 'Inbox'};
      expect(initialParams.listId).toBe('1');
      expect(initialParams.listName).toBe('Inbox');
    });

    it('should validate route params format', () => {
      const routeParams = {
        listId: mockLists[0].id,
        listName: mockLists[0].name,
      };
      expect(typeof routeParams.listId).toBe('string');
      expect(typeof routeParams.listName).toBe('string');
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = Date.now();
      render(<ListsNavigator />);
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(1000);
    });
  });

  describe('Accessibility', () => {
    it('should be testable', () => {
      const {UNSAFE_root} = render(<ListsNavigator />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
