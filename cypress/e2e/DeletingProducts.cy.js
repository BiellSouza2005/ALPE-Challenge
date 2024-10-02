describe('API Test Scenario - Deleting specific products', () => {
    it('Deletes products from "Produto A" to "Produto J" and "Produto Z"', () => {
      const apiUrl = Cypress.env('apiUrl'); 
  
      cy.request({
        method: 'GET',
        url: `${apiUrl}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        const productsInAPI = response.body;
  
        const productsToDelete = [];
        for (let i = 65; i <= 74; i++) { // ASCII A(65) to J(74)
          productsToDelete.push(`Produto ${String.fromCharCode(i)}`);
        }
        productsToDelete.push("Produto Z");
  
        productsInAPI.forEach((product) => {
          if (productsToDelete.includes(product.title)) {
            cy.request({
              method: 'DELETE',
              url: `${apiUrl}${product.id}`, 
            }).then((deleteResponse) => {
              expect(deleteResponse.status).to.eq(200);
              cy.log(`Produto "${product.title}" deletado com sucesso.`);
            });
          }
        });
      });
    });
  });
  