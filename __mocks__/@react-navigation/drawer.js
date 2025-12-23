const React = require("react");

export const createDrawerNavigator = () => ({
  Navigator: ({ children }) => React.createElement("View", null, children),
  Screen: ({ children }) => React.createElement("View", null, children),
});

export const DrawerContentScrollView = ({ children }) =>
  React.createElement("View", null, children);

export const DrawerItem = () => React.createElement("View", null);
