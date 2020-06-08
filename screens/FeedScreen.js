import * as React from 'react';
import { View } from 'react-native';
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
        <FeedComponent navigation={this.props.navigation} />
      </View >
    );
  }
}