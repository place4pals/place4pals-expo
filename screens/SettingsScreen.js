import * as React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', paddingTop: 50 }}>
          <Image source={require('../assets/images/logo.png')} style={{ width: 80, height: 80 }} />
          <Text style={{ color: '#000000', fontFamily: 'ubuntu', marginTop: 20 }}>Settings page content goes here.</Text>
          <TouchableOpacity onPress={() => { this.props.navigation.reset({ routes: [{ name: 'auth' }] }); }} style={{ marginTop: 20 }}>
            <Text style={{ color: '#000000', fontFamily: 'ubuntu', marginTop: 20 }}>Log out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}