const {REQUIRE_WITH_CAMEL_CASE} = require('../lib/consts');

function optimization(config) {
  return this.prompt([{
    type: 'confirm',
    name: 'optimization',
    message: 'Whether do you want to enable the splitChunks?',
    default: true,
    when: !config._skipAllQuestions
  }]).then((ans) => {
    config.deps['uglifyjs-webpack-plugin'] = REQUIRE_WITH_CAMEL_CASE;
    config.config.optimization = {
      minimizer: [
        `new UglifyjsWebpackPlugin({
          cache: path.join(__dirname, '.honeypack_cache/uglifyjs-webpack-plugin'),
          parallel: true
        })`
      ]
    };

    if (ans.optimization !== false) {
      config.config.optimization.splitChunks = {
        cacheGroups: {
          commons: {
            test: `module => /[\\\\/]node_modules[\\\\/]/.test(module.resource) && module.constructor.name !== 'CssModule'`,
            name: `'vendor'`,
            chunks: `'all'`
          }
        }
      };
    }

    return config;
  });
}

module.exports = optimization;
