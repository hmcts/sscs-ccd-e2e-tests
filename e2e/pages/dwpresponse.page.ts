import { browser, by, element } from 'protractor';
import { AnyPage } from './any.page';
import * as path from 'path';
import { AnyCcdFormPage } from './any-ccd-form.page';
import { NIGenerator } from '../helpers/ni-generator';
import { expect } from 'chai';

const anyCcdFormPage = new AnyCcdFormPage();
const niGenerator = new NIGenerator();
export class DwpResponsePage extends AnyPage {

    async uploadResponse(action: string, dwpState: string, benefitType: string) {
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        await this.uploadFile('dwpResponseDocument_documentLink', 'issue1.pdf');
        await this.uploadFile('dwpAT38Document_documentLink', 'issue2.pdf');
        await this.uploadFile('dwpEvidenceBundleDocument_documentLink', 'issue3.pdf');
        if (action === 'YES') {
            await browser.sleep(10000);
            await anyCcdFormPage.clickElementById('dwpFurtherInfo_Yes');
        } else {
            await browser.sleep(5000);
            await anyCcdFormPage.clickElementById('dwpFurtherInfo_No');
            await anyCcdFormPage.clickElementById('dwpUCB_No');
            await browser.sleep(3000);
        }
        if (dwpState === 'YES' && benefitType !== 'UC') {
            await anyCcdFormPage.chooseOptionByElementId('benefitCode', '001');
            await anyCcdFormPage.clickElementById('dwpUCB_No');
            await anyCcdFormPage.chooseOptionByElementId('dwpFurtherEvidenceStates', 'No action');
            await anyCcdFormPage.chooseOptionByElementId('dwpState', 'Response submitted (FTA)');
        }
    }

    async uploadOnlyResponseAndEvidence(action: string, dwpState: string, benefitType: string) {
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        await this.uploadFile('dwpResponseDocument_documentLink', 'issue1.pdf');
        await this.uploadFile('dwpEvidenceBundleDocument_documentLink', 'issue3.pdf');
        if (action === 'YES') {
            await browser.sleep(10000);
            await anyCcdFormPage.clickElementById('dwpFurtherInfo_Yes');
        } else {
            await browser.sleep(5000);
            await anyCcdFormPage.clickElementById('dwpFurtherInfo_No');
            await anyCcdFormPage.clickElementById('dwpUCB_No');
            await browser.sleep(3000);
        }
        if (dwpState === 'YES' && benefitType !== 'UC') {
            await anyCcdFormPage.chooseOptionByElementId('benefitCode', '001');
            await anyCcdFormPage.clickElementById('dwpUCB_No');
            await anyCcdFormPage.chooseOptionByElementId('dwpFurtherEvidenceStates', 'No action');
            await anyCcdFormPage.chooseOptionByElementId('dwpState', 'Response submitted (FTA)');
        }
    }

   async uploadResponseWithUcbAndPhme(dwpState: string, docLink: string, isUCB: boolean, isPHME: boolean, containsFurtherInfo) {
            await browser.waitForAngular();
            let remote = require('selenium-webdriver/remote');
            browser.setFileDetector(new remote.FileDetector());
            await this.uploadFile('dwpResponseDocument_documentLink', 'issue1.pdf');
            await this.uploadFile('dwpAT38Document_documentLink', 'issue2.pdf');
            await this.uploadFile('dwpEvidenceBundleDocument_documentLink', 'issue3.pdf');
            if (isUCB) {
                 await browser.sleep(1000);
                 await anyCcdFormPage.clickElementById('dwpUCB_Yes');
                 console.log('uploading ucb doc....')
                 await this.uploadFile(docLink, 'issue3.pdf');
                 await browser.sleep(10000);
            }

            if (isPHME) {
                await browser.sleep(1000);
                anyCcdFormPage.chooseOptionByElementId('dwpEditedEvidenceReason', 'Potentially harmful evidence');
                console.log('uploading edited doc....');
                await this.uploadFile('dwpEditedResponseDocument_documentLink', 'issue1.pdf');
                await this.uploadFile('dwpEditedEvidenceBundleDocument_documentLink', 'issue2.pdf');
                await this.uploadFile('appendix12Doc_documentLink', 'issue3.pdf');
            }

            if (containsFurtherInfo) {
                await anyCcdFormPage.clickElementById('dwpFurtherInfo_Yes');
                await browser.sleep(1000);
            } else {
                await browser.sleep(1000);
                await anyCcdFormPage.clickElementById('dwpFurtherInfo_No');
            }
            if (dwpState === 'YES') {
                anyCcdFormPage.chooseOptionByElementId('dwpState', 'Response submitted (FTA)');
            }
    }

