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

let date = new Date();
let month = date.getMonth() + 1; // months (0-11)
let day = date.getDate(); // day (1-31)
let year = date.getFullYear();
let formattedDate =  day + '-' + month + '-' + year;

When(/^I choose "(.+)"$/, async function (action) {
    await browser.sleep(4000)
    if (action === 'Write adjournment notice'
    || action === 'Not listable' || action === 'Update not listable'
    || action === 'Upload hearing recording') {
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
      expect(await anyCcdPage.pageHeadingContains('Issue codes')).to.equal(true);
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
    await browser.sleep(2000);
});

When(/^I upload only evidence and original documents$/, async function () {
    let dwpState = 'YES';
    let benefitType = 'PIP';
    await dwpresponse.uploadOnlyResponseAndEvidence('No', dwpState, benefitType);
    if (benefitType !== 'UC') {
        await anyCcdPage.selectIssueCode();
        await browser.sleep(2000);
    }
    await browser.sleep(500);
    await anyCcdPage.scrollBar('//div/form/div/button[2]');
});

When(/^I upload with default issue code$/, async function () {
    const dwpState = 'YES';
    await dwpresponse.uploadResponse('No', dwpState, 'PIP');
    await browser.sleep(500);
    await anyCcdPage.scrollBar('//div/form/div/button[2]');
    await browser.sleep(500);
    await anyCcdPage.scrollBar('//button[@type=\'submit\']');
});

Then(/^I should see "(.+)" error message$/, async function (errMsg: string) {
    await browser.sleep(5000);
    expect(await anyCcdPage.contentContains(errMsg)).to.equal(true);
});

When(/^I respond to the appeal with upload contains further information "(.+)" option$/, async function (action: string) {
    await dwpresponse.uploadResponseForChildSupport(action);
    await dwpresponse.addOtherParties();
});

When(/^I respond to the taxCredit appeal with upload contains further information "(.+)" option$/, async function (action: string) {
    await dwpresponse.uploadResponseForTaxCredit(action);
});

When(/^dwp responds requesting "(.+)" for the uploads contains further info option$/, async function (action: string) {
    await dwpresponse.uploadResponseForTaxCredit(action);
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
    await browser.sleep(10000);
    await anyCcdPage.clickTab('History');
    await browser.sleep(5000);
    await anyCcdPage.waitForSpinnerToHide();
    expect(await caseDetailsPage.isFieldValueDisplayed('End state', state)).to.equal(true);
    await browser.sleep(500);
});

Then(/^FTA documents should be seen against the case$/, async function () {
    await anyCcdPage.clickTab('FTA Documents');
    await browser.sleep(5000);
    await anyCcdPage.isFieldValueDisplayed('Document type', 'FTA evidence bundle');
    await anyCcdPage.isFieldValueDisplayed('Original document Url', `FTA evidence received on ${formattedDate}.pdf`);

    await anyCcdPage.isFieldValueDisplayed('Document type', 'FTA response');
    await anyCcdPage.isFieldValueDisplayed('Original document Url', `FTA response received on ${formattedDate}.pdf`);

    await anyCcdPage.isFieldValueDisplayed('Document type', 'AT38');
    await anyCcdPage.isFieldValueDisplayed('Original document Url', `AT38 received on ${formattedDate}.pdf`);
    await browser.sleep(500);
});

Then(/^FTA edited documents should be seen against the case$/, async function () {
    await anyCcdPage.clickTab('FTA Documents');
    await browser.sleep(5000);
    await anyCcdPage.isFieldValueDisplayed('Document type', 'FTA evidence bundle');
    await anyCcdPage.isFieldValueDisplayed('Edited document Url', `FTA edited evidence received on ${formattedDate}.pdf`);

    await anyCcdPage.isFieldValueDisplayed('Document type', 'FTA response');
    await anyCcdPage.isFieldValueDisplayed('Edited document Url', `FTA edited response received on ${formattedDate}.pdf`);
    await browser.sleep(500);
});
