import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', paddingTop: 50 }}>
          <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', padding: 20, paddingTop: 0 }}>
            <Image source={require('../assets/images/logo.png')} style={{ width: 50, height: 50 }} />
            <Text style={{ color: '#000000', marginLeft: 10, fontSize: 40 }}>Profile</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}