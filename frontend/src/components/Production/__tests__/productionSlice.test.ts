import { configureStore } from '@reduxjs/toolkit';
import productionReducer, { fetchSuggestions, clearError } from '../../../store/productionSlice';

import api from '../../../services/api';

jest.mock('../../../services/api', () => ({
    
    __esModule: true,
    
    default: {
        get: jest.fn(),
    }

}));

describe('production slice', () => {

    let store: any;

    beforeEach(() => {

        jest.clearAllMocks();

        store = configureStore({

            reducer: {
                production: productionReducer
            }

        });

    });

    const initialState = {
        suggestions: [],
        loading: false,
        error: null,
        totalValue: 0
    };

    test('should handle initial state', () => {
        expect(productionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('should handle clearError', () => {
        const stateWithError = { ...initialState, error: 'Some error' };
        const actual = productionReducer(stateWithError, clearError());
        expect(actual.error).toBeNull();
    });

    describe('fetchSuggestions', () => {

        test('pending sets loading true', () => {
            const actual = productionReducer(initialState, fetchSuggestions.pending(''));
            expect(actual.loading).toBe(true);
        });

        test('fulfilled updates suggestions and totalValue', async () => {

            const mockSuggestions = [
                { productId: 1, productName: 'Luxury Chair', productPrice: 299.9, quantity: 12, totalValue: 3598.8},
                { productId: 2, productName: 'Another Product', productPrice: 149.9, quantity: 2, totalValue: 299.8}
            ];

            (api.get as jest.Mock).mockResolvedValue({ data: mockSuggestions });

            await store.dispatch(fetchSuggestions());

            const state = store.getState().production;
            expect(state.loading).toBe(false);
            expect(state.suggestions).toEqual(mockSuggestions);
            expect(state.totalValue).toBeCloseTo(3898.6);
        
        });

        test('rejected sets error', async () => {

            (api.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

            await store.dispatch(fetchSuggestions());

            const state = store.getState().production;
            expect(state.loading).toBe(false);
            expect(state.error).toBeTruthy();

        });
    });
});