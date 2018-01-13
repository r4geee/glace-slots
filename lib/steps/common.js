"use strict";
var Steps = require("glace-js").Steps;
var myPages = require('../pages.js');
var payTable = require('../../game/paytable');

var register = () => {
    var gamePage = myPages.gamePage;

    function getClassList(element) {
        return element._getDriver().getAttribute(element.selector, "class").then(result => {
            return result
        });
    }

    function completeTestData(testData) {
        var lastSymbol = testData.split('').reverse()[0];
        var extraSymbol = lastSymbol === '1'? '2' : '1';
        while (testData.length < 5) {
            testData += extraSymbol;
        }
        return testData;
    }

    Steps.register({
        openTestPage: async function () {
            await this.openPage(gamePage.name);
            await this.pause(1, "wait for result");
        },
        spin: async function () {
            await gamePage.spinButton.click();
            await this.pause(1, "wait for result");
        },
        setTestData: async function (testData) {
            await gamePage.testDataInput.setText(testData);
        },
        setTestDataForCombination: async function (combination) {
            await SS.setTestData(completeTestData(combination));
        },
        checkPaytableRowIsHighlighted: async function (combination) {
            var rowIdentifier = `paytableRow${combination}`;
            var classes = await getClassList(gamePage[rowIdentifier]);

            expect(classes.split(' ').indexOf('achievement')).to.not.equal(-1);
        },
        checkWinBoxShown: async function () {
            expect(await gamePage.winbox.isVisible(), "Win box not shown").equal(true);
        },
        checkWinBoxNotShown: async function () {
            expect(await gamePage.winbox.isVisible(), "Win box is shown").equal(false);
        },
        checkWinBoxValue: async function (combination) {
            await SS.checkWinBoxShown();
            expect(await gamePage.winbox.getText()).equal(`Win ${payTable[combination]} coins`);
        },
        getBalance: async function () {
            var balance = await gamePage.currentBalanceInput.getText();
            return +balance;
        },
        checkBalance: async function (expectedBalance) {
            expect(await SS.getBalance()).equal(expectedBalance);
        },
        spinAndCheckWinAndPaytable: async function(combination) {
            await SS.openTestPage();
            await SS.setTestDataForCombination(combination);
            await SS.spin();

            await SS.checkWinBoxValue(combination);
            await SS.checkPaytableRowIsHighlighted(combination);
        }
    });
};

module.exports.register = register;


