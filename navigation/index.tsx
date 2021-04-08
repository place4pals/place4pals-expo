import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Dimensions, Platform, View, Text, TouchableOpacity, TextInput } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import FeedScreen from '../screens/FeedScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinkingConfiguration from './LinkingConfiguration';
import BlankScreen from '../screens/BlankScreen';
import ResetScreen from '../screens/ResetScreen';
import ChatScreen from '../screens/ChatScreen';
import PokerScreen from '../screens/PokerScreen';
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
                      <LogoSvg width={25} height={25} style={{ marginRight: 5 }} />
                    </TouchableOpacity>
                }}
              />}
            <AppStack.Screen name="feed" options={{ title: '= feed' }}>
              {props => <TabStack.Navigator {...props} screenOptions={{ headerShown: false }}>
                <TabStack.Screen name="feed" component={FeedScreen} />
              </TabStack.Navigator>}
            </AppStack.Screen>
            <AppStack.Screen name="pools" options={{ title: '≈ pools' }}>
              {props => <TabStack.Navigator {...props} screenOptions={{ headerShown: false }}>
                <TabStack.Screen name="pools" component={BlankScreen} />
              </TabStack.Navigator>}
            </AppStack.Screen>
            <AppStack.Screen name="chat" options={{ title: '⇆ chat' }}>
              {props => <TabStack.Navigator {...props} screenOptions={{ headerShown: false }}>
                <TabStack.Screen name="chat" component={ChatScreen} />
              </TabStack.Navigator>}
            </AppStack.Screen>
            <AppStack.Screen name="profile" options={{ title: '▢ profile' }}>
              {props => <TabStack.Navigator {...props} screenOptions={{ headerShown: false }}>
                <TabStack.Screen name="profile" component={BlankScreen} />
              </TabStack.Navigator>}
            </AppStack.Screen>
            {Platform.OS === 'web' &&
              <AppStack.Screen name="poker" options={{ title: '🂠 poker' }}>
                {props => <TabStack.Navigator {...props} screenOptions={{ headerShown: false }}>
                  <TabStack.Screen name="poker" component={PokerScreen} />
                </TabStack.Navigator>}
              </AppStack.Screen>
            }
            {Platform.OS === 'web' &&
              <AppStack.Screen name="webcontrols"
                component={BlankScreen}
                options={{
                  tabBarButton: props =>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: 600 }}>
                      <TouchableOpacity style={{ borderColor: '#000000', borderRadius: 5, borderWidth: 1, borderStyle: 'solid', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 25, width: 25, marginRight: 10 }} onPress={() => { }} >
                        <Text style={{ color: '#000000', fontSize: 14 }}>↻</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ borderColor: '#000000', borderRadius: 5, borderWidth: 1, borderStyle: 'solid', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 25, width: 80, marginRight: 20 }} onPress={() => { }} >
                        <Text style={{ color: '#000000', fontSize: 14 }}>+ add post</Text>
                      </TouchableOpacity>
                      <TextInput placeholder="search" style={{ borderColor: '#000000', borderRadius: 5, borderWidth: 1, borderStyle: 'solid', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 25, width: 272, marginRight: 10, padding: 5 }} />
                      <TouchableOpacity style={{ borderColor: '#000000', borderRadius: 5, borderWidth: 1, borderStyle: 'solid', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 25, width: 25, marginRight: -5 }} onPress={() => { }} >
                        <Text style={{ color: '#000000', fontSize: 14, fontWeight: 'bold' }}>!</Text>
                      </TouchableOpacity>
                    </View>
                }}
              />}
          </AppStack.Navigator>
        }
      </RootStack.Screen>
    </RootStack.Navigator >
  );
}