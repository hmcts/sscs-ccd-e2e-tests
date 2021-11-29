import { browser, element, by } from 'protractor';
import { When, Then } from 'cucumber';
import { expect } from 'chai';
import { AnyCcdPage } from '../../pages/any-ccd.page';

const anyCcdPage = new AnyCcdPage();
let tot: number;

When('I choose to filter with benefit and issue code in workbasket filter', async function () {
    await anyCcdPage.chooseOptionContainingText('#benefitCode', '011');
    await anyCcdPage.chooseOptionContainingText('#issueCode', 'AA');
    await anyCcdPage.click('Apply');
    await browser.sleep(4000);
});

Then('I should see only {int} case returned in search results', async function (caseId: number) {
    tot = await element.all(by.css('ccd-search-result:nth-child(1) > table:nth-child(1) > tbody:nth-child(3) > tr')).count();
    expect(tot).to.equal(caseId);
});