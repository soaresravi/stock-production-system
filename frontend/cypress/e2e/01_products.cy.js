describe('Products CRUD', () => {
   
    beforeEach(() => {
      cy.visit('http://localhost:3000/products');
    });
  
    it('should display products list', () => {
      cy.contains('h2', 'Produtos').should('be.visible');
      cy.get('table').should('exist');
    });
  
    it('should navigate to new product form', () => {
      cy.contains('button', 'Adicionar produto').click();
      cy.contains('h2', 'Novo produto').should('be.visible');
      cy.url().should('include', '/products/new');
    });
  
    it('should create a new product', () => {

      cy.contains('button', 'Adicionar produto').click();

      cy.get('input[name="code"]').type('CYPRESS001');
      cy.get('input[name="name"]').type('Produto Teste Cypress');
      cy.get('input[name="price"]').type('99.99');
      
      cy.contains('button', 'Criar').click();

      cy.url().should('include', '/products');
      cy.contains('CYPRESS001').should('be.visible');
      cy.contains('Produto Teste Cypress').should('be.visible');
      cy.contains('99.99').should('be.visible');
      
    });

     it('should edit an existing product', () => {

      cy.contains('button', 'Adicionar produto').click();

      cy.get('input[name="code"]').type('PRD_EDIT_TEST');
      cy.get('input[name="name"]').type('Produto original');
      cy.get('input[name="price"]').type('100.00');
        
      cy.contains('button', 'Criar').click();

      cy.contains('button', 'Editar').first().click();

      cy.get('input[name="name"]').clear().type('Produto editado');
      cy.get('input[name="price"]').clear().type('150.00');
      cy.contains('button', 'Atualizar').click();

      cy.contains('Produto editado').should('be.visible');
      cy.contains('150.00').should('be.visible');

    });

    it('should delete a product', () => {

      cy.contains('button', 'Adicionar produto').click();

      cy.get('input[name="code"]').type('PRD_DELETE_TEST');
      cy.get('input[name="name"]').type('Produto para deletar');
      cy.get('input[name="price"]').type('50.00');
        
      cy.contains('button', 'Criar').click();

      cy.contains('tr', 'Produto para deletar').find('button:contains("Excluir")').click();
      cy.on('window:confirm', () => true);

      cy.contains('Produto para deletar').should('not.exist');

    });

  });