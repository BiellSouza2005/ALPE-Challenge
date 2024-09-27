describe('API Test Case 1 - Registration completed successfully', () => {

    it('Register a product and verify that it was added correctly', () => {
      
      const produto = {
        title: "Produto A",
        price: 10,
        description: "Descrição do produto A",
        categoryId: 1,
        images: ["https://placeimg.com/640/480/any"]
      };
  
      // POST
      cy.request({
        method: 'POST',
        url: 'https://api.escuelajs.co/api/v1/products/', 
        body: produto
      }).then((response) => {
        
        expect(response.status).to.eq(201);
  
        expect(response.body.title).to.eq(produto.title);
        expect(response.body.price).to.eq(produto.price);
        expect(response.body.description).to.eq(produto.description);
  
        // Salve o ID do produto cadastrado
        const productId = response.body.id;
  
        // GET
        cy.request({
          method: 'GET',
          url: 'https://api.escuelajs.co/api/v1/products', 
        }).then((getResponse) => {
          
          expect(getResponse.status).to.eq(200);
  
          const produtoCadastrado = getResponse.body.find(p => p.id === productId);
  
          expect(produtoCadastrado).to.not.be.undefined;
  
          expect(produtoCadastrado.title).to.eq(produto.title);
          expect(produtoCadastrado.price).to.eq(produto.price);
          expect(produtoCadastrado.description).to.eq(produto.description);
        });
      });
    });
  
  });
  