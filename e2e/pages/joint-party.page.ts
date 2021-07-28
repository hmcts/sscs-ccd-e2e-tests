import { by, element } from 'protractor';
import { AnyCcdPage } from './any-ccd.page';

export class JointPartyPage extends AnyCcdPage {

      async addJointPartyDetails() {
            element(by.id('jointPartyName_title')).sendKeys('Mr');
            element(by.id('jointPartyName_firstName')).sendKeys('JPFirstName');
            element(by.id('jointPartyName_lastName')).sendKeys('JPLastName');
            element(by.id('jointPartyAddressSameAsAppellant-No')).click();
            element(by.id('jointPartyAddress_line1')).sendKeys('Jp Address line1');
            element(by.id('jointPartyAddress_line2')).sendKeys('Jp Address line2');
            element(by.id('jointPartyAddress_town')).sendKeys('Jp Town');
            element(by.id('jointPartyAddress_county')).sendKeys('Jp County');
            element(by.id('jointPartyAddress_postcode')).sendKeys('TS1 1ST');

            element(by.id('jointPartyIdentity_nino')).sendKeys('KL335252C');
            element(by.xpath('//button[2]')).click();
        }
}
