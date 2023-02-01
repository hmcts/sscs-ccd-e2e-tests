import { When, Then } from 'cucumber';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';

import { browser } from 'protractor';
import { expect } from 'chai';

const anyCcdPage = new AnyCcdFormPage();

When('I select {string} and {string} Elements', async function (string, string2) {
    await anyCcdPage.clickElementById('elementsDisputedList-housing');
    await anyCcdPage.clickElementById('elementsDisputedList-childcare');
    await anyCcdPage.click('Continue');
  });

When('I add issue codes for respective elements', async function () {
    await browser.sleep(3000);
    expect(await anyCcdPage.pageHeadingContains('Issue codes')).to.equal(true);
    await anyCcdPage.addNewCollectionItem('Housing');
    await anyCcdPage.selectHousingIssueCode();
    await browser.sleep(3000);
    await anyCcdPage.addNewCollectionItem('Childcare');
    await anyCcdPage.selectChildcareIssueCode();
    await browser.sleep(500);
    await anyCcdPage.click('Continue');
});

Then('the Amend elements event should be seen in "History" tab', async function () {
    await browser.sleep(5000);
    await anyCcdPage.clickTab('History');
    await browser.sleep(500);
    expect(await anyCcdPage.eventsPresentInHistory('Amend elements/issues')).to.equal(true);
});

Then('I should see the choose elements and issue code within "Elements and issues" tab', async function () {
    await browser.sleep(500);
    await anyCcdPage.clickTab('Elements and issues');
    await browser.sleep(500);
    expect(await anyCcdPage.contentContains('Housing')).to.equal(true);
    expect(await anyCcdPage.contentContains('Childcare')).to.equal(true);
});
