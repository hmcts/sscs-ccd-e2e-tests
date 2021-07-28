/* eslint-disable no-negated-condition, multiline-ternary */

const puppeteer = require('puppeteer');
const serviceConfig = require('./service.conf');
const tsNode = require('ts-node');
const path = require('path');

exports.config = {

  baseUrl: serviceConfig.CcdWebUrl,
  specs: ['./features/*.feature'],
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-sandbox',
        serviceConfig.UseHeadlessBrowser ? '--headless' : '--noop',
        serviceConfig.UseHeadlessBrowser ? '--window-size=1920,1080' : '--noop'
      ],
      binary: puppeteer.executablePath()
    },
    acceptInsecureCerts: true,
    maxInstances: 8,
    proxy: (!serviceConfig.UseProxy) ? null : {
      proxyType: 'manual',
      httpProxy: serviceConfig.ProxyUrl.replace('http://', ''),
      sslProxy: serviceConfig.ProxyUrl.replace('http://', '')
    },
    loggingPrefs: {
      driver: 'INFO',
      browser: 'INFO'
    }
  },

  directConnect: true,
  useAllAngular2AppRoots: true,

  // this causes issues with test failing
  // so do not enable it unless all tests pass
  // on a variety of environments first :)
  restartBrowserBetweenTests: false,

  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  cucumberOpts: {
    require: [
      './cucumber.conf.js',
      './features/step_definitions/**/*.steps.ts'
    ],
    tags: false,
    profile: false,
    'no-source': true
  },

  onPrepare() {
    // returning the promise makes protractor wait for
    // the reporter config before executing tests
    global
      .browser
      .getProcessedConfig()
      .then({
        // noop
      });
    
    tsNode.register({
      project: path.join(__dirname, './tsconfig.e2e.json')
    });
  }
};
