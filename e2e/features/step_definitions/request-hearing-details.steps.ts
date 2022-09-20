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

