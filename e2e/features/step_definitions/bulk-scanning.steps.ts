import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { NIGenerator } from '../../helpers/ni-generator';
import { DwpOffice } from '../../helpers/dwp-office';
import { Given, Then, When } from 'cucumber';
import { expect } from 'chai';
import { browser } from 'protractor';
import * as ccd  from '../../helpers/ccd';
import nino = require('fake-nino');
import * as faker from 'faker';

const anyCcdPage = new AnyCcdPage();
const anyCcdFormPage = new AnyCcdFormPage();
const caseDetailsPage = new CaseDetailsPage();
const {formData} = require('../data/scanned-case');
const {incompFormData} = require('../data/incomplete-scanned-case');
const {sscsPeuFormData} = require('../data/sscs1peu-case');
const niGenerator = new NIGenerator();
const dwpOffice = new DwpOffice();
let caseReference: string;

async function addDataItems(benefit_code: string, formType: string) {
    let testData = (formType === 'SSCSPE') ? await formData : await sscsPeuFormData;
    for (let i = 0; i < testData.length; i++) {
        if (testData[i].question === 'person1_nino' ) {
            testData[i].answer = niGenerator.myNIYearPrefix() + niGenerator.myNIMonthPrefix() + niGenerator.myNINumberFromDay() + 'A';
        }
        if (formData[i].question === 'benefit_type_description' ) {
            formData[i].answer = benefit_code;
        }
        if (formData[i].question === 'office' ) {
            formData[i].answer = dwpOffice.officeCode(benefit_code);
        }
        await anyCcdFormPage.addNewOCRCollectionItem();
        await anyCcdFormPage.setCollectionItemFieldValue(
            'Form OCR Data',
            i + 1,
            'Key',
            testData[i].question
        );
        await anyCcdFormPage.setCollectionItemFieldValue(
            'Form OCR Data',
            i + 1,
            'Value (Optional)',
            testData[i].answer
        );
    }

}

async function addIncompleteDataItems() {
    for (let i = 0; i < incompFormData.length; i++) {
        if (incompFormData[i].question === 'person1_nino' ) {
            incompFormData[i].answer = niGenerator.myNIYearPrefix() + niGenerator.myNIMonthPrefix() + niGenerator.myNINumberFromDay() + 'A';
        }
        await anyCcdFormPage.addNewCollectionItem('Form OCR Data');
        await anyCcdFormPage.setCollectionItemFieldValue(
            'Form OCR Data',
            i + 1,
            'Key',
            incompFormData[i].question
        );
        await anyCcdFormPage.setCollectionItemFieldValue(
            'Form OCR Data',
            i + 1,
            'Value (Optional)',
            incompFormData[i].answer
        );
    }

}

