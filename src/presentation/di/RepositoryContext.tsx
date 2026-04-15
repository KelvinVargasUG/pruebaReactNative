import React from 'react';
import { HttpProductRepository } from '../../data/repositories/HttpProductRepository';
import { ProductRepository } from '../../domain/repositories/ProductRepository';

const defaultRepository: ProductRepository = new HttpProductRepository();

export const RepositoryContext =
    React.createContext<ProductRepository>(defaultRepository);

export function RepositoryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RepositoryContext.Provider value={defaultRepository}>
            {children}
        </RepositoryContext.Provider>
    );
}

export function useRepository(): ProductRepository {
    return React.useContext(RepositoryContext);
}
