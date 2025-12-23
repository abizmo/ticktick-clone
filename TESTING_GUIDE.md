# Testing Guide - TickTick Clone

## Quick Start

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
```

### Run Tests with Coverage Report

```bash
pnpm test:coverage
```

### Run Tests with Verbose Output

```bash
pnpm test:verbose
```

### Run Specific Test File

```bash
pnpm test TaskListScreen
```

### Run Tests Matching Pattern

```bash
pnpm test --testNamePattern="should render"
```

## Test File Locations

```
__tests__/
├── data/
│   └── mockData.test.ts              (31 tests - Data layer)
├── screens/
│   ├── TaskListScreen.test.tsx       (24 tests - Task list view)
│   ├── FocusScreen.test.tsx          (26 tests - Focus view)
│   ├── CalendarScreen.test.tsx       (32 tests - Calendar view)
│   └── SettingsScreen.test.tsx       (36 tests - Settings)
├── navigation/
│   └── ListsNavigator.test.tsx       (31 tests - Drawer navigation)
└── App.test.tsx                      (28 tests - Root component)
```

## Coverage Report Location

After running `pnpm test:coverage`, view the detailed HTML report:

```bash
open coverage/lcov-report/index.html
```

## Current Test Statistics

- **Total Tests**: 178
- **Passing**: 167 (94%)
- **Failing**: 11 (minor formatting issues)
- **Coverage**: 77.77% lines, 76.56% statements

## Coverage by File

| File               | Lines  | Statements | Functions | Branches |
| ------------------ | ------ | ---------- | --------- | -------- |
| mockData.ts        | 100%   | 100%       | 100%      | 100%     |
| SettingsScreen.tsx | 100%   | 100%       | 100%      | 100%     |
| TaskListScreen.tsx | 94.73% | 91.3%      | 100%      | 68.75%   |
| FocusScreen.tsx    | 90.9%  | 88%        | 100%      | 62.5%    |
| CalendarScreen.tsx | 82.35% | 78.94%     | 53.84%    | 36.36%   |

## Common Testing Tasks

### Debug a Failing Test

```bash
# Run in watch mode
pnpm test:watch

# Then press 'p' to filter by test name
# Or press 'f' to run only failed tests
```

### Update Test Snapshots (if added in future)

```bash
pnpm test -u
```

### Clear Jest Cache

```bash
pnpm exec jest --clearCache
```

### Run Tests with Coverage for Specific File

```bash
pnpm test TaskListScreen --coverage
```

## Test Writing Guidelines

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('Feature Area', () => {
    it('should do something specific', () => {
      // Arrange
      const mockData = {...};

      // Act
      const {getByText} = render(<Component {...mockData} />);

      // Assert
      expect(getByText('Expected Text')).toBeTruthy();
    });
  });
});
```

### Common Patterns

#### Testing Component Rendering

```typescript
it("should render without crashing", () => {
  const { getByText } = render(<MyComponent />);
  expect(getByText("Title")).toBeTruthy();
});
```

#### Testing User Interactions

```typescript
it("should handle button press", () => {
  const mockFn = jest.fn();
  const { getByText } = render(<MyComponent onPress={mockFn} />);

  fireEvent.press(getByText("Button"));

  expect(mockFn).toHaveBeenCalled();
});
```

#### Testing Conditional Rendering

```typescript
it("should show empty state when no data", () => {
  const { getByText } = render(<MyComponent data={[]} />);
  expect(getByText("No items")).toBeTruthy();
});
```

## Debugging Tips

### Test Not Finding Element

- Check exact text (case-sensitive)
- Use `debug()` to see rendered output: `const {debug} = render(...); debug();`
- Use query methods: `queryByText` returns null instead of throwing

### Mock Not Working

- Ensure mock is before import
- Check mock path matches import path
- Verify jest.config transformIgnorePatterns

### Coverage Not Updating

- Clear Jest cache: `npx jest --clearCache`
- Delete coverage folder
- Re-run with --no-cache flag

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --coverage --ci
      - uses: codecov/codecov-action@v3
```

## Troubleshooting

### "Cannot find module" Error

```bash
# Install missing dependencies
pnpm install

# Clear cache
pnpm exec jest --clearCache
```

### Tests Timing Out

```bash
# Increase timeout in jest.config.js
testTimeout: 30000
```

### React Native Specific Issues

```bash
# Ensure preset is set
# In jest.config.js:
preset: 'react-native'
```

## Best Practices

1. ✅ Write tests before fixing bugs
2. ✅ Keep tests simple and focused
3. ✅ Use descriptive test names
4. ✅ Test one thing per test
5. ✅ Mock external dependencies
6. ✅ Avoid testing implementation details
7. ✅ Test user-facing behavior
8. ✅ Maintain test readability
9. ✅ Keep tests fast
10. ✅ Review test failures carefully

## Next Steps

1. Fix remaining 11 minor test failures
2. Increase App.tsx coverage
3. Add E2E tests with Detox
4. Set up CI/CD pipeline
5. Add pre-commit hooks

## Support

For questions or issues with tests:

1. Check this guide
2. Review TESTING_SUMMARY.md
3. Check Jest documentation: https://jestjs.io
4. Check React Native Testing Library docs: https://callstack.github.io/react-native-testing-library
