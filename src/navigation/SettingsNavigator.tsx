/**
 * Settings Navigator
 *
 * Stack navigator for Settings tab that includes:
 * - Main SettingsScreen
 * - FocusSettingsScreen (Pomodoro configuration)
 *
 * @module SettingsNavigator
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SettingsScreen from '../screens/SettingsScreen';
import FocusSettingsScreen from '../features/focus/screens/FocusSettingsScreen';

const Stack = createStackNavigator();

/**
 * Settings Stack Navigator
 *
 * Provides navigation between main settings and sub-settings screens.
 *
 * @returns React.JSX.Element
 */
function SettingsNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="FocusSettings" component={FocusSettingsScreen} />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
