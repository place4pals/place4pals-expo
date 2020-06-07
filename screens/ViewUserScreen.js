import * as React from 'react';
import { Image, Text, View, RefreshControl, TextInput, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import FeedComponent from '../components/FeedComponent';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class ViewUserScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: false
    };
    async componentDidMount() {
        this.onRefresh(false);
    }
    async onRefresh(showLoader = true) {
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <HeaderComponent navigation={this.props.navigation} screen='view user' />
                <ScrollView style={{ flex: 1, width: '100%' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={this.onRefresh.bind(this)}
                            colors={["#000000"]}
                            tintColor='#000000'
                            titleColor="#000000"
                            title="refresh"
                        />
                    }>
                    <View style={{ paddingLeft: root.paddingHorizontal, paddingRight: root.paddingHorizontal, paddingTop: root.paddingTop }}>
                        <FeedComponent navigation={this.props.navigation} viewUser={this.props.route.params.userId} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}