import { act, renderHook, waitFor } from '@testing-library/react-native';
import { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { addOneYear, todayIso, useProductForm } from '../useProductForm';

function makeRepo(overrides: Partial<ProductRepository> = {}): ProductRepository {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        verifyId: jest.fn(),
        ...overrides,
    };
}

const validFields = {
    id: 'valid-id',
    name: 'Tarjeta Credito',
    description: 'Descripcion del producto de credito',
    logo: 'https://example.com/logo.png',
    date_release: '2099-01-01',
    date_revision: '2100-01-01',
};

describe('addOneYear', () => {
    it('adds exactly one year to a YYYY-MM-DD string', () => {
        expect(addOneYear('2025-01-01')).toBe('2026-01-01');
    });
});

describe('todayIso', () => {
    it('returns a string in YYYY-MM-DD format', () => {
        expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});

describe('useProductForm — create mode', () => {
    it('initializes with empty fields', () => {
        const repo = makeRepo();
        const { result } = renderHook(() =>
            useProductForm({ mode: 'create', onSuccess: jest.fn() }, repo),
        );
        expect(result.current.fields.id).toBe('');
        expect(result.current.errors).toEqual({});
    });

    it('auto-calculates date_revision when date_release is set', () => {
        const repo = makeRepo();
        const { result } = renderHook(() =>
            useProductForm({ mode: 'create', onSuccess: jest.fn() }, repo),
        );

        act(() => {
            result.current.setField('date_release', '2099-06-15');
        });

        expect(result.current.fields.date_revision).toBe('2100-06-15');
    });

    it('shows ID error when verifyId returns true (duplicate)', async () => {
        const repo = makeRepo({ verifyId: jest.fn().mockResolvedValue(true) });
        const onSuccess = jest.fn();
        const { result } = renderHook(() =>
            useProductForm({ mode: 'create', onSuccess }, repo),
        );

        act(() => {
            Object.entries(validFields).forEach(([k, v]) =>
                result.current.setField(k as keyof typeof validFields, v),
            );
        });

        await act(async () => {
            await result.current.submit();
        });

        expect(result.current.errors.id).toBe('ID no válido');
        expect(repo.create).not.toHaveBeenCalled();
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it('shows ID error for id shorter than 3 characters', async () => {
        const repo = makeRepo();
        const { result } = renderHook(() =>
            useProductForm({ mode: 'create', onSuccess: jest.fn() }, repo),
        );

        act(() => {
            result.current.setField('id', 'ab');
        });

        await act(async () => {
            await result.current.submit();
        });

        expect(result.current.errors.id).toContain('3 y 10 caracteres');
    });

    it('calls create and triggers onSuccess for a valid new product', async () => {
        const repo = makeRepo({
            verifyId: jest.fn().mockResolvedValue(false),
            create: jest.fn().mockResolvedValue(validFields),
        });
        const onSuccess = jest.fn();
        const { result } = renderHook(() =>
            useProductForm({ mode: 'create', onSuccess }, repo),
        );

        act(() => {
            Object.entries(validFields).forEach(([k, v]) =>
                result.current.setField(k as keyof typeof validFields, v),
            );
        });

        await act(async () => {
            await result.current.submit();
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(repo.create).toHaveBeenCalled();
    });

    it('resets fields and errors when reset is called', () => {
        const repo = makeRepo();
        const { result } = renderHook(() =>
            useProductForm({ mode: 'create', onSuccess: jest.fn() }, repo),
        );

        act(() => {
            result.current.setField('name', 'Some Name');
        });
        act(() => {
            result.current.reset();
        });

        expect(result.current.fields.name).toBe('');
        expect(result.current.errors).toEqual({});
    });

    it('sets general error when create throws', async () => {
        const repo = makeRepo({
            verifyId: jest.fn().mockResolvedValue(false),
            create: jest.fn().mockRejectedValue(new Error('Network error')),
        });
        const { result } = renderHook(() =>
            useProductForm({ mode: 'create', onSuccess: jest.fn() }, repo),
        );

        act(() => {
            Object.entries(validFields).forEach(([k, v]) =>
                result.current.setField(k as keyof typeof validFields, v),
            );
        });

        await act(async () => {
            await result.current.submit();
        });

        expect(result.current.errors.general).toBe('Network error');
    });
});

describe('useProductForm — edit mode', () => {
    it('does not call verifyId in edit mode', async () => {
        const repo = makeRepo({
            update: jest.fn().mockResolvedValue(validFields),
        });
        const onSuccess = jest.fn();
        const { result } = renderHook(() =>
            useProductForm({ mode: 'edit', initialValues: validFields, onSuccess }, repo),
        );

        await act(async () => {
            await result.current.submit();
        });

        expect(repo.verifyId).not.toHaveBeenCalled();
        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('calls update without the id field in the payload', async () => {
        const repo = makeRepo({
            update: jest.fn().mockResolvedValue(validFields),
        });
        const onSuccess = jest.fn();
        const { result } = renderHook(() =>
            useProductForm({ mode: 'edit', initialValues: validFields, onSuccess }, repo),
        );

        await act(async () => {
            await result.current.submit();
        });

        await waitFor(() => expect(repo.update).toHaveBeenCalled());
        expect(repo.update).toHaveBeenCalledWith(
            validFields.id,
            expect.not.objectContaining({ id: expect.anything() }),
        );
    });
});
