import { $, $$, browser, by, element, ExpectedConditions } from 'protractor';
import { AnyPage } from './any.page';
import { Wait } from '../enums/wait';
import { expect } from 'chai';

const AxeRunner = require('../helpers/axe-runner');

export class AnyCcdPage extends AnyPage {

    private signOutLink = '#sign-out';

    async click(linkText: string) {

        const linkPath = '//*[self::button or self::a][normalize-space()="' + linkText + '"]';

        await browser.wait(
            async () => {
                return await element
                    .all(by.xpath(linkPath))
                    .isPresent();
            },
            Wait.normal,
            'Button did not show in time'
        );

        await element
            .all(by.xpath(linkPath))
            .first()
            .click();

        await this.smartWait(2000);
    }

    async clickElementById(elementId: string) {
        await browser.wait(
            async () => {
                return await element(by.id(elementId))
                    .isPresent();
            },
            Wait.normal,
            'Button did not show in time'
        );
        await element(by.id(elementId)).click();
        await this.smartWait(2000);
    }

    async clickElementByCss(elementId: string) {
        await browser.wait(
            async () => {
                return await element(by.css(elementId))
                    .isPresent();
            },
            Wait.normal,
            'Button did not show in time'
        );
        await element(by.css(elementId)).click();
        await this.smartWait(2000);
    }

    async clickAction(elementId: string) {
        await browser.wait(
            async () => {
                return await element(by.xpath(elementId))
                    .isPresent();
            },
            Wait.normal,
            'Button did not show in time'
        );
        await element(by.xpath(elementId)).click();
        await this.smartWait(2000)
    }

    async clickTab(tabTitle: string, waitTime = 30000) {
        await browser.wait(ExpectedConditions.visibilityOf(element(by.xpath('//div[text()="' + tabTitle + '"]'))), waitTime);
        await element(by.xpath('//div[text()="' + tabTitle + '"]')).click();
    }

   async clickElementByIdXPath(xPathStr: string) {
            await element(by.xpath(xPathStr)).click();
   }

    async chooseOptionByElementId(elementId: string, option: string) {
        await element(by.id(elementId))
            .element(by.xpath('.//option[normalize-space()="' + option + '"]'))
            .click();
    }

    async chooseOptionContainingText(elementId: string, option: string) {
        await browser.wait(
            async () => {
                return await element(by.css(elementId))
                    .isPresent();
            },
            Wait.normal,
            'Button did not show in time'
        );
        await element(by.css(elementId)).element(by.cssContainingText('option', option)).click()
    }

    async chooseOptionByValue(elementId: string, value: string) {
        await browser.wait(
            async () => {
                return await element(by.css(elementId))
                    .isPresent();
            },
            Wait.normal,
            'Button did not show in time'
        );
        await element(by.css(elementId)).element(by.css('option[value="' + value + '"]')).click()
    }

    async fillValues(elementId: string, actText: string) {
        await element(by.id(elementId)).clear();
        await element(by.id(elementId)).sendKeys(actText);
    }

