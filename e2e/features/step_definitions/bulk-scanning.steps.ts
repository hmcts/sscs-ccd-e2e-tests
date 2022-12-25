import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { generateNINumber } from '../../helpers/ni-generator';
import { DwpOffice } from '../../helpers/dwp-office';
import { Given, Then, When } from 'cucumber';
import { expect } from 'chai';
import { browser } from 'protractor';
import * as ccd from '../../helpers/ccd';
import { faker } from '@faker-js/faker/locale/en_GB';
import { Logger } from '@hmcts/nodejs-logging';

import { formData } from '../data/scannedCase';

import { incompleteFormData } from '../data/incompleteScannedCase';

import { sscsPeuFormData } from '../data/sscs1PeuCase';
import { Wait } from '../../enums/wait';

const anyCcdPage = new AnyCcdPage();
const anyCcdFormPage = new AnyCcdFormPage();
const caseDetailsPage = new CaseDetailsPage();

const logger = Logger.getLogger('bulk-scanning-steps.ts');

const dwpOffice = new DwpOffice();
let caseReference: string = null;

async function addDataItems(benefitCode: string, formType: string): Promise<void> {
  const promises: Array<Promise<void>> = [];
  const testData = formType === 'SSCSPE' ? formData : sscsPeuFormData;
  for (let i = 0; i < testData.length; i++) {
    if (testData[i].question === 'person1_nino') {
      testData[i].answer = generateNINumber();
    }
    if (formData[i].question === 'benefit_type_description') {
      formData[i].answer = benefitCode;
    }
    if (formData[i].question === 'office') {
      formData[i].answer = dwpOffice.officeCode(benefitCode);
    }
    promises.push(anyCcdFormPage.addNewOCRCollectionItem());
    promises.push(anyCcdFormPage.setCollectionItemFieldValue('Form OCR Data', i + 1, 'Key', testData[i].question));
    promises.push(
      anyCcdFormPage.setCollectionItemFieldValue('Form OCR Data', i + 1, 'Value (Optional)', testData[i].answer)
    );
  }
  await Promise.all(promises);
}

async function addIncompleteDataItems(): Promise<void> {
  const promises: Array<Promise<void>> = [];
  for (let i = 0; i < incompleteFormData.length; i++) {
    if (incompleteFormData[i].question === 'person1_nino') {
      incompleteFormData[i].answer = generateNINumber();
    }
    promises.push(anyCcdFormPage.addNewCollectionItem('Form OCR Data'));
    promises.push(
      anyCcdFormPage.setCollectionItemFieldValue('Form OCR Data', i + 1, 'Key', incompleteFormData[i].question)
    );
    promises.push(
      anyCcdFormPage.setCollectionItemFieldValue(
        'Form OCR Data',
        i + 1,
        'Value (Optional)',
        incompleteFormData[i].answer
      )
    );
  }
  await Promise.all(promises);
}

async function checkIncompleteDataItems(): Promise<void> {
  const promises: Array<Promise<boolean>> = [];
  for (let i = 0; i < incompleteFormData.length; i++) {
    promises.push(
      caseDetailsPage.isCollectionItemFieldValueDisplayed('Form OCR Data', i + 1, 'Key', incompleteFormData[i].question)
    );
  }
  const areFieldsDisplayed: Array<boolean> = await Promise.all(promises);
  areFieldsDisplayed.forEach((isFieldDisplayed) => expect(isFieldDisplayed).to.equal(true));
}

