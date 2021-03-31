import { When } from 'cucumber';
import { AnyCcdPage } from '../../pages/any-ccd.page';

const anyCcdPage = new AnyCcdPage();

When(/^I submit the interloc reason$/, async function () {
    await anyCcdPage.chooseOptionContainingText('#interlocReferralReason', 'Other');
    await anyCcdPage.click('Continue');

    // await anyCcdPage.click('Add new');
    await anyCcdPage.clickAction('//button[contains(text(), \'Add new\')]')
    await anyCcdPage.fillNote();

    await anyCcdPage.runAccessbility();
    await anyCcdPage.click('Continue');
    await anyCcdPage.runAccessbility();
    await anyCcdPage.click('Submit');
});
