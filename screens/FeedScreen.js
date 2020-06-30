import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    this.props.navigation.addListener('focus', this.focus);
    this.focus();
  }
  focus = async () => {
    //console.log("FeedScreen focus");
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <HeaderComponent navigation={this.props.navigation} screen='feed' />
        <FeedComponent navigation={this.props.navigation} route={this.props.route} />
        {!root.desktopWeb && <TouchableOpacity onPress={() => { this.props.navigation.navigate('addPost'); }} style={{ position: 'absolute', bottom: 10, right: 10, opacity: 1, height: 60, width: 60, borderRadius: 30, borderColor: '#000000', borderWidth: 1, backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center' }}><Text style={{ color: '#000000', fontSize: 40, textAlign: 'center', marginTop: -2 }}>+</Text></TouchableOpacity>}
      </View >
    );
  }
}