<h1 align="center">Honeypack</h1>

Honeypack is a combination of webpack-dev-server and webpack-dev-middleware, which provides full featured and scalable configuration to bundle assets.

<h2 align="center">Install</h2>

```
npm i honeypack --save [-g]
```

> With -g, honeypack will be installed globally.

<h2 align="center">Usage</h2>

### CLI (globally)

```
hoenypack

>


Usage: honeypack [options] [command]


Options:

  -V, --version  output the version number
  -h, --help     output usage information


Commands:

  start       Start a dev server
  build       Build the app for production
  help [cmd]  display help for [cmd]
```

#### Start as a dev server

```
hoenypack start

>

Usage: honeypack-start [options]


Options:

  -p, --port [port]      Specify a port number to listen on
  -c, --config [config]  Path to the app config file, default is webpack.config.js
  -h, --help             output usage information
```

#### Build the app for production

```
hoenypack build

>

Usage: honeypack-build [options]


Options:

  -c, --config [config]  Path to the app config file, default is webpack.config.js
  -h, --help             output usage information
```

### Middleware (locally)

```
// config.js

middleware: {
  hoenypack: {
    enable: true,
    module: 'hoenypack',
    config: {
      root: './assets'
    }
  }
}
```

+ config

  + `root`: relative path to assets directory

<h2 align="center">App's webpack config</h2>

Honeypack will automaticly merge app's webpack config if there is a `webpack.config.js` in your project into default webpack config.

+ path to `webpack.config.js`
  + Cli mode: current working directory
  + Middleware mode: assets directory

<h2 align="center">Bundle Analysis</h2>

### Install

```
npm install --save-dev webpack-bundle-analyzer
```

### Usage

```
// webpack.config.js

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### Run as usual

Webpack Bundle Analyzer will start at http://127.0.0.1:8888
