import { When } from 'cucumber';
import { LapseCasePage } from '../../pages/lapsecase.page';

const lapsecase = new LapseCasePage();

When(/^I set DWP State to Lapsed "(.+)"$/, async function (action) {
        await lapsecase.uploadResponse(action);
});
