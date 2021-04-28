import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Platform, Keyboard, LogBox, ScrollView } from 'react-native';
import { Auth } from "aws-amplify";
import LogoSvg from "../svgs/logo"
import { LoadingComponent } from '../components/LoadingComponent';
import { useApolloClient } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
Platform.OS !== 'web' && LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function LoginScreen({ route, navigation }: any) {
    const client = useApolloClient();

    const [state, setState] = useState({ email: 'chris@heythisischris.com', password: 'place4pals', errorMessage: '', successMessage: '', loading: false });

    React.useEffect(() => {
        if (!route.params) { route.params = {}; }
        if (route.params.success) { setState({ ...state, success: true, successMessage: 'Success! Confirm your email before logging in' }); }
        if (route.params.reset) { setState({ ...state, success: true, successMessage: 'We sent you a link to reset your password' }); }
        if (route.params.username && route.params.code) {
            Auth.confirmSignUp(route.params.username, route.params.code).then((response) => {
                setState({ ...state, success: true, successMessage: 'Email successfully confirmed! You may log in' });
            });
        }
        if (route.params.demo) {
            setState({ ...state, loading: true });
            Auth.signIn({
                username: 'demo@place4pals.com',
                password: 'password'
            }).then(() => {
                connectWebsocket();
                setState({ ...state, loading: false, errorMessage: '', success: false, email: '', password: '' });
                navigation.navigate('app');
            });
        }

        Auth.currentSession().then((response) => {
            connectWebsocket();
            setState({ ...state, loading: false, errorMessage: '', success: false, email: '', password: '' });
            navigation.navigate('app');
        }).catch((error) => {
            setState({ ...state, loading: false });
        });
    }, [route.params]);

    const login = async () => {
        Keyboard.dismiss();
        setState({ ...state, loading: true })
        try {
            await Auth.signIn({
                username: state.email,
                password: state.password
            });
            connectWebsocket();
            setState({ ...state, loading: false, errorMessage: '' });
            navigation.navigate('app');
        }
        catch (err) {
            console.log(err);
            setState({ ...state, loading: false, errorMessage: err.code === 'UserNotConfirmedException' ? 'Confirm your email address before logging in' : 'Your username or password is incorrect' });
        }
    }

    const connectWebsocket = () => {
        client.setLink(new WebSocketLink({
            uri: "wss://api.p4p.io/v1/graphql",
            options: {
                reconnect: true,
                connectionParams: async () => ({
                    headers: {
                        Authorization: "Bearer " + (await Auth.currentSession()).idToken.jwtToken
                    }
                })
            }
        }));
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <LogoSvg width={s(50, 0.85)} height={s(50, 0.85)} style={{ marginRight: 15 }} />
                    <Text style={[styles.text, { fontSize: s(40) }]}>place4pals</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 10 }}>
                    {state.errorMessage.length > 0 && <Text style={[styles.text, { color: '#cc0000', textAlign: 'center' }]}>{state.errorMessage}</Text>}
                    {state.successMessage.length > 0 && <Text style={[styles.text, { color: '#006600', textAlign: 'center' }]}>{state.successMessage}</Text>}
                    <TextInput inputAccessoryViewID='main' onChangeText={value => { setState({ ...state, email: value }) }} placeholder='Email' style={[styles.textInput, Platform.OS === 'web' && { outlineWidth: 0 }]}></TextInput>
                    <TextInput inputAccessoryViewID='main' onChangeText={value => { setState({ ...state, password: value }) }} placeholder='Password' secureTextEntry={true} style={[styles.textInput, Platform.OS === 'web' && { outlineWidth: 0 }]} returnKeyType='send'
                        onSubmitEditing={login}></TextInput>
                </View>
                <TouchableOpacity style={[styles.touchableOpacity]}
                    onPress={login}
                >
                    <Text style={[styles.text, styles.touchableOpacityText]}>Log In</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                    <Text style={[styles.text]}>Not a pal? </Text>
                    <Text onPress={() => { navigation.navigate('signup'); }} style={[styles.text, { color: '#180DEB', textDecorationLine: 'underline' }]}>Join here</Text>
                    <Text style={[styles.text]}>.</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text style={[styles.text]}>Forgot password? </Text>
                    <Text onPress={() => { navigation.navigate('reset'); }} style={[styles.text, { color: '#180DEB', textDecorationLine: 'underline' }]}>Reset here</Text>
                    <Text style={[styles.text]}>.</Text>
                </View>
                <Text style={[styles.text, styles.footerText]}>© {new Date().getFullYear()} place4pals</Text>
                {state.loading && <LoadingComponent />}
            </ScrollView>
        </View>
    );
}
function s(number: number, factor = 0.6) {
    return Platform.OS === 'web' ? number * factor : number;
}
const styles = StyleSheet.create(
    Platform.OS === 'web' ?
        {
            text: { color: '#000000', fontFamily: 'Arial', fontSize: 12, userSelect: 'text' },
            touchableOpacity: { marginTop: 10, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 'auto' },
            touchableOpacityText: { fontSize: 13, margin: 0 },
            textInput: { color: '#000000', fontFamily: 'Arial', fontSize: 13, marginTop: 10, borderColor: '#A9A9A9', borderWidth: 1, width: 200, height: 25, padding: 5 },
            logoImage: { width: 51, height: 51 },
            logoText: { fontSize: 26, marginLeft: 15 },
            footerText: { color: '#bbbbbb', fontSize: 10, marginTop: 20, borderColor: '#dddddd', borderTopWidth: 1, paddingTop: 10, paddingBottom: 125 }
        } : {
            text: { color: '#000000', fontFamily: 'Arial', fontSize: 16 },
            touchableOpacity: { marginTop: 15, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5, width: 240, height: 35 },
            touchableOpacityText: { fontSize: 16, margin: 5, textAlign: 'center', marginTop: 6 },
            textInput: { color: '#000000', fontFamily: 'Arial', fontSize: 16, marginTop: 15, borderColor: '#A9A9A9', borderWidth: 1, width: 240, height: 35, padding: 5 },
            logoImage: { width: 75, height: 75 },
            logoText: { fontSize: 36, marginLeft: 15 },
            footerText: { color: '#bbbbbb', fontSize: 12, marginTop: 20, borderColor: '#dddddd', borderTopWidth: 1, paddingTop: 10, paddingBottom: 50 }
        }
);