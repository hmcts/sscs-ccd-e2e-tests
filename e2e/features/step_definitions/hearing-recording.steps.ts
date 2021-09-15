import { browser } from 'protractor';
import { AnyCcdPage } from '../../pages/any-ccd.page';
// @ts-ignore
import { HearingRecordingPage } from '../../pages/hearing-recording.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { Then, When } from 'cucumber';
import { expect } from 'chai';
import { delay } from 'rxjs/operators';

const anyCcdPage = new AnyCcdPage();
const hearingRecordingPage = new HearingRecordingPage();
const caseDetailsPage = new CaseDetailsPage();

When(/^I upload a hearing recording$/, async function () {
  await hearingRecordingPage.uploadHearingRecording();
  await browser.sleep(500);
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
  await anyCcdPage.reloadPage();
  await anyCcdPage.clickTab(tabName);
  expect(await anyCcdPage.contentContains('Hearing Recordings')).to.equal(isDisplayed);
  expect(await anyCcdPage.contentContains('Hearing Recordings 1')).to.equal(isDisplayed);

  await browser.sleep(5000);
});

Then(/^the "(.+)" should be successfully listed in "(.+)" tab$/, async function (action, tabName) {
  await delay(10000);
  await caseDetailsPage.reloadPage();
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

When(/^I grant request for Hearing recording$/, async function () {
  expect(await anyCcdPage.pageHeadingContains('Process hearing recording')).to.equal(true);
  await hearingRecordingPage.grantRequestDwpHearingRecording();
  await anyCcdPage.click('Continue');
  await browser.sleep(500);
  await anyCcdPage.click('Ignore Warning and Continue');
  await anyCcdPage.click('Submit');
  await browser.sleep(500);
});
