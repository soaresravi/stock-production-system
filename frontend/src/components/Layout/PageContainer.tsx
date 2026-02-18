import React from 'react';
import { Container } from 'react-bootstrap';

interface PageContainerProps {
    children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {

    return (
        <Container className='mt-4'> {children} </Container>
    );
    
};

export default PageContainer;