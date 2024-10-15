describe('API Test Scenario 1 Case 1 - Registration Completed Successfully', () => {
  it('Should reject products with negative prices and verify they are not added', () => {
    const apiUrl = Cypress.env('apiUrl'); 

    cy.fixture('Scenario2/Case3/products.json').then((products) => {
      const failedProducts = [];

      products.forEach((product) => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}`,
          body: product,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
          cy.log(`Produto "${product.title}" não foi adicionado devido ao preço negativo: ${product.price}`);
          failedProducts.push(product);
        });
      });

      cy.request({
        method: 'GET',
        url: `${apiUrl}`,
      }).then((getAllResponse) => {
        expect(getAllResponse.status).to.eq(200);

        failedProducts.forEach((product) => {
          const productInList = getAllResponse.body.find(p => p.title === product.title);
          expect(productInList).to.be.undefined;
          cy.log(`Produto "${product.title}" não foi encontrado na lista, como esperado.`);
        });

        cy.log('Nenhum produto com preço negativo foi adicionado, conforme esperado.');
      });
    });
  });
});
