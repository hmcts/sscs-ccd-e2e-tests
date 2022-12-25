import { browser, by, element, ElementFinder, ExpectedConditions, until } from 'protractor';
import { AnyPage } from './any.page';
import { Wait } from '../enums/wait';
import { expect } from 'chai';
import { runAndReportAccessibility } from '../helpers/axe-runner';
import { Logger } from '@hmcts/nodejs-logging';
import { Locator } from 'selenium-webdriver';
import path from 'path';
import config from 'config';
import * as remote from 'selenium-webdriver/remote';

const logger = Logger.getLogger('any-ccd.pages');

const crossBrowserTest = Boolean(config.get('tests.crossBrowser'));

export class AnyCcdPage extends AnyPage {
  async click(linkText: string): Promise<void> {
    const linkPath = `//*[self::button or self::a][normalize-space()="${linkText}"]`;
    await browser.wait(
      async () => {
        return element.all(by.xpath(linkPath)).isPresent();
      },
      Wait.long,
      'Button did not show in time'
    );
    await element.all(by.xpath(linkPath)).first().click();
    await this.smartWait(2000);
  }

  async clickContinue(): Promise<ElementFinder> {
    const clickedElement = this.clickElement('button', 'Continue');
    await browser.waitForAngular();
    return clickedElement;
  }

  async clickSubmit(): Promise<ElementFinder> {
    const clickedElement = this.clickElement('button', 'Submit');
    await browser.waitForAngular();
    return clickedElement;
  }

  async clickElementById(elementId: string): Promise<ElementFinder> {
    return this.clickAction(by.id(elementId));
  }

  async clickElementByCss(elementId: string): Promise<ElementFinder> {
    return this.clickAction(by.css(elementId));
  }

  async clickButton(text: string): Promise<ElementFinder> {
    return this.clickElement('button', text);
  }

  async clickTab(tabTitle: string): Promise<ElementFinder> {
    return this.clickElement('div', tabTitle);
  }

  async clickElement(elementType: string, text: string): Promise<ElementFinder> {
    return this.clickElementByXpath(`//${elementType}[text()="${text}"]`);
  }

  async clickElementByXpath(xpath: string): Promise<ElementFinder> {
    return this.clickAction(by.xpath(xpath));
  }

  async clickLastElement(elementType: string, text: string, collectionLabel: string): Promise<ElementFinder> {
    const elementXpath = `//ccd-write-collection-field//div[h2[normalize-space()="${collectionLabel}" or normalize-space()="${collectionLabel} (Optional)"]]/${elementType}[text()="${text}"]`;
    return this.clickLastAction(by.xpath(elementXpath));
  }

  async clickAction(locator: Locator): Promise<ElementFinder> {
    await this.waitForElement(locator);
    const elementFinder = element(locator);
    await elementFinder.click();
    await this.smartWait(2000);
    return elementFinder;
  }

  async clickLastAction(locator: Locator): Promise<ElementFinder> {
    const elementFinder = element.all(locator).last();
    await this.waitForElement(locator);
    await elementFinder.click();
    await this.smartWait(2000);
    return elementFinder;
  }

  async waitForElement(locator: Locator, wait: number = Wait.normal): Promise<void> {
    await browser.wait(until.elementLocated(locator), wait, 'Element Locator Timeout');
  }

  async waitForElements(locator: Locator, wait: number = Wait.normal): Promise<void> {
    await browser.wait(until.elementsLocated(locator), wait, 'Elements Locator Timeout');
  }

  async chooseOption(elementId: string, locator: Locator): Promise<void> {
    const choiceLocator = by.id(elementId);
    await this.waitForElement(choiceLocator);
    await element(choiceLocator).element(locator).click();
  }

  async chooseOptionContainingText(elementId: string, text: string): Promise<void> {
    await this.chooseOption(elementId, by.xpath(`//option[normalize-space(text())='${text}']`));
  }

  async chooseOptionByValue(elementId: string, value: string): Promise<void> {
    await this.chooseOption(elementId, by.xpath(`.//option[contains(@value,'${value}')]`));
  }

  async fillValues(elementId: string, actText: string): Promise<void> {
    await element(by.id(elementId)).clear();
    await element(by.id(elementId)).sendKeys(actText);
  }

  async isFieldValueDisplayed(fieldLabel: string, fieldValue: string): Promise<boolean> {
    await this.waitForElement(by.tagName('mat-tab-group'));
    const locator = await this.getFieldValueLocator(fieldLabel, fieldValue);
    return element(locator).isPresent();
  }

