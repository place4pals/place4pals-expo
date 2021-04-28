import * as React from 'react';
import { View, Animated, Easing, Platform } from 'react-native';
let spinValue = new Animated.Value(0);

export function LoadingComponent() {
    Animated.loop(Animated.timing(spinValue, { toValue: 1, duration: 420, easing: Easing.ease, useNativeDriver: false })).start();
    const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    return (
        <View style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: 1, borderRadius: 10, marginBottom: 125 }}>
                <Animated.View style={{ height: 30, width: 30, backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: 1, borderRadius: 15, borderTopWidth: 15, transform: [{ rotate: spin }] }} />
            </View>
        </View>
    );
}