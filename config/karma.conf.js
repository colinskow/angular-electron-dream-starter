/**
 * @author: @AngularClass
 */

const autowatched = process.env.npm_lifecycle_script.indexOf('--auto-watch') !== -1;

module.exports = function (config) {
  var grep = require('karma-webpack-grep');
  var testWebpackConfig = require('./webpack.test.js')({ env: 'test' });
  var electronflags = autowatched ? ['--show'] : []; // when we want to debug show an instance of electron  
  // for debugging with Visual Studio Code replace ['--show'] above with ['--show',  '--remote-debugging-port=9333', 'debug: true' ]

  testWebpackConfig.plugins = (testWebpackConfig.plugins || []).concat(grep({
    grep: config.grep,
    basePath: '', // same as basePath
    testContext: '../src' // same as require.context line in spec-bundle.js
  }));

  var configuration = {

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',

    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [],

    client: {
      captureConsole: autowatched ? true : false,
      useIframe: false
    },

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [
      { pattern: './config/spec-bundle.js', watched: false },
      { pattern: './src/assets/**/*', watched: false, included: false, served: true, nocache: false }
    ],

    /*
     * By default all assets are served at http://localhost:[PORT]/base/
     */
    proxies: {
      "/assets/": "/base/src/assets/"
    },

    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: { './config/spec-bundle.js': autowatched ? ['webpack', 'electron', 'sourcemap'] : ['coverage', 'webpack', 'electron', 'sourcemap'] },

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,

    // Webpack please don't spam the console when running in karma!
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i.e.
      noInfo: true,
      // and use stats to turn off verbose output
      stats: {
        // options i.e. 
        chunks: false
      }
    },

    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: autowatched ? config.LOG_INFO : config.LOG_WARN,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    /*
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     *
     */
    // Port config for VSCode debugging purpose
    browsers: ['ElectronDebugging'],
    customLaunchers: {
      ElectronDebugging: {
        base: 'Electron',
        flags: electronflags
        ,
      },
    },
    /*
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: true
  };

  // skip coverage in watch mode so source maps can be used for debugging
  if (!autowatched) {
    configuration.reporters.push('coverage');
    configuration.coverageReporter = {
      type: 'in-memory'
    };
    configuration.reporters.push('remap-coverage');
    configuration.remapCoverageReporter = {
      'text-summary': null,
      json: './coverage/coverage.json',
      html: './coverage/html'
    };
  } else {
    // show console.log messages when debugging
    configuration.browserConsoleLogOptions = {
      level: 'log',
      terminal: true
    };

  }

  config.set(configuration);
};
