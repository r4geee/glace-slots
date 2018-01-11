"use strict";
var path = require("path");

var gamePage = require(path.resolve(process.cwd(), 'lib', 'pages')).gamePage;

test("Some test", () => {

    before(() => {
        SS.registerPages(gamePage);
    });

    // chunk("Open Test Page", async () => {
    //     await SS.openTestPage();
    // });

    // chunk("Make a spin", async () => {
    //     await SS.openTestPage();
    //     await SS.spin();
    // });

    chunk("Make a spin for testdata 111", async () => {
        await SS.openTestPage();
        await SS.setTestData('11122');
        await SS.spin();

        expect(await gamePage.winbox.getText()).equal('Win 60 coins');
        await SS.checkPaytableRowIsHighlighted('paytableRow111');
    });
});