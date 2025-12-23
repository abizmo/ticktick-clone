module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-navigation|react-native-vector-icons|react-native-gesture-handler|react-native-reanimated|react-native-safe-area-context|react-native-screens)/)",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "App.tsx",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 48,
      functions: 72,
      lines: 77,
      statements: 76,
    },
  },
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
