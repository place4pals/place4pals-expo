import * as React from 'react';
import { View } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class ProfileScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <HeaderComponent navigation={this.props.navigation} screen='profile' />
      </View>
    );
  }
}