/*
 * message-parser
 * https://github.com/parroit/message-parser
 *
 * Copyright (c) 2013 parroit
 * Licensed under the MIT license.
 */


'use strict';

var messageParser = require('../lib/message-parser.js');


var expect = require('chai').expect;
require('chai').should();


describe('messageParser',function(){
    describe("module",function() {
        it("should load",function(){
            expect(messageParser).not.to.be.equal(null);
            expect(messageParser).to.be.a('object');

        })
    });
});
