import React, { useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRawMaterials, deleteRawMaterial } from '../../store/rawMaterialSlice';
import { useNavigate } from 'react-router-dom';

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

        <div>

            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h2> Matérias-primas </h2>
                <Button variant='primary' onClick={() => navigate('/raw-materials/new')}> Adicionar matéria-prima </Button>
            </div>

            <Table striped bordered hover>

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

                            <td> {material.id} </td>
                            <td> {material.name} </td>
                            <td> {material.code} </td>
                            <td> {material.stockQuantity} </td>

                            <td> <Button variant='warning' size='sm' className='me-2' onClick={() => navigate(`/raw-materials/edit/${material.id}`)}> Editar </Button> </td>
                            <td> <Button variant='danger' size='sm' onClick={() => material.id && handleDelete(material.id)}> Excluir </Button> </td>
                       
                        </tr>
                    ))}

                </tbody>
            </Table>  

        </div>
    );
};

export default RawMaterialList;