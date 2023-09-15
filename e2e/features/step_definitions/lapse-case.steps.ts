import { When } from 'cucumber';
import { LapseCasePage } from '../../pages/lapsecase.page';

const lapsecase = new LapseCasePage();

When('I set FTA State to Lapsed {string}', async function (action) {
    await lapsecase.uploadResponse(action);
});
