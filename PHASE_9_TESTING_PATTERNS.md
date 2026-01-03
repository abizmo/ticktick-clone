# Phase 9 Testing Patterns - Task Integration

## Quick Reference for Testing Navigation & Route Parameters

This guide provides reusable patterns for testing the Phase 9 Task Integration feature.

---

## 1. Testing Navigation

### Setup Navigation Mock
```typescript
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

beforeEach(() => {
  jest.clearAllMocks();
});
```

### Test Navigation Call
```typescript
it('should navigate to Focus screen with task params', () => {
  const {getByLabelText} = render(
    <TaskListScreen route={mockRoute} navigation={mockNavigation} />
  );
  
  const focusButton = getByLabelText('Start Focus session for Review project proposal');
  fireEvent.press(focusButton);
  
  expect(mockNavigate).toHaveBeenCalledWith('Focus', {
    taskId: '1',
    taskTitle: 'Review project proposal',
  });
});
```

---

## 2. Testing Route Parameters

### Test Component with Route Params
```typescript
it('should auto-select task when taskId is provided', () => {
  const route = {
    params: {
      taskId: '1',
      taskTitle: 'Review project proposal',
    },
  };
  
  render(<FocusScreen route={route} />);
  
  const task = mockTasks.find(t => t.id === '1');
  expect(mockSelectTask).toHaveBeenCalledWith(task);
});
```

### Test Without Route Params
```typescript
it('should work without taskId (normal flow)', () => {
  render(<FocusScreen />);
  
  expect(mockLoadSessions).toHaveBeenCalled();
  expect(mockSelectTask).not.toHaveBeenCalled();
});
```

---

## 3. Testing Conditional Rendering

### Test Element Visibility
```typescript
it('should display Focus button for non-completed tasks', () => {
  const {getAllByLabelText} = render(
    <TaskListScreen route={mockRoute} navigation={mockNavigation} />
  );
  
  const incompleteTasks = mockTasks.filter(
    task => task.listId === '2' && !task.completed
  );
  
  incompleteTasks.forEach(task => {
    const focusButton = getAllByLabelText(
      `Start Focus session for ${task.title}`
    );
    expect(focusButton.length).toBeGreaterThan(0);
  });
});
```

### Test Element Not Visible
```typescript
it('should NOT display Focus button for completed tasks', () => {
  const completedTask = mockTasks.find(
    task => task.listId === '2' && task.completed
  );
  
  if (completedTask) {
    const {queryByLabelText} = render(
      <TaskListScreen route={mockRoute} navigation={mockNavigation} />
    );
    
    const focusButton = queryByLabelText(
      `Start Focus session for ${completedTask.title}`
    );
    expect(focusButton).toBeNull();
  }
});
```

---

## 4. Testing Accessibility

### Test Accessibility Labels
```typescript
it('should have correct accessibility labels', () => {
  const {getByLabelText} = render(
    <TaskListScreen route={mockRoute} navigation={mockNavigation} />
  );
  
  const focusButton = getByLabelText('Start Focus session for Review project proposal');
  
  expect(focusButton).toBeTruthy();
  expect(focusButton.props.accessibilityRole).toBe('button');
  expect(focusButton.props.accessibilityHint).toBe(
    'Starts a Pomodoro timer session for this task'
  );
});
```

---

## 5. Testing User Interactions

### Test Button Press
```typescript
it('should call handler when button is pressed', () => {
  const {getByLabelText} = render(
    <TaskListScreen route={mockRoute} navigation={mockNavigation} />
  );
  
  const focusButton = getByLabelText('Start Focus session for Review project proposal');
  fireEvent.press(focusButton);
  
  expect(mockNavigate).toHaveBeenCalledTimes(1);
});
```

### Test Multiple Presses
```typescript
it('should handle rapid button presses', () => {
  const {getByLabelText} = render(
    <TaskListScreen route={mockRoute} navigation={mockNavigation} />
  );
  
  const focusButton = getByLabelText('Start Focus session for Review project proposal');
  
  fireEvent.press(focusButton);
  fireEvent.press(focusButton);
  fireEvent.press(focusButton);
  
  expect(mockNavigate).toHaveBeenCalledTimes(3);
});
```

---

## 6. Testing Zustand Store Integration

### Setup Store Mock
```typescript
jest.mock('../../src/features/focus/store/focusStore', () => ({
  useFocusStore: jest.fn(),
}));

const mockSelectTask = jest.fn();
const mockLoadSessions = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useFocusStore as unknown as jest.Mock).mockImplementation(selector =>
    selector({
      loadSessions: mockLoadSessions,
      selectTask: mockSelectTask,
    })
  );
});
```

### Test Store Actions
```typescript
it('should call store action with correct data', () => {
  const route = {
    params: {
      taskId: '1',
      taskTitle: 'Review project proposal',
    },
  };
  
  render(<FocusScreen route={route} />);
  
  expect(mockSelectTask).toHaveBeenCalledWith(
    expect.objectContaining({
      id: '1',
      title: 'Review project proposal',
    })
  );
});
```

---

## 7. Testing Edge Cases

### Test Invalid Data
```typescript
it('should handle invalid taskId gracefully', () => {
  const route = {
    params: {
      taskId: '999',
      taskTitle: 'Non-existent task',
    },
  };
  
  expect(() => render(<FocusScreen route={route} />)).not.toThrow();
  expect(mockSelectTask).not.toHaveBeenCalled();
});
```

