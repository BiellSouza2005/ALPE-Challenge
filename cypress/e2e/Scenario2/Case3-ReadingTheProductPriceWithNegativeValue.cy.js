describe('API Test Scenario 1 Case 1 - Registration Completed Successfully', () => {

  it('Registers multiple products and verifies that they were added correctly', () => {
    const apiUrl = Cypress.env('apiUrl'); 

    
    cy.fixture('Scenario2/Case3/products.json').then((products) => {
      
      products.forEach((product) => {
        
        // Check if the price is a positive number
        if (typeof product.price === 'number' && product.price > 0) {
          cy.request({
            method: 'POST',
            url: `${apiUrl}`, 
            body: product
          }).then((response) => {
            
            expect(response.status).to.eq(201);
            expect(response.body.title).to.eq(product.title);
            expect(response.body.price).to.eq(product.price);
            expect(response.body.description).to.eq(product.description);
            

          });
        } else {
          // Log and do not proceed with the registration if the price is not valid
          cy.log(`Produto "${product.title}" não foi adicionado, pois o preço está incorreto: ${product.price}`);
        }

      });
      
    });
    
    // Verify all products in the list
    cy.request({
      method: 'GET',
      url: `${apiUrl}`, 
    }).then((getAllResponse) => {
      
      expect(getAllResponse.status).to.eq(200);

      cy.fixture('Scenario2/Case3/products.json').then((products) => {
        products.forEach((product) => {
          const productInList = getAllResponse.body.find(p => p.title === product.title);
          expect(productInList).to.not.be.undefined;
          expect(productInList.title).to.eq(product.title);
        });
        cy.log('Todos os produtos válidos foram adicionados com sucesso!');
      });
    });

  });

});
