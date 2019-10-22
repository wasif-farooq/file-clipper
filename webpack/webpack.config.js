const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: '../src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'file-clipper.js'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  }
  //externals: [nodeExternals()],
}