import { useLinking } from '@react-navigation/native';
import { Linking } from 'expo';

export default function (containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.makeUrl('/')],
    config: {
      path: 'auth',
      screens: {
        app: {
          path: 'app',
          screens: {
            home: 'home',
            settings: 'settings',
          },
        },
        auth: {
          path: 'auth',
          screens: {
            login: 'login',
            signup: 'signup',
          },
        },
      }
    },
  });
}
