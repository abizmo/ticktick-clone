# TickTick Clone

> A modern task management application built with React Native, featuring multiple lists, focus view, calendar integration, and comprehensive test coverage.

![React Native](https://img.shields.io/badge/React%20Native-0.74.1-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-3178c6?logo=typescript)
![Tests](https://img.shields.io/badge/tests-775%20passing-success)
![Coverage](https://img.shields.io/badge/coverage-95%25+-green)
![Zustand](https://img.shields.io/badge/Zustand-state%20management-orange)

---

## Screenshots

> 📸 Screenshots coming soon

The app includes the following screens:

- **Task Lists** - Drawer navigation with multiple custom lists
- **Focus Feature** - Pomodoro timer with task integration (NEW! 🍅)
- **Calendar View** - Week navigation with task filtering
- **Settings** - Customization options and preferences

---

## Features

- 📋 **Multiple Task Lists** - Create and organize tasks in custom lists with colors and icons
- 🍅 **Focus Feature (Pomodoro Timer)** - NEW! Boost productivity with the Pomodoro Technique
  - 25-minute work sessions with 5-minute breaks
  - Customizable durations and settings
  - Task integration (start Focus from any task)
  - Session history and statistics
  - Local notifications
  - Crash recovery and persistence
- 📅 **Calendar Integration** - Week view with task filtering by date
- ⚙️ **Customizable Settings** - Notifications, sound, dark mode, and more
- ✅ **Task Management** - Priorities, due dates, descriptions, and completion tracking
- 🧪 **Comprehensive Testing** - 775 tests passing with 95%+ code coverage

---

## Tech Stack

| Technology                   | Version | Purpose                          |
| ---------------------------- | ------- | -------------------------------- |
| React Native                 | 0.74.1  | Mobile framework                 |
| TypeScript                   | 5.0.4   | Type safety                      |
| React Navigation             | 6.x     | Navigation (Tabs, Drawer, Stack) |
| Zustand                      | 4.x     | State management (Focus feature) |
| AsyncStorage                 | 1.x     | Local data persistence           |
| Notifee                      | 9.x     | Local notifications              |
| Jest                         | 29.6.3  | Testing framework                |
| React Native Testing Library | 13.3.3  | Component testing                |
| React Native Vector Icons    | 10.0.3  | Icon library                     |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **pnpm** >= 8.x
- **React Native CLI** (not Expo)
- **iOS Development**: Xcode 14+ (macOS only)
- **Android Development**: Android Studio with SDK 21+

> For detailed setup instructions, visit [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ticktick-clone
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Install iOS pods (macOS only)

```bash
cd ios && pod install && cd ..
```

### 4. Run the application

**For iOS:**

```bash
pnpm run ios
```

**For Android:**

```bash
pnpm run android
```

> **Troubleshooting**: If you encounter build issues, try cleaning the build cache:
>
> - iOS: `cd ios && rm -rf build && cd ..`
> - Android: `cd android && ./gradlew clean && cd ..`

---

## Available Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `pnpm start`         | Start Metro bundler      |
| `pnpm run ios`       | Run on iOS simulator     |
| `pnpm run android`   | Run on Android emulator  |
| `pnpm test`          | Run all tests once       |
| `pnpm test:watch`    | Run tests in watch mode  |
| `pnpm test:coverage` | Generate coverage report |
| `pnpm run lint`      | Run ESLint               |

---

## Project Structure

```
ticktick-clone/
├── src/
│   ├── features/
│   │   └── focus/         # Focus Feature (Pomodoro Timer)
│   │       ├── components/    # UI components (Timer, Controls, etc.)
│   │       ├── screens/       # FocusScreen, FocusSettingsScreen
│   │       ├── store/         # Zustand state management
│   │       ├── services/      # Business logic (timer, session, storage, notifications)
│   │       ├── utils/         # Helper functions (calculators, formatters)
│   │       ├── types/         # TypeScript definitions
│   │       └── constants/     # Default settings
│   ├── data/              # Mock data and TypeScript interfaces
│   ├── navigation/        # React Navigation setup (Drawer, Tabs)
│   └── screens/           # Screen components (Calendar, Settings, TaskList)
├── __tests__/             # Test suites (15 suites, 775 tests)
│   └── features/focus/    # Focus feature tests (452 tests)
├── __mocks__/             # Jest mocks for navigation and libraries
├── docs/                  # Documentation
│   ├── focus-architecture.md  # Technical architecture
│   ├── focus-user-guide.md    # User guide
│   └── focus-roadmap.md       # Development roadmap
├── android/               # Android native project
└── ios/                   # iOS native project (not tracked in git)
```

---

## Testing

### Test Coverage

```
Test Suites: 15 passed, 15 total
Tests:       775 passed, 2 skipped, 777 total
Coverage:    95%+ on Focus feature files
```

**Highlights:**

- ✅ 100% coverage on Focus utils (pomodoroCalculator, timeFormatter)
- ✅ 100% coverage on sessionService
- ✅ 99.12% coverage on timerService
- ✅ 98.04% coverage on focusStore (integration tests)
- ✅ 95.12% coverage on storageService
- ✅ 452 tests for Focus feature alone

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (recommended for development)
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

For detailed testing information, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## Focus Feature (Pomodoro Timer) 🍅

The Focus Feature is a comprehensive Pomodoro timer implementation that helps you boost productivity using the Pomodoro Technique.

### What is the Pomodoro Technique?

The Pomodoro Technique is a time management method that uses a timer to break work into focused 25-minute intervals (called "pomodoros"), separated by short breaks.

**How it works:**
1. Work for 25 minutes (1 pomodoro)
2. Take a 5-minute break
3. After 4 pomodoros, take a longer 15-minute break
4. Repeat!

### Key Features

- ⏱️ **Customizable Timer** - Adjust work/break durations (5-60 minutes)
- 📋 **Task Integration** - Start Focus directly from any task
- 📊 **Session History** - Track all your focus sessions
- 🔔 **Smart Notifications** - Get notified when sessions complete
- ⚙️ **Flexible Settings** - Customize pomodoros, breaks, and pause limits
- 💾 **Auto-Save** - Sessions are saved automatically
- 🔄 **Crash Recovery** - Resume sessions after app restart

### Quick Start

1. Tap the **Focus** tab
2. (Optional) Select a task to focus on
3. Tap **"Start Focus"**
4. Work until the timer completes
5. Take your break when prompted!

### Architecture

The Focus Feature is built with:
- **Zustand** - State management
- **AsyncStorage** - Local persistence
- **Notifee** - Local notifications
- **EventEmitter** - Timer service
- **TypeScript** - Full type safety

**Stats:**
- 17 source files (~4,500 lines)
- 452 tests (95%+ coverage)
- 10 development phases
- 9 merged PRs

### Documentation

- **[User Guide](./docs/focus-user-guide.md)** - How to use the Focus feature
- **[Architecture](./docs/focus-architecture.md)** - Technical documentation
- **[Roadmap](./docs/focus-roadmap.md)** - Development history

---

## Documentation

### Focus Feature
- **[Focus User Guide](./docs/focus-user-guide.md)** - Complete user guide for the Pomodoro timer
- **[Focus Architecture](./docs/focus-architecture.md)** - Technical architecture and design
- **[Focus Roadmap](./docs/focus-roadmap.md)** - Development roadmap and progress

### Testing
- **[TESTING_SUMMARY.md](./TESTING_SUMMARY.md)** - Comprehensive testing analysis and strategy
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Quick reference for running and writing tests

### Development
- **[AGENTS.md](./AGENTS.md)** - Guidelines for AI coding agents
- **[CLAUDE.md](./CLAUDE.md)** - Project context and documentation
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and breaking changes

---

## License

This project is private and not licensed for public use.

---

**Built with ❤️ using React Native and TypeScript**
