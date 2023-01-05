import { browser, Config } from 'protractor';
import { multiCapabilities } from './browser.platform.matrix';
import serviceConfig from 'config';
import path from 'path';
import { Logger } from '@hmcts/nodejs-logging';
import { retry } from 'protractor-retry';
import { IParsedArgvOptions } from '@cucumber/cucumber/lib/cli/argv_parser';

const logger = Logger.getLogger('features.crossbrowser.conf');

const ccdWebUrl: string = serviceConfig.get('ccd.webUrl');
// const failFast = Boolean(JSON.parse(serviceConfig.get('protractor.FailFast')));
const sauceUser: string = serviceConfig.get('sauce.user');
const sauceKey: string = serviceConfig.get('sauce.key');
const retries: number = Math.max(serviceConfig.get('protractor.testRetries'), 0);

function onCleanUp(results): void {
  retry.onCleanUp(results);
}

async function onPrepare(): Promise<void> {
  await browser.getCapabilities();
  await browser.manage().window().maximize();
  await browser.waitForAngularEnabled(false);
  retry.onPrepare();
}

async function onComplete(): Promise<void> {
  await browser.getProcessedConfig();
  const session = await browser.getSession();
  logger.info(`SauceOnDemandSessionID=${session.getId()} job-name=sscs-ccd-e2e-tests`);
}

// function afterLaunch(): any {
//   return retry.afterLaunch(retries);
// }

const featuresPath = path.resolve(process.cwd(), 'e2e/features/*.feature');

const cucumberOpts: IParsedArgvOptions = <IParsedArgvOptions>{
  format: ['@cucumber/pretty-formatter', 'json:./cb_reports/saucelab_results.json'],
  require: ['./cucumber.conf.js', './features/step_definitions/**/*.steps.js'],
  // failFast,
  strict: true,
  backtrace: true,
  retry: retries,
};

export const config: Config = {
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts,

  sauceSeleniumAddress: 'ondemand.eu-central-1.saucelabs.com:443/wd/hub',
  host: 'ondemand.eu-central-1.saucelabs.com',
  sauceRegion: 'eu',
  port: 80,
  sauceConnect: true,
  // sauceProxy: 'http://proxyout.reform.hmcts.net:8080',  // Proxy for the REST API
  sauceUser,
  sauceKey,
  SAUCE_REST_ENDPOINT: 'https://eu-central-1.saucelabs.com/rest/v1/',

  specs: [featuresPath],
  baseUrl: ccdWebUrl,
  allScriptsTimeout: 220000,
  useAllAngular2AppRoots: true,
  multiCapabilities,
  maxSessions: 7,

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'SSCS Service Cross Browser Test',
        jsonDir: 'reports/tests/crossbrowser',
        reportPath: 'reports/tests/crossbrowser',
      },
    },
  ],
  onCleanUp,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onPrepare,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onComplete,
  // afterLaunch,
};
