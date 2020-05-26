import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import FeedNavigator from '../navigation/FeedNavigator';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const BottomTab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <BottomTab.Navigator initialRouteName={'feed'} tabBarOptions={{
      style: { backgroundColor: '#ffffff' },
      labelStyle: { fontSize: 15 },
    }}>
      <BottomTab.Screen
        name="feed"
        component={FeedNavigator}
        options={{ tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} image={require('../assets/images/feedTab.png')} />, title: 'Feed' }}
      />
      <BottomTab.Screen
        name="messages"
        component={MessagesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} image={require('../assets/images/messagesTab.png')} />, title: 'Messages' }}
      />
      <BottomTab.Screen
        name="profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} image={require('../assets/images/profileTab.png')} />, title: 'Profile' }}
      />
      <BottomTab.Screen
        name="settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} image={require('../assets/images/settingsTab.png')} />, title: 'Settings' }}
      />
    </BottomTab.Navigator>
  );
}