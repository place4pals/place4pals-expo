import * as React from 'react';
import { Image, Text, View, TouchableOpacity, TextInput, Animated } from 'react-native';
import * as root from '../Root';
import InputAccessoryViewComponent from './InputAccessoryViewComponent';

export default class HeaderComponent extends React.Component {
    state = {
        search: '',
        backgroundColor: new Animated.Value(0),
        backgroundColorsArray: ['#00aaff', '#808080', '#898542', '#8E84BC', '#9C087E'],
        backgroundColorTransition1: '#00aaff',
        backgroundColorTransition2: '#808080'
    };
    async componentDidMount() {
        if (root.desktopWeb) {
            let random = Math.floor(Math.random() * 4);
            this.setState({ backgroundColorTransition1: this.state.backgroundColorsArray[random] });
            while (random === this.state.backgroundColorTransition2) {
                random = Math.floor(Math.random() * 4);
            }
            this.setState({ backgroundColorTransition2: this.state.backgroundColorsArray[random] });
            this.animatedBackground();
        }
    }
    animatedBackground() {
        Animated.sequence([
            Animated.timing(this.state.backgroundColor, {
                toValue: 10000,
                duration: 10000
            }),
            Animated.timing(this.state.backgroundColor, {
                toValue: 0,
                duration: 0
            })
        ]).start(() => {
            let random = Math.floor(Math.random() * 4);
            while (random === this.state.backgroundColorTransition2) {
                random = Math.floor(Math.random() * 4);
            }
            this.setState({
                backgroundColorTransition1: this.state.backgroundColorTransition2,
                backgroundColorTransition2: this.state.backgroundColorsArray[random]
            });
            this.animatedBackground();
        });
    }
    render() {
        return (
            <Animated.View style={root.desktopWeb && {
                backgroundColor: this.state.backgroundColor.interpolate({
                    inputRange: [0, 10000],
                    outputRange: [this.state.backgroundColorTransition1, this.state.backgroundColorTransition2]
                }), height: '100%', marginBottom: 'calc(-100vh + 80px)'
            }}>
                {root.desktopWeb ?
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: root.width, marginLeft: root.marginLeft, marginRight: root.marginRight, paddingTop: root.paddingTop, paddingBottom: 20, backgroundColor: '#ffffff', paddingLeft: 40, paddingRight: 40, height: '100%' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', width: 780, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('feed'); }} >
                                    <Image source={require('../assets/images/logo.png')} style={{ width: 50, height: 50 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('feed'); }} >
                                    <Text style={{ color: '#000000', marginLeft: 10, fontSize: 30, fontWeight: ['feed', 'view post', 'view user', 'add post'].includes(this.props.screen) ? '600' : '400', color: ['feed', 'view post', 'view user', 'add post'].includes(this.props.screen) ? '#000000' : '#aaaaaa' }}>Feed</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('pools'); }} >
                                    <Text style={{ color: '#000000', marginLeft: 15, fontSize: 30, fontWeight: this.props.screen === 'pools' ? '600' : '400', color: this.props.screen === 'pools' ? '#000000' : '#aaaaaa' }}>Pools</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('messages'); }} >
                                    <Text style={{ color: '#000000', marginLeft: 15, fontSize: 30, fontWeight: this.props.screen === 'messages' ? '600' : '400', color: this.props.screen === 'messages' ? '#000000' : '#aaaaaa' }}>Messages</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('profile'); }} >
                                    <Text style={{ color: '#000000', marginLeft: 15, fontSize: 30, fontWeight: this.props.screen === 'profile' ? '600' : '400', color: this.props.screen === 'profile' ? '#000000' : '#aaaaaa' }}>Profile</Text>
                                </TouchableOpacity>
                            </View>
                            {this.props.screen === 'feed' &&
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('addPost'); }} style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5 }}>
                                    <Text style={{ fontSize: 20, }}>+ Add Post </Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <TextInput inputAccessoryViewID='main' style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, fontSize: 14, paddingLeft: 10, paddingRight: 10, marginTop: 11, height: 39, width: '100%', marginLeft: 20, marginRight: -10 }} placeholder='Search' returnKeyType='send' type='text'
                            onSubmitEditing={(event) => { }}
                            onChangeText={value => { this.setState({ search: value }); }}
                            value={this.state.search} />
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
            </Animated.View>
        );
    }
}