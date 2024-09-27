describe('API Test Case 4 - Registration Failed (Price sent as string)', () => {

    it('Register a product and verify that it was added correctly', () => {
      
      const produto = {
        title: "Produto A",
        price: "10",
        description: "Descrição do produto A",
        categoryId: 1,
        images: ["https://placeimg.com/640/480/any"]
      };
  
      
      cy.request({
        method: 'POST',
        url: 'https://api.escuelajs.co/api/v1/products/', 
        body: produto
      }).then((response) => {
        
        expect(response.status).to.eq(201);
  
        expect(response.body.title).to.eq(produto.title);
        expect(response.body.price).to.eq(produto.price);
        expect(response.body.description).to.eq(produto.description);
  
        const productId = response.body.id;
  
        // Search for new product in product list from Id
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
  