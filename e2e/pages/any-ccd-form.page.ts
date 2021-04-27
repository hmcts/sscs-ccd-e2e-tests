import { $, browser, by, element, ExpectedConditions } from 'protractor';
import { AnyCcdPage } from './any-ccd.page';
import { FormFiller } from '../helpers/form-filler';
import { OrdinalToCardinal } from '../helpers/ordinal-to-cardinal';
import moment = require('moment');

export class AnyCcdFormPage extends AnyCcdPage {

    private formFiller = new FormFiller();

    private cancelLink = 'p.cancel';

    async addNewCollectionItem(collectionLabel: string) {

        const collectionContainer = await this.findCollectionContainer(collectionLabel);

        await browser.wait(ExpectedConditions.elementToBeClickable(element(by.xpath('.//button[normalize-space()="Add new"]'))), 5000);
        await collectionContainer
            .all(by.xpath('.//button[normalize-space()="Add new"]'))
            .last()
            .click();
    }

   async setValueByElementId(key: string, value: string) {
          element(by.id(key)).sendKeys(value);
   }

    async setTextFiledValueNull(key: string) {
        element(by.id(key)).clear();
        await browser.sleep(500);
    }

    async setCollectionItemFieldValue(
        collectionLabel: string,
        collectionItemNumber: string | number,
        fieldLabel: string,
        fieldValue: string
    ) {
        const collectionItemContainer =
            await this.findCollectionItemContainer(collectionLabel, collectionItemNumber);

        const fieldContainer =
            await this.findFieldContainer(collectionItemContainer, fieldLabel);

        await this.setFieldValueWithinContainer(fieldContainer, fieldValue);
    }

    async isLoaded() {
        return (await browser.driver.getCurrentUrl()).includes('ccd')
            && (await ExpectedConditions.visibilityOf($(this.cancelLink))());
    }

    private async findCollectionContainer(collectionLabel: string) {
        return await element
            .all(by.xpath('//ccd-write-collection-field//h2[normalize-space()="' + collectionLabel + '" or normalize-space()="' +
                collectionLabel + ' (Optional)"]/ancestor::ccd-write-collection-field'))
            .first();
    }

    private async findCollectionItemContainer(collectionLabel: string, collectionItemNumber: string | number) {

        const cardinalNumber = typeof collectionItemNumber === 'number'
            ? collectionItemNumber
            : OrdinalToCardinal.convertWordToNumber(collectionItemNumber);

        let collectionItemLabel = collectionLabel;
        if (cardinalNumber > 1) {
            collectionItemLabel += ' ' + cardinalNumber;
        }

        const collectionContainer = await this.findCollectionContainer(collectionLabel);

        return await collectionContainer
            .all(by.xpath('.//div[@class="collection-title"]//label[normalize-space()="' + collectionItemLabel + '"]/../../..'))
            .first();
    }

    private async findFieldContainer(container, fieldLabel) {

        const fieldWithLabelContainer =
            container
                .all(by.xpath('.//span[@class="form-label" and normalize-space()="' + fieldLabel + '"]/ancestor::ccd-field-write'));

        if (await fieldWithLabelContainer.isPresent()) {
            return await fieldWithLabelContainer.last();
        } else {

            return container
                .all(by.xpath('.//ccd-field-write'))
                .last();
        }
    }

    async setFieldValueWithinContainer(fieldContainer, fieldValue) {

        // the order can be important, for example ccd-write-address-field must be before
        // ccd-write-text-field to allow addresses to be selected from the AddressUK complex type

        if (await fieldContainer.$$('ccd-write-address-field').isPresent()) {

            const optionElement = await fieldContainer
                .element(by.xpath('.//option[normalize-space()="' + fieldValue + '"]'));

            if (await optionElement.isPresent()) {
                await optionElement.click();
            } else {

                await this.formFiller.replaceText(
                    await fieldContainer
                        .all(by.xpath('.//input[@type="text"]'))
                        .first(),
                    fieldValue
                );
            }

        } else if (await fieldContainer.$$('ccd-write-date-field').isPresent()) {

            const date = moment(fieldValue, 'DD MM YYYY');

            await this.formFiller.replaceText(
                await fieldContainer.element(by.xpath('.//input[@type="number" and contains(@name, "-day")]')),
                date.date()
            );

            await this.formFiller.replaceText(
                await fieldContainer.element(by.xpath('.//input[@type="number" and contains(@name, "-month")]')),
                (date.month() + 1)
            );

            await this.formFiller.replaceText(
                await fieldContainer.element(by.xpath('.//input[@type="number" and contains(@name, "-year")]')),
                date.year()
            );

        } else if (await fieldContainer.$$('ccd-write-fixed-list-field').isPresent()) {

            await fieldContainer
                .element(by.xpath('.//option[normalize-space()="' + fieldValue + '"]'))
                .click();

        } else if (await fieldContainer.$$('ccd-write-multi-select-list-field').isPresent()) {

            await fieldContainer
                .element(by.xpath('.//label[normalize-space()="' + fieldValue + '"]/../input[@type="checkbox"]'))
                .click();

        } else if (await fieldContainer.$$('ccd-write-text-field').isPresent()) {

            await this.formFiller.replaceText(
                await fieldContainer.element(by.xpath('.//input[@type="text"]')),
                fieldValue
            );

        } else if (await fieldContainer.$$('ccd-write-text-area-field').isPresent()) {

            await this.formFiller.replaceText(
                await fieldContainer.element(by.xpath('.//textarea[@id="writeFinalDecisionReasons_value"]')),
                fieldValue
            );

        } else if (await fieldContainer.$$('ccd-write-yes-no-field').isPresent()) {

            await fieldContainer
                .element(by.xpath('.//label[normalize-space()="' + fieldValue + '"]/../input'))
                .click();

        } else if (await fieldContainer.$$('select.ccd-dropdown').isPresent()) {

            await fieldContainer.$$('select.ccd-dropdown').click();
            await fieldContainer
                .element(by.xpath('.//option[normalize-space()="' + fieldValue + '"]'))
                .click();

        } else {
            throw 'Unsupported field type';
        }
    }

    async setCreateCaseFieldValue(
        fieldLabel: string,
        fieldValue: string
    ) {
        const fieldContainer =
            await element
                .all(by.xpath('.//label[@class="form-label" and normalize-space()="' + fieldLabel + '"]/ancestor::ccd-create-case-filters'))
                .last();

            await this.setFieldValueWithinContainer(fieldContainer, fieldValue)
    }
}
