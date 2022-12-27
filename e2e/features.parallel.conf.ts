import _ from 'lodash';
import glob from 'glob';
import { browser, Config } from 'protractor';
import { argv } from 'yargs';
import { retry } from 'protractor-retry';
import { getTestCasesFromFilesystem, PickleFilter } from 'cucumber';
import { EventEmitter } from 'events';
import puppeteer from 'puppeteer';
import serviceConfig from 'config';
import path from 'path';

import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('features.parallel.conf');

const eventBroadcaster = new EventEmitter();

const proxyUrl: string = serviceConfig.get('proxy.url');
const useProxy = Boolean(JSON.parse(serviceConfig.get('proxy.use')));
const useHeadlessBrowser = Boolean(JSON.parse(serviceConfig.get('protractor.UseHeadlessBrowser')));
const maxInstances: number = Math.max(serviceConfig.get('protractor.RunWithNumberOfBrowsers'), 1);
const ccdWebUrl: string = serviceConfig.get('ccd.webUrl');
const failFast = Boolean(JSON.parse(serviceConfig.get('protractor.FailFast')));
const testAnnotation: string = serviceConfig.get('protractor.testAnnotation');
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

const cucumberOpts = {
  format: ['node_modules/cucumber-pretty', 'json:reports/tests/functionTestResult.json'],
  require: ['./cucumber.conf.js', './features/step_definitions/*.steps.js', './support/hooks.js'],
  keepAlive: false,
  tags: false,
  profile: false,
  'fail-fast': failFast,
  'nightly-tag': testAnnotation,
  'no-source': true,
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

/*
 * Returns all feature files that match pattern
 */
function getFeatures(): any {
  const filesGlob = 'e2e/features/**/*.feature';
  const files = glob.sync(filesGlob);
  return _.sortedUniq(files);
}

function getCucumberCliTags(): any {
  const cucumberOptsTags = _.get(argv, 'cucumberOpts.tags');
  if (typeof cucumberOptsTags === 'string' || cucumberOptsTags instanceof String) {
    logger.info(`cucumber opts tags : ${cucumberOptsTags}`);
    return cucumberOptsTags;
  }
  logger.info(`cucumber opts tags : ${cucumberOptsTags}`);
  return cucumberOptsTags.join(' or ') || '';
}

/*
 * Use cucumber built in methods
 * to filter features based on expression
 */
function getFeaturesByTagExpression(): any {
  return getTestCasesFromFilesystem({
    cwd: '',
    eventBroadcaster,
    featurePaths: getFeatures(),
    pickleFilter: new PickleFilter({
      tagExpression: getCucumberCliTags(),
    }),
    order: 'defined',
  }).then(function (results) {
    const features = [];
    const scenarios = [];
    _.forEach(results, function (result) {
      if (argv.parallelFeatures) {
        features.push(result.uri);
      } else {
        const lineNumber = result.pickle.locations[0].line;
        const uri = result.uri;
        const scenario = `${uri}:${lineNumber}`;
        scenarios.push(scenario);
      }
    });

    return {
      features: _.sortedUniq(features),
      scenarios,
    };
  });
}

function getMultiCapabilities() {
  return getFeaturesByTagExpression().then((results) => {
    let files = null;
    logger.info(`List of tests to run : ${JSON.stringify(results, null, 2)}`);
    if (argv.parallelFeatures) {
      files = results.features;
    } else {
      files = results.scenarios;
    }
    // eslint-disable-next-line no-unused-vars
    return _.map(files, function (file, i) {
      const featureFile = file.replace(/^e2e/, '.');
      const config = {
        specs: featureFile,
        shardTestFiles: true,
        maxInstances: 1,
      };
      return _.merge(config, capabilities);
    });
  });
}

function onCleanUp(results): void {
  retry.onCleanUp(results);
}

async function onPrepare(): Promise<void> {
  // returning the promise makes protractor wait for
  // the reporter config before executing tests
  await browser.getProcessedConfig();

  retry.onPrepare();
}

function afterLaunch(): any {
  return retry.afterLaunch(retries);
}

function getConfig(): Config {
  const config: Config = {
    baseUrl: ccdWebUrl,
    maxSessions: null,
    getMultiCapabilities: null,
    specs: null,
    capabilities: null,
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
    afterLaunch,
  };

  logger.info(`argv.parallelFeatures: ${argv.parallelFeatures}, argv.parallelScenarios ${argv.parallelScenarios}`);
  if (argv.parallelFeatures || argv.parallelScenarios) {
    logger.info(`parallel enabled`);
    config.maxSessions = maxInstances;
    config.getMultiCapabilities = getMultiCapabilities;
  } else {
    logger.info(`parallel disabled`);
    config.specs = [featuresPath];
    config.capabilities = capabilities;
  }

  logger.info(JSON.stringify(config, null, 2));
  return config;
}

export const config = getConfig();
