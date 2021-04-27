import { browser, by, element } from 'protractor';
import { AnyPage } from './any.page';
import * as path from 'path';
const serviceConfig = require('../service.conf');

export class FurtherEvidencePage extends AnyPage {

    async uploadFile(inputElement: string, fileName: string) {
        let fileToUpload = '../dwpResponse/' + fileName,
        absolutePath = path.resolve(__dirname, fileToUpload);
        if (serviceConfig.TestsForCrossBrowser) {
            let remote = require('selenium-webdriver/remote');
            browser.setFileDetector(new remote.FileDetector());
        }
        console.log('Absolute path is..', absolutePath);
        await element(by.id(inputElement)).sendKeys(absolutePath);
    }

    async enterFileName(inputElement: string, fileName: string) {
        await element(by.id(inputElement)).sendKeys(fileName);
    }

    async enterScannedDate(date: string, month: string, year: string) {
        await element(by.id('scannedDocuments_0_scannedDate-day')).sendKeys(date);
        await element(by.id('scannedDocuments_0_scannedDate-month')).sendKeys(month);
        await element(by.id('scannedDocuments_0_scannedDate-year')).sendKeys(year);
    }
}
