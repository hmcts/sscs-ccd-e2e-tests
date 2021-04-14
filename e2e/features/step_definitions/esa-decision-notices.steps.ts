import { When } from 'cucumber';
import { browser } from 'protractor';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { IssueDecisionPage } from '../../pages/issue-decision.page';
import { CaseDetailsPage } from '../../pages/case-details.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';

const anyCcdPage = new AnyCcdPage();
const issueDecisionPage = new IssueDecisionPage();
const caseDetailsPage = new CaseDetailsPage();
const anyCcdFormPage = new AnyCcdFormPage();

When(/^I write a final decision of "(.+)" appeal "(.+)" and Support group "(.+)" To Allowed "(.+)"$/,
    async function (appealType, wcaAppeal, supportGroup, allowed) {
    await anyCcdPage.clickElementById('writeFinalDecisionGenerateNotice-Yes');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    if (allowed === 'YES') {
        await anyCcdPage.clickElementById('writeFinalDecisionAllowedOrRefused-allowed');
    } else {
        await anyCcdPage.clickElementById('writeFinalDecisionAllowedOrRefused-refused');
    }
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickElementById('writeFinalDecisionTypeOfHearing-faceToFace');
    await anyCcdPage.clickElementById('writeFinalDecisionPresentingOfficerAttendedQuestion-Yes');
    await anyCcdPage.clickElementById('writeFinalDecisionAppellantAttendedQuestion-Yes');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await caseDetailsPage.addDayItems('writeFinalDecisionDateOfDecision');
    await browser.sleep(3000);
    await anyCcdPage.click('Continue');
    await browser.sleep(8000);
    if (wcaAppeal === 'YES') {
        const wcaYes = appealType + 'Appeal-Yes';
        await anyCcdPage.clickElementById(wcaYes);
    } else {
        const wcaNo = appealType + 'Appeal-No';
        await anyCcdPage.clickElementById(wcaNo);
    }
    await browser.sleep(500);
    if (supportGroup === 'YES') {
        await anyCcdPage.clickElementById('supportGroupOnlyAppeal-Yes');
    } else if (wcaAppeal === 'YES') {
        await anyCcdPage.clickElementById('supportGroupOnlyAppeal-No');
    }
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I select schedule 2 activities with <15 points and reg 29 "(.+)"$/, async function (reg29Apply) {
    await anyCcdPage.clickElementById('esaWriteFinalDecisionPhysicalDisabilitiesQuestion-consciousness');
    await anyCcdPage.clickElementById('esaWriteFinalDecisionMentalAssessmentQuestion-copingWithChange');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickElementById('esaWriteFinalDecisionConsciousnessQuestion-consciousness10c');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickElementById('esaWriteFinalDecisionCopingWithChangeQuestion-copingWithChange14d');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    if (reg29Apply === 'YES') {
        await anyCcdPage.clickElementById('doesRegulation29Apply-Yes');
    } else {
        await anyCcdPage.clickElementById('doesRegulation29Apply-No');
    }
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I select schedule 2 activities with >=15 points$/, async function () {
    await anyCcdPage.clickElementById('esaWriteFinalDecisionPhysicalDisabilitiesQuestion-reaching');
    await anyCcdPage.clickElementById('esaWriteFinalDecisionMentalAssessmentQuestion-learningTasks');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickElementById('esaWriteFinalDecisionReachingQuestion-reaching3b');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickElementById('esaWriteFinalDecisionLearningTasksQuestion-learningTasks11b');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I opt out schedule 3 activities and reg 35 "(.+)"$/, async function (reg35Apply) {
    await anyCcdPage.clickElementById('esaWriteFinalDecisionSchedule3ActivitiesApply-No');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    if (reg35Apply === 'YES') {
        await anyCcdPage.clickElementById('doesRegulation35Apply-Yes');
    } else {
        await anyCcdPage.clickElementById('doesRegulation35Apply-No');
    }
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I select schedule 3 activities$/, async function () {
    await anyCcdPage.clickElementById('esaWriteFinalDecisionSchedule3ActivitiesQuestion-schedule3ChewingOrSwallowing');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I continue writing final decision non WCA appeal$/, async function () {
    await issueDecisionPage.pageReference();
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await issueDecisionPage.fillSummary();
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I continue writing final decision WCA appeal$/, async function () {
    await issueDecisionPage.pageReference();
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I provide reasons and check answers To Allowed "(.+)"$/, async function (allowed) {
    if (allowed === 'YES') {
      await anyCcdPage.clickElementById('dwpReassessTheAward-noRecommendation');
      await anyCcdPage.click('Continue');
      await browser.sleep(500);
    }
    await anyCcdFormPage.addNewCollectionItem('Reasons for decision');
    await browser.sleep(500);
    await anyCcdFormPage.setCollectionItemFieldValue(
        'Reasons for decision',
        0,
        'Reasons for decision',
        'Some Reason'
    );
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Submit');
    await browser.sleep(5000);
});

When(/^I provide reasons and check answers for non WCA To Allowed "(.+)"$/, async function (allowed) {
    await anyCcdFormPage.addNewCollectionItem('Reasons for decision');
    await browser.sleep(500);
    await anyCcdFormPage.setCollectionItemFieldValue(
        'Reasons for decision',
        0,
        'Reasons for decision',
        'Some Reason'
    );
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Submit');
    await browser.sleep(5000);
});

When(/^I choose manual upload$/, async function () {
    await anyCcdPage.clickElementById('writeFinalDecisionGenerateNotice-No');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickElementById('writeFinalDecisionAllowedOrRefused-allowed');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await issueDecisionPage.uploadDirection();
    await browser.sleep(5000);
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
    await browser.sleep(5000);
});
