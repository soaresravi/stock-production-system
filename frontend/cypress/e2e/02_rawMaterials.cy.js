describe('Raw Materials CRUD', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/raw-materials');
    });

    it('should display raw materials list', () => {
        cy.contains('h2', 'Matérias-primas').should('be.visible');
        cy.get('table').should('exist')
    });

    it('should navigate to new raw material form', () => {
        cy.contains('button', 'Adicionar matéria-prima').click();
        cy.contains('h2', 'Nova matéria-prima').should('be.visible');
        cy.url().should('include', '/raw-materials/new');
    });

    it('should create a new raw material', () => {

        cy.contains('button', 'Adicionar matéria-prima').click();

        cy.get('input[name="code"]').type('CYPRESS_RM001');
        cy.get('input[name="name"]').type('Teste Cypress');
        cy.get('input[name="stockQuantity"]').type('100');

        cy.contains('button', 'Criar').click();

        cy.url().should('include', '/raw-materials');
        cy.contains('CYPRESS_RM001').should('be.visible');
        cy.contains('Teste Cypress').should('be.visible');
        cy.contains('100').should('be.visible');
    });

    it('should edit an existing raw material', () => {

        cy.contains('button', 'Adicionar matéria-prima').click();

        cy.get('input[name="code"]').type('RM_EDIT_TEST');
        cy.get('input[name="name"]').type('Matéria-prima original');
        cy.get('input[name="stockQuantity"]').type('50');
        
        cy.contains('button', 'Criar').click();

        cy.contains('button', 'Editar').first().click();

        cy.get('input[name="name"]').clear().type('Material editado');
        cy.get('input[name="stockQuantity"]').clear().type('75');
        cy.contains('button', 'Atualizar').click();

        cy.contains('Material editado').should('be.visible');
        cy.contains('75').should('be.visible');

    });

    it('should delete a raw material', () => {

        cy.contains('button', 'Adicionar matéria-prima').click();

        cy.get('input[name="code"]').type('RM_DELETE_TEST');
        cy.get('input[name="name"]').type('Matéria-prima para deletar');
        cy.get('input[name="stockQuantity"]').type('30');
        
        cy.contains('button', 'Criar').click();

        cy.contains('tr', 'Matéria-prima para deletar').find('button:contains("Excluir")').click();
        cy.on('window:confirm', () => true);

        cy.contains('Matéria-prima para deletar').should('not.exist');

    });
    
});