function delay(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enterMrnDate(): Promise<void> {
  await browser.sleep(2000);
  await caseDetailsPage.addDayItems('caseCreated');
  await anyCcdPage.chooseOptionByValue('appeal_receivedVia', '1: Paper');
  await caseDetailsPage.addDayItems('mrnDate');
}

async function enterAppellantDetails(): Promise<void> {
  await browser.sleep(2000);
  await anyCcdPage.fillValues('appeal_appellant_name_title', 'Mr');
  await anyCcdPage.fillValues('appeal_appellant_name_firstName', faker.name.firstName());
  await anyCcdPage.fillValues('appeal_appellant_name_lastName', faker.name.lastName());

  await browser.sleep(2000);
  await anyCcdPage.fillValues('dob-day', '10');
  await anyCcdPage.fillValues('dob-month', '3');
  await anyCcdPage.fillValues('dob-year', '1988');
  await anyCcdPage.fillValues('appeal_appellant_identity_nino', generateNINumber());
}

async function enterAddressDetails(): Promise<void> {
  await browser.sleep(2000);
  await anyCcdPage.fillValues('appeal_appellant_address_line1', '1000, test');
  await anyCcdPage.fillValues('appeal_appellant_address_line2', faker.address.streetAddress());
  await anyCcdPage.fillValues('appeal_appellant_address_line3', 'test');
  await anyCcdPage.fillValues('appeal_appellant_address_town', faker.address.city());
  await anyCcdPage.fillValues('appeal_appellant_address_postcode', 'TS1 1ST');
}

async function enterBenefitDetails(): Promise<void> {
  await anyCcdPage.chooseOptionByValue('appeal_appellant_role_name', '1: payingParent');
  await anyCcdPage.fillValues('appeal_benefitType_code', 'childSupport');
  await anyCcdPage.fillValues('appeal_benefitType_description', 'Child Support');
  await anyCcdPage.chooseOptionByValue('appeal_hearingType', '3: paper');
  await anyCcdPage.clickContinue();
  await anyCcdPage.scrollBar("//button[@type='submit']");
  await browser.sleep(2000);
}

async function createSSCSCase(): Promise<void> {
  await anyCcdPage.chooseOptionByValue('cc-case-type', 'Benefit');
  await anyCcdPage.chooseOptionByValue('cc-event', 'validAppealCreated');
  await anyCcdPage.click('Start');
  await browser.sleep(2000);

  await enterMrnDate();
  await enterAppellantDetails();
  await enterAddressDetails();
  await enterBenefitDetails();
}

Given('I create an child support case', async function () {
  await anyCcdPage.click('Create case');
  expect(await anyCcdPage.pageHeadingContains('Create Case')).to.equal(true);
  await browser.sleep(3000);
  await createSSCSCase();
  await browser.sleep(5000);

  await caseDetailsPage.doNextStep('Admin - update event');
  await anyCcdPage.click('Go');
  await anyCcdPage.chooseOptionByValue('createdInGapsFrom', '1: readyToList');
  await anyCcdPage.clickContinue();
  await anyCcdPage.scrollBar("//button[@type='submit']");
  await browser.sleep(2000);
});

Given(
  'I have a {word} bulk-scanned document with {word} fields',
  { timeout: 600 * 1000 },
  async function (benefitCode: string, formType: string): Promise<void> {
    await anyCcdPage.click('Create case');
    expect(await anyCcdPage.pageHeadingContains('Create Case')).to.equal(true);
    await browser.sleep(3000);
    await anyCcdFormPage.setCreateCaseFieldValue('Case type', 'SSCS Bulkscanning');
    await anyCcdPage.click('Start');

    expect(await anyCcdPage.pageHeadingContains('Envelope meta data')).to.equal(true);

    await caseDetailsPage.addEnvelopeDataItems(
      'NEW_APPLICATION',
      '123456',
      'test_po-box-jurisdiction',
      'test_envelope'
    );
    await caseDetailsPage.addDateItems('deliveryDate');
    await caseDetailsPage.addDateItems('openingDate');
    await browser.sleep(3000);

    await addDataItems(benefitCode, formType);
    if (formType === 'SSCSPE') {
      await caseDetailsPage.addFormType('SSCS1PE');
    } else {
      await caseDetailsPage.addFormType('SSCS1PEU');
    }
    await anyCcdPage.clickContinue();
    await anyCcdPage.clickSubmit();
    await browser.sleep(3000);
    expect(await caseDetailsPage.getAlertMessage()).to.equal('has been created');
    expect(await caseDetailsPage.isFieldValueDisplayed('Event', 'Create an exception record')).to.equal(true);
    await browser.sleep(3000);
  }
);

Given('I have a PIP bulk-scanned document filled with incomplete fields', async function () {
  await anyCcdPage.click('Create new case');
  expect(await anyCcdPage.pageHeadingContains('Create Case')).to.equal(true);
  await anyCcdFormPage.setCreateCaseFieldValue('Case type', 'SSCS Bulkscanning');
  await anyCcdPage.click('Start');

  expect(await anyCcdPage.pageHeadingContains('Envelope meta data')).to.equal(true);

  await caseDetailsPage.addEnvelopeDataItems('NEW_APPLICATION', '123456', 'test_po-box-jurisdiction', 'test_envelope');
  await caseDetailsPage.addDateItems('deliveryDate');
  await caseDetailsPage.addDateItems('openingDate');

  await addIncompleteDataItems();
  await caseDetailsPage.addFormType('test_form_type');
  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();

  expect(await caseDetailsPage.getAlertMessage()).to.equal('has been created');
  expect(await caseDetailsPage.isFieldValueDisplayed('Event', 'Create an exception record')).to.equal(true);
  await anyCcdPage.click('Form OCR');
  await checkIncompleteDataItems();
});

When('I choose {string} for an incomplete application', async function (action) {
  await browser.sleep(500);
  await caseDetailsPage.doNextStep(action);
  await anyCcdPage.click('Go');
  expect(await anyCcdPage.pageHeadingContains(action)).to.equal(true);

  await anyCcdPage.clickContinue();
  expect(await anyCcdPage.pageHeadingContains('Create new case from exception')).to.equal(true);

  await anyCcdPage.clickSubmit();
  await anyCcdPage.click('Ignore Warning and Go');
  // expect(await anyCcdPage.pageHeadingContains('History')).to.equal(true);
});

When('I choose the next step {string}', async function (action) {
  switch (action) {
    case 'Create new case from exception':
      await caseDetailsPage.doNextStep(action);
      break;
    case 'Create a bundle':
      await caseDetailsPage.doNextStep(action);
      break;
    case 'Admin - send to Ready to List':
      await caseDetailsPage.doNextStep(action);
      break;
    default:
      throw new Error(`Do not understand action "${action}"`);
  }

  await anyCcdPage.click('Go');
  expect(await anyCcdPage.pageHeadingContains(action)).to.equal(true);

  if (action === 'Create new case from exception') {
    await anyCcdPage.clickContinue();
    expect(await anyCcdPage.pageHeadingContains('Create new case from exception')).to.equal(true);
  }
  await anyCcdPage.clickSubmit();

  expect(await anyCcdPage.pageHeadingContains('History')).to.equal(true);
});

Then('the case should be in {string} state', async function (state: string): Promise<void> {
  await anyCcdPage.waitForEndState(state);
});

Then('the bundles should be successfully listed in {string} tab', async function (tabName) {
  await caseDetailsPage.reloadPage();
  await anyCcdPage.clickTab(tabName);
  if (await caseDetailsPage.eventsPresentInHistory('Stitching bundle complete')) {
    await delay(Wait.short);
    await caseDetailsPage.reloadPage();
    await anyCcdPage.clickTab(tabName);
  }
  expect(await caseDetailsPage.eventsPresentInHistory('Stitching bundle complete')).to.equal(true);
  expect(await caseDetailsPage.eventsPresentInHistory('Create a bundle')).to.equal(true);
  await browser.sleep(3000);
});

Then('The edited bundles should be successfully listed in {string} tab', async function (tabName) {
  await caseDetailsPage.reloadPage();
  await anyCcdPage.clickTab(tabName);
  if (await caseDetailsPage.eventsPresentInHistory('Create an edited bundle')) {
    await delay(Wait.short);
    await caseDetailsPage.reloadPage();
    await anyCcdPage.clickTab(tabName);
  }
  expect(await caseDetailsPage.eventsPresentInHistory('Create an edited bundle')).to.equal(true);
});

Then('the Stitching bundle event should be successfully listed in {string} tab', async function (tabName) {
  await caseDetailsPage.reloadPage();
  await anyCcdPage.clickTab(tabName);
  if (await caseDetailsPage.eventsPresentInHistory('Stitching bundle complete')) {
    await delay(Wait.veryShort);
    await caseDetailsPage.reloadPage();
    await anyCcdPage.clickTab(tabName);
  }
  expect(await caseDetailsPage.eventsPresentInHistory('Stitching bundle complete')).to.equal(true);
  await browser.sleep(500);
});

Then('the case bundle details should be listed in {string} tab', async function (tabName) {
  await anyCcdPage.clickTab(tabName);
  await browser.sleep(1000);
  expect(await caseDetailsPage.isFieldValueDisplayed('Stitch status', 'DONE')).to.equal(true);
  expect(await caseDetailsPage.isFieldValueDisplayed('Config used for bundle', 'SSCS Bundle Original')).to.equal(true);
});

Then('the {string} bundle configuration should have been used', async function (config) {
  expect(await caseDetailsPage.isFieldValueDisplayed('Config used for bundle', config)).to.equal(true);
});

Given('I preset up a test case', async function () {
  const ccdCreatedCase = await ccd.createCase('oral');
  caseReference = ccdCreatedCase.id;
});

Given('I presetup an {string} SYA case', async function (caseType) {
  caseReference = await ccd.createSYACase(caseType);
});

Given('I navigate to an existing case', async function () {
  logger.info(`the saved case id is ################## ${caseReference}`);
  await anyCcdPage.get(`/v2/case/${caseReference}`);
  await anyCcdPage.waitForSpinner();
});

Given('I complete the event', async function () {
  await anyCcdPage.clickSubmit();
  await delay(2000);
});

When('I choose execute CCD event {string}', async function (action) {
  switch (action) {
    case 'Create new case from exception':
      await caseDetailsPage.doNextStep(action);
      break;
    case 'Create a bundle':
      await caseDetailsPage.doNextStep(action);
      break;
    case 'Admin - send to Ready to List':
      await anyCcdPage.selectEvent(action);
      break;
    default:
      throw new Error(`Do not understand action "${action}"`);
  }
});

Then(
  'The case should end in {string} state and interloc state should be in {string}',
  async function (state: string, interlocState: string) {
    await anyCcdPage.waitForEndState(state);
    expect(await anyCcdPage.contentContains(interlocState)).to.equal(true);
  }
);
