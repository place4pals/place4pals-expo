import * as React from 'react';
import { Image } from 'react-native';

export default function TabBarIcon(props) {
  return (
    <Image style={{ height: 40, width: 40, tintColor: props.focused ? '#6195DA' : '#cccccc' }} source={props.image} />
  );
}
