import { When, Then } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { assert, expect } from 'chai';
import { FurtherEvidencePage } from '../../pages/further-evidence.page';
import { CaseDetailsPage } from '../../pages/case-details.page';

const anyCcdPage = new AnyCcdPage();
const furtherEvidencePage = new FurtherEvidencePage();
const caseDetailsPage = new CaseDetailsPage();

When(
  'I fill the further evidence form with {string} and {string}',
  async function (actionType: string, requestType: string) {
    expect(await anyCcdPage.pageHeadingContains('Action further evidence')).to.equal(true);
    await anyCcdPage.chooseOptionByValue('furtherEvidenceAction', actionType);
    await anyCcdPage.chooseOptionContainingText('originalSender', 'Appellant (or Appointee)');
    await anyCcdPage.clickAddNew();

    expect(await anyCcdPage.pageHeadingContains('Document Type')).to.equal(true);
    await anyCcdPage.chooseOptionContainingText('scannedDocuments_0_type', requestType);
    await anyCcdPage.uploadFile('scannedDocuments_0_url', 'issue1.pdf');
    await furtherEvidencePage.enterFileName('scannedDocuments_0_fileName', 'testfile.pdf');
    await furtherEvidencePage.enterScannedDate('20', '1', '2021');
    await anyCcdPage.clickElementById('scannedDocuments_0_includeInBundle_Yes');

    await anyCcdPage.clickContinue();
    await anyCcdPage.clickSubmit();
  }
);

When('I fill the further evidence form with {string} invalid file', async function (testFile: string) {
  expect(await anyCcdPage.pageHeadingContains('Action further evidence')).to.equal(true);
  await anyCcdPage.chooseOptionByValue('furtherEvidenceAction', 'sendToInterlocReviewByJudge');
  await anyCcdPage.chooseOptionContainingText('originalSender', 'Appellant (or Appointee)');
  await anyCcdPage.clickAddNew();

  await anyCcdPage.chooseOptionContainingText('scannedDocuments_0_type', 'Confidentiality request');
  await anyCcdPage.uploadFile('scannedDocuments_0_url', `${testFile}.pdf`);
  await furtherEvidencePage.enterFileName('scannedDocuments_0_fileName', 'testfile.pdf');
  await furtherEvidencePage.enterScannedDate('20', '1', '2021');
  await anyCcdPage.clickElementById('scannedDocuments_0_includeInBundle_Yes');

  await anyCcdPage.clickContinue();
});

Then('the case should have successfully processed {string} event', async function (event) {
  await anyCcdPage.clickTab('History');
  expect(await caseDetailsPage.eventsPresentInHistory(event)).to.equal(true);
});

When('I fill the direction notice form with {string}', async function (reinstatement) {
  await anyCcdPage.chooseOptionContainingText('directionTypeDl', reinstatement);
  await caseDetailsPage.addDayItems('directionDueDate');
  await anyCcdPage.scrollPage('//*[@id="generateNotice_No"]');
  await anyCcdPage.chooseOptionContainingText('sscsInterlocDirectionDocument_documentType', 'Directions Notice');
  await anyCcdPage.uploadFile('sscsInterlocDirectionDocument_documentLink', 'issue2.pdf');
  await furtherEvidencePage.enterFileName('sscsInterlocDirectionDocument_documentFileName', 'testfile.pdf');

  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
});

Then('the case should be {string} permissions for {string}', async function (reinstatement, directionType) {
  const todayDate = new Date().toISOString().slice(0, 10);
  // await anyCcdPage.reloadPage();
  await anyCcdPage.clickTab('Appeal Details');
  const outcomeText = directionType === 'Reinstatement' ? 'Outcome' : 'outcome';
  const regText = directionType === 'Reinstatement' ? 'Registered' : 'registered';
  await caseDetailsPage.getFieldValue(`${directionType} ${outcomeText}`).then(function (actText) {
    assert.equal(reinstatement, actText);
  });
  await caseDetailsPage.getFieldValue(`${directionType} ${regText}`).then(function (actText) {
    const date = new Date(actText);
    const actualDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    assert.equal(todayDate, actualDate);
  });
});

When('resend evidence to appellant and FTA user', async function () {
  await anyCcdPage.clickElementById('resendToAppellant_Yes');
  await anyCcdPage.clickElementById('resendToRepresentative_No');
  await anyCcdPage.clickElementById('resendToDwp_Yes');

  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
});

Then('I see {string} and {string} event being processed successfully', async function (eventName, anotherEventName) {
  // await caseDetailsPage.reloadPage();
  await anyCcdPage.clickTab('History');
  expect(await caseDetailsPage.eventsPresentInHistory(anotherEventName)).to.equal(true);
  expect(await caseDetailsPage.eventsPresentInHistory(eventName)).to.equal(true);
});

Then('I should still see previous uploaded file collection within documents tab', async function () {
  await anyCcdPage.clickTab('Documents');
  expect(await anyCcdPage.isFieldValueDisplayed('Type', 'Appellant evidence')).to.equal(true);
  expect(await anyCcdPage.isFieldValueDisplayed('Evidence issued', 'Yes')).to.equal(true);
  expect(await anyCcdPage.isFieldValueDisplayed('Original document URL', 'issue1.pdf')).to.equal(true);
});
