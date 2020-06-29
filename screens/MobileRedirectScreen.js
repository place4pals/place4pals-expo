import * as React from 'react';
import { Image, Text, View, TouchableOpacity, Platform, StyleSheet, ScrollView } from 'react-native';

export default class MobileRedirectScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
    };
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                    <TouchableOpacity activeOpacity={.5} onPress={() => { }} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <Image source={require('../assets/images/logo.png')} style={styles.logoImage} />
                        <Text style={[styles.textNoSelect, styles.logoText]}>place4pals</Text>
                    </TouchableOpacity>
                    <Text style={[styles.text, { paddingLeft: 50, paddingRight: 50 }]}>{`In order to use p4p on mobile, you need to download it from the App Store on iOS or the Play Store on Android.\n\n`}</Text>
                    <Text style={[styles.text, styles.footerText]}>© {new Date().getFullYear()} place4pals</Text>
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