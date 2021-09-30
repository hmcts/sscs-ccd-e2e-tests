import { browser, by, element } from 'protractor';
import { AnyPage } from './any.page';
import { AnyCcdPage } from './any-ccd.page';
import * as path from 'path';

const anyCcdPage = new AnyCcdPage();

export class HearingRecordingPage extends AnyPage {

    async addHearingRecording() {
        console.log('------------- Add new');
        // tslint:disable-next-line:max-line-length
        await element(by.id('hearingRecording_recordings')).element(by.xpath('//*[@id="hearingRecording_recordings"]/div/button[1]')).click();
        await browser.sleep(500);
        console.log('------------- Add new clicked');
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        console.log('------------- upload hearing before 3');
        await this.uploadFile('hearingRecording_recordings_value', 'test_av.mp3');
        console.log('------------- upload hearing after');
        await browser.sleep(5000);
    }

    async uploadFile(inputElement: string, fileName: string) {
        let fileToUpload = '../dwpResponse/' + fileName,
        absolutePath = path.resolve(__dirname, fileToUpload);
        await element(by.id(inputElement)).sendKeys(absolutePath);
    }

    async uploadHearingRecording() {
        await anyCcdPage.clickElementById('hearingRecording_hearingType-final');
        await this.addHearingRecording();
        await anyCcdPage.click('Continue');
        await browser.sleep(500);
        await anyCcdPage.click('Submit');
    }

    async selectHearing() {
        await element(by.id('selectHearingDetails')).element(by.xpath('//*[@id="selectHearingDetails"]/option[2]')).click();
    }

    async requestDwpHearingRecording() {
        await element(by.id('requestableHearingDetails')).element(by.xpath('//*[@id="requestableHearingDetails"]/option[2]')).click();
    }

    async grantRequestDwpHearingRecording() {
        await element(by.id('processHearingRecordingRequests_0_dwp'))
            .element(by.xpath('//*[@id="processHearingRecordingRequests_0_dwp"]/option[2]')).click();
    }
}
