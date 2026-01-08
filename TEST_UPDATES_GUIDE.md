# Test Updates Guide - Logger Migration

## Overview

The new structured logger changes the console output format. Tests that check for specific console.error/console.log calls need to be updated.

## Changes Required

### Old Logger Format
```typescript
console.error('Error saving Focus settings:', error);
```

### New Logger Format
```typescript
logger.error('Failed to save settings', {
  component: 'storageService',
  action: 'saveFocusSettings',
  error,
});

// Output:
// [2026-01-04T10:30:45.123Z] [ERROR] [storageService] [saveFocusSettings] Failed to save settings
// Error details: Error: ...
// Additional data: {...}
```

## Test Update Pattern

### Before
```typescript
it('should log error when AsyncStorage fails', async () => {
  const error = new Error('Storage full');
  const consoleErrorSpy = jest.spyOn(console, 'error');

  (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

  await expect(saveFocusSettings(settings)).rejects.toThrow();
  
  // ❌ OLD - This will fail with new logger
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    'Error saving Focus settings:',
    error,
  );
});
```

### After
```typescript
it('should log error when AsyncStorage fails', async () => {
  const error = new Error('Storage full');
  const consoleErrorSpy = jest.spyOn(console, 'error');

  (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

  await expect(saveFocusSettings(settings)).rejects.toThrow();
  
  // ✅ NEW - Check for logger format
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.stringContaining('[ERROR]'),
  );
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    'Error details:',
    error,
  );
});
```

## Alternative: Mock the Logger

If you want to test logger calls directly:

```typescript
import * as logger from '../../../../src/features/focus/utils/logger';

describe('storageService', () => {
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
  });

  afterEach(() => {
    loggerErrorSpy.mockRestore();
  });

  it('should log error when AsyncStorage fails', async () => {
    const error = new Error('Storage full');

    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

    await expect(saveFocusSettings(settings)).rejects.toThrow();
    
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Storage quota exceeded'),
      expect.objectContaining({
        component: 'storageService',
        action: 'saveFocusSettings',
        error,
      }),
    );
  });
});
```

## Files That Need Updates

1. `__tests__/features/focus/services/storageService.test.ts` (5 tests)
2. Any other tests that check console.error/console.log calls

## Quick Fix Script

Run this to update all failing tests:

```bash
# Find all tests that check console.error
grep -r "toHaveBeenCalledWith.*console" __tests__/features/focus/

# Update them to check for logger format instead
```
