import { browser, by, element } from 'protractor';
import { AnyPage } from './any.page';
import { expect } from 'chai';
import { AnyCcdPage } from './any-ccd.page';

const anyCcdPage = new AnyCcdPage();
let hearingStatus: string = "waiting to be listed";

export class HearingDetailsPage extends AnyPage {

    async requestManualHearing() {

        await browser.manage().window().maximize();
        await anyCcdPage.clickTab('Hearings');
        await browser.sleep(1000);
        expect(await anyCcdPage.contentContains('Request a hearing')).to.equal(true);
        await anyCcdPage.click('Request a hearing');
        await browser.sleep(500);
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await this.doYouRequireAdditionalFacilities('No');
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await anyCcdPage.click('Continue');
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await element(by.id('inputLocationSearch')).sendKeys('CARDIFF CIVIL AND FAMILY JUSTICE CENTRE');
        await anyCcdPage.click('Add location');
        await browser.sleep(500);
        await anyCcdPage.click('Continue');
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await this.doYouWantSpecificJudge('No');
        await anyCcdPage.click('Tribunal Judge');
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await anyCcdPage.click('Submit request');
        await browser.sleep(2000);
        expect(await anyCcdPage.pageHeadingContains('Hearing request submitted')).to.equal(true);

        await anyCcdPage.clickElementByCss('.govuk-body .govuk-link');
        await browser.sleep(2000);
    }

    async verifyHearingStatusSummary() {
        // let hearingStatus: string = "waiting to be listed";
        expect(await anyCcdPage.contentContains(hearingStatus.toUpperCase())).to.equal(true);
        expect(await anyCcdPage.contentContains('Substantive')).to.equal(true);
    }

    async doYouWantSpecificJudge(yesOrNo: string) {
        await anyCcdPage.clickElementById('specific-judge-selection' + yesOrNo);
    }

    async doYouRequireAdditionalFacilities(yesOrNo: string) {
        await anyCcdPage.clickElementById('addition-security-confirmation' + yesOrNo);
    }

    async requestAutoHearing() {
        await browser.manage().window().maximize();
        await anyCcdPage.clickTab('Hearings');
        expect(await anyCcdPage.contentContains('Request a hearing')).to.equal(true);
    }

    async viewHearingDetails() {
        await anyCcdPage.click('View or edit');
        await browser.sleep(5000);
    }

    async verifyHearingVenue(venueName: string) {
        expect(await anyCcdPage.contentContains(hearingStatus.toUpperCase())).to.equal(true);
        expect(await anyCcdPage.contentContains(venueName.toUpperCase())).to.equal(true);
    }

    async verifyHearingDuration(hearingDuration: string) {
        expect(await anyCcdPage.contentContains(hearingDuration)).to.equal(true);
    }

    async verifyHearingDate(hearingStartDate: string) {
        expect(await anyCcdPage.contentContains(hearingStartDate)).to.equal(true);
    }

}
