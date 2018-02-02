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

    if (unLoaders) {
      // 把unLoaders转为map
      const unLoadersMap = {};
      unLoaders.forEach(use => {
        unLoadersMap[use] = true;
      });
      config.module.rules = _.filter(module.rules, (loader) => {
        // 经过merge后，所有loader的use均为数组形式
        // 这里要遍历一个loader的所有use，过滤拿到新数组，如果在map中找到就不返回，如此得到的新数组
        return loader.use.filter(item => {
          if (typeof item === 'string') {
            return !unLoadersMap[item]
          } else {
            return !unLoadersMap[item.loader];
          }
        }).length;
        // 新的数组长度为0时，说明在use被unLoaders包含了，此loader可以踢掉。
      });
      delete config.unLoaders;
    }

    return config;
  }
};
