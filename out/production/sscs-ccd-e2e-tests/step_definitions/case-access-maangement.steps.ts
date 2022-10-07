
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { Given } from 'cucumber';
import { assert } from 'chai';

const anyCcdPage = new AnyCcdPage();

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

Given('{string} tab should contain {string} value for case management {string} field',  async function (tabName, fieldValue, fieldName) {
    await delay(5000);
    await anyCcdPage.clickTab(tabName);
    await delay(10000);
    await anyCcdPage.getFieldValue(fieldName).then(function(actText) {
        assert.equal(actText, fieldValue);
    });
});