    async isFieldValueDisplayed(
        fieldLabel: string,
        fieldValue: string
    ) {
        try {

            if (await $$('ccd-create-case-filters').isPresent()) {
                const fieldLabelElement = await element(by.xpath('//label[normalize-space()="' + fieldLabel + '"]'));
                const fieldElement = await element(by.css('#' + (await fieldLabelElement.getAttribute('for'))));
                const fieldElementTagName = await fieldElement.getTagName();

                if (fieldElementTagName === 'select') {

                    const fieldSelectedElement = await fieldElement.element(by.css('option:checked'));
                    return (await fieldSelectedElement.getText() === fieldValue);

                } else {
                    throw 'Unsupported field type';
                }

            } else if ($$('cut-tabs').isPresent()) {
                if ($$('ccd-event-log').isPresent() || $$('ccd-read-complex-field-table').isPresent()) {
                    return await element(by.xpath('//span[normalize-space()="' + fieldLabel + '"]/../..' +
                        '//td[normalize-space()="' + fieldValue + '"]'))
                        .isDisplayed();

                } else {
                    return await element(by.xpath('//*[normalize-space()="' + fieldLabel + '"]/../..' +
                        '//td[normalize-space()="' + fieldValue + '"]'))
                        .isDisplayed();
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async getFieldValue(fieldLabel: string) {
        return await element
            .all(by.xpath('//*[normalize-space()="' + fieldLabel + '"]/../../td'))
            .first()
            .getText();
    }

    async pageHeadingContains(match: string) {
        try {

            await browser.wait(
                async () => {
                    return await element
                        .all(by.xpath('//*[self::h1 or self::h2 or self::h3 or self::span][contains(text(), "' + match + '")]'))
                        .isPresent();
                },
                Wait.normal,
                'Page heading did not show in time'
            );

            return true;

        } catch (error) {
            return false;
        }
    }

    async alertContains(match: string) {

        await browser.wait(ExpectedConditions.visibilityOf($('div.alert-message')));
        return (await $('div.alert-message').getText()).includes(match);
    }

    async isLoaded() {
        return (await browser.driver.getCurrentUrl()).includes('ccd')
            && (await ExpectedConditions.visibilityOf($(this.signOutLink))());
    }

    async waitUntilLoaded() {
        await browser.waitForAngularEnabled(false);
        await browser.waitForAngular();
    }

    async waitForTabToLoad(fieldLabel: string) {
        await browser.wait(ExpectedConditions.visibilityOf(
                            element(by.xpath('//div[@class="mat-tab-label-content" and normalize-space()="' + fieldLabel + '"]'))), 30000);
    }

    async reloadPage() {
        await browser.navigate().refresh();
        await browser.waitForAngular();
    }

    async selectIssueCode() {
        await element(by.id('issueCode')).element(by.xpath('//*[@id="issueCode"]/option[3]')).click();
    }

    async selectGeneralIssueCode() {
        await element(by.id('elementsDisputedGeneral_0_issueCode'))
            .element(by.xpath('//*[@id="elementsDisputedGeneral_0_issueCode"]/option[2]')).click();
    }

    async selectHousingIssueCode() {
        await element(by.id('elementsDisputedHousing_0_issueCode'))
            .element(by.xpath('//*[@id="elementsDisputedHousing_0_issueCode"]/option[2]')).click();
    }

    async selectChildcareIssueCode() {
        await element(by.id('elementsDisputedChildCare_0_issueCode'))
            .element(by.xpath('//*[@id="elementsDisputedChildCare_0_issueCode"]/option[2]')).click();
    }

    async eventsPresentInHistory(linkText: string) {
        const linkPath = '//*[self::button or self::a][normalize-space()="' + linkText + '"]';
        return await element(by.xpath(linkPath)).isPresent();
    }

    async elementNotPresent(linkText: string) {
        const linkPath = '//*[self::button or self::a or self::span][normalize-space()="' + linkText + '"]';
        await element.all(by.xpath(linkPath)).then(
            async (items) => {
               await expect(items.length).to.equal(0);
        });
    }

    async fillNote() {
        element(by.id('tempNoteDetail')).sendKeys('This is a test');
    }

    async contentContains(match: string, wait: Wait = Wait.normal) {

        const contentPath =
            '//*[' +
            'self::h1 or ' +
            'self::h2 or ' +
            'self::h3 or ' +
            'self::h4 or ' +
            'self::caption or ' +
            'self::label or ' +
            'self::p or ' +
            'self::li                        [contains(text(), "' + match + '")] or ' +  // for bulleted text
            'self::div                       [contains(text(), "' + match + '")] or ' +  // avoid text in child nodes
            'self::ccd-read-date-field       [contains(text(), "' + match + '")] or ' +  // for more generic containers
            'self::dt                        [contains(text(), "' + match + '")] or ' +  // added recently
            'self::ccd-read-fixed-list-field [contains(text(), "' + match + '")] or ' +  // ..
            'self::ng-component              [contains(text(), "' + match + '")] or ' +  // ..
            'self::span                      [contains(text(), "' + match + '")] or ' +  // ..
            'self::td                        [contains(text(), "' + match + '")]' +      // ..
            ']' +
            '[contains(normalize-space(), "' + match + '") and not(ancestor::*[@hidden])]';

        try {
            await browser.wait(
                async () => {
                    return (await element
                        .all(by.xpath(contentPath))
                        .filter(e => e.isPresent() && e.isDisplayed())
                        .count()) > 0;
                },
                wait
            );

            return true;

        } catch (error) {
            return false;
        }
    }

    async smartWait(number) {
        await browser.driver.sleep(number)

    }

    async scrollBar(locator: string) {
        let button = await element(by.xpath(locator));
        await browser.executeScript('arguments[0].scrollIntoView();', button);
        await this.smartWait(1000);
        button.click();
        await this.smartWait(2000);
    }

    async setFinalDecisionsReasons(
        elementRef1: string,
        waitTime: number
    ) {
        await this.clickAction(elementRef1);
        await this.setText('//textarea[@rows=\'3\']', 'I am very busy');

        await this.click('Continue');
    }

    async setText(key: string, value: string) {
         let textBoxRef =  async () => {
                    return (await element
                        .all(by.xpath(key))
                        .filter(e => e.isPresent() && e.isDisplayed())
                        .count()) > 0;
             return true;
                }

        if (textBoxRef) {
            await element.all(by.xpath(key)).sendKeys(value);
        }
    };

    async scrollPage(locator: string) {
        let button = await element(by.xpath(locator));
        await browser.manage().window().maximize()
        button.click();
        await browser.executeScript('arguments[0].scrollIntoView();', button);
        await this.smartWait(5000);
    }

    async selectEvent( event) {
        element(by.cssContainingText('option', event)).click();
        await this.smartWait(1000);
        await this.clickAction('//button[contains(text(),\'Go\')]');
        await this.smartWait(1000);
        await this.clickAction('//button[contains(text(),\'Submit\')]');
        await this.smartWait(5000);
        await this.clickAction('//div[text()=\'History\']');
        await this.smartWait(2000);
    };

    async runAccessibility() {
        await AxeRunner.runAndReportAccessibility();
    };

    async contentContainsSubstring(substring: string, wait: Wait = Wait.normal) {

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
            ']'

        try {
            await browser.wait(
                async () => {
                    return (await element
                        .all(by.xpath(contentPath))
                        .filter(e => e.isPresent() && e.isDisplayed() && e.elementTextContains(substring))
                        .count()) > 0;
                },
                wait
            );

            return true;

        } catch (error) {
            return false;
        }
    }

    async waitForSpinnerToHide() {
        browser.wait(async () => {
            const result = await $('.spinner-container').isDisplayed();
            return !result;
          }, 20000);
    }
}
