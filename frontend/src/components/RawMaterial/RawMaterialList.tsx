import React, { useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRawMaterials, deleteRawMaterial } from '../../store/rawMaterialSlice';
import { useNavigate } from 'react-router-dom';
import '../../styles/rawMaterials.scss';

const RawMaterialList: React.FC = () => {

    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { items: materials, loading, error} = useAppSelector((state) => state.rawMaterials);

    useEffect(() => {
        dispatch(fetchRawMaterials());
    }, [dispatch]);

    const handleDelete = async (id: number) => {

        if (window.confirm('Você tem certeza que quer deletar essa matéria-prima?')) {
            await dispatch(deleteRawMaterial(id));
        }

    };

    if (loading) {

        return (

            <div className='text-center'>
                <Spinner animation='border' role='status'>
                    <span className='visually-hidden'> Carregando... </span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <Alert variant='danger'> {error} </Alert>;
    }

    return (

        <div className='raw-materials'>

            <div className='raw-materials-header'>
                <h2> Matérias-primas </h2>
                <Button className='raw-materials-add-btn' onClick={() => navigate('/raw-materials/new')}> Adicionar matéria-prima </Button>
            </div>

            <Table className='raw-materials-table'>

                <thead>

                    <tr>
                        <th> ID </th>
                        <th> Código </th>
                        <th> Nome </th>
                        <th> Quantidade </th>
                        <th> Ações </th>
                    </tr>

                </thead>

                <tbody>

                    {materials.map((material) => (

                        <tr key={material.id}>

                            <td data-label='ID'>#{material.id} </td>
                            <td data-label='Código'> {material.code} </td>
                            <td data-label='Nome'> {material.name} </td>
                            <td data-label='Quantidade'>{material.stockQuantity}</td>
                            
                            <td data-label='Ações'>
                                
                                <div className='raw-materials-actions'>
                                    <Button className='raw-materials-edit-btn' size='sm' onClick={() => navigate(`/raw-materials/edit/${material.id}`)}> Editar </Button>
                                    <Button className='raw-materials-delete-btn' size='sm' onClick={() => material.id && handleDelete(material.id)}> Excluir </Button> 
                                </div>
                            
                            </td>
                       
                        </tr>
                    ))}

                </tbody>
            </Table>  

        </div>
    );
};

export default RawMaterialList;