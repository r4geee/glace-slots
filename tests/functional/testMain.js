"use strict";
var path = require("path");
var payTable = require('../../game/paytable');

var gamePage = require(path.resolve(process.cwd(), 'lib', 'pages')).gamePage;

scope("Reels and console", () => {
    before(() => {
        SS.registerPages(gamePage);
    });

    test("Reels and console UI", () => {
        //Enter the game, check the interface. Reels should be empty.
        chunk("Enter the game, check the interface", async () => {
            await SS.openTestPage();
            expect(await gamePage.title.isVisible(), "Title not shown").equal(true);
            expect(await gamePage.spinButton.isVisible(), "Spin button not shown").equal(true);
            expect(await gamePage.currentBalanceInput.isVisible(), "Current balance input not shown").equal(true);
            await SS.checkWinBoxNotShown();
            await SS.checkReelIsVisible(1);
            await SS.checkReelIsVisible(2);
            await SS.checkReelIsVisible(3);
            await SS.checkReelIsVisible(4);
            await SS.checkReelIsVisible(5);
        });
    });

    test("Empty reels and 1000 balance on enter", async () => {
        //Enter the game, check reels. Reels should be empty. Check that balance is 1000.
        chunk("Enter the game, check reels. Reels should be empty. Check that balance is 1000.", async () => {
            await SS.openTestPage();
            await SS.checkReelInitialStateAndGetSymbols(1);
            await SS.checkReelInitialStateAndGetSymbols(2);
            await SS.checkReelInitialStateAndGetSymbols(3);
            await SS.checkReelInitialStateAndGetSymbols(4);
            await SS.checkReelInitialStateAndGetSymbols(5);
            await SS.checkBalance(1000);
        });
    });

    test("Check that you can spin", async () => {
        //Enter the game, make a spin. Check that reels have a combination.
        chunk("Enter the game, make a spin. Check that reels have a combination.", async () => {
            await SS.openTestPage();
            await SS.checkSpinAndGetResult();
        });
    });

    test("Check that you can spin multiple times", async () => {
        //Enter the game, make a spin. Check that reels have a combination.
        //Spin again, check that you have new combination.
        chunk("Reel state should change on second spin", async () => {
            await SS.openTestPage();
            var firstSpinResult = await SS.checkSpinAndGetResult();
            await SS.pause(4, "wait for spin button to activate");
            var secondSpinResult = await SS.checkSpinAndGetResult();
            for (var i = 0; i < 5; i++) {
                expect(firstSpinResult[0]).to.not.equal(secondSpinResult[0]);
            }
        });
    });

    test("Losing Spin", async () => {
        //Enter the game, make a losing spin. Ensure no win box. Balance has decreased by 1.
        chunk("Losing spin. Ensure no win box. Balance has decreased.", async () => {
            await SS.openTestPage();
            await SS.setTestDataForCombination("23132");
            await SS.spin();
            await SS.checkWinBoxNotShown();
            await SS.checkBalance(999);
        });
    });

    test("Winning spin", async () => {
        //Enter the game, make a winning spin with some winning combination.
        //Balance should increase correctly. Win box shown. Win box shows correct value.
        //Reels are animating correctly. You can't spin during win.
        chunk("Winning spin and all the animations and functionality", async () => {
            var combination = '111';
            var expectedWin = payTable[combination];

            await SS.openTestPage();
            await SS.setTestDataForCombination(combination);
            await SS.spin();
            await SS.checkBalance(1000 - 1 + expectedWin);
            await SS.checkWinBoxValue(combination);

            await SS.checkSymbolIsAnimating(1, 'Mid');
            await SS.checkSymbolIsAnimating(2, 'Mid');
            await SS.checkSymbolIsAnimating(3, 'Mid');
        });
    });

    test("Check every combination win amount and win box", async () => {
        //Enter the game, make a spin with each combination.
        //Check that win is granted. Check how balance increases.

        for (let combination in payTable) {
            if (payTable.hasOwnProperty(combination)) {
                chunk(`Combination: ${combination}`, async () => {
                    var expectedWin = payTable[combination];

                    await SS.openTestPage();
                    await SS.setTestDataForCombination(combination);
                    await SS.spin();

                    await SS.checkBalance(1000 - 1 + expectedWin);
                    await SS.checkWinBoxValue(combination);
                });
            }
        }
    });

    test("You cant spin with balance zero", async () => {
        //Enter the game, set balance zero. Make a spin.
        //Ensure that balance is still zero and reels are the same.
        chunk("Set balance zero. Make a spin. Ensure that balance is still zero and reels are the same.", async () => {

            await SS.openTestPage();
            await SS.setBalance(0);
            await SS.spin();

            await SS.checkReelInitialStateAndGetSymbols(1);
            await SS.checkReelInitialStateAndGetSymbols(2);
            await SS.checkReelInitialStateAndGetSymbols(3);
            await SS.checkReelInitialStateAndGetSymbols(4);
            await SS.checkReelInitialStateAndGetSymbols(5);
            await SS.checkBalance(0);
        });
    });
});

