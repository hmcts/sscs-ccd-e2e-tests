import { browser } from 'protractor';
import { AnyCcdPage } from '../../pages/any-ccd.page';
// @ts-ignore
import { HearingRecordingPage } from '../../pages/hearing-recording.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { DwpResponsePage } from '../../pages/dwpresponse.page';
import { Then, When, Given } from 'cucumber';
import { expect } from 'chai';
// import { delay } from 'rxjs/operators';
import { exception } from 'console';

const anyCcdPage = new AnyCcdPage();
const hearingRecordingPage = new HearingRecordingPage();
const caseDetailsPage = new CaseDetailsPage();
const dwpresponse = new DwpResponsePage();

When(/^I upload a hearing recording$/, async function () {
  expect(await anyCcdPage.pageHeadingContains('Hearing recording')).to.equal(true);
  await hearingRecordingPage.uploadHearingRecording();
});

When(/^I select a hearing$/, async function () {
  expect(await anyCcdPage.pageHeadingContains('Upload hearing recording')).to.equal(true);
  await hearingRecordingPage.selectHearing();
  await browser.sleep(500);
  await anyCcdPage.click('Continue');
});

Then(/^the hearing recording should (be|not be) in "(.+)" tab$/, async function (seeOrNotSee, tabName) {
  const isDisplayed = (seeOrNotSee === 'be');
  await browser.sleep(500);
  // await anyCcdPage.reloadPage();
  await anyCcdPage.clickTab(tabName);
  expect(await anyCcdPage.contentContains('recordings 1')).to.equal(isDisplayed);
  expect(await anyCcdPage.contentContains('Recordings')).to.equal(isDisplayed);
  expect(await anyCcdPage.contentContains('Final Hearing')).to.equal(isDisplayed);
  expect(await anyCcdPage.contentContains('12345')).to.equal(isDisplayed);
  expect(await anyCcdPage.contentContains('Fox Court')).to.equal(isDisplayed);
  await browser.sleep(5000);
});

Then(/^the "(.+)" should be successfully listed in "(.+)" tab$/, async function (action, tabName) {
  // await delay(10000);
  await anyCcdPage.clickTab(tabName);
  expect(await caseDetailsPage.eventsPresentInHistory(action)).to.equal(true);
  await browser.sleep(500);
});

When(/^I request for Hearing recording$/, async function () {
  expect(await anyCcdPage.pageHeadingContains('Request hearing recording')).to.equal(true);
  await hearingRecordingPage.requestDwpHearingRecording();
  await anyCcdPage.click('Continue');
  await anyCcdPage.click('Submit');
  await browser.sleep(500);
});

When(/^request for Hearing recording is "(.+)"$/, async function (hearingPermission: string) {
  expect(await anyCcdPage.pageHeadingContains('Action hearing recording request')).to.equal(true);
  await anyCcdPage.chooseOptionContainingText('#selectHearingDetails', 'Fox Court 13:00:00 20 Oct 2021');
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Please review the hearing recordings')).to.equal(true);
  if (hearingPermission === 'Granted') {
    await hearingRecordingPage.grantRequestDwpHearingRecording(hearingPermission);
  } else if (hearingPermission === 'Refused') {
    await hearingRecordingPage.refuseAppellantHearingRecording(hearingPermission);
  } else {
      throw exception('Not a valid permission type');
  }
  await anyCcdPage.click('Continue');
  await anyCcdPage.click('Submit');
  await browser.sleep(500);
});

Given(/^I submit "(.+)" as Request for Hearing Recording in the Upload document FE event$/, async function (filename) {
  expect(await anyCcdPage.pageHeadingContains('Upload document FE')).to.equal(true);
  await anyCcdPage.click('Add new');
  await anyCcdPage.chooseOptionContainingText('#draftSscsFurtherEvidenceDocument_0_documentType', 'Request for Hearing Recording');
  await dwpresponse.uploadFile('draftSscsFurtherEvidenceDocument_0_documentLink', filename);
  await browser.sleep(8000);
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Hearing request party')).to.equal(true);
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Request for hearing recording')).to.equal(true);
  await anyCcdPage.chooseOptionContainingText('#requestableHearingDetails', 'Fox Court 13:00 20 Oct 2021');
  await anyCcdPage.click('Continue');
  await anyCcdPage.click('Submit');
  await browser.sleep(2000);
});

Then(/^the recording collection is cleared from Unprocessed correspondence tab$/, async function () {
  await anyCcdPage.clickTab('Unprocessed Correspondence');
  await anyCcdPage.elementNotPresent('Requested hearing recordings 1');
  await anyCcdPage.elementNotPresent('Fox Court');
  await browser.sleep(5000);
});
