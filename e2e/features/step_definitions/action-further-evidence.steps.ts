import { When, Then } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { browser } from 'protractor';
import { assert } from 'chai';
import { FurtherEvidencePage } from '../../pages/further-evidence.page';
import { CaseDetailsPage } from '../../pages/case-details.page';

const anyCcdPage = new AnyCcdPage();
const furtherEvidencePage = new FurtherEvidencePage();
const caseDetailsPage = new CaseDetailsPage();

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

When(/^I fill the further evidence form with "(.+)" and "(.+)"$/, async function (actionType, requestType) {
    await anyCcdPage.chooseOptionContainingText('#furtherEvidenceAction', actionType);
    await anyCcdPage.click('Add new');
    await browser.sleep(1000);

    await anyCcdPage.chooseOptionContainingText('#scannedDocuments_0_type', requestType);
    await furtherEvidencePage.uploadFile('scannedDocuments_0_url', 'issue1.pdf');
    await furtherEvidencePage.enterFileName('scannedDocuments_0_fileName', 'testfile.pdf');
    await furtherEvidencePage.enterScannedDate('20', '1', '2021');
    await browser.sleep(3000);

    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
});

Then(/^the case should have successfully processed "(.+)" event$/, async function (event) {

    await anyCcdPage.click('History');
    await delay(1000);
});

When(/^I fill the direction notice form with "(.+)"$/, async function (reinstatement) {

    await anyCcdPage.chooseOptionContainingText('#directionTypeDl', reinstatement);
    await caseDetailsPage.addDayItems('directionDueDate');
    await anyCcdPage.clickElementById('generateNotice-No');
    await anyCcdPage.chooseOptionContainingText('#sscsInterlocDirectionDocument_documentType', 'Directions Notice');
    await furtherEvidencePage.uploadFile('sscsInterlocDirectionDocument_documentLink', 'issue2.pdf');
    await furtherEvidencePage.enterFileName('sscsInterlocDirectionDocument_documentFileName', 'testfile.pdf');
    await browser.sleep(3000);

    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
});

Then(/^the case should be "(.+)" permissions for "(.+)"$/, async function (reinstatement, directionType) {

    const today = new Date();
    let day = today.getDate();
    let month = today.toLocaleString('default', { month: 'short' });
    let year = today.getFullYear();

    let expDate = day + ' ' + month + ' ' + year;
    await anyCcdPage.click('Appeal Details');
    await anyCcdPage.reloadPage();
    await delay(10000);
    let outcomeText = (directionType === 'Reinstatement') ? 'Outcome' : 'outcome';
    let regText = (directionType === 'Reinstatement') ? 'Registered' : 'registered';
    await caseDetailsPage.getFieldValue(`${directionType} ${outcomeText}`).then(function(actText) {
        assert.equal(reinstatement, actText);
    });
    await caseDetailsPage.getFieldValue(`${directionType} ${regText}`).then(function(actText) {
        assert.equal(expDate, actText);
    });
});
