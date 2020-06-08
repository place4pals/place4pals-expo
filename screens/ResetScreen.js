import * as React from 'react';
import { Image, Text, View, TouchableOpacity, TouchableHighlight, TextInput, Platform, StyleSheet, ScrollView, Animated, Easing, Keyboard } from 'react-native';
import { Auth } from "aws-amplify";
import InputAccessoryViewComponent from '../components/InputAccessoryViewComponent';

export default class ResetScreen extends React.Component {
    state = {
        email: '',
        loading: false,
    };
    constructor(props) {
        super(props);
        if (this.props.route.params) {
            if (this.props.route.params.successMessage) {
                this.setState({ successMessage: this.props.route.params.successMessage });
            }
        }
    }
    reset() {
        this.setState({ loading: true });
        Keyboard.dismiss();
        Auth.forgotPassword(this.state.email)
            .then(data => {
                console.log(data);
                this.setState({ loading: false, successMessage: 'We sent you a link to reset your password' });
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false, errorMessage: 'There is no account associated with that email address' });
            });
    }
    spinValue = new Animated.Value(0);
    render() {
        Animated.loop(Animated.timing(this.spinValue, { toValue: 1, duration: 420, easing: Easing.ease })).start(); //useNativeDriver: true
        const spin = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <InputAccessoryViewComponent />
                <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                    <TouchableOpacity activeOpacity={.5} onPress={() => { this.props.navigation.navigate('login'); }} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <Image source={require('../assets/images/logo.png')} style={styles.logoImage} />
                        <Text style={[styles.textNoSelect, styles.logoText]}>place4pals</Text>
                    </TouchableOpacity>
                    {this.state.errorMessage && <Text style={[styles.text, { color: '#ff0000' }]}>{this.state.errorMessage}</Text>}
                    {this.state.successMessage && <Text style={[styles.text, { color: '#006600' }]}>{this.state.successMessage}</Text>}
                    <TextInput inputAccessoryViewID='main' onChangeText={value => this.setState({ email: value })} placeholder='Email' style={styles.loginInput} returnKeyType='send' onSubmitEditing={() => { this.reset() }}></TextInput>
                    <TouchableHighlight onPress={() => { this.reset() }} style={styles.loginButton} underlayColor={'#eeeeee'} activeOpacity={1}>
                        <Text style={[styles.textNoSelect, styles.loginText]}>Reset Password</Text>
                    </TouchableHighlight>
                    <View style={{ flexDirection: 'row', marginTop: 30 }}>
                        <Text style={[styles.text]}>Remember your password? </Text>
                        <Text onPress={() => { this.props.navigation.navigate('login'); }} style={[styles.text, { color: '#180DEB', textDecorationLine: 'underline' }]}>Login here</Text>
                        <Text style={[styles.text]}>.</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={[styles.text]}>Not a pal? </Text>
                        <Text onPress={() => { this.props.navigation.navigate('signup'); }} style={[styles.text, { color: '#180DEB', textDecorationLine: 'underline' }]}>Join here</Text>
                        <Text style={[styles.text]}>.</Text>
                    </View>
                    <Text style={[styles.text, styles.footerText]}>© 2020 place4pals</Text>
                    {this.state.loading &&
                        <View style={{ position: 'absolute', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: 1, borderRadius: 25, marginTop: -60 }}>
                            <Animated.View style={{ height: 50, width: 50, backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: 1, borderRadius: 25, borderTopWidth: 25, transform: [{ rotate: spin }] }} />
                        </View>
                    }
                </ScrollView>
            </View >
        );
    }
}
const styles = StyleSheet.create(
    Platform.OS === 'web' ?
        {
            text: { color: '#000000', fontFamily: 'Arial', fontSize: 12, userSelect: 'text' },
            textNoSelect: { color: '#000000', fontFamily: 'Arial', fontSize: 12 },
            loginButton: { marginTop: 10, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 'auto' },
            loginText: { fontSize: 13, margin: 0 },
            loginInput: { color: '#000000', fontFamily: 'Arial', fontSize: 13, marginTop: 10, borderColor: '#A9A9A9', borderWidth: 1, width: 200, height: 25, padding: 5 },
            logoImage: { width: 51, height: 51 },
            logoText: { fontSize: 26, marginLeft: 15 },
            footerText: { color: '#bbbbbb', fontSize: 10, marginTop: 20, borderColor: '#dddddd', borderTopWidth: 1, paddingTop: 10, paddingBottom: 125 }
        } : {
            text: { color: '#000000', fontFamily: 'Arial', fontSize: 16 },
            textNoSelect: { color: '#000000', fontFamily: 'Arial', fontSize: 16 },
            loginButton: { marginTop: 15, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 240, height: 35 },
            loginText: { fontSize: 16, margin: 5, textAlign: 'center', marginTop: 6 },
            loginInput: { color: '#000000', fontFamily: 'Arial', fontSize: 16, marginTop: 15, borderColor: '#A9A9A9', borderWidth: 1, width: 240, height: 35, padding: 5 },
            logoImage: { width: 75, height: 75 },
            logoText: { fontSize: 36, marginLeft: 15 },
            footerText: { color: '#bbbbbb', fontSize: 12, marginTop: 20, borderColor: '#dddddd', borderTopWidth: 1, paddingTop: 10, paddingBottom: 125 }
        }
);