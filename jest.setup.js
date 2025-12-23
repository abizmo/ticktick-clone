// Mock react-native-vector-icons
jest.mock("react-native-vector-icons/Ionicons", () => "Icon");

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native/Libraries/Components/View/View");
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    State: {},
    Directions: {},
  };
});

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock SafeAreaProvider
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
