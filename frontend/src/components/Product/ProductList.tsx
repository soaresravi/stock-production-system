import React, { useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, deleteProduct } from '../../store/productSlice';
import { useNavigate } from 'react-router-dom';

const ProductList: React.FC = () => {

    const navigate = useNavigate();

    const dispatch = useAppDispatch(); //redux hooks for accessing state and triggering actions
    const { items: products, loading, error } = useAppSelector((state) => state.products);

    useEffect(() => { //searches for products when the components assembled
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = async (id: number) => {
       
        if (window.confirm('Você tem certeza que quer deletar esse produto?')) {
            await dispatch(deleteProduct(id));
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
                <h2> Produtos </h2>
                <Button variant='primary' onClick={() => navigate('/products/new')}> Adicionar produto </Button>
            </div>

            <Table striped bordered hover>

                <thead>
                    
                    <tr>
                        <th> ID </th>
                        <th> Código </th>
                        <th> Nome </th>
                        <th> Preço </th>
                        <th> Ações </th>
                    </tr>

                </thead>

                <tbody>

                    {products.map((product) => (
                        
                        <tr key={product.id}>
                            
                            <td> {product.id} </td>
                            <td> {product.code} </td>
                            <td> {product.name} </td>
                            <td> {product.price.toFixed(2)} </td>
                            
                            <td> <Button variant='warning' size='sm' className='me-2' onClick={() => navigate(`/products/edit/${product.id}`)}> Editar </Button></td>
                            <td> <Button variant='danger' size='sm' onClick={() => product.id && handleDelete(product.id)}> Excluir </Button> </td>

                        </tr>
                    ))}

                </tbody>
            </Table>
        </div>
    );
};

export default ProductList;