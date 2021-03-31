import { When, Then } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { browser } from 'protractor';
import { assert, expect } from 'chai';
import { FurtherEvidencePage } from '../../pages/further-evidence.page';
import { CaseDetailsPage } from '../../pages/case-details.page';

const anyCcdPage = new AnyCcdPage();
const furtherEvidencePage = new FurtherEvidencePage();
const caseDetailsPage = new CaseDetailsPage();

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

When(/^I fill the further evidence form with "(.+)"$/, async function (requestType) {
    await anyCcdPage.chooseOptionContainingText('#furtherEvidenceAction', 'Other document type');
    await anyCcdPage.chooseOptionContainingText('#originalSender', 'DWP');
    await anyCcdPage.click('Add new');
    await browser.sleep(1000);

    await anyCcdPage.chooseOptionContainingText('#scannedDocuments_0_type', requestType);
    await furtherEvidencePage.uploadFile('scannedDocuments_0_url', 'issue1.pdf');
    await furtherEvidencePage.enterFileName('scannedDocuments_0_fileName', 'testfile.pdf');
    await furtherEvidencePage.enterScannedDate('20', '1', '2021');
    await browser.sleep(3000);
    await anyCcdPage.runAccessbility();

    await anyCcdPage.click('Continue');
    await anyCcdPage.runAccessbility();
    await anyCcdPage.click('Submit');
});

Then(/^the case should have successfully processed "(.+)" event$/, async function (event) {
    await delay(5000);
    await anyCcdPage.clickTab('History');
    expect(await caseDetailsPage.eventsPresentInHistory(event)).to.equal(true);
    await delay(500);
});

When(/^I fill the direction notice form with "(.+)"$/, async function (reinstatement) {

    await anyCcdPage.chooseOptionContainingText('#directionTypeDl', reinstatement);
    await anyCcdPage.clickElementById('generateNotice-No');
    await anyCcdPage.chooseOptionContainingText('#sscsInterlocDirectionDocument_documentType', 'Directions Notice');
    await furtherEvidencePage.uploadFile('sscsInterlocDirectionDocument_documentLink', 'issue2.pdf');
    await furtherEvidencePage.enterFileName('sscsInterlocDirectionDocument_documentFileName', 'testfile.pdf');
    await browser.sleep(3000);
    await anyCcdPage.runAccessbility();

    await anyCcdPage.click('Continue');
    await anyCcdPage.runAccessbility();
    await anyCcdPage.click('Submit');
});

Then(/^the case should be "(.+)" permissions for "(.+)"$/, async function (reinstatement, directionType) {
    let todayDate = new Date().toISOString().slice(0, 10);
    await delay(5000);
    await anyCcdPage.clickTab('Appeal Details');
    await anyCcdPage.reloadPage();
    await delay(10000);
    let outcomeText = (directionType === 'Reinstatement') ? 'Outcome' : 'outcome';
    let regText = (directionType === 'Reinstatement') ? 'Registered' : 'registered';
    await caseDetailsPage.getFieldValue(`${directionType} ${outcomeText}`).then(function(actText) {
        assert.equal(reinstatement, actText);
    });
    await caseDetailsPage.getFieldValue(`${directionType} ${regText}`).then(function(actText) {
        let date = new Date(actText);
        let actualDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
            .toISOString()
            .split('T')[0];
        assert.equal(todayDate, actualDate);
    });
});
