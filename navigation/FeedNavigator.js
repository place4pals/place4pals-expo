import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import FeedScreen from '../screens/FeedScreen';
import AddPostScreen from '../screens/AddPostScreen';
import ViewPostScreen from '../screens/ViewPostScreen';
import ViewUserScreen from '../screens/ViewUserScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName={'feed'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="feed" component={FeedScreen} />
            <Stack.Screen name="addPost" component={AddPostScreen} />
            <Stack.Screen name="viewPost" component={ViewPostScreen} />
            <Stack.Screen name="viewUser" component={ViewUserScreen} />
        </Stack.Navigator>
    );
}