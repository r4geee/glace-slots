"use strict";
var glaceConfig = require("glace-js").config;

var setupConfig = () => {
	glaceConfig.web.use = true;
};

module.exports.setupConfig = setupConfig;