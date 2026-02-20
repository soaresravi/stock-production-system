import React, { useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, deleteProduct } from '../../store/productSlice';
import { useNavigate } from 'react-router-dom';
import '../../styles/products.scss';

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

            <div className='products-header'>       
                <h2> Produtos </h2>
                <Button className='products-add-btn' onClick={() => navigate('/products/new')}> Adicionar produto </Button>
            </div>

            <Table className='products-table'>

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
                            
                            <td data-label='ID'>#{product.id} </td>
                            <td data-label='Código'>{product.code} </td>
                            <td data-label='Nome'>{product.name} </td>
                            <td data-label='Preço'>R$ {product.price.toFixed(2)} </td>
                            
                            <td data-label='Ações'>
                                
                                <div className='products-actions'>
                                    <Button className='products-edit-btn' size='sm' onClick={() => navigate(`/products/edit/${product.id}`)}> Editar </Button>
                                    <Button className='products-delete-btn' size='sm' onClick={() => product.id && handleDelete(product.id)}> Excluir </Button>
                                </div>

                            </td>
                              
                        </tr>
                    ))}

                </tbody>
            </Table>
        </div>
    );
};

export default ProductList;