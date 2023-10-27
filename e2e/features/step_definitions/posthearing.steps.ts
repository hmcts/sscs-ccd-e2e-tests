import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { Given, Then, When } from '@cucumber/cucumber';
import { IssueDecisionPage } from '../../pages/issue-decision.page';
import { assert, expect } from 'chai';
import { browser } from 'protractor';
import * as remote from 'selenium-webdriver/remote';

const anyCcdPage = new AnyCcdPage();
const anyCcdFormPage = new AnyCcdFormPage();
const caseDetailsPage = new CaseDetailsPage();
const issueDecisionPage = new IssueDecisionPage();

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
  await browser.waitForAngular();
  browser.setFileDetector(new remote.FileDetector());
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

When('I write a final decision yes to generate notice', async function () {
  await anyCcdPage.clickElementById('writeFinalDecisionGenerateNotice_Yes');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('writeFinalDecisionAllowedOrRefused-allowed');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('writeFinalDecisionTypeOfHearing-faceToFace');
  await anyCcdPage.clickElementById('writeFinalDecisionPresentingOfficerAttendedQuestion_Yes');
  await anyCcdPage.clickElementById('writeFinalDecisionAppellantAttendedQuestion_Yes');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Panel members')).to.equal(true);
  await issueDecisionPage.addPanelMembers();
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Decision date')).to.equal(true);
  await caseDetailsPage.addDayItems('writeFinalDecisionDateOfDecision');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Bundle page')).to.equal(true);
  await issueDecisionPage.pageReference();
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Summary of outcome decision')).to.equal(true);
  await issueDecisionPage.fillSummary();
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Reasons for decision')).to.equal(true);
  await anyCcdFormPage.addNewCollectionItem('Reasons for decision');
  await anyCcdFormPage.setCollectionItemFieldValue('Reasons for decision', 0, 'Reasons for decision', 'Some text');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Anything else?')).to.equal(true);
  await anyCcdPage.clickContinue();
  // decision generated
  await anyCcdPage.waitForSpinner();
  expect(await anyCcdPage.pageHeadingContains('Preview Decision Notice')).to.equal(true);
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
  const errors = await anyCcdPage.numberOfCcdErrorMessages();
  expect(errors).to.equal(0);
});

Then('I write a final decision correction and submit', async function () {
  await anyCcdPage.clickElementById('writeFinalDecisionGenerateNotice_Yes');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Panel members')).to.equal(true);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Decision date')).to.equal(true);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Bundle page')).to.equal(true);
  await anyCcdPage.fillValues('writeFinalDecisionPageSectionReference', '_correction_');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Summary of outcome decision')).to.equal(true);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Reasons for decision')).to.equal(true);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Anything else?')).to.equal(true);
  await anyCcdPage.clickContinue();
  // decision generated
  await anyCcdPage.waitForSpinner();
  expect(await anyCcdPage.pageHeadingContains('Preview Decision Notice')).to.equal(true);
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
  const errors = await anyCcdPage.numberOfCcdErrorMessages();
  expect(errors).to.equal(0);
});
