import { Given, When, Then } from 'cucumber';
import { HearingDetailsPage } from '../../pages/hearing-details.page';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdPage();
const hearingDetailsPage = new HearingDetailsPage();

Given('I click on Request Hearing link', async function () {
     await hearingDetailsPage.requestManualHearing();
     await hearingDetailsPage.verifyHearingStatusSummary();
});

Then('I should see a hearing request generated for the appeal', async function () {
     await hearingDetailsPage.requestAutoHearing();
     await hearingDetailsPage.verifyHearingStatusSummary();
});

Then('I click on hearing details', async function () {
     await hearingDetailsPage.viewHearingDetails();
});

Then(/^the venue of the hearing should be in "(.+)"$/, async function (venueName: string) {
     await hearingDetailsPage.verifyHearingVenue(venueName);
});

Then(/^the duration of the hearing should be "(.+)"$/, async function (hearingDuration: string) {
     await hearingDetailsPage.verifyHearingDuration(hearingDuration);
});

Then(/^the earliest hearing date should be from "(.+)" days of hearing requested$/, async function (noOfDays: string) {

     let date = new Date();
     let numberOfDaysToAdd = Number(noOfDays);
     let result = date.setDate(date.getDate() + numberOfDaysToAdd);

     const additionalDate = new Date(result);
     const formattedDate = additionalDate.toLocaleDateString('en-GB', {
     day: 'numeric', month: 'long', year: 'numeric'
     }).replace(/ /g, ' ');

     await hearingDetailsPage.verifyHearingDuration(formattedDate);
});

Then(/^I update the length of hearing to "(.+)" hours$/, async function (hearingDuration: string) {
     await hearingDetailsPage.updateHearingDetails(hearingDuration);
});

Then(/^the hearing status should be updated to "(.+)"$/, async function (hearingStatus: string) {
     await hearingDetailsPage.verifyHearingStatus(hearingStatus);
});

Then(/^I click on Hearings tab$/, async function () {
       await hearingDetailsPage.verifyHearingStatusSummary();
});

Then(/^I choose "(.+)" option from appellant's hearing channel$/, async function (hearingChannel: string) {
       await hearingDetailsPage.verifyHearingChannel(hearingChannel);
});

Then(/^I choose "(.+)" is po office attending$/, async function (attendingOfficer: string) {
       await hearingDetailsPage.verifyAttendingOfficer(attendingOfficer);
});

Then(/^I amend the reason for update$/, async function () {
       await hearingDetailsPage.verifyAmendReasonForUpdate();
     });

When(/^I click on "(.+)" hearing link and select "(.+)" as cancellation reason$/, async function (cncl: string, reason: string) {
        await anyCcdPage.click(cncl);
        await browser.sleep(3000);

        await anyCcdPage.clickElementById(reason);
        await anyCcdPage.click('Continue');
        await browser.sleep(5000);
});

Then(/^I should see "(.+)" hearing status in summary page$/, async function (hearingStats: string) {
     await hearingDetailsPage.verifyCancelHearingStatus(hearingStats);
});

When(/^submit the event$/, async function () {
     await anyCcdPage.click('Submit');
});

Then(/^the hearing status should be "(.+)"$/, async function (hearingStats: string) {
     await hearingDetailsPage.requestAutoHearing();
     await hearingDetailsPage.verifyCancelHearingStatus(hearingStats);
});
