# Focus Feature - Developer Documentation

## Overview

The Focus feature implements a Pomodoro Timer and Stopwatch to help users concentrate on their tasks. This document provides technical guidance for developers working with this feature.

## Architecture

```
src/features/focus/
├── components/         # UI components (Phase 5)
├── constants/          # Default values and configuration
├── screens/            # Screen components (Phase 5)
├── services/           # Business logic and external integrations
│   ├── sessionService.ts    # Session lifecycle management
│   ├── storageService.ts    # AsyncStorage persistence
│   └── timerService.ts      # Timer logic with drift correction
├── store/              # Zustand global state
│   └── focusStore.ts        # Main store orchestrating all services
├── types/              # TypeScript type definitions
│   └── focus.types.ts       # All interfaces and types
└── utils/              # Helper functions
    ├── pomodoroCalculator.ts # Phase calculations
    └── timeFormatter.ts      # Time formatting utilities
```

## Core Concepts

### Session Lifecycle

**Important:** A `FocusSession` represents a **complete work cycle** from "Start" to "Stop", potentially spanning multiple pomodoros and breaks.

#### What is a Session?

- **NOT** a single 25-minute pomodoro interval
- **YES** an entire work period that can include:
  - Multiple work intervals (pomodoros)
  - Multiple breaks (short and long)
  - Multiple pauses (up to `maxPausesPerSession`)

#### Example Session Flow

```typescript
// User starts a Pomodoro session
startFocus()
  → Creates FocusSession { pomodorosCompleted: 0, pausesCount: 0 }

// Work phase 1 (25 min) completes
  → pomodorosCompleted = 1
  → Saves to AsyncStorage (intermediate persistence)
  → Auto-transitions to short break

// Short break (5 min) completes
  → Auto-transitions to work phase 2

// Work phase 2 (25 min) completes
  → pomodorosCompleted = 2
  → Saves to AsyncStorage (intermediate persistence)
  → Auto-transitions to short break

// ... continues through the cycle ...

// User presses "Stop"
stopFocus()
  → Saves final session to history:
    {
      pomodorosCompleted: 4,
      durationSeconds: 8100, // ~135 minutes
      pausesCount: 2,
      status: 'completed'
    }
  → Clears AsyncStorage current session
```

### Why This Design?

1. **Aligns with user mental model:** Users think of a "work session" as an extended period of focus, not individual 25-minute chunks
2. **Matches database schema:** The `focus_sessions` table has no `phase` field
3. **Supports pause limits:** `maxPausesPerSession` applies across the entire work period
4. **Enables crash recovery:** Intermediate saves allow restoration after unexpected app closure
5. **Accurate statistics:** Separates session count from pomodoro count

### Crash Recovery

The system implements automatic crash recovery:

```typescript
// On app startup
loadSessions()
  → Loads session history from AsyncStorage
  → Checks for currentSession (crash recovery)
  → If found: restores to state.currentSession
  → UI can show recovery dialog: "Continue your session?"
```

**How it works:**

1. After each work phase completion, the session is saved to `@focus_current_session`
2. When user calls `stopFocus()`, the current session is cleared
3. On app restart, `loadSessions()` checks for a current session
4. If found, it's restored to state for the UI to handle

## State Management

### Zustand Store (`focusStore.ts`)

The store orchestrates all services and provides reactive state:

```typescript
interface FocusStoreState {
  // State
  timerState: TimerState; // Current timer (time, phase, status)
  currentSession: FocusSession | null; // Active session (null if idle)
  selectedTask: Task | null; // Task associated with session
  settings: FocusSettings; // User preferences
  sessions: FocusSession[]; // Session history
  todayStats: TodayStats; // Today's statistics
  error: FocusError | null; // Error state for UI

  // Actions
  startFocus: (taskId?: string) => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  stopFocus: () => void;
  selectTask: (task: Task | null) => void;
  updateSettings: (settings: Partial<FocusSettings>) => void;
  loadSessions: () => Promise<void>;
  calculateTodayStats: () => void;
  cleanup: () => void;
  clearError: () => void;
}
```

### Key State Fields

#### `timerState`

- **Purpose:** UI display (countdown timer, current phase)
- **Updated:** Every second by TimerService
- **Contains:** `pomodorosCompleted` for UI counter

#### `currentSession`

- **Purpose:** Persistence and history
- **Updated:** On start, after each work phase, on stop
- **Contains:** `pomodorosCompleted` for final save

**Important:** Both fields track `pomodorosCompleted` but serve different purposes:

- `timerState.pomodorosCompleted` → UI display
- `currentSession.pomodorosCompleted` → Persistence

## Services

### TimerService (`timerService.ts`)

Handles countdown/count-up logic with drift correction:

```typescript
const timer = getTimerService();

// Start countdown
timer.start(1500); // 25 minutes in seconds

// Listen to events
timer.on('tick', timeRemaining => {
  console.log(`Time: ${timeRemaining}s`);
});

timer.on('complete', () => {
  console.log('Timer completed!');
});

// Control
timer.pause();
timer.resume();
timer.stop();

// Cleanup
timer.removeAllListeners();
```

**Features:**

- Drift correction using `Date.now()` instead of cumulative intervals
- Event-driven architecture (tick, complete, pause, resume, stop)
- Singleton pattern (one instance per app)

### SessionService (`sessionService.ts`)

Manages session lifecycle and calculations:

