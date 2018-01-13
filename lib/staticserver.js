"use strict";

var connect = require('connect');
var serveStatic = require('serve-static');
var path = require("path");

var pagePath = path.resolve(process.cwd(), 'testpage');
var runserver = () => connect().use(serveStatic(pagePath)).listen(8080, function(){
    console.log(`Server running on 8080... from ${pagePath}`);
});

module.exports.runserver = runserver;