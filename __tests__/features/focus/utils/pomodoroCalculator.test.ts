/**
 * Focus Feature - Pomodoro Calculator Tests
 *
 * Comprehensive unit tests for pomodoroCalculator utility functions
 */

import {
  getNextPhase,
  getPhaseDuration,
  shouldTakeLongBreak,
  canPause,
  getRemainingPauses,
  isWorkPhase,
  isBreakPhase,
  isShortBreak,
  isLongBreak,
  getPomodorosUntilLongBreak,
  getTotalCycleDuration,
  getPhaseName,
} from '../../../../src/features/focus/utils/pomodoroCalculator';
import {
  FocusSettings,
  PomodoroPhase,
} from '../../../../src/features/focus/types/focus.types';

// ============================================================================
// Test Fixtures
// ============================================================================

const defaultSettings: FocusSettings = {
  pomoWorkDuration: 25,
  pomoShortBreak: 5,
  pomoLongBreak: 15,
  pomosBeforeLongBreak: 4,
  maxPausesPerSession: 3,
  confirmStop: true,
};

const customSettings: FocusSettings = {
  pomoWorkDuration: 50,
  pomoShortBreak: 10,
  pomoLongBreak: 30,
  pomosBeforeLongBreak: 2,
  maxPausesPerSession: 5,
  confirmStop: false,
};

// ============================================================================
// Phase Calculation Tests
// ============================================================================

