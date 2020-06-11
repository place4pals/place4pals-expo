import * as React from 'react';
import { View } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class PoolsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <HeaderComponent navigation={this.props.navigation} screen='pools' />
      </View>
    );
  }
}