import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SCREENS } from '../constants/screens';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import TaskScreen from '../screens/TaskScreen/TaskScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import AboutScreen from '../screens/AboutScreen/AboutScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.HOME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name={SCREENS.HOME} 
        component={HomeScreen} 
      />
      <Stack.Screen 
        name={SCREENS.TASK_DETAILS} 
        component={TaskScreen}
        options={{
          headerShown: true,
          headerTitle: 'Task Details',
          headerStyle: {
            backgroundColor: '#006dfc',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name={SCREENS.SETTINGS}
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerStyle: {
            backgroundColor: '#006dfc',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name={SCREENS.ABOUT}
        component={AboutScreen}
        options={{
          headerShown: true,
          headerTitle: 'About',
          headerStyle: {
            backgroundColor: '#006dfc',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
