import { FormField } from '@/components/FormField';
import { Brand } from '@/constants/theme';
import { Product } from '@/src/domain/entities/Product';
import { useRepository } from '@/src/presentation/di/RepositoryContext';
import { ProductFormFields, useProductForm } from '@/src/presentation/hooks/useProductForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditProductScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const repository = useRepository();
    const [product, setProduct] = useState<Product | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        repository
            .getById(id)
            .then((p) => setProduct(p))
            .catch((err: Error) => setLoadError(err.message))
            .finally(() => setLoadingProduct(false));
    }, [id, repository]);

    if (loadingProduct) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Brand.yellow} testID="loading-indicator" />
            </View>
        );
    }

    if (loadError || !product) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText} testID="load-error">
                    {loadError ?? 'Producto no encontrado'}
                </Text>
            </View>
        );
    }

    return <EditForm product={product} onSuccess={() => router.back()} />;
}

function EditForm({
    product,
    onSuccess,
}: {
    product: Product;
    onSuccess: () => void;
}) {
    const initialValues: ProductFormFields = {
        id: product.id,
        name: product.name,
        description: product.description,
        logo: product.logo,
        date_release: product.date_release,
        date_revision: product.date_revision,
    };

    const { fields, errors, submitting, setField, submit, reset } =
        useProductForm({ mode: 'edit', initialValues, onSuccess });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Formulario de Registro</Text>

                {errors.general ? (
                    <Text style={styles.generalError} testID="general-error">
                        {errors.general}
                    </Text>
                ) : null}

                <FormField
                    label="ID"
                    value={fields.id}
                    onChangeText={(v) => setField('id', v)}
                    disabled
                />
                <FormField
                    label="Nombre"
                    value={fields.name}
                    onChangeText={(v) => setField('name', v)}
                    error={errors.name}
                />
                <FormField
                    label="Descripción"
                    value={fields.description}
                    onChangeText={(v) => setField('description', v)}
                    error={errors.description}
                />
                <FormField
                    label="Logo"
                    value={fields.logo}
                    onChangeText={(v) => setField('logo', v)}
                    error={errors.logo}
                />
                <FormField
                    label="Fecha Liberación"
                    value={fields.date_release}
                    onChangeText={(v) => setField('date_release', v)}
                    error={errors.date_release}
                    placeholder="YYYY-MM-DD"
                    maxLength={10}
                    dateField
                />
                <FormField
                    label="Fecha Revisión"
                    value={fields.date_revision}
                    onChangeText={(v) => setField('date_revision', v)}
                    disabled
                    maxLength={10}
                />

                <TouchableOpacity
                    style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                    onPress={submit}
                    disabled={submitting}
                    testID="submit-button"
                >
                    <Text style={styles.submitText}>
                        {submitting ? 'Enviando...' : 'Enviar'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={reset}
                    testID="reset-button"
                >
                    <Text style={styles.resetText}>Reiniciar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Brand.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20, paddingBottom: 40 },
    title: {
        fontSize: 26,
        fontFamily: 'RobotoSlab_700Bold',
        marginBottom: 24,
        color: Brand.textPrimary,
    },
    errorText: { color: Brand.red },
    generalError: {
        backgroundColor: Brand.errorBackground,
        borderWidth: 1,
        borderColor: Brand.red,
        borderRadius: 6,
        padding: 12,
        marginBottom: 16,
        color: Brand.red,
        fontSize: 14,
        textAlign: 'center',
    },
    submitBtn: {
        backgroundColor: Brand.yellow,
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 12,
    },
    submitBtnDisabled: { opacity: 0.6 },
    submitText: { fontSize: 15, fontWeight: '600', color: Brand.textPrimary },
    resetBtn: {
        borderWidth: 1,
        borderColor: Brand.border,
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    resetText: { fontSize: 15, color: Brand.textPrimary },
});
