"use strict";
var path = require("path");

var gamePage = require(path.resolve(process.cwd(), 'lib', 'pages')).gamePage;

test("Base", () => {

    before(() => {
        SS.registerPages(gamePage);
    });

    chunk("Open Test Page", async () => {
        await SS.openTestPage();
    });

    chunk("Make a spin", async () => {
        await SS.openTestPage();
        await SS.spin();
    });

    chunk("Make a spin for testdata 111", async () => {
        await SS.spinAndCheckWinAndPaytable('111');
    });
});

test("")