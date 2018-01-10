"use strict";
var Steps = require("glace-js").Steps;
var myPages = require('../pages.js');

var gamePage = myPages.gamePage;
module.exports.register = () => {
    Steps.register({
        openTestPage: async function () {
            await SS.openUrl("http://localhost:8080/Test_Task.html");
            // await this.openPage(gamePage.name);
            await this.pause(1, "wait for result");
        },
    });

    Steps.register({
        spin: async function () {
            await gamePage.spinButton.click();
            await this.pause(1, "wait for result");
        },
    });

    Steps.register({
        setTestData: async function (testData) {
            await gamePage.testDataInput.setText(testData);
        },
    });
};


