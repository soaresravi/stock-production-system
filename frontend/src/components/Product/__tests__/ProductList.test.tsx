import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import api from '../../../services/api';
import productReducer from '../../../store/productSlice';
import ProductList from '../ProductList';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../services/api', () => ({
    
    __esModule: true,
    
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }

}));

describe('ProductList Component', () => {

    const renderComponent = (preloadedState = {}) => {
        
        const store = configureStore({
            
            reducer: {
                products: productReducer
            },

            preloadedState

        });

        return render (
           
            <Provider store={store}>
                
                <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true}}>
                    <ProductList />
                </MemoryRouter>

            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn();
    });

    test('displays loading state', () => {

        renderComponent({
            products: { items: [], loading: true, error: null }
        });

        expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
    });

    test('displays error state', async () => {

        (api.get as jest.Mock).mockRejectedValue(new Error('Failed to load products'));

        renderComponent({

            products: {
                items: [],
                loading: false,
                error: 'Failed to load products'
            }

        });

        expect(await screen.findByText(/Failed to load products/i)).toBeInTheDocument();

    });

    test('displays products after loading', async () => {

        const mockProducts = [
            { id: 1, code: 'PRD001', name: 'Test Product 1', price: 100 },
            { id: 2, code: 'PRD002', name: 'Test Product 2', price: 200 }
        ];

        (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });

        renderComponent();

        expect(await screen.findByText(/Test Product 1/i)).toBeInTheDocument();
        expect(await screen.findByText(/Test Product 2/i)).toBeInTheDocument();

        expect(api.get).toHaveBeenCalledWith('/products');

    });

    test('handles delete action', async () => {

        const mockProducts = [{ id: 1, code: 'PRD001', name: 'Test Product 1', price: 100}];

        (api.get as jest.Mock).mockResolvedValue({ data: mockProducts});
        (api.delete as jest.Mock).mockResolvedValue({});
        (window.confirm as jest.Mock).mockReturnValue(true);

        renderComponent();

        const deleteButton = await screen.findByRole('button', { name: /Excluir/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/products/1');
        });
    
    });

    test('navigates to edit page when edit button is clicked', async () => {

        const mockProducts = [{ id: 1, code: 'PRD001', name: 'Test Product 1', price: 100 }];
        (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });

        renderComponent();

        const editButton = await screen.findByRole('button', { name: /Editar/i });
        fireEvent.click(editButton);

        expect(mockNavigate).toHaveBeenCalledWith('/products/edit/1');

    });
    
})