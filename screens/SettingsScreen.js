import * as React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <HeaderComponent navigation={this.props.navigation} screen='settings' />
        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', paddingTop: 0 }}>
          <TouchableOpacity onPress={() => { this.props.navigation.reset({ routes: [{ name: 'auth' }] }); }} style={{ marginTop: 15, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 100, height: 35 }}>
            <Text style={{ fontSize: 16, margin: 5, textAlign: 'center', marginTop: root.web ? 2 : 6 }}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}