import productReducer, { fetchProducts, setSelectedProduct, createProduct, updateProduct, deleteProduct, clearError } from '../../../store/productSlice';
import { configureStore } from '@reduxjs/toolkit';

import api from '../../../services/api';

jest.mock('../../../services/api', () => ({

    __esModule: true,

    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }

}));

describe('product slice', () => {

    let store: any;

    beforeEach(() => {

        jest.clearAllMocks();

        store = configureStore({

            reducer: {
                products: productReducer
            }

        });

    });

    const initialState = {
        items: [],
        loading: false,
        error: null,
        selectedProduct: null
    };

    test('should handle initial state', () => {
        expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('should handle setSelectedProduct', () => {
        const product = { id: 1, code: 'TEST', name: 'Test', price: 100 };
        const actual = productReducer(initialState, setSelectedProduct(product));
        expect(actual.selectedProduct).toEqual(product);
    });

    test('should handle clearError', () => {
        const stateWithError = { ...initialState, error: 'Some error' };
        const actual = productReducer(stateWithError, clearError());
        expect(actual.error).toBeNull();
    });

    describe('fetchProducts', () => {

        test('pending sets loading true', () => {
            const actual = productReducer(initialState, fetchProducts.pending(''));
            expect(actual.loading).toBe(true);
            expect(actual.error).toBeNull();
        });

        test('fullfilled updates items', async () => {

            const mockProducts = [
                {id: 1, code: 'TEST', name: 'Test', price: 100},
                {id: 2, code: 'TEST2', name: 'Test 2', price: 200}
            ];

            (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });

            await store.dispatch(fetchProducts());

            const state = store.getState().products;
            expect(state.loading).toBe(false);
            expect(state.items).toEqual(mockProducts);
        
        });

        test('rejected sets error', async () => {

            (api.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

            await store.dispatch(fetchProducts());

            const state = store.getState().products;
            expect(state.loading).toBe(false);
            expect(state.error).toBeTruthy();

        });
    
    });

    describe('createProduct', () => {

        test('fulfilled adds new product', async () => {

            const newProduct = { code: 'TEST3', name: 'Test 3', price: 300 };
            const createdProduct = { id: 3, ...newProduct };

            (api.post as jest.Mock).mockResolvedValue({ data: createdProduct });

            await store.dispatch(createProduct(newProduct));

            const state = store.getState().products;
            expect(state.items).toContainEqual(createdProduct);

        });

    });

    describe('updateProduct', () => {

        test('fulfilled updates existing products', async () => {

            store = configureStore({

                reducer: { products: productReducer },

                preloadedState: {

                    products: {
                        items: [{ id: 1, code: 'TEST', name: 'Test', price: 100 }],
                        loading: false,
                        error: null,
                        selectedProduct: null
                    }
                }
            });

            const updatedProduct = { id: 1, code: 'TEST', name: 'Test Updated', price: 150 };

            (api.put as jest.Mock).mockResolvedValue({ data: updatedProduct });

            await store.dispatch(updateProduct(updatedProduct));

            const state = store.getState().products;
            expect(state.items[0]).toEqual(updatedProduct);

        });

    });

    describe('deleteProduct', () => {

        test('fulfilled removes product', async () => {

            store = configureStore({

                reducer: { products: productReducer },

                preloadedState: {

                    products: {
                        items: [{ id: 1, code: 'TEST', name: 'Test', price: 100 }],
                        loading: false,
                        error: null,
                        selectedProduct: null
                    }
                }

            });

            (api.delete as jest.Mock).mockResolvedValue({});
            
            await store.dispatch(deleteProduct(1));

            const state = store.getState().products;
            expect(state.items).toHaveLength(0);
        
        });
    });

});