const path = require('path');

const config = {
  context: __dirname,
  entry: path.join(__dirname, './index.js'),
  output: {
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }      
    ]
  }
}

module.exports = config;