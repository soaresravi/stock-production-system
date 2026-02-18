import React, { useState, useEffect } from 'react';
import { Form, Button, Card, FormGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createProduct, updateProduct, fetchProducts } from '../../store/productSlice';

const ProductForm: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items: products } = useAppSelector((state) => state.products);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        price: ''
    });

    useEffect(() => { //edit if have id

        if (id) {

            const product = products.find(p => p.id === parseInt(id));

            if (product) {

                setFormData({
                    code: product.code,
                    name: product.name,
                    price: product.price.toString()
                });

            }
        }

    }, [id, products]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        const productData = {
            code: formData.code,
            name: formData.name,
            price: parseFloat(formData.price)
        };

        if (id) {

            await dispatch(updateProduct({
                id: parseInt(id),
                ...productData
            }));

        } else {
            await dispatch(createProduct(productData));
        }

        navigate('/products');

    };

    return (

        <Card>
            
            <Card.Header> <h2> {id ? 'Editar produto' : 'Novo produto'} </h2> </Card.Header>
           
            <Card.Body>
                
                <Form onSubmit={handleSubmit}>
                    
                    <FormGroup className='mb-3'>
                        <Form.Label> Código </Form.Label>
                        <Form.Control type='text' name='code' value={formData.code} onChange={handleChange} required placeholder='Digite o código do produto' />
                    </FormGroup>

                    <FormGroup className='mb-3'>
                        <Form.Label> Nome </Form.Label>
                        <Form.Control type='text' name='name' value={formData.name} onChange={handleChange} required placeholder='Digite o nome do produto' />
                    </FormGroup>

                    <FormGroup className='mb-3'>
                        <Form.Label> Preço </Form.Label>
                        <Form.Control type='number' name='price' value={formData.price} onChange={handleChange} required step='0.01' min='0' placeholder='Digite o preço do produto' />
                    </FormGroup>

                    <div className='d-flex gap-2'>
                        <Button variant='primary' type='submit'> {id ? 'Atualizar' : 'Criar'} </Button>
                        <Button variant='secondary' onClick={() => navigate('/products')}> Cancelar </Button>
                    </div>

                </Form>
            </Card.Body>
        </Card>
    );
};

export default ProductForm;