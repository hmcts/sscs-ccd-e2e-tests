import { AnyCcdPage } from '../../pages/any-ccd.page';
import { Given, Then } from 'cucumber';
import { expect } from 'chai';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdPage();

Given('I wait {string} seconds', async function (number) {
  await browser.sleep(number * 1000);
});

Then('I should see {string}', async function (text) {
  await anyCcdPage.contentContains(text);
});

Then('the {string} tab is seen with {string} content', async function (tabName: string, tabContent: string) {
  await browser.manage().window().maximize();
  await anyCcdPage.clickTab(tabName);
  expect(await anyCcdPage.contentContains(tabContent)).to.equal(true);
});
