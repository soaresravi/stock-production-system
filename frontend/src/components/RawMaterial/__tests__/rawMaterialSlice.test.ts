import { configureStore } from "@reduxjs/toolkit";
import rawMaterialReducer, { fetchRawMaterials, createRawMaterial, updateRawMaterial, deleteRawMaterial, setSelectedMaterial, clearError} from '../../../store/rawMaterialSlice';

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

describe('rawMaterial slice', () => {


    let store: any;

    beforeEach(() => {

        jest.clearAllMocks();

        store = configureStore({

            reducer: {
                rawMaterials: rawMaterialReducer
            }

        });

    });

    const initialState = {
        items: [],
        loading: false,
        error: null,
        selectedMaterial: null
    };

    test('should handle initial state', () => {
        expect(rawMaterialReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('should handle setSelectedMaterial', () => {
        const material = { id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100 };
        const actual = rawMaterialReducer(initialState, setSelectedMaterial(material));
        expect(actual.selectedMaterial).toEqual(material);
    });

    test('should handle clearError', () => {
        const stateWithError = { ...initialState, error: 'Some error' };
        const actual = rawMaterialReducer(stateWithError, clearError());
        expect(actual.error).toBeNull();
    });

    describe('fetchRawMaterials', () => {

        test('pending sets loading true', () => {
            const actual = rawMaterialReducer(initialState, fetchRawMaterials.pending(''));
            expect(actual.loading).toBe(true);
            expect(actual.error).toBeNull();
        });

        test('fulfilled updates items', async () => {

            const mockMaterials = [
                {id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100},
                {id: 2, code: 'RM002', name: 'Nails', stockQuantity: 500}
            ];

            (api.get as jest.Mock).mockResolvedValue({ data: mockMaterials });

            await store.dispatch(fetchRawMaterials());

            const state = store.getState().rawMaterials;
            expect(state.loading).toBe(false);
            expect(state.items).toEqual(mockMaterials);

        });

        test('rejected sets error', async () => {

            (api.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

            await store.dispatch(fetchRawMaterials());

            const state = store.getState().rawMaterials;
            expect(state.loading).toBe(false);
            expect(state.error).toBeTruthy();

        });

    });

    describe('createRawMaterial', () => {

        test('fulfilled adds new material', async () => {

            const newMaterial = { code: 'RM003', name: 'Paint', stockQuantity: 50 };
            const createdMaterial = { id: 3, ...newMaterial };

            (api.post as jest.Mock).mockResolvedValue({ data: createdMaterial });

            await store.dispatch(createRawMaterial(newMaterial));

            const state = store.getState().rawMaterials;
            expect(state.items).toContainEqual(createdMaterial);

        });

    });

    describe('updateRawMaterial', () => {

        test('fulfilled updates existing material', async () => {
            
            store = configureStore({
                
                reducer: { rawMaterials: rawMaterialReducer },
                
                preloadedState: {
                    
                    rawMaterials: {
                        items: [{ id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100 }],
                        loading: false,
                        error: null,
                        selectedMaterial: null
                    }
                }

            });

            const updatedMaterial = { id: 1, code: 'RM001', name: 'Pine Wood', stockQuantity: 150 };

            (api.put as jest.Mock).mockResolvedValue({ data: updatedMaterial });

            await store.dispatch(updateRawMaterial(updatedMaterial));

            const state = store.getState().rawMaterials;
            expect(state.items[0]).toEqual(updatedMaterial);

        });

    });

    describe('deleteRawMaterial', () => {

        test('fulfilled removes material', async () => {

            store = configureStore({

                reducer: { rawMaterials: rawMaterialReducer },

                preloadedState: {

                    rawMaterials: {
                        items: [{ id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100 }],
                        loading: false,
                        error: null,
                        selectedMaterial: null
                    }
                }

            });

            (api.delete as jest.Mock).mockResolvedValue({});

            await store.dispatch(deleteRawMaterial(1));

            const state = store.getState().rawMaterials;
            expect(state.items).toHaveLength(0);

        });
    });
});