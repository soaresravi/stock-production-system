import React, { useState, useEffect } from 'react';
import { Form, Button, Card, FormGroup, FormControl } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createRawMaterial, updateRawMaterial } from '../../store/rawMaterialSlice';
import '../../styles/rawMaterials.scss';

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

        <Card className='raw-material-form-card'>

            <Card.Header className='raw-material-form-header'> <h2> {id ? 'Editar matéria-prima' : 'Nova matéria-prima'} </h2> </Card.Header>

            <Card.Body className='raw-material-form-body'>

                <Form onSubmit={handleSubmit}>

                    <FormGroup className='raw-material-form-group'>
                        <Form.Label> Código </Form.Label>
                        <FormControl type='text' name='code' value={formData.code} onChange={handleChange} required placeholder='Digite o código da matéria-prima' />
                    </FormGroup>

                    <FormGroup className='raw-material-form-group'>
                        <Form.Label> Nome </Form.Label>
                        <Form.Control type='text' name='name' value={formData.name} onChange={handleChange} required placeholder='Digite o nome da matéria-prima' />
                    </FormGroup>

                    <FormGroup className='raw-material-form-group'>
                        <Form.Label> Quantidade </Form.Label>
                        <Form.Control type='number' name='stockQuantity' value={formData.stockQuantity} onChange={handleChange} required min='0' step='1' placeholder='Digite a quantidade em estoque' />
                    </FormGroup>

                    <div className='raw-material-form-actions'>
                        <Button variant='primary' type='submit'> {id ? 'Atualizar' : 'Criar'} </Button>
                        <Button variant='secondary' onClick={() => navigate('/raw-materials')}> Cancelar </Button>
                    </div>

                </Form>
            </Card.Body>
        </Card>
    );
};

export default RawMaterialForm;