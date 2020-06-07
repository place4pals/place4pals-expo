import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';


export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <HeaderComponent navigation={this.props.navigation} screen='profile' />
        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', paddingTop: 0 }}>
          <View style={[root.scrollViewContainer]}></View>
        </ScrollView>
      </View>
    );
  }
}