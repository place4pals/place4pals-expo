import * as React from 'react';
import { View } from 'react-native';
import FeedComponent from '../components/FeedComponent';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class ViewPostScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <HeaderComponent navigation={this.props.navigation} screen='view post' />
                <FeedComponent navigation={this.props.navigation} route={{ params: null }} viewPost={this.props.route.params.postId} />
            </View>
        );
    }
}