```typescript
// Create new session
const session = createSession(taskId, 'pomodoro');

// Update session
const updated = updateSession(session, {pausesCount: 1});

// Complete session
const completed = completeSession(session);

// Statistics
const totalMinutes = calculateTotalDuration(sessions) / 60;
const totalPomodoros = calculateTotalPomodoros(sessions); // ← NEW
const completedCount = countCompletedSessions(sessions);
```

**Important:** Use `calculateTotalPomodoros()` for statistics, NOT `countPomodoroSessions()`:

```typescript
// ❌ WRONG - Counts sessions, not pomodoros
const pomodoros = countPomodoroSessions(sessions);

// ✅ CORRECT - Sums pomodorosCompleted field
const pomodoros = calculateTotalPomodoros(sessions);
```

### StorageService (`storageService.ts`)

Handles AsyncStorage persistence:

```typescript
// Save/load session history
await saveFocusSession(session);
const sessions = await loadFocusSessions();

// Save/load settings
await saveFocusSettings(settings);
const settings = await loadFocusSettings();

// Current session (crash recovery)
await saveCurrentSession(session);
const current = await loadCurrentSession();
```

**Storage Keys:**

- `@focus_sessions` - Session history (array)
- `@focus_settings` - User settings (object)
- `@focus_current_session` - Active session for recovery (object or null)

## Common Patterns

### Starting a Session

```typescript
const {startFocus} = useFocusStore();

// Start without task
startFocus();

// Start with task
startFocus('task-123');
```

**What happens:**

1. Creates new `FocusSession` with `pomodorosCompleted: 0`
2. Calculates initial duration from settings
3. Starts TimerService
4. Sets up event listeners (tick, complete)
5. Updates state to `status: 'running'`

### Stopping a Session

```typescript
const {stopFocus} = useFocusStore();

stopFocus();
```

**What happens:**

1. Stops TimerService
2. Updates session with final `pomodorosCompleted` from `timerState`
3. Marks as `completed` or `interrupted`
4. Saves to session history
5. **Clears current session from AsyncStorage** (crash recovery cleanup)
6. Recalculates today's stats

### Handling Errors

```typescript
const {error, clearError} = useFocusStore();

if (error) {
  console.log(error.message); // User-friendly message
  console.log(error.details); // Technical details
  console.log(error.severity); // 'warning' | 'error' | 'critical'

  if (error.dismissible) {
    clearError();
  }
}
```

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test sessionService

# Watch mode
pnpm test --watch
```

### Test Coverage

- ✅ `sessionService.ts` - Session lifecycle functions
- ✅ `pomodoroCalculator.ts` - Phase calculations
- ✅ `timeFormatter.ts` - Time formatting
- ⏳ `focusStore.ts` - Store actions (Phase 5)
- ⏳ `timerService.ts` - Timer logic (Phase 5)

## Best Practices

### 1. Always Clean Up

```typescript
useEffect(() => {
  const {cleanup} = useFocusStore.getState();

  return () => {
    cleanup(); // Prevents memory leaks
  };
}, []);
```

### 2. Handle Async Errors

```typescript
try {
  await loadSessions();
} catch (error) {
  // Error is already set in store.error
  // UI can display it
}
```

### 3. Use Selectors for Performance

```typescript
// ❌ Re-renders on any state change
const state = useFocusStore();

// ✅ Only re-renders when timerState changes
const timerState = useFocusStore(state => state.timerState);
```

### 4. Respect Session Lifecycle

```typescript
// ❌ Don't modify currentSession directly
set({currentSession: {...session, pomodorosCompleted: 5}});

// ✅ Use sessionService functions
const updated = updateSession(session, {pomodorosCompleted: 5});
set({currentSession: updated});
```

## Troubleshooting

### Timer Drift

**Symptom:** Timer shows incorrect time after app backgrounding

**Solution:** TimerService uses drift correction. Ensure you're using the singleton:

```typescript
const timer = getTimerService(); // ✅ Singleton
const timer = new TimerService(); // ❌ Creates new instance
```

### Lost Sessions

**Symptom:** Session disappears after app restart

**Solution:** Check intermediate persistence is working:

```typescript
// Should save after each work phase
await storageService.saveCurrentSession(updatedSession);

// Should clear on stop
await storageService.saveCurrentSession(null);
```

### Incorrect Statistics

**Symptom:** Pomodoro count doesn't match reality

**Solution:** Use `calculateTotalPomodoros()`, not `countPomodoroSessions()`:

```typescript
// ✅ Correct
const pomodoros = sessionService.calculateTotalPomodoros(sessions);
```

## Migration Notes

### Phase 4 → Phase 5

When implementing UI (Phase 5):

1. **Crash Recovery Dialog:** Check `currentSession` on mount, show recovery UI
2. **Pomodoro Counter:** Display `timerState.pomodorosCompleted`
3. **Session History:** Display `sessions` with `session.pomodorosCompleted`
4. **Error Handling:** Display `error` state with dismiss button

## References

- [Focus Requirements](../../../docs/focus-requirements.md) - Full functional requirements
- [Focus Roadmap](../../../docs/focus-roadmap.md) - Implementation phases
- [Testing Guide](../../../TESTING_GUIDE.md) - Testing standards

## Questions?

For questions or clarifications, refer to:

- Code comments in `focusStore.ts` (comprehensive JSDoc)
- Type definitions in `focus.types.ts` (all interfaces documented)
- Session definition in `focus-requirements.md` (design rationale)
