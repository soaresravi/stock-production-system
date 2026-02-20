import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/layout.scss';

const NavigationBar: React.FC = () => {

    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : '';
    };
    
    return (
        
        <Navbar className='navbar-custom' variant='dark' expand='lg'>

            <Container>
                
                <Navbar.Brand as={Link} to='/' className='navbar-brand-custom'> Sistema de produção de estoque </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                
                <Navbar.Collapse id='basic-navbar-nav'>

                    <Nav className='ms-auto'>
                        <Nav.Link as={Link} to='/products' className={`nav-link-custom ${isActive('/products')}`}> <span>📦</span> Produtos </Nav.Link>
                        <Nav.Link as={Link} to='/raw-materials' className={`nav-link-custom ${isActive('/raw-materials')}`}> <span>🪵</span> Matéria-prima </Nav.Link>
                        <Nav.Link as={Link} to='/production' className={`nav-link-custom ${isActive('/production')}`}><span>⚙️</span> Produção </Nav.Link>
                    </Nav>
                    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;