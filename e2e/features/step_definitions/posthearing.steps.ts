import { Given, Then, When } from '@cucumber/cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { Logger } from '@hmcts/nodejs-logging';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { assert } from 'chai';

const anyCcdPage = new AnyCcdPage();
const logger = Logger.getLogger('libery-to-apply.steps');
const caseDetailsPage = new CaseDetailsPage();

When('I select {string} post hearing request', async function (request) {
  // Write code here that turns the phrase above into concrete actions
  logger.info('stupid compiler');
  switch (request) {
    case 'Liberty to Apply':
      await anyCcdPage.clickElementById('postHearingRequestType-libertyToApply');
      break;
    case 'Set aside':
      await anyCcdPage.clickElementById('postHearingRequestType-setAside');
      break;

    default:
      throw new Error(`${request} is not implemented}`);
  }
  await anyCcdPage.clickContinue();
});

Given('I click {string}', async function (buttonName) {
  await anyCcdPage.clickButton(buttonName);
  await anyCcdPage.waitForSpinner();
});

function getPosthearingType(postHearingRequest: string) {
  switch (postHearingRequest) {
    case 'Liberty to Apply':
      return 'liberyToApply';
    case 'Set aside':
      return 'setAside';
    case 'Correction':
      return 'correction';
    default:
      throw new Error(`${postHearingRequest} is not implemented}`);
  }
}

Given('I select {string} {string}', async function (requestType: string, elementName: string) {
  const postHearingType: string = getPosthearingType(requestType);
  switch (elementName) {
    case 'Upload request':
      await anyCcdPage.clickElementById(`${postHearingType}_requestFormat-upload`);
      break;
    case 'Enter request details':
      await anyCcdPage.clickElementById(`${postHearingType}_requestFormat-generate`);
      break;
    default:
      throw new Error(`${elementName} is not implemented}`);
  }
});

Given('I upload a pdf file', async function () {
  await anyCcdPage.uploadFile('previewDocument', 'issue1.pdf');
});

Then('I fill {string} reasons with {string}', async function (requestType: string, text: string) {
  const textAreaId: string =
    requestType === 'Set aside' ? 'bodyContent' : `${getPosthearingType(requestType)}BodyContent`;
  await anyCcdPage.setText(`//textarea[@id='${textAreaId}']`, text);
});

Then('FTA State should be set to {string}', async function (ftaState: string) {
  await anyCcdPage.clickTab('Appeal Details');
  await caseDetailsPage.getFieldValue(`FTA State`).then(function (actText) {
    assert.equal(ftaState, actText);
  });
});
