"use strict"
var path = require("path");

// var Element = require(path.resolve(__dirname, "node_modules", "glace-js", "node_modules", "glace-web", "lib", "pom","element"));
var Element = require("glace-js").Element;

var extend = () => {
    Element.prototype.getClassList = function () {
        return this._getDriver().getAttribute(this.selector, "class").then(result => {
            return result
        });
    };
};

module."use strict"
var path = require("path");

// var Element = require(path.resolve(__dirname, "node_modules", "glace-js", "node_modules", "glace-web", "lib", "pom","element"));
var Element = require("glace-js").Element;

var extend = () => {
    Element.prototype.getClassList = function () {
        return this._getDriver().getAttribute(this.selector, "class").then(result => {
            return result
        });
    };
};

module.exports.extend exports.extend = extend;