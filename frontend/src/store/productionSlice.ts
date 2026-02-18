import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { ProductionSuggestion } from '../types';

interface ProductionState {
    suggestions: ProductionSuggestion[];
    loading: boolean;
    error: string | null;
    totalValue: number;
}

const initialState: ProductionState = {
    suggestions: [],
    loading: false,
    error: null,
    totalValue: 0
};

export const fetchSuggestions = createAsyncThunk( 'production/fetchSuggestions', async () => {
    const response = await api.get<ProductionSuggestion[]>('production/suggestions');    
    return response.data;
});

const productionSlice = createSlice({

    name: 'production',
    initialState,

    reducers: {
       
        clearError: (state) => {
            state.error = null;
        }

    },

    extraReducers: (builder) => {

        builder

        .addCase(fetchSuggestions.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(fetchSuggestions.fulfilled, (state, action) => {
            
            state.loading = false;
            state.suggestions = action.payload;

            state.totalValue = action.payload.reduce(
                (sum, item) => sum + item.totalValue, 0
            );
            
        })

        .addCase(fetchSuggestions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch production suggestions';
        });
    }
});

export const { clearError } = productionSlice.actions;
export default productionSlice.reducer;