describe('pomodoroCalculator', () => {
  describe('getNextPhase', () => {
    describe('from work phase', () => {
      it('should return shortBreak after first work session', () => {
        const result = getNextPhase('work', 1, defaultSettings);
        expect(result).toBe('shortBreak');
      });

      it('should return shortBreak after second work session', () => {
        const result = getNextPhase('work', 2, defaultSettings);
        expect(result).toBe('shortBreak');
      });

      it('should return shortBreak after third work session', () => {
        const result = getNextPhase('work', 3, defaultSettings);
        expect(result).toBe('shortBreak');
      });

      it('should return longBreak after fourth work session (default)', () => {
        const result = getNextPhase('work', 4, defaultSettings);
        expect(result).toBe('longBreak');
      });

      it('should return longBreak after eighth work session', () => {
        const result = getNextPhase('work', 8, defaultSettings);
        expect(result).toBe('longBreak');
      });

      it('should return longBreak after second work session with custom settings', () => {
        const result = getNextPhase('work', 2, customSettings);
        expect(result).toBe('longBreak');
      });

      it('should return shortBreak when no pomodoros completed yet', () => {
        const result = getNextPhase('work', 0, defaultSettings);
        expect(result).toBe('shortBreak');
      });
    });

    describe('from shortBreak phase', () => {
      it('should return work after short break', () => {
        const result = getNextPhase('shortBreak', 1, defaultSettings);
        expect(result).toBe('work');
      });

      it('should return work after short break regardless of pomodoros completed', () => {
        const result = getNextPhase('shortBreak', 10, defaultSettings);
        expect(result).toBe('work');
      });

      it('should return work after short break with zero pomodoros', () => {
        const result = getNextPhase('shortBreak', 0, defaultSettings);
        expect(result).toBe('work');
      });
    });

    describe('from longBreak phase', () => {
      it('should return work after long break', () => {
        const result = getNextPhase('longBreak', 4, defaultSettings);
        expect(result).toBe('work');
      });

      it('should return work after long break regardless of pomodoros completed', () => {
        const result = getNextPhase('longBreak', 8, defaultSettings);
        expect(result).toBe('work');
      });

      it('should return work after long break with zero pomodoros', () => {
        const result = getNextPhase('longBreak', 0, defaultSettings);
        expect(result).toBe('work');
      });
    });

    describe('edge cases', () => {
      it('should handle invalid phase by defaulting to work', () => {
        const result = getNextPhase(
          'invalid' as PomodoroPhase,
          1,
          defaultSettings,
        );
        expect(result).toBe('work');
      });

      it('should handle negative pomodoros completed', () => {
        const result = getNextPhase('work', -1, defaultSettings);
        expect(result).toBe('shortBreak');
      });

      it('should handle very large pomodoros completed', () => {
        const result = getNextPhase('work', 1000, defaultSettings);
        expect(result).toBe('longBreak');
      });
    });
  });

  describe('getPhaseDuration', () => {
    describe('with default settings', () => {
      it('should return work duration in seconds', () => {
        const result = getPhaseDuration('work', defaultSettings);
        expect(result).toBe(25 * 60); // 1500 seconds
      });

      it('should return short break duration in seconds', () => {
        const result = getPhaseDuration('shortBreak', defaultSettings);
        expect(result).toBe(5 * 60); // 300 seconds
      });

      it('should return long break duration in seconds', () => {
        const result = getPhaseDuration('longBreak', defaultSettings);
        expect(result).toBe(15 * 60); // 900 seconds
      });
    });

    describe('with custom settings', () => {
      it('should return custom work duration in seconds', () => {
        const result = getPhaseDuration('work', customSettings);
        expect(result).toBe(50 * 60); // 3000 seconds
      });

      it('should return custom short break duration in seconds', () => {
        const result = getPhaseDuration('shortBreak', customSettings);
        expect(result).toBe(10 * 60); // 600 seconds
      });

      it('should return custom long break duration in seconds', () => {
        const result = getPhaseDuration('longBreak', customSettings);
        expect(result).toBe(30 * 60); // 1800 seconds
      });
    });

    describe('edge cases', () => {
      it('should handle invalid phase by defaulting to work duration', () => {
        const result = getPhaseDuration(
          'invalid' as PomodoroPhase,
          defaultSettings,
        );
        expect(result).toBe(25 * 60);
      });

      it('should handle zero duration settings', () => {
        const zeroSettings: FocusSettings = {
          ...defaultSettings,
          pomoWorkDuration: 0,
        };
        const result = getPhaseDuration('work', zeroSettings);
        expect(result).toBe(0);
      });

      it('should handle very large duration settings', () => {
        const largeSettings: FocusSettings = {
          ...defaultSettings,
          pomoWorkDuration: 999,
        };
        const result = getPhaseDuration('work', largeSettings);
        expect(result).toBe(999 * 60);
      });
    });
  });

  // ============================================================================
  // Break Logic Tests
  // ============================================================================

  describe('shouldTakeLongBreak', () => {
    describe('with default settings (4 pomodoros)', () => {
      it('should return false when no pomodoros completed', () => {
        const result = shouldTakeLongBreak(0, defaultSettings);
        expect(result).toBe(false);
      });

      it('should return false after 1 pomodoro', () => {
        const result = shouldTakeLongBreak(1, defaultSettings);
        expect(result).toBe(false);
      });

      it('should return false after 2 pomodoros', () => {
        const result = shouldTakeLongBreak(2, defaultSettings);
        expect(result).toBe(false);
      });

      it('should return false after 3 pomodoros', () => {
        const result = shouldTakeLongBreak(3, defaultSettings);
        expect(result).toBe(false);
      });

      it('should return true after 4 pomodoros', () => {
        const result = shouldTakeLongBreak(4, defaultSettings);
        expect(result).toBe(true);
      });

      it('should return false after 5 pomodoros', () => {
        const result = shouldTakeLongBreak(5, defaultSettings);
        expect(result).toBe(false);
      });

      it('should return true after 8 pomodoros', () => {
        const result = shouldTakeLongBreak(8, defaultSettings);
        expect(result).toBe(true);
      });

      it('should return true after 12 pomodoros', () => {
        const result = shouldTakeLongBreak(12, defaultSettings);
        expect(result).toBe(true);
      });
    });

    describe('with custom settings (2 pomodoros)', () => {
      it('should return false after 1 pomodoro', () => {
        const result = shouldTakeLongBreak(1, customSettings);
        expect(result).toBe(false);
      });

      it('should return true after 2 pomodoros', () => {
        const result = shouldTakeLongBreak(2, customSettings);
        expect(result).toBe(true);
      });

      it('should return false after 3 pomodoros', () => {
        const result = shouldTakeLongBreak(3, customSettings);
        expect(result).toBe(false);
      });

      it('should return true after 4 pomodoros', () => {
        const result = shouldTakeLongBreak(4, customSettings);
        expect(result).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should handle negative pomodoros', () => {
        const result = shouldTakeLongBreak(-1, defaultSettings);
        expect(result).toBe(false);
      });

      it('should handle very large pomodoros', () => {
        const result = shouldTakeLongBreak(1000, defaultSettings);
        expect(result).toBe(true); // 1000 % 4 === 0
      });

      it('should handle pomosBeforeLongBreak of 1', () => {
        const settings: FocusSettings = {
          ...defaultSettings,
          pomosBeforeLongBreak: 1,
        };
        const result = shouldTakeLongBreak(1, settings);
        expect(result).toBe(true);
      });
    });
  });

  // ============================================================================
  // Pause Validation Tests
  // ============================================================================

  describe('canPause', () => {
    it('should return true when no pauses used', () => {
      const result = canPause(0, 3);
      expect(result).toBe(true);
    });

    it('should return true when pauses used is less than max', () => {
      const result = canPause(1, 3);
      expect(result).toBe(true);
    });

    it('should return true when one pause remaining', () => {
      const result = canPause(2, 3);
      expect(result).toBe(true);
    });

    it('should return false when pauses used equals max', () => {
      const result = canPause(3, 3);
      expect(result).toBe(false);
    });

    it('should return false when pauses used exceeds max', () => {
      const result = canPause(4, 3);
      expect(result).toBe(false);
    });

    it('should return false when max pauses is zero', () => {
      const result = canPause(0, 0);
      expect(result).toBe(false);
    });

    it('should handle negative pauses used', () => {
      const result = canPause(-1, 3);
      expect(result).toBe(true);
    });

    it('should handle negative max pauses', () => {
      const result = canPause(0, -1);
      expect(result).toBe(false);
    });
  });

  describe('getRemainingPauses', () => {
    it('should return max pauses when none used', () => {
      const result = getRemainingPauses(0, 3);
      expect(result).toBe(3);
    });

    it('should return correct remaining pauses', () => {
      const result = getRemainingPauses(1, 3);
      expect(result).toBe(2);
    });

    it('should return zero when all pauses used', () => {
      const result = getRemainingPauses(3, 3);
      expect(result).toBe(0);
    });

    it('should return zero when pauses used exceeds max', () => {
      const result = getRemainingPauses(5, 3);
      expect(result).toBe(0);
    });

    it('should handle negative pauses used', () => {
      const result = getRemainingPauses(-1, 3);
      expect(result).toBe(4);
    });

    it('should return zero when max pauses is zero', () => {
      const result = getRemainingPauses(0, 0);
      expect(result).toBe(0);
    });
  });

  // ============================================================================
  // Cycle Tracking Tests
  // ============================================================================

  describe('isWorkPhase', () => {
    it('should return true for work phase', () => {
      const result = isWorkPhase('work');
      expect(result).toBe(true);
    });

    it('should return false for shortBreak phase', () => {
      const result = isWorkPhase('shortBreak');
      expect(result).toBe(false);
    });

    it('should return false for longBreak phase', () => {
      const result = isWorkPhase('longBreak');
      expect(result).toBe(false);
    });
  });

  describe('isBreakPhase', () => {
    it('should return false for work phase', () => {
      const result = isBreakPhase('work');
      expect(result).toBe(false);
    });

    it('should return true for shortBreak phase', () => {
      const result = isBreakPhase('shortBreak');
      expect(result).toBe(true);
    });

    it('should return true for longBreak phase', () => {
      const result = isBreakPhase('longBreak');
      expect(result).toBe(true);
    });
  });

  describe('isShortBreak', () => {
    it('should return false for work phase', () => {
      const result = isShortBreak('work');
      expect(result).toBe(false);
    });

    it('should return true for shortBreak phase', () => {
      const result = isShortBreak('shortBreak');
      expect(result).toBe(true);
    });

    it('should return false for longBreak phase', () => {
      const result = isShortBreak('longBreak');
      expect(result).toBe(false);
    });
  });

  describe('isLongBreak', () => {
    it('should return false for work phase', () => {
      const result = isLongBreak('work');
      expect(result).toBe(false);
    });

    it('should return false for shortBreak phase', () => {
      const result = isLongBreak('shortBreak');
      expect(result).toBe(false);
    });

    it('should return true for longBreak phase', () => {
      const result = isLongBreak('longBreak');
      expect(result).toBe(true);
    });
  });

  describe('getPomodorosUntilLongBreak', () => {
    describe('with default settings (4 pomodoros)', () => {
      it('should return 4 when no pomodoros completed', () => {
        const result = getPomodorosUntilLongBreak(0, defaultSettings);
        expect(result).toBe(4);
      });

      it('should return 3 after 1 pomodoro', () => {
        const result = getPomodorosUntilLongBreak(1, defaultSettings);
        expect(result).toBe(3);
      });

      it('should return 2 after 2 pomodoros', () => {
        const result = getPomodorosUntilLongBreak(2, defaultSettings);
        expect(result).toBe(2);
      });

      it('should return 1 after 3 pomodoros', () => {
        const result = getPomodorosUntilLongBreak(3, defaultSettings);
        expect(result).toBe(1);
      });

      it('should return 4 after 4 pomodoros (cycle resets)', () => {
        const result = getPomodorosUntilLongBreak(4, defaultSettings);
        expect(result).toBe(4);
      });

      it('should return 3 after 5 pomodoros', () => {
        const result = getPomodorosUntilLongBreak(5, defaultSettings);
        expect(result).toBe(3);
      });
    });

    describe('with custom settings (2 pomodoros)', () => {
      it('should return 2 when no pomodoros completed', () => {
        const result = getPomodorosUntilLongBreak(0, customSettings);
        expect(result).toBe(2);
      });

      it('should return 1 after 1 pomodoro', () => {
        const result = getPomodorosUntilLongBreak(1, customSettings);
        expect(result).toBe(1);
      });

      it('should return 2 after 2 pomodoros (cycle resets)', () => {
        const result = getPomodorosUntilLongBreak(2, customSettings);
        expect(result).toBe(2);
      });
    });
  });

  describe('getTotalCycleDuration', () => {
    it('should calculate total cycle duration with default settings', () => {
      // 4 work sessions (25 min each) + 3 short breaks (5 min each) + 1 long break (15 min)
      // = (4 * 25 * 60) + (3 * 5 * 60) + (15 * 60)
      // = 6000 + 900 + 900 = 7800 seconds
      const result = getTotalCycleDuration(defaultSettings);
      expect(result).toBe(7800);
    });

    it('should calculate total cycle duration with custom settings', () => {
      // 2 work sessions (50 min each) + 1 short break (10 min) + 1 long break (30 min)
      // = (2 * 50 * 60) + (1 * 10 * 60) + (30 * 60)
      // = 6000 + 600 + 1800 = 8400 seconds
      const result = getTotalCycleDuration(customSettings);
      expect(result).toBe(8400);
    });

    it('should handle settings with 1 pomodoro before long break', () => {
      const settings: FocusSettings = {
        ...defaultSettings,
        pomosBeforeLongBreak: 1,
      };
      // 1 work session (25 min) + 0 short breaks + 1 long break (15 min)
      // = (1 * 25 * 60) + (0 * 5 * 60) + (15 * 60)
      // = 1500 + 0 + 900 = 2400 seconds
      const result = getTotalCycleDuration(settings);
      expect(result).toBe(2400);
    });

    it('should handle zero duration settings', () => {
      const zeroSettings: FocusSettings = {
        pomoWorkDuration: 0,
        pomoShortBreak: 0,
        pomoLongBreak: 0,
        pomosBeforeLongBreak: 4,
        maxPausesPerSession: 3,
        confirmStop: true,
      };
      const result = getTotalCycleDuration(zeroSettings);
      expect(result).toBe(0);
    });
  });

  describe('getPhaseName', () => {
    it('should return "Focus Time" for work phase', () => {
      const result = getPhaseName('work');
      expect(result).toBe('Focus Time');
    });

    it('should return "Short Break" for shortBreak phase', () => {
      const result = getPhaseName('shortBreak');
      expect(result).toBe('Short Break');
    });

    it('should return "Long Break" for longBreak phase', () => {
      const result = getPhaseName('longBreak');
      expect(result).toBe('Long Break');
    });

    it('should return "Unknown" for invalid phase', () => {
      const result = getPhaseName('invalid' as PomodoroPhase);
      expect(result).toBe('Unknown');
    });
  });
});
