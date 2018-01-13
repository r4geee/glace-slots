"use strict";
var Steps = require("glace-js").Steps;
var myPages = require('../pages.js');
var payTable = require('../../game/paytable');

var gamePage = myPages.gamePage;
module.exports.register = () => {
    function getClassList(element) {
        return element._getDriver().getAttribute(element.selector, "class").then(result => {
            return result
        });
    }

    function completeTestData(testData) {
        var symbolsNeededCount = 5 - testData.length;
        var lastSymbol = testData.split('').reverse()[0];
        var extraSymbol = lastSymbol === '1'? '2' : '1';
        while (testData.length < 5) {
            testData += extraSymbol;
        }
        return testData;
    }

    Steps.register({
        openTestPage: async function () {
            await SS.openUrl("http://localhost:8080/Test_Task.html");
            // await this.openPage(gamePage.name);
            await this.pause(1, "wait for result");
        },
        spin: async function () {
            await gamePage.spinButton.click();
            await this.pause(1, "wait for result");
        },
        setTestData: async function (testData) {
            await gamePage.testDataInput.setText(testData);
        },
        checkPaytableRowIsHighlighted: async function (combination) {
            var rowIdentifier = `paytableRow${combination}`;
            var classes = await getClassList(gamePage[rowIdentifier]);

            expect(classes.split(' ').indexOf('achievement')).to.not.equal(-1);
        },
        checkWinBoxValue: async function (combination) {
            expect(await gamePage.winbox.getText()).equal(`Win ${payTable[combination]} coins`);
        },
        checkBalance: async function (combination) {
            expect(await gamePage.winbox.getText()).equal(`Win ${payTable[combination]} coins`);
        },
        spinAndCheckWinAndPaytable: async function(combination) {
            await SS.openTestPage();
            await SS.setTestData(completeTestData(combination));
            await SS.spin();
    
            await SS.checkWinBoxValue(combination);
            await SS.checkPaytableRowIsHighlighted(combination);
        }
    });
};


