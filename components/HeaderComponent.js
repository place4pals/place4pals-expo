import * as React from 'react';
import { Image, Text, View, TouchableOpacity, TextInput } from 'react-native';
import * as root from '../Root';
import InputAccessoryViewComponent from './InputAccessoryViewComponent';

export default class HeaderComponent extends React.Component {
    state = {
        search: ''
    };
    render() {
        return (
            <View>
                {root.desktopWeb ?
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20, justifyContent: 'space-between', width: root.width, marginLeft: root.marginLeft, marginRight: root.marginRight, paddingTop: root.paddingTop }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', width: 'auto' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('feed'); }} >
                                <Image source={require('../assets/images/logo.png')} style={{ width: 50, height: 50 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('feed'); }} >
                                <Text style={{ color: '#000000', marginLeft: 10, fontSize: 30, fontWeight: ['feed', 'view post', 'view user', 'add post'].includes(this.props.screen) ? '600' : '400', color: ['feed', 'view post', 'view user', 'add post'].includes(this.props.screen) ? '#000000' : '#aaaaaa' }}>Feed</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('messages'); }} >
                                <Text style={{ color: '#000000', marginLeft: 15, fontSize: 30, fontWeight: this.props.screen === 'messages' ? '600' : '400', color: this.props.screen === 'messages' ? '#000000' : '#aaaaaa' }}>Messages</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('profile'); }} >
                                <Text style={{ color: '#000000', marginLeft: 15, fontSize: 30, fontWeight: this.props.screen === 'profile' ? '600' : '400', color: this.props.screen === 'profile' ? '#000000' : '#aaaaaa' }}>Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('settings'); }} >
                                <Text style={{ color: '#000000', marginLeft: 15, fontSize: 30, fontWeight: this.props.screen === 'settings' ? '600' : '400', color: this.props.screen === 'settings' ? '#000000' : '#aaaaaa' }}>Settings</Text>
                            </TouchableOpacity>
                            <TextInput inputAccessoryViewID='main' style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, fontSize: 20, marginLeft: 65, paddingLeft: 10, paddingRight: 10 }} placeholder='Search' returnKeyType='send' type='text'
                                onSubmitEditing={(event) => { }}
                                onChangeText={value => { this.setState({ search: value }); }}
                                value={this.state.search} />
                        </View>
                        {this.props.screen === 'feed' &&
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('addPost'); }} style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, marginRight: 15 }}>
                                <Text style={{ fontSize: 20, }}>+ Add Post </Text>
                            </TouchableOpacity>
                        }
                    </View>
                    :
                    <View style={{ width: root.width, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20, justifyContent: 'space-between', marginLeft: root.marginLeft, marginRight: root.marginRight, paddingTop: root.paddingTop }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('feed'); }} >
                                <Image source={require('../assets/images/logo.png')} style={{ width: 50, height: 50 }} />
                            </TouchableOpacity>
                            <Text style={{ color: '#000000', marginLeft: 10, fontSize: 40 }}>{this.props.screen[0].toUpperCase() + this.props.screen.slice(1)}</Text>
                        </View>
                        {this.props.screen === 'feed' &&
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('addPost'); }} style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, marginLeft: 10 }}>
                                <Text style={{ fontSize: 20, }}>+ Add Post </Text>
                            </TouchableOpacity>
                        }
                        <InputAccessoryViewComponent />
                    </View>
                }
            </View>
        );
    }
}