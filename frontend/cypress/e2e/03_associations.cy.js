describe('Product Associations', () => {
    
    beforeEach(() => {
        cy.visit('http://localhost:3000/products');
    });
  
    it('should add raw material to product', () => {

        const uniqueCode = 'RAW-' + Date.now();
        const productCode = 'PROD-' + Date.now();
      
        cy.log('uniqueCode criado:', uniqueCode);

        cy.visit('http://localhost:3000/raw-materials');
      
        cy.contains('button', 'Adicionar').click();
      
        cy.get('input[name="code"]').type(uniqueCode);
        cy.get('input[name="name"]').type('Material Teste Real');
        cy.get('input[name="stockQuantity"]').type('100');
      
        cy.contains('button', 'Criar').click();
        cy.contains(uniqueCode).should('be.visible');
      
        cy.log('Matéria-prima criada com código:', uniqueCode);
      
        cy.wait(2000);

        cy.visit('http://localhost:3000/products');
      
        cy.contains('button', 'Adicionar produto').click();
      
        cy.get('input[name="code"]').type(productCode);
        cy.get('input[name="name"]').type('Produto Teste');
        cy.get('input[name="price"]').type('50');
      
        cy.contains('button', 'Criar').click();
      
        cy.contains(productCode).should('be.visible');
      
        cy.contains('tr', productCode).within(() => {
            cy.contains('button', 'Editar').click();
        });

        cy.url().should('include', '/products/edit/');
        cy.get('.associations-container', { timeout: 15000 }).should('be.visible');
        cy.contains('.associations-title', 'Matérias-primas necessárias', { timeout: 10000 }).should('be.visible');
      
        cy.contains('button', 'Adicionar matéria-prima').click();
      
        cy.get('.modal-content', { timeout: 10000 }).should('be.visible');

        cy.get('.modal-content select', { timeout: 10000 }).should('be.visible');

        cy.get('.modal-content select option').contains(uniqueCode).then(($option) => {
            const val = $option.val();
            cy.get('.modal-content select').select(val);
        });

        cy.get('.modal-content input[placeholder="Digite a quantidade"]').type('5');
      
        cy.contains('.modal-footer button', 'Adicionar').click();

        cy.contains('tr', uniqueCode, { timeout: 10000 }).within(() => {
          cy.get('input[type="number"]').should('have.value', '5');
        });
    
        cy.log('TESTE PASSOU!');
      
    });

  
    it('should update association quantity', () => {
        cy.contains('button', 'Editar').first().click();  
        cy.get('input[type="number"]').first().clear().type('10');
        cy.wait(500); 
        cy.get('input[type="number"]').first().should('have.value', '10');
    });
   
    it('should remove association', () => {
        
        cy.intercept('GET', '**/api/product-raw-materials/product/*').as('getAssociations');
        cy.contains('button', 'Editar').first().click();
        cy.wait('@getAssociations');

        cy.get('body').then(($body) => {
          
          if ($body.find('button:contains("Deletar")').length > 0) {
        
            cy.on('window:confirm', () => true);
            cy.get('button').contains('Deletar').first().click();
            
            cy.wait('@getAssociations');
  
            cy.contains('Não existem matérias-primas associadas', { timeout: 10000 }).should('be.visible');
      
          } else {
            cy.log('Não havia associações para deletar neste produto.');
          }

        });

    });

});