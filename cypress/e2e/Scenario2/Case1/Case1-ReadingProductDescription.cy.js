describe('API Test Scenario 2 Case 1 - Reading product description', () => {

  it('Registers multiple products and verifies that they were added correctly', () => {
    const apiUrl = Cypress.env('apiUrl'); 

    // Insert the products and check if they were added correctly
    cy.fixture('Scenario2/Case1/products.json').then((products) => {
      
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
        });
      });
    });

    //Look at all products and compare if there is product A equal to the json
    cy.request({
      method: 'GET',
      url: `${apiUrl}`, 
    }).then((getAllResponse) => {
      expect(getAllResponse.status).to.eq(200);
      
      cy.fixture('Scenario2/Case1/products.json').then((products) => {
        const productA = products.find(p => p.title === "Produto A");
        expect(productA).to.not.be.undefined;

        const productInList = getAllResponse.body.find(p => p.title === "Produto A");
        expect(productInList).to.not.be.undefined;

        if(expect(productInList.description).to.eq(productA.description)) 
        {
          cy.log(`Descrição do Produto A: ${productInList.description}`);
          cy.log("Descrição visualizada com sucesso!")
        }
        
      });
    });
  });
});
