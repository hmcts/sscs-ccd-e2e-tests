/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { browser, by, element } from 'protractor';
import { AnyPage } from './any.page';
import { expect } from 'chai';
import { AnyCcdPage } from './any-ccd.page';

const anyCcdPage = new AnyCcdPage();
const hearingStatus = 'waiting to be listed';
export class HearingDetailsPage extends AnyPage {
  async requestManualHearing() {
    await browser.manage().window().maximize();
    await anyCcdPage.clickTab('Hearings');
    await browser.sleep(1000);
    expect(await anyCcdPage.contentContains('Request a hearing')).to.equal(true);
    await anyCcdPage.clickButton('Request a hearing');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await this.doYouRequireAdditionalFacilities('No');
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await element(by.id('inputLocationSearch')).sendKeys('CARDIFF CIVIL AND FAMILY JUSTICE CENTRE');
    await anyCcdPage.clickButton('Add location');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await this.doYouWantSpecificJudge('No');
    await anyCcdPage.clickButton('Tribunal Judge');
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Submit request');
    await browser.sleep(2000);
    expect(await anyCcdPage.pageHeadingContains('Hearing request submitted')).to.equal(true);
    await anyCcdPage.clickElementByCss('.govuk-body .govuk-link');
    await browser.sleep(2000);
  }

  async verifyHearingStatusSummary() {
    expect(await anyCcdPage.contentContains(hearingStatus.toUpperCase())).to.equal(true);
    expect(await anyCcdPage.contentContains('Substantive')).to.equal(true);
  }

  async doYouWantSpecificJudge(yesOrNo: string) {
    await anyCcdPage.clickElementById(`specific-judge-selection${yesOrNo}`);
  }

  async doYouRequireAdditionalFacilities(yesOrNo: string) {
    await anyCcdPage.clickElementById(`addition-security-confirmation${yesOrNo}`);
  }

  async requestAutoHearing() {
    await browser.manage().window().maximize();
    await anyCcdPage.clickTab('Hearings');
    expect(await anyCcdPage.contentContains('Request a hearing')).to.equal(true);
  }

  async viewHearingDetails() {
    await anyCcdPage.clickButton('View or edit');
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

  async updateHearingDetails(hearingDuration: string) {
    await anyCcdPage.clickElementById('hearingLength');
    expect(await anyCcdPage.contentContains('Select length, date and priority level of hearing')).to.equal(true);
    await element(by.id('durationhours'))
      .clear()
      .then(function () {
        // eslint-disable-next-line no-void
        void element(by.id('durationhours')).sendKeys(2);
      });
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Submit updated request');
    s;
    await browser.sleep(500);
    await anyCcdPage.clickElementById('adminreq');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Submit change request');
    await browser.sleep(500);
    await anyCcdPage.clickButton('view the status of this hearing in the hearings tab');
  }

  async verifyHearingStatus(statusHearing: string) {
    await browser.sleep(1500);
    await browser.manage().window().maximize();
    await anyCcdPage.clickTab('Hearings');
    await browser.sleep(1500);
    expect(await anyCcdPage.contentContains(statusHearing.toUpperCase())).to.equal(true);
  }

  async verifyHearingChannel(hearingChannel: string) {
    await browser.sleep(500);
    await anyCcdPage.chooseOption('overrideFields_appellantHearingChannel', hearingChannel);
    await browser.sleep(500);
  }

  async verifyAttendingOfficer(AttendingOfficer: string) {
    await browser.sleep(500);
    await anyCcdPage.clickElementById('overrideFields_poToAttend_Yes');
    await browser.sleep(500);
  }

  async verifyAmendReasonForUpdate() {
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickElementById('amendReasons-judgereq');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickButton('Submit');
    await browser.sleep(500);
  }

  async verifyCancelHearingStatus(hearingStats: string) {
    expect(await anyCcdPage.contentContains(hearingStats.toUpperCase())).to.equal(true);
  }
}
