import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import api from '../../../services/api';
import productionReducer from '../../../store/productionSlice';
import ProductionSuggestions from '../ProductionSuggestions';
import { preload } from 'react-dom';

jest.mock('../../../services/api', () => ({

    __esModule: true,

    default: {
        get: jest.fn(),
    }

}));

describe('ProductionSuggestions Component', () => {

    const renderComponent = (preloadedState = {}) => {

        const store = configureStore({

            reducer: {
                production: productionReducer
            },

            preloadedState

        });

        return render (

            <Provider store={store}>
                <ProductionSuggestions />
            </Provider>

        );

    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays loading state', () => {

        renderComponent({

            production: {
                suggestions: [],
                loading: true,
                error: null,
                totalValue: 0
            }

        });

        expect(screen.getByText(/Calculando melhores sugestões de produção/i)).toBeInTheDocument();

    });

    test('displays error state', async () => {

        (api.get as jest.Mock).mockRejectedValue(new Error('Failed to load suggestions'));

        renderComponent({

            production: {
                suggestions: [],
                loading: false,
                error: 'Failed to load suggestions',
                totalValue: 0
            }

        });

        expect(await screen.findByText(/Failed to load suggestions/i)).toBeInTheDocument();

    });

    test('displays suggestions after loading', async () => {

        const mockSuggestions = [
            { productId: 1, productName: 'Luxury Chair', productPrice: 299.9, quantity: 12, totalValue: 3598.8 },
            { productId: 2, productName: 'Another Product', productPrice: 149.9, quantity: 2, totalValue: 299.8 }
        ];

        (api.get as jest.Mock).mockResolvedValue({ data: mockSuggestions });

        renderComponent();

        await waitFor(() => {
            expect(screen.queryByText(/Calculando/i)).not.toBeInTheDocument();
        });

        const title = await screen.findByRole('heading', { name: /Sugestões de produção/i });
        expect(title).toBeInTheDocument();

        expect(screen.getByText('Luxury Chair')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();

        const totalValues = screen.getAllByText(/3898\.60/);
        expect(totalValues.length).toBeGreaterThan(0);
        
    });

    test('displays total value correctly', async () => {

        const mockSuggestions = [
            { productId: 1, productName: 'Luxury Chair', productPrice: 299.9, quantity: 12, totalValue: 3598.8 },
            { productId: 2, productName: 'Another Product', productPrice: 149.9, quantity: 2, totalValue: 299.8 }
        ];

        (api.get as jest.Mock).mockResolvedValue({ data: mockSuggestions });

        renderComponent();

        const totalValueElements = await screen.findAllByText(/3898\.60/);
        expect(totalValueElements.length).toBeGreaterThan(0);
        expect(totalValueElements[0]).toBeInTheDocument();

    });

    test('shows empty state when no suggestions', async () => {

        (api.get as jest.Mock).mockResolvedValue({ data: [] });

        renderComponent();

        expect(await screen.findByText(/Sem sugestões de produção/i)).toBeInTheDocument();
        expect(await screen.findByText(/Não existem produtos que podem ser produzidos com o estoque atual. Por favor, adicione mais matérias-primas/i)).toBeInTheDocument();
    
    });
});