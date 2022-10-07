import { AnyCcdPage } from '../../pages/any-ccd.page';
import { When } from 'cucumber';
import { expect } from 'chai';
import { ResponseReviewedPage } from '../../pages/response-reviewed.page';
import { browser } from 'protractor';
const anyCcdPage = new AnyCcdPage();
const responseReviewedPage = new ResponseReviewedPage();

When(/^I choose Requires Interlocutory Review to be "(.+)"$/, async function (action) {
    await anyCcdPage.scrollBar(`//input[@id="isInterlocRequired_${action}"]`);
    await anyCcdPage.click('Continue');
});

When(/^I submit "(.+)"$/, async function (action) {
    // await anyCcdPage.click('Continue');
    await browser.sleep(4000);
    expect(await anyCcdPage.pageHeadingContains(action)).to.equal(true);
    await anyCcdPage.click('Submit');
    await browser.sleep(1000);
});

When(/I review the UC received Response$/, async function() {
    await responseReviewedPage.reviewUCResponse();
});
