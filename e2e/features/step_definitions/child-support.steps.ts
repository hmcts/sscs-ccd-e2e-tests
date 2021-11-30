import { AnyCcdPage } from '../../pages/any-ccd.page';
import { AnyCcdFormPage } from '../../pages/any-ccd-form.page';
import { Given } from 'cucumber';

const anyCcdPage = new AnyCcdPage();
const anyCcdFormPage = new AnyCcdFormPage();

Given(/^I add other party data$/, async function () {
    await anyCcdPage.click('Add new');
    await anyCcdFormPage.fillValues('otherParties_0_name_title' , 'Mr');
    await anyCcdFormPage.fillValues('otherParties_0_name_firstName', 'Other');
    await anyCcdFormPage.fillValues('otherParties_0_name_lastName', 'Tester');
    await anyCcdFormPage.fillValues('otherParties_0_address_line1', '101, test');
    await anyCcdFormPage.fillValues('otherParties_0_address_town', 'test');
    await anyCcdFormPage.fillValues('otherParties_0_address_postcode', 'TS2 2ST');
    await anyCcdFormPage.chooseOptionByElementId('otherParties_0_role_name', 'Paying parent');
    await anyCcdFormPage.clickElementById('otherParties_0_confidentialityRequired_No');
    await anyCcdFormPage.clickElementById('otherParties_0_unacceptableCustomerBehaviour_No');
    await anyCcdFormPage.clickElementById('otherParties_0_hearingSubtype_wantsHearingTypeFaceToFace_Yes');
    await anyCcdFormPage.clickElementById('otherParties_0_isAppointee_No');
    await anyCcdFormPage.clickElementById('otherParties_0_rep_hasRepresentative_No');
    await anyCcdPage.click('Continue');
    await anyCcdPage.click('Submit');
});
