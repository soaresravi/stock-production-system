import React, { useEffect } from 'react';
import { Table, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSuggestions } from '../../store/productionSlice';
import '../../styles/production.scss';

const ProductionSuggestions: React.FC = () => {

    const dispatch = useAppDispatch();
    const { suggestions, loading, error, totalValue } = useAppSelector((state) => state.production);

    useEffect(() => {
        dispatch(fetchSuggestions());
    }, [dispatch]);

    if (loading) {

        return (

            <div className='production-loading'>
               
                <Spinner animation='border' role='status' variant='primary'>
                    <span className='visually-hidden'> Calculando sugestões... </span>
                </Spinner>

                <p> Calculando melhores sugestões de produção </p>
           
            </div>

        );
    }

    if (error) {
        return <Alert variant='danger'> {error} </Alert>;
    }

    if (suggestions.length === 0) {

        return (

            <div className='production-empty-state'>
                <h3 className='production-empty-state-title'> Sem sugestões de produção. </h3>
                <p className='production-empty-state-message'> Não existem produtos que podem ser produzidos com o estoque atual. Por favor, adicione mais matérias-primas. </p>
            </div>

        );
    }

    return (

        <div className='production'>

            <div className='production-header'>
                <h2> Sugestões de produção </h2>
                <Badge className='production-total-badge'> Valor total: R$ {totalValue.toFixed(2)} </Badge>
            </div>

            <Card className='production-card'>
                
                <Card.Header>
                    <h5> Sugestão de produção (priorizada pelo maior valor) </h5>
                </Card.Header>

                <Card.Body>

                    <Table className='production-table' responsive>
                        
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

                                    <td data-label='Produto'> <strong> {suggestion.productName} </strong> </td>
                                    <td data-label='Preço unitário'> R$ {suggestion.productPrice.toFixed(2)} </td>
                                    <td data-label='Unidades' className='text-center'> <Badge className='production-quantity-badge'> {suggestion.quantity} </Badge> </td>
                                    <td data-label='Valor total'> R$ {suggestion.totalValue.toFixed(2)} </td>
                                </tr>

                            ))}

                        </tbody>

                        <tfoot>

                            <tr>
                                <td colSpan={3} className='text-end fw-bold'> Total geral: </td>
                                <td className='fw-bold text-success'> R$ {totalValue.toFixed(2)} </td>
                            </tr>

                        </tfoot>
                    </Table>
                </Card.Body>
            </Card>

            <Card className='production-info-card'>

                <Card.Header> <h5> Como é calculado? </h5> </Card.Header>
                
                <Card.Body>
                    
                    <ul>
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