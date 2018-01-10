"use strict";

var Page = require("glace-js").Page;

var gamePage = new Page(
    'http://localhost:8080', "/Test_Task.html",
    {
        spinButton : "#spinButton",
        testDataInput : "#testdata",
        currentBalanceInput : "#balance-value",
        winbox : "#winbox",
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
        paytableRow111 : ".win111",
        paytableRow1111 : ".win1111",
        paytableRow11111 : ".win11111",
        paytableRow222 : ".win222",
        paytableRow2222 : ".win2222",
        paytableRow22222 : ".win22222",
        paytableRow333 : ".win333",
        paytableRow3333 : ".win3333",
        paytableRow33333 : ".win33333",
        paytableRow444 : ".win444",
        paytableRow4444 : ".win4444",
        paytableRow44444 : ".win44444",
        paytableRow555 : ".win555",
        paytableRow5555 : ".win5555",
        paytableRow55555 : ".win55555",
    }
);

module.exports.gamePage = gamePage;