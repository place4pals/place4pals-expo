import * as React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';

import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import useLinking from './navigation/useLinking';
import CameraScreen from './screens/CameraScreen';

const Stack = createStackNavigator();

import { Environment } from './Environment';
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";
Amplify.configure({
  Auth: {
    identityPoolId: Environment.identityPoolId,
    region: Environment.region,
    identityPoolRegion: Environment.region,
    userPoolId: Environment.userPoolId,
    userPoolWebClientId: Environment.userPoolWebClientId,
    mandatorySignIn: true,
    authenticationFlowType: "USER_PASSWORD_AUTH"
  },
  API: {
    graphql_endpoint: Environment.endpoint,
    graphql_headers: async () => ({
      Authorization: "Bearer " + (await Auth.currentSession()).idToken.jwtToken
    })
  },
  Storage: {
    AWSS3: {
      bucket: Environment.bucket,
      region: Environment.region
    }
  },
  Analytics: {
    disabled: true
  }
});

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();
        setInitialNavigationState(await getInitialState());
        //in case we want to use any custom fonts...
        await Font.loadAsync({
          'segoeui': require('./assets/fonts/segoeui.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        {Platform.OS === 'ios' && <View style={{ backgroundColor: '#ffffff', height: Constants.statusBarHeight-5 }}><StatusBar barStyle="dark-content" /></View>}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" component={AuthNavigator} options={{ animationEnabled: false }} />
            <Stack.Screen name="app" component={AppNavigator} options={{ animationEnabled: false }} />
            <Stack.Screen name="camera" component={CameraScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}