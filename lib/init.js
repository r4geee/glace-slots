"use strict";

require('./steps/common').register();
require('./staticserver').runserver();

var run = () => require("glace-js").run(process.exit);
module.exports.run = run;