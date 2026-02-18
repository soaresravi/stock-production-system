import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';
import { RawMaterial } from '../types';

interface RawMaterialState {
    items: RawMaterial[];
    loading: boolean;
    error: string | null;
    selectedMaterial: RawMaterial | null;
}

const initialState: RawMaterialState = {
    items: [],
    loading: false,
    error: null,
    selectedMaterial: null
};

export const fetchRawMaterials = createAsyncThunk('rawMaterials/fetchAll', async () => {
    const response = await api.get<RawMaterial[]>('/raw-materials');
    return response.data;
});

export const createRawMaterial = createAsyncThunk('raw-materials/create', async (material: Omit<RawMaterial, 'id'>) => {
    const response = await api.post<RawMaterial>('/raw-materials', material);
    return response.data;
});

export const updateRawMaterial = createAsyncThunk('raw-materials/update', async ({ id, ...material }: RawMaterial) => {
    const response = await api.put<RawMaterial>(`/raw-materials/${id}`, material);
    return response.data;
});

export const deleteRawMaterial = createAsyncThunk('raw-materials/delete', async (id: number) => {
    await api.delete(`/raw-materials/${id}`);
    return id;
});

const rawMaterialSlice = createSlice({

    name: 'rawMaterials',
    initialState,

    reducers: {

        setSelectedMaterial: (state, action: PayloadAction<RawMaterial | null>) => {
            state.selectedMaterial = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },

    },

    extraReducers(builder) {
        
        builder

        .addCase(fetchRawMaterials.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(fetchRawMaterials.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })

        .addCase(fetchRawMaterials.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch raw materials';
        })

        .addCase(createRawMaterial.fulfilled, (state, action) => {
            state.items.push(action.payload);
        })

        .addCase(updateRawMaterial.fulfilled, (state, action) => {

            const index = state.items.findIndex(m => m.id === action.payload.id);

            if (index !== -1) {
                state.items[index] = action.payload;
            }

        })

        .addCase(deleteRawMaterial.fulfilled, (state, action) => {
            state.items = state.items.filter(m => m.id !== action.payload);
        });

    },
});

export const { setSelectedMaterial, clearError } = rawMaterialSlice.actions;
export default rawMaterialSlice.reducer;