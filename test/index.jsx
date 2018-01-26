'use strict';

import a from './a.js';
import b from './b.js';
import c from './c.js';
const React = require('react');
const ReactDOM = require('react-dom');

require("./a.css");
require("./a.less");
require("./a.scss");

console.log("helloworld");


() => {let a;}

ReactDOM.render(
  <h1>1Hello, world!</h1>,
  document.getElementById('example')
);