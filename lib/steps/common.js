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

    function getSymbolByReelNumberAndPosition (reelNumber, position) {
        expect(['Top', 'Mid', 'Low'], "incorrect position value").to.include(position);
        return gamePage[`reel${reelNumber}${position}`];
    }

    function checkIfClassIsPresent(classes, expectedClass, expectedResult) {
        expect(expectedResult).to.be.a('boolean');
        if (expectedResult) {
            expect(classes.split(' ').indexOf(expectedClass)).to.not.equal(-1);
        } else {
            expect(classes.split(' ').indexOf(expectedClass)).equal(-1);
        }
    }

    Steps.register({
        openTestPage: async function () {
            await this.openPage(gamePage.name);
            await this.pause(1, "wait for result");
        },
        spin: async function () {
            await gamePage.spinButton.click();
            await this.pause(3, "wait for result");
        },
        setTestData: async function (testData) {
            await gamePage.testDataInput.setText(testData);
        },
        setTestDataForCombination: async function (combination) {
            expect(combination).to.be.a('string');
            expect(combination.length).not.to.be.above(5);
            combination.split('').forEach(symbol => {
                expect(['1', '2', '3', '4', '5'], "incorrect combination symbol").to.include(symbol);
            });
            await SS.setTestData(completeTestData(combination));
        },
        checkReelIsVisible : async function(reelNumber) {
            expect(reelNumber).not.to.be.below(1);
            expect(reelNumber).not.to.be.above(5);
            expect(await gamePage[`reel${reelNumber}`].isVisible(), "Reel1 not shown").equal(true);
        },

        checkAndGetReelSymbol: async function (reelNumber, position, isExpected) {
            var text = await getSymbolByReelNumberAndPosition(reelNumber, position).getText();
            expect(isExpected, "isExpected should be boolean").to.be.a('boolean');
            if (isExpected) {
                expect(text, `There is no symbol on Reel${reelNumber}${position}`).not.to.be.null;
                return text;
            } else {
                expect(text, `There is a symbol on Reel${reelNumber}${position}`).to.be.null;
                return null;
            }
        },
        checkReelInitialStateAndGetSymbols: async function (reelNumber) {
            await SS.checkReelIsVisible(reelNumber);
            var Top = await SS.checkAndGetReelSymbol(reelNumber, 'Top', false);
            var Mid = await SS.checkAndGetReelSymbol(reelNumber, 'Mid', false);
            var Low = await SS.checkAndGetReelSymbol(reelNumber, 'Low', false);
            return {Top, Mid, Low};
        },
        checkReelsFilledAndGetSymbols: async function (reelNumber) {
            await SS.checkReelIsVisible(reelNumber);
            var Top = await SS.checkAndGetReelSymbol(reelNumber, 'Top', true);
            var Mid = await SS.checkAndGetReelSymbol(reelNumber, 'Mid', true);
            var Low = await SS.checkAndGetReelSymbol(reelNumber, 'Low', true);
            return {Top, Mid, Low};
        },
        checkSymbolIsAnimating: async function (reelNumber, position) {
            await SS.checkReelIsVisible(reelNumber);
            var classes = await getClassList(getSymbolByReelNumberAndPosition(reelNumber, position));

            checkIfClassIsPresent(classes, 'blinkme', true);
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
        setBalance: async function (balance) {
            expect(balance, "balance should be a number").to.be.a("number");
            await gamePage.currentBalanceInput.setText(balance);
        },
        checkBalance: async function (expectedBalance) {
            expect(await SS.getBalance()).equal(expectedBalance);
        },
        checkPaytableRowIsHighlighted: async function (combination, expected) {
            var rowIdentifier = `paytableRow${combination}`;
            var classes = await getClassList(gamePage[rowIdentifier]);

            checkIfClassIsPresent(classes, 'achievement', expected);
        },
        checkSpinAndGetResult: async function () {
            await SS.spin();
            return [
                await SS.checkReelsFilledAndGetSymbols(1),
                await SS.checkReelsFilledAndGetSymbols(2),
                await SS.checkReelsFilledAndGetSymbols(3),
                await SS.checkReelsFilledAndGetSymbols(4),
                await SS.checkReelsFilledAndGetSymbols(5),
            ]
        },
    });
};

module.exports.register = register;


