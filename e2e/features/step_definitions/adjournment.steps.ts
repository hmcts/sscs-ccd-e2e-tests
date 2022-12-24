import { browser } from 'protractor';
import { When, Then } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AdjournmentPage } from '../../pages/adjournment.page';
import { expect } from 'chai';

const anyCcdPage = new AnyCcdPage();
const adjournmentPage = new AdjournmentPage();

When('I book a hearing', async function () {
  await browser.sleep(2000);
  await anyCcdPage.click('Add new');
  await adjournmentPage.addVenue('20', '10', '2021');
  await browser.sleep(500);
});

When('I generate an adjournment notice', async function () {
  await anyCcdPage.clickElementById('adjournCaseGenerateNotice_Yes');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCasePanelMembersExcluded-No');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Panel members')).to.equal(true);
  await adjournmentPage.addPanelMembers();
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseTypeOfHearing-faceToFace');
  await anyCcdPage.clickContinue();

  await anyCcdPage.clickElementById('adjournCaseCanCaseBeListedRightAway_Yes');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseTypeOfNextHearing-faceToFace');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseNextHearingVenue-sameVenue');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseNextHearingListingDurationType-standardTimeSlot');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseInterpreterRequired_No');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseNextHearingDateType-firstAvailableDate');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Reasons for adjournment')).to.equal(true);
  await adjournmentPage.setAdjournCaseReasonsText();

  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Additional directions (Optional)')).to.equal(true);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Preview Adjournment')).to.equal(true);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Check your answers')).to.equal(true);
  await anyCcdPage.clickSubmit();
});

When('I upload an adjournment notice and issue direction {string}', async function (issueDirection) {
  await anyCcdPage.clickElementById('adjournCaseGenerateNotice_No');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCasePanelMembersExcluded-No');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Panel members')).to.equal(true);
  await adjournmentPage.addPanelMembers();
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById(`adjournCaseAreDirectionsBeingMadeToParties_${issueDirection}`);
  await anyCcdPage.clickContinue();
  if (issueDirection === 'Yes') {
    await anyCcdPage.clickElementById('adjournCaseDirectionsDueDateDaysOffset-14');
    await anyCcdPage.clickContinue();
  }
  await anyCcdPage.clickElementById('adjournCaseTypeOfNextHearing-faceToFace');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseNextHearingVenue-sameVenue');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseNextHearingListingDurationType-standardTimeSlot');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseInterpreterRequired_No');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickElementById('adjournCaseNextHearingDateType-firstAvailableDate');
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Preview Adjournment')).to.equal(true);
  await adjournmentPage.uploadAdjournmentNotice();
  await browser.sleep(3000);
  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Check your answers')).to.equal(true);
  await anyCcdPage.clickSubmit();
});

When('I continue', async function () {
  await anyCcdPage.clickContinue();
});

Then('the case should be in Hearing appeal status', async function () {
  await browser.sleep(500);
  await anyCcdPage.reloadPage();
  expect(await anyCcdPage.contentContains('Hearing')).to.equal(true);

  await browser.sleep(5000);
});
