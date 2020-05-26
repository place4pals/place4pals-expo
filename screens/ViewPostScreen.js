import * as React from 'react';
import { Image, Text, View, RefreshControl, TextInput, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import FeedComponent from '../components/FeedComponent';

export default class ViewPostScreen extends React.Component {
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
                <ScrollView style={{ flex: 1, width: '100%' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={this.onRefresh.bind(this)}
                            colors={["#000000"]}
                            tintColor='#000000'
                            titleColor="#000000"
                            title="Pull to refresh"
                        />
                    }>
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', padding: 20, paddingTop: 50, marginBottom: 30, justifyContent: 'space-between' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Image source={require('../assets/images/logo.png')} style={{ width: 50, height: 50 }} />
                            <Text style={{ color: '#000000', marginLeft: 10, fontSize: 40 }}>View Post</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 20, paddingTop: 0 }}>
                        <FeedComponent navigation={this.props.navigation} viewPost={this.props.route.params.postId} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}