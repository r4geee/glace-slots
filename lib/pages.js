"use strict";

var Page = require("glace-js").Page;

var gamePage = new Page(
    'http://localhost:8080', "/Test_Task.html",
    {
        title : "#game h3",
        spinButton : "#spinButton",
        testDataInput : "#testdata",
        currentBalanceInput : "#balance-value",
        winbox : "#winbox",
        reel1 : "#reel1",
        reel2 : "#reel2",
        reel3 : "#reel3",
        reel4 : "#reel4",
        reel5 : "#reel5",
        reel1Top : "#reel1 .notch.notch1",
        reel1Mid : "#reel1 .notch.notch2",
        reel1Low : "#reel1 .notch.notch3",
        reel2Top : "#reel2 .notch.notch1",
        reel2Mid : "#reel2 .notch.notch2",
        reel2Low : "#reel2 .notch.notch3",
        reel3Top : "#reel3 .notch.notch1",
        reel3Mid : "#reel3 .notch.notch2",
        reel3Low : "#reel3 .notch.notch3",
        reel4Top : "#reel4 .notch.notch1",
        reel4Mid : "#reel4 .notch.notch2",
        reel4Low : "#reel4 .notch.notch3",
        reel5Top : "#reel5 .notch.notch1",
        reel5Mid : "#reel5 .notch.notch2",
        reel5Low : "#reel5 .notch.notch3",
        paytableTitle : "#paytable center div:nth-child(1) h4",
        paytableRow111 : "#paytable .win111",
        paytableRow1111 : "#paytable .win1111",
        paytableRow11111 : "#paytable .win11111",
        paytableRow222 : "#paytable .win222",
        paytableRow2222 : "#paytable .win2222",
        paytableRow22222 : "#paytable .win22222",
        paytableRow333 : "#paytable .win333",
        paytableRow3333 : "#paytable .win3333",
        paytableRow33333 : "#paytable .win33333",
        paytableRow444 : "#paytable .win444",
        paytableRow4444 : "#paytable .win4444",
        paytableRow44444 : "#paytable .win44444",
        paytableRow555 : "#paytable .win555",
        paytableRow5555 : "#paytable .win5555",
        paytableRow55555 : "#paytable .win55555",
        paytableDescriptionTitle : "#paytable center div:nth-child(2) h4",
        paytableDescriptionRules : "#paytable center div:nth-child(2) span",
    }
);

module.exports.gamePage = gamePage;