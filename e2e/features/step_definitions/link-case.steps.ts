import { browser } from 'protractor';
import { When, Then } from 'cucumber';
import { expect } from 'chai';
import { AnyCcdPage } from '../../pages/any-ccd.page';

const anyCcdPage = new AnyCcdPage();

When('I add a {string} case to be linked', async function (caseId: string) {
  await anyCcdPage.click('Add new');
  await anyCcdPage.setText('//*[@id="linkedCase_0_0"]', caseId);

  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
});

Then('I should see {string} case linked within related cases tab', async function (caseId: string) {
  await browser.sleep(2000);
  await anyCcdPage.clickTab('Related Cases');
  expect(await anyCcdPage.isFieldValueDisplayed('Has related appeal(s)', caseId)).to.equal(true);
});
