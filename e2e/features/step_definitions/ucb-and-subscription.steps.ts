import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { AppointeePage } from '../../pages/appointee.page';
import { DwpResponsePage } from '../../pages/dwpresponse.page';
import { Then, When } from 'cucumber';
import { expect } from 'chai';
import { browser } from 'protractor';

const anyCcdPage = new AnyCcdFormPage();
const caseDetailsPage = new CaseDetailsPage();
const appointeePage = new AppointeePage();
const dwpresponse = new DwpResponsePage();

When(/^I populate fields and continue$/, async function () {
    await caseDetailsPage.addReasonAndDate('notListableDueDate');
    await anyCcdPage.click('Submit');
    await anyCcdPage.reloadPage();
    await anyCcdPage.clickTab('Summary');
});

Then(/^I set UCB flag to "(.+)"$/, async function (ucbFlag) {

   if (ucbFlag === 'Yes') {
   await anyCcdPage.clickElementById('dwpUCB-Yes');
   } else {
     await anyCcdPage.clickElementById('dwpUCB-No');
   }
   await anyCcdPage.click('Continue');
   await anyCcdPage.click('Submit');
   await browser.sleep(10);
   if (ucbFlag === 'Yes') {
   await anyCcdPage.click('Listing Requirements');
   await browser.sleep(10);
   expect(await anyCcdPage.contentContains(ucbFlag)).to.equal(true);
   }
   expect(await anyCcdPage.contentContains(ucbFlag)).to.equal(true);
});

Then(/^I set PHME Granted flag to "(.+)"$/, async function (phmeGranted) {
    if (phmeGranted === 'Yes') {
        await anyCcdPage.clickElementById('phmeGranted-Yes');
    } else {
        await anyCcdPage.clickElementById('phmeGranted-No');
    }
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
    await browser.sleep(10);
});

Then(/^I enter date of appellant death with "(.+)" to appointee$/, async function (hasAppointee) {
   caseDetailsPage.addPastDate('dateOfAppellantDeath')
   if (hasAppointee === 'No') {
   await anyCcdPage.clickElementById('appeal_appellant_isAppointee-No');
   await anyCcdPage.click('Continue');
   } else {
     await anyCcdPage.clickElementById('appeal_appellant_isAppointee-Yes');
     await appointeePage.addAppointeeDetails();
     await anyCcdPage.click('Continue');
   }
   await anyCcdPage.click('Submit');
   await anyCcdPage.clickTab('Appeal Details');
   expect(await anyCcdPage.contentContains('Date of appellant death')).to.equal(true);
   if (hasAppointee === 'No') {
   browser.driver.sleep(10);
   expect(await anyCcdPage.contentContains('Appointee details needed')).to.equal(true);
   }
   await anyCcdPage.clickTab('History');
   expect(await anyCcdPage.contentContains('Awaiting Admin Action')).to.equal(true);

});

Then(/^I enter "(.+)" to appointee and continue$/, async function (hasAppointee) {
     await anyCcdPage.clickElementById('appeal_appellant_isAppointee-Yes');
     await appointeePage.addAppointeeDetails()
     browser.driver.sleep(10);
     await anyCcdPage.click('Continue');
     browser.driver.sleep(10);
     await anyCcdPage.click('Submit');
     browser.driver.sleep(10);
     await anyCcdPage.clickTab('History');

     expect(await anyCcdPage.contentContains('Awaiting Admin Action')).to.equal(true);
     browser.driver.sleep(5);
     expect(await anyCcdPage.contentContains('Provide appointee details')).to.equal(true);
});

When(/^I upload a "(.+)" doc contains further information "(.+)" for "(.+)"$/,
    async function (docType: string, action: string, benefitType: string) {
    const dwpState = 'YES';
    const docLink = 'dwpUcbEvidenceDocument'
    const isContainsFurtherInfo = action === 'YES'
    const isUCB = docType === 'UCB'
    const isPHME = docType === 'PHME'
    await dwpresponse.uploadResponseWithUcbAndPhme(dwpState, docLink, isUCB, isPHME, isContainsFurtherInfo);
    if (benefitType !== 'UC') {
        await anyCcdPage.selectIssueCode();
    }
    await anyCcdPage.click('Continue');
    if (benefitType === 'UC') {
      await anyCcdPage.clickElementById('elementsDisputedList-general');
      await anyCcdPage.click('Continue');
      await anyCcdPage.addNewCollectionItem('General');
      await anyCcdPage.selectGeneralIssueCode();
      await anyCcdPage.click('Continue');
      await anyCcdPage.clickElementById('elementsDisputedIsDecisionDisputedByOthers-No');
      await anyCcdPage.click('Continue');
      await anyCcdPage.clickElementById('jointParty-No');
      await anyCcdPage.click('Continue');

    }
    await anyCcdPage.click('Submit');
    browser.driver.sleep(30);
});

When(/^I upload a doc$/, async function () {
   const docLink = 'tl1Form_documentLink';
    await dwpresponse.uploadDoc(docLink);
    await browser.sleep(2000);
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
});

Then(/^I see "(.+)" event in case fields$/, async function (expectedEvent) {
    await anyCcdPage.click('History');
   // await anyCcdPage.reloadPage();
    await browser.sleep(50);
    expect(await caseDetailsPage.isFieldValueDisplayed('Event', expectedEvent)).to.equal(true);
    await browser.driver.sleep(50);
});

Then(/^I see field "(.+)" with value "(.+)" in "(.+)" tab$/, async function (key, value, tab) {
    await browser.sleep(5000);
    await anyCcdPage.clickTab(tab);
    expect(await caseDetailsPage.isFieldValueDisplayed(key, value)).to.equal(true);
    await browser.driver.sleep(60);
});

