import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { Then, When } from 'cucumber';

const anyCcdFormPage = new AnyCcdFormPage();

When(/^I add (?:a|another) new item to the (.+) collection$/, async function (collectionLabel) {
    await anyCcdFormPage.addNewCollectionItem(collectionLabel);
});

Then(/^Within the (.+) collection, I (?:choose|select|type) (.+) for the ([^\s]+) (.+) field$/,
    async function (
        collectionLabel,
        fieldValue,
        collectionItemNumber,
        fieldLabel
    ) {
        await anyCcdFormPage.setCollectionItemFieldValue(
            collectionLabel,
            collectionItemNumber,
            fieldLabel,
            fieldValue
        );
    });

Then(/^I (?:check|choose|select|toggle|type) (.+) (?:for|from) the (.+) field$/,
    async function (
        fieldValue,
        fieldLabel
    ) {
        await anyCcdFormPage.setFieldValue(
            fieldLabel,
            fieldValue
        );
    });
