import { ProductCard } from '@/components/ProductCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Brand } from '@/constants/theme';
import { useProductList } from '@/src/presentation/hooks/useProductList';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SKELETON_COUNT = 4;

export default function ProductListScreen() {
    const router = useRouter();
    const { filteredProducts, loading, error, search, setSearch, refresh } =
        useProductList();

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh]),
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <TextInput
                style={styles.search}
                value={search}
                onChangeText={setSearch}
                placeholder="Search..."
                placeholderTextColor={Brand.placeholder}
                testID="search-input"
            />

            {loading ? (
                Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))
            ) : error ? (
                <Text style={styles.error} testID="error-message">
                    {error}
                </Text>
            ) : (
                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ProductCard
                                product={item}
                                onPress={() => router.push(`/(products)/${item.id}`)}
                            />
                        )}
                        ListEmptyComponent={
                            <Text style={styles.empty} testID="empty-message">
                                No se encontraron productos
                            </Text>
                        }
                        testID="product-list"
                    />
                </View>
            )}

            <View style={styles.footer}>
                <Text style={styles.count} testID="product-count">
                    {filteredProducts.length} registros
                </Text>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push('/(products)/add')}
                    testID="add-button"
                >
                    <Text style={styles.addBtnText}>Agregar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Brand.background,
    },
    search: {
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Brand.border,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: Brand.textPrimary,
    },
    error: {
        color: Brand.red,
        textAlign: 'center',
        marginTop: 32,
        paddingHorizontal: 16,
    },
    listContainer: {
        flex: 1,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: Brand.border,
        borderRadius: 6,
        overflow: 'hidden',
    },
    footer: {
        padding: 16,
    },
    count: {
        textAlign: 'center',
        color: Brand.placeholder,
        fontSize: 13,
        marginBottom: 12,
    },
    addBtn: {
        backgroundColor: Brand.yellow,
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    addBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: Brand.textPrimary,
    },
    empty: {
        textAlign: 'center',
        color: Brand.placeholder,
        fontSize: 14,
        paddingVertical: 32,
    },
});
