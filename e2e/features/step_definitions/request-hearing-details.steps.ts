import { Given, Then } from 'cucumber';
import { HearingDetailsPage } from '../../pages/hearing-details.page';

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

     var date = new Date();
     var numberOfDaysToAdd = parseInt(noOfDays);
     var result = date.setDate(date.getDate() + numberOfDaysToAdd);

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