import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { Then, When } from 'cucumber';
import { expect } from 'chai';
import { DwpResponsePage } from '../../pages/dwpresponse.page';
import { browser } from 'protractor';
const serviceConfig = require('../../service.conf')

const anyCcdPage = new AnyCcdFormPage();
const caseDetailsPage = new CaseDetailsPage();
const dwpresponse = new DwpResponsePage();

When(/^I choose "(.+)"$/, async function (action) {
    await browser.sleep(4000)
    if (action === 'Write adjournment notice'
    || action === 'Not listable' || action === 'Update not listable'
    || action === 'Update subscription') {
        await anyCcdPage.reloadPage();
    }
    await caseDetailsPage.doNextStep(action);
    if (serviceConfig.TestsForCrossBrowser) {
        await anyCcdPage.click('Go');
        await browser.sleep(30000);
    } else {
        await anyCcdPage.click('Go');
        expect(await anyCcdPage.pageHeadingContains(action)).to.equal(true);
    }
});

When(/^I upload contains further information (.+) for "(.+)"$/, async function (action: string, benefitType: string) {
    const dwpState = 'YES';
    await dwpresponse.uploadResponse(action, dwpState, benefitType);
    if (benefitType !== 'UC') {
        await anyCcdPage.selectIssueCode();
        await browser.sleep(2000);
    }
    await browser.sleep(500);
    await anyCcdPage.scrollBar('//div/form/div/button[2]');
    await browser.sleep(500);
    if (benefitType === 'UC') {
      await browser.sleep(3000);
      await anyCcdPage.clickElementById('elementsDisputedList-general');
      await anyCcdPage.click('Continue');
      await browser.sleep(500);
      await anyCcdPage.addNewCollectionItem('General');
      await anyCcdPage.selectGeneralIssueCode();
      await anyCcdPage.click('Continue');
      await browser.sleep(500);
      await anyCcdPage.clickElementById('elementsDisputedIsDecisionDisputedByOthers_No');
      await anyCcdPage.click('Continue');
      await browser.sleep(500);
      await anyCcdPage.clickElementById('jointParty_No');
      await anyCcdPage.click('Continue');
      await browser.sleep(500);
    }
    await anyCcdPage.scrollBar('//button[@type=\'submit\']');
});

When(/^I upload (.+) further information with disputed (.+) disputed by others (.+) and further info (.+)$/,
    async function (benefitType, disputed, disputedByOthersYesOrNo, dwpFurtherInfoYesOrNo) {
    await dwpresponse.uploadResponseWithJointParty(benefitType, disputed, disputedByOthersYesOrNo, dwpFurtherInfoYesOrNo);
});

Then(/^the case should be in "(.+)" appeal status$/, async function (state) {
    await browser.sleep(5000);
    expect(await anyCcdPage.contentContains(state)).to.equal(true);
});

Then(/^the case should end in "(.+)" state$/, async function (state) {
    await anyCcdPage.clickTab('History');
    await browser.sleep(10000);
    expect(await caseDetailsPage.isFieldValueDisplayed('End state', state)).to.equal(true);
    await browser.sleep(500);
});
