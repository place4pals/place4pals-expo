import React, { useState } from 'react';
import { Auth } from "aws-amplify";
import { TouchableOpacity, ScrollView, Text, View } from 'react-native';
import { LoadingComponent } from '../components/LoadingComponent';

export default function BlankScreen({ route, navigation }: any) {
  const [state, setState] = useState({
    loading: false
  });
  let logout = async () => {
    setState({ ...state, loading: true });
    await Auth.signOut();
    setState({ ...state, loading: false });
    navigation.navigate('auth');
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <TouchableOpacity onPress={logout}>
        <Text>Log Out</Text>
      </TouchableOpacity>
      {state.loading && <LoadingComponent />}
    </View>
  );
}