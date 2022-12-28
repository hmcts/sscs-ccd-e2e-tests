import { AnyCcdPage } from '../../pages/any-ccd.page';
import { Given, Then } from 'cucumber';
import { expect } from 'chai';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdPage();

Given('I wait {string} seconds', async function (number) {
  await browser.sleep(number * 1000);
});

Then('I should see {string} for the field {string}', async function (value: string, field: string) {
  const fieldValue = await anyCcdPage.getFieldValue(field);
  expect(fieldValue).to.equal(value);
});

Then('the {string} tab is seen with {string} content', async function (tabName: string, tabContent: string) {
  await browser.manage().window().maximize();
  await anyCcdPage.clickTab(tabName);
  expect(await anyCcdPage.contentContains(tabContent)).to.equal(true);
});
