import { AnyCcdPage } from '../../pages/any-ccd.page';
import { Given, Then, When } from 'cucumber';
import { expect } from 'chai';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdPage();

Then(/^I (?:am on|should see) the (.+) page$/, async function (headingText) {
    expect(await anyCcdPage.pageHeadingContains(headingText)).to.equal(true);
});

Given(/^I wait "(.+)" seconds$/, async function (number) {
    await browser.sleep(number * 1000);
})

Then(/^I should see "(.+)"$/, async function (text) {
    await anyCcdPage.contentContains(text)
})

When(/^I click "(.+)"$/, async function (toClick) {
    await anyCcdPage.click(toClick);
})

Then(/^the "(.+)" tab is seen with "(.+)" content$/, async function (tabName: string, tabContent: string) {

    await browser.manage().window().maximize();
    await browser.sleep(2000);
    await anyCcdPage.clickTab(tabName);
    expect(await anyCcdPage.contentContains(tabContent)).to.equal(true);
});