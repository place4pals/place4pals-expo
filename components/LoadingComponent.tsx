import * as React from 'react';
import { View, Animated, Easing, Platform } from 'react-native';
let spinValue = new Animated.Value(0);

export function LoadingComponent() {
    Animated.loop(Animated.timing(spinValue, { toValue: 1, duration: 420, easing: Easing.ease, useNativeDriver: false })).start();
    const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    return (
        <View style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: 1, borderRadius: 25 }}>
                <Animated.View style={{ height: 50, width: 50, backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: 1, borderRadius: 25, borderTopWidth: 25, transform: [{ rotate: spin }] }} />
            </View>
        </View>
    );
}