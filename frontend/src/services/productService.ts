import api from './api';
import { Product } from '../types';

export const productService = { //configuring api service

    listAll: () => api.get<Product[]>('/products'),
    getById: (id: number) => api.get<Product>(`/products/${id}`),
   
    create: (product: Omit<Product, 'id'>) => api.post<Product>(`/products`, product),
    update: (id: number, product: Product) => api.put<Product>(`/products/${id}`, product),
   
    delete: (id: number) => api.delete(`/products/${id}`),

};