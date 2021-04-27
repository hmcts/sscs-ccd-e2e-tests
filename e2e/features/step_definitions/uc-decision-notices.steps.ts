import { When } from 'cucumber';
import { browser } from 'protractor';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import { IssueDecisionPage } from '../../pages/issue-decision.page';

const anyCcdPage = new AnyCcdPage();
const issueDecisionPage = new IssueDecisionPage();

When(/^I select schedule 6 activities with <15 points and schedule 8 para 4 "(.+)"$/, async function (para4Apply) {
    await browser.sleep(2500)
    await issueDecisionPage.schedule6PageFieldsAreInTheCorrectOrder();
    await anyCcdPage.clickElementById('ucWriteFinalDecisionPhysicalDisabilitiesQuestion-mobilisingUnaided');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickElementById('ucWriteFinalDecisionMobilisingUnaidedQuestion-mobilisingUnaided1d');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    if (para4Apply === 'YES') {
        await anyCcdPage.clickElementById('doesSchedule8Paragraph4Apply-Yes');
    } else {
        await anyCcdPage.clickElementById('doesSchedule8Paragraph4Apply-No');
    }
    await anyCcdPage.click('Continue');
    await browser.sleep(1000);
});

When(/^I select schedule 6 activities with >=15 points$/, async function () {
    await browser.sleep(2000);
    await issueDecisionPage.schedule6PageFieldsAreInTheCorrectOrder();
    await anyCcdPage.clickElementById('ucWriteFinalDecisionPhysicalDisabilitiesQuestion-mobilisingUnaided');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    await anyCcdPage.clickElementById('ucWriteFinalDecisionMobilisingUnaidedQuestion-mobilisingUnaided1a');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I select schedule 7 activities$/, async function () {
    await anyCcdPage.clickElementById('ucWriteFinalDecisionSchedule7ActivitiesQuestion-schedule7MobilisingUnaided');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I opt out schedule 7 activities and schedule 9 para 4 "(.+)"$/, async function (para4) {
    await anyCcdPage.clickElementById('ucWriteFinalDecisionSchedule7ActivitiesApply-No');
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
    if (para4 === 'YES') {
        await anyCcdPage.clickElementById('doesSchedule9Paragraph4Apply-Yes');
    } else {
        await anyCcdPage.clickElementById('doesSchedule9Paragraph4Apply-No');
    }
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I continue writing final decision LCWA appeal$/, async function () {
    await browser.sleep(1000)
    await issueDecisionPage.pageReference();
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});

When(/^I continue writing final decision non LCWA appeal$/, async function () {
    await issueDecisionPage.pageReference();
    await anyCcdPage.click('Continue');
    await browser.sleep(1500);
    await issueDecisionPage.fillSummary();
    await anyCcdPage.click('Continue');
    await browser.sleep(500);
});
