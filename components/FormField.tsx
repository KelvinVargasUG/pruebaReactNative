import { Brand } from '@/constants/theme';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

function formatDateInput(raw: string, prev: string): string {
    if (raw.length < prev.length) return raw;
    const digits = raw.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

interface FormFieldProps {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    maxLength?: number;
    dateField?: boolean;
}

export function FormField({
    label,
    value,
    onChangeText,
    error,
    disabled,
    placeholder,
    maxLength,
    dateField,
}: FormFieldProps) {
    const handleChange = (text: string) => {
        if (dateField) {
            onChangeText(formatDateInput(text, value));
        } else {
            onChangeText(text);
        }
    };

    const keyboardType: KeyboardTypeOptions | undefined = dateField ? 'number-pad' : undefined;

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : undefined,
                    disabled ? styles.inputDisabled : undefined,
                ]}
                value={value}
                onChangeText={handleChange}
                editable={!disabled}
                placeholder={placeholder}
                placeholderTextColor={Brand.placeholder}
                maxLength={maxLength}
                keyboardType={keyboardType}
                testID={`field-${label.toLowerCase().replace(/\s+/g, '-')}`}
            />
            {error ? (
                <Text style={styles.errorText} testID={`error-${label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Brand.textPrimary,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: Brand.border,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: Brand.textPrimary,
        backgroundColor: Brand.background,
    },
    inputError: {
        borderColor: Brand.errorBorder,
    },
    inputDisabled: {
        backgroundColor: Brand.gray,
        color: Brand.placeholder,
    },
    errorText: {
        color: Brand.errorText,
        fontSize: 11,
        marginTop: 4,
    },
});
