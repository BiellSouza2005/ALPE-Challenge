describe('API Test Case 1 - Registration completed successfully', () => {

    it('Register a product and verify that it was added correctly', () => {
      const apiUrl = Cypress.env('apiUrl'); 
      


      const produto = {
        title: "Produto A",
        price: 10,
        description: "Descrição do produto A",
        categoryId: 1,
        images: ["https://placeimg.com/640/480/any"]
      };
  
      
      cy.request({
        method: 'POST',
        url: `${apiUrl}`, 
        body: produto
      }).then((response) => {
        
        expect(response.status).to.eq(201);
  
        expect(response.body.title).to.eq(produto.title);
        expect(response.body.price).to.eq(produto.price);
        expect(response.body.description).to.eq(produto.description);
        
        //console.log(response.body);  //Uncomment to view product
        
        const productId = response.body.id;
  
        // Search for new product in product list from Id
        cy.request({
          method: 'GET',
          url: `${apiUrl}`, 
        }).then((getResponse) => {
          
          expect(getResponse.status).to.eq(200);
  
          const produtoCadastrado = getResponse.body.find(p => p.id === productId);
  
          expect(produtoCadastrado).to.not.be.undefined;
  
          expect(produtoCadastrado.title).to.eq(produto.title);
          expect(produtoCadastrado.price).to.eq(produto.price);
          expect(produtoCadastrado.description).to.eq(produto.description);
          
          cy.request({
            method: 'PUT',
            url: `${apiUrl}${productId}`, 
            body: 
            {
              title: "Produto B" 
            },
          }).then((putResponse) => {
              expect(putResponse.status).to.eq(200);
            
              cy.request({
                method: 'GET',
                url: `${apiUrl}`,
              }).then((newGetResponse) => {
                const produtoAlterado = newGetResponse.body.find(p => p.id === productId);
                
                expect(produtoAlterado).to.not.be.undefined;
                expect(produtoAlterado.title).to.eq("Produto B"); 
                
                cy.log("Título alterado e verificado com sucesso: " + produtoAlterado.title);
                //console.log(putResponse.body);  //Uncomment to view product
              });
            });
      });
    });
   });
});
  