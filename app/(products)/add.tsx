import { FormField } from '@/components/FormField';
import { Brand } from '@/constants/theme';
import { useProductForm } from '@/src/presentation/hooks/useProductForm';
import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

export default function AddProductScreen() {
    const router = useRouter();
    const { fields, errors, submitting, setField, submit, reset } =
        useProductForm({
            mode: 'create',
            onSuccess: () => router.back(),
        });

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
                    error={errors.id}
                />
                <FormField
                    label="Nombre"
                    value={fields.name}
                    onChangeText={(v) => setField('name', v)}
                    error={errors.name}
                    placeholder="Tarjeta Crédito"
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
    content: { padding: 20, paddingBottom: 40 },
    title: {
        fontSize: 26,
        fontFamily: 'RobotoSlab_700Bold',
        marginBottom: 24,
        color: Brand.textPrimary,
    },
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
