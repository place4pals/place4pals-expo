import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Dimensions, Platform, View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import FeedScreen from '../screens/FeedScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinkingConfiguration from './LinkingConfiguration';
import BlankScreen from '../screens/BlankScreen';
import ResetScreen from '../screens/ResetScreen';
import LogoSvg from "../svgs/logo"

export default function Navigation({ navigation }: any) {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator navigation={navigation} />
    </NavigationContainer>
  );
}

const RootStack = createStackNavigator<any>();
const AuthStack = createStackNavigator<any>();
const AppStack = createBottomTabNavigator<any>();
const TabStack = createStackNavigator<any>();

function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="auth" options={{ animationEnabled: false }}>
        {props => <AuthStack.Navigator {...props} screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="login" component={LoginScreen} options={{ animationEnabled: false }} />
          <AuthStack.Screen name="signup" component={SignupScreen} options={{ animationEnabled: false }} />
          <AuthStack.Screen name="reset" component={ResetScreen} options={{ animationEnabled: false }} />
        </AuthStack.Navigator>}
      </RootStack.Screen>
      <RootStack.Screen name="app" options={{ animationEnabled: false }}>
        {props =>
          <AppStack.Navigator {...props} initialRouteName="feed"
            tabBarOptions={{ activeTintColor: '#000000', style: Platform.OS === 'web' ? { position: 'absolute', top: 10, width: 1180, paddingLeft: 40, paddingRight: 40, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#ffffff', borderTopWidth: 0 } : {}, labelStyle: Platform.OS !== 'web' ? { top: -12, fontSize: 20 } : {} }}>
            {Platform.OS === 'web' &&
              <AppStack.Screen name="logo"
                component={BlankScreen}
                options={{
                  tabBarButton: props =>
                    <TouchableOpacity onPress={() => { }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <LogoSvg width={50} height={50} style={{ marginRight: 5 }} />
                    </TouchableOpacity>
                }}
              />}
            <AppStack.Screen name="feed">
              {props => <TabStack.Navigator {...props} screenOptions={{ headerShown: false }}>
                <TabStack.Screen name="feed" component={FeedScreen} />
              </TabStack.Navigator>}
            </AppStack.Screen>
            <AppStack.Screen name="pools">
              {props => <TabStack.Navigator {...props} screenOptions={{ headerShown: false }}>
                <TabStack.Screen name="pools" component={BlankScreen} />
              </TabStack.Navigator>}
            </AppStack.Screen>
            <AppStack.Screen name="inbox">
              {props => <TabStack.Navigator {...props} screenOptions={{ headerShown: false }}>
                <TabStack.Screen name="inbox" component={BlankScreen} />
              </TabStack.Navigator>}
            </AppStack.Screen>
            <AppStack.Screen name="profile">
              {props => <TabStack.Navigator {...props} screenOptions={{ headerShown: false }}>
                <TabStack.Screen name="profile" component={BlankScreen} />
              </TabStack.Navigator>}
            </AppStack.Screen>
            {Platform.OS === 'web' &&
              <AppStack.Screen name="webcontrols"
                component={BlankScreen}
                options={{
                  tabBarButton: props =>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 600 }}>
                    </View>
                }}
              />}
          </AppStack.Navigator>
        }
      </RootStack.Screen>
    </RootStack.Navigator >
  );
}