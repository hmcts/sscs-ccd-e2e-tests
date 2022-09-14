import { Given, Then } from 'cucumber';
import { HearingDetailsPage } from '../../pages/hearing-details.page';

const hearingDetailsPage = new HearingDetailsPage();

Given('I click on Request Hearing link', async function () {
     await hearingDetailsPage.requestHearing();
});

Then('I click on Amend Hearing link', async function () {
     await  hearingDetailsPage.amendHearing();
});
