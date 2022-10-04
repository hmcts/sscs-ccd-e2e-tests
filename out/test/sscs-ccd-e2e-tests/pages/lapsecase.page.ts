import { browser, by, element } from 'protractor';
import { AnyPage } from './any.page';
import { AnyCcdPage } from './any-ccd.page';
import { expect } from 'chai';
import * as path from 'path';

const anyCcdPage = new AnyCcdPage();
export class LapseCasePage extends AnyPage {

    async uploadResponse(action: string) {
        expect(await anyCcdPage.pageHeadingContains('Lapse appeal')).to.equal(true);
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        await this.uploadFile('dwpLT203_documentLink', 'issue1.pdf');
        await this.uploadFile('dwpLapseLetter_documentLink', 'issue2.pdf');
        await browser.sleep(5000);

        await anyCcdPage.chooseOptionByElementId('dwpState', 'No action');
        await anyCcdPage.chooseOptionByElementId('interlocReviewState', 'N/A');
        await anyCcdPage.click('Continue');
    }

    async uploadFile(inputElement: string, fileName: string) {
        let fileToUpload = '../dwpResponse/' + fileName,
        absolutePath = path.resolve(__dirname, fileToUpload);
        await element(by.id(inputElement)).sendKeys(absolutePath);
    }
}
