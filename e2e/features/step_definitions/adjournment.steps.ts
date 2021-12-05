import { browser } from 'protractor';
import { When, Then } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AdjournmentPage } from '../../pages/adjournment.page';
import { expect } from 'chai';

const anyCcdPage = new AnyCcdPage();
const adjournmentPage = new AdjournmentPage();

When(/^I book a hearing$/, async function () {
  await browser.sleep(2000);
  await anyCcdPage.click('Add new');
  await adjournmentPage.addVenue('20', '10', '2020');
  await browser.sleep(500);
});

When(/^I generate an adjournment notice$/, async function () {
  await anyCcdPage.clickElementById('adjournCaseGenerateNotice_Yes');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCasePanelMembersExcluded-No');
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Panel members')).to.equal(true);
  await adjournmentPage.addPanelMembers();
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseTypeOfHearing-faceToFace');
  await anyCcdPage.click('Continue');

  await anyCcdPage.clickElementById('adjournCaseCanCaseBeListedRightAway_Yes');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseTypeOfNextHearing-faceToFace');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingVenue-sameVenue');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingListingDurationType-standardTimeSlot');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseInterpreterRequired_No');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingDateType-firstAvailableDate');
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Reasons for adjournment')).to.equal(true);
  await adjournmentPage.setAdjournCaseReasonsText();

  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Additional directions (Optional)')).to.equal(true);
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Preview Adjournment')).to.equal(true);
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Check your answers')).to.equal(true);
  await anyCcdPage.click('Submit');
  await browser.sleep(5000);
});

When(/^I upload an adjournment notice and issue direction "(.+)"$/, async function (issueDirection) {
  await anyCcdPage.clickElementById('adjournCaseGenerateNotice_No');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCasePanelMembersExcluded-No');
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Panel members')).to.equal(true);
  await adjournmentPage.addPanelMembers();
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseAreDirectionsBeingMadeToParties_' + issueDirection);
  await anyCcdPage.click('Continue');
  if (issueDirection === 'Yes' ) {
    await anyCcdPage.clickElementById('adjournCaseDirectionsDueDateDaysOffset-14');
    await anyCcdPage.click('Continue');
  }
  await anyCcdPage.clickElementById('adjournCaseTypeOfNextHearing-faceToFace');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingVenue-sameVenue');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingListingDurationType-standardTimeSlot');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseInterpreterRequired_No');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingDateType-firstAvailableDate');
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Preview Adjournment')).to.equal(true);
  await adjournmentPage.uploadAdjournmentNotice();
  await browser.sleep(3000);
  await anyCcdPage.click('Continue');
  expect(await anyCcdPage.pageHeadingContains('Check your answers')).to.equal(true);
  await anyCcdPage.click('Submit');
  await browser.sleep(5000);
});

When(/^I continue$/, async function () {
    await anyCcdPage.click('Continue');
});

Then(/^the case should be in Hearing appeal status$/, async function () {
    await browser.sleep(500);
    await anyCcdPage.reloadPage();
    expect(await anyCcdPage.contentContains('Hearing')).to.equal(true);

    await browser.sleep(5000);
});
