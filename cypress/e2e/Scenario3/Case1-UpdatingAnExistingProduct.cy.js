describe('API Test Scenario 3 Case 1 - Updating an existing product', () => {

  it('Registers multiple products, retrieves them, and updates only "Produto A"', () => {
    const apiUrl = Cypress.env('apiUrl');

    cy.fixture('Scenario3/Case1/products.json').then((products) => {
      
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

      // // After all products are added, take product A and swap it to product B and check
      cy.request({
        method: 'GET',
        url: `${apiUrl}`,
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        const productA = getResponse.body.find(p => p.title === "Produto A");

        if (productA) {
          cy.log('Produto A encontrado, iniciando atualização...');
          cy.request({
            method: 'PUT',
            url: `${apiUrl}${productA.id}`,
            body: {
              title: "Produto B"
            },
          }).then((putResponse) => {
            expect(putResponse.status).to.eq(200);

            cy.request({
              method: 'GET',
              url: `${apiUrl}`,
            }).then((newGetResponse) => {
              const alteredProduct = newGetResponse.body.find(p => p.id === productA.id);

              expect(alteredProduct).to.not.be.undefined;
              expect(alteredProduct.title).to.eq("Produto B");

              cy.log("Título de 'Produto A' alterado para: " + alteredProduct.title);
            });
          });
        } else {
          cy.log('Produto A não foi encontrado.');
        }
      });
    });
  });

});
