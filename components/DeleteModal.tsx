import { Brand } from '@/constants/theme';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DeleteModalProps {
    visible: boolean;
    productName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteModal({
    visible,
    productName,
    onConfirm,
    onCancel,
}: DeleteModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            testID="delete-modal"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={onCancel}
                        testID="modal-close"
                    >
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.message} testID="modal-message">
                        ¿Estás seguro de eliminar el producto {productName}?
                    </Text>
                    <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={onConfirm}
                        testID="modal-confirm"
                    >
                        <Text style={styles.confirmText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={onCancel}
                        testID="modal-cancel"
                    >
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: Brand.overlay,
    },
    sheet: {
        backgroundColor: Brand.background,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 24,
        paddingBottom: 48,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        marginBottom: 12,
    },
    closeText: {
        fontSize: 18,
        color: Brand.placeholder,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: Brand.textPrimary,
        marginBottom: 24,
    },
    confirmBtn: {
        backgroundColor: Brand.yellow,
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 12,
    },
    confirmText: {
        fontSize: 15,
        fontWeight: '600',
        color: Brand.textPrimary,
    },
    cancelBtn: {
        borderWidth: 1,
        borderColor: Brand.border,
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 15,
        color: Brand.textPrimary,
    },
});