    async uploadResponseWithoutPhmeDocs(dwpState: string, isPHME: boolean, containsFurtherInfo) {
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        await this.uploadFile('dwpResponseDocument_documentLink', 'issue1.pdf');
        await this.uploadFile('dwpAT38Document_documentLink', 'issue2.pdf');
        await this.uploadFile('dwpEvidenceBundleDocument_documentLink', 'issue3.pdf');

        if (isPHME) {
            await browser.sleep(1000);
            anyCcdFormPage.chooseOptionByElementId('dwpEditedEvidenceReason', 'Potentially harmful evidence');
        }

        if (containsFurtherInfo) {
            await anyCcdFormPage.clickElementById('dwpFurtherInfo_Yes');
            await browser.sleep(1000);
        } else {
            await browser.sleep(1000);
            await anyCcdFormPage.clickElementById('dwpFurtherInfo_No');
        }
        if (dwpState === 'YES') {
            anyCcdFormPage.chooseOptionByElementId('dwpState', 'Response submitted (FTA)');
        }
}

    async uploadDoc(docLink: string) {
      console.log('uploading a single doc...')
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        await this.uploadFile(docLink, 'issue1.pdf');
        await browser.sleep(100);

    }

    async uploadFile(inputElement: string, fileName: string) {
        let fileToUpload = '../dwpResponse/' + fileName,
        absolutePath = path.resolve(__dirname, fileToUpload);
        await element(by.id(inputElement)).sendKeys(absolutePath);
    }

    async uploadResponseWithJointParty(benefitType: string, disputed: string,
                                       disputedByOthersYesOrNo: string, dwpFurtherInfoYesOrNo: string) {
        const dwpState = 'NO';
        await this.uploadResponse(dwpFurtherInfoYesOrNo.toUpperCase(), dwpState, benefitType);
        await anyCcdFormPage.click('Continue');
        await this.elementsDisputedPage(disputed)
        await anyCcdFormPage.click('Continue');
        await this.issueCodePage(disputed);
        await anyCcdFormPage.click('Continue');
        await this.disputedPage(disputedByOthersYesOrNo, 'reference');
        await anyCcdFormPage.click('Continue');
        await this.jointParty('Yes');
        await anyCcdFormPage.click('Continue');
        await this.jointPartyName();
        await anyCcdFormPage.click('Continue');
        await this.jointPartyIdentityDetails();
        await anyCcdFormPage.click('Continue');
        await this.jointPartyAddress('Yes');
        await anyCcdFormPage.click('Continue');
        expect(await anyCcdFormPage.pageHeadingContains('Check your answers')).to.equal(true);
        await anyCcdFormPage.click('Submit');
    }

    async uploadResponseForChildSupport(action: string) {
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        await this.uploadFile('dwpResponseDocument_documentLink', 'issue1.pdf');
        await this.uploadFile('dwpAT38Document_documentLink', 'issue2.pdf');
        await this.uploadFile('dwpEvidenceBundleDocument_documentLink', 'issue3.pdf');

        await browser.sleep(2000);
        await anyCcdFormPage.chooseOptionByElementId('dwpEditedEvidenceReason', 'Confidentiality');
        console.log('uploading edited doc....');
        await this.uploadFile('dwpEditedResponseDocument_documentLink', 'issue1.pdf');
        await this.uploadFile('dwpEditedEvidenceBundleDocument_documentLink', 'issue2.pdf');

        await browser.sleep(2000);
        await anyCcdFormPage.chooseOptionByElementId('benefitCode', '022');
        await anyCcdFormPage.chooseOptionByElementId('issueCode', 'AA');
        await anyCcdFormPage.clickElementById(`dwpFurtherInfo_${action}`);
        await anyCcdFormPage.chooseOptionByElementId('dwpState', 'Appeal to-be registered');
        await anyCcdFormPage.click('Continue');
        await browser.sleep(2000);
    }

    async elementsDisputedPage(disputed: string) {
        await anyCcdFormPage.clickElementById('elementsDisputedList-' + disputed.toLowerCase());
    }

