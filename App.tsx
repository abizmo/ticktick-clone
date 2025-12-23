import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

import ListsNavigator from './src/navigation/ListsNavigator';
import FocusScreen from './src/screens/FocusScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName = '';

              if (route.name === 'Lists') {
                iconName = focused ? 'list' : 'list-outline';
              } else if (route.name === 'Focus') {
                iconName = focused ? 'flash' : 'flash-outline';
              } else if (route.name === 'Calendar') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}>
          <Tab.Screen name="Lists" component={ListsNavigator} />
          <Tab.Screen name="Focus" component={FocusScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
