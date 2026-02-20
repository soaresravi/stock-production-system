import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
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

import productReducer from '../../../store/productSlice';
import ProductForm from '../ProductForm';

describe('ProductForm Component', () => {

    const renderComponent = (initialPath = '/products/new', preloadedState = {}) => {

        const store = configureStore({

            reducer: {
                products: productReducer,
                rawMaterials: (state = { items: [], loading: false, error: null }) => state 
            },

            preloadedState

        });

        return render (

            <Provider store={store}>

                <MemoryRouter initialEntries={[initialPath]} future={{ v7_startTransition: true, v7_relativeSplatPath: true}}>
                    
                    <Routes>
                        <Route path='/products/new' element={<ProductForm /> } />
                        <Route path='/products/edit/:id' element={<ProductForm /> } />
                        <Route path='/products' element={ <div> Products List Page </div> } />
                    </Routes>

                </MemoryRouter>

            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form with correct title for new product', () => {

        renderComponent();

        expect(screen.getByText(/Novo produto/i)).toBeInTheDocument();
        
        expect(screen.getByPlaceholderText(/Digite o código do produto/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Digite o nome do produto/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Digite o preço do produto/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Criar/i })).toBeInTheDocument();
    
    });

    test('submits form and creates new product', async () => {

        const mockCreatedProduct = { id: 1, code: 'TEST001', name: 'Test Product', price: 99.99 };
        (api.post as jest.Mock).mockResolvedValue({ data: mockCreatedProduct });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Digite o código do produto/i), { target: { value: 'TEST001' } });
        fireEvent.change(screen.getByPlaceholderText(/Digite o nome do produto/i), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByPlaceholderText(/Digite o preço do produto/i), { target: { value: '99.99' } });

        fireEvent.click(screen.getByRole('button', { name: /Criar/i }));

        await waitFor(() => {

            expect(api.post).toHaveBeenCalledWith('/products', expect.objectContaining({
                code: 'TEST001',
                name: 'Test Product',
                price: 99.99
            }));

        });

        expect(await screen.findByText(/Products List Page/i)).toBeInTheDocument();

    });

    test('loads product data when editing', async () => {

        const mockProduct = { id: 1, code: 'PRD001', name: 'Existing Product', price: 150.00 };

        renderComponent('/products/edit/1', {
           
            products: {
                items: [mockProduct],
                loading: false,
                error: null,
                selectedProduct: null
            }

        });

        expect(screen.getByDisplayValue('PRD001')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Product')).toBeInTheDocument();
        expect(screen.getByDisplayValue('150')).toBeInTheDocument();

        expect(screen.getByText(/Editar produto/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Atualizar/i })).toBeInTheDocument();

    });
});