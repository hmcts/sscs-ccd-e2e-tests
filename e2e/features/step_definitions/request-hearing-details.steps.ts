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

     var someDate = new Date();
     var numberOfDaysToAdd = noOfDays;
     var result = await someDate.setDate(someDate.getDate() + parseInt(numberOfDaysToAdd));
     console.log(new Date(result))
});
Then('I click on Amend Hearing link', async function () {
     await  hearingDetailsPage.amendHearing();
});
