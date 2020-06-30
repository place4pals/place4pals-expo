import * as React from 'react';
import { View } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class InboxScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <HeaderComponent navigation={this.props.navigation} screen='inbox' />
        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingTop: 30 }}>
        </View>
      </View>
    );
  }
}