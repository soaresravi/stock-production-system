import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router';
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

import rawMaterialReducer from '../../../store/rawMaterialSlice';
import RawMaterialForm from '../RawMaterialForm';

describe('RawMaterialForm Component', () => {

    const renderComponent = (initialPath = '/raw-materials/new', preloadedState = {}) => {

        const store = configureStore({

            reducer: {
                rawMaterials: rawMaterialReducer
            },

            preloadedState

        });

        return render (

            <Provider store={store}>

                <MemoryRouter initialEntries={[initialPath]} future={{ v7_startTransition: true, v7_relativeSplatPath: true}}>

                    <Routes>
                        <Route path='/raw-materials/new' element={<RawMaterialForm /> } />
                        <Route path='/raw-materials/edit/:id'element={<RawMaterialForm /> } />
                        <Route path='/raw-materials' element={ <div> Raw Materials List Page </div> } />
                    </Routes>

                </MemoryRouter>
            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form with correct title for new raw material', () => {

        renderComponent();

        expect(screen.getByText(/Nova matéria-prima/i)).toBeInTheDocument();

        expect(screen.getByPlaceholderText(/Digite o código da matéria-prima/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Digite o nome da matéria-prima/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Digite a quantidade em estoque/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Criar/i })).toBeInTheDocument();

    });

    test('submits form and creates new raw material', async () => {

        const mockCreatedRawMaterial = { id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100 };
        (api.post as jest.Mock).mockResolvedValue({ data: mockCreatedRawMaterial });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Digite o código da matéria-prima/i), { target: { value: 'RM001' } });
        fireEvent.change(screen.getByPlaceholderText(/Digite o nome da matéria-prima/i), { target: { value: 'Wood' } });
        fireEvent.change(screen.getByPlaceholderText(/Digite a quantidade em estoque/i), { target: { value: '100' } });

        fireEvent.click(screen.getByRole('button', { name: /Criar/i } ));

        await waitFor(() => {

            expect(api.post).toHaveBeenCalledWith('/raw-materials', {
                code: 'RM001',
                name: 'Wood',
                stockQuantity: 100
            });

        });

        expect(await screen.findByText(/Raw Materials List Page/i)).toBeInTheDocument();

    });

    test('loads raw material data when editing', async () => {

        const mockRawMaterial = { id: 1, code: 'RM001', name: 'Wood', stockQuantity: 100 };

        renderComponent('/raw-materials/edit/1', {

            rawMaterials: {
                items: [mockRawMaterial],
                loading: false,
                error: null,
                selectedMaterial: null
            }

        });

        expect(screen.getByDisplayValue('RM001')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Wood')).toBeInTheDocument();
        expect(screen.getByDisplayValue('100')).toBeInTheDocument();

        expect(screen.getByText(/Editar matéria-prima/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Atualizar/i })).toBeInTheDocument();

    });
});