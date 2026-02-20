describe('Production Suggestions', () => {
  
    beforeEach(() => {
      cy.visit('http://localhost:3000/production');
    });
  
    it('should display production suggestions page', () => {
      cy.contains('h2', 'Sugestões de produção').should('be.visible');
      cy.get('.production-total-badge').should('be.visible');
    });
  
    it('should show calculation info card', () => {
      cy.contains('h5', 'Como é calculado?').should('be.visible');
      cy.get('ul li').should('have.length.at.least', 4);
    });
  
    it('should display suggestions with correct priority', () => {

      cy.get('.production-table tbody tr').should('have.length.at.least', 1);

      cy.get('.production-total-badge').invoke('text').then((text) => {
        const total = parseFloat(text.replace('Valor total: R$ ', '').replace(',', '.'));
        expect(total).to.be.greaterThan(0);
      });

    });
  
    it('should show correct product details in table', () => {

      cy.get('.production-table tbody tr').first().within(() => {
        cy.get('td[data-label="Produto"]').should('not.be.empty');
        cy.get('td[data-label="Unidades"] .production-quantity-badge').should('be.visible');
        cy.get('td[data-label="Valor total"]').should('contain', 'R$');
      });
      
    });
  
    it('should display empty state when no suggestions', () => {

      cy.intercept('GET', '**/api/production/suggestions', {
        statusCode: 200,
        body: []
      }).as('emptySuggestions');
      
      cy.visit('http://localhost:3000/production');
      cy.wait('@emptySuggestions');
      
      cy.get('.production-empty-state').should('be.visible');
      cy.get('.production-empty-state-title').should('contain', 'Sem sugestões de produção');
   
    });
  
});