import * as React from 'react';
import { Image, Text, View, TouchableOpacity, TextInput, Animated } from 'react-native';
import * as root from '../Root';
import InputAccessoryViewComponent from './InputAccessoryViewComponent';

export default class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        search: '',
        backgroundColor: new Animated.Value(0),
        backgroundColorsArray: ['#00aaff', '#808080', '#898542', '#8E84BC', '#9C087E'],
        backgroundColorTransition1: '#00aaff',
        backgroundColorTransition2: '#808080'
    };
    async componentDidMount() {
        if (root.desktopWeb) {
            let backgroundColor = '';
            if (['feed', 'view post', 'view user', 'add post'].includes(this.props.screen)) {
                backgroundColor = '#00aaff';
            }
            else if (['pools'].includes(this.props.screen)) {
                backgroundColor = '#808080';
            }
            else if (['inbox'].includes(this.props.screen)) {
                backgroundColor = '#898542';
            }
            else if (['profile'].includes(this.props.screen)) {
                backgroundColor = '#8E84BC';
            }
            this.setState({ backgroundColorTransition1: backgroundColor });
            let random = Math.floor(Math.random() * 4);
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
                                    <Image source={['view post', 'view user', 'add post'].includes(this.props.screen) ? require('../assets/images/backButton.png') : require('../assets/images/logo.png')} style={{ width: 50, height: 50 }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 14, marginRight: 10 }} onPress={() => { this.props.navigation.navigate('feed'); }} >
                                    <Image style={{ height: 40, width: 40, tintColor: ['feed', 'view post', 'view user', 'add post'].includes(this.props.screen) ? '#000000' : '#aaaaaa' }} source={require('../assets/images/feedTab.png')} />
                                    <Text style={{ color: '#000000', fontSize: 26, fontWeight: ['feed', 'view post', 'view user', 'add post'].includes(this.props.screen) ? '600' : '400', color: ['feed', 'view post', 'view user', 'add post'].includes(this.props.screen) ? '#000000' : '#aaaaaa' }}>Feed</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }} onPress={() => { this.props.navigation.navigate('pools'); }} >
                                    <Image style={{ height: 40, width: 40, tintColor: ['pools'].includes(this.props.screen) ? '#000000' : '#aaaaaa' }} source={require('../assets/images/poolsTab.png')} />
                                    <Text style={{ color: '#000000', fontSize: 26, fontWeight: this.props.screen === 'pools' ? '600' : '400', color: this.props.screen === 'pools' ? '#000000' : '#aaaaaa' }}>Pools</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }} onPress={() => { this.props.navigation.navigate('inbox'); }} >
                                    <Image style={{ height: 40, width: 40, tintColor: ['inbox'].includes(this.props.screen) ? '#000000' : '#aaaaaa' }} source={require('../assets/images/inboxTab.png')} />
                                    <Text style={{ color: '#000000', fontSize: 26, fontWeight: this.props.screen === 'inbox' ? '600' : '400', color: this.props.screen === 'inbox' ? '#000000' : '#aaaaaa' }}>Inbox</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }} onPress={() => { this.props.navigation.navigate('profile'); }} >
                                    <Image style={{ height: 40, width: 40, tintColor: ['profile'].includes(this.props.screen) ? '#000000' : '#aaaaaa' }} source={require('../assets/images/profileTab.png')} />
                                    <Text style={{ color: '#000000', fontSize: 26, fontWeight: this.props.screen === 'profile' ? '600' : '400', color: this.props.screen === 'profile' ? '#000000' : '#aaaaaa' }}>Profile</Text>
                                </TouchableOpacity>
                            </View>
                            {this.props.screen === 'feed' &&
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { console.log("refresh") }} style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, marginRight: 10, width: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ height: 18, width: 18 }} source={require('../assets/images/rotateIcon.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('addPost'); }} style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5 }}>
                                        <Text style={{ fontSize: 20, }}>+ Add Post </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <View style={{ marginTop: 11, height: 39, width: '100%', marginLeft: 20, flexDirection: 'row' }}>
                            <TextInput inputAccessoryViewID='main' style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, fontSize: 14, paddingLeft: 10, paddingRight: 10, width: 260 }} placeholder='Search' returnKeyType='send' type='text'
                                onSubmitEditing={(event) => { }}
                                onChangeText={value => { this.setState({ search: value }); }}
                                value={this.state.search} />
                            <TouchableOpacity onPress={() => { }} style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, marginLeft: 10, width: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ height: 30, width: 30 }} source={require('../assets/images/notificationsIcon.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View style={{ width: root.width, flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10, justifyContent: 'space-between', marginLeft: root.marginLeft, marginRight: root.marginRight, paddingTop: root.paddingTop }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('feed'); }} >
                                    <Image source={['view post', 'view user', 'add post'].includes(this.props.screen) ? require('../assets/images/backButton.png') : require('../assets/images/logo.png')} style={{ width: 50, height: 50 }} />
                                </TouchableOpacity>
                                <Text style={{ color: '#000000', marginLeft: 10, fontSize: 40 }}>{this.props.screen[0].toUpperCase() + this.props.screen.slice(1)}</Text>
                            </View>

                            {this.props.screen === 'feed' &&
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => { }} style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, marginRight: 10, width: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ height: 30, width: 30 }} source={require('../assets/images/searchIcon.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { }} style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5 }}>
                                        <Image style={{ height: 30, width: 30 }} source={require('../assets/images/notificationsIcon.png')} />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <InputAccessoryViewComponent />
                    </View>
                }
            </Animated.View>
        );
    }
}