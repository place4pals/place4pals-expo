import * as React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import useLinking from './navigation/useLinking';

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
    mandatorySignIn: false,
    authenticationFlowType: "USER_PASSWORD_AUTH"
  },
  API: {
    endpoints: [
      {
        name: "1",
        endpoint: Environment.endpoint,
        region: Environment.region,
        custom_header: async () => ({
          Authorization: (await Auth.currentSession()).idToken.jwtToken,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        })
      },
      {
        name: "2",
        endpoint: Environment.endpoint,
        region: Environment.region
      }
    ]
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
  let authenticated = false;

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          'ubuntu': require('./assets/fonts/Ubuntu-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
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
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" component={AuthNavigator} options={{ animationEnabled: false }} />
            <Stack.Screen name="app" component={AppNavigator} options={{ animationEnabled: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}