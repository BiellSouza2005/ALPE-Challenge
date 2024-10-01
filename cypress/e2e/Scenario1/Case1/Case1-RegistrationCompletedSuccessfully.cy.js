describe('API Test Case - Register multiple products from JSON', () => {

  it('Registers multiple products and verifies that they were added correctly', () => {
    const apiUrl = Cypress.env('apiUrl'); 

    // Insert the product and check if it was added correctly
    cy.fixture('Scenario1/Case1/products.json').then((products) => {
      
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
          
          const productId = response.body.id;

          
          cy.request({
            method: 'GET',
            url: `${apiUrl}`, 
          }).then((getResponse) => {
            
            expect(getResponse.status).to.eq(200);
            const ProductRegistered = getResponse.body.find(p => p.id === productId);
            
            expect(ProductRegistered).to.not.be.undefined;
            expect(ProductRegistered.title).to.eq(product.title);
            expect(ProductRegistered.price).to.eq(product.price);
            expect(ProductRegistered.description).to.eq(product.description);
            cy.log("Novo produto adicionado: " + product.title);
          });
        });

      });
      
    });
    
    // Verify all product in the list
    cy.request({
      method: 'GET',
      url: `${apiUrl}`, 
    }).then((getAllResponse) => {
      
      expect(getAllResponse.status).to.eq(200);

      cy.fixture('Scenario1/Case1/products.json').then((products) => {
        products.forEach((products) => {
          const productInList = getAllResponse.body.find(p => p.title === products.title);
          expect(productInList).to.not.be.undefined;
          expect(productInList.title).to.eq(products.title);
        });
        cy.log('Todos os produtos foram adicionados com sucesso!');
      });
    });

  });

});
