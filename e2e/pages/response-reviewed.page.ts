import { AnyPage } from './any.page';
import { AnyCcdPage } from './any-ccd.page';
import { expect } from 'chai';

const anyCcdPage = new AnyCcdPage();
export class ResponseReviewedPage extends AnyPage {

    async reviewUCResponse() {
        // HMCTS review response page
        await this.isInterlocRequired('No');
        await anyCcdPage.click('Continue');
        // Elements disputed page
        expect(await anyCcdPage.pageHeadingContains('Elements disputed')).to.equal(true);
        await anyCcdPage.click('Continue');
        // Issue codes page
        expect(await anyCcdPage.pageHeadingContains('Issue codes')).to.equal(true);
        await anyCcdPage.click('Continue');
        // Reference appeal  page
        expect(await anyCcdPage.pageHeadingContains('Linked appeal reference')).to.equal(true);
        await anyCcdPage.click('Continue');
        // Check your Answers
        expect(await anyCcdPage.pageHeadingContains('Response reviewed')).to.equal(true);
        await anyCcdPage.click('Submit');
    }

    async isInterlocRequired(yesOrNo: string) {
        await anyCcdPage.clickElementById('isInterlocRequired_' + yesOrNo);
    }

}
