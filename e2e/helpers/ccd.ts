const rp = require('request-promise');

const serviceConfig = require('../service.conf');
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('ccd.ts');
const timeout = serviceConfig.ApiCallTimeout;
const ucPayload = require('../features/json/uc_sya.json');
const pipPayload = require('../features/json/pip_sya.json');
const esaPayload = require('../features/json/esa_sya.json');

async function createCase(hearingType) {
    const randomNumber = parseInt(Math.random() * 10000000 + '', 10);
    const email = `test${randomNumber}@hmcts.net`;
    const options = {
      url: `${serviceConfig.TribunalApiUri}/api/case`,
      qs: { email, hearingType },
      json: true,
      timeout
    };
    let body;
    try {
      body = await rp.post(options);
    } catch (error) {
      logger.error('Error at CCD createCase:', error.error);
    }
    const { id, case_reference, appellant_tya, joint_party_tya, representative_tya } = body;
    // tslint:disable-next-line:max-line-length
    console.log(`Created CCD case for ${email} with ID ${id} and reference ${case_reference} and appellant_tya ${appellant_tya} and jp_tya ${joint_party_tya} and representative_tya ${representative_tya}`);
    return { email, id, case_reference, appellant_tya, joint_party_tya, representative_tya };
}

async function createSYACase(caseType: string) {

    let caseId;
    let options;

    if (caseType === 'UC') {
        options = {
            method: 'POST',
            uri: `${serviceConfig.TribunalApiUri}/api/appeals`,
            body: ucPayload,
            json: true,
            resolveWithFullResponse: true
        };
    } else if (caseType === 'PIP') {
        options = {
            method: 'POST',
            uri: `${serviceConfig.TribunalApiUri}/api/appeals`,
            body: pipPayload,
            json: true,
            resolveWithFullResponse: true
        };
    } else if (caseType === 'ESA') {
        options = {
            method: 'POST',
            uri: `${serviceConfig.TribunalApiUri}/api/appeals`,
            body: esaPayload,
            json: true,
            resolveWithFullResponse: true
        };
    } else {
        throw 'Unsupported case type passed';
    }

    await rp.post(options)
            .then(function (response) {
                let locationUrl = response.headers['location'];
                caseId = locationUrl.substring(locationUrl.lastIndexOf('/') + 1)
            })
            .catch(function (err) {
                console.log(`Error at CCD createCase: ${err}`);
            });

    return caseId;
}

export { createCase, createSYACase };
