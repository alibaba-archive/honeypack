// notice: this is a wrong webpack sample
const path = require('path');

const config = {
  context: __dirname,
  // index.jsx not exsit
  entry: path.join(__dirname, './index.jsx'),
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
};

module.exports = config;
