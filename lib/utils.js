'use strict';
const _ = require('lodash');

module.exports = {
  unPlugins(config) {
    let {plugins, unPlugins} = config;

    unPlugins = unPlugins || [];

    return _.omit(Object.assign({}, config, {
      plugins: _.filter(plugins, (plugin) => {
        return !unPlugins.includes(plugin.constructor.name);
      })
    }), 'unPlugins');
  },
  unLoaders(config) {
    let {unLoaders, module} = config;

    if(unLoaders){
      config.module = _.omit(Object.assign({}, module, {
        rules: _.filter(module.rules, (loader) => {
          return !Array.prototype.includes.apply(unLoaders, loader.use);
        })
      }));
      delete config.unLoaders;
    }

    return config;
  }
};
