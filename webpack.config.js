const path = require('path');
module.exports = {
    mode: "production",
    entry: "./src",
    output: {
      path: path.resolve(__dirname, "www/js/"),
      filename: "main.js",
      library: {
        name: 'cap',
        type: 'var',
      }
    }
  };