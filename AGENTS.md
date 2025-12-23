# AGENTS.md

Guidelines for AI coding agents working in this React Native (0.74.1) TickTick clone repository.

## Build/Lint/Test Commands

- `pnpm test` - Run all Jest tests
- `pnpm test <test-file-pattern>` - Run single test file (e.g., `pnpm test TaskListScreen`)
- `pnpm run lint` - Run ESLint on all files
- `pnpm run ios` - Run on iOS simulator
- `pnpm run android` - Run on Android emulator
- `pnpm start` - Start Metro bundler

## Code Style Guidelines

**Imports:** Group in order: (1) React/React Native core, (2) Third-party libraries, (3) Local imports (navigation/screens/data/types)

**TypeScript:** Use strict typing with interfaces for all props and data structures. Use union types for enums (`'low' | 'medium' | 'high'`). Mark optional props with `?:`.

**Components:** Functional components only. Define prop types as interfaces (e.g., `interface TaskListScreenProps`). Return type `React.JSX.Element` for main components.

**Naming:** PascalCase for components/interfaces, camelCase for functions/variables/props, SCREAMING_SNAKE_CASE for constants.

**Styling:** Use `StyleSheet.create()` at the bottom of each file. Follow React Native style object patterns with camelCase properties.

**Formatting:** 2-space indentation, single quotes for strings, semicolons required, no trailing commas in single-line objects.

**Error Handling:** Use optional chaining (`?.`) and nullish coalescing (`??`) for safe property access. Provide fallback values for undefined cases.
