import { Product } from '../../../domain/entities/Product';
import { HttpProductRepository } from '../HttpProductRepository';

const mockProduct: Product = {
    id: 'trj-crd',
    name: 'Tarjetas de Crédito',
    description: 'Tarjeta de consumo bajo la modalidad de crédito',
    logo: 'https://example.com/logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
};

describe('HttpProductRepository', () => {
    let repository: HttpProductRepository;

    beforeEach(() => {
        repository = new HttpProductRepository();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getAll', () => {
        it('returns the product list from the API', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ data: [mockProduct] }),
            });

            const result = await repository.getAll();

            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/bp/products'));
            expect(result).toEqual([mockProduct]);
        });

        it('throws when the response is not ok', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

            await expect(repository.getAll()).rejects.toThrow('Error al cargar los productos');
        });
    });

    describe('getById', () => {
        it('returns a single product from the API', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockProduct),
            });

            const result = await repository.getById('trj-crd');

            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/bp/products/trj-crd'));
            expect(result).toEqual(mockProduct);
        });

        it('throws when product is not found', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

            await expect(repository.getById('missing')).rejects.toThrow('Producto no encontrado');
        });
    });

    describe('create', () => {
        it('posts a new product and returns it', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ message: 'Product added successfully', data: mockProduct }),
            });

            const result = await repository.create(mockProduct);

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/bp/products'),
                expect.objectContaining({ method: 'POST' }),
            );
            expect(result).toEqual(mockProduct);
        });

        it('throws when creation fails with a 400', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ message: 'Duplicate ID' }),
            });

            await expect(repository.create(mockProduct)).rejects.toThrow('Duplicate ID');
        });
    });

    describe('update', () => {
        it('puts updated product data and returns it', async () => {
            const { id, ...rest } = mockProduct;
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ message: 'Product updated successfully', data: mockProduct }),
            });

            const result = await repository.update(id, rest);

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining(`/bp/products/${id}`),
                expect.objectContaining({ method: 'PUT' }),
            );
            expect(result).toEqual(mockProduct);
        });

        it('throws when the product is not found (404)', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ message: 'Not product found with that identifier' }),
            });

            await expect(repository.update('missing', {} as Omit<Product, 'id'>)).rejects.toThrow(
                'Not product found with that identifier',
            );
        });
    });

    describe('delete', () => {
        it('sends DELETE request and resolves on success', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ message: 'Product removed successfully' }),
            });

            await expect(repository.delete('trj-crd')).resolves.toBeUndefined();
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/bp/products/trj-crd'),
                expect.objectContaining({ method: 'DELETE' }),
            );
        });

        it('throws when the product is not found', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ message: 'Not product found with that identifier' }),
            });

            await expect(repository.delete('missing')).rejects.toThrow(
                'Not product found with that identifier',
            );
        });
    });

    describe('verifyId', () => {
        it('returns true when the ID already exists', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(true),
            });

            const exists = await repository.verifyId('trj-crd');
            expect(exists).toBe(true);
        });

        it('returns false when the ID does not exist', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(false),
            });

            const exists = await repository.verifyId('new-id');
            expect(exists).toBe(false);
        });
    });
});
