import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StackNavigator from './StackNavigator';
import { SCREENS } from '../constants/screens';
import { AuthProvider } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <AuthProvider>
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 280,
        },
        drawerActiveTintColor: '#006dfc',
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
      drawerContent={props => {
        const { navigation } = props;
        const navState = navigation.getState();
        const activeDrawerRoute = navState?.routes?.[navState.index || 0];
        const nestedState = activeDrawerRoute?.state;
        const currentStackRouteName = nestedState?.routes
          ? nestedState.routes[nestedState.index || 0]?.name
          : undefined;
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItem
              label="Tasks"
              icon={({ color, size }) => (
                <Icon name="assignment" size={size} color={color} />
              )}
              focused={currentStackRouteName === SCREENS.HOME}
              onPress={() => {
                navigation.navigate('TaskTracker', { screen: SCREENS.HOME });
              }}
            />
            <DrawerItem
              label="Settings"
              icon={({ color, size }) => (
                <Icon name="settings" size={size} color={color} />
              )}
              focused={currentStackRouteName === SCREENS.SETTINGS}
              onPress={() => {
                navigation.navigate('TaskTracker', { screen: SCREENS.SETTINGS });
              }}
            />
            <DrawerItem
              label="About"
              icon={({ color, size }) => (
                <Icon name="info" size={size} color={color} />
              )}
              focused={currentStackRouteName === SCREENS.ABOUT}
              onPress={() => {
                navigation.navigate('TaskTracker', { screen: SCREENS.ABOUT });
              }}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen name="TaskTracker" component={StackNavigator} />
    </Drawer.Navigator>
    </AuthProvider>
  );
};

export default DrawerNavigator;
