import { browser } from 'protractor';
import { When, Then } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AdjournmentPage } from '../../pages/adjournment.page';
import { expect } from 'chai';

const anyCcdPage = new AnyCcdPage();
const adjournmentPage = new AdjournmentPage();

When(/^I book a hearing$/, async function () {
  await anyCcdPage.click('Add new');
  await adjournmentPage.addVenue();
  await browser.sleep(500);
});

When(/^I generate an adjournment notice$/, async function () {
  await anyCcdPage.clickElementById('adjournCaseGenerateNotice-Yes');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCasePanelMembersExcluded-No');
  await anyCcdPage.click('Continue');
  await adjournmentPage.addPanelMembers();
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseTypeOfHearing-faceToFace');
  await anyCcdPage.click('Continue');

  await anyCcdPage.clickElementById('adjournCaseCanCaseBeListedRightAway-Yes');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseTypeOfNextHearing-faceToFace');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingVenue-sameVenue');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingListingDurationType-standardTimeSlot');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseInterpreterRequired-No');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingDateType-firstAvailableDate');
  await anyCcdPage.click('Continue');
  await adjournmentPage.addReasons();

  await anyCcdPage.click('Continue');
  await anyCcdPage.click('Continue');
  await anyCcdPage.click('Continue');
  await anyCcdPage.click('Submit');
  await browser.sleep(5000);
});

When(/^I upload an adjournment notice and issue direction "(.+)"$/, async function (issueDirection) {
  await anyCcdPage.clickElementById('adjournCaseGenerateNotice-No');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCasePanelMembersExcluded-No');
  await anyCcdPage.click('Continue');
  await adjournmentPage.addPanelMembers();
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseAreDirectionsBeingMadeToParties-' + issueDirection);
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
  await anyCcdPage.clickElementById('adjournCaseInterpreterRequired-No');
  await anyCcdPage.click('Continue');
  await anyCcdPage.clickElementById('adjournCaseNextHearingDateType-firstAvailableDate');
  await anyCcdPage.click('Continue');
  await adjournmentPage.uploadAdjournmentNotice();
  await anyCcdPage.click('Continue');
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
