
var xray = require( '../test/utils/xray');

require('dotenv').config();

let executionId;

let os;

let browser;

let date;

let osType;

let env;

module.exports = function () {  
               
    return {
        noColors: true,

        async reportTaskStart (startTime, userAgents, testCount) {
            this.startTime = startTime;
            this.testCount = testCount;
    
            date = startTime.toString().split(' ');
            browser = userAgents[0].split(' ')[0];
            os = userAgents[0].split('/')[1];              
        },
    
        async reportFixtureStart (name, path, meta) {
            this.currentFixtureName = name;
        },

        async reportTestStart (/* name, meta */) {
           
        },
    
        async reportTestDone (name, testRunInfo, meta) {

            // Create Test Execution
            if (os.includes('mac') || os.includes('OS X')) {
                osType = 'Mac';    
                env = `${osType} ${browser}`;        
            }
            else if (os.includes('Windows')) {
                osType = 'Windows';
                env = `${osType} ${browser}`;
            }
            else if (os.includes('iOS') || os.includes('Android')) {
                var deviceName = process.env['MOBILE_DEVICE_NAME'];

                osType = os.includes('iOS') ? 'ios' : 'android';
                env = `${deviceName} ${browser}`;
            }
            else 
                env = `${os} ${browser}`;
            
             
            const day = `${date[1]}-${date[2]}-${date[3]}`;      

            executionId = await xray.createTestExecution(osType, env, day);  

            const errors      = testRunInfo.errs;      
            const hasErrors   = !!errors.length;    
            const result      = hasErrors ? 'failed' : 'passed';        
            
            // Get JIRA issue Id for the Test
            const testKey = name.split(' ')[0];        
            const testIssueId = await xray.getIssueId(testKey);
    
            // Get Test Run Id for the Test in Test Execution
            var getTestRunData = await xray.getTestRun(testIssueId, executionId);
            var testRunId;

            if (getTestRunData.data.getTestRun != null) 
                testRunId = getTestRunData.data.getTestRun.id;
            else {
                await xray.addTestToTestExecution(testIssueId, executionId);
                getTestRunData = await xray.getTestRun(testIssueId, executionId);
                testRunId = getTestRunData.data.getTestRun.id;
            }
    
            // Get Test Execution result
            var testRunStatus = ''; 

            if (result == 'failed') 
                testRunStatus = 'FAILED';
            else if (testRunInfo.skipped) 
                testRunStatus = 'SKIPPED';
            else 
                testRunStatus = 'PASSED';
              
    
            // Update the Test Run
            await xray.updateTestRunStatus(testRunId, testRunStatus);
              
            // Get Error message if failed
            var testRunError = '';
            var errorsInfo =  testRunInfo.errs;

            if (testRunStatus == 'FAILED') {                      
                errorsInfo.forEach(function (error) {          
                    testRunError += error.errMsg;
                });                
            }
    
            // Add artifacts for Failures
            if (testRunStatus == 'FAILED') {
                // Add Error message as comments to Test Run
                await xray.addCommentToTestRun(testRunId, testRunError);
                
                // Add Evidence Screenshots to Test Run                
                for (let i = 1; i <= testRunInfo.screenshots.length; i++) {                    
                    var imagePaths = testRunInfo.screenshots[i - 1].screenshotPath;
                    var imageData = await xray.base64_encode(imagePaths);

                    await xray.addEvidenceToTestRun(testRunId, imageData, i);
                }
            }  
            
        },
    
        async reportTaskDone (/*endTime, passed, warnings, result*/) {
            
        }
    
    };
};


