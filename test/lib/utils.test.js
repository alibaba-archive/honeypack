const assert = require('power-assert');
const _ = require('lodash');
const webpack = require('webpack');
const merge = require('../../lib/merge');
const utils = require('../../lib/utils');

describe('lib/utils', () => {
  describe('# unPlugins', () => {
    it('should remove plugins which in unPlugins config', () => {
      const config = {
        plugins: [
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
          }),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor-[hash].min.js',
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              drop_console: false,
            }
          })
        ],
        unPlugins: [
          'DefinePlugin',
          'SomeOtherPlugin'
        ]
      };
      const result = utils.unPlugins(config);

      assert(Array.isArray(result.plugins));
      assert(result.plugins.length === 2);
      assert(config.plugins.length === 3);
      assert(result.unPlugins === undefined);
    });

    it('should not remove plugins when unPlugins does not exist', () => {
      const config = {
        plugins: [
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
          }),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor-[hash].min.js',
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              drop_console: false,
            }
          })
        ]
      };
      const result = utils.unPlugins(config);

      assert(Array.isArray(result.plugins));
      assert(result.plugins.length === 3);
      assert(config.plugins.length === 3);
      assert(result.unPlugins === undefined);
    });
  });
});
