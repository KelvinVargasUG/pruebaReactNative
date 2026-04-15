import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { BASE_URL } from '../config';

export class HttpProductRepository implements ProductRepository {
    private readonly baseUrl = `${BASE_URL}/bp/products`;

    async getAll(): Promise<Product[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const json = await response.json();
        return json.data as Product[];
    }

    async getById(id: string): Promise<Product> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Producto no encontrado');
        }
        return response.json() as Promise<Product>;
    }

    async create(product: Product): Promise<Product> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message ?? 'Error al crear el producto');
        }
        const json = await response.json();
        return json.data as Product;
    }

    async update(id: string, product: Omit<Product, 'id'>): Promise<Product> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message ?? 'Error al actualizar el producto');
        }
        const json = await response.json();
        return json.data as Product;
    }

    async delete(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message ?? 'Error al eliminar el producto');
        }
    }

    async verifyId(id: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/verification/${id}`);
        if (!response.ok) {
            throw new Error('Error al verificar el ID');
        }
        return response.json() as Promise<boolean>;
    }
}
