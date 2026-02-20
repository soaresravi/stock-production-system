import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';

import api from '../../../services/api';
import rawMaterialReducer from '../../../store/rawMaterialSlice';
import RawMaterialList from '../RawMaterialList';

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

describe('RawMaterialList Component', () => {

    const renderComponent = (preloadedState = {}) => {

        const store = configureStore({

            reducer: {
                rawMaterials: rawMaterialReducer
            },

            preloadedState

        });

        return render (

            <Provider store={store}>

                <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true}}>
                    <RawMaterialList />
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
            rawMaterials: { items: [], loading: true, error: null, selectedMaterial: null }
        });

        expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    });

    test('displays error state', async () => {

        (api.get as jest.Mock).mockRejectedValue(new Error('Failed to load materials'));

        renderComponent({

            rawMaterials: {
                items: [],
                loading: false,
                error: 'Failed to load materials',
                selectedMaterial: null
            }

        });

        expect(await screen.findByText(/Failed to load materials/i)).toBeInTheDocument();
    
    });

    test('displays materials after loading', async () => {

        const mockRawMaterials = [
            { id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100 },
            { id: 2, code: 'RM002', name: 'Nails', stockQuantity: 500 }
        ];

        (api.get as jest.Mock).mockResolvedValue({ data: mockRawMaterials });

        renderComponent();

        expect(await screen.findByText(/Matérias-primas/i)).toBeInTheDocument();
        expect(await screen.findByText('Wood')).toBeInTheDocument();
        expect(await screen.findByText('RM001')).toBeInTheDocument();
    
    });

    test('handles delete action', async () => {

        const mockRawMaterials = [{ id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100 }];

        (api.get as jest.Mock).mockResolvedValue({ data: mockRawMaterials });
        (api.delete as jest.Mock).mockResolvedValue({});
        (window.confirm as jest.Mock).mockReturnValue(true);

        renderComponent();

        const deleteButton = await screen.findByRole('button', { name: /Excluir/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/raw-materials/1');
        });

    });

    test('navigates to edit page when edit button is clicked', async () => {
        
        const mockRawMaterials = [{ id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100 }];
        (api.get as jest.Mock).mockResolvedValue({ data: mockRawMaterials});

        renderComponent();

        const editButton = await screen.findByRole('button', { name: /Editar/i });
        fireEvent.click(editButton);

        expect(mockNavigate).toHaveBeenCalledWith('/raw-materials/edit/1');
    
    });
});