import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { When, Then } from 'cucumber';
import { expect, assert } from 'chai';
import { CaseDetailsPage } from '../../pages/case-details.page';

const anyCcdFormPage = new AnyCcdFormPage();
const caseDetailsPage = new CaseDetailsPage();

When('I select {string} to include a financial panel member for hearing', async function (action) {
  await anyCcdFormPage.clickElementById(`isFqpmRequired_${action}`);
  await anyCcdFormPage.clickContinue();
  expect(await anyCcdFormPage.pageHeadingContains('Confirm panel composition')).to.equal(true);
  await anyCcdFormPage.scrollBar("//button[@type='submit']");
});

Then('{string} tab should contain {string} value for {string} field', async function (tabName, fieldValue, fieldName) {
  await anyCcdFormPage.clickTab(tabName);
  await caseDetailsPage.getFieldValue(fieldName).then(function (actText) {
    assert.equal(actText, fieldValue);
  });
});
