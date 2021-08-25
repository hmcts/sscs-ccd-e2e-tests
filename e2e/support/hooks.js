var { After} = require('cucumber');
var  { browser } = require('protractor');

After(async function(scenario) {

    console.log(`Scenario results are ################ ${scenario.result.status}`);
    if (scenario.result.status === 'failed') {
            const screenShot = await browser.takeScreenshot();
            this.attach(screenShot, "image/png");

            //fetch browser logs
            let browserLog = await browser.manage().logs().get('browser');
            let browserErrorLogs = []
            for (let browserLogCounter = 0; browserLogCounter < browserLog.length; browserLogCounter++) {
                if (browserLog[browserLogCounter].level.value > 900) {
                    browserErrorLogs.push(browserLog[browserLogCounter]);
                }
            }
            try {
                this.attach(JSON.stringify(browserErrorLogs, null, 2));
            }
            catch(err) {
                 console.log("Error occured adding message to report. " + err.stack);
            }
            console.log(JSON.stringify(browserErrorLogs, null, 2));
    }
});