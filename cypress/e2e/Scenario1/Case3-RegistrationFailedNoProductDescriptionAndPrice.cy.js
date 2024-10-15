describe('API Test Case 3 - Registration Failed (No product description and price)', () => {

  it('Register products and handle errors when description or price is missing', () => {
    const apiUrl = Cypress.env('apiUrl'); 

    
    cy.fixture('Scenario1/Case3/products').then((products) => {
      const failedProducts = []; 
      
      
      products.forEach((product) => {
        
        
        cy.request({
          method: 'POST',
          url: `${apiUrl}`,
          body: product,
          failOnStatusCode: false // So that it does not fail if the product is invalid
        }).then((response) => {
          
            
            expect(response.status).to.eq(400);
            cy.log(`Erro esperado no cadastro do produto "${product.title}": ${response.body.message}`);
            failedProducts.push(product); 
            expect(response.body.message).to.satisfy((msg) => 
              msg.includes("description should not be empty") || 
              msg.includes("price should not be empty") || 
              (msg.includes("description should not be empty") && msg.includes("price should not be empty"))
            );

            cy.log(`Erro no cadastro do produto "${product.title}" foi encontrado e tratado com sucesso`);

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
          expect(productFound).to.be.undefined; // Product with error 400 should not be found
          cy.log(`Produto "${product.title}" não foi adicionado, conforme esperado.`);
        });
      });
    });
  });
});
