describe('API Test Scenario 4 Case 1 - Deleting an existing product', () => {

  it('Registers multiple products and deletes "Produto B"', () => {
    const apiUrl = Cypress.env('apiUrl');

    // Register multiple products
    cy.fixture('Scenario4/Case1/products.json').then((products) => {

      products.forEach((product) => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}`,
          body: product
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.title).to.eq(product.title);
          expect(response.body.price).to.eq(product.price);
          expect(response.body.description).to.eq(product.description);

          cy.log(`Produto adicionado: ${response.body.title}`);
        });
      });

      // After adding all products, find "Produto B", delete it and verify
      cy.request({
        method: 'GET',
        url: `${apiUrl}`,
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);

        const productB = getResponse.body.find(p => p.title === "Produto B");

        if (productB) {
          cy.log('Produto B encontrado, iniciando exclusão...');

          cy.request({
            method: 'DELETE',
            url: `${apiUrl}${productB.id}`,
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200);
            cy.log('Produto B deletado com sucesso!');

            cy.request({
              method: 'GET',
              url: `${apiUrl}`,
            }).then((newGetResponse) => {
              const productDeleted = newGetResponse.body.find(p => p.id === productB.id);
              expect(productDeleted).to.be.undefined;
              cy.log('Confirmação: Produto B não está mais na lista.');
            });
          });

        } else {
          cy.log('Produto B não foi encontrado.');
        }
      });
    });
  });

});
