const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    apiUrl: "https://api.escuelajs.co/api/v1/products/", // URL base da sua API
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
