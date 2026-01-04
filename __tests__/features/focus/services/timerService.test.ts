/**
 * Unit tests for timerService
 *
 * Tests the TimerService class including start, pause, resume, stop, reset,
 * event emissions, drift correction, and timer state management.
 */

import {
  TimerService,
  getTimerService,
  resetTimerService,
  createTimerService,
} from '../../../../src/features/focus/services/timerService';

// ============================================================================
// TimerService Class Tests
// ============================================================================

describe('TimerService', () => {
  let timer: TimerService;

  beforeEach(() => {
    jest.useFakeTimers();
    timer = new TimerService();
  });

  afterEach(() => {
    timer.destroy();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // ==========================================================================
  // Constructor and Initial State Tests
  // ==========================================================================

  describe('constructor', () => {
    it('should initialize with idle status', () => {
      expect(timer.getStatus()).toBe('idle');
    });

    it('should initialize with zero time remaining', () => {
      expect(timer.getTimeRemaining()).toBe(0);
    });

    it('should initialize with zero initial duration', () => {
      expect(timer.getInitialDuration()).toBe(0);
    });

    it('should not be running initially', () => {
      expect(timer.isRunning()).toBe(false);
    });

    it('should be idle initially', () => {
      expect(timer.isIdle()).toBe(true);
    });
  });

  // ==========================================================================
  // Start Method Tests
  // ==========================================================================

  describe('start', () => {
    it('should start timer with specified duration', () => {
      timer.start(60);

      expect(timer.getStatus()).toBe('running');
      expect(timer.getTimeRemaining()).toBe(60);
      expect(timer.getInitialDuration()).toBe(60);
      expect(timer.isRunning()).toBe(true);
    });

    it('should throw error if already running', () => {
      timer.start(60);

      expect(() => timer.start(30)).toThrow(
        'Timer is already running. Stop or reset before starting again.',
      );
    });

    it('should throw error if duration is zero', () => {
      expect(() => timer.start(0)).toThrow('Duration must be greater than 0');
    });

    it('should throw error if duration is negative', () => {
      expect(() => timer.start(-10)).toThrow('Duration must be greater than 0');
    });

    it('should emit tick events every second', () => {
      const tickListener = jest.fn();
      timer.on('tick', tickListener);

      timer.start(10);

      jest.advanceTimersByTime(1000);
      expect(tickListener).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      expect(tickListener).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(1000);
      expect(tickListener).toHaveBeenCalledTimes(3);
    });

    it('should decrement time remaining on each tick', () => {
      timer.start(10);

      expect(timer.getTimeRemaining()).toBe(10);

      jest.advanceTimersByTime(1000);
      expect(timer.getTimeRemaining()).toBe(9);

      jest.advanceTimersByTime(1000);
      expect(timer.getTimeRemaining()).toBe(8);
    });

    it('should emit complete event when timer reaches zero', () => {
      const completeListener = jest.fn();
      timer.on('complete', completeListener);

      timer.start(3);

      jest.advanceTimersByTime(3000);

      expect(completeListener).toHaveBeenCalledWith(0);
      expect(timer.getStatus()).toBe('completed');
      expect(timer.getTimeRemaining()).toBe(0);
    });

    it('should stop ticking after completion', () => {
      const tickListener = jest.fn();
      timer.on('tick', tickListener);

      timer.start(2);

      jest.advanceTimersByTime(2000);
      tickListener.mockClear();

      jest.advanceTimersByTime(2000);
      expect(tickListener).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // Pause Method Tests
  // ==========================================================================

  describe('pause', () => {
    it('should pause running timer', () => {
      timer.start(60);
      timer.pause();

      expect(timer.getStatus()).toBe('paused');
      expect(timer.isPaused()).toBe(true);
      expect(timer.isRunning()).toBe(false);
    });

    it('should emit pause event', () => {
      const pauseListener = jest.fn();
      timer.on('pause', pauseListener);

      timer.start(60);
      jest.advanceTimersByTime(5000);
      timer.pause();

      expect(pauseListener).toHaveBeenCalledWith(55);
    });

    it('should throw error if not running', () => {
      expect(() => timer.pause()).toThrow(
        'Timer is not running. Cannot pause.',
      );
    });

    it('should stop ticking when paused', () => {
      const tickListener = jest.fn();
      timer.on('tick', tickListener);

      timer.start(60);
      jest.advanceTimersByTime(5000);

      tickListener.mockClear();
      timer.pause();

      jest.advanceTimersByTime(5000);
      expect(tickListener).not.toHaveBeenCalled();
    });

    it('should preserve time remaining when paused', () => {
      timer.start(60);
      jest.advanceTimersByTime(10000);

      const timeBeforePause = timer.getTimeRemaining();
      timer.pause();

      expect(timer.getTimeRemaining()).toBe(timeBeforePause);
    });
  });

  // ==========================================================================
  // Resume Method Tests
  // ==========================================================================

  describe('resume', () => {
    it('should resume paused timer', () => {
      timer.start(60);
      timer.pause();
      timer.resume();

      expect(timer.getStatus()).toBe('running');
      expect(timer.isRunning()).toBe(true);
      expect(timer.isPaused()).toBe(false);
    });

    it('should emit resume event', () => {
      const resumeListener = jest.fn();
      timer.on('resume', resumeListener);

      timer.start(60);
      jest.advanceTimersByTime(5000);
      timer.pause();
      timer.resume();

      expect(resumeListener).toHaveBeenCalledWith(55);
    });

    it('should throw error if not paused', () => {
      expect(() => timer.resume()).toThrow(
        'Timer is not paused. Cannot resume.',
      );
    });

    it('should continue ticking after resume', () => {
      const tickListener = jest.fn();
      timer.on('tick', tickListener);

      timer.start(60);
      jest.advanceTimersByTime(5000);
      timer.pause();

      tickListener.mockClear();
      timer.resume();

      jest.advanceTimersByTime(1000);
      expect(tickListener).toHaveBeenCalledTimes(1);
    });

    it('should not count paused time in duration', () => {
      timer.start(10);
      jest.advanceTimersByTime(3000);

      expect(timer.getTimeRemaining()).toBe(7);

      timer.pause();
      jest.advanceTimersByTime(5000); // Paused for 5 seconds

      timer.resume();
      jest.advanceTimersByTime(3000);

      expect(timer.getTimeRemaining()).toBe(4); // Should be 7 - 3 = 4
    });
  });

  // ==========================================================================
  // Stop Method Tests
  // ==========================================================================

  describe('stop', () => {
    it('should stop running timer', () => {
      timer.start(60);
      timer.stop();

      expect(timer.getStatus()).toBe('idle');
      expect(timer.getTimeRemaining()).toBe(0);
      expect(timer.isIdle()).toBe(true);
    });

    it('should emit stop event with remaining time', () => {
      const stopListener = jest.fn();
      timer.on('stop', stopListener);

      timer.start(60);
      jest.advanceTimersByTime(10000);
      timer.stop();

      expect(stopListener).toHaveBeenCalledWith(50);
    });

    it('should do nothing if already idle', () => {
      const stopListener = jest.fn();
      timer.on('stop', stopListener);

      timer.stop();

      expect(stopListener).not.toHaveBeenCalled();
      expect(timer.getStatus()).toBe('idle');
    });

    it('should stop ticking after stop', () => {
      const tickListener = jest.fn();
      timer.on('tick', tickListener);

      timer.start(60);
      jest.advanceTimersByTime(5000);

      tickListener.mockClear();
      timer.stop();

      jest.advanceTimersByTime(5000);
      expect(tickListener).not.toHaveBeenCalled();
    });

    it('should reset drift correction fields', () => {
      timer.start(60);
      jest.advanceTimersByTime(10000);
      timer.stop();

      // Start a new timer and verify it works correctly
      timer.start(30);
      jest.advanceTimersByTime(5000);

      expect(timer.getTimeRemaining()).toBe(25);
    });
  });

  // ==========================================================================
  // Reset Method Tests
  // ==========================================================================

  describe('reset', () => {
    it('should reset timer to initial duration', () => {
      timer.start(60);
      jest.advanceTimersByTime(20000);

      timer.reset();

      expect(timer.getTimeRemaining()).toBe(60);
      expect(timer.getStatus()).toBe('idle');
    });

    it('should emit reset event', () => {
      const resetListener = jest.fn();
      timer.on('reset', resetListener);

      timer.start(60);
      timer.reset();

      expect(resetListener).toHaveBeenCalledWith(60);
    });

    it('should stop ticking after reset', () => {
      const tickListener = jest.fn();
      timer.on('tick', tickListener);

      timer.start(60);
      jest.advanceTimersByTime(5000);

      tickListener.mockClear();
      timer.reset();

      jest.advanceTimersByTime(5000);
      expect(tickListener).not.toHaveBeenCalled();
    });

    it('should reset drift correction fields', () => {
      timer.start(60);
      jest.advanceTimersByTime(10000);
      timer.reset();

      // Start again and verify drift correction works
      timer.start(30);
      jest.advanceTimersByTime(5000);

      expect(timer.getTimeRemaining()).toBe(25);
    });
  });

  // ==========================================================================
  // Getter Methods Tests
  // ==========================================================================

  describe('getters', () => {
    describe('getTimeRemaining', () => {
      it('should return current time remaining', () => {
        timer.start(100);
        jest.advanceTimersByTime(30000);

        expect(timer.getTimeRemaining()).toBe(70);
      });
    });

    describe('getInitialDuration', () => {
      it('should return initial duration', () => {
        timer.start(120);

        expect(timer.getInitialDuration()).toBe(120);
      });
    });

    describe('getStatus', () => {
      it('should return current status', () => {
        expect(timer.getStatus()).toBe('idle');

        timer.start(60);
        expect(timer.getStatus()).toBe('running');

        timer.pause();
        expect(timer.getStatus()).toBe('paused');

        timer.resume();
        expect(timer.getStatus()).toBe('running');

        jest.advanceTimersByTime(60000);
        expect(timer.getStatus()).toBe('completed');
      });
    });

    describe('isRunning', () => {
      it('should return true when running', () => {
        timer.start(60);
        expect(timer.isRunning()).toBe(true);
      });

      it('should return false when not running', () => {
        expect(timer.isRunning()).toBe(false);

        timer.start(60);
        timer.pause();
        expect(timer.isRunning()).toBe(false);
      });
    });

    describe('isPaused', () => {
      it('should return true when paused', () => {
        timer.start(60);
        timer.pause();
        expect(timer.isPaused()).toBe(true);
      });

      it('should return false when not paused', () => {
        expect(timer.isPaused()).toBe(false);

        timer.start(60);
        expect(timer.isPaused()).toBe(false);
      });
    });

    describe('isIdle', () => {
      it('should return true when idle', () => {
        expect(timer.isIdle()).toBe(true);

        timer.start(60);
        timer.stop();
        expect(timer.isIdle()).toBe(true);
      });

      it('should return false when not idle', () => {
        timer.start(60);
        expect(timer.isIdle()).toBe(false);
      });
    });

    describe('isCompleted', () => {
      it('should return true when completed', () => {
        timer.start(2);
        jest.advanceTimersByTime(2000);

        expect(timer.isCompleted()).toBe(true);
      });

      it('should return false when not completed', () => {
        expect(timer.isCompleted()).toBe(false);

        timer.start(60);
        expect(timer.isCompleted()).toBe(false);
      });
    });

    describe('getElapsedTime', () => {
      it('should return elapsed time', () => {
        timer.start(100);
        jest.advanceTimersByTime(30000);

        expect(timer.getElapsedTime()).toBe(30);
      });

      it('should return 0 when not started', () => {
        expect(timer.getElapsedTime()).toBe(0);
      });
    });

    describe('getProgress', () => {
      it('should return progress as percentage', () => {
        timer.start(100);
        jest.advanceTimersByTime(25000);

        expect(timer.getProgress()).toBe(25);
      });

      it('should return 0 when not started', () => {
        expect(timer.getProgress()).toBe(0);
      });

      it('should return 100 when completed', () => {
        timer.start(10);
        jest.advanceTimersByTime(10000);

        expect(timer.getProgress()).toBe(100);
      });

      it('should floor fractional percentages', () => {
        timer.start(100);
        jest.advanceTimersByTime(33000); // 33% complete

        expect(timer.getProgress()).toBe(33);
      });
    });
  });

  // ==========================================================================
  // Event Listener Tests
  // ==========================================================================

  describe('event listeners', () => {
    it('should add and call event listeners', () => {
      const listener = jest.fn();
      timer.on('tick', listener);

      timer.start(10);
      jest.advanceTimersByTime(1000);

      expect(listener).toHaveBeenCalled();
    });

    it('should remove event listeners', () => {
      const listener = jest.fn();
      timer.on('tick', listener);
      timer.off('tick', listener);

      timer.start(10);
      jest.advanceTimersByTime(1000);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should support multiple listeners for same event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      timer.on('tick', listener1);
      timer.on('tick', listener2);

      timer.start(10);
      jest.advanceTimersByTime(1000);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should remove all listeners', () => {
      const tickListener = jest.fn();
      const completeListener = jest.fn();

      timer.on('tick', tickListener);
      timer.on('complete', completeListener);

      timer.removeAllListeners();

      timer.start(2);
      jest.advanceTimersByTime(2000);

      expect(tickListener).not.toHaveBeenCalled();
      expect(completeListener).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // Drift Correction Tests
  // ==========================================================================

  describe('drift correction', () => {
    it('should use actual elapsed time instead of tick count', () => {
      const realDateNow = Date.now;
      let currentTime = 1000000000;

      Date.now = jest.fn(() => currentTime);

      timer.start(10);

      // Simulate 3 seconds passing with drift
      currentTime += 3100; // 3.1 seconds instead of 3.0
      jest.advanceTimersByTime(3000);

      expect(timer.getTimeRemaining()).toBe(7); // Should be 7, not 8

      Date.now = realDateNow;
    });

    it('should handle pause duration correctly in drift correction', () => {
      const realDateNow = Date.now;
      let currentTime = 1000000000;

      Date.now = jest.fn(() => currentTime);

      timer.start(20);

      // Run for 5 seconds
      currentTime += 5000;
      jest.advanceTimersByTime(5000);

      expect(timer.getTimeRemaining()).toBe(15);

      // Pause
      timer.pause();

      // Wait 10 seconds while paused (should not count)
      currentTime += 10000;
      jest.advanceTimersByTime(10000);

      // Resume
      timer.resume();

      // Run for 5 more seconds
      currentTime += 5000;
      jest.advanceTimersByTime(5000);

      expect(timer.getTimeRemaining()).toBe(10); // Should be 15 - 5 = 10

      Date.now = realDateNow;
    });
  });

  // ==========================================================================
  // Destroy Method Tests
  // ==========================================================================

  describe('destroy', () => {
    it('should stop timer and remove all listeners', () => {
      const tickListener = jest.fn();
      timer.on('tick', tickListener);

      timer.start(60);
      timer.destroy();

      jest.advanceTimersByTime(5000);

      expect(tickListener).not.toHaveBeenCalled();
      expect(timer.getStatus()).toBe('idle');
    });
  });
});

// ============================================================================
// Singleton and Factory Function Tests
// ============================================================================

describe('timerService singleton and factory', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetTimerService();
  });

  afterEach(() => {
    resetTimerService();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('getTimerService', () => {
    it('should return singleton instance', () => {
      const instance1 = getTimerService();
      const instance2 = getTimerService();

      expect(instance1).toBe(instance2);
    });

    it('should create instance on first call', () => {
      const instance = getTimerService();

      expect(instance).toBeInstanceOf(TimerService);
    });
  });

  describe('resetTimerService', () => {
    it('should destroy and reset singleton instance', () => {
      const instance1 = getTimerService();
      instance1.start(60);

      resetTimerService();

      const instance2 = getTimerService();

      expect(instance2).not.toBe(instance1);
      expect(instance2.getStatus()).toBe('idle');
    });
  });

  describe('createTimerService', () => {
    it('should create new independent instance', () => {
      const instance1 = createTimerService();
      const instance2 = createTimerService();

      expect(instance1).not.toBe(instance2);
      expect(instance1).toBeInstanceOf(TimerService);
      expect(instance2).toBeInstanceOf(TimerService);
    });

    it('should create instance independent of singleton', () => {
      const singleton = getTimerService();
      const independent = createTimerService();

      expect(independent).not.toBe(singleton);

      singleton.start(60);
      expect(independent.getStatus()).toBe('idle');
    });
  });
});
