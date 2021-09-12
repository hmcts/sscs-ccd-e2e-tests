import { browser, by, element } from 'protractor';
import { AnyPage } from './any.page';
import { AnyCcdPage } from './any-ccd.page';
import * as path from 'path';

const anyCcdPage = new AnyCcdPage();

export class HearingRecordingPage extends AnyPage {

    async addHearingRecording() {
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        await this.uploadFile('hearingRecording_recordings_0_documentLink', 'test_av.mp3');
        await browser.sleep(8000);
    }

    async uploadFile(inputElement: string, fileName: string) {
        let fileToUpload = '../dwpResponse/' + fileName,
        absolutePath = path.resolve(__dirname, fileToUpload);
        await element(by.id(inputElement)).sendKeys(absolutePath);
    }

    async uploadHearingRecording() {
        await anyCcdPage.clickElementById('hearingRecording_hearingType-final');
        this.addHearingRecording();
        await anyCcdPage.click('Continue');
        await anyCcdPage.click('Submit');
    }

    async selectHearing() {
        await element(by.id('selectHearingDetails')).element(by.xpath('//*[@id="selectHearingDetails"]/option[1]')).click();
    }

    async requestDwpHearingRecording() {
        await element(by.id('processHearingRecordingRequests_0_dwp'))
            .element(by.xpath('//*[@id="processHearingRecordingRequests_0_dwp"]/option[1]')).click();
    }

    async grantRequestDwpHearingRecording() {
        await element(by.id('processHearingRecordingRequests_0_dwp'))
            .element(by.xpath('//*[@id="processHearingRecordingRequests_0_dwp"]/option[1]')).click();
    }
}
