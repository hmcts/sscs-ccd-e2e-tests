import { When, Then } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { browser } from 'protractor';
import { expect } from 'chai';
import { FurtherEvidencePage } from '../../pages/further-evidence.page';

const anyCcdPage = new AnyCcdPage();
const furtherEvidencePage = new FurtherEvidencePage();

When('I upload a new document', async function () {
    await anyCcdPage.click('Add new');
    await anyCcdPage.chooseOptionContainingText('#sscsDocument_1_documentType', 'FTA evidence');
    await anyCcdPage.setText('//*[@id="sscsDocument_1_documentEmailContent"]', 'Test note for the the event');
    await furtherEvidencePage.uploadFile('sscsDocument_1_documentLink', 'issue1.pdf');
    await anyCcdPage.scrollPage('//*[@id="sscsDocument_1_shouldBundleIncludeDocLink_No"]');

    await browser.sleep(3000);
    await anyCcdPage.clickAction('//button[contains(text(),\'Continue\')]');
    await browser.sleep(3000);
    await anyCcdPage.clickAction('//button[contains(text(),\'Submit\')]');
});

Then('I should see uploaded file within documents tab', async function () {
    await anyCcdPage.clickTab('Documents');
    expect(await anyCcdPage.isFieldValueDisplayed('Type', 'FTA evidence')).to.equal(true);
    expect(await anyCcdPage.isFieldValueDisplayed('Email content', 'Test note for the the event')).to.equal(true);
    expect(await anyCcdPage.isFieldValueDisplayed('Original document URL', 'issue1.pdf')).to.equal(true);
});

Then('I should see uploaded file within Unprocessed correspondence tab', async function () {
    await anyCcdPage.clickTab('Unprocessed Correspondence');

    expect(await anyCcdPage.isFieldValueDisplayed('Document Type', 'Other')).to.equal(true);
    expect(await anyCcdPage.isFieldValueDisplayed('Original document URL', 'issue1.pdf')).to.equal(true);
});

When('I upload further evidence documents for Incomplete Application', async function () {

    await anyCcdPage.click('Add new');
    await anyCcdPage.chooseOptionContainingText('#draftFurtherEvidenceDocuments_0_documentType', 'Medical evidence');
    await anyCcdPage.setText('//*[@id="draftFurtherEvidenceDocuments_0_documentFileName"]', 'Medical test file');
    await furtherEvidencePage.uploadFile('draftFurtherEvidenceDocuments_0_documentLink', 'issue1.pdf');
    await anyCcdPage.chooseOptionContainingText('#interlocReviewState', 'Awaiting Admin Action');

    await browser.sleep(3000);
    await anyCcdPage.clickAction('//button[contains(text(),\'Continue\')]');
    await browser.sleep(3000);
    await anyCcdPage.clickAction('//button[contains(text(),\'Submit\')]');
});

Then('I should see uploaded file for incomplete case within documents tab', async function () {

    await anyCcdPage.clickTab('Documents');
    expect(await anyCcdPage.isFieldValueDisplayed('Type', 'Medical evidence')).to.equal(true);
    expect(await anyCcdPage.isFieldValueDisplayed('File name', 'Medical test file')).to.equal(true);
    expect(await anyCcdPage.isFieldValueDisplayed('Original document URL', 'issue1.pdf')).to.equal(true);
});
