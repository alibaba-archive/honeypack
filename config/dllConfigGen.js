const webpack = require('webpack');
const path = require('path');

const vendors = [
  'jquery',
  'react',
  'react-redux',
  'react-dom',
  'react-router',
  'react-router-redux',
  'redux',
  'redux-logger',
  'redux-thunk'
];

module.exports = (isMiddleware) => {
  return {
    context: path.join(process.cwd(), 'assets'),
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    output: {
      path: path.join(process.cwd(), 'assets', '.build'),
      filename: '[name].js',
      library: '[name]',
    },
    entry: {
      'build': vendors,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      new webpack.DllPlugin({
        path: isMiddleware ? path.join(process.cwd(), 'assets', '.build', 'manifest.json') : path.join(process.cwd(), '.build', 'manifest.json'),
        name: '[name]'
      })
    ],
  };
};
