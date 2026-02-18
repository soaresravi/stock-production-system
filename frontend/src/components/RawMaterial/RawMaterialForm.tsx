import React, { useState, useEffect } from 'react';
import { Form, Button, Card, FormGroup, FormControl } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createRawMaterial, updateRawMaterial, fetchRawMaterials } from '../../store/rawMaterialSlice';

const RawMaterialForm: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items: materials } = useAppSelector((state) => state.rawMaterials);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        stockQuantity: ''
    });

    useEffect(() => {

        if (id) {

            const material = materials.find(m => m.id === parseInt(id));

            if (material) {

                setFormData({
                    code: material.code,
                    name: material.name,
                    stockQuantity: material.stockQuantity.toString()
                });

            }
        }
    }, [id, materials]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        const materialData = {
            code: formData.code,
            name: formData.name,
            stockQuantity: parseInt(formData.stockQuantity)
        };

        if (id) {

            await dispatch(updateRawMaterial({
                id: parseInt(id),
                ...materialData
            }));
        
        } else {
            await dispatch(createRawMaterial(materialData));
        }

        navigate('/raw-materials');

    };

    return (

        <Card>

            <Card.Header> <h2> {id ? 'Editar matéria-prima' : 'Nova matéria-prima'} </h2> </Card.Header>

            <Card.Body>

                <Form onSubmit={handleSubmit}>

                    <FormGroup className='mb-3'>
                        <Form.Label> Código </Form.Label>
                        <FormControl type='text' name='code' value={formData.code} onChange={handleChange} required placeholder='Digite o código da matéria prima' />
                    </FormGroup>

                    <FormGroup className='mb-3'>
                        <Form.Label> Nome </Form.Label>
                        <Form.Control type='text' name='name' value={formData.name} onChange={handleChange} required placeholder='Digite o nome da matéria prima' />
                    </FormGroup>

                    <FormGroup className='mb-3'>
                        <Form.Label> Quantidade </Form.Label>
                        <Form.Control type='number' name='stockQuantity' onChange={handleChange} required min='0' step='1' placeholder='Digite a quantidade em estoque' />
                    </FormGroup>

                    <div className='d-flex gap-2'>
                        <Button variant='primary' type='submit'> {id ? 'Atualizar' : 'Criar'} </Button>
                        <Button variant='secondary' onClick={() => navigate('/raw-materials')}> Cancelar </Button>
                    </div>

                </Form>
            </Card.Body>
        </Card>
    );
};

export default RawMaterialForm;