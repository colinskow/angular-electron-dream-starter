/* From: https://github.com/chentsulin/electron-react-boilerplate/blob/master/server.js */
/**
 * Setup and run the development server for Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const WriteFilePlugin = require('write-file-webpack-plugin');
const spawn = require('child_process').spawn;
const helpers = require('./helpers');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const config = require('./webpack.dev')({ HMR: true });
config.entry.hmr = `webpack-hot-middleware/client?path=http://${HOST}:${PORT}/__webpack_hmr`;
config.devServer = config.devServer || {};
config.devServer.outputPath = config.output.path = helpers.root('dev');

config.plugins.push(
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new WriteFilePlugin({log: false})
);

const app = express();
const compiler = webpack(config);

const wdm = webpackDevMiddleware(compiler, {
  publicPath: '/',
  watchOptions: {
    aggregateTimeout: 300,
    poll: false
  },
  stats: {
    colors: true
  }
});

app.use(wdm);
app.use(webpackHotMiddleware(compiler));

const server = app.listen(PORT, 'localhost', serverError => {
  if (serverError) {
    return console.error(serverError);
  }

  // Launch Electron after the initial compile is complete
  let started = false;
  compiler.plugin('done', () => {
    if(started) {
      return;
    }
    spawn('npm', ['run', 'start:main:dev'], { shell: true, env: process.env, stdio: 'inherit' })
      .on('close', code => process.exit(code))
      .on('error', spawnError => console.error(spawnError));
    started = true;
  });

  console.log('Listening at http://localhost:' + PORT);
});

process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  wdm.close();
  server.close(() => {
    process.exit(0);
  });
});
