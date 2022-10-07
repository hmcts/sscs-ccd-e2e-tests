import { browser } from 'protractor';
import { When, Then } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AdjournmentPage } from '../../pages/adjournment.page';
import { PostponementRequestPage } from '../../pages/postponement-request.page';

const anyCcdPage = new AnyCcdPage();
const adjournmentPage = new AdjournmentPage();
const postponementRequestPage = new PostponementRequestPage();

When(/^I book a hearing in the future$/, async function () {
  await anyCcdPage.click('Add new');
  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 10);

  await adjournmentPage.addVenue(
      targetDate.getDate().toString(),
      (targetDate.getMonth() + 1).toString(),
      targetDate.getFullYear().toString());
  await browser.sleep(500);
});

Then(/I enter postponement request details$/, async function () {
  await postponementRequestPage.enterPostponementRequestDetails();
});

Then(/^I enter "(.+)" in the action postponement request page$/, async function (action: string) {
  await postponementRequestPage.actionPostponementRequest(action);
  await postponementRequestPage.verifyInterlocStatus(action);
});
