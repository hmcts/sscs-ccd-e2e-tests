import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { NIGenerator } from '../../helpers/ni-generator';
import { DwpOffice } from '../../helpers/dwp-office';
import { Given, Then, When } from 'cucumber';
import { expect } from 'chai';
import { browser } from 'protractor';
import * as ccd  from '../../helpers/ccd';

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
        await anyCcdFormPage.addNewCollectionItem('Form OCR Data');
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

async function checkDataItems(formType: string) {
    let testData = (formType === 'SSCSPE') ? await formData : await sscsPeuFormData;
    for (let i = 0; i < testData.length; i++) {
        expect(
            await caseDetailsPage.isCollectionItemFieldValueDisplayed(
            'Form OCR Data',
            i + 1,
            'Key',
            testData[i].question
            )
        ).to.equal(true);
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

Given(/^I have a (.+) bulk-scanned document with (.+) fields$/, {timeout: 600 * 1000}, async function (benefit_code, formType) {
    await anyCcdPage.click('Create new case');
    expect(await anyCcdPage.pageHeadingContains('Create Case')).to.equal(true);
    await anyCcdFormPage.setCreateCaseFieldValue('Case type', 'SSCS Bulkscanning');
    await anyCcdPage.click('Start');

    expect(await anyCcdPage.pageHeadingContains('Envelope meta data')).to.equal(true);

    await caseDetailsPage.addEnvelopeDataItems('NEW_APPLICATION', '123456', 'test_po-box-jurisdiction', 'test_envelope');
    await caseDetailsPage.addDateItems('deliveryDate');
    await caseDetailsPage.addDateItems('openingDate');

    await addDataItems(benefit_code, formType);
    (formType === 'SSCSPE') ? await caseDetailsPage.addFormType('SSCS1PE') : await caseDetailsPage.addFormType('SSCS1PEU');
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
    expect(await caseDetailsPage.alertContains('has been created')).to.equal(true);
    expect(await caseDetailsPage.isFieldValueDisplayed(
        'Event',
        'Create an exception record'
    )).to.equal(true);
    await anyCcdPage.click('Form OCR');
    await checkDataItems(formType);
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
    await browser.sleep(5000)
    await anyCcdPage.clickTab('History');
    await anyCcdPage.reloadPage();
    await browser.sleep(5000)
    expect(await caseDetailsPage.isFieldValueDisplayed('End state', state)).to.equal(true);
});

Then(/^the bundles should be successfully listed in "(.+)" tab$/, async function (tabName) {
    await delay(10000);
    await caseDetailsPage.reloadPage();
    await anyCcdPage.clickTab('History');
    expect(await caseDetailsPage.eventsPresentInHistory('Stitching bundle complete')).to.equal(true);
    expect(await caseDetailsPage.eventsPresentInHistory('Create a bundle')).to.equal(true);
    await browser.sleep(500);
});

Then(/^The edited bundles should be successfully listed in "(.+)" tab$/, async function (tabName) {
    await delay(10000);
    await caseDetailsPage.reloadPage();
    await anyCcdPage.click(tabName);
    expect(await caseDetailsPage.eventsPresentInHistory('Create an edited bundle')).to.equal(true);
    await browser.sleep(500);
});

Then(/^the case bundle details should be listed in "(.+)" tab$/, async function (tabName) {
    await anyCcdPage.clickTab('Bundles');
    await browser.sleep(1000);
    expect(await caseDetailsPage.isFieldValueDisplayed('Stitch status', 'DONE')).to.equal(true);
    expect(await caseDetailsPage.isFieldValueDisplayed('Config used for bundle', 'SSCS Bundle')).to.equal(true);
});

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
    await delay(10000);
});

Given(/^I complete the event$/, async function () {
    await anyCcdPage.click('Submit');
});

Then(/^I should see case should be in "(.+)" state$/, async function (state) {
    await anyCcdPage.reloadPage();
    await browser.sleep(2000)
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
