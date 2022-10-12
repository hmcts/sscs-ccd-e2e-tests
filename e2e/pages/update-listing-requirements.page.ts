import { browser } from 'protractor';
import { AnyPage } from './any.page';
import { expect } from 'chai';
import { AnyCcdPage } from './any-ccd.page';

const anyCcdPage = new AnyCcdPage();

export class UpdateListingRequirementsPage extends AnyPage {

 async updateHearingChannel() {
    expect(await anyCcdPage.pageHeadingContains('Update Listing Requirements')).to.equal(true);
    await browser.sleep(500);
    await anyCcdPage.chooseOptionContainingText('#overrideFields_appellantHearingChannel', 'Video');
 }

 async updatePOOfficerAttending() {
    await anyCcdPage.chooseOptionContainingText('# overrideFields_poToAttend_Yes', 'Yes');
    await browser.sleep(500);
    await anyCcdPage.click('Continue');
 }

 async amendReasonForUpdate() {
   expect(await anyCcdPage.pageHeadingContains('Amend Reason')).to.equal(true);
    await browser.sleep(500);
    await anyCcdPage.click('Judge requested change');
    await browser.sleep(500);
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Submit');
 }
}