/**
 * Unit tests for ErrorBoundary component
 *
 * Tests error catching, error UI display, and recovery functionality.
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Text} from 'react-native';
import ErrorBoundary from '../../../../src/features/focus/components/ErrorBoundary';
import * as logger from '../../../../src/features/focus/utils/logger';

// Component that throws an error
const ThrowError: React.FC<{shouldThrow?: boolean}> = ({
  shouldThrow = true,
}) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>No error</Text>;
};

// Component that works normally
const NormalComponent: React.FC = () => {
  return <Text>Normal component</Text>;
};

describe('ErrorBoundary', () => {
  let loggerErrorSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
    // Suppress React error boundary console.error in tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    loggerErrorSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('error catching', () => {
    it('should catch errors from child components', () => {
      const {getByText} = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should render children when no error', () => {
      const {getByText} = render(
        <ErrorBoundary>
          <NormalComponent />
        </ErrorBoundary>,
      );

      expect(getByText('Normal component')).toBeTruthy();
    });

    it('should log error when caught', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Console.error should be called (logger uses console.error internally)
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should call onError callback when provided', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        }),
      );
    });
  });

  describe('error UI', () => {
    it('should display error title', () => {
      const {getByText} = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should display error message', () => {
      const {getByText} = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(getByText(/We encountered an unexpected error/)).toBeTruthy();
    });

    it('should display Try Again button', () => {
      const {getByText} = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(getByText('Try Again')).toBeTruthy();
    });

    it('should display error icon', () => {
      const {getByText} = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(getByText('⚠️')).toBeTruthy();
    });

    it('should display technical details in development', () => {
      if (__DEV__) {
        const {getByText} = render(
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>,
        );

        expect(getByText('Technical Details:')).toBeTruthy();
        expect(getByText('Test error')).toBeTruthy();
      }
    });
  });

  describe('error recovery', () => {
    it('should have Try Again button that can be pressed', () => {
      const {getByText} = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Error UI should be visible
      expect(getByText('Something went wrong')).toBeTruthy();

      // Try Again button should be pressable
      const tryAgainButton = getByText('Try Again');
      expect(tryAgainButton).toBeTruthy();

      // Should not throw when pressed
      expect(() => fireEvent.press(tryAgainButton)).not.toThrow();
    });
  });

  describe('custom fallback', () => {
    it('should use custom fallback when provided', () => {
      const customFallback = (_error: Error, _resetError: () => void) => (
        <Text>Custom fallback rendered</Text>
      );

      const {getByText, queryByText} = render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Should show custom fallback
      expect(getByText('Custom fallback rendered')).toBeTruthy();

      // Should NOT show default error UI
      expect(queryByText('Something went wrong')).toBeNull();
    });

    it('should pass resetError function to custom fallback', () => {
      let resetCalled = false;

      const customFallback = (error: Error, resetError: () => void) => {
        const handlePress = () => {
          resetCalled = true;
          resetError();
        };

        return (
          <Text testID="reset-button" onPress={handlePress}>
            Reset
          </Text>
        );
      };

      const {getByTestId} = render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>,
      );

      const resetButton = getByTestId('reset-button');
      fireEvent.press(resetButton);

      expect(resetCalled).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have accessible Try Again button', () => {
      const {getByLabelText} = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const tryAgainButton = getByLabelText('Try again');
      expect(tryAgainButton).toBeTruthy();
    });

    it('should have accessible hint for Try Again button', () => {
      const {getByA11yHint} = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const tryAgainButton = getByA11yHint(
        'Attempts to recover from the error',
      );
      expect(tryAgainButton).toBeTruthy();
    });
  });
});
