import { AnyCcdPage } from '../../pages/any-ccd.page';
import { Then } from 'cucumber';

const serviceConfig = require('../../service.conf');
const anyCcdPage = new AnyCcdPage();

Then(/^The page is accessible$/, async function () {
    if (serviceConfig.TestForAccessibility) {
        await anyCcdPage.runAccessibility();
    }
});
