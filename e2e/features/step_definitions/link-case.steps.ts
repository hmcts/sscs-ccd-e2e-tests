import { When, Then } from 'cucumber';
import { expect } from 'chai';
import { AnyCcdPage } from '../../pages/any-ccd.page';
import * as ccd from '../../helpers/ccd';
import { Logger } from '@hmcts/nodejs-logging';
import { Wait } from '../../enums/wait';
import { browser } from 'protractor';

const logger = Logger.getLogger('link-case');

const anyCcdPage = new AnyCcdPage();

let linkedCaseReference: string = null;

When('I add a case to be linked', async function () {
  linkedCaseReference = await ccd.createSYACase('PIP');
  logger.info(`linked Case Id: ${linkedCaseReference}`);

  await browser.sleep(Wait.normal);

  await anyCcdPage.clickAddNew();
  await anyCcdPage.setText('//*[@id="linkedCase_0_0"]', linkedCaseReference);

  await anyCcdPage.clickContinue();
  await anyCcdPage.clickSubmit();
});

Then('I should see the case linked within related cases tab', async function () {
  await anyCcdPage.clickTab('Related Cases');
  const linkedCaseIds = await anyCcdPage.getFieldValues('Linked case(s)');
  const linkedCaseIdsTrimmed = linkedCaseIds.map((caseId) => caseId.replace('-', ''));
  logger.info(`Linked Cases Ids:\n${linkedCaseIdsTrimmed.join('\n')}`);
  expect(linkedCaseIdsTrimmed).to.equal(linkedCaseReference);
});
