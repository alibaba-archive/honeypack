const recast = require('recast');
const b = recast.types.builders;

const code = `
const config = {};

module.exports = config;
`;
const ast = recast.parse(code);

function traverse(any) {
  if (Array.isArray(any)) {
    return b.arrayExpression(any.map(a => traverse(a)));
  } else if (typeof any === 'object') {
    return b.objectExpression(Object.keys(any).map(key => b.property('init', b.identifier(key), traverse(any[key]))));
  } else if (typeof any === 'number') {
    return b.literal(any);
  } else if (typeof any === 'string') {
    return b.identifier(any);
  }
}

function transform(config = {}) {
  recast.visit(ast, {
    visitObjectExpression(path) {
      path.value.properties = traverse(config).properties;

      return false;
    }
  });

  return recast.print(ast).code;
}

module.exports = {
  transform
};
