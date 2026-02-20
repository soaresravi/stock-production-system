import React from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/layout.scss';

interface PageContainerProps {
    children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {

    return (

        <div className='page-container'>
            <Container className='page-container-content mt-4'> {children} </Container>
        </div>

    );
    
};

export default PageContainer;