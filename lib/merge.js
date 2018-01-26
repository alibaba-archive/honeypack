'use strict';
const _ = require('lodash');

function merge(...configs) {
  return _.mergeWith({}, ...configs, strategy);
}

function strategy(objValue, srcValue, key, object, source, stack) {
  if (key === 'rules' && objValue) {  // case for module.rules
    const union = _.unionWith(objValue, srcValue, (obj, src) => {
      return String(obj.test) === String(src.test);  // union collection by [test]
    });
    return union.map((un) => {
      const src = _.find(srcValue, {test: un.test});  // find value in src
      return src ? merge(un, src) : un;  // found then merge
    });
  }

  if (key === 'use' && objValue) {  // case for rule.use
    const obj = (!objValue || Array.isArray(objValue)) ? objValue : [objValue];  // convert obj/string to array
    const src = (!srcValue || Array.isArray(srcValue)) ? srcValue : [srcValue];

    const union = _.unionWith(obj, src, (o, s) => {
      return getLoader(o) === getLoader(s);
    });
    return union.map((un) => {
      // find value in src, if src is a string, ignore
      const s = _.find(src, {loader: getLoader(un)});

      if (s) {
        // if un is a string, convert it to a object
        return typeof un === 'string' ? merge({loader: un}, s) : merge(un, s);
      } else {
        return un;
      }
    });
  }

  if (key === 'plugins' && objValue && stack.size === 0) {  // case for plugins, stack.size === 0 means 1st level
    const diff = _.differenceWith(objValue, srcValue, (obj, src) => {
      return obj.constructor && src.constructor && obj.constructor.name === src.constructor.name;
    });
    return diff.concat(srcValue);
  }

  if (Array.isArray(objValue)) {
    return _.union(objValue, srcValue);
  }
}

function getLoader(webpackUseEntry) {
  return typeof webpackUseEntry === 'string' ? webpackUseEntry : webpackUseEntry.loader;
}

module.exports = merge;
