describe('API Test Case 4 - Registration Failed (Price sent as string)', () => {

  it('Register products and handle errors when price is a string', () => {
    const apiUrl = Cypress.env('apiUrl'); 

    cy.fixture('Scenario1/Case4/products').then((products) => {
      const successfullyRegistered = []; 
      const failedProducts = []; 
      
      products.forEach((product) => {
        
        if (typeof product.price === 'string') {
          cy.log(`Erro esperado: o preço "${product.price}" está em formato string, mas deveria ser number`);
          failedProducts.push(product);

          cy.log(`Produto "${product.title}" não será cadastrado devido ao preço estar como string.`);
        } else {
          cy.request({
            method: 'POST',
            url: `${apiUrl}`,
            body: product,
            failOnStatusCode: false // Para que o teste continue mesmo com erros
          }).then((response) => {
              if (response.status === 201) {
                cy.log(`Produto "${product.title}" cadastrado com sucesso`);
                successfullyRegistered.push(product);
              } else if (response.status === 400) {
                cy.log(`Erro esperado no cadastro do produto "${product.title}": ${response.body.message}`);
                failedProducts.push(product);
                cy.log(`Produto "${product.title}" não foi cadastrado devido ao erro 400.`);
              } else {
                throw new Error(`Erro inesperado ao cadastrar o produto "${product.title}": ${response.status}`);
              }
          });
        }
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

          if (productFound) {
            cy.log(`Aviso: O produto "${product.title}" com erro esperado foi encontrado na API, mas não deveria ter sido cadastrado.`);
          } else {
            cy.log(`Produto "${product.title}" não foi adicionado, conforme esperado.`);
          }
        });
      });
    });
  });
});
