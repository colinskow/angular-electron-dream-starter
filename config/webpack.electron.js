const commonConfig = require('./webpack.common.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const helpers = require('./helpers');

/**
 * Webpack Plugins
 */
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const ElectronConnectWebpackPlugin = require('electron-connect-webpack-plugin');
const SpecifyTsFilesPlugin = require('./specify-ts-files-plugin');

/**
 * Webpack Constants
 */
const PROD = helpers.hasNpmFlag('prod');
const ENV = JSON.stringify(process.env.NODE_ENV = process.env.ENV = PROD? 'production' : 'development');
const HOST = JSON.stringify(process.env.HOST || 'localhost');
const PORT = process.env.PORT || 3000;

module.exports = function(options) {

  DEV_SERVER = options && options['live'] || false;
  const METADATA = {
    host: HOST,
    port: PORT,
    ENV: ENV,
    DEV_SERVER: DEV_SERVER
  };

  const entry = {
    'index': './src/main.electron.ts'
  };

  const otherFilesToCompile = [];

  const tsConfigBase = 'tsconfig.webpack.json';
  const customTsConfigFileName = 'tsconfig.main.temp.json';

  const atlConfig = {
    configFileName: customTsConfigFileName
  };

  return {
    name: "main",

    devtool: PROD ? 'source-map' : 'cheap-module-source-map',

    entry: entry,

    output: {
      path: DEV_SERVER ? helpers.root('dev') : helpers.root('dist'),
      filename: '[name].js',
      sourceMapFilename: '[file].map'
    },

    resolve: {
      extensions: ['.ts', '.js', 'json']
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader?' + JSON.stringify(atlConfig)
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ]
    },

    node: {
      __dirname: false,
      __filename: false
    },

    externals: [nodeExternals()],

    plugins: [
      PROD ? new NoEmitOnErrorsPlugin() : null,
      new webpack.DefinePlugin(METADATA),
      new CheckerPlugin(),
      new webpack.IgnorePlugin(new RegExp("^(spawn-sync|bufferutil|utf-8-validate)$")),
      new SpecifyTsFilesPlugin({
        root: helpers.root('.'),
        entry: entry,
        otherFilesToCompile: otherFilesToCompile,
        tsConfigBase: tsConfigBase,
        customTsConfigFileName: customTsConfigFileName
      }),
      
      PROD ? new UglifyJsPlugin({
        beautify: false, //prod
        output: {
          comments: false
        }, //prod
        mangle: {
          screw_ie8: true
        }, //prod
        compress: {
          screw_ie8: true,
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false // we need this for lazy v8
        },
      }) : null,
      DEV_SERVER ? new ElectronConnectWebpackPlugin({
        path: helpers.root('dev'),
        stopOnClose: true,
        logLevel: 0
      }) : null,
    ].filter(plugin => plugin !== null),

    target: "electron"
  };

}
