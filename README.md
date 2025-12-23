# TickTick Clone

> A modern task management application built with React Native, featuring multiple lists, focus view, calendar integration, and comprehensive test coverage.

![React Native](https://img.shields.io/badge/React%20Native-0.74.1-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-3178c6?logo=typescript)
![Tests](https://img.shields.io/badge/tests-197%2F199%20passing-success)
![Coverage](https://img.shields.io/badge/coverage-79.48%25-green)

---

## Screenshots

> 📸 Screenshots coming soon

The app includes the following screens:

- **Task Lists** - Drawer navigation with multiple custom lists
- **Focus View** - High-priority and due-soon tasks
- **Calendar View** - Week navigation with task filtering
- **Settings** - Customization options and preferences

---

## Features

- 📋 **Multiple Task Lists** - Create and organize tasks in custom lists with colors and icons
- 🎯 **Focus View** - Smart view highlighting high-priority and due-soon tasks
- 📅 **Calendar Integration** - Week view with task filtering by date
- ⚙️ **Customizable Settings** - Notifications, sound, dark mode, and more
- ✅ **Task Management** - Priorities, due dates, descriptions, and completion tracking
- 🧪 **Comprehensive Testing** - 99% test pass rate with 79% code coverage

---

## Tech Stack

| Technology                   | Version | Purpose                          |
| ---------------------------- | ------- | -------------------------------- |
| React Native                 | 0.74.1  | Mobile framework                 |
| TypeScript                   | 5.0.4   | Type safety                      |
| React Navigation             | 6.x     | Navigation (Tabs, Drawer, Stack) |
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
│   ├── data/              # Mock data and TypeScript interfaces
│   ├── navigation/        # React Navigation setup (Drawer, Tabs)
│   └── screens/           # Screen components (Calendar, Focus, Settings, TaskList)
├── __tests__/             # Test suites (7 suites, 199 tests)
├── __mocks__/             # Jest mocks for navigation and libraries
├── android/               # Android native project
└── ios/                   # iOS native project (not tracked in git)
```

---

## Testing

### Test Coverage

```
Test Suites: 7 passed, 7 total
Tests:       197 passed, 2 skipped, 199 total
Coverage:    79.48% lines | 76.56% statements | 72% functions | 48.8% branches
```

**Highlights:**

- ✅ 100% coverage on `mockData.ts` (data layer)
- ✅ 100% coverage on `SettingsScreen.tsx`
- ✅ 94.73% coverage on `TaskListScreen.tsx`
- ✅ 90.9% coverage on `FocusScreen.tsx`

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

## Documentation

- **[TESTING_SUMMARY.md](./TESTING_SUMMARY.md)** - Comprehensive testing analysis and strategy (400+ lines)
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Quick reference for running and writing tests
- **[AGENTS.md](./AGENTS.md)** - Guidelines for AI coding agents
- **[CLAUDE.md](./CLAUDE.md)** - Project context and documentation

---

## License

This project is private and not licensed for public use.

---

**Built with ❤️ using React Native and TypeScript**
