import * as React from 'react';
import { Image, Text, View, TextInput, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import HeaderComponent from '../components/HeaderComponent';
import * as root from '../Root';

export default class AddPostScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: false
    };
    async componentDidMount() {
    }
    async createPost() {
        Keyboard.dismiss();
        this.setState({ loading: true });
        let data = await API.graphql(graphqlOperation(`mutation($content: String) { insert_post(objects: {title: "${this.state.title}", content: $content}) {affected_rows}}`, { content: this.state.content }));
        this.setState({ loading: false });
        this.props.navigation.navigate('feed');
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <HeaderComponent navigation={this.props.navigation} screen='add post' />
                <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', paddingTop: 0 }} keyboardDismissMode="interactive" keyboardShouldPersistTaps="always">
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 20, paddingTop: 0, paddingLeft: root.paddingHorizontal, paddingRight: root.paddingHorizontal }}>
                        <Text style={{ margin: 5 }}>Title:</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, fontSize: 20, marginBottom: 10 }} onChangeText={val => this.setState({ title: val })} />
                        <Text style={{ margin: 5 }}>Content:</Text>
                        <TextInput
                            multiline={true}
                            style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, fontSize: 20, minHeight: 150 }}
                            onChangeText={val => this.setState({ content: val })}
                        />
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('feed') }} style={{ marginTop: 15, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 100, height: 35 }}>
                                <Text style={{ fontSize: 16, margin: 5, textAlign: 'center', marginTop: root.web ? 2 : 6 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.createPost() }} style={{ marginTop: 15, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 100, height: 35 }}>
                                <Text style={{ fontSize: 16, margin: 5, textAlign: 'center', marginTop: root.web ? 2 : 6 }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View >
        );
    }
}