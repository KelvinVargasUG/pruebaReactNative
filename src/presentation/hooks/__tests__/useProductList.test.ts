import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Product } from '../../../domain/entities/Product';
import { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { useProductList } from '../useProductList';

const mockProducts: Product[] = [
    {
        id: 'trj-crd',
        name: 'Tarjetas de Crédito',
        description: 'Tarjeta de consumo bajo la modalidad de crédito',
        logo: 'https://example.com/logo.png',
        date_release: '2025-01-01',
        date_revision: '2026-01-01',
    },
    {
        id: 'sav-acc',
        name: 'Cuenta de Ahorros',
        description: 'Cuenta de ahorros con beneficios especiales',
        logo: 'https://example.com/save.png',
        date_release: '2025-03-01',
        date_revision: '2026-03-01',
    },
];

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

describe('useProductList', () => {
    it('shows loading state on initial mount', () => {
        const repo = makeRepo({
            getAll: jest.fn(() => new Promise(() => { })),
        });
        const { result } = renderHook(() => useProductList(repo));
        expect(result.current.loading).toBe(true);
        expect(result.current.products).toEqual([]);
    });

    it('loads products and turns off loading on success', async () => {
        const repo = makeRepo({
            getAll: jest.fn().mockResolvedValue(mockProducts),
        });
        const { result } = renderHook(() => useProductList(repo));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.products).toEqual(mockProducts);
        expect(result.current.error).toBeNull();
    });

    it('sets error when getAll fails', async () => {
        const repo = makeRepo({
            getAll: jest.fn().mockRejectedValue(new Error('Network error')),
        });
        const { result } = renderHook(() => useProductList(repo));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Network error');
        expect(result.current.products).toEqual([]);
    });

    it('filters products by name when search is set', async () => {
        const repo = makeRepo({ getAll: jest.fn().mockResolvedValue(mockProducts) });
        const { result } = renderHook(() => useProductList(repo));

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.setSearch('Tarjetas');
        });

        expect(result.current.filteredProducts).toHaveLength(1);
        expect(result.current.filteredProducts[0].id).toBe('trj-crd');
    });

    it('filters products by description when search is set', async () => {
        const repo = makeRepo({ getAll: jest.fn().mockResolvedValue(mockProducts) });
        const { result } = renderHook(() => useProductList(repo));

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.setSearch('beneficios');
        });

        expect(result.current.filteredProducts).toHaveLength(1);
        expect(result.current.filteredProducts[0].id).toBe('sav-acc');
    });

    it('returns all products when search is empty', async () => {
        const repo = makeRepo({ getAll: jest.fn().mockResolvedValue(mockProducts) });
        const { result } = renderHook(() => useProductList(repo));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.filteredProducts).toHaveLength(2);
    });

    it('reloads products when refresh is called', async () => {
        const getAll = jest
            .fn()
            .mockResolvedValueOnce(mockProducts)
            .mockResolvedValueOnce([mockProducts[0]]);

        const repo = makeRepo({ getAll });
        const { result } = renderHook(() => useProductList(repo));

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.refresh();
        });

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.products).toHaveLength(1);
    });
});
