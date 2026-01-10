/**
 * Unit tests for logger utility
 *
 * Tests structured logging functionality including log levels,
 * context formatting, and development vs production behavior.
 */

import * as logger from '../../../../src/features/focus/utils/logger';

describe('logger', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('error', () => {
    it('should log error message', () => {
      logger.error('Test error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test error'),
      );
    });

    it('should log error with component context', () => {
      logger.error('Test error', {
        component: 'TestComponent',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
      );
    });

    it('should log error with action context', () => {
      logger.error('Test error', {
        action: 'testAction',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[testAction]'),
      );
    });

    it('should log error details when error provided', () => {
      const error = new Error('Test error details');

      logger.error('Test error', {error});

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error details:', error);
    });

    it('should log additional data when provided', () => {
      const data = {key: 'value'};

      logger.error('Test error', {data});

      expect(consoleErrorSpy).toHaveBeenCalledWith('Additional data:', data);
    });

    it('should log with full context', () => {
      const error = new Error('Test');
      const data = {sessionId: '123'};

      logger.error('Test error', {
        component: 'TestComponent',
        action: 'testAction',
        error,
        data,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[testAction]'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error details:', error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Additional data:', data);
    });

    it('should always log errors even in production', () => {
      // Errors should log regardless of __DEV__ flag
      logger.error('Production error');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should log warning in development', () => {
      if (__DEV__) {
        logger.warn('Test warning');

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('[WARN]'),
        );
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('Test warning'),
        );
      }
    });

    it('should log warning with context', () => {
      if (__DEV__) {
        logger.warn('Test warning', {
          component: 'TestComponent',
          action: 'testAction',
          data: {key: 'value'},
        });

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('[TestComponent]'),
        );
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('[testAction]'),
        );
        expect(consoleWarnSpy).toHaveBeenCalledWith('Additional data:', {
          key: 'value',
        });
      }
    });
  });

  describe('info', () => {
    it('should log info in development', () => {
      if (__DEV__) {
        logger.info('Test info');

        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[INFO]'),
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Test info'),
        );
      }
    });

    it('should log info with context', () => {
      if (__DEV__) {
        logger.info('Test info', {
          component: 'TestComponent',
          data: {duration: 1500},
        });

        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[TestComponent]'),
        );
        expect(consoleLogSpy).toHaveBeenCalledWith('Additional data:', {
          duration: 1500,
        });
      }
    });
  });

  describe('debug', () => {
    it('should log debug in development', () => {
      if (__DEV__) {
        logger.debug('Test debug');

        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[DEBUG]'),
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Test debug'),
        );
      }
    });

    it('should log debug with context', () => {
      if (__DEV__) {
        logger.debug('Test debug', {
          component: 'timerService',
          action: 'tick',
          data: {timeRemaining: 1234},
        });

        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[timerService]'),
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[tick]'),
        );
        expect(consoleLogSpy).toHaveBeenCalledWith('Additional data:', {
          timeRemaining: 1234,
        });
      }
    });
  });

  describe('default export', () => {
    it('should export all log methods', () => {
      expect(logger.default).toHaveProperty('error');
      expect(logger.default).toHaveProperty('warn');
      expect(logger.default).toHaveProperty('info');
      expect(logger.default).toHaveProperty('debug');
    });
  });
});
