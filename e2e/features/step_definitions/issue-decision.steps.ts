import { browser } from 'protractor';
import { When } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { IssueDecisionPage } from '../../pages/issue-decision.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { expect } from 'chai';

const anyCcdPage = new AnyCcdPage();
const issueDecisionPage = new IssueDecisionPage();
const caseDetailsPage = new CaseDetailsPage();
const anyCcdFormPage = new AnyCcdFormPage();

When(/^I write a final decision generate notice no generate$/, async function () {
  await anyCcdPage.clickElementById('writeFinalDecisionIsDescriptorFlow-No');
  await anyCcdPage.clickElementById('writeFinalDecisionGenerateNotice-No');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('writeFinalDecisionAllowedOrRefused-allowed');
  await anyCcdPage.click('Continue');
  await issueDecisionPage.uploadDirection();
  await browser.sleep(5000);
  await anyCcdPage.click('Continue');
  await anyCcdPage.click('Submit');
  await browser.sleep(5000);
});

When(/^I write a final decision generate notice yes daily living mobility is no face to face$/, async function () {
  await anyCcdPage.clickElementById('writeFinalDecisionIsDescriptorFlow-No');
  await anyCcdPage.clickElementById('writeFinalDecisionGenerateNotice-Yes');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('writeFinalDecisionAllowedOrRefused-allowed');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('writeFinalDecisionTypeOfHearing-faceToFace');
  await browser.sleep(500);
  await anyCcdPage.clickElementById('writeFinalDecisionPresentingOfficerAttendedQuestion-Yes');
  await anyCcdPage.clickElementById('writeFinalDecisionAppellantAttendedQuestion-Yes');
  await anyCcdPage.click('Continue');
  await issueDecisionPage.addPanelMembers();
  await anyCcdPage.click('Continue');
  await caseDetailsPage.addDayItems('writeFinalDecisionDateOfDecision');
  await browser.sleep(3000);
  await anyCcdPage.click('Continue');
  await browser.sleep(2000);
  await issueDecisionPage.pageReference();
  await anyCcdPage.click('Continue');
  await issueDecisionPage.fillSummary();
  await anyCcdPage.click('Continue');
  await anyCcdFormPage.addNewCollectionItem('Reasons for decision');
  await anyCcdFormPage.setCollectionItemFieldValue(
      'Reasons for decision',
      0,
      'Reasons for decision',
      'Some text'
  );
  await anyCcdPage.click('Continue');
  await browser.sleep(500);
  await anyCcdPage.click('Continue');
  // decision generated
  await browser.sleep(3000);
  await anyCcdPage.click('Continue');
  await browser.sleep(500);
  await anyCcdPage.click('Submit');
  await browser.sleep(5000);
});

When(/^I write a final decision generate notice yes daily living mobility is yes face to face$/, async function () {
  await anyCcdPage.clickElementById('writeFinalDecisionIsDescriptorFlow-Yes');
  await anyCcdPage.clickElementById('writeFinalDecisionGenerateNotice-Yes');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('writeFinalDecisionTypeOfHearing-faceToFace');
  await browser.sleep(500);
  await anyCcdPage.clickElementById('writeFinalDecisionPresentingOfficerAttendedQuestion-Yes');
  await anyCcdPage.clickElementById('writeFinalDecisionAppellantAttendedQuestion-Yes');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('pipWriteFinalDecisionDailyLivingQuestion-standardRate');
  await anyCcdPage.clickElementById('pipWriteFinalDecisionComparedToDWPDailyLivingQuestion-higher');
  await anyCcdPage.clickElementById('pipWriteFinalDecisionMobilityQuestion-standardRate');
  await anyCcdPage.clickElementById('pipWriteFinalDecisionComparedToDWPMobilityQuestion-same');
  await anyCcdPage.click('Continue');
  await caseDetailsPage.addDayItems('writeFinalDecisionStartDate');
  await anyCcdPage.clickElementById('writeFinalDecisionEndDateType-setEndDate');
  await browser.sleep(500);
  await caseDetailsPage.addDayItems('writeFinalDecisionEndDate');
  await browser.sleep(3000);
  await anyCcdPage.click('Continue');
  await issueDecisionPage.addPanelMembers();
  await anyCcdPage.click('Continue');
  await caseDetailsPage.addDayItems('writeFinalDecisionDateOfDecision');
  await anyCcdPage.click('Continue');
  await browser.sleep(3000);
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('pipWriteFinalDecisionDailyLivingActivitiesQuestion-preparingFood');
  await anyCcdPage.clickElementById('pipWriteFinalDecisionMobilityActivitiesQuestion-planningAndFollowing');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('pipWriteFinalDecisionPreparingFoodQuestion-preparingFood1f');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('pipWriteFinalDecisionPlanningAndFollowingQuestion-planningAndFollowing11d');
  await anyCcdPage.click('Continue');
  await issueDecisionPage.pageReference();
  await anyCcdPage.click('Continue');
  await anyCcdFormPage.addNewCollectionItem('Reasons for decision');
  await anyCcdFormPage.setCollectionItemFieldValue(
      'Reasons for decision',
      0,
      'Reasons for decision',
      'Some text'
  );
  await anyCcdPage.click('Continue');
  await browser.sleep(500);
  await anyCcdPage.click('Continue');
  // decision generated
  await browser.sleep(3000);
  await anyCcdPage.click('Continue');
  await browser.sleep(3000);
  await anyCcdPage.click('Submit');
  await browser.sleep(3000);
});

When(/^I see "(.+)"$/, async function (notice) {
  await anyCcdPage.click('Documents');
  await browser.sleep(500);
  expect(await anyCcdPage.contentContains(notice)).to.equal(true);
});

When(/^I test final decision$/, async function () {
  const caseReference = '1601983355417609';
  await anyCcdPage.get(`/case/SSCS/Benefit/${caseReference}`);
  await browser.sleep(10000);
});

When(/^I issue a final decision generate decision no$/, async function () {
  await anyCcdPage.click('Continue');
  await anyCcdPage.click('Submit');
  await browser.sleep(1000);
  expect(await anyCcdPage.contentContains('Decision in favour of appellant')).to.equal(true);
  await browser.sleep(500);
});

When(/^I issue a final decision generate decision upheld$/, async function () {
  await anyCcdPage.click('Continue');
  await anyCcdPage.click('Submit');
  await browser.sleep(1000);
  expect(await anyCcdPage.contentContains('Decision upheld')).to.equal(true);
  await browser.sleep(500);
});
