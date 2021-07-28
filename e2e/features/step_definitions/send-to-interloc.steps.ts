import { When } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdPage();

When(/^I submit the interloc reason$/, async function () {
    await anyCcdPage.chooseOptionContainingText('#interlocReferralReason', 'Other');
    await anyCcdPage.click('Continue');
    await anyCcdPage.fillNote();
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
    await browser.sleep(1000);
});
