import { browser, Config } from 'protractor';
import { retry } from 'protractor-retry';
import puppeteer from 'puppeteer';
import serviceConfig from 'config';
import path from 'path';

import { Logger } from '@hmcts/nodejs-logging';
import { IParsedArgvOptions } from '@cucumber/cucumber/lib/cli/argv_parser';

const logger = Logger.getLogger('features.parallel.conf');

const proxyUrl: string = serviceConfig.get('proxy.url');
const useProxy = Boolean(JSON.parse(serviceConfig.get('proxy.use')));
const useHeadlessBrowser = Boolean(JSON.parse(serviceConfig.get('protractor.UseHeadlessBrowser')));
const maxInstances: number = Math.max(serviceConfig.get('protractor.RunWithNumberOfBrowsers'), 1);
const ccdWebUrl: string = serviceConfig.get('ccd.webUrl');
// const failFast = Boolean(JSON.parse(serviceConfig.get('protractor.FailFast')));
const retries: number = Math.max(serviceConfig.get('protractor.testRetries'), 0);

const loggingDriver = serviceConfig.get('logging.driver');
const loggingBrowser = serviceConfig.get('logging.driver');

let proxy: { httpProxy: string; proxyType: string; sslProxy: string } = null;
if (useProxy) {
  const proxyBase = proxyUrl.replace('http://', '');
  proxy = {
    proxyType: 'manual',
    httpProxy: proxyBase,
    sslProxy: proxyBase,
  };
}

const featuresPath = path.resolve(process.cwd(), 'e2e/features/*.feature');

const capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: [
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-sandbox',
      useHeadlessBrowser ? '--headless' : '--noop',
      useHeadlessBrowser ? '--window-size=1920,1080' : '--noop',
    ],
    binary: puppeteer.executablePath(),
  },
  acceptInsecureCerts: true,
  maxInstances,
  proxy,
  loggingPrefs: {
    driver: loggingDriver,
    browser: loggingBrowser,
  },
  shardTestFiles: maxInstances > 1,
};

const cucumberOpts: IParsedArgvOptions = <IParsedArgvOptions>{
  format: ['@cucumber/pretty-formatter', 'json:reports/tests/functionTestResult.json'],
  require: ['./cucumber.conf.js', './features/step_definitions/*.steps.js', './support/hooks.js'],
  backtrace: true,
  // failFast,
  retry: retries,
};

const plugins = [
  {
    package: 'protractor-multiple-cucumber-html-reporter-plugin',
    options: {
      automaticallyGenerateReport: true,
      removeExistingJsonReportFile: true,
      reportName: 'SSCS CCD E2E Tests',
      jsonDir: 'reports/tests/functional',
      reportPath: 'reports/tests/functional',
      saveCollectedJSON: true,
    },
  },
];

const frameworkPath = require.resolve('protractor-cucumber-framework');

function onCleanUp(results): void {
  retry.onCleanUp(results);
}

async function onPrepare(): Promise<void> {
  // returning the promise makes protractor wait for
  // the reporter config before executing tests
  await browser.getProcessedConfig();

  retry.onPrepare();
}

// function afterLaunch(): any {
//   return retry.afterLaunch(retries);
// }

export const config: Config = {
  baseUrl: ccdWebUrl,
  maxSessions: null,
  getMultiCapabilities: null,
  specs: [featuresPath],
  capabilities,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  disableChecks: true,
  ignoreUncaughtExceptions: true,
  directConnect: true,
  useAllAngular2AppRoots: true,
  // this causes issues with test failing
  // so do not enable it unless all tests pass
  // on a variety of environments first :)
  restartBrowserBetweenTests: false,
  framework: 'custom',
  frameworkPath,
  cucumberOpts,
  plugins,
  onCleanUp,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onPrepare,
  // afterLaunch: retries > 0 ? afterLaunch : null,
};

logger.info(JSON.stringify(config, null, 2));
