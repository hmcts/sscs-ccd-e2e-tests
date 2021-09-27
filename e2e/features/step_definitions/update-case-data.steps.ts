import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { Then } from 'cucumber';
// import { expect } from 'chai';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdPage();
const anyCcdFormPage = new AnyCcdFormPage();

Then(/^I should update case with a valid nino$/, async function () {

    await anyCcdFormPage.setTextFiledValueNull('appeal_appellant_identity_nino');
    await anyCcdFormPage.setValueByElementId('appeal_appellant_identity_nino', 'SK982165A');
    await browser.sleep(3000);

    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
});
