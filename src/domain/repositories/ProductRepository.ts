import { Product } from '../entities/Product';

export interface ProductRepository {
    getAll(): Promise<Product[]>;
    getById(id: string): Promise<Product>;
    create(product: Product): Promise<Product>;
    update(id: string, product: Omit<Product, 'id'>): Promise<Product>;
    delete(id: string): Promise<void>;
    verifyId(id: string): Promise<boolean>;
}
