import { Given } from 'cucumber';
import { HearingDetailsPage } from '../../pages/hearing-details.page';

const hearingDetailsPage = new HearingDetailsPage();

Given('I click on Request Hearing link', async function () {
  await hearingDetailsPage.requestHearing();
});
