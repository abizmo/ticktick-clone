export const NavigationContainer = ({ children }) => children;

export const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => false),
});

export const useRoute = () => ({
  key: "test-route",
  name: "TestScreen",
  params: {},
});

export const useFocusEffect = (callback) => {
  callback();
};

export const useIsFocused = () => true;

export const createNavigationContainerRef = () => ({
  current: null,
});

export const CommonActions = {
  navigate: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  setParams: jest.fn(),
};
