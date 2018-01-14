"use strict";
var Steps = require("glace-js").Steps;
var myPages = require('../pages.js');
var payTable = require('../../game/paytable');

var register = () => {
    var gamePage = myPages.gamePage;
    /**
     * Util function to get element classes
     *
     * @function
     * @arg {object} element - page element
     * @return {string} - classes as single string separated with space
     */
    function getClassList(element) {
        return element._getDriver().getAttribute(element.selector, "class").then(result => {
            return result;
        });
    }
    /**
     * Util function to fill testdata till length of 5
     *
     * @function
     * @arg {string} testData - initial testdata
     * @return {string} - testdata with length of 5, with '1' or '2' added
     */
    function completeTestData(testData) {
        var lastSymbol = testData.split('').reverse()[0];
        var extraSymbol = lastSymbol === '1'? '2' : '1';
        while (testData.length < 5) {
            testData += extraSymbol;
        }
        return testData;
    }
    /**
     * Util function to get reel symbol element
     *
     * @function
     * @arg {number} reelNumber - reel number
     * @arg {string} position - 'Top', 'Mid' or 'Low'
     * @return {object} - reel symbol element
     */
    function getSymbolByReelNumberAndPosition (reelNumber, position) {
        expect(['Top', 'Mid', 'Low'], "incorrect position value").to.include(position);
        return gamePage[`reel${reelNumber}${position}`];
    }
    /**
     * Util function assert that classes contain or not some class
     *
     * @function
     * @arg {string} classes - classes as single string separated with space
     * @arg {string} expectedClass - class that we check for
     * @arg {boolean} expectedResult - the expected presence or not of expectedClass
     */

    function checkIfClassIsPresent(classes, expectedClass, expectedResult) {
        expect(expectedResult).to.be.a('boolean');
        if (expectedResult) {
            expect(classes.split(' ').indexOf(expectedClass)).to.not.equal(-1);
        } else {
            expect(classes.split(' ').indexOf(expectedClass)).equal(-1);
        }
    }

    Steps.register({
        /**
         * Step to open test page
         *
         * @method
         */
        openTestPage: async function () {
            await this.openPage(gamePage.name);
            await this.pause(1, "wait for result");
        },
        /**
         * Step to make a spin
         *
         * @method
         */
        spin: async function () {
            await gamePage.spinButton.click();
            await this.pause(3, "wait for result");
        },
        /**
         * Step to set testdata to #testdata input
         *
         * @method
         * @protected
         * @arg {string} testData - string that will be set inside #testdata input
         */
        _setTestData: async function (testData) {
            await gamePage.testDataInput.setText(testData);
        },
        /**
         * Step to set testdata to #testdata input from combination that will be completed to 5 symbols if necessary
         *
         * @method
         * @arg {string} combination - combination that you want to get on the reels
         */
        setTestDataForCombination: async function (combination) {
            expect(combination).to.be.a('string');
            expect(combination.length).not.to.be.above(5);
            combination.split('').forEach(symbol => {
                expect(['1', '2', '3', '4', '5'], "incorrect combination symbol").to.include(symbol);
            });
            await SS._setTestData(completeTestData(combination));
        },
        /**
         * Step to check visibility of a reel
         *
         * @method
         * @arg {number} reelNumber - reel number from 1 to 5
         */
        checkReelIsVisible : async function(reelNumber) {
            expect(reelNumber).not.to.be.below(1);
            expect(reelNumber).not.to.be.above(5);
            expect(await gamePage[`reel${reelNumber}`].isVisible(), "Reel1 not shown").equal(true);
        },
        /**
         * Step to check visibility of a reel
         *
         * @method
         * @protected
         * @arg {number} reelNumber - reel number from 1 to 5
         * @arg {string} position - 'Top', 'Mid' or 'Low'
         * @arg {boolean} isExpected - the expected presence or not of the symbol text
         * @return {string} - text value of the symbol
         */
        _checkAndGetReelSymbol: async function (reelNumber, position, isExpected) {
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
        /**
         * Step to check that reel is empty
         *
         * @method
         * @arg {number} reelNumber - reel number from 1 to 5
         * @return {object} - text values of the symbols on reels
         */
        checkReelInitialStateAndGetSymbols: async function (reelNumber) {
            await SS.checkReelIsVisible(reelNumber);
            var Top = await SS._checkAndGetReelSymbol(reelNumber, 'Top', false);
            var Mid = await SS._checkAndGetReelSymbol(reelNumber, 'Mid', false);
            var Low = await SS._checkAndGetReelSymbol(reelNumber, 'Low', false);
            return {Top, Mid, Low};
        },
        /**
         * Step to check that reel is not empty
         *
         * @method
         * @protected
         * @arg {number} reelNumber - reel number from 1 to 5
         * @return {object} - text values of the symbols on reels
         */
        checkReelsFilledAndGetSymbols: async function (reelNumber) {
            await SS.checkReelIsVisible(reelNumber);
            var Top = await SS._checkAndGetReelSymbol(reelNumber, 'Top', true);
            var Mid = await SS._checkAndGetReelSymbol(reelNumber, 'Mid', true);
            var Low = await SS._checkAndGetReelSymbol(reelNumber, 'Low', true);
            return {Top, Mid, Low};
        },
        /**
         * Step to check that symbol is flashing green right now
         *
         * @method
         * @arg {number} reelNumber - reel number from 1 to 5
         * @arg {string} position - 'Top', 'Mid' or 'Low'
         */
        checkSymbolIsAnimating: async function (reelNumber, position) {
            await SS.checkReelIsVisible(reelNumber);
            var classes = await getClassList(getSymbolByReelNumberAndPosition(reelNumber, position));

            checkIfClassIsPresent(classes, 'blinkme', true);
        },
        /**
         * Step to check that win box is being shown right now
         *
         * @method
         * @protected
         */
        _checkWinBoxShown: async function () {
            expect(await gamePage.winbox.isVisible(), "Win box not shown").equal(true);
        },
        /**
         * Step to check that win box is not being shown right now
         *
         * @method
         */
        checkWinBoxNotShown: async function () {
            expect(await gamePage.winbox.isVisible(), "Win box is shown").equal(false);
        },
        /**
         * Step to check that currently shown Win box is displaying the correct win value
         *
         * @method
         * @arg {string} combination - combination for which you are checking
         */
        checkWinBoxValue: async function (combination) {
            await SS._checkWinBoxShown();
            expect(await gamePage.winbox.getText()).equal(`Win ${payTable[combination]} coins`);
        },
        /**
         * Step to get current balance value from #balance-value input
         *
         * @method
         * @protected
         * @arg {string} combination - combination for which you are checking
         * @return {number} - current balance value
         */
        _getBalance: async function () {
            var balance = await gamePage.currentBalanceInput.getText();
            return +balance;
        },
        /**
         * Step to set current balance value to #balance-value input
         *
         * @method
         * @arg {number} balance - balance that you want to set
         */
        setBalance: async function (balance) {
            expect(balance, "balance should be a number").to.be.a("number");
            await gamePage.currentBalanceInput.setText(balance);
        },
        /**
         * Step to assert that current balance is equal to expected
         *
         * @method
         * @arg {number} expectedBalance - balance that you expect
         */
        checkBalance: async function (expectedBalance) {
            expect(await SS._getBalance()).equal(expectedBalance);
        },
        /**
         * Step to assert paytable row for certain combination has bold text style
         *
         * @method
         * @arg {string} combination - combination for which you are checking
         * @arg {boolean} expected - is this element expected to be bold
         */
        checkPaytableRowIsHighlighted: async function (combination, expected) {
            var rowIdentifier = `paytableRow${combination}`;
            var classes = await getClassList(gamePage[rowIdentifier]);

            checkIfClassIsPresent(classes, 'achievement', expected);
        },
        /**
         * Step to assert paytable row for certain combination has bold text style
         *
         * @method
         * @return {object[]} - array of text values of the symbols on reels
         */
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


