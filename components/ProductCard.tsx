import { Brand } from '@/constants/theme';
import { Product } from '@/src/domain/entities/Product';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
    product: Product;
    onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
            testID={`product-card-${product.id}`}
        >
            <View style={styles.info}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.id}>ID: {product.id}</Text>
            </View>
            <Text style={styles.chevron} accessibilityLabel="chevron">›</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Brand.border,
        backgroundColor: Brand.background,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: Brand.textPrimary,
    },
    id: {
        fontSize: 13,
        color: Brand.placeholder,
        marginTop: 2,
    },
    chevron: {
        fontSize: 20,
        color: Brand.placeholder,
    },
});
