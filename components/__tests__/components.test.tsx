import { Product } from '@/src/domain/entities/Product';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { DeleteModal } from '../DeleteModal';
import { FormField } from '../FormField';
import { ProductCard } from '../ProductCard';
import { SkeletonCard } from '../SkeletonCard';

const mockProduct: Product = {
    id: 'trj-crd',
    name: 'Tarjetas de Crédito',
    description: 'Tarjeta de consumo',
    logo: 'https://example.com/logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
};

describe('ProductCard', () => {
    it('renders the product name and id', () => {
        render(<ProductCard product={mockProduct} onPress={jest.fn()} />);
        expect(screen.getByText('Tarjetas de Crédito')).toBeTruthy();
        expect(screen.getByText('ID: trj-crd')).toBeTruthy();
    });

    it('calls onPress when tapped', () => {
        const onPress = jest.fn();
        render(<ProductCard product={mockProduct} onPress={onPress} />);
        fireEvent.press(screen.getByTestId('product-card-trj-crd'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});

describe('FormField', () => {
    it('renders the label and input', () => {
        render(
            <FormField label="Nombre" value="Test" onChangeText={jest.fn()} />,
        );
        expect(screen.getByText('Nombre')).toBeTruthy();
    });

    it('calls onChangeText when text changes', () => {
        const onChange = jest.fn();
        render(
            <FormField label="Nombre" value="" onChangeText={onChange} />,
        );
        fireEvent.changeText(screen.getByTestId('field-nombre'), 'Nueva');
        expect(onChange).toHaveBeenCalledWith('Nueva');
    });

    it('shows error text when error prop is provided', () => {
        render(
            <FormField
                label="ID"
                value=""
                onChangeText={jest.fn()}
                error="ID no válido"
            />,
        );
        expect(screen.getByTestId('error-id')).toBeTruthy();
        expect(screen.getByText('ID no válido')).toBeTruthy();
    });

    it('does not show error text when there is no error', () => {
        render(<FormField label="ID" value="" onChangeText={jest.fn()} />);
        expect(screen.queryByTestId('error-id')).toBeNull();
    });

    it('is not editable when disabled is true', () => {
        render(
            <FormField
                label="Fecha Revisión"
                value="2026-01-01"
                onChangeText={jest.fn()}
                disabled
            />,
        );
        const input = screen.getByTestId('field-fecha-revisión');
        expect(input.props.editable).toBe(false);
    });
});

describe('DeleteModal', () => {
    it('renders when visible is true with product name', () => {
        render(
            <DeleteModal
                visible
                productName="Tarjetas de Crédito"
                onConfirm={jest.fn()}
                onCancel={jest.fn()}
            />,
        );
        expect(screen.getByText(/Tarjetas de Crédito/)).toBeTruthy();
        expect(screen.getByTestId('modal-confirm')).toBeTruthy();
        expect(screen.getByTestId('modal-cancel')).toBeTruthy();
    });

    it('calls onConfirm when Confirmar is pressed', () => {
        const onConfirm = jest.fn();
        render(
            <DeleteModal
                visible
                productName="Producto"
                onConfirm={onConfirm}
                onCancel={jest.fn()}
            />,
        );
        fireEvent.press(screen.getByTestId('modal-confirm'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when Cancelar is pressed', () => {
        const onCancel = jest.fn();
        render(
            <DeleteModal
                visible
                productName="Producto"
                onConfirm={jest.fn()}
                onCancel={onCancel}
            />,
        );
        fireEvent.press(screen.getByTestId('modal-cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when the close (✕) button is pressed', () => {
        const onCancel = jest.fn();
        render(
            <DeleteModal
                visible
                productName="Producto"
                onConfirm={jest.fn()}
                onCancel={onCancel}
            />,
        );
        fireEvent.press(screen.getByTestId('modal-close'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});

describe('SkeletonCard', () => {
    it('renders the skeleton placeholder', () => {
        render(<SkeletonCard />);
        expect(screen.getByTestId('skeleton-card')).toBeTruthy();
    });
});

describe('FormField — dateField', () => {
    it('auto-formats digits into YYYY-MM-DD', () => {
        const onChange = jest.fn();
        render(
            <FormField label="Fecha" value="" onChangeText={onChange} dateField />,
        );
        fireEvent.changeText(screen.getByTestId('field-fecha'), '20260417');
        expect(onChange).toHaveBeenCalledWith('2026-04-17');
    });

    it('inserts dash after year', () => {
        const onChange = jest.fn();
        render(
            <FormField label="Fecha" value="2026" onChangeText={onChange} dateField />,
        );
        fireEvent.changeText(screen.getByTestId('field-fecha'), '20260');
        expect(onChange).toHaveBeenCalledWith('2026-0');
    });

    it('allows deleting characters', () => {
        const onChange = jest.fn();
        render(
            <FormField label="Fecha" value="2026-04" onChangeText={onChange} dateField />,
        );
        fireEvent.changeText(screen.getByTestId('field-fecha'), '2026-0');
        expect(onChange).toHaveBeenCalledWith('2026-0');
    });

    it('strips non-digit characters', () => {
        const onChange = jest.fn();
        render(
            <FormField label="Fecha" value="" onChangeText={onChange} dateField />,
        );
        fireEvent.changeText(screen.getByTestId('field-fecha'), 'abc2026');
        expect(onChange).toHaveBeenCalledWith('2026');
    });
});