    async issueCodePage(disputed: string) {
        expect(await anyCcdFormPage.pageHeadingContains('Issue codes')).to.equal(true);
        await anyCcdFormPage.addNewCollectionItem(disputed);
        await browser.sleep(1000);
        await anyCcdFormPage.chooseOptionContainingText('#elementsDisputed' + disputed + '_0_issueCode', 'AD');
    }

    async disputedPage(yesOrNo: string, reference: string) {
        await anyCcdFormPage.clickElementById('elementsDisputedIsDecisionDisputedByOthers_' + yesOrNo);
        if (yesOrNo === 'Yes') {
            await element(by.id('elementsDisputedLinkedAppealRef')).sendKeys(reference);
        }
    }

    async jointParty(yesOrNo: string) {
        await anyCcdFormPage.clickElementById('jointParty_' + yesOrNo);
    }

    async jointPartyName() {
        expect(await anyCcdFormPage.pageHeadingContains('Joint party name')).to.equal(true);
        await anyCcdFormPage.chooseOptionContainingText('#jointPartyName_title', 'Mr');
        await element(by.id('jointPartyName_firstName')).sendKeys('Jp')
        await element(by.id('jointPartyName_lastName')).sendKeys('Party')
    }

    async jointPartyIdentityDetails() {
        await browser.sleep(2000);
        expect(await anyCcdFormPage.pageHeadingContains('Joint party identity details')).to.equal(true);
        await element(by.id('dob-day')).sendKeys('20')
        await element(by.id('dob-month')).sendKeys('12')
        await element(by.id('dob-year')).sendKeys('1980')

        const nino = niGenerator.myNIYearPrefix() + niGenerator.myNIMonthPrefix() + niGenerator.myNINumberFromDay() + 'C';
        await element(by.id('jointPartyIdentity_nino')).sendKeys(nino);
    }

    async jointPartyAddress(yesOrNo: string) {
        await anyCcdFormPage.clickElementById('jointPartyAddressSameAsAppellant_' + yesOrNo);
    }

    async uploadResponseWithAV(dwpState: string, benefitType: string) {
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        await this.uploadFile('dwpResponseDocument_documentLink', 'issue1.pdf');
        await this.uploadFile('dwpAT38Document_documentLink', 'issue2.pdf');
        await this.uploadFile('dwpEvidenceBundleDocument_documentLink', 'issue3.pdf');
        await browser.sleep(5000);

        await anyCcdFormPage.click('Add new')
        await this.uploadFile('dwpUploadAudioVideoEvidence_0_rip1Document', 'rip1.pdf');
        await this.uploadFile('dwpUploadAudioVideoEvidence_0_documentLink', 'test_av.mp3');
        await browser.sleep(8000);

        await anyCcdFormPage.clickElementById('dwpFurtherInfo_No');
        await anyCcdFormPage.clickElementById('dwpUCB_No');
        await browser.sleep(3000);
        await anyCcdFormPage.chooseOptionByElementId('benefitCode', '001');
        await anyCcdFormPage.chooseOptionByElementId('dwpFurtherEvidenceStates', 'No action');
        await anyCcdFormPage.chooseOptionByElementId('dwpState', 'Response submitted (FTA)');
    }

    async addOtherParties() {

        await anyCcdFormPage.click('Add new');
        await browser.sleep(2000);
        await anyCcdFormPage.fillValues('otherParties_0_name_firstName', 'Other');
        await anyCcdFormPage.fillValues('otherParties_0_name_lastName', 'Tester');
        await anyCcdFormPage.fillValues('otherParties_0_address_line1', '101, test');
        await anyCcdFormPage.fillValues('otherParties_0_address_town', 'test');
        await anyCcdFormPage.fillValues('otherParties_0_address_postcode', 'TS2 2ST');
        await anyCcdFormPage.clickElementById('otherParties_0_confidentialityRequired_No');
        await anyCcdFormPage.clickElementById('otherParties_0_unacceptableCustomerBehaviour_No');
        await anyCcdFormPage.chooseOptionByElementId('otherParties_0_role_name', 'Paying parent');
        await anyCcdFormPage.click('Continue');
        await browser.sleep(2000);
        await anyCcdFormPage.scrollBar('//button[@type=\'submit\']');
        await browser.sleep(10000);
    }
}
