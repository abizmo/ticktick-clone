/**
 * Focus Feature - Timer Service
 *
 * This service handles the core timer logic for Focus sessions.
 * It provides a timer that can be started, paused, resumed, stopped, and reset.
 * Uses EventEmitter pattern to notify listeners of timer events.
 *
 * @module timerService
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Timer event types
 */
export type TimerEvent =
  | 'tick'
  | 'complete'
  | 'pause'
  | 'resume'
  | 'stop'
  | 'reset';

/**
 * Timer event listener callback
 */
export type TimerEventListener = (timeRemaining: number) => void;

/**
 * Timer status
 */
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

// ============================================================================
// Simple EventEmitter Implementation
// ============================================================================

/**
 * Simple EventEmitter for React Native
 * Provides basic event subscription and emission
 */
class SimpleEventEmitter {
  private listeners: Map<TimerEvent, Set<TimerEventListener>> = new Map();

  /**
   * Add event listener
   */
  on(event: TimerEvent, listener: TimerEventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  /**
   * Remove event listener
   */
  off(event: TimerEvent, listener: TimerEventListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  /**
   * Emit event to all listeners
   */
  emit(event: TimerEvent, data: number): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.clear();
  }
}

// ============================================================================
// Timer Service Class
// ============================================================================

/**
 * TimerService class
 * Manages a countdown timer with event emission
 */
export class TimerService extends SimpleEventEmitter {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private timeRemaining: number = 0; // seconds
  private initialDuration: number = 0; // seconds
  private status: TimerStatus = 'idle';

  constructor() {
    super();
  }

  // ==========================================================================
  // Public Methods
  // ==========================================================================

  /**
   * Start the timer with a specific duration
   *
   * @param durationSeconds - Duration in seconds
   * @throws Error if timer is already running
   */
  start(durationSeconds: number): void {
    if (this.status === 'running') {
      throw new Error(
        'Timer is already running. Stop or reset before starting again.',
      );
    }

    if (durationSeconds <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    this.initialDuration = durationSeconds;
    this.timeRemaining = durationSeconds;
    this.status = 'running';

    this.startInterval();

    console.log(`[TimerService] Started timer with ${durationSeconds}s`);
  }

  /**
   * Pause the timer
   * Preserves current time remaining
   *
   * @throws Error if timer is not running
   */
  pause(): void {
    if (this.status !== 'running') {
      throw new Error('Timer is not running. Cannot pause.');
    }

    this.stopInterval();
    this.status = 'paused';
    this.emit('pause', this.timeRemaining);

    console.log(`[TimerService] Paused timer at ${this.timeRemaining}s`);
  }

  /**
   * Resume the timer from paused state
   *
   * @throws Error if timer is not paused
   */
  resume(): void {
    if (this.status !== 'paused') {
      throw new Error('Timer is not paused. Cannot resume.');
    }

    this.status = 'running';
    this.startInterval();
    this.emit('resume', this.timeRemaining);

    console.log(`[TimerService] Resumed timer at ${this.timeRemaining}s`);
  }

  /**
   * Stop the timer
   * Clears interval and resets to idle state
   */
  stop(): void {
    if (this.status === 'idle') {
      return; // Already stopped
    }

    this.stopInterval();
    const remainingTime = this.timeRemaining;
    this.timeRemaining = 0;
    this.status = 'idle';
    this.emit('stop', remainingTime);

    console.log(`[TimerService] Stopped timer`);
  }

  /**
   * Reset the timer to initial duration
   * Stops the timer if running and resets to initial state
   */
  reset(): void {
    this.stopInterval();
    this.timeRemaining = this.initialDuration;
    this.status = 'idle';
    this.emit('reset', this.timeRemaining);

    console.log(`[TimerService] Reset timer to ${this.initialDuration}s`);
  }

  // ==========================================================================
  // Getters
  // ==========================================================================

  /**
   * Get current time remaining in seconds
   */
  getTimeRemaining(): number {
    return this.timeRemaining;
  }

  /**
   * Get initial duration in seconds
   */
  getInitialDuration(): number {
    return this.initialDuration;
  }

  /**
   * Get current timer status
   */
  getStatus(): TimerStatus {
    return this.status;
  }

  /**
   * Check if timer is running
   */
  isRunning(): boolean {
    return this.status === 'running';
  }

  /**
   * Check if timer is paused
   */
  isPaused(): boolean {
    return this.status === 'paused';
  }

  /**
   * Check if timer is idle
   */
  isIdle(): boolean {
    return this.status === 'idle';
  }

  /**
   * Check if timer is completed
   */
  isCompleted(): boolean {
    return this.status === 'completed';
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsedTime(): number {
    return this.initialDuration - this.timeRemaining;
  }

  /**
   * Get progress as percentage (0-100)
   *
   * Uses Math.floor to ensure progress only increases when a full percentage
   * point is completed. This provides a smoother, more predictable progress
   * bar experience without unexpected jumps due to rounding.
   *
   * Example: If 50.7% complete, returns 50 (not 51)
   *
   * @returns Progress percentage (0-100, integer)
   */
  getProgress(): number {
    if (this.initialDuration === 0) {
      return 0;
    }
    return Math.floor((this.getElapsedTime() / this.initialDuration) * 100);
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  /**
   * Start the interval for ticking
   */
  private startInterval(): void {
    // Clear any existing interval
    this.stopInterval();

    // Create new interval that ticks every second
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  /**
   * Stop the interval
   */
  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Handle each tick of the timer
   * Decrements time and emits events
   */
  private tick(): void {
    if (this.status !== 'running') {
      return;
    }

    // Decrement time
    this.timeRemaining -= 1;

    // Emit tick event
    this.emit('tick', this.timeRemaining);

    // Check if timer completed
    if (this.timeRemaining <= 0) {
      this.handleComplete();
    }
  }

  /**
   * Handle timer completion
   */
  private handleComplete(): void {
    this.stopInterval();
    this.timeRemaining = 0;
    this.status = 'completed';
    this.emit('complete', 0);

    console.log(`[TimerService] Timer completed`);
  }

  // ==========================================================================
  // Cleanup
  // ==========================================================================

  /**
   * Cleanup method to be called when service is no longer needed
   * Stops timer and removes all listeners
   */
  destroy(): void {
    this.stop();
    this.removeAllListeners();
    console.log(`[TimerService] Destroyed`);
  }
}

// ============================================================================
// Singleton Instance (Optional)
// ============================================================================

/**
 * Singleton instance of TimerService
 * Use this for a shared timer across the app
 */
let timerServiceInstance: TimerService | null = null;

/**
 * Get the singleton instance of TimerService
 */
export const getTimerService = (): TimerService => {
  if (!timerServiceInstance) {
    timerServiceInstance = new TimerService();
  }
  return timerServiceInstance;
};

/**
 * Reset the singleton instance
 * Useful for testing
 */
export const resetTimerService = (): void => {
  if (timerServiceInstance) {
    timerServiceInstance.destroy();
    timerServiceInstance = null;
  }
};

// ============================================================================
// Factory Function (Alternative to Singleton)
// ============================================================================

/**
 * Create a new TimerService instance
 * Use this if you need multiple independent timers
 */
export const createTimerService = (): TimerService => {
  return new TimerService();
};
