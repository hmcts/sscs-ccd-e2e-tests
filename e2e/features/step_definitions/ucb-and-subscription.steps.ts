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
    await anyCcdPage.click('Summary');
});

Then(/^I set UCB flag to "(.+)"$/, async function (ucbFlag) {

   if(ucbFlag === 'Yes'){
   await anyCcdPage.clickElementById('dwpUCB-Yes');
   }else{
     await anyCcdPage.clickElementById('dwpUCB-No');
   }
   await anyCcdPage.click('Continue');
   await anyCcdPage.click('Submit');
   await browser.sleep(10);
   if(ucbFlag === 'Yes'){
   await anyCcdPage.click('Listing Requirements');
   await browser.sleep(10);
   expect(await anyCcdPage.contentContains(ucbFlag)).to.equal(true);
   }
   expect(await anyCcdPage.contentContains(ucbFlag)).to.equal(true);
});

Then(/^I enter date of appellant death with "(.+)" to appointee$/, async function (hasAppointee) {
   caseDetailsPage.addPastDate('dateOfAppellantDeath')
   if(hasAppointee === 'No'){
   await anyCcdPage.clickElementById('appeal_appellant_isAppointee-No');
   await anyCcdPage.click('Continue');
   }else{
     await anyCcdPage.clickElementById('appeal_appellant_isAppointee-Yes');
     await appointeePage.addAppointeeDetails()
     browser.driver.sleep(10);
   }
   await anyCcdPage.click('Submit');
    browser.driver.sleep(10);
   await anyCcdPage.click('Appeal Details');
   expect(await anyCcdPage.contentContains('Date of appellant death')).to.equal(true);
   await anyCcdPage.click('Subscriptions');
    browser.driver.sleep(10);
   expect(await anyCcdPage.contentContains('No')).to.equal(true);

});



When(/^I upload a UCB doc contains further information "(.+)" for "(.+)"$/, async function (action: string, benefitCode: string) {
    const dwpState = 'YES';
    const docLink = 'dwpUcbEvidenceDocument'
    await dwpresponse.uploadResponseWithUcbAndPhme(action, dwpState, docLink, true, false);
    if (benefitCode !== 'UC') {
        await anyCcdPage.selectIssueCode();
    }
    await anyCcdPage.click('Continue');
    if (benefitCode === 'UC') {
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
    await anyCcdPage.click('Summary');
     browser.driver.sleep(30);
});

When(/^I upload a doc$/, async function () {
   const docLink = 'tl1Form_documentLink';
    await dwpresponse.uploadDoc(docLink);
    await browser.driver.sleep(300);
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
    await anyCcdPage.click('Summary');
    await browser.driver.sleep(50);
});

Then(/^I should see UCB flag$/, async function () {
   await anyCcdPage.click('Listing Requirements');
   await browser.sleep(50);
   expect(await anyCcdPage.contentContains('Yes')).to.equal(true);
});



Then(/^not listable reason is "(.+)" on summary page$/, async function (isVisible) {

   if(isVisible === 'Visible'){
    await browser.sleep(100);
   expect(await anyCcdPage.contentContains('reason for not listable goes here')).to.equal(true);
   }
});

When(/^I choose not listable direction full filled to "(.+)" and interloc review to "(.+)"$/, async function (isDirectionFullFilled, isReview) {
  if(isDirectionFullFilled === 'YES'){
   await anyCcdPage.clickElementById('updateNotListableDirectionsFulfilled-Yes');
   await anyCcdPage.click('Continue');
   await anyCcdPage.click('Submit');
       }else{
        await anyCcdPage.clickElementById('updateNotListableDirectionsFulfilled-No');
        await anyCcdPage.click('Continue');
            if(isReview === 'YES'){
                    await anyCcdPage.clickElementById('updateNotListableInterlocReview-Yes');
                    await anyCcdPage.chooseOptionByElementId('updateNotListableWhoReviewsCase', 'A Judge');
                    await anyCcdPage.click('Continue');
                    await anyCcdPage.click('Submit');
                    await anyCcdPage.click('History');
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

 if (action === 'Yes'){
   await anyCcdPage.clickElementById('subscriptions_appellantSubscription_wantSmsNotifications-'+action);
   await anyCcdPage.setValueByElementId('subscriptions_appellantSubscription_tya','appellant123')
   await anyCcdPage.setValueByElementId('subscriptions_appellantSubscription_email','appellant-test@mailinator.com')
   await anyCcdPage.setValueByElementId('subscriptions_appellantSubscription_mobile','01234567890')
   await anyCcdPage.clickElementById('subscriptions_appellantSubscription_subscribeEmail-'+action);
   await anyCcdPage.clickElementById('subscriptions_appellantSubscription_subscribeSms-'+action);

  await anyCcdPage.clickElementById('subscriptions_representativeSubscription_wantSmsNotifications-'+action);
  await anyCcdPage.setValueByElementId('subscriptions_representativeSubscription_tya','representative123')
  await anyCcdPage.setValueByElementId('subscriptions_representativeSubscription_email','representative-test@mailinator.com')
  await anyCcdPage.setValueByElementId('subscriptions_representativeSubscription_mobile','01234567890')
  await anyCcdPage.clickElementById('subscriptions_representativeSubscription_subscribeEmail-'+action);
  await anyCcdPage.clickElementById('subscriptions_representativeSubscription_subscribeSms-'+action);

  await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_wantSmsNotifications-'+action);
  await anyCcdPage.setValueByElementId('subscriptions_appointeeSubscription_tya','appointee123')
  await anyCcdPage.setValueByElementId('subscriptions_appointeeSubscription_email','appointee-test@mailinator.com')
  await anyCcdPage.setValueByElementId('subscriptions_appointeeSubscription_mobile','01234567890')
  await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_subscribeEmail-'+action);
  await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_subscribeSms-'+action);

  await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_wantSmsNotifications-'+action);
  await anyCcdPage.setValueByElementId('subscriptions_jointPartySubscription_tya','jointParty123')
  await anyCcdPage.setValueByElementId('subscriptions_jointPartySubscription_email','jointparty-test@mailinator.com')
  await anyCcdPage.setValueByElementId('subscriptions_jointPartySubscription_mobile','01234567890')
  await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_subscribeEmail-'+action);
  await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_subscribeSms-'+action);


  }else{
     await anyCcdPage.clickElementById('subscriptions_appellantSubscription_wantSmsNotifications-'+action);
     await anyCcdPage.clickElementById('subscriptions_appellantSubscription_subscribeEmail-'+action);

   await anyCcdPage.clickElementById('subscriptions_representativeSubscription_wantSmsNotifications-'+action);
    await anyCcdPage.clickElementById('subscriptions_representativeSubscription_subscribeEmail-'+action);

   await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_wantSmsNotifications-'+action);
    await anyCcdPage.clickElementById('subscriptions_appointeeSubscription_subscribeEmail-'+action);

   await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_wantSmsNotifications-'+action);
   await anyCcdPage.clickElementById('subscriptions_jointPartySubscription_subscribeEmail-'+action);
  }
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');

    await browser.sleep(50);
    await anyCcdPage.click('Subscriptions');

    expect(await anyCcdPage.contentContains(action)).to.equal(true);

});



