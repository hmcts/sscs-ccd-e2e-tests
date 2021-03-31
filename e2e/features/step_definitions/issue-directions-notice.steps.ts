import { Then, When } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { expect } from 'chai';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdPage();

When(/^I allow the appeal to proceed$/, async function () {
    await anyCcdPage.chooseOptionContainingText('#directionTypeDl', 'Appeal to Proceed');
    await anyCcdPage.clickElementById('generateNotice-Yes');
    await anyCcdPage.fillValues('bodyContent', 'This is a test body content');
    await anyCcdPage.fillValues('signedBy', 'This is a test signed content');
    await anyCcdPage.fillValues('signedRole', 'This is a test signed role content');
    await anyCcdPage.click('Continue');
    await anyCcdPage.runAccessbility();
    await anyCcdPage.click('Continue');
    await anyCcdPage.runAccessbility();
    await anyCcdPage.click('Submit');
});

Then('I  should see {string} in documents tab', async function (notice) {
    await anyCcdPage.clickTab('Documents');
    await browser.sleep(1000);
    await anyCcdPage.runAccessbility();
    expect(await anyCcdPage.contentContains(notice)).to.equal(true);
});
