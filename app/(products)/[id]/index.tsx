import { DeleteModal } from '@/components/DeleteModal';
import { Brand } from '@/constants/theme';
import { Product } from '@/src/domain/entities/Product';
import { useRepository } from '@/src/presentation/di/RepositoryContext';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

function CardPlaceholder() {
    return (
        <View style={styles.card} testID="product-logo">
            <View style={styles.cardOverlay} />
            <View style={styles.cardChip} />
        </View>
    );
}

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const repository = useRepository();
    const [product, setProduct] = useState<Product | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            repository
                .getById(id)
                .then((p) => setProduct(p))
                .catch((err: Error) => setError(err.message))
                .finally(() => setLoading(false));
        }, [id, repository]),
    );

    const handleDelete = () => {
        if (!product) return;
        repository
            .delete(product.id)
            .then(() => {
                setShowDeleteModal(false);
                router.back();
            })
            .catch((err: Error) => {
                setError(err.message);
                setShowDeleteModal(false);
            });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Brand.yellow} testID="loading-indicator" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText} testID="error-message">
                    {error ?? 'Producto no encontrado'}
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.productId}>ID: {product.id}</Text>
                <Text style={styles.subtitle}>Información extra</Text>

                <View style={styles.separator} />

                <View style={styles.row}>
                    <Text style={styles.label}>Nombre</Text>
                    <Text style={styles.value}>{product.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Descripción</Text>
                    <Text style={styles.value}>{product.description}</Text>
                </View>
                <View style={styles.logoRow}>
                    <Text style={styles.label}>Logo</Text>
                    {product.logo && /^https?:\/\//i.test(product.logo) ? (
                        <Image
                            source={{ uri: product.logo }}
                            style={styles.logo}
                            resizeMode="cover"
                            testID="product-logo"
                        />
                    ) : (
                        <CardPlaceholder />
                    )}
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Fecha liberación</Text>
                    <Text style={styles.value}>{product.date_release}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Fecha revisión</Text>
                    <Text style={styles.value}>{product.date_revision}</Text>
                </View>
            </ScrollView>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => router.push(`/(products)/${product.id}/edit`)}
                    testID="edit-button"
                >
                    <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => setShowDeleteModal(true)}
                    testID="delete-button"
                >
                    <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
            </View>

            <DeleteModal
                visible={showDeleteModal}
                productName={product.name}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Brand.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20 },
    productId: { fontSize: 24, fontFamily: 'RobotoSlab_700Bold', color: Brand.textPrimary },
    subtitle: { fontSize: 13, color: Brand.placeholder, marginBottom: 16 },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: Brand.border,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    logoRow: { marginBottom: 16 },
    label: { fontSize: 14, color: Brand.placeholder },
    value: {
        fontSize: 14,
        fontFamily: 'RobotoSlab_700Bold',
        color: Brand.textPrimary,
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 16,
    },
    logo: {
        width: '100%',
        height: 150,
        marginTop: 8,
        borderRadius: 12,
    },
    card: {
        width: '70%',
        height: 130,
        marginTop: 8,
        borderRadius: 12,
        backgroundColor: Brand.yellowDark,
        overflow: 'hidden',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    cardOverlay: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 200,
        height: 200,
        backgroundColor: Brand.yellow,
        borderRadius: 100,
        opacity: 0.5,
    },
    cardChip: {
        width: 40,
        height: 30,
        backgroundColor: Brand.background,
        borderRadius: 6,
        marginLeft: 24,
    },
    actions: {
        padding: 16,
        gap: 12,
    },
    editBtn: {
        borderWidth: 1,
        borderColor: Brand.border,
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    editText: { fontSize: 15, fontWeight: '600', color: Brand.textPrimary },
    deleteBtn: {
        backgroundColor: Brand.red,
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    deleteText: { fontSize: 15, fontWeight: '600', color: Brand.background },
    errorText: { color: Brand.red },
});
