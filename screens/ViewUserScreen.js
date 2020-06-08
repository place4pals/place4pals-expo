import * as React from 'react';
import { View } from 'react-native';
import FeedComponent from '../components/FeedComponent';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class ViewUserScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <HeaderComponent navigation={this.props.navigation} screen='view user' />
                <FeedComponent navigation={this.props.navigation} viewUser={this.props.route.params.userId} />
            </View>
        );
    }
}