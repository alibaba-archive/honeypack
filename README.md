<h1 align="center">Honeypack</h1>

![](https://img.shields.io/npm/v/honeypack.svg)

Honeypack is a combination of webpack-dev-server and webpack-dev-middleware, which provides full featured and scalable configuration to bundle assets.

<h2 align="center">Install</h2>

```
npm i honeypack --save-dev
```

<h2 align="center">Migration from v0.x</h2>

Please read our documentation on [migration](migration.md).

<h2 align="center">Usage</h2>

### CLI

```
honeypack --help

>

  Usage: honeypack [options]
         honeypack <command> [options]

  Options:

    -v, --version        output the version number
    -h, --help           output usage information

  Commands:

    init [options]
    run|start [options]
    build [options]
```

#### Create new apps

```
honeypack init

>

  Usage: init [options]

  Options:

    -o, --output <name>  The config file name
    --default            Skip questions, create the config file directly
    -h, --help           output usage information
```

#### Start as a dev server

```
honeypack run|start

>

  Usage: run|start [options]

  Options:

    -c, --config <path>  Path to the config file, defaults to webpack.config.js
    -h, --host <host>    The host to listen on, defaults to localhost
    -p, --port <port>    The port to listen on, defaults to 8000
    -h, --help           output usage information
```

#### Build the app for production

```
honeypack build

>

  Usage: build [options]

  Options:

    -c, --config <path>  Path to the config file, defaults to webpack.config.js
    -h, --help           output usage information
```

### API

#### Middleware

```
const honeypack = require('honeypack');
const express = require('express');
const app = express();

app.use(honeypack({
  config: 'webpack.config.js',
  root: './assets'
}));
```

+ config: the webpack config filename

+ root: the directory contains your frontend assets
