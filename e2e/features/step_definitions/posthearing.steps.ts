import { Given, Then, When } from '@cucumber/cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { assert } from 'chai';

const anyCcdPage = new AnyCcdPage();
const caseDetailsPage = new CaseDetailsPage();

When('I select {string} post hearing request', async function (request) {
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
      return 'libertyToApply';
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

When('I upload a post hearing request pdf file', async function () {
  await anyCcdPage.uploadFile('postHearingPreviewDocument', 'issue1.pdf');
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

When('I upload correction request', async function () {
  await anyCcdPage.clickElementById('postHearingRequestType-correction');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('correction_requestFormat-upload');
  await anyCcdPage.clickContinue();
  await anyCcdPage.uploadFile('previewDocument', 'issue1.pdf');
  await anyCcdPage.clickSubmit();
  await anyCcdPage.clickSubmit();
});

When('I select {string} and submit', async function (buttonLabel: string) {
  await anyCcdPage.clickElementByXpath(`//div[label[contains(., '${buttonLabel}')]]/input`);
  await anyCcdPage.clickSubmit();
});

When('I select {string} and continue', async function (buttonLabel: string) {
  await anyCcdPage.clickElementByXpath(`//div[label[contains(., '${buttonLabel}')]]/input`);
  await anyCcdPage.clickContinue();
});

When('I select {string}', async function (buttonLabel: string) {
  await anyCcdPage.clickElementByXpath(`//div[label[contains(., '${buttonLabel}')]]/input`);
});

When('I upload header correction', async function () {
  await anyCcdPage.uploadFile('writeFinalDecisionPreviewDocument', 'issue1.pdf');
  await anyCcdPage.clickSubmit();
});

When(
  'I fill the form with {string} and {string} for send to judge and {string} for notice generation',
  async function (actionType: string, sendToJudge: string, generateNotice: string) {
    await anyCcdPage.chooseOptionByValue('setAside_action', actionType);
    await anyCcdPage.clickElementById(`setAside_requestStatementOfReasons_${sendToJudge}`);
    await anyCcdPage.clickElementById(`generateNotice_${generateNotice}`);

    if (generateNotice === 'Yes') {
      await anyCcdPage.fillValues('bodyContent', 'body content');
      await anyCcdPage.fillValues('signedBy', 'FirstName LastName');
      await anyCcdPage.fillValues('signedRole', 'Role');
    }
  }
);