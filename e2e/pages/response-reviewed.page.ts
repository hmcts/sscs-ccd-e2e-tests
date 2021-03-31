import { AnyPage } from './any.page';
import { AnyCcdPage } from './any-ccd.page';

const anyCcdPage = new AnyCcdPage();
export class ResponseReviewedPage extends AnyPage {

    async reviewUCResponse() {
        // HMCTS review response page
        await anyCcdPage.runAccessbility();
        await this.isInterlocRequired('No');
        await anyCcdPage.click('Continue');
        // Elements disputed page
        await anyCcdPage.runAccessbility();
        await anyCcdPage.click('Continue');
        // Issue codes page
        await anyCcdPage.runAccessbility();
        await anyCcdPage.click('Continue');
        // Reference appeal page
        await anyCcdPage.runAccessbility();
        await anyCcdPage.click('Continue');
        // Check your Answers
        await anyCcdPage.runAccessbility();
        await anyCcdPage.click('Submit');
    }

    async isInterlocRequired(yesOrNo: string) {
        await anyCcdPage.clickElementById('isInterlocRequired-' + yesOrNo);
    }

}
