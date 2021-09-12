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

Then(/^the hearing recording should be in Hearing Recordings tab$/, async function () {
  await browser.sleep(500);
  await anyCcdPage.reloadPage();
  await anyCcdPage.clickTab('Hearing recordings');
  expect(await anyCcdPage.contentContains('Hearing Recordings')).to.equal(true);
  expect(await anyCcdPage.contentContains('Hearing Recordings 1')).to.equal(true);

  await browser.sleep(5000);
});

Then(/^the upload hearing recording should be successfully listed in "(.+)" tab$/, async function (tabName) {
  await delay(10000);
  await caseDetailsPage.reloadPage();
  await anyCcdPage.clickTab(tabName);
  expect(await caseDetailsPage.eventsPresentInHistory('Upload hearing recording')).to.equal(true);
  await browser.sleep(500);
});
