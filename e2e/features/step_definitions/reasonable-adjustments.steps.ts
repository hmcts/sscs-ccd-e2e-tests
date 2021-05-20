import { When, Then } from 'cucumber';
import { browser } from 'protractor';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { assert } from 'chai';
import { CaseDetailsPage } from '../../pages/case-details.page';

const anyCcdPage = new AnyCcdPage();
const caseDetailsPage = new CaseDetailsPage();

When(/^generate a letter in "(.+)"$/, async function (letterFormat) {
    await anyCcdPage.chooseOptionContainingText('#reasonableAdjustmentChoice', letterFormat);
    await anyCcdPage.clickElementById('reasonableAdjustments_appellant_wantsReasonableAdjustment-Yes');
    await anyCcdPage.fillValues('reasonableAdjustments_appellant_reasonableAdjustmentRequirements', 'A2');
    await browser.sleep(1000);

    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
    await browser.sleep(3000);
});

Then('reasonable adjustment details are seen in summary page', async function () {
    await anyCcdPage.isFieldValueDisplayed('Wants Reasonable Adjustment', 'Yes');
});

Then(/^Reasonable adjustment tab is seen with "(.+)" as "(.+)"$/, async function (field, value) {
    await browser.sleep(5000);
    await anyCcdPage.reloadPage();
    await anyCcdPage.click('Reasonable Adjustments Letters');
    await browser.sleep(1000);

    await caseDetailsPage.getFieldValue(field).then(function(actText) {
        assert.equal(value, actText);
    });
});

When(/^I update adjustment status to be "(.+)"$/, async function (adjustmentStatusOption) {
    await anyCcdPage
            .chooseOptionContainingText('#reasonableAdjustmentsLetters_appellant_0_reasonableAdjustmentStatus', adjustmentStatusOption);
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
    await browser.sleep(3000);
});
