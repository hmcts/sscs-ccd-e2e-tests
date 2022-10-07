import { When, Then } from 'cucumber';
import { browser } from 'protractor';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { assert, expect } from 'chai';
import { exception } from 'console';
import { CaseDetailsPage } from '../../pages/case-details.page';

const anyCcdPage = new AnyCcdPage();
const caseDetailsPage = new CaseDetailsPage();

When(/^generate a letter in "(.+)" with "(.+)" option$/, async function (letterFormat, adjustmentOption) {
    await anyCcdPage.chooseOptionContainingText('#reasonableAdjustmentChoice', letterFormat);
    if (adjustmentOption === 'Yes') {
        await browser.sleep(2000);
        await anyCcdPage.clickElementById(`reasonableAdjustments_appellant_wantsReasonableAdjustment_${adjustmentOption}`);
        await browser.sleep(2000);
        await anyCcdPage.fillValues('reasonableAdjustments_appellant_reasonableAdjustmentRequirements', 'A2');
        await anyCcdPage.clickElementById('reasonableAdjustments_representative_wantsReasonableAdjustment_No');
    } else if (adjustmentOption === 'No') {
        await browser.sleep(2000);
        await anyCcdPage.clickElementById(`reasonableAdjustments_appellant_wantsReasonableAdjustment_${adjustmentOption}`);
        await browser.sleep(2000);
        await anyCcdPage.clickElementById('reasonableAdjustments_representative_wantsReasonableAdjustment_No');
    } else if (adjustmentOption === 'otherPartyYes') {
        await browser.sleep(2000);
        await anyCcdPage.clickElementById(`reasonableAdjustments_appellant_wantsReasonableAdjustment_No`);
        await anyCcdPage.clickElementById('reasonableAdjustments_representative_wantsReasonableAdjustment_No');
        await browser.sleep(2000);
        await anyCcdPage.clickElementById(`otherParties_0_reasonableAdjustment_wantsReasonableAdjustment_Yes`);
        await anyCcdPage.fillValues('otherParties_0_reasonableAdjustment_reasonableAdjustmentRequirements', 'A2');
        await browser.sleep(2000);
    } else if (adjustmentOption === 'otherPartyNo') {
        await browser.sleep(2000);
        await anyCcdPage.clickElementById(`otherParties_0_reasonableAdjustment_wantsReasonableAdjustment_No`);
        await browser.sleep(2000);
        await anyCcdPage.clickElementById('reasonableAdjustments_representative_wantsReasonableAdjustment_No');
        await anyCcdPage.clickElementById(`reasonableAdjustments_appellant_wantsReasonableAdjustment_No`);
        await browser.sleep(2000);
        await anyCcdPage.clickElementById(`otherParties_0_reasonableAdjustment_wantsReasonableAdjustment_No`);
    } else {
        throw new exception('No adjustment option passed in test');
    }
    await browser.sleep(1000);
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
    await browser.sleep(3000);
});

Then('reasonable adjustment details are seen in summary page', async function () {
    await anyCcdPage.isFieldValueDisplayed('Wants Reasonable Adjustment', 'Yes');
    await anyCcdPage.isFieldValueDisplayed('Alternative Format Requirements', 'A2');
});

Then('reasonable adjustment details are not seen in summary page', async function () {
    expect(await anyCcdPage.isFieldValueDisplayed('Wants Reasonable Adjustment', 'Yes')).to.equal(false);
    expect(await anyCcdPage.isFieldValueDisplayed('Alternative Format Requirements', 'A2')).to.equal(false);
});

Then(/^Reasonable adjustment tab is seen with "(.+)" as "(.+)"$/, async function (field, value) {
    await browser.sleep(8000);
    await anyCcdPage.reloadPage();
    await browser.manage().window().maximize();
    await browser.sleep(5000);
    await anyCcdPage.clickTab('Reasonable Adjustments Letters');
    await browser.sleep(1000);

    await caseDetailsPage.getFieldValue(field).then(function(actText) {
        assert.equal(value, actText);
    });
});

When(/^I update adjustment status to be "(.+)"$/, async function (adjustmentStatusOption) {
    await anyCcdPage
            .chooseOptionContainingText('#reasonableAdjustmentsLetters_appellant_0_reasonableAdjustmentStatus', adjustmentStatusOption);
    await anyCcdPage.scrollBar('//div/form/div/button[2]');
    await anyCcdPage.click('Submit');
    await browser.sleep(3000);
});