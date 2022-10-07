import { browser, element, by } from 'protractor';
import { When, Then } from 'cucumber';
import { expect } from 'chai';
import { AnyCcdPage } from '../../pages/any-ccd.page';

const anyCcdPage = new AnyCcdPage();
let tot: number;

When('I choose to filter with benefit and issue code in workbasket filter', async function () {
    await browser.sleep(30000);
    await anyCcdPage.chooseOptionContainingText('#benefitCode', '002');
    await anyCcdPage.chooseOptionContainingText('#issueCode', 'DD');
    await anyCcdPage.scrollBar('//form/button[1]');
    expect(await anyCcdPage.pageHeadingContains('Appeal Created')).to.equal(true);
});

Then('I should see {int} cases returned in search results', async function (caseId: number) {
    tot = await element.all(by.css('ccd-search-result:nth-child(1) > table:nth-child(1) > tbody:nth-child(3) > tr')).count();
    expect(tot).to.equal(caseId);
});