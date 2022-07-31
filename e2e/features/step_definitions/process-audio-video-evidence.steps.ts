import { Given, Then, When } from 'cucumber';
import { browser, by, element } from 'protractor';
import { expect } from 'chai';

import { CaseDetailsPage } from '../../pages/case-details.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { DwpResponsePage } from '../../pages/dwpresponse.page';

const caseDetailsPage = new CaseDetailsPage();
const anyCcdPage = new AnyCcdFormPage();
const dwpresponse = new DwpResponsePage();

When(/^I upload AV evidence and complete Upload response event for "(.+)" case$/, async function (benefitType) {
    const dwpState = 'YES';
    await dwpresponse.uploadResponseWithAV(dwpState, benefitType);
    await anyCcdPage.selectIssueCode();
    await anyCcdPage.scrollBar('//button[@type=\'submit\']');
    await browser.sleep(2000);
    await anyCcdPage.scrollBar('//button[@type=\'submit\']');
    await browser.sleep(2000);
});

Then(/^I should see the AV evidence after clicking the AV tab$/, async function () {
    await anyCcdPage.clickTab('Audio/Video evidence');
    expect(await caseDetailsPage.isFieldValueDisplayed('Audio/video document url', 'test_av.mp3')).to.equal(true);
})

Then(/^I should see the RIP1 document$/, async function () {
    expect(await caseDetailsPage.isFieldValueDisplayed('RIP 1 document', 'rip1.pdf')).to.equal(true);
})

Then(/^I should see that the AV evidence was uploaded by "(.+)"$/, async function (party) {
    expect(await caseDetailsPage.isFieldValueDisplayed('Audio/video party uploaded', party)).to.equal(true);
})

When(/^I process the AV evidence using the "(.+)" action$/, async function (action) {
    await anyCcdPage.click('Continue');
    expect(await anyCcdPage.contentContains('Selected Audio/Video Evidence Details')).to.equal(true);
    await anyCcdPage.chooseOptionContainingText('#processAudioVideoAction', action);
    await element(by.id('directionNoticeContent')).sendKeys('Body test content');
    await element(by.id('signedBy')).sendKeys('Signed by test content');
    await element(by.id('signedRole')).sendKeys('Signed role test content');
    await anyCcdPage.click('Continue');
    expect(await anyCcdPage.contentContains('Preview Document')).to.equal(true);
    await anyCcdPage.click('Continue');
    expect(await anyCcdPage.contentContains('Event summary (optional)')).to.equal(true);
    await anyCcdPage.click('Submit');
    await browser.sleep(50000);
})

Then(/^I "(.+)" see the AV evidence in the FTA Documents tab$/, async function (assertion) {
    await anyCcdPage.clickTab('FTA Documents');
    const av_visibility = assertion === 'should';
    expect(await caseDetailsPage.isFieldValueDisplayed('Document type', 'Audio document')).to.equal(av_visibility);
    expect(await caseDetailsPage.isFieldValueDisplayed('Audio/video document', 'test_av.mp3')).to.equal(av_visibility);
})

Then(/^the bundle should include the AV evidence$/, async function () {
    await anyCcdPage.clickTab('Bundles');
    await browser.sleep(10000);
    expect(await caseDetailsPage.isFieldValueDisplayed('Folder Name', 'Further additions')).to.equal(true);
    expect(await anyCcdPage.contentContains('Audio/video evidence document')).to.equal(true);
    expect(await anyCcdPage.contentContains('Addition B - DWP - RIP 1 document for A/V file: test_av.mp3')).to.equal(true);
});

Given(/^I submit "(.+)" as "(.+)" in the Upload document FE event$/, async function (filename, type) {
    await anyCcdPage.click('Add new');
    await anyCcdPage.chooseOptionContainingText('#draftSscsFurtherEvidenceDocument_0_documentType', type);
    await dwpresponse.uploadFile('draftSscsFurtherEvidenceDocument_0_documentLink', filename);
    await browser.sleep(8000);
    await anyCcdPage.click('Continue');
    expect(await anyCcdPage.contentContains('Event summary (optional)')).to.equal(true);
    await anyCcdPage.click('Submit');
    await browser.sleep(2000);
})
