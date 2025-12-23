const React = require("react");

export const createNativeStackNavigator = () => ({
  Navigator: ({ children }) => React.createElement("View", null, children),
  Screen: ({ children }) => React.createElement("View", null, children),
});
