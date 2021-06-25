import { Then } from 'cucumber';
const serviceConfig = require('../../service.conf')

import { AnyCcdPage } from '../../pages/any-ccd.page';
const anyCcdPage = new AnyCcdPage();

async function accessibilityCheck() {
    if (serviceConfig.TestForAccessibility) {
      await anyCcdPage.runAccessibility();
    }
  }

Then(/^the page is accessible$/, async function () {
    accessibilityCheck()
});

module.exports = { accessibilityCheck }