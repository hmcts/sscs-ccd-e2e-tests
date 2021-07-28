import { AnyCcdPage } from '../../pages/any-ccd.page';
import { When } from 'cucumber';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdPage();

When(/^I choose Requires Interlocutory Review Yes "(.+)"$/, async function (action) {
    await anyCcdPage.clickElementById('isInterlocRequired_Yes');
    await anyCcdPage.chooseOptionByElementId('dwpOriginatingOffice', 'DWP PIP (1)');
    await browser.sleep(500);
    await anyCcdPage.chooseOptionByElementId('dwpPresentingOffice', 'DWP PIP (1)');
    await browser.sleep(500);
    await anyCcdPage.chooseOptionByElementId('selectWhoReviewsCase', 'Review by Judge');
    await browser.sleep(500);
    await anyCcdPage.chooseOptionByElementId('interlocReferralReason', 'Complex Case');
    await anyCcdPage.fillNote();
    await anyCcdPage.click('Continue');
});

When(/^I set DWP State to No action "(.+)"$/, async function (action) {
    await anyCcdPage.chooseOptionByElementId('dwpState', 'No action');
    await anyCcdPage.click('Continue');
});
