# testcafe-reporter-xray-jira
[![Build Status](https://travis-ci.org/Vooha-QualiTlabs/testcafe-reporter-xray-jira.svg)](https://travis-ci.org/Vooha-QualiTlabs/testcafe-reporter-xray-jira)

This is the **xray-jira** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

## How it Works?

This reporter creates Test Execution for the current Execution with `Test Execution for Windows Chrome Feb-dd-2022` format. Adds the Tests to the Test Run and update the Results to the Test Runs. It adds Screenshots as Evidence and Errors as comment to the Failed Tests.

Define the test as below:

test('**XRAY-50** Test Fuctionality name', async () => {

// Do Some thing

});

`Jira Test Id should be added to the name of the Test case -- XRAY-50` 

## Install

```
npm install testcafe-reporter-xray-jira
```
## Define env variables

```
JIRA_BASE_URL= https://xxxx.atlassian.net/ 
JIRA_AUTH = Basic xxxxxxxxxxxxx
JIRA_PROJECT_KEY= YOUR_JIRA_PROJECT_KEY
XRAY_CLIENT_ID = YOU_CAN_GET_IT_FROM_XRAY_API_KEYS
XRAY_CLIENT_SECRET = YOU_CAN_GET_IT_FROM_XRAY_API_KEYS
MOBILE_DEVICE_NAME = MOBILE_DEVICE_NAME_IF_YOU_ARE_RUNNING_IN_MOBILES
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter xray-jira
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('xray-jira') // <-
    .run();
```

## Author
VoohaN 