### Test Undefined/Null Values
```typescript
it('should handle undefined route params', () => {
  const route = {
    params: undefined,
  };
  
  render(<FocusScreen route={route} />);
  
  expect(mockLoadSessions).toHaveBeenCalled();
  expect(mockSelectTask).not.toHaveBeenCalled();
});
```

---

## 8. Testing Component Re-renders

### Test State Persistence
```typescript
it('should maintain state across re-renders', () => {
  const {getByLabelText, rerender} = render(
    <TaskListScreen route={mockRoute} navigation={mockNavigation} />
  );
  
  const focusButton1 = getByLabelText('Start Focus session for Review project proposal');
  expect(focusButton1).toBeTruthy();
  
  rerender(
    <TaskListScreen route={mockRoute} navigation={mockNavigation} />
  );
  
  const focusButton2 = getByLabelText('Start Focus session for Review project proposal');
  expect(focusButton2).toBeTruthy();
});
```

### Test Prop Changes
```typescript
it('should re-select task when taskId changes', () => {
  const route1 = {
    params: { taskId: '1', taskTitle: 'Task 1' },
  };
  
  const {rerender} = render(<FocusScreen route={route1} />);
  expect(mockSelectTask).toHaveBeenCalledTimes(1);
  
  const route2 = {
    params: { taskId: '2', taskTitle: 'Task 2' },
  };
  
  rerender(<FocusScreen route={route2} />);
  expect(mockSelectTask).toHaveBeenCalledTimes(2);
});
```

---

## 9. Testing with Mock Data

### Filter Mock Data
```typescript
it('should work for multiple different tasks', () => {
  const {getByLabelText} = render(
    <TaskListScreen route={mockRoute} navigation={mockNavigation} />
  );
  
  const incompleteTasks = mockTasks.filter(
    task => task.listId === '2' && !task.completed
  );
  
  incompleteTasks.forEach(task => {
    const focusButton = getByLabelText(`Start Focus session for ${task.title}`);
    fireEvent.press(focusButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('Focus', {
      taskId: task.id,
      taskTitle: task.title,
    });
  });
});
```

---

## 10. Testing Console Logs (DEV mode)

### Setup Console Spy
```typescript
describe('Console Logging', () => {
  const originalDev = __DEV__;
  let consoleLogSpy: jest.SpyInstance;
  
  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });
  
  afterEach(() => {
    consoleLogSpy.mockRestore();
    (global as any).__DEV__ = originalDev;
  });
  
  it('should log in DEV mode', () => {
    (global as any).__DEV__ = true;
    
    const route = {
      params: { taskId: '1', taskTitle: 'Review project proposal' },
    };
    
    render(<FocusScreen route={route} />);
    
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[FocusScreen] Pre-selected task:',
      'Review project proposal'
    );
  });
});
```

---

## Common Testing Patterns

### Pattern 1: Test Existence
```typescript
expect(element).toBeTruthy();
expect(element).toBeNull();
```

### Pattern 2: Test Function Calls
```typescript
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).toHaveBeenCalledTimes(1);
expect(mockFunction).toHaveBeenCalledWith(expectedArg);
```

### Pattern 3: Test Object Properties
```typescript
expect(mockFunction).toHaveBeenCalledWith(
  expect.objectContaining({
    id: '1',
    title: 'Task Title',
  })
);
```

### Pattern 4: Test Arrays
```typescript
expect(array.length).toBeGreaterThan(0);
array.forEach(item => {
  expect(item).toBeTruthy();
});
```

---

## Best Practices

### ✅ DO
- Clear test descriptions
- Test user behavior, not implementation
- Use accessibility queries (getByLabelText, getByRole)
- Test edge cases and error states
- Clean up mocks in beforeEach/afterEach
- Group related tests in describe blocks

### ❌ DON'T
- Test implementation details
- Use brittle selectors (testID as last resort)
- Write tests that depend on other tests
- Mock everything (test as close to reality as possible)
- Ignore accessibility
- Skip edge cases

---

## Running Tests

### All Tests
```bash
pnpm test
```

### Specific File
```bash
pnpm test TaskListScreen.test.tsx
```

### Watch Mode
```bash
pnpm test --watch
```

### Coverage
```bash
pnpm test --coverage
```

---

## Debugging Tests

### View Test Output
```typescript
const {debug} = render(<Component />);
debug(); // Prints component tree
```

### Check Element Props
```typescript
const element = getByLabelText('Button');
console.log(element.props); // View all props
```

### Use UNSAFE_root for Deep Inspection
```typescript
const {UNSAFE_root} = render(<Component />);
const icons = UNSAFE_root.findAllByProps({name: 'timer-outline'});
```

---

## Complete Test Example

Here's a complete example combining multiple patterns:

```typescript
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TaskListScreen from '../../src/screens/TaskListScreen';
import {mockTasks} from '../../src/data/mockData';

describe('TaskListScreen - Focus Integration', () => {
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

  describe('Focus Button', () => {
    it('should display for non-completed tasks and navigate on press', () => {
      const {getByLabelText} = render(
        <TaskListScreen route={mockRoute} navigation={mockNavigation} />
      );

      const task = mockTasks.find(
        t => t.listId === '2' && !t.completed
      );

      if (task) {
        const focusButton = getByLabelText(
          `Start Focus session for ${task.title}`
        );

        expect(focusButton).toBeTruthy();
        expect(focusButton.props.accessibilityRole).toBe('button');

        fireEvent.press(focusButton);

        expect(mockNavigate).toHaveBeenCalledWith('Focus', {
          taskId: task.id,
          taskTitle: task.title,
        });
      }
    });
  });
});
```

---

## Resources

- [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://reactnative.dev/docs/accessibility)
