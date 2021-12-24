import { Then, When } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { expect } from 'chai';
import { browser } from 'protractor';
const anyCcdPage = new AnyCcdPage();

When('resend only to appellant and not to representative', async function () {
    await browser.sleep(2000);
    await anyCcdPage.clickElementById('resendToAppellant_Yes');
    await anyCcdPage.clickElementById('resendToRepresentative_No');
    await anyCcdPage.click('Continue');
});

When('I submit “Reissue document”', async function () {
    await browser.sleep(3000);
    await anyCcdPage.click('Submit');
    await browser.sleep(5000);
});

Then('the reissue document event should be seen in “History” tab', async function () {
    await browser.sleep(5000);
    await anyCcdPage.clickTab('History');
    await browser.sleep(500);
    expect(await anyCcdPage.eventsPresentInHistory('Reissue document')).to.equal(true);
});

When('I wait for Judge to sign out', async function () {
    await browser.sleep(5000);
    await browser.sleep(5000);
})