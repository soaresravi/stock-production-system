describe('Navigation', () => {
  
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('should redirect root to products page', () => {
      cy.url().should('include', '/products');
    });
  
    it('should navigate to products page via menu', () => {
      cy.contains('.nav-link-custom', 'Produtos').click();
      cy.url().should('include', '/products');
      cy.contains('h2', 'Produtos').should('be.visible');
    });
  
    it('should navigate to raw materials page via menu', () => {
      cy.contains('.nav-link-custom', 'Matéria-prima').click();
      cy.url().should('include', '/raw-materials');
      cy.contains('h2', 'Matérias-primas').should('be.visible');
    });
  
    it('should navigate to production page via menu', () => {
      cy.contains('.nav-link-custom', 'Produção').click();
      cy.url().should('include', '/production');
      cy.contains('h2', 'Sugestões de produção').should('be.visible');
    });
  
    it('should highlight active page in navbar', () => {

      cy.contains('.nav-link-custom', 'Produtos').click();
      cy.contains('.nav-link-custom', 'Produtos').should('have.class', 'active');

      cy.contains('.nav-link-custom', 'Matéria-prima').click();
      cy.contains('.nav-link-custom', 'Matéria-prima').should('have.class', 'active');
      cy.contains('.nav-link-custom', 'Produtos').should('not.have.class', 'active');
      
      cy.contains('.nav-link-custom', 'Produção').click();
      cy.contains('.nav-link-custom', 'Produção').should('have.class', 'active');
      cy.contains('.nav-link-custom', 'Matéria-prima').should('not.have.class', 'active');
   
    });
  
    it('should navigate via browser back/forward buttons', () => {

      cy.contains('.nav-link-custom', 'Matéria-prima').click();
      cy.url().should('include', '/raw-materials');

      cy.go('back');
      cy.url().should('include', '/products');

      cy.go('forward');
      cy.url().should('include', '/raw-materials');

      cy.go('back');
      cy.url().should('include', '/products');

      cy.contains('.nav-link-custom', 'Produção').click();
      cy.url().should('include', '/production');

    });
    
  });