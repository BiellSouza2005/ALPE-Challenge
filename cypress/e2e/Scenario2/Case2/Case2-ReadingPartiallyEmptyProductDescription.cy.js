describe('API Test Scenario 2 Case 2 - Reading product description for Produto Z', () => {

  it('Registers multiple products and verifies that they were added correctly', () => {
    const apiUrl = Cypress.env('apiUrl'); 

    // Insert all products and check if they were added correctly
    cy.fixture('Scenario2/Case2/products.json').then((products) => {
      
      products.forEach((product) => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}`, 
          body: product
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.title).to.eq(product.title);
          expect(response.body.price).to.eq(product.price);

          //If you want to test if all descriptions are OK
          const description = response.body.description.trim();
          if (description === "") {
            cy.log(`A descrição do produto "${product.title}" está vazia ou contém apenas espaços.`);
          } else {
            cy.log(`Descrição do produto "${product.title}" está OK: "${response.body.description}"`);
          }
        });
      });
    });

    //After activating all products, check the description of product Z
    cy.request({
      method: 'GET',
      url: `${apiUrl}`, 
    }).then((getAllResponse) => {
      expect(getAllResponse.status).to.eq(200);
      
      cy.fixture('Scenario2/Case2/products.json').then((products) => {
        const produtoZ = products.find(p => p.title === "Produto Z");
        expect(produtoZ).to.not.be.undefined;

        const productInList = getAllResponse.body.find(p => p.title === "Produto Z");
        expect(productInList).to.not.be.undefined;

        expect(productInList.description).to.eq(produtoZ.description);
        cy.log(`Descrição do Produto Z: ${productInList.description}`);

        const descriptionZ = productInList.description.trim();
        if (descriptionZ === "") {
          cy.log(`A descrição do Produto Z está vazia ou contém apenas espaços.`);
        } else {
          cy.log(`Descrição do Produto Z está OK: "${productInList.description}"`);
        }
      });
    });
  });
});
