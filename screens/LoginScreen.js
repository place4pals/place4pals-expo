import * as React from 'react';
import { Image, Text, View, TouchableOpacity, TouchableHighlight, TextInput, Platform, StyleSheet, ScrollView } from 'react-native';

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity activeOpacity={.5} onPress={() => { console.log('logo'); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../assets/images/logo.png')} style={{ width: 51, height: 51 }} />
                        <Text style={[styles.textNoSelect, { fontSize: 26, marginLeft: 15 }]}>place4pals</Text>
                    </TouchableOpacity>
                    <TextInput placeholder='Email' style={{ color: '#000000', fontFamily: 'Arial', fontSize: 13, marginTop: 15, borderColor: '#A9A9A9', borderWidth: 1, width: 200, height: 25, padding: 5 }}></TextInput>
                    <TextInput placeholder='Password' style={{ color: '#000000', fontFamily: 'Arial', fontSize: 13, marginTop: 10, borderColor: '#A9A9A9', borderWidth: 1, width: 200, height: 25, padding: 5 }}></TextInput>
                    <TouchableHighlight onPress={() => { this.props.navigation.reset({ routes: [{ name: 'app' }] }); }} style={{ marginTop: 10, backgroundColor: '#FBFBFB', borderColor: '#AAAAAA', borderWidth: 1, paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 2.5 }}  underlayColor={'#eeeeee'} activeOpacity={1}>
                        <Text style={[styles.textNoSelect, { fontSize: 13 }]}>Log In</Text>
                    </TouchableHighlight>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.text, { marginTop: 20 }]}>Not a pal? </Text>
                        <Text onPress={() => { console.log("ahh!") }} style={[styles.text, { color: '#180DEB', marginTop: 20, textDecorationLine: 'underline' }]}>Join here</Text>
                        <Text style={[styles.text, { marginTop: 20 }]}>.</Text>
                    </View>
                    <Text style={[styles.text, { color: '#bbbbbb', fontSize: 10, marginTop: 20, borderColor: '#dddddd', borderTopWidth: 1, paddingTop: 10, paddingBottom: 125 }]}>© 2020 place4pals.com</Text>
                </ScrollView>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    text: Platform.OS === 'web' ? {
        color: '#000000', fontFamily: 'Arial', fontSize: 12, userSelect: 'text'
    } : { color: '#000000', fontFamily: 'Arial', fontSize: 12 },
    textNoSelect: {
        color: '#000000', fontFamily: 'Arial', fontSize: 12
    }
});