import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const BottomTab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <BottomTab.Navigator initialRouteName={'home'} tabBarOptions={{
      style: { backgroundColor: '#ffffff' },
      labelStyle: { fontSize: 15, fontFamily: 'ubuntu' },
    }}>
      <BottomTab.Screen
        name="home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />, title: 'Home' }}
      />
      <BottomTab.Screen
        name="settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-settings" />, title: 'Settings' }}
      />
    </BottomTab.Navigator>
  );
}