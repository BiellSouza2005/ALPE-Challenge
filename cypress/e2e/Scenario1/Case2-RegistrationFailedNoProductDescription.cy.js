describe('API Test Scenario 1 Case 2 - Registration Failed No Product Description', () => {

  it('Register products and handle errors when description is missing', () => {
    const apiUrl = Cypress.env('apiUrl'); 

    
    cy.fixture('Scenario1/Case2/products').then((products) => {
      const successfullyRegistered = []; 
      const failedProducts = []; 
      
      
      products.forEach((product) => {
        
        
        cy.request({
          method: 'POST',
          url: `${apiUrl}`,
          body: product,
          failOnStatusCode: false // So that it does not fail if the product is invalid
        }).then((response) => {
          
          if (response.status === 201) {
            
            cy.log(`Produto "${product.title}" cadastrado com sucesso`);
            successfullyRegistered.push(product); 

          } else if (response.status === 400) {
            
            cy.log(`Erro esperado no cadastro do produto "${product.title}": ${response.body.message}`);
            failedProducts.push(product); 
            expect(response.body.message).to.include("description should not be empty");

            cy.log(`Erro no cadastro do produto "${product.title}" foi encontrado e tratado com sucesso`);
          } else {
            throw new Error(`Erro inesperado ao cadastrar o produto "${product.title}": ${response.status}`);
          }
        });
      });

      cy.request({
        method: 'GET',
        url: `${apiUrl}`,
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);

        const productsInAPI = getResponse.body;

        
        successfullyRegistered.forEach((product) => {
          const productFound = productsInAPI.find(p => p.title === product.title);
          expect(productFound).to.not.be.undefined;
          cy.log(`Produto "${product.title}" encontrado na lista de produtos da API`);
        });

       
        failedProducts.forEach((product) => {
          const productFound = productsInAPI.find(p => p.title === product.title);
          expect(productFound).to.be.undefined; // Product with error 400 should not be found
          cy.log(`Produto "${product.title}" não foi adicionado, conforme esperado.`);
        });
      });
    });
  });
});
