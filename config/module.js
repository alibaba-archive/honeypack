const {PACKAGE_JSON_ONLY, REQUIRE_WITH_CAMEL_CASE} = require('../lib/consts');

function iModule(config) {
  const deps = [];
  const rules = [];

  /* js/jsx */
  deps.push(
    'babel-core',
    'babel-loader@7',
    'babel-preset-env',
    'babel-preset-react',
    'babel-plugin-add-module-exports',
    'babel-plugin-transform-class-properties',
    'babel-plugin-transform-decorators-legacy',
    'babel-plugin-transform-object-rest-spread'
  );
  rules.push({
    test: `${new RegExp(/\.(js|jsx)$/)}`,
    exclude: `${new RegExp(/(node_modules|bower_components)/)}`,
    use: {
      loader: `'babel-loader'`,
      options: {
        cacheDirectory: `path.join(__dirname, '.honeypack_cache/babel-loader')`,
        presets: [`'env'`, `'react'`],
        plugins: [
          `'add-module-exports'`,
          `'transform-decorators-legacy'`,
          `'transform-class-properties'`,
          `'transform-object-rest-spread'`
        ]
      }
    }
  });

  deps.push('file-loader');
  /* images */
  rules.push({
    test: `${new RegExp(/\.(png|jpg|gif|svg)$/)}`,
    use: {
      loader: `'file-loader'`,
      options: {
        name: `'[name].[ext]'`,
        outputPath: `'images/'`
      }
    }
  });

  /* fonts */
  rules.push({
    test: `${new RegExp(/\.(woff|woff2|eot|ttf|otf)$/)}`,
    use: {
      loader: `'file-loader'`,
      options: {
        name: `'[name].[ext]'`,
        outputPath: `'fonts/'`
      }
    }
  });

  return this.prompt([{
    type: 'list',
    name: 'css',
    message: 'Will you use one of the below CSS solutions?',
    choices: [
      'LESS',
      'SASS',
      'CSS'
    ],
    when: !config._skipAllQuestions
  }]).then(ans => {
    let test;
    const loaders = [
      {
        loader: 'MiniCssExtractPlugin.loader'
      }
    ];

    switch (ans.css || 'LESS') {
      case 'LESS':
        test = /\.(less|css)$/;
        loaders.push({
          loader: `'css-loader'`
        }, {
          loader: `'less-loader'`,
          options: {
            javascriptEnabled: `true`
          }
        });
        deps.push('less', 'less-loader');
        break;
      case 'SASS':
        test = /\.(sass|css)$/;
        loaders.push({
          loader: `'css-loader'`
        }, {
          loader: `'sass-loader'`
        });
        deps.push('node-sass', 'sass-loader');
        break;
      case 'CSS':
        test = /\.css$/;
        loaders.push({
          loader: `'css-loader'`
        });
        break;
      default:
        // no op
    }

    deps.push('css-loader');
    rules.push({
      test: `${new RegExp(test)}`,
      use: loaders
    });
  }).then(() => {
    deps.forEach(dep => config.deps[dep] = PACKAGE_JSON_ONLY);
    config.deps['mini-css-extract-plugin'] = REQUIRE_WITH_CAMEL_CASE;
    config.config.module = {
      rules: []
    };
    config.config.module.rules.push(...rules);
    config.config.plugins = [];
    config.config.plugins.push(`
      new MiniCssExtractPlugin({
        filename: '[name].css'
      })
    `);

    return config;
  });
}

module.exports = iModule;
