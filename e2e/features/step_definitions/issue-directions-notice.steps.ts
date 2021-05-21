import { Then, When } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { expect } from 'chai';
import { browser } from 'protractor';
const anyCcdPage = new AnyCcdPage();

When(/^I allow the appeal to proceed$/, async function () {
    await anyCcdPage.chooseOptionContainingText('#directionTypeDl', 'Appeal to Proceed');
    await browser.sleep(3000);
    await anyCcdPage.scrollBar('//*[@id="generateNotice-Yes"]');
    await anyCcdPage.fillValues('bodyContent', 'This is a test body content');
    await anyCcdPage.fillValues('signedBy', 'This is a test signed content');
    await anyCcdPage.fillValues('signedRole', 'This is a test signed role content');
    await anyCcdPage.scrollBar('//button[contains(text(),\'Continue\')]');
    await anyCcdPage.clickAction('//button[contains(text(),\'Continue\')]');
    await anyCcdPage.clickAction('//button[contains(text(),\'Submit\')]');
});

Then('I  should see {string} in documents tab', async function (notice) {
    await anyCcdPage.clickTab('Documents');
    expect(await anyCcdPage.contentContains(notice)).to.equal(true);
});
