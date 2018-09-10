function resolve(config) {
  config.config.resolve = {
    extensions: [`'.js'`, `'.jsx'`, `'.json'`]
  };

  return Promise.resolve(config);
}

module.exports = resolve;
