import { browser, by, element, ExpectedConditions } from 'protractor';
import { AnyPage } from './any.page';
import * as path from 'path';
import { expect } from 'chai';

export class IssueDecisionPage extends AnyPage {

    async uploadDirection() {
        await browser.waitForAngular();
        let remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        await this.uploadFile('writeFinalDecisionPreviewDocument', 'issue1.pdf');
    }

    async uploadFile(inputElement: string, fileName: string) {
        let fileToUpload = '../dwpResponse/' + fileName,
        absolutePath = path.resolve(__dirname, fileToUpload);
        await element(by.id(inputElement)).sendKeys(absolutePath);
    }

    async addPanelMembers() {
        element(by.id('writeFinalDecisionDisabilityQualifiedPanelMemberName')).sendKeys('Disability Member');
        element(by.id('writeFinalDecisionMedicallyQualifiedPanelMemberName')).sendKeys('Medically Member');
    }

    async pageReference() {
        await browser.wait(ExpectedConditions.presenceOf(element(by.id('writeFinalDecisionPageSectionReference'))), 5000);
        element(by.id('writeFinalDecisionPageSectionReference')).sendKeys('20');
    }

    async fillSummary() {
        await browser.wait(ExpectedConditions.presenceOf(element(by.id('writeFinalDecisionDetailsOfDecision'))), 5000);
        element(by.id('writeFinalDecisionDetailsOfDecision')).sendKeys('This is the summary');
    }

    async schedule6PageFieldsAreInTheCorrectOrder() {
        let labels = await element.all(by.className('form-label')).filter(e => e.isPresent() && e.isDisplayed());

        expect(labels.length).to.equal(19);

        let expected_labels = [
            'Part 1: Physical Disabilities (Optional)',
            '1. Mobilising unaided by another person with or without a walking stick, manual wheelchair or other aid if such aid ' +
                'is normally or could reasonably be worn or used.',
            '2. Standing and sitting.',
            '3. Reaching.',
            '4. Picking up and moving or transferring by the use of the upper body and arms.',
            '5. Manual dexterity.',
            '6. Making self understood through speaking, writing, typing, or other means which are normally or could ' +
                'reasonably be used, unaided by another person.',
            '7. Understanding communication by: (i) verbal means (such as hearing or lip reading) alone; (ii) ' +
                'non-verbal means (such as reading 16 point print or Braille) alone; or (iii) a combination of ' +
                'sub-paragraphs (i) and (ii), using any aid that is normally or could reasonably be used, unaided by another person.',
            '8. Navigation and maintaining safety using a guide dog or other aid if either or both are normally used ' +
                'or could reasonably be used.',
            '9. Absence or loss of control whilst conscious leading to extensive evacuation of the bowel and/or ' +
                'bladder, other than enuresis (bed- wetting), despite the wearing or use of any aids or adaptations ' +
                'which are normally or could reasonably be worn or used.',
            '10. Consciousness during waking moments.',

            'Part 2: Mental, cognitive and intellectual function assessment (Optional)',
            '11. Learning tasks.',
            '12. Awareness of everyday hazards (such as boiling water or sharp objects).',
            '13. Initiating and completing personal action (which means planning, organisation, problem solving, ' +
                'prioritising or switching tasks).',
            '14. Coping with change.',
            '15. Getting about.',
            '16. Coping with social engagement due to cognitive impairment or mental disorder.',
            '17. Appropriateness of behaviour with other people, due to cognitive impairment or mental disorder.'
        ];

        for (let i = 0; i < expected_labels.length; i ++) {
            expect(await labels[i].getText()).to.equal(expected_labels[i]);
        }

    }
}
