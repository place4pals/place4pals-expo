import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName={'login'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={LoginScreen} options={{ animationEnabled: false }} />
            <Stack.Screen name="signup" component={SignupScreen} options={{ animationEnabled: false }} />
        </Stack.Navigator>
    );
}