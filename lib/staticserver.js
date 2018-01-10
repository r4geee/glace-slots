"use strict";

var connect = require('connect');
var serveStatic = require('serve-static');
var path = require("path");

var runserver = () => connect().use(serveStatic(path.resolve(process.cwd(), 'testpage'))).listen(8080, function(){
    console.log(`Server running on 8080... from ${path.resolve(process.cwd(), 'testpage')}`);
});

module.exports.runserver = runserver;