Then(/^I should see UCB flag$/, async function () {
   await anyCcdPage.clickTab('Listing Requirements');
   await browser.sleep(50);
   expect(await anyCcdPage.contentContains('Unacceptable Customer Behaviour (UCB)')).to.equal(true);
});

Then(/^I should see PHME flag as "(.+)"$/, async function (state) {
    await anyCcdPage.click('Summary');
    await browser.sleep(50);

    if (state === 'Under Review') {
        expect(await anyCcdPage.contentContains('PHME on this case: Under Review')).to.equal(true);
    } else if (state === 'Granted') {
        expect(await anyCcdPage.contentContains('PHME on this case: Granted')).to.equal(true);
    }

});

Then(/^not listable reason is "(.+)" on summary page$/, async function (isVisible) {
   if (isVisible === 'Visible') {
    await browser.sleep(100);
   expect(await anyCcdPage.contentContains('reason for not listable goes here')).to.equal(true);
   }
});

When(/^I choose not listable direction full filled to "(.+)" and interloc review to "(.+)"$/,
 async function (isDirectionFullFilled, isReview) {
  if (isDirectionFullFilled === 'YES') {
   await anyCcdPage.clickElementById('updateNotListableDirectionsFulfilled-Yes');
   await anyCcdPage.click('Continue');
   await anyCcdPage.click('Submit');
       } else {
        await anyCcdPage.clickElementById('updateNotListableDirectionsFulfilled-No');
        await anyCcdPage.click('Continue');
            if (isReview === 'YES') {
                    await anyCcdPage.clickElementById('updateNotListableInterlocReview-Yes');
                    await anyCcdPage.chooseOptionByElementId('updateNotListableWhoReviewsCase', 'A Judge');
                    await anyCcdPage.click('Continue');
                    await anyCcdPage.click('Submit');
                    await anyCcdPage.clickTab('History');
                    expect(await anyCcdPage.contentContains('Review by Judge')).to.equal(true);
                    await browser.sleep(50);
            } else {
                    await anyCcdPage.clickElementById('updateNotListableInterlocReview-No');
                    await anyCcdPage.click('Continue');
                    await anyCcdPage.clickElementById('updateNotListableSetNewDueDate-No');
                    await anyCcdPage.click('Continue');
                    await anyCcdPage.clickElementById('updateNotListableWhereShouldCaseMoveTo-withDwp');
                     await anyCcdPage.click('Continue');
                     await anyCcdPage.click('Submit');
                     await browser.sleep(50);
                    }
   }
});

Then(/^I subscribed to all parties to "(.+)"$/, async function (isSubscribed) {

 const action = isSubscribed;
 console.log('Subscribed to parties : ' + action)

 if (action === 'Yes') {
   await anyCcdPage.clickElementById('subscriptions_appellantSubscription_wantSmsNotifications-' + action);
   await anyCcdPage.setValueByElementId('subscriptions_appellantSubscription_tya', 'appellant123')
   await anyCcdPage.setValueByElementId('subscriptions_appellantSubscription_email', 'appellant-test@mailinator.com')
   await anyCcdPage.setValueByElementId('subscriptions_appellantSubscription_mobile', '01234567890')
   await anyCcdPage.clickElementById('subscriptions_appellantSubscription_subscribeEmail-' + action);
   await anyCcdPage.clickElementById('subscriptions_appellantSubscription_subscribeSms-' + action);

  await anyCcdPage.clickElementById('subscriptions_representativeSubscription_wantSmsNotifications-' + action);
  await anyCcdPage.setValueByElementId('subscriptions_representativeSubscription_tya', 'representative123')
  await anyCcdPage.setValueByElementId('subscriptions_representativeSubscription_email', 'representative-test@mailinator.com')
  await anyCcdPage.setValueByElementId('subscriptions_representativeSubscription_mobile', '01234567890')
  await anyCcdPage.clickElementById('subscriptions_representativeSubscription_subscribeEmail-' + action);
  await anyCcdPage.clickElementById('subscriptions_representativeSubscription_subscribeSms-' + action);

  await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_wantSmsNotifications-' + action);
  await anyCcdPage.setValueByElementId('subscriptions_appointeeSubscription_tya', 'appointee123')
  await anyCcdPage.setValueByElementId('subscriptions_appointeeSubscription_email', 'appointee-test@mailinator.com')
  await anyCcdPage.setValueByElementId('subscriptions_appointeeSubscription_mobile', '01234567890')
  await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_subscribeEmail-' + action);
  await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_subscribeSms-' + action);

  await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_wantSmsNotifications-' + action);
  await anyCcdPage.setValueByElementId('subscriptions_jointPartySubscription_tya', 'jointParty123')
  await anyCcdPage.setValueByElementId('subscriptions_jointPartySubscription_email', 'jointparty-test@mailinator.com')
  await anyCcdPage.setValueByElementId('subscriptions_jointPartySubscription_mobile', '01234567890')
  await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_subscribeEmail-' + action);
  await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_subscribeSms-' + action);

  } else {
     await anyCcdPage.clickElementById('subscriptions_appellantSubscription_wantSmsNotifications-' + action);
     await anyCcdPage.clickElementById('subscriptions_appellantSubscription_subscribeEmail-' + action);

   await anyCcdPage.clickElementById('subscriptions_representativeSubscription_wantSmsNotifications-' + action);
    await anyCcdPage.clickElementById('subscriptions_representativeSubscription_subscribeEmail-' + action);

   await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_wantSmsNotifications-' + action);
    await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_subscribeEmail-' + action);

   await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_wantSmsNotifications-' + action);
   await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_subscribeEmail-' + action);
  }
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');

    await browser.sleep(50);
    await anyCcdPage.click('Subscriptions');

    expect(await anyCcdPage.contentContains(action)).to.equal(true);

});
