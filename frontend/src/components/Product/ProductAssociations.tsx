import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { productAssociationService } from '../../services/productAssociationService';
import { ProductRawMaterial } from '../../types';
import './ProductAssociations.styled.scss';
import { fetchRawMaterials } from '../../store/rawMaterialSlice'; // Adicione este import

interface ProductAssociationProps {
    productId: number;
}

const ProductAssociations: React.FC<ProductAssociationProps> = ({ productId }) => {

    const dispatch = useAppDispatch();

    const [associations, setAssociations] = useState<ProductRawMaterial[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<number | ''>('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {items: rawMaterials } = useAppSelector((state) => state.rawMaterials);
    
    useEffect(() => {
        loadAssociations();
        dispatch(fetchRawMaterials()); 
    }, [productId, dispatch]);

    useEffect(() => {
        loadAssociations();
    }, [productId]);

    const loadAssociations = async () => {

        try {
            
            const response = await productAssociationService.getByProduct(productId);
            setAssociations(response.data);

        } catch (error) {
            setError('Failed to load associations');
        }

    };

    const handleAddAssociation = async () => {

        if (!selectedMaterial || !quantity) return;

        setLoading(true);
        setError(null);

        try {

            await productAssociationService.create({
                productId,
                rawMaterialId: Number(selectedMaterial),
                quantity: Number(quantity)
            });

            await loadAssociations();
            setShowModal(false);
            setSelectedMaterial('');
            setQuantity('');
        
        } catch (error) {
            setError('Failed to add association');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async(id: number, newQuantity: number) => {

        try {

            await productAssociationService.update(id, newQuantity);
            await loadAssociations();

        } catch (error) {
            setError('Failed to update quantity');
        }

    };

    const handleDeleteAssociation = async (id: number) => {

        if (!window.confirm('Deseja remover a matéria-prima desse produto?')) return;

        try {

            await productAssociationService.delete(id);
            await loadAssociations();

        } catch (error) {
            setError('Failed to remove association');
        }

    };

    const avaliableMaterials = rawMaterials.filter(rm => !associations.some(assoc => assoc.rawMaterial?.id === rm.id));

    return (

        <div className='associations-container'>
            
            <div className='associations-title'> Matérias-primas necessárias </div>
            
            {error &&
                <Alert variant='danger' onClose={() => setError(null)} dismissible> {error} </Alert>
            }
            
            <Button className="associations-add-btn" onClick={() => setShowModal(true)}> Adicionar matéria-prima </Button>
            
            <Table className="associations-table">
                
                <thead>
                    
                    <tr>
                        <th>Matéria-prima</th>
                        <th>Quantidade necessária</th>
                        <th>Ações</th>
                    </tr>

                </thead>
                
                <tbody>
                    
                    {associations.map((assoc) => (
                    
                    <tr key={assoc.id}>
                        
                        <td data-label="Matéria-prima"> {assoc.rawMaterial?.name} ({assoc.rawMaterial?.code}) </td>
                        
                        <td data-label="Quantidade">    
                            <Form.Control type='number' className="associations-quantity-input" value={assoc.quantityNeeded}
                            onChange={(e) => assoc.id && handleUpdateQuantity(assoc.id, Number(e.target.value))} min='1' />
                        </td>

                        <td data-label="Ações">
                            <Button className="associations-delete-btn" size='sm' onClick={() => assoc.id && handleDeleteAssociation(assoc.id)}> Deletar </Button>
                        </td>

                    </tr>

                    ))}
                    
                    {associations.length === 0 && (
                    
                    <tr>
                        <td colSpan={3} className="text-center">
                            
                            <div className="associations-empty-state">
                                <i className="bi bi-box"></i>
                                <p>Não existem matérias-primas associadas</p>
                                <small>Clique no botão acima para adicionar</small>
                            </div>

                        </td>
                    </tr>

                    )}
                </tbody>
            </Table>
            
            <Modal show={showModal} onHide={() => setShowModal(false)} className="associations-modal" centered>
                
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar matéria-prima</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    
                    <Form>
                        
                        <Form.Group className='mb-3'>
                            
                            <Form.Label>Matéria-prima</Form.Label>
                            <Form.Select value={selectedMaterial} onChange={(e) => { const value = e.target.value; setSelectedMaterial(value === '' ? '' : Number(value)); }}>
                                
                                <option value=''>Selecione uma matéria-prima...</option>
                                
                                {avaliableMaterials.map((rm) => (
                                    <option key={rm.id} value={rm.id}> {rm.name} ({rm.code}) - Estoque: {rm.stockQuantity} </option>
                                ))}

                           </Form.Select>

                        </Form.Group>
   
                        <Form.Group className='mb-3'>              
                            <Form.Label>Quantidade necessária</Form.Label>
                            <Form.Control type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} min='1' placeholder='Digite a quantidade' />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowModal(false)}> Cancelar </Button>
                    <Button variant='primary' onClick={handleAddAssociation} disabled={!selectedMaterial || !quantity || loading}> {loading ? 'Adicionando...' : 'Adicionar'} </Button>
                </Modal.Footer>
                
           </Modal>
        </div>
    );
};

export default ProductAssociations;