import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Dimensions, View } from 'react-native';

import TabBarIcon from '../components/TabBarIcon';
import FeedNavigator from '../navigation/FeedNavigator';
import PoolsScreen from '../screens/PoolsScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfileScreen from '../screens/ProfileScreen';
//import CameraScreen from '../screens/CameraScreen';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    Dimensions.get('window').width > 800 ?
      <Stack.Navigator initialRouteName={'feed'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="feed" component={FeedNavigator} options={{ animationEnabled: false }} />
        <Stack.Screen name="pools" component={PoolsScreen} options={{ animationEnabled: false }} />
        <Stack.Screen name="inbox" component={InboxScreen} options={{ animationEnabled: false }} />
        <Stack.Screen name="profile" component={ProfileScreen} options={{ animationEnabled: false }} />
      </Stack.Navigator>
      :
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
          name="pools"
          component={PoolsScreen}
          options={{ tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} image={require('../assets/images/poolsTab.png')} />, title: 'Pools' }}
        />
        <BottomTab.Screen
          name="inbox"
          component={InboxScreen}
          options={{ tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} image={require('../assets/images/inboxTab.png')} />, title: 'Inbox' }}
        />
        <BottomTab.Screen
          name="profile"
          component={ProfileScreen}
          options={{ tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} image={require('../assets/images/profileTab.png')} />, title: 'Profile' }}
        />
        {/* <BottomTab.Screen
          name="camera"
          component={CameraScreen}
          options={{ tabBarVisible: false, tabBarButton: props => <View /> }}
        /> */}
      </BottomTab.Navigator>
  );
}