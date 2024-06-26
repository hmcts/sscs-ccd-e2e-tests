import { AnyCcdPage } from '../../pages/any-ccd.page';
import { HearingRecordingPage } from '../../pages/hearing-recording.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { Then, When, Given } from '@cucumber/cucumber';
import { expect } from 'chai';
import { browser } from 'protractor';
import { Wait } from '../../enums/wait';

const anyCcdPage = new AnyCcdPage();
const hearingRecordingPage = new HearingRecordingPage();
const caseDetailsPage = new CaseDetailsPage();

When('I upload a hearing recording', async function () {
  expect(await anyCcdPage.pageHeadingContains('Hearing recording')).to.equal(true);
  await hearingRecordingPage.uploadHearingRecording();
});

When('I select a hearing', async function () {
  expect(await anyCcdPage.pageHeadingContains('Upload hearing recording')).to.equal(true);
  await browser.sleep(Wait.normal);
  await hearingRecordingPage.selectHearing();
  await anyCcdPage.clickContinue();
});

Then('the hearing recording should be in {string} tab', async function (tabName) {
  const isDisplayed = true;
  await browser.sleep(Wait.long);
  await browser.manage().window().maximize();
  if (tabName === 'Hearing Recordings') {
    await anyCcdPage.clickElementByCss('.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron');
  }
  await anyCcdPage.clickTab(tabName);
  expect(await anyCcdPage.contentContains('recordings 1')).to.equal(isDisplayed);
  // expect(await anyCcdPage.contentContains('Recordings')).to.equal(isDisplayed);
  expect(await anyCcdPage.contentContains('Final Hearing')).to.equal(isDisplayed);
  expect(await anyCcdPage.contentContains('12345')).to.equal(isDisplayed);
  expect(await anyCcdPage.contentContains('Fox Court')).to.equal(isDisplayed);
});

Then('the {string} should be successfully listed in the History', async function (action) {
  await anyCcdPage.clickElementByCss('.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron');
  const events = await caseDetailsPage.getHistoryEvents();
  expect(events).to.include(action);
});

When('I request for Hearing recording', async function () {
  expect(await anyCcdPage.pageHeadingContains('Request hearing recording')).to.equal(true);
  await browser.sleep(Wait.short);
  await hearingRecordingPage.requestDwpHearingRecording();
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
});

When('request for Hearing recording is {string}', async function (hearingPermission: string) {
  expect(await anyCcdPage.pageHeadingContains('Action hearing recording request')).to.equal(true);
  await anyCcdPage.chooseOptionContainingText('selectHearingDetails', 'Fox Court 13:00:00 21 Jan 2024');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Please review the hearing recordings')).to.equal(true);
  if (hearingPermission === 'Granted') {
    await hearingRecordingPage.grantRequestDwpHearingRecording(hearingPermission);
  } else if (hearingPermission === 'Refused') {
    await hearingRecordingPage.refuseAppellantHearingRecording(hearingPermission);
  } else {
    throw Error('Not a valid permission type');
  }
  await anyCcdPage.clickSubmit();
  await anyCcdPage.clickSubmit();
});

Given('I submit {string} as Request for Hearing Recording in the Upload document FE event', async function (filename) {
  expect(await anyCcdPage.pageHeadingContains('Upload document FE')).to.equal(true);
  await anyCcdPage.clickAddNew();
  await anyCcdPage.chooseOptionContainingText(
    'draftSscsFurtherEvidenceDocument_0_documentType',
    'Request for Hearing Recording'
  );
  await anyCcdPage.uploadFile('draftSscsFurtherEvidenceDocument_0_documentLink', filename);
  await anyCcdPage.clickSubmit();
  expect(await anyCcdPage.pageHeadingContains('Hearing request party')).to.equal(true);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Request for hearing recording')).to.equal(true);
  await anyCcdPage.chooseOptionContainingText('requestableHearingDetails', 'Fox Court 13:00 21 Jan 2024');
  await anyCcdPage.clickSubmit();
  await anyCcdPage.clickSubmit();
});

Then('the recording collection is cleared from Unprocessed correspondence tab', async function () {
  await anyCcdPage.clickTab('Unprocessed Correspondence');
  await anyCcdPage.elementNotPresent('Requested hearing recordings 1');
  await anyCcdPage.elementNotPresent('Fox Court');
});
