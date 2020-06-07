import * as React from 'react';
import { Image, Text, View, RefreshControl, TextInput, ScrollView, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    loading: false,
    posts: [],
    commentInputs: []
  };
  async componentDidMount() {
    this.onRefresh(false);
  }
  async onRefresh(showLoader = true) {
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <HeaderComponent navigation={this.props.navigation} screen='messages' />
        <ScrollView style={{ flex: 1, width: '100%' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.onRefresh.bind(this)}
              colors={["#000000"]}
              tintColor='#000000'
              titleColor="#000000"
              title=""
            />
          }>
          <View style={[root.scrollViewContainer]}>
            <View style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingTop: 30 }}>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}