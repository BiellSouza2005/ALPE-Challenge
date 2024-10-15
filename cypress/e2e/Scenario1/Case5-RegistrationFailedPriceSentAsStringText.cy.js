describe('API Test Case 4 - Registration Failed (Price sent as string text)', () => {

  it('Register products and handle errors when price is a string text', () => {
    const apiUrl = Cypress.env('apiUrl'); 

    cy.fixture('Scenario1/Case5/products').then((products) => {
      const failedProducts = []; 
      
      products.forEach((product) => {
        
          cy.request({
            method: 'POST',
            url: `${apiUrl}`,
            body: product,
            failOnStatusCode: false 
          }).then((response) => {
                expect(response.status).to.eq(400); 
                cy.log(`Erro esperado no cadastro do produto "${product.title}": ${response.body.message}`);
                failedProducts.push(product);
                cy.log(`Produto "${product.title}" não foi cadastrado devido ao erro 400.`);

          });
      });

      cy.request({
        method: 'GET',
        url: `${apiUrl}`,
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);

        const productsInAPI = getResponse.body;

        failedProducts.forEach((product) => {
          const productFound = productsInAPI.find(p => p.title === product.title);
            cy.log(`Aviso: O produto "${product.title}" com erro esperado foi encontrado na API, mas não deveria ter sido cadastrado.`);
        });
      });
    });
  });
});
