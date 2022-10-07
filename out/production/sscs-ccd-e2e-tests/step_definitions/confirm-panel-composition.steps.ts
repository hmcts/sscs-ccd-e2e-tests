import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { When, Then } from 'cucumber';
import { expect, assert } from 'chai';
import { CaseDetailsPage } from '../../pages/case-details.page';

const anyCcdFormPage = new AnyCcdFormPage();
const caseDetailsPage = new CaseDetailsPage();

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

When(/^I select "(.+)" to include a financial panel member for hearing$/, async function (action) {
    await anyCcdFormPage.clickElementById(`isFqpmRequired_${action}`);
    await anyCcdFormPage.click('Continue');
    expect(await anyCcdFormPage.pageHeadingContains('Confirm panel composition')).to.equal(true);
    await anyCcdFormPage.scrollBar('//button[@type=\'submit\']');
});

Then(/^"(.+)" tab should contain "(.+)" value for "(.+)" field$/, async function (tabName, fieldValue, fieldName) {
    await anyCcdFormPage.clickTab(tabName);
    await delay(10000);
    await caseDetailsPage.getFieldValue(fieldName).then(function(actText) {
        assert.equal(actText, fieldValue);
    });
});