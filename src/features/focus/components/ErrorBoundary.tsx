/**
 * ErrorBoundary Component
 *
 * React Error Boundary for catching and handling errors in the Focus feature.
 * Displays user-friendly error messages and provides recovery options.
 *
 * Features:
 * - Catches React component errors
 * - Displays user-friendly error UI
 * - Logs errors for debugging
 * - Provides retry/reset functionality
 * - Prevents app crashes
 *
 * @module ErrorBoundary
 */

import React, {Component, ErrorInfo, ReactNode} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {AccessibleColors} from '../utils/colorContrast';
import logger from '../utils/logger';

// ============================================================================
// Types
// ============================================================================

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ============================================================================
// Component
// ============================================================================

/**
 * ErrorBoundary Component
 *
 * Catches errors in child components and displays a fallback UI.
 * Prevents the entire app from crashing due to component errors.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <FocusScreen />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error with context
    logger.error('React component error caught by ErrorBoundary', {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      error,
      data: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error state
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Render error UI or children
   */
  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.errorContainer}>
              {/* Error Icon */}
              <Text style={styles.errorIcon}>⚠️</Text>

              {/* Error Title */}
              <Text style={styles.errorTitle}>Something went wrong</Text>

              {/* Error Message */}
              <Text style={styles.errorMessage}>
                We encountered an unexpected error. Don't worry, your data is
                safe.
              </Text>

              {/* Technical Details (Development Only) */}
              {__DEV__ && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsTitle}>Technical Details:</Text>
                  <Text style={styles.detailsText}>
                    {this.state.error.message}
                  </Text>
                  {this.state.errorInfo && (
                    <Text style={styles.detailsText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={this.resetError}
                  accessibilityLabel="Try again"
                  accessibilityRole="button"
                  accessibilityHint="Attempts to recover from the error">
                  <Text style={styles.primaryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AccessibleColors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: AccessibleColors.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AccessibleColors.primaryText,
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: AccessibleColors.secondary,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: AccessibleColors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ErrorBoundary;
