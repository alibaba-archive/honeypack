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
    let {rules, unLoaders, module} = config;

    if(unLoaders){
      return _.omit(Object.assign({}, module, {
        rules: _.filter(rules, (loader) => {
          return !Array.includes.apply(unLoaders, loader.use);
        })
      }), 'unLoaders');
    }else{
      return config;
    }
  }
};
