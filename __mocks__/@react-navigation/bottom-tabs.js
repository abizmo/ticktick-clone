const React = require("react");

export const createBottomTabNavigator = () => ({
  Navigator: ({ children }) => React.createElement("View", null, children),
  Screen: ({ children }) => React.createElement("View", null, children),
});
