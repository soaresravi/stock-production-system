import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import api from '../../../services/api';
import productReducer from '../../../store/productSlice';
import rawMaterialReducer from '../../../store/rawMaterialSlice';
import ProductAssociations from '../ProductAssociations';

jest.mock('../../../services/api', () => ({

    __esModule: true,

    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }

}));

describe('ProductAssociations Component', () => {

    const mockRawMaterials = [
        { id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100 },
        { id: 2, code: 'RM002', name: 'Nails', stockQuantity: 500 },
        { id: 3, code: 'RM003', name: 'Paint', stockQuantity: 50 }
    ];

    const renderComponent = (productId = 1, preloadedState = {}) => {

        const store = configureStore({

            reducer: {
                products: productReducer,
                rawMaterials: rawMaterialReducer
            },

            preloadedState: {

                rawMaterials: {
                    items: mockRawMaterials,
                    loading: false,
                    error: null,
                    selectedMaterial: null
                },

                ...preloadedState

            }

        });

        return render (
            
            <Provider store={store}>
                <ProductAssociations productId={productId} />
            </Provider>

        );

    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn();
    });

    test('displays initial state', async () => {
        (api.get as jest.Mock).mockResolvedValue({ data: [] });
        renderComponent();
        expect(screen.getByText(/Matérias-primas necessárias/i)).toBeInTheDocument();
    });

    test('displays error state when fetch fails', async () => {
        (api.get as jest.Mock).mockRejectedValue(new Error('Failed to load'));
        renderComponent();
        expect(await screen.findByText(/Failed to load associations/i)).toBeInTheDocument();
    });

    test('displays associations list', async () => {

        const mockAssociations = [
            { id: 1, productId: 1, rawMaterialId: 1, quantityNeeded: 5, rawMaterial: { id: 1, name: 'Wood', code: 'RM001' }}
        ];

        (api.get as jest.Mock).mockResolvedValue({ data: mockAssociations });
        renderComponent();

        expect(await screen.findByText(/Wood/i)).toBeInTheDocument();
        expect(await screen.findByDisplayValue('5')).toBeInTheDocument();

    });

    test('opens modal to add new association', async () => {

        (api.get as jest.Mock).mockResolvedValue({ data: [] });
        
        renderComponent();

        const addButton = await screen.findByRole('button', { name: /Adicionar matéria-prima/i });
        
        fireEvent.click(addButton);
        expect(await screen.findByText(/Selecione uma matéria-prima/i)).toBeInTheDocument();

    });

    test('adds new association successfully', async () => {

        const newAssociation = {
            id: 3,
            productId: 1,
            rawMaterialId: 3,
            quantityNeeded: 2,
            rawMaterial: { id: 3, name: 'Paint', code: 'RM003' }
        };
    
        (api.get as jest.Mock).mockResolvedValue({ data: mockRawMaterials });
        (api.post as jest.Mock).mockResolvedValue({ data: newAssociation });
    
        renderComponent();
  
        const addButton = await screen.findByRole('button', { name: /Adicionar matéria-prima/i });
        fireEvent.click(addButton);
    
        const select = await screen.findByRole('combobox');
        fireEvent.change(select, { target: { value: '3' } });
    
        const quantityInput = screen.getByPlaceholderText(/Digite a quantidade/i);
        fireEvent.change(quantityInput, { target: { value: '2' } });

        (api.get as jest.Mock).mockResolvedValue({ data: [newAssociation] });
    
        const saveButton = screen.getByRole('button', { name: /^Adicionar$/i });
    
        await act(async () => {
            fireEvent.click(saveButton);
        });

        const tableItem = await screen.findByText(/Paint/i, {}, { timeout: 3000 });
        expect(tableItem).toBeInTheDocument();
        
    });

    test('updates quantity when input changes', async () => {

        const mockAssociations = [{ id: 1, productId: 1, rawMaterialId: 1, quantityNeeded: 5, rawMaterial: { id: 1, name: 'Wood', code: 'RM001' }}];

        (api.get as jest.Mock).mockResolvedValue({ data: mockAssociations });
        (api.put as jest.Mock).mockResolvedValue({});

        renderComponent();

        const quantityInput = await screen.findByDisplayValue('5');
        fireEvent.change(quantityInput, { target: { value: '10' } });

        await waitFor(() => {
            expect(api.put).toHaveBeenCalled();
        });
    
    });

    test('delets association', async () => {

        const mockAssociations = [{ id: 1, productId: 1, rawMaterialId: 1, quantityNeeded: 5, rawMaterial: { id: 1, name: 'Wood', code: 'RM001' }}];

        (api.get as jest.Mock).mockResolvedValue({ data: mockAssociations });
        (api.delete as jest.Mock).mockResolvedValue({});
        (window.confirm as jest.Mock).mockReturnValue(true);

        renderComponent();

        const deleteButton = await screen.findByRole('button', { name: /Deletar/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalled();
        });

    });

    test('cancels deletion when user confirms false', async () => {

        const mockAssociations = [{ id: 1, productId: 1, rawMaterialId: 1, quantityNeeded: 5, rawMaterial: { id: 1, name: 'Wood', code: 'RM001' } }];

        (api.get as jest.Mock).mockResolvedValue({ data: mockAssociations });
        (window.confirm as jest.Mock).mockReturnValue(false);

        renderComponent();

        const deleteButton = await screen.findByRole('button', { name: /Deletar/i });
        fireEvent.click(deleteButton);

        expect(api.delete).not.toHaveBeenCalled();

    });

});