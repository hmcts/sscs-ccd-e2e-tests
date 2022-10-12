import { Given, Then } from 'cucumber';
import { UpdateListingRequirementsPage } from '../../pages/update-listing-requirements.page';

const updateListingRequirementsPage = new UpdateListingRequirementsPage();

Given(/^I choose "(.+)" option from appellant's hearing channel$/, async function () {
     await updateListingRequirementsPage.updateHearingChannel();
});

Then(/^I choose "(.+)" is po office attending$/, async function () {
     await updateListingRequirementsPage.updatePOOfficerAttending();
});

Then(/^I amend the reason for update$/, async function () {
     await updateListingRequirementsPage.amendReasonForUpdate();
});
