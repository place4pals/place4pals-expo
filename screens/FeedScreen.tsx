import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import * as root from '../Root';
import { useFocusEffect } from '@react-navigation/native';
import FeedComponent from '../components/FeedComponent';

export default function FeedScreen({ route, navigation }: any) {
  const [state, setState] = useState({
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!route.params) { route.params = {}; }
      onRefresh();
    }, [])
  );

  let onRefresh = async () => {
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <FeedComponent navigation={navigation} route={route} />
      {!root.desktopWeb && <TouchableOpacity onPress={() => { navigation.navigate('addPost'); }} style={{ position: 'absolute', bottom: 10, right: 10, opacity: 1, height: 60, width: 60, borderRadius: 30, borderColor: '#000000', borderWidth: 1, backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center' }}><Text style={{ color: '#000000', fontSize: 40, textAlign: 'center', marginTop: -2 }}>+</Text></TouchableOpacity>}
    </View >
  );
}
