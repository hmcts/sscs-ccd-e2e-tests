import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { Given, Then } from 'cucumber';
import { browser } from 'protractor';
import { DwpResponsePage } from '../../pages/dwpresponse.page';

const anyCcdPage = new AnyCcdFormPage();
const dwpresponse = new DwpResponsePage();

Given(/^I "(.+)" confidentiality request$/, async function (verdict) {
    await browser.sleep(1000);
    await anyCcdPage.clickElementById('confidentialityRequestAppellantGrantedOrRefused-' + verdict + 'ConfidentialityRequest')
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Submit');
    await browser.sleep(5000);
    await anyCcdPage.reloadPage();
})

Given(/^I upload supplementary response$/, async function () {
    await dwpresponse.uploadFile('dwpSupplementaryResponseDoc_documentLink', 'issue1.pdf')
    await browser.sleep(4000);
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Submit');
    await browser.sleep(5000);
    await browser.manage().window().maximize();
})

Then(/^I should see supplementary response in the Unprocessed Correspondence tab$/, async function () {
    await browser.sleep(3000);
    await anyCcdPage.clickTab('Unprocessed Correspondence');
    await browser.sleep(500);
    await anyCcdPage.isFieldValueDisplayed('Original document URL', 'issue1.pdf')
})

Given(/^I upload a document with redacted content$/, async function () {
    await dwpresponse.uploadFile('scannedDocuments_0_editedUrl', 'issue2.pdf')
    await browser.sleep(1500);
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Submit');
    await browser.sleep(500);
    await anyCcdPage.click('Ignore Warning and Go');
    await browser.sleep(5000);
})

Then(/^I should see redacted content in Documents tab$/, async function () {
    await anyCcdPage.clickTab('Documents');
    await browser.sleep(500);
    await anyCcdPage.isFieldValueDisplayed('Original document URL', 'issue1.pdf')
    await anyCcdPage.isFieldValueDisplayed('Edited document URL', 'issue2.pdf')
    await browser.sleep(5000);
})
