import { Given, Then, When } from 'cucumber';
import { by, element } from 'protractor';
import { expect } from 'chai';
import { Logger } from '@hmcts/nodejs-logging';

import { CaseDetailsPage } from '../../pages/case-details.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { DwpResponsePage } from '../../pages/dwpresponse.page';

const caseDetailsPage = new CaseDetailsPage();
const anyCcdPage = new AnyCcdFormPage();
const dwpresponse = new DwpResponsePage();

const logger = Logger.getLogger('process-audio-video-evidence.steps');

When('I upload AV evidence and complete Upload response event for {string} case', async function (benefitType) {
  const dwpState = 'YES';
  await dwpresponse.uploadResponseWithAV(dwpState, benefitType);
  await anyCcdPage.selectIssueCode();
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
});

Then('I should see the AV evidence after clicking the AV tab', async function () {
  await anyCcdPage.clickTab('Audio/Video evidence');
  expect(await caseDetailsPage.isFieldValueDisplayed('Audio/video document url', 'test_av.mp3')).to.equal(true);
});

Then('I should see the RIP1 document', async function () {
  expect(await caseDetailsPage.isFieldValueDisplayed('RIP 1 document', 'rip1.pdf')).to.equal(true);
});

Then('I should see that the AV evidence was uploaded by {string}', async function (party) {
  expect(await caseDetailsPage.isFieldValueDisplayed('Audio/video party uploaded', party)).to.equal(true);
});

When('I process the AV evidence using the {string} action', async function (action) {
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.contentContains('Selected Audio/Video Evidence Details')).to.equal(true);
  await anyCcdPage.chooseOptionContainingText('processAudioVideoAction', action);
  await element(by.id('directionNoticeContent')).sendKeys('Body test content');
  await element(by.id('signedBy')).sendKeys('Signed by test content');
  await element(by.id('signedRole')).sendKeys('Signed role test content');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.contentContains('Preview Document')).to.equal(true);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.contentContains('Event summary (optional)')).to.equal(true);
  await anyCcdPage.clickSubmit();
});

Then('I {string} see the AV evidence in the FTA Documents tab', async function (assertion) {
  await anyCcdPage.clickTab('FTA Documents');
  const avVisibility = assertion === 'should';
  let documentTypeDisplayed = false;
  try {
    documentTypeDisplayed = await caseDetailsPage.isFieldValueDisplayed('Document type', 'Audio document');
  } catch (error) {
    logger.info(error.message);
  }
  expect(documentTypeDisplayed).to.equal(avVisibility);
  let audioVideoDocumentDisplayed = false;
  try {
    audioVideoDocumentDisplayed = await caseDetailsPage.isFieldValueDisplayed('Audio/video document', 'test_av.mp3');
  } catch (error) {
    logger.info(error.message);
  }
  expect(audioVideoDocumentDisplayed).to.equal(avVisibility);
});

Then('the bundle should include the AV evidence', async function () {
  await anyCcdPage.clickTab('Bundles');
  expect(await caseDetailsPage.isFieldValueDisplayed('Folder Name', 'Further additions')).to.equal(true);
  expect(await anyCcdPage.contentContains('Audio/video evidence document')).to.equal(true);
  expect(await anyCcdPage.contentContains('Addition B - DWP - RIP 1 document for A/V file: test_av.mp3')).to.equal(
    true
  );
});

Given('I submit {string} as {string} in the Upload document FE event', async function (filename, type) {
  await anyCcdPage.click('Add new');
  await anyCcdPage.chooseOptionContainingText('draftSscsFurtherEvidenceDocument_0_documentType', type);
  await anyCcdPage.uploadFile('draftSscsFurtherEvidenceDocument_0_documentLink', filename);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.contentContains('Event summary (optional)')).to.equal(true);
  await anyCcdPage.clickSubmit();
});
