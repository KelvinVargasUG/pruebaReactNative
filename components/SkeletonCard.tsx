import { Brand } from '@/constants/theme';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export function SkeletonCard() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View style={[styles.container, { opacity }]} testID="skeleton-card">
            <View style={styles.line} />
            <View style={[styles.line, styles.shortLine]} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Brand.border,
        backgroundColor: Brand.background,
    },
    line: {
        height: 14,
        backgroundColor: Brand.border,
        borderRadius: 4,
        marginBottom: 6,
    },
    shortLine: {
        width: '40%',
    },
});
