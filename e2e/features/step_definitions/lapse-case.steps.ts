import { AnyCcdPage } from '../../pages/any-ccd.page';
import { When } from 'cucumber';
import { LapseCasePage } from '../../pages/lapsecase.page';

const anyCcdPage = new AnyCcdPage();
const lapsecase = new LapseCasePage();

When(/^I set DWP State to Lapsed "(.+)"$/, async function (action) {
    await lapsecase.uploadResponse(action);
    await anyCcdPage.chooseOptionByElementId('dwpState', 'No action');
    await anyCcdPage.chooseOptionByElementId('interlocReviewState', 'N/A');
    await anyCcdPage.click('Continue');
});
