import React, { useEffect } from 'react';
import { Table, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSuggestions } from '../../store/productionSlice';

const ProductionSuggestions: React.FC = () => {

    const dispatch = useAppDispatch();
    const { suggestions, loading, error, totalValue } = useAppSelector((state) => state.production);

    useEffect(() => {
        dispatch(fetchSuggestions());
    }, [dispatch]);

    if (loading) {

        return (

            <div className='text-center mt-5'>
               
                <Spinner animation='border' role='status' variant='primary'>
                    <span className='visually-hidden'> Calculando sugestões... </span>
                </Spinner>

                <p className='mt-2'> Calculando melhores sugestões de produção </p>
           
            </div>

        );
    }

    if (error) {
        return <Alert variant='danger'> {error} </Alert>;
    }

    if (suggestions.length === 0) {

        return (

            <Alert variant='info'>
                <Alert.Heading> Sem sugestões de produção. </Alert.Heading>
                <p> Não existem produtos que podem ser produzidos com o estoque atual. Por favor, adicione mais matérias-primas. </p>
            </Alert>

        );
    }

    return (

        <div>

            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2> Sugestões de produção </h2>
                <Badge bg='success' style={{ fontSize: '1.2rem' }}> Valor total: R$ {totalValue.toFixed(2)} </Badge>
            </div>

            <Card className='mb-4'>
                
                <Card.Header>
                    <h5> Sugestão de produção (priorizada pelo maior valor) </h5>
                </Card.Header>

                <Card.Body>

                    <Table striped bordered hover responsive>
                        
                        <thead className='table-dark'>
                            
                            <tr>
                                <th> Produto </th>
                                <th> Preço por unidade </th>
                                <th> Unidades para produzir </th>
                                <th> Valor total </th>
                            </tr>
                        </thead>

                        <tbody>

                            {suggestions.map((suggestion) => (

                                <tr key={suggestion.productId}>

                                    <td> <strong> {suggestion.productName} </strong> </td>
                                    <td> R$ {suggestion.productPrice.toFixed(2)} </td>
                                    <td className='text-center'> <Badge bg='info' style={{ fontSize: '1rem' }}> {suggestion.quantity} </Badge> </td>
                                    <td className='text-sucess fw-bold'> R$ {suggestion.totalValue.toFixed(2)} </td>
                                </tr>

                            ))}

                        </tbody>

                        <tfoot className='table-secondary'>

                            <tr>
                                <td colSpan={3} className='text-end fw-bold'> Total geral: </td>
                                <td className='fw-bold text-success'> R$ {totalValue.toFixed(2)} </td>
                            </tr>

                        </tfoot>
                    </Table>
                </Card.Body>
            </Card>

            <Card>

                <Card.Header> Como é calculado? </Card.Header>
                
                <Card.Body>
                    
                    <ul className='mb-0'>
                        <li> <strong> Prioridade: </strong> Os produtos são ordenados por preço (do maior para o menor) para maximizar o valor total </li>
                        <li> <strong> Cálculo: </strong> Para cada produto, é verificado o estoque disponível de toda a matéria prima necessária </li>
                        <li> <strong> Limite: </strong> A matéria prima com a menor quantidade disponível determina quantas unidades podem ser produzidas </li>
                        <li> <strong> Estoque atualizado: </strong> Depois de sugerir um produto, o estoque é atualizado antes de calcular o próximo </li>
                    </ul>
                    
                </Card.Body>
            </Card>
        </div>
    );
};

export default ProductionSuggestions;