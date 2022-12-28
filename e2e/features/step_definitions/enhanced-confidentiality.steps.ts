import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { Given, Then } from 'cucumber';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdFormPage();

Given('I {string} confidentiality request', async function (verdict) {
  await browser.sleep(1000);
  await anyCcdPage.clickElementById(`confidentialityRequestAppellantGrantedOrRefused-${verdict}ConfidentialityRequest`);
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
  await anyCcdPage.reloadPage();
});

Given('I upload supplementary response', async function () {
  await anyCcdPage.uploadFile('dwpSupplementaryResponseDoc_documentLink', 'issue1.pdf');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
  await browser.manage().window().maximize();
});

Then('I should see supplementary response in the Unprocessed Correspondence tab', async function () {
  await browser.sleep(3000);
  await anyCcdPage.clickTab('Unprocessed Correspondence');
  await anyCcdPage.isFieldValueDisplayed('Original document URL', 'issue1.pdf');
});

Given('I upload a document with redacted content', async function () {
  await anyCcdPage.uploadFile('scannedDocuments_0_editedUrl', 'issue2.pdf');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
  await anyCcdPage.clickIgnoreWarning();
  await browser.sleep(5000);
});

Then('I should see redacted content in Documents tab', async function () {
  await anyCcdPage.clickTab('Documents');
  await anyCcdPage.isFieldValueDisplayed('Original document URL', 'issue1.pdf');
  await anyCcdPage.isFieldValueDisplayed('Edited document URL', 'issue2.pdf');
  await browser.sleep(5000);
});
