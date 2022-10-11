import { browser, by, element } from 'protractor';
import { AnyPage } from './any.page';
import { expect } from 'chai';
import { AnyCcdPage } from './any-ccd.page';

const anyCcdPage = new AnyCcdPage();

export class HearingDetailsPage extends AnyPage {

    async requestHearing() {

        await browser.sleep(500);
        await anyCcdPage.clickTab('Hearings');
        await browser.sleep(2000);
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
    }

    async doYouWantSpecificJudge(yesOrNo: string) {
        await anyCcdPage.clickElementById('specific-judge-selection' + yesOrNo);
    }

    async doYouRequireAdditionalFacilities(yesOrNo: string) {
        await anyCcdPage.clickElementById('addition-security-confirmation' + yesOrNo);
    }
}
