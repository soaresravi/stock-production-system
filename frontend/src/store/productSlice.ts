import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';
import { Product } from '../types';

interface ProductState {
    items: Product[];
    loading: boolean;
    error: string | null;
    selectedProduct: Product | null;
}

const initialState: ProductState = {
    items: [],
    loading: false,
    error: null,
    selectedProduct: null
};

//async thunk: functions that call the api and dispatch actions to store

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => { //search all products in the api
    const response = await api.get<Product[]>('/products');
    return response.data; //return list
});

export const createProduct = createAsyncThunk('products/create', async (product: Omit<Product, 'id'>) => {
    const response = await api.post<Product>('/products', product);
    return response.data;
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, ...product }: Product) => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
});

export const deleteProduct = createAsyncThunk('products/delete', async (id: number) => {
    await api.delete(`/products/${id}`);
    return id;
});

const productSlice = createSlice({ //combines reducers and actions
    
    name: 'products',
    initialState,

    reducers: { //sync actions
        
        setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
            state.selectedProduct = action.payload; //product for edition
        },
        
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => { //async actions

        builder
        
        .addCase(fetchProducts.pending, (state) => { //when fetchProducts is initialized
            state.loading = true;
            state.error = null;
        })

        .addCase(fetchProducts.fulfilled, (state, action) => { //when fetchProducts is finished
            state.loading = false;
            state.items = action.payload; //updates list with api data
        })

        .addCase(fetchProducts.rejected, (state, action) => { //when hes failed
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch products';
        })

        .addCase(createProduct.fulfilled, (state, action) => {
            state.items.push(action.payload); //add new product to list
        })

        .addCase(updateProduct.fulfilled, (state, action) => {

            const index = state.items.findIndex(p => p.id === action.payload.id);

            if (index !== -1) {
                state.items[index] = action.payload; //replace updated product
            }
        })

        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.items = state.items.filter(p => p.id !== action.payload); //remove from list
        });
    },
});

export const { setSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;