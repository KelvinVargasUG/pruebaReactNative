import { Brand } from '@/constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

function HeaderTitle() {
    return (
        <View style={styles.titleRow}>
            <FontAwesome5 name="money-bill-alt" size={16} color={Brand.blue} />
            <Text style={styles.titleText}>BANCO</Text>
        </View>
    );
}

export default function ProductsLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Brand.background },
                headerTitleAlign: 'center',
                headerTitle: () => <HeaderTitle />,
                headerTintColor: Brand.blue,
                headerShadowVisible: false,
            }}
        />
    );
}

const styles = StyleSheet.create({
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    titleText: {
        fontSize: 16,
        fontFamily: 'RobotoSlab_700Bold',
        color: Brand.blue,
    },
});