async function checkIncompDataItems() {
    for (let i = 0; i < incompFormData.length; i++) {
        expect(
            await caseDetailsPage.isCollectionItemFieldValueDisplayed(
            'Form OCR Data',
            i + 1,
            'Key',
            incompFormData[i].question
            )
        ).to.equal(true);
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function createSSCSCase() {
    await anyCcdPage.chooseOptionByValue('#cc-case-type', 'Benefit');
    await anyCcdPage.chooseOptionByValue('#cc-event', 'validAppealCreated');
    await anyCcdPage.click('Start');
    await browser.sleep(2000);

    await enterMrnDate();
    await enterAppellantDetails();
    await enterAddressDetails();
    await enterBenefitDetails();
}

async function enterMrnDate() {

    await browser.sleep(2000);
    await caseDetailsPage.addDayItems('caseCreated');
    await anyCcdPage.chooseOptionByValue('#appeal_receivedVia', '1: Paper');
    await caseDetailsPage.addDayItems('mrnDate');
}

async function enterAppellantDetails() {

    await browser.sleep(2000);
    await anyCcdPage.fillValues('appeal_appellant_name_title', 'Mr');
    await anyCcdPage.fillValues('appeal_appellant_name_firstName', faker.name.firstName());
    await anyCcdPage.fillValues('appeal_appellant_name_lastName', faker.name.lastName());

    await browser.sleep(2000);
    await anyCcdPage.fillValues('dob-day', '10');
    await anyCcdPage.fillValues('dob-month', '3');
    await anyCcdPage.fillValues('dob-year', '1988');
    await anyCcdPage.fillValues('appeal_appellant_identity_nino', nino.generate());
}

async function enterAddressDetails() {

    await browser.sleep(2000);
    await anyCcdPage.fillValues('appeal_appellant_address_line1', '1000, test');
    await anyCcdPage.fillValues('appeal_appellant_address_line2', faker.address.streetAddress());
    await anyCcdPage.fillValues('appeal_appellant_address_line3', 'test');
    await anyCcdPage.fillValues('appeal_appellant_address_town', faker.address.city());
    await anyCcdPage.fillValues('appeal_appellant_address_postcode', 'TS1 1ST');
}

async function enterBenefitDetails() {

    await browser.sleep(4000);
    await anyCcdPage.chooseOptionByValue('#appeal_appellant_role_name', '1: payingParent');
    await anyCcdPage.fillValues('appeal_benefitType_code', 'childSupport');
    await anyCcdPage.fillValues('appeal_benefitType_description', 'Child Support');
    await anyCcdPage.chooseOptionByValue('#appeal_hearingType', '3: paper');
    await anyCcdPage.click('Continue');
    await browser.sleep(2000);
    await anyCcdPage.scrollBar('//button[@type=\'submit\']');
    await browser.sleep(2000);
}

Given(/^I create an child support case$/, async function() {
    await anyCcdPage.click('Create case');
    expect(await anyCcdPage.pageHeadingContains('Create Case')).to.equal(true);
    await browser.sleep(3000);
    await createSSCSCase();
    await browser.sleep(5000);

    await caseDetailsPage.doNextStep('Admin - update event');
    await anyCcdPage.click('Go');
    await browser.sleep(2000);
    await anyCcdPage.chooseOptionByValue('#createdInGapsFrom', '1: readyToList');
    await anyCcdPage.click('Continue');
    await browser.sleep(2000);
    await anyCcdPage.scrollBar('//button[@type=\'submit\']');
    await browser.sleep(2000);

});

Given(/^I have a (.+) bulk-scanned document with (.+) fields$/, {timeout: 600 * 1000}, async function (benefit_code, formType) {
    await anyCcdPage.click('Create case');
    expect(await anyCcdPage.pageHeadingContains('Create Case')).to.equal(true);
    await browser.sleep(3000);
    await anyCcdFormPage.setCreateCaseFieldValue('Case type', 'SSCS Bulkscanning');
    await anyCcdPage.click('Start');

    expect(await anyCcdPage.pageHeadingContains('Envelope meta data')).to.equal(true);

    await caseDetailsPage.addEnvelopeDataItems('NEW_APPLICATION', '123456', 'test_po-box-jurisdiction', 'test_envelope');
    await caseDetailsPage.addDateItems('deliveryDate');
    await caseDetailsPage.addDateItems('openingDate');
    await browser.sleep(3000);

    await addDataItems(benefit_code, formType);
    (formType === 'SSCSPE') ? await caseDetailsPage.addFormType('SSCS1PE') : await caseDetailsPage.addFormType('SSCS1PEU');
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
    await browser.sleep(3000);
    expect(await caseDetailsPage.alertContains('has been created')).to.equal(true);
    expect(await caseDetailsPage.isFieldValueDisplayed(
        'Event',
        'Create an exception record'
    )).to.equal(true);
    await browser.sleep(3000);
});

Given('I have a PIP bulk-scanned document filled with incomplete fields', async function() {
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
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');

    expect(await caseDetailsPage.alertContains('has been created')).to.equal(true);
    expect(await caseDetailsPage.isFieldValueDisplayed(
        'Event',
        'Create an exception record'
    )).to.equal(true);
    await anyCcdPage.click('Form OCR');
    await checkIncompDataItems();
});

When(/^I choose "(.+)" for an incomplete application$/, async function (action) {
    await browser.sleep(500)
    await caseDetailsPage.doNextStep(action);
    await anyCcdPage.click('Go');
    expect(await anyCcdPage.pageHeadingContains(action)).to.equal(true);

    await anyCcdPage.click('Continue');
    expect(await anyCcdPage.pageHeadingContains('Create new case from exception')).to.equal(true);

    await anyCcdPage.click('Submit');
    await anyCcdPage.click('Ignore Warning and Go');
    // expect(await anyCcdPage.pageHeadingContains('History')).to.equal(true);

});

When(/^I choose the next step "(.+)"$/, async function (action) {
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
            throw new Error(
                `Do not understand action "${action}"`
            );
    }

    await anyCcdPage.click('Go');
    expect(await anyCcdPage.pageHeadingContains(action)).to.equal(true);

    if (action === 'Create new case from exception') {
        await anyCcdPage.click('Continue');
        expect(await anyCcdPage.pageHeadingContains('Create new case from exception')).to.equal(true);
    }
    await anyCcdPage.click('Submit');

    expect(await anyCcdPage.pageHeadingContains('History')).to.equal(true);
});

Then(/^the case should be in "(.+)" state$/, async function (state) {
    await delay(15000);
    await anyCcdPage.reloadPage();
    await delay(8000);
    await anyCcdPage.clickTab('History');
    await delay(20000);
    expect(await caseDetailsPage.isFieldValueDisplayed('End state', state)).to.equal(true);
});

Then(/^the bundles should be successfully listed in "(.+)" tab$/, async function (tabName) {
    await delay(15000);
    await caseDetailsPage.reloadPage();
    await anyCcdPage.clickTab(tabName);
    await delay(20000);
    expect(await caseDetailsPage.eventsPresentInHistory('Stitching bundle complete')).to.equal(true);
    expect(await caseDetailsPage.eventsPresentInHistory('Create a bundle')).to.equal(true);
    await browser.sleep(3000);
});

Then(/^The edited bundles should be successfully listed in "(.+)" tab$/, async function (tabName) {
    await delay(15000);
    await caseDetailsPage.reloadPage();
    await anyCcdPage.clickTab(tabName);
    expect(await caseDetailsPage.eventsPresentInHistory('Create an edited bundle')).to.equal(true);
    await browser.sleep(3000);
});

Then(/^the Stitching bundle event should be successfully listed in "(.+)" tab$/, async function (tabName) {
    await delay(5000);
    await caseDetailsPage.reloadPage();
    await anyCcdPage.clickTab(tabName);
    expect(await caseDetailsPage.eventsPresentInHistory('Stitching bundle complete')).to.equal(true);
    await browser.sleep(500);
});

Then(/^the case bundle details should be listed in "(.+)" tab$/, async function (tabName) {
    await anyCcdPage.clickTab(tabName);
    await browser.sleep(1000);
    expect(await caseDetailsPage.isFieldValueDisplayed('Stitch status', 'DONE')).to.equal(true);
    expect(await caseDetailsPage.isFieldValueDisplayed('Config used for bundle', 'SSCS Bundle Original')).to.equal(true);
});

Then(/^the "(.+)" bundle configuration should have been used$/, async function (config) {
    expect(await caseDetailsPage.isFieldValueDisplayed('Config used for bundle', config)).to.equal(true);
})

Given('I preset up a test case', async function () {

    const ccdCreatedCase = await ccd.createCase('oral');
    caseReference = ccdCreatedCase.id;
});

Given(/^I presetup an "(.+)" SYA case$/, async function (caseType) {
    caseReference = await ccd.createSYACase(caseType);
});

Given(/^I navigate to an existing case$/, async function () {
    console.log(`the saved case id is ################## ${caseReference}`);
    await anyCcdPage.get(`/v2/case/${caseReference}`);
    // await delay(10000);
    await anyCcdPage.waitForSpinnerToHide();
});

Given(/^I complete the event$/, async function () {
    await anyCcdPage.click('Submit');
    await delay(2000);
});

When(/^I choose execute CCD event "(.+)"$/, async function (action) {
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
            throw new Error(
                `Do not understand action "${action}"`
            );
    }
});

Then(/^The case should end in "(.+)" state and interloc state should be in "(.+)"$/, async function (state: string, interlocState: string) {
    await delay(10000);
    await anyCcdPage.clickTab('History');
    await delay(5000);
    expect(await caseDetailsPage.isFieldValueDisplayed('End state', state)).to.equal(true);
    expect(await anyCcdPage.contentContains(interlocState)).to.equal(true);
    await browser.sleep(500);
});
