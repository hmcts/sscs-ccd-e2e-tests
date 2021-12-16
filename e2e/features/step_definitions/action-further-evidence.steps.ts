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

When(/^I fill the further evidence form with "(.+)" and "(.+)"$/, async function (actionType, requestType) {
    expect(await anyCcdPage.pageHeadingContains('Action further evidence')).to.equal(true);
    await anyCcdPage.chooseOptionContainingText('#furtherEvidenceAction', actionType);
    await anyCcdPage.chooseOptionContainingText('#originalSender', 'Appellant (or Appointee)');
    await anyCcdPage.click('Add new');
    await browser.sleep(1000);

    expect(await anyCcdPage.pageHeadingContains('Document Type')).to.equal(true);
    await anyCcdPage.chooseOptionContainingText('#scannedDocuments_0_type', requestType);
    await furtherEvidencePage.uploadFile('scannedDocuments_0_url', 'issue1.pdf');
    await furtherEvidencePage.enterFileName('scannedDocuments_0_fileName', 'testfile.pdf');
    await furtherEvidencePage.enterScannedDate('20', '1', '2021');
    await anyCcdPage.clickElementById('scannedDocuments_0_includeInBundle_Yes');
    await browser.sleep(3000);

    await anyCcdPage.click('Continue');
    await browser.sleep(1000);
    await anyCcdPage.click('Submit');
});

When(/^I fill the further evidence form with "(.+)" invalid file$/, async function (testFile: string) {
    expect(await anyCcdPage.pageHeadingContains('Action further evidence')).to.equal(true);
    await anyCcdPage.chooseOptionContainingText('#furtherEvidenceAction', 'Review by Judge');
    await anyCcdPage.chooseOptionContainingText('#originalSender', 'Appellant (or Appointee)');
    await anyCcdPage.click('Add new');
    await browser.sleep(1000);

    await anyCcdPage.chooseOptionContainingText('#scannedDocuments_0_type', 'Confidentiality request');
    await furtherEvidencePage.uploadFile('scannedDocuments_0_url', `${testFile}.pdf`);
    await furtherEvidencePage.enterFileName('scannedDocuments_0_fileName', 'testfile.pdf');
    await furtherEvidencePage.enterScannedDate('20', '1', '2021');
    await anyCcdPage.clickElementById('scannedDocuments_0_includeInBundle_Yes');
    await browser.sleep(3000);

    await anyCcdPage.click('Continue');
});

Then(/^the case should have successfully processed "(.+)" event$/, async function (event) {
    await delay(5000);
    await anyCcdPage.clickTab('History');
    expect(await caseDetailsPage.eventsPresentInHistory(event)).to.equal(true);
    await delay(500);
});

When(/^I fill the direction notice form with "(.+)"$/, async function (reinstatement) {

    await anyCcdPage.chooseOptionContainingText('#directionTypeDl', reinstatement);
    await caseDetailsPage.addDayItems('directionDueDate');
    await browser.sleep(3000);
    await anyCcdPage.scrollPage('//*[@id="generateNotice_No"]');
    await browser.sleep(2000);
    await anyCcdPage.chooseOptionContainingText('#sscsInterlocDirectionDocument_documentType', 'Directions Notice');
    await furtherEvidencePage.uploadFile('sscsInterlocDirectionDocument_documentLink', 'issue2.pdf');
    await furtherEvidencePage.enterFileName('sscsInterlocDirectionDocument_documentFileName', 'testfile.pdf');
    await browser.sleep(3000);

    await anyCcdPage.clickAction('//button[contains(text(),\'Continue\')]');
    await browser.sleep(2000);
    await anyCcdPage.clickAction('//button[contains(text(),\'Submit\')]');
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

When('resend evidence to appellant and dwp user', async function () {

    await browser.sleep(2000);
    await anyCcdPage.clickElementById('resendToAppellant_Yes');
    await anyCcdPage.clickElementById('resendToRepresentative_No');
    await anyCcdPage.clickElementById('resendToDwp_Yes');

    await anyCcdPage.clickAction('//button[contains(text(),\'Continue\')]');
    await browser.sleep(2000);
    await anyCcdPage.clickAction('//button[contains(text(),\'Submit\')]');

});

Then('I see {string} and {string} event being processed successfully', async function (eventName, anotherEventName) {

    await delay(5000);
    await caseDetailsPage.reloadPage();
    await anyCcdPage.clickTab('History');
    expect(await caseDetailsPage.eventsPresentInHistory(anotherEventName)).to.equal(true);
    expect(await caseDetailsPage.eventsPresentInHistory(eventName)).to.equal(true);
    await browser.sleep(500);
});

Then('I should still see previous uploaded file collection within documents tab', async function () {
    await anyCcdPage.clickTab('Documents');
    expect(await anyCcdPage.isFieldValueDisplayed('Type', 'Appellant evidence')).to.equal(true);
    expect(await anyCcdPage.isFieldValueDisplayed('Evidence issued', 'Yes')).to.equal(true);
    expect(await anyCcdPage.isFieldValueDisplayed('Original document URL', 'issue1.pdf')).to.equal(true);
});
