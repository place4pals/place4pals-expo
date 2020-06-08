

import * as React from 'react';
import { InputAccessoryView, View, Button, Keyboard, Platform } from 'react-native';

export default class InputAccessoryViewComponent extends React.Component {
    render() {
        return (
            Platform.OS === 'ios' &&
            <InputAccessoryView nativeID='main'>
                <View style={{ backgroundColor: '#F8F8F8', height: 45, borderTopColor: '#DEDEDE', borderTopWidth: 1, flexDirection: 'row' }}>
                    <View style={{ marginLeft: 'auto', marginRight: 10, justifyContent: 'center' }}>
                        <Button
                            onPress={() => { Keyboard.dismiss(); }}
                            title='Done'
                        />
                    </View>
                </View>
            </InputAccessoryView>
        );
    }
}