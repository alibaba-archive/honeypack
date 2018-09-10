function optimization(config) {
  return this.prompt([{
    type: 'confirm',
    name: 'optimization',
    message: 'Whether do you want to enable the splitChunks?',
    default: true,
    when: !config._skipAllQuestions
  }]).then((ans) => {
    if (ans.optimization !== false) {
      config.config.optimization = {
        splitChunks: {
          cacheGroups: {
            commons: {
              test: `module => /[\\\\/]node_modules[\\\\/]/.test(module.resource) && module.constructor.name !== 'CssModule'`,
              name: `'vendor'`,
              chunks: `'all'`
            }
          }
        }
      };
    }

    return config;
  });
}

module.exports = optimization;
