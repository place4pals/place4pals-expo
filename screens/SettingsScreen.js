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
          <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', padding: 20, paddingTop: 0 }}>
            <Image source={require('../assets/images/logo.png')} style={{ width: 50, height: 50 }} />
            <Text style={{ color: '#000000', marginLeft: 10, fontSize: 40 }}>Settings</Text>
          </View>
          <View style={{ display: 'flex' }}>
            <TouchableOpacity onPress={() => { this.props.navigation.reset({ routes: [{ name: 'auth' }] }); }} style={{ marginTop: 15, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 100, height: 35 }}>
              <Text style={{ fontSize: 16, margin: 5, textAlign: 'center', marginTop: 6 }}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}