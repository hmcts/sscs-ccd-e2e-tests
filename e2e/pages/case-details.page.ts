import { by, element, browser, ExpectedConditions } from 'protractor';
import { AnyCcdPage } from './any-ccd.page';
import { AnyCcdFormPage } from './any-ccd-form.page';
import { OrdinalToCardinal } from '../helpers/ordinal-to-cardinal';

const anyCcdFormPage = new AnyCcdFormPage();

export class CaseDetailsPage extends AnyCcdPage {

    async doNextStep(actionItem: string) {
        const nextStepContainer =
            await element
                .all(by.xpath('.//label[@class="form-label" and normalize-space()="Next step"]/ancestor::ccd-event-trigger'))
                .last();

        await browser.wait(ExpectedConditions.visibilityOf(nextStepContainer), 5000);
        await anyCcdFormPage.setFieldValueWithinContainer(nextStepContainer, actionItem);
    }

    async isCollectionItemFieldValueDisplayed(
        collectionLabel: string,
        collectionItemNumber: string | number,
        fieldLabel: string,
        fieldValue: string
    ) {
        try {

            const collectionItemContainer =
                await this.findCollectionItemContainer(collectionLabel, collectionItemNumber);

            if ((await collectionItemContainer.getTagName()) === 'ccd-read-complex-field-table') {

                const fieldContainer =
                    await collectionItemContainer
                        .all(by.xpath('.//th/span[normalize-space()="' + fieldLabel + '"]/../..'))
                        .first();

                return await fieldContainer
                    .element(by.xpath('.//td/span[normalize-space()="' + fieldValue + '"]'))
                    .isDisplayed();

            } else {

                return await collectionItemContainer
                    .all(by.xpath('.//*[normalize-space()="' + fieldValue + '"]'))
                    .last()
                    .isDisplayed();
            }

        } catch (error) {
            return false;
        }
    }

    async addEnvelopeDataItems(journeyClassification: string, poBox: string, poBoxJurisdiction: string, envelopeId: string) {
        element(by.id('journeyClassification')).sendKeys(journeyClassification)
        element(by.id('poBox')).sendKeys(poBox)
        element(by.id('poBoxJurisdiction')).sendKeys(poBoxJurisdiction)
        element(by.id('envelopeId')).sendKeys(envelopeId)
    }

    async addDateItems(dateType: String) {
        browser.driver.sleep(100);
        const today = new Date();
        element(by.id(dateType + '-day')).sendKeys(today.getDay() + 1)
        element(by.id(dateType + '-month')).sendKeys(today.getMonth() + 1)
        element(by.id(dateType + '-year')).sendKeys(today.getFullYear() - 10)

        element(by.id(dateType + '-hour')).sendKeys(today.getHours())
        element(by.id(dateType + '-minute')).sendKeys(today.getMinutes())
        element(by.id(dateType + '-second')).sendKeys(today.getSeconds())
        browser.driver.sleep(100);
    }

    async addReasonAndDate(dateType: String) {
            element(by.id('notListableProvideReasons')).sendKeys('reason for not listable goes here')
            await this.click('Continue');
            browser.driver.sleep(100);
            this.addFutureDate(dateType);
       }

    async addFutureDate(dateType: String) {
                    const tomorrow = new Date();
                    tomorrow.setDate(new Date().getDate() + 1)
                    element(by.id(dateType + '-day')).sendKeys(tomorrow.getDate() + 1)
                    element(by.id(dateType + '-month')).sendKeys(tomorrow.getMonth() + 1)
                    element(by.id(dateType + '-year')).sendKeys(tomorrow.getFullYear())
                    await this.click('Continue');
      }

       async addPastDate(dateType: String) {
                          const tomorrow = new Date();

                          tomorrow.setDate(new Date().getDate() - 1)
                          element(by.id(dateType + '-day')).sendKeys(tomorrow.getDate())
                          element(by.id(dateType + '-month')).sendKeys(tomorrow.getMonth() + 1)
                          element(by.id(dateType + '-year')).sendKeys(tomorrow.getFullYear())
            }

    async addDayItems(dateType: String) {
        browser.driver.sleep(100);
        const today = new Date();
        today.setDate(new Date().getDate() - 1)
        await element(by.id(dateType + '-day')).clear();
        await element(by.id(dateType + '-day')).sendKeys(today.getDate());
        await element(by.id(dateType + '-month')).clear();
        await element(by.id(dateType + '-month')).sendKeys(today.getMonth() + 1);
        if (dateType === 'writeFinalDecisionEndDate') {
            await element(by.id(dateType + '-year')).clear();
            await element(by.id(dateType + '-year')).sendKeys(today.getFullYear() + 1);
        } else {
            await element(by.id(dateType + '-year')).clear();
            await element(by.id(dateType + '-year')).sendKeys(today.getFullYear());
        }

        await browser.driver.sleep(100);
    }

    async addFormType(formType: string) {
        element(by.id('formType')).sendKeys(formType);
    }

    private async findCollectionContainer(collectionLabel: string) {

        return await element
            .all(by.xpath('//div[normalize-space()="' + collectionLabel + '"]/../..//table[@class="collection-field-table"]'))
            .first();
    }

    private async findCollectionItemContainer(collectionLabel: string, collectionItemNumber: string | number) {

        const cardinalNumber = typeof collectionItemNumber === 'number'
            ? collectionItemNumber
            : OrdinalToCardinal.convertWordToNumber(collectionItemNumber);

        const collectionContainer = await this.findCollectionContainer(collectionLabel);

        if (await collectionContainer.$$('ccd-read-complex-field').isPresent()) {

            let collectionItemLabel = collectionLabel + ' ' + cardinalNumber;

            return await collectionContainer
                .all(by.xpath('.//dt/span[normalize-space()="' + collectionItemLabel + '"]/ancestor::ccd-read-complex-field-table'))
                .first();

        } else {

            return await collectionContainer
                .all(by.xpath('.//ccd-field-read')).get(cardinalNumber - 1);
        }
    }
}
