const assert = require('power-assert');
const _ = require('lodash');
const webpack = require('webpack');
const merge = require('../../lib/merge');
const Control = require('../../lib/control');

describe('lib/merge', () => {
  describe('#merge', () => {
    it('should merge entry properly', () => {
      const config1 = {
        entry: {
          app: 'common.js',
          vendor: ['a', 'b']
        }
      };
      const config2 = {
        entry: {
          app: 'dev.js',
          vendor: ['b', 'c']
        }
      };
      const result = merge(config1, config2);
      assert(typeof result === 'object');
      assert(typeof result.entry === 'object');
      assert(result.entry.app === 'dev.js');
      assert(_.isEqual(result.entry.vendor, ['a', 'b', 'c']));
    });

    it('should merge module.rules via [test] properly', () => {
      const config1 = {
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /(node_modules)/
            }
          ]
        }
      };
      const config2 = {
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /(node_modules|bower_components)/
            }
          ]
        }
      };
      const result = merge(config1, config2);
      assert(typeof result === 'object');
      assert(typeof result.module === 'object');
      assert(Array.isArray(result.module.rules));
      assert(_.isEqual(result.module.rules, [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/
        }
      ]));
    });

    it('should merge module.rules.use via [loader] properly', () => {
      const config1 = {
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['env'],
                  plugins: ['a', 'b']
                }
              }
            }
          ]
        }
      };
      const config2 = {
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              use: [
                'test-loader',
                {
                  loader: 'babel-loader',
                  options: {
                    presets: ['env', 'react'],
                    plugins: ['b', 'c']
                  }
                }
              ]
            }
          ]
        }
      };
      const result = merge(config1, config2);
      assert(typeof result === 'object');
      assert(typeof result.module === 'object');
      assert(Array.isArray(result.module.rules));
      assert(_.isEqual(result.module.rules, [
        {
          test: /\.(js|jsx)$/,
          use: [
            'test-loader',
            {
              loader: 'babel-loader',
              options: {
                presets: ['env', 'react'],
                plugins: ['a', 'b', 'c']
              }
            }
          ]
        }
      ]));
    });

    it('should merge module.rules.use with node_modules', () => {
      const config1 = {
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              use: {
                loader: '/path/to/node_modules/babel-loader/fun.js',
                options: {
                  presets: ['env'],
                  plugins: ['a', 'b']
                }
              }
            }
          ]
        }
      };
      const config2 = {
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              use: [
                'test-loader',
                {
                  loader: '/path/to/node_modules/_foo@3.3.3@babel-loader/fun.js',
                  options: {
                    presets: ['env', 'react'],
                    plugins: ['b', 'c']
                  }
                }
              ]
            }
          ]
        }
      };
      const result = merge(config1, config2);
      assert(typeof result === 'object');
      assert(typeof result.module === 'object');
      assert(Array.isArray(result.module.rules));
      assert(_.isEqual(result.module.rules, [
        {
          test: /\.(js|jsx)$/,
          use: [
            'test-loader',
            {
              loader: '/path/to/node_modules/_foo@3.3.3@babel-loader/fun.js',
              options: {
                presets: ['env', 'react'],
                plugins: ['a', 'b', 'c']
              }
            }
          ]
        }
      ]));
    });

    it('should merge plugin via plugin constructor name properly', () => {
      const config1 = {
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
      const config2 = {
        plugins: [
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"test"',
          })
        ]
      };
      const result = merge(config1, config2);
      assert(typeof result === 'object');
      assert(Array.isArray(result.plugins));
      assert(result.plugins.length === 4);
      assert(result.plugins[3].definitions['process.env.NODE_ENV'] === '"test"');
    });

    it('should merge empty config properly', () => {
      const config1 = {
        entry: {
          app: 'common.js',
          vendor: ['a', 'b']
        },
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /(node_modules)/,
              use: [
                'test-loader',
                {
                  loader: 'babel-loader',
                  options: {
                    presets: ['env', 'react']
                  }
                }
              ]
            }
          ]
        },
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
      const config2 = {

      };
      const result = merge(config1, config2);
      assert(typeof result === 'object');
      assert(typeof result.entry === 'object');
      assert(result.entry.app === 'common.js');
      assert(typeof result.module === 'object');
      assert(Array.isArray(result.module.rules));
      assert(_.isEqual(result.module.rules, [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          use: [
            'test-loader',
            {
              loader: 'babel-loader',
              options: {
                presets: ['env', 'react']
              }
            }
          ]
        }
      ]));
      assert(Array.isArray(result.plugins));
      assert(result.plugins.length === 3);
    });

    it('should merge plugin using strategy concat', () => {
      const config1 = {
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
      const config2 = {
        plugins: [
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"test"',
          })
        ]
      };
      const result = merge(config1, config2, new Control({mergePlugin: 'concat'}));
      assert(typeof result === 'object');
      assert(Array.isArray(result.plugins));
      assert(result.plugins.length === 5);
      assert(result.plugins[0].definitions['process.env.NODE_ENV'] === '"production"');
      assert(result.plugins[4].definitions['process.env.NODE_ENV'] === '"test"');
    });

    it('should merge plugin using strategy myown', () => {
      const config1 = {
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
      const config2 = {
        plugins: [
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"test"',
          })
        ]
      };
      const result = merge(config1, config2, new Control({mergePlugin: 'myown'}));
      assert(typeof result === 'object');
      assert(Array.isArray(result.plugins));
      assert(result.plugins.length === 2);
      assert(result.plugins[1].definitions['process.env.NODE_ENV'] === '"test"');
    });
  });
});
