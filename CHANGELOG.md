# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-01-03

### 🎉 Major Release: Focus Feature (Pomodoro Timer)

This release introduces a complete Pomodoro timer implementation, replacing the previous simple Focus screen with a comprehensive productivity tool.

### ⚠️ BREAKING CHANGES

#### Removed
- **Old FocusScreen** - The previous "high-priority tasks" view has been replaced
  - Old file: `src/screens/FocusScreen.tsx` → Renamed to `FocusScreen.old.tsx`
  - Old tests: `__tests__/screens/FocusScreen.test.tsx` → Renamed to `FocusScreen.old.test.tsx`
  - **Migration:** The old screen is preserved as `FocusScreen.old.tsx` for reference

#### Changed
- **Focus Tab Navigation** - Now opens the new Pomodoro timer instead of task list
  - Before: Showed high-priority and due-soon tasks
  - After: Shows Pomodoro timer with task integration

### ✨ Added

#### Focus Feature (Pomodoro Timer)
- **Core Timer Functionality**
  - 25-minute work sessions (Pomodoro Technique)
  - 5-minute short breaks
  - 15-minute long breaks (after 4 pomodoros)
  - Pause/resume support (max 3 pauses per session)
  - Stop with confirmation
  - Drift correction for timer accuracy

- **Task Integration**
  - Select task before starting Focus
  - Start Focus directly from task list (timer icon)
  - Task pre-selection via navigation params
  - "No task" option for general focus

- **Session Management**
  - Session history (today's sessions)
  - Session statistics (total minutes, pomodoros completed)
  - Session status (completed/interrupted)
  - Pause count tracking
  - Auto-save sessions

- **Notifications**
  - Work session complete notifications
  - Break complete notifications
  - Permission handling (iOS/Android)
  - Graceful degradation without permissions
  - Sound and vibration support

- **Settings**
  - Customizable work duration (5-60 minutes)
  - Customizable short break (1-30 minutes)
  - Customizable long break (5-60 minutes)
  - Pomodoros before long break (2-8)
  - Maximum pauses per session (0-5)
  - Confirm stop toggle
  - Restore defaults button

- **Persistence**
  - AsyncStorage for settings and sessions
  - Crash recovery (restore active session)
  - Session history persistence
  - Settings auto-save

- **UI Components**
  - Circular timer with progress indicator
  - Timer controls (Start/Pause/Resume/Stop)
  - Task selector modal
  - Pomodoro progress indicator (🍅 counter)
  - Session history list
  - Settings screen

#### Architecture & Infrastructure
- **State Management**
  - Zustand store for Focus feature
  - Event-driven timer service
  - Service layer architecture
  - Utility functions (calculators, formatters)

- **Testing**
  - 452 new tests for Focus feature
  - 95%+ code coverage on tested files
  - Unit tests (services, utils)
  - Integration tests (store)
  - Component tests (screens)

- **Documentation**
  - Technical architecture guide
  - User guide with FAQ
  - Development roadmap
  - Testing documentation
  - CHANGELOG (this file)

### 🔧 Technical Details

#### New Dependencies
- `zustand@4.x` - State management
- `@react-native-async-storage/async-storage@1.x` - Local storage
- `@notifee/react-native@9.x` - Local notifications

#### Removed Dependencies
- `react-native-push-notification` - Replaced with Notifee
- `@react-native-community/push-notification-ios` - No longer needed

#### File Structure
```
src/features/focus/
├── components/       # 6 UI components
├── screens/          # 2 screens (Focus, Settings)
├── store/            # Zustand store
├── services/         # 4 services (timer, session, storage, notification)
├── utils/            # 2 utility modules
├── types/            # TypeScript definitions
└── constants/        # Default settings
```

#### Test Coverage
- **Total Tests:** 775 (452 new for Focus)
- **Utils:** 100% coverage (202 tests)
- **Services:** 95-100% coverage (173 tests)
- **Store:** 98.04% coverage (77 tests)

### 📊 Statistics

#### Development
- **Duration:** 11 days (10 phases)
- **Pull Requests:** 9 merged PRs
- **Code Quality:** 87-95/100 across all phases
- **Lines of Code:** ~4,500 (production) + ~6,000 (tests)

#### Team
- **Coordinador:** Architecture, integration, critical fixes
- **@rn-ui:** UI components and screens
- **@rn-tester:** Comprehensive test suites
- **@rn-reviewer:** Code reviews and quality assurance
- **@rn-config:** Native configuration (Android/iOS)

### 🐛 Bug Fixes
- None (new feature)

### 🔒 Security
- No security issues
- Local-only data storage (no cloud sync yet)
- Notification permissions properly handled

### 📝 Documentation
- Added `docs/focus-architecture.md` - Technical architecture
- Added `docs/focus-user-guide.md` - User guide with FAQ
- Updated `README.md` - Focus feature section
- Updated `docs/focus-roadmap.md` - Development progress

### 🚀 Performance
- Timer drift correction for accuracy
- Efficient state updates (Zustand selectors)
- Optimized AsyncStorage operations
- Memory leak prevention (cleanup on unmount)

### ♿ Accessibility
- 98% accessibility score
- Proper ARIA labels and roles
- 44x44 touch targets
- Screen reader support

### 🌐 Platform Support
- ✅ iOS (tested on iOS 14+)
- ✅ Android (tested on Android 21+)

### 📱 Known Limitations
- **Background Timer:** Limited by OS (iOS ~30s, Android variable)
  - Mitigation: Crash recovery, session persistence
- **Notifications:** Require user permissions
  - Mitigation: Graceful degradation
- **AsyncStorage:** 6MB limit
  - Mitigation: Sufficient for MVP, limit session history

### 🔮 Future Enhancements
See `docs/focus-roadmap.md` for planned features:
- Phase 12: UI/UX refinement, performance optimization
- Phase 13: Backend integration, cloud sync
- Custom timer presets
- Statistics dashboard
- Export data functionality

---

## [0.1.0] - 2025-12-26 (Pre-Focus)

### Initial Release
- Task list management
- Calendar view
- Settings screen
- Basic navigation
- Testing infrastructure

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| **1.0.0** | 2026-01-03 | Focus Feature (Pomodoro Timer) - Major release |
| 0.1.0 | 2025-12-26 | Initial release with basic features |

---

## Migration Guide

### From 0.1.0 to 1.0.0

#### Breaking Changes

**Focus Screen Replacement:**
- The old Focus screen (high-priority tasks view) has been replaced with a Pomodoro timer
- If you relied on the old Focus screen, you can still access it via `FocusScreen.old.tsx`

**No Action Required:**
- All existing features (task lists, calendar, settings) remain unchanged
- The new Focus feature is additive and doesn't affect existing functionality

#### New Features Available

**Start Using the Focus Feature:**
1. Tap the Focus tab in bottom navigation
2. Select a task (optional)
3. Tap "Start Focus"
4. Work for 25 minutes
5. Take a 5-minute break

**Customize Settings:**
1. Go to Settings tab
2. Scroll to "Focus" section
3. Tap "Pomodoro Configuration"
4. Adjust durations and preferences

**Quick Start from Tasks:**
1. Go to any task list
2. Tap the timer icon (⏱️) on any task
3. Focus screen opens with task pre-selected

---

## Support

For questions or issues:
- See [Focus User Guide](./docs/focus-user-guide.md) for usage help
- See [Focus Architecture](./docs/focus-architecture.md) for technical details
- Check [FAQ](./docs/focus-user-guide.md#faq) for common questions

---

**Maintained by:** Development Team  
**Last Updated:** January 3, 2026