scope("Paytables", () => {
    before(() => {
        SS.registerPages(gamePage);
    });

    test("Check paytables UI", () => {
        //Enter the game, check the interface. Reels should be empty.
        chunk("Enter the game, check all UI elements.", async () => {
            await SS.openTestPage();
            expect(await gamePage.paytableTitle.isVisible(), "Paytables title not shown").equal(true);
            expect(await gamePage.paytableDescriptionTitle.isVisible(), "Paytables description title not shown").equal(true);
            expect(await gamePage.paytableDescriptionRules.isVisible(), "Paytables description rules not shown").equal(true);
        });

        for (let combination in payTable) {
            if (payTable.hasOwnProperty(combination)) {
                chunk(`Paytable row for combination ${combination}`, async () => {
                    expect(await gamePage[`paytableRow${combination}`].isVisible(), `PaytableRow for ${combination} not shown`).equal(true);
                });
            }
        }
    });

    test("Losing spin should not unlock anything", () => {
        //Enter the game, make a losing spin. Ensure that no row is highlighted.
        chunk("Row doesn't get highlighted on a loss", async () => {
            await SS.openTestPage();
            await SS.setTestDataForCombination("23132");
            await SS.spin();
        });

        for (let combination in payTable) {
            if (payTable.hasOwnProperty(combination)) {
                chunk(`Paytable row for combination ${combination} should not be highlighted`, async () => {
                    await SS.checkPaytableRowIsHighlighted(combination, false);
                });
            }
        }
    });

    test("Winning spins should highlight the correct row.", () => {
        //Enter the game, make a spin with each combination. Check that correct row is highlighted.
        for (let combination in payTable) {
            if (payTable.hasOwnProperty(combination)) {
                chunk(`Paytable row for combination ${combination} should be highlighted, while for others not`, async () => {
                    await SS.openTestPage();
                    await SS.setTestDataForCombination(combination);
                    await SS.spin();
                    await SS.checkPaytableRowIsHighlighted(combination, true);

                    for (let otherCombination in payTable) {
                        if (payTable.hasOwnProperty(otherCombination)) {
                            if (otherCombination !== combination) {
                                await SS.checkPaytableRowIsHighlighted(otherCombination, false);
                            }
                        }
                    }
                });
            }
        }
    });

    test("Win with same combination twice.", () => {
        //Enter the game, make two spins with same winning combination.
        //Ensure that it gets highlighted once and stays like this.
        for (let combination in payTable) {
            if (payTable.hasOwnProperty(combination)) {
                chunk(`Paytable row for combination ${combination} stays highlighted`, async () => {
                    await SS.openTestPage();
                    await SS.setTestDataForCombination(combination);
                    await SS.spin();
                    await SS.checkPaytableRowIsHighlighted(combination, true);
                    await SS.pause(4, "wait for spin button to activate");

                    await SS.spin();
                    await SS.checkPaytableRowIsHighlighted(combination, true);
                });
            }
        }
    });
});
