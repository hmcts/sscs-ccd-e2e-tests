import { Then, When } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { expect } from 'chai';
const anyCcdPage = new AnyCcdPage();

When('resend only to appellant and not to representative', async function () {
  await anyCcdPage.clickElementById('resendToAppellant_Yes');
  await anyCcdPage.clickElementById('resendToRepresentative_No');
  await anyCcdPage.clickContinue();
});

Then('the reissue document event should be seen in “History” tab', async function () {
  await anyCcdPage.clickTab('History');
  expect(await anyCcdPage.eventsPresentInHistory('Reissue document')).to.equal(true);
});
