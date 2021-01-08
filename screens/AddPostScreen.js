import * as React from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, Keyboard, Image } from 'react-native';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';
import * as root from '../Root';

export default class AddPostScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: false
    };
    async componentDidMount() {
        this.props.navigation.addListener('focus', this.focus);
        this.focus();
    }

    focus = async () => {
        if (this.props.route.params) {
            if (this.props.route.params.photo) {
                this.setState({ photo: this.props.route.params.photo });
            }
        }
    }

    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    createPost = async () => {
        Keyboard.dismiss();

        if (!this.state.title) { 
            this.setState({ missingTitle: true })
            return 
        }

        this.setState({ loading: true });

        if (this.state.photo) {
            let response = await fetch(this.state.photo.uri);
            let blob = await response.blob();
            let uuid = `${this.uuid()}.jpg`;
            await Storage.put(uuid, blob, { contentType: 'image/jpeg' });
            this.setState({ content: `<img src="https://files.p4p.io/public/${uuid}"><br>${this.state.content && this.state.content}` });
        }

        await API.graphql(graphqlOperation(`mutation($content: String) { insert_post(objects: {title: "${this.state.title}", content: $content}) {affected_rows}}`, { content: this.state.content }));
        this.setState({ loading: false, title: null, content: null, photo: null });
        this.props.navigation.navigate('feed', { reload: true });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <HeaderComponent navigation={this.props.navigation} screen='add post' />
                <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', paddingTop: 0 }} keyboardDismissMode="interactive" keyboardShouldPersistTaps="always">
                    <View style={{ width: root.allWeb ? root.width : root.windowWidth - 20, marginLeft: root.marginLeft, marginRight: root.marginRight, display: 'flex', flexDirection: 'column', paddingLeft: root.paddingLeft, paddingRight: root.paddingRight, paddingTop: 0 }}>
                        <Text style={{ margin: 5 }}>Title:</Text>
                        <TextInput inputAccessoryViewID='main' style={{ borderWidth: 1, borderColor: this.state.missingTitle ? 'red' : '#000000', borderRadius: 10, padding: 5, fontSize: 20, marginBottom: 10 }} onChangeText={val => this.setState({ title: val })} />
                        <Text style={{ margin: 5 }}>Content:</Text>
                        <TextInput
                            inputAccessoryViewID='main'
                            multiline={true}
                            style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, fontSize: 20, minHeight: 150 }}
                            onChangeText={val => this.setState({ content: val })}
                        />
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: root.desktopWeb ? 'space-between' : 'flex-end' }}>
                            {root.desktopWeb &&
                                <Text style={{ fontSize: 16, marginTop: 20, textAlign: 'center' }}>{"PS: You can use these HTML tags in your post: <href>, <img>, <b>, <i>, <br>, <h1..3>"}</Text>
                            }
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: root.desktopWeb ? 'auto' : '100%' }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('camera'); }} style={{ marginTop: 15, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 130, height: 35 }}>
                                    <Text style={{ fontSize: 16, margin: 5, textAlign: 'center', marginTop: root.allWeb ? 2 : 6 }}>{this.state.photo ? 'Replace Photo' : 'Add Photo'}</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('feed') }} style={{ marginTop: 15, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 100, height: 35 }}>
                                        <Text style={{ fontSize: 16, margin: 5, textAlign: 'center', marginTop: root.allWeb ? 2 : 6 }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.createPost() }} style={{ marginTop: 15, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 100, height: 35 }}>
                                        <Text style={{ fontSize: 16, margin: 5, textAlign: 'center', marginTop: root.allWeb ? 2 : 6 }}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {!root.desktopWeb &&
                            <Text style={{ fontSize: 16, marginTop: 15, textAlign: 'left', width: '100%' }}>{"PS: You can use these HTML tags in your post:\n <href>, <img>, <b>, <i>, <br>, <h1..3>"}</Text>
                        }
                        {this.state.photo && <View style={{ width: '100%', height: 500, marginTop: 20 }} ><Text style={{ fontSize: 16, marginBottom: 10}}>Photo Preview:</Text><Image style={{ width: 200, height: 200 }} source={this.state.photo} /></View>}
                    </View>
                </ScrollView>
                {this.state.loading && <LoadingComponent />}
            </View >
        );
    }
}