import { useCallback, useEffect, useState } from 'react';
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { useRepository } from '../di/RepositoryContext';

export interface UseProductListResult {
    products: Product[];
    filteredProducts: Product[];
    loading: boolean;
    error: string | null;
    search: string;
    setSearch: (query: string) => void;
    refresh: () => void;
}

export function useProductList(
    repo?: ProductRepository,
): UseProductListResult {
    const contextRepo = useRepository();
    const repository = repo ?? contextRepo;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const loadProducts = useCallback(() => {
        setLoading(true);
        setError(null);
        repository
            .getAll()
            .then((data) => {
                setProducts(data);
            })
            .catch((err: Error) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [repository]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const filteredProducts = search.trim()
        ? products.filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase()),
        )
        : products;

    return {
        products,
        filteredProducts,
        loading,
        error,
        search,
        setSearch,
        refresh: loadProducts,
    };
}
