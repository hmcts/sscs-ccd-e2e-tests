import { When, Then } from 'cucumber';
import { browser } from 'protractor';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { assert, expect } from 'chai';
import { CaseDetailsPage } from '../../pages/case-details.page';

const anyCcdPage = new AnyCcdPage();
const caseDetailsPage = new CaseDetailsPage();

When('generate a letter in {string} with {string} option', async function (letterFormat, adjustmentOption) {
  await anyCcdPage.chooseOptionContainingText('reasonableAdjustmentChoice', letterFormat);
  if (adjustmentOption === 'Yes') {
    await anyCcdPage.clickElementById(`reasonableAdjustments_appellant_wantsReasonableAdjustment_${adjustmentOption}`);
    await anyCcdPage.fillValues('reasonableAdjustments_appellant_reasonableAdjustmentRequirements', 'A2');
    await anyCcdPage.clickElementById('reasonableAdjustments_representative_wantsReasonableAdjustment_No');
  } else if (adjustmentOption === 'No') {
    await anyCcdPage.clickElementById(`reasonableAdjustments_appellant_wantsReasonableAdjustment_${adjustmentOption}`);
    await anyCcdPage.clickElementById('reasonableAdjustments_representative_wantsReasonableAdjustment_No');
  } else if (adjustmentOption === 'otherPartyYes') {
    await anyCcdPage.clickElementById(`reasonableAdjustments_appellant_wantsReasonableAdjustment_No`);
    await anyCcdPage.clickElementById('reasonableAdjustments_representative_wantsReasonableAdjustment_No');
    await anyCcdPage.clickElementById(`otherParties_0_reasonableAdjustment_wantsReasonableAdjustment_Yes`);
    await anyCcdPage.fillValues('otherParties_0_reasonableAdjustment_reasonableAdjustmentRequirements', 'A2');
  } else if (adjustmentOption === 'otherPartyNo') {
    await anyCcdPage.clickElementById(`otherParties_0_reasonableAdjustment_wantsReasonableAdjustment_No`);
    await anyCcdPage.clickElementById('reasonableAdjustments_representative_wantsReasonableAdjustment_No');
    await anyCcdPage.clickElementById(`reasonableAdjustments_appellant_wantsReasonableAdjustment_No`);
    await anyCcdPage.clickElementById(`otherParties_0_reasonableAdjustment_wantsReasonableAdjustment_No`);
  } else {
    throw new Error('No adjustment option passed in test');
  }
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
});

Then('reasonable adjustment details are seen in summary page', async function () {
  await anyCcdPage.isFieldValueDisplayed('Wants Reasonable Adjustment', 'Yes');
  await anyCcdPage.isFieldValueDisplayed('Alternative Format Requirements', 'A2');
});

Then('reasonable adjustment details are not seen in summary page', async function () {
  expect(await anyCcdPage.isFieldValueDisplayed('Wants Reasonable Adjustment', 'Yes')).to.equal(false);
  expect(await anyCcdPage.isFieldValueDisplayed('Alternative Format Requirements', 'A2')).to.equal(false);
});

Then('Reasonable adjustment tab is seen with {string} as {string}', async function (field, value) {
  await anyCcdPage.reloadPage();
  await browser.manage().window().maximize();
  await anyCcdPage.clickTab('Reasonable Adjustments Letters');

  await caseDetailsPage.getFieldValue(field).then(function (actText) {
    assert.equal(value, actText);
  });
});

When('I update adjustment status to be {string}', async function (adjustmentStatusOption) {
  await anyCcdPage.chooseOptionContainingText(
    'reasonableAdjustmentsLetters_appellant_0_reasonableAdjustmentStatus',
    adjustmentStatusOption
  );
  await anyCcdPage.scrollBar('//div/form/div/button[2]');
  await anyCcdPage.clickSubmit();
});
