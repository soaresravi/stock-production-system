import api from './api';
import { ProductRawMaterial } from '../types';

export const productAssociationService = {

    getByProduct: (productId: number) => api.get<ProductRawMaterial[]>(`/product-raw-materials/product/${productId}`),
    create: (data: { productId: number; rawMaterialId: number; quantity: number }) => api.post<ProductRawMaterial>('/product-raw-materials', data),
    update: (id: number, quantity: number) => api.put(`/product-raw-materials/${id}`, { quantity} ),
    delete: (id: number) => api.delete(`/product-raw-materials/${id}`),

};