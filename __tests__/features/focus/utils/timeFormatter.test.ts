/**
 * Focus Feature - Time Formatter Tests
 *
 * Comprehensive unit tests for timeFormatter utility functions
 */

import {
  formatTime,
  formatDuration,
  formatDurationLong,
  secondsToMinutes,
  minutesToSeconds,
  secondsToHours,
  hoursToSeconds,
  parseTimeString,
  isValidTime,
  clampTime,
  getTimeRemainingPercentage,
  getElapsedPercentage,
  formatTimeRemaining,
} from '../../../../src/features/focus/utils/timeFormatter';

// ============================================================================
// Time Formatting Tests
// ============================================================================

describe('timeFormatter', () => {
  describe('formatTime', () => {
    describe('typical cases', () => {
      it('should format 0 seconds as "00:00"', () => {
        const result = formatTime(0);
        expect(result).toBe('00:00');
      });

      it('should format 59 seconds as "00:59"', () => {
        const result = formatTime(59);
        expect(result).toBe('00:59');
      });

      it('should format 60 seconds as "01:00"', () => {
        const result = formatTime(60);
        expect(result).toBe('01:00');
      });

      it('should format 90 seconds as "01:30"', () => {
        const result = formatTime(90);
        expect(result).toBe('01:30');
      });

      it('should format 600 seconds as "10:00"', () => {
        const result = formatTime(600);
        expect(result).toBe('10:00');
      });

      it('should format 1500 seconds (25 min) as "25:00"', () => {
        const result = formatTime(1500);
        expect(result).toBe('25:00');
      });

      it('should format 3661 seconds as "61:01"', () => {
        const result = formatTime(3661);
        expect(result).toBe('61:01');
      });
    });

    describe('edge cases', () => {
      it('should handle negative numbers by returning "00:00"', () => {
        const result = formatTime(-10);
        expect(result).toBe('00:00');
      });

      it('should handle decimal numbers by flooring', () => {
        const result = formatTime(90.7);
        expect(result).toBe('01:30');
      });

      it('should handle very large numbers', () => {
        const result = formatTime(99999);
        expect(result).toBe('1666:39');
      });

      it('should pad single digit minutes with zero', () => {
        const result = formatTime(300);
        expect(result).toBe('05:00');
      });

      it('should pad single digit seconds with zero', () => {
        const result = formatTime(605);
        expect(result).toBe('10:05');
      });
    });
  });

  describe('formatDuration', () => {
    describe('minutes only', () => {
      it('should format 0 seconds as "0m"', () => {
        const result = formatDuration(0);
        expect(result).toBe('0m');
      });

      it('should format 30 seconds as "0m" (rounds down)', () => {
        const result = formatDuration(30);
        expect(result).toBe('0m');
      });

      it('should format 60 seconds as "1m"', () => {
        const result = formatDuration(60);
        expect(result).toBe('1m');
      });

      it('should format 90 seconds as "1m" (rounds down)', () => {
        const result = formatDuration(90);
        expect(result).toBe('1m');
      });

      it('should format 1500 seconds (25 min) as "25m"', () => {
        const result = formatDuration(1500);
        expect(result).toBe('25m');
      });

      it('should format 3540 seconds (59 min) as "59m"', () => {
        const result = formatDuration(3540);
        expect(result).toBe('59m');
      });
    });

    describe('hours only', () => {
      it('should format 3600 seconds (1 hour) as "1h"', () => {
        const result = formatDuration(3600);
        expect(result).toBe('1h');
      });

      it('should format 7200 seconds (2 hours) as "2h"', () => {
        const result = formatDuration(7200);
        expect(result).toBe('2h');
      });
    });

    describe('hours and minutes', () => {
      it('should format 3660 seconds as "1h 1m"', () => {
        const result = formatDuration(3660);
        expect(result).toBe('1h 1m');
      });

      it('should format 5400 seconds as "1h 30m"', () => {
        const result = formatDuration(5400);
        expect(result).toBe('1h 30m');
      });

      it('should format 9000 seconds as "2h 30m"', () => {
        const result = formatDuration(9000);
        expect(result).toBe('2h 30m');
      });
    });

    describe('edge cases', () => {
      it('should handle negative numbers by returning "0m"', () => {
        const result = formatDuration(-100);
        expect(result).toBe('0m');
      });

      it('should handle decimal numbers by flooring', () => {
        const result = formatDuration(3660.9);
        expect(result).toBe('1h 1m');
      });

      it('should handle very large numbers', () => {
        const result = formatDuration(86400); // 24 hours
        expect(result).toBe('24h');
      });
    });
  });

  describe('formatDurationLong', () => {
    describe('minutes only', () => {
      it('should format 0 seconds as "0 minutes"', () => {
        const result = formatDurationLong(0);
        expect(result).toBe('0 minutes');
      });

      it('should format 60 seconds as "1 minute"', () => {
        const result = formatDurationLong(60);
        expect(result).toBe('1 minute');
      });

      it('should format 120 seconds as "2 minutes"', () => {
        const result = formatDurationLong(120);
        expect(result).toBe('2 minutes');
      });

      it('should format 1500 seconds as "25 minutes"', () => {
        const result = formatDurationLong(1500);
        expect(result).toBe('25 minutes');
      });
    });

    describe('hours only', () => {
      it('should format 3600 seconds as "1 hour"', () => {
        const result = formatDurationLong(3600);
        expect(result).toBe('1 hour');
      });

      it('should format 7200 seconds as "2 hours"', () => {
        const result = formatDurationLong(7200);
        expect(result).toBe('2 hours');
      });
    });

    describe('hours and minutes', () => {
      it('should format 3660 seconds as "1 hour 1 minute"', () => {
        const result = formatDurationLong(3660);
        expect(result).toBe('1 hour 1 minute');
      });

      it('should format 5400 seconds as "1 hour 30 minutes"', () => {
        const result = formatDurationLong(5400);
        expect(result).toBe('1 hour 30 minutes');
      });

      it('should format 9060 seconds as "2 hours 31 minutes"', () => {
        const result = formatDurationLong(9060);
        expect(result).toBe('2 hours 31 minutes');
      });
    });

    describe('edge cases', () => {
      it('should handle negative numbers by returning "0 minutes"', () => {
        const result = formatDurationLong(-100);
        expect(result).toBe('0 minutes');
      });

      it('should handle decimal numbers by flooring', () => {
        const result = formatDurationLong(3660.9);
        expect(result).toBe('1 hour 1 minute');
      });
    });
  });

  // ============================================================================
  // Time Conversion Tests
  // ============================================================================

  describe('secondsToMinutes', () => {
    it('should convert 0 seconds to 0 minutes', () => {
      const result = secondsToMinutes(0);
      expect(result).toBe(0);
    });

    it('should convert 60 seconds to 1 minute', () => {
      const result = secondsToMinutes(60);
      expect(result).toBe(1);
    });

    it('should convert 90 seconds to 1 minute (rounds down)', () => {
      const result = secondsToMinutes(90);
      expect(result).toBe(1);
    });

    it('should convert 120 seconds to 2 minutes', () => {
      const result = secondsToMinutes(120);
      expect(result).toBe(2);
    });

    it('should convert 1500 seconds to 25 minutes', () => {
      const result = secondsToMinutes(1500);
      expect(result).toBe(25);
    });

    it('should handle negative numbers', () => {
      const result = secondsToMinutes(-60);
      expect(result).toBe(-1);
    });

    it('should handle decimal numbers by flooring', () => {
      const result = secondsToMinutes(90.9);
      expect(result).toBe(1);
    });
  });

  describe('minutesToSeconds', () => {
    it('should convert 0 minutes to 0 seconds', () => {
      const result = minutesToSeconds(0);
      expect(result).toBe(0);
    });

    it('should convert 1 minute to 60 seconds', () => {
      const result = minutesToSeconds(1);
      expect(result).toBe(60);
    });

    it('should convert 5 minutes to 300 seconds', () => {
      const result = minutesToSeconds(5);
      expect(result).toBe(300);
    });

    it('should convert 25 minutes to 1500 seconds', () => {
      const result = minutesToSeconds(25);
      expect(result).toBe(1500);
    });

    it('should handle negative numbers', () => {
      const result = minutesToSeconds(-5);
      expect(result).toBe(-300);
    });

    it('should handle decimal numbers', () => {
      const result = minutesToSeconds(1.5);
      expect(result).toBe(90);
    });
  });

  describe('secondsToHours', () => {
    it('should convert 0 seconds to 0 hours', () => {
      const result = secondsToHours(0);
      expect(result).toBe(0);
    });

    it('should convert 3600 seconds to 1 hour', () => {
      const result = secondsToHours(3600);
      expect(result).toBe(1);
    });

    it('should convert 5400 seconds to 1 hour (rounds down)', () => {
      const result = secondsToHours(5400);
      expect(result).toBe(1);
    });

    it('should convert 7200 seconds to 2 hours', () => {
      const result = secondsToHours(7200);
      expect(result).toBe(2);
    });

    it('should handle negative numbers', () => {
      const result = secondsToHours(-3600);
      expect(result).toBe(-1);
    });
  });

  describe('hoursToSeconds', () => {
    it('should convert 0 hours to 0 seconds', () => {
      const result = hoursToSeconds(0);
      expect(result).toBe(0);
    });

    it('should convert 1 hour to 3600 seconds', () => {
      const result = hoursToSeconds(1);
      expect(result).toBe(3600);
    });

    it('should convert 2 hours to 7200 seconds', () => {
      const result = hoursToSeconds(2);
      expect(result).toBe(7200);
    });

    it('should handle negative numbers', () => {
      const result = hoursToSeconds(-1);
      expect(result).toBe(-3600);
    });

    it('should handle decimal numbers', () => {
      const result = hoursToSeconds(1.5);
      expect(result).toBe(5400);
    });
  });

  // ============================================================================
  // Time Parsing Tests
  // ============================================================================

  describe('parseTimeString', () => {
    describe('valid formats', () => {
      it('should parse "00:00" to 0 seconds', () => {
        const result = parseTimeString('00:00');
        expect(result).toBe(0);
      });

      it('should parse "5:30" to 330 seconds', () => {
        const result = parseTimeString('5:30');
        expect(result).toBe(330);
      });

      it('should parse "05:30" to 330 seconds', () => {
        const result = parseTimeString('05:30');
        expect(result).toBe(330);
      });

      it('should parse "01:30" to 90 seconds', () => {
        const result = parseTimeString('01:30');
        expect(result).toBe(90);
      });

      it('should parse "25:00" to 1500 seconds', () => {
        const result = parseTimeString('25:00');
        expect(result).toBe(1500);
      });

      it('should parse "99:59" to 5999 seconds', () => {
        const result = parseTimeString('99:59');
        expect(result).toBe(5999);
      });

      it('should parse "0:00" to 0 seconds', () => {
        const result = parseTimeString('0:00');
        expect(result).toBe(0);
      });

      it('should parse "0:59" to 59 seconds', () => {
        const result = parseTimeString('0:59');
        expect(result).toBe(59);
      });
    });

    describe('invalid formats', () => {
      it('should return null for "5:5" (seconds must be 2 digits)', () => {
        const result = parseTimeString('5:5');
        expect(result).toBeNull();
      });

      it('should return null for "5:60" (seconds must be < 60)', () => {
        const result = parseTimeString('5:60');
        expect(result).toBeNull();
      });

      it('should return null for "5:99" (seconds must be < 60)', () => {
        const result = parseTimeString('5:99');
        expect(result).toBeNull();
      });

      it('should return null for "5" (missing seconds)', () => {
        const result = parseTimeString('5');
        expect(result).toBeNull();
      });

      it('should return null for "5:" (missing seconds)', () => {
        const result = parseTimeString('5:');
        expect(result).toBeNull();
      });

      it('should return null for ":30" (missing minutes)', () => {
        const result = parseTimeString(':30');
        expect(result).toBeNull();
      });

      it('should return null for "abc:30" (invalid minutes)', () => {
        const result = parseTimeString('abc:30');
        expect(result).toBeNull();
      });

      it('should return null for "5:ab" (invalid seconds)', () => {
        const result = parseTimeString('5:ab');
        expect(result).toBeNull();
      });

      it('should return null for empty string', () => {
        const result = parseTimeString('');
        expect(result).toBeNull();
      });

      it('should return null for "5:30:00" (too many parts)', () => {
        const result = parseTimeString('5:30:00');
        expect(result).toBeNull();
      });

      it('should return null for "005:30" (too many minute digits)', () => {
        const result = parseTimeString('005:30');
        expect(result).toBeNull();
      });
    });
  });

  // ============================================================================
  // Time Validation Tests
  // ============================================================================

  describe('isValidTime', () => {
    it('should return true for 0', () => {
      const result = isValidTime(0);
      expect(result).toBe(true);
    });

    it('should return true for positive numbers', () => {
      const result = isValidTime(100);
      expect(result).toBe(true);
    });

    it('should return true for decimal numbers', () => {
      const result = isValidTime(100.5);
      expect(result).toBe(true);
    });

    it('should return false for negative numbers', () => {
      const result = isValidTime(-10);
      expect(result).toBe(false);
    });

    it('should return false for Infinity', () => {
      const result = isValidTime(Infinity);
      expect(result).toBe(false);
    });

    it('should return false for -Infinity', () => {
      const result = isValidTime(-Infinity);
      expect(result).toBe(false);
    });

    it('should return false for NaN', () => {
      const result = isValidTime(NaN);
      expect(result).toBe(false);
    });
  });

  describe('clampTime', () => {
    describe('with default range (0 to 86400)', () => {
      it('should return value within range unchanged', () => {
        const result = clampTime(1000);
        expect(result).toBe(1000);
      });

      it('should clamp negative value to 0', () => {
        const result = clampTime(-100);
        expect(result).toBe(0);
      });

      it('should clamp value above max to 86400', () => {
        const result = clampTime(100000);
        expect(result).toBe(86400);
      });

      it('should return 0 for 0', () => {
        const result = clampTime(0);
        expect(result).toBe(0);
      });

      it('should return 86400 for 86400', () => {
        const result = clampTime(86400);
        expect(result).toBe(86400);
      });
    });

    describe('with custom range', () => {
      it('should clamp to custom min', () => {
        const result = clampTime(5, 10, 100);
        expect(result).toBe(10);
      });

      it('should clamp to custom max', () => {
        const result = clampTime(150, 10, 100);
        expect(result).toBe(100);
      });

      it('should return value within custom range unchanged', () => {
        const result = clampTime(50, 10, 100);
        expect(result).toBe(50);
      });

      it('should handle negative ranges', () => {
        const result = clampTime(-50, -100, -10);
        expect(result).toBe(-50);
      });
    });
  });

  // ============================================================================
  // Relative Time Tests
  // ============================================================================

  describe('getTimeRemainingPercentage', () => {
    it('should return 100 when time remaining equals total duration', () => {
      const result = getTimeRemainingPercentage(100, 100);
      expect(result).toBe(100);
    });

    it('should return 50 when half time remaining', () => {
      const result = getTimeRemainingPercentage(50, 100);
      expect(result).toBe(50);
    });

    it('should return 0 when no time remaining', () => {
      const result = getTimeRemainingPercentage(0, 100);
      expect(result).toBe(0);
    });

    it('should return 25 when quarter time remaining', () => {
      const result = getTimeRemainingPercentage(25, 100);
      expect(result).toBe(25);
    });

    it('should return 75 when three quarters time remaining', () => {
      const result = getTimeRemainingPercentage(75, 100);
      expect(result).toBe(75);
    });

    it('should handle decimal percentages', () => {
      const result = getTimeRemainingPercentage(33, 100);
      expect(result).toBe(33);
    });

    it('should return 0 when total duration is 0', () => {
      const result = getTimeRemainingPercentage(50, 0);
      expect(result).toBe(0);
    });

    it('should clamp to 0 for negative time remaining', () => {
      const result = getTimeRemainingPercentage(-10, 100);
      expect(result).toBe(0);
    });

    it('should clamp to 100 for time remaining exceeding total', () => {
      const result = getTimeRemainingPercentage(150, 100);
      expect(result).toBe(100);
    });
  });

  describe('getElapsedPercentage', () => {
    it('should return 0 when time remaining equals total duration', () => {
      const result = getElapsedPercentage(100, 100);
      expect(result).toBe(0);
    });

    it('should return 50 when half time elapsed', () => {
      const result = getElapsedPercentage(50, 100);
      expect(result).toBe(50);
    });

    it('should return 100 when all time elapsed', () => {
      const result = getElapsedPercentage(0, 100);
      expect(result).toBe(100);
    });

    it('should return 75 when three quarters elapsed', () => {
      const result = getElapsedPercentage(25, 100);
      expect(result).toBe(75);
    });

    it('should return 25 when quarter elapsed', () => {
      const result = getElapsedPercentage(75, 100);
      expect(result).toBe(25);
    });

    it('should handle decimal percentages', () => {
      const result = getElapsedPercentage(33, 100);
      expect(result).toBe(67);
    });
  });

  describe('formatTimeRemaining', () => {
    it('should return "Time\'s up!" for 0 seconds', () => {
      const result = formatTimeRemaining(0);
      expect(result).toBe("Time's up!");
    });

    it('should return "Time\'s up!" for negative seconds', () => {
      const result = formatTimeRemaining(-10);
      expect(result).toBe("Time's up!");
    });

    it('should format seconds less than 60 with "s left"', () => {
      const result = formatTimeRemaining(30);
      expect(result).toBe('30s left');
    });

    it('should format 59 seconds with "s left"', () => {
      const result = formatTimeRemaining(59);
      expect(result).toBe('59s left');
    });

    it('should format 60 seconds with "m left"', () => {
      const result = formatTimeRemaining(60);
      expect(result).toBe('1m left');
    });

    it('should format 90 seconds with "m left"', () => {
      const result = formatTimeRemaining(90);
      expect(result).toBe('1m left');
    });

    it('should format 1500 seconds with "m left"', () => {
      const result = formatTimeRemaining(1500);
      expect(result).toBe('25m left');
    });

    it('should format 3600 seconds with "h left"', () => {
      const result = formatTimeRemaining(3600);
      expect(result).toBe('1h left');
    });

    it('should format 5400 seconds with "h m left"', () => {
      const result = formatTimeRemaining(5400);
      expect(result).toBe('1h 30m left');
    });
  });
});
