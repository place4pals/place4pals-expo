import * as React from 'react';
import { Image, Text, View, RefreshControl, TextInput, ScrollView, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import FeedComponent from '../components/FeedComponent';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class FeedScreen extends React.Component {
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
        <HeaderComponent navigation={this.props.navigation} screen='feed' />
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
          <View style={{paddingLeft: root.paddingHorizontal, paddingRight: root.paddingHorizontal, paddingTop: root.paddingTop}}>
            <FeedComponent navigation={this.props.navigation} />
          </View>
        </ScrollView>
      </View >
    );
  }
}