import { browser, by, element } from 'protractor';
import { expect } from 'chai';
import { AnyPage } from './any.page';
import { AnyCcdPage } from './any-ccd.page';

const anyCcdPage = new AnyCcdPage();

export class PostponementRequestPage extends AnyPage {

    async enterPostponementRequestDetails() {
        await element(by.id('postponementRequestDetails'))
            .sendKeys('We would like to delay the hearing, since the Judge cannot attend this day.');
        await anyCcdPage.click('Continue');
        await browser.driver.sleep(2000)
        await anyCcdPage.click('Continue');
        await anyCcdPage.click('Submit');
    }

    async actionPostponementRequest(action: string) {
        await browser.sleep(1000);
        await anyCcdPage.chooseOptionByElementId('actionPostponementRequestSelected', action);
        await browser.sleep(500);
        if (action === 'Send to Judge') {
            await element(by.id('postponementRequestDetails'))
                .sendKeys('We would like to delay the hearing, since the Judge cannot attend this day.');
        } else {
            await element(by.id('bodyContent'))
                .sendKeys('We would like to delay the hearing, since the Judge cannot attend this day.');
            await element(by.id('reservedToJudge')).sendKeys('Reserve to judge');
            await element(by.id('signedBy')).sendKeys('Mr Penworthy');
            await element(by.id('signedRole')).sendKeys('CTSC');
            if (action === 'Grant Postponement') {
                await anyCcdPage.chooseOptionByElementId('listingOption', 'Ready to List');
            }
            await anyCcdPage.click('Continue');
            await browser.driver.sleep(2000)
        }
        await anyCcdPage.click('Continue');
        await anyCcdPage.click('Submit');
        await browser.driver.sleep(2000);
    }

    async verifyInterlocStatus(action: string) {
        if (action === 'Send to Judge') {
            await anyCcdPage.clickTab('History');
            expect(await anyCcdPage.contentContains('Review by Judge')).to.equal(true);
        }
    }
}
