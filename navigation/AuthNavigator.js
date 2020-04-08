import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName={'login'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={LoginScreen} />
        </Stack.Navigator>
    );
}