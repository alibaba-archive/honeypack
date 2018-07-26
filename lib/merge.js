'use strict';
const _ = require('lodash');
const Control = require('./control');

function merge(...configs) {
  const last = configs[configs.length - 1];
  const hasControl = last instanceof Control;

  if (hasControl) {
    configs.pop();
  }

  return _.mergeWith({}, ...configs, wrap(hasControl ? last : new Control()));
}

function wrap(control) {
  /* eslint-disable no-unused-vars */
  const {dll, mergePlugin, mergeLoader} = control;

  return function strategy(objValue, srcValue, key, object, source, stack) {
    if (key === 'rules' && objValue) {  // case for module.rules
      const union = _.unionWith(objValue, srcValue, (obj, src) => {
        return String(obj.test) === String(src.test);  // union collection by [test]
      });
      return union.map((un) => {
        const src = _.find(srcValue, {test: un.test});  // find value in src
        return src ? merge(un, src, control) : un;  // found then merge
      });
    }

    if (key === 'use' && objValue) {  // case for rule.use
      const obj = (!objValue || Array.isArray(objValue)) ? objValue : [objValue];  // convert obj/string to array
      const src = (!srcValue || Array.isArray(srcValue)) ? srcValue : [srcValue];

      const union = _.unionWith(src, obj, (s, o) => {  // here need to reverse src & obj
        return compareLoader(getLoader(s), getLoader(o));
      });
      return union.map((un) => {
        // find value in obj
        const o = _.find(obj, (o) => {
          return compareLoader(getLoader(o), getLoader(un));
        });

        if (o) {
          // if un is a string, convert it to a object
          return typeof un === 'string' ? merge(o, {loader: un}, control) : merge(o, un, control);
        } else {
          return un;
        }
      });
    }

    if (key === 'plugins' && objValue && stack.size === 0) {  // case for plugins, stack.size === 0 means 1st level
      if (mergePlugin === 'uniq') {
        const diff = _.differenceWith(objValue, srcValue, (obj, src) => {
          return obj.constructor && src.constructor && obj.constructor.name === src.constructor.name;
        });
        return diff.concat(srcValue);
      } else if (mergePlugin === 'concat') {
        return objValue.concat(srcValue);
      } else if (mergePlugin === 'myown') {
        return srcValue;
      }
    }

    if (Array.isArray(objValue)) {
      return _.union(objValue, srcValue);
    }
  };
}

function getLoader(webpackUseEntry) {
  return typeof webpackUseEntry === 'string' ? webpackUseEntry : webpackUseEntry.loader;
}

function compareLoader(loaderA, loaderB) {
  const regex = /node_modules\/.*?([^/@]+)\//;
  const match1 = loaderA.match(regex);
  const match2 = loaderB.match(regex);

  if (match1 && match2) {
    return match1[1] === match2[1];
  }

  return loaderA === loaderB;
}

module.exports = merge;