  async getFieldValueLocator(fieldLabel: string, fieldValue: string): Promise<Locator> {
    let tag = '*';
    const isCcdEventLogPresent = await element(by.tagName('ccd-event-log')).isPresent();
    const isReadComplexFieldTablePresent = await element(by.tagName('ccd-read-complex-field-table')).isPresent();
    if (isCcdEventLogPresent || isReadComplexFieldTablePresent) {
      tag = 'span';
    }
    return by.xpath(`//${tag}[normalize-space()="${fieldLabel}"]/../..//td[normalize-space()="${fieldValue}"]`);
  }

  getFieldLocator(fieldLabel: string): Locator {
    return by.xpath(`//*[normalize-space()="${fieldLabel}"]/../../td`);
  }

  async getFieldValue(fieldLabel: string): Promise<string> {
    return element.all(this.getFieldLocator(fieldLabel)).first().getText();
  }

  async pageHeadingContains(match: string): Promise<boolean> {
    try {
      await browser.wait(
        element
          .all(by.xpath(`//*[self::h1 or self::h2 or self::h3 or self::span][contains(text(), "${match}")]`))
          .isPresent(),
        Wait.normal,
        'Page heading did not show in time'
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  async getAlertMessage(): Promise<string> {
    const locator = by.xpath("//div[contains(@class, 'alert-message')]");
    await this.waitForElement(locator);
    return element(locator).getText();
  }

  async getCcdErrorMessages(): Promise<Array<string>> {
    const locator = by.id(`errors`);
    await this.waitForElements(locator);
    return element.all(locator).map(async (x) => x.getText());
  }

  async waitUntilLoaded(): Promise<void> {
    await browser.waitForAngularEnabled(false);
    await browser.waitForAngular();
  }

  async waitForTabToLoad(fieldLabel: string): Promise<void> {
    await browser.wait(
      ExpectedConditions.visibilityOf(
        element(by.xpath(`//div[@class="mat-tab-label-content" and normalize-space()="${fieldLabel}"]`))
      ),
      30000
    );
  }

  async reloadPage(): Promise<void> {
    await browser.navigate().refresh();
    await browser.waitForAngular();
  }

  async selectIssueCode(): Promise<void> {
    await element(by.id('issueCode')).element(by.xpath('//*[@id="issueCode"]/option[3]')).click();
  }

  async selectGeneralIssueCode(): Promise<void> {
    await element(by.id('elementsDisputedGeneral_0_issueCode'))
      .element(by.xpath('//*[@id="elementsDisputedGeneral_0_issueCode"]/option[2]'))
      .click();
  }

  async selectHousingIssueCode(): Promise<void> {
    await element(by.id('elementsDisputedHousing_0_issueCode'))
      .element(by.xpath('//*[@id="elementsDisputedHousing_0_issueCode"]/option[2]'))
      .click();
  }

  async selectChildcareIssueCode(): Promise<void> {
    await element(by.id('elementsDisputedChildCare_0_issueCode'))
      .element(by.xpath('//*[@id="elementsDisputedChildCare_0_issueCode"]/option[2]'))
      .click();
  }

  async eventsPresentInHistory(linkText: string): Promise<boolean> {
    const linkPath = `//*[self::button or self::a][normalize-space()="${linkText}"]`;
    return (await element(by.xpath(linkPath))).isPresent();
  }

  async elementNotPresent(linkText: string): Promise<void> {
    const linkPath = `//*[self::button or self::a or self::span][normalize-space()="${linkText}"]`;
    await element.all(by.xpath(linkPath)).then((items) => {
      expect(items.length).to.equal(0);
    });
  }

  async fillNote(): Promise<void> {
    await element(by.id('tempNoteDetail')).sendKeys('This is a test');
  }

  async contentContains(match: string, wait: Wait = Wait.normal): Promise<boolean> {
    const contentPath =
      `//*[` +
      `self::h1 or ` +
      `self::h2 or ` +
      `self::h3 or ` +
      `self::h4 or ` +
      `self::caption or ` +
      `self::label or ` +
      `self::p or ` +
      `self::li                        [contains(text(), "${match}")] or ` + // for bulleted text
      `self::div                       [contains(text(), "${match}")] or ` + // avoid text in child nodes
      `self::ccd-read-date-field       [contains(text(), "${match}")] or ` + // for more generic containers
      `self::dt                        [contains(text(), "${match}")] or ` + // added recently
      `self::ccd-read-fixed-list-field [contains(text(), "${match}")] or ` + // ..
      `self::ng-component              [contains(text(), "${match}")] or ` + // ..
      `self::span                      [contains(text(), "${match}")] or ` + // ..
      `self::td                        [contains(text(), "${match}")]` + // ..
      `]` +
      `[contains(normalize-space(), "${match}") and not(ancestor::*[@hidden])]`;

    try {
      await browser.wait(async () => {
        return (
          (await element
            .all(by.xpath(contentPath))
            .filter(async (elementFinder) => (await elementFinder.isPresent()) && elementFinder.isDisplayed())
            .count()) > 0
        );
      }, wait);

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async smartWait(number): Promise<void> {
    await browser.driver.sleep(number);
  }

  async scrollBar(locator: string): Promise<void> {
    const elementFinder = await this.clickElementByXpath(locator);
    await browser.executeScript('arguments[0].scrollIntoView();', elementFinder);
    await this.smartWait(1000);
  }

  async setFinalDecisionsReasons(text: string): Promise<void> {
    await this.clickButton(text);
    await this.setText("//textarea[@rows='3']", 'I am very busy');

    await this.clickContinue();
  }

  async setText(key: string, value: string): Promise<void> {
    const textBoxRef = async () => {
      return (
        (await element
          .all(by.xpath(key))
          .filter(async (elementFinder) => (await elementFinder.isPresent()) && elementFinder.isDisplayed())
          .count()) > 0
      );
      return true;
    };

    if (textBoxRef) {
      await element.all(by.xpath(key)).sendKeys(value);
    }
  }

  async scrollPage(locator: string): Promise<void> {
    await browser.manage().window().maximize();
    await this.scrollBar(locator);
  }

  async selectEvent(event): Promise<void> {
    await element(by.cssContainingText('option', event)).click();
    await this.smartWait(1000);
    await this.clickButton('Go');
    await this.smartWait(1000);
    await this.clickSubmit();
    await this.smartWait(5000);
    await this.clickElement('div', 'History');
    await this.smartWait(2000);
  }

  async runAccessibility(): Promise<void> {
    await runAndReportAccessibility();
  }

  async contentContainsSubstring(substring: string, wait: Wait = Wait.normal): Promise<boolean> {
    const contentPath =
      '//*[' +
      'self::h1 or ' +
      'self::h2 or ' +
      'self::h3 or ' +
      'self::h4 or ' +
      'self::caption or ' +
      'self::label or ' +
      'self::p or ' +
      'self::li or ' +
      'self::div or ' +
      'self::ccd-read-date-field or ' +
      'self::dt or ' +
      'self::ccd-read-fixed-list-field or ' +
      'self::ng-component or ' +
      'self::span or ' +
      'self::td' +
      ']';

    try {
      await browser.wait(async () => {
        return (
          (await element
            .all(by.xpath(contentPath))
            .filter(
              async (elementFinder) =>
                (await elementFinder.isPresent()) &&
                (await elementFinder.isDisplayed()) &&
                elementFinder.elementTextContains(substring)
            )
            .count()) > 0
        );
      }, wait);

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async waitForSpinner(): Promise<void> {
    const elementFinder = element(by.className('spinner-container'));
    await browser.wait(ExpectedConditions.not(ExpectedConditions.presenceOf(elementFinder)), Wait.normal);
  }

  async uploadFile(inputElement: string, fileName: string, folder = 'e2e/dwpResponse/') {
    const absolutePath = path.resolve(process.cwd(), folder, fileName);
    await element(by.id(inputElement)).sendKeys(absolutePath);
    if (crossBrowserTest) {
      browser.setFileDetector(new remote.FileDetector());
    }
    const uploadingLocator = by.cssContainingText('.error-message', 'Uploading');
    logger.info(`Uploading: ${await element(uploadingLocator).isPresent()}`);
    await browser.wait(ExpectedConditions.not(ExpectedConditions.presenceOf(element(uploadingLocator))), Wait.long);
  }

  async waitForEndState(state: string): Promise<void> {
    const endStateLabel = 'End state';
    await this.reloadPage();
    await this.clickTab('History');
    if (!(await this.isFieldValueDisplayed(endStateLabel, state))) {
      await browser.sleep(Wait.short);
      await this.reloadPage();
      await this.clickTab('History');
    }
    const locator = await this.getFieldValueLocator(endStateLabel, state);
    await this.waitForElement(locator, Wait.long);
  }
}
