import { When, Then } from 'cucumber';
import { browser } from 'protractor';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { JointPartyPage } from '../../pages/joint-party.page';
import { DwpResponsePage } from '../../pages/dwpresponse.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { IssueDecisionPage } from '../../pages/issue-decision.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { FurtherEvidencePage } from '../../pages/further-evidence.page';
import { Logger } from '@hmcts/nodejs-logging';

import { expect } from 'chai';

const logger = Logger.getLogger('uc-decision-notices.steps.ts');

const anyCcdPage = new AnyCcdPage();
const jointPartyPage = new JointPartyPage();
const dwpResponse = new DwpResponsePage();
const anyCcdFormPage = new AnyCcdFormPage();
const issueDecisionPage = new IssueDecisionPage();
const caseDetailsPage = new CaseDetailsPage();
const furtherEvidencePage = new FurtherEvidencePage();

When('I select schedule 6 activities with <15 points and schedule 8 para 4 {string}', async function (para4Apply) {
  await browser.sleep(2500);
  await issueDecisionPage.schedule6PageFieldsAreInTheCorrectOrder();
  await anyCcdPage.clickElementById('ucWriteFinalDecisionPhysicalDisabilitiesQuestion-mobilisingUnaided');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('ucWriteFinalDecisionMobilisingUnaidedQuestion-mobilisingUnaided1d');
  await anyCcdPage.clickContinue();
  // await anyCcdPage.clickContinue();
  if (para4Apply === 'YES') {
    await anyCcdPage.clickElementById('doesSchedule8Paragraph4Apply_Yes');
  } else {
    await anyCcdPage.clickElementById('doesSchedule8Paragraph4Apply_No');
  }
  await anyCcdPage.clickContinue();
});

When('I select schedule 6 activities with >=15 points', async function () {
  await browser.sleep(2000);
  await issueDecisionPage.schedule6PageFieldsAreInTheCorrectOrder();
  await anyCcdPage.clickElementById('ucWriteFinalDecisionPhysicalDisabilitiesQuestion-mobilisingUnaided');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('ucWriteFinalDecisionMobilisingUnaidedQuestion-mobilisingUnaided1a');
  await anyCcdPage.clickContinue();
});

When('I select schedule 7 activities', async function () {
  await anyCcdPage.clickElementById('ucWriteFinalDecisionSchedule7ActivitiesQuestion-schedule7MobilisingUnaided');
  await anyCcdPage.clickContinue();
});

When('I opt out schedule 7 activities and schedule 9 para 4 {string}', async function (para4) {
  await anyCcdPage.clickElementById('ucWriteFinalDecisionSchedule7ActivitiesApply-No');
  await anyCcdPage.clickContinue();
  if (para4 === 'YES') {
    await anyCcdPage.clickElementById('doesSchedule9Paragraph4Apply-Yes');
  } else {
    await anyCcdPage.clickElementById('doesSchedule9Paragraph4Apply-No');
  }
  await anyCcdPage.clickContinue();
});

When('I continue writing final decision LCWA appeal', async function () {
  expect(await anyCcdPage.pageHeadingContains('Bundle page')).to.equal(true);
  await issueDecisionPage.pageReference();
  await anyCcdPage.clickContinue();
});

When('I continue writing final decision non LCWA appeal', async function () {
  await issueDecisionPage.pageReference();
  await anyCcdPage.clickContinue();
  await issueDecisionPage.fillSummary();
  await anyCcdPage.clickContinue();
});

When('I update joint party to {string} for UC', async function (hasJointParty) {
  if (hasJointParty === 'YES') {
    await anyCcdPage.clickElementById('jointParty-Yes');
    await jointPartyPage.addJointPartyDetails();
    await browser.sleep(100);
    await anyCcdPage.clickSubmit();
  }
  await anyCcdPage.clickTab('History');
  expect(await caseDetailsPage.eventsPresentInHistory('Update to case data')).to.equal(true);
  expect(await caseDetailsPage.eventsPresentInHistory('Joint Party Added')).to.equal(true);
  logger.info('&&&& Joint Party Added');
});

When('I update the scanned document for {string}', async function (originator) {
  await anyCcdPage.chooseOptionByValue('furtherEvidenceAction', 'sendToInterlocReviewByJudge');
  if (originator === 'Appellant') {
    await anyCcdPage.chooseOptionContainingText('originalSender', 'Appellant (or Appointee)');
  } else if (originator === 'JointParty') {
    await anyCcdPage.chooseOptionContainingText('originalSender', 'Joint party');
  }
  await anyCcdPage.clickAddNew();
  await anyCcdPage.chooseOptionContainingText('scannedDocuments_0_type', 'Confidentiality request');
  await dwpResponse.uploadDoc('scannedDocuments_0_url');
  await browser.driver.sleep(300);

  await anyCcdFormPage.setValueByElementId('scannedDocuments_0_fileName', 'test-confidentiality-file');
  await furtherEvidencePage.enterScannedDate('20', '1', '2021');
  await browser.sleep(2000);
  await anyCcdPage.clickElementById('scannedDocuments_0_includeInBundle_Yes');
  await browser.sleep(2000);
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
  await browser.driver.sleep(2000);
  await anyCcdPage.clickTab('History');
  expect(await anyCcdPage.contentContains('Review by Judge')).to.equal(true);
});

When('I select Granted for Appellant and Refused for Joint Party as a confidentiality', async function () {
  await anyCcdPage.clickElementById('confidentialityRequestAppellantGrantedOrRefused-grantConfidentialityRequest');
  await anyCcdPage.clickElementById('confidentialityRequestJointPartyGrantedOrRefused-refuseConfidentialityRequest');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
  await browser.driver.sleep(2000);
  await anyCcdPage.clickTab('History');
  await browser.driver.sleep(2000);
  expect(await caseDetailsPage.eventsPresentInHistory('Action further evidence')).to.equal(true);
  expect(await caseDetailsPage.eventsPresentInHistory('Review confidentiality request')).to.equal(true);
});

Then('I should see the Request outcome status for {string} to be {string}', async function (partyType, status) {
  await anyCcdPage.clickTab('Summary');
  await browser.driver.sleep(2000);
  await anyCcdPage.pageHeadingContains(`Confidentiality request outcome ${partyType}`);
  await anyCcdPage.isFieldValueDisplayed('Request outcome', status);
});
