import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar: React.FC = () => {
    
    return (
        
        <Navbar bg='dark' variant='dark' expand='lg'>
            <Container>
                
                <Navbar.Brand as={Link} to='/'> Sistema de produção de estoque </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                
                <Navbar.Collapse id='basic-navbar-nav'>

                    <Nav className='me-auto'>
                        <Nav.Link as={Link} to='/products'> Produtos  </Nav.Link>
                        <Nav.Link as={Link} to='/raw-materials'> Matéria-prima </Nav.Link>
                        <Nav.Link as={Link} to='/production'> Produção </Nav.Link>
                    </Nav>
                    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;