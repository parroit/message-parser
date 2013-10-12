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

        });
    });

    describe("messageParser",function() {
        it("should throw on non regexp option argument",function(){
            (function () {
                messageParser.run(null,'','');
            }).should.throw(Error);

            (function () {
                messageParser.run(undefined,'','');
            }).should.throw(Error);

            (function () {
                messageParser.run(true,'','');
            }).should.throw(Error);

            (function () {
                messageParser.run({},'','');
            }).should.throw(Error);

            (function () {
                messageParser.run(42,'','');
            }).should.throw(Error);

            (function () {
                messageParser.run('some options','','');
            }).should.throw(Error);

            (function () {
                messageParser.run(function(){},'','');
            }).should.throw(Error);

        });


        it("should throw on non string event name",function(){
            (function () {
                messageParser.run(null,'','');
            }).should.throw(Error);

            (function () {
                messageParser.run(undefined,'','');
            }).should.throw(Error);

            (function () {
                messageParser.run(true,'','');
            }).should.throw(Error);

            (function () {
                messageParser.run(/ /,'','');
            }).should.throw(Error);

            (function () {
                messageParser.run(42,'','');
            }).should.throw(Error);

            (function () {
                messageParser.run({},'','');
            }).should.throw(Error);

            (function () {
                messageParser.run(function(){},'','');
            }).should.throw(Error);

        });
        it("should listen to stream messages emitted ala fetchmail",function(done){
            messageParser.run('messageFetched',/.*/);


            var bus = require("corriera");
            var fs = require("fs");

            bus.once('messageParsed', /.*/, function(messageObject){
                expect(messageObject.from[0].address).to.be.equal("imaptest73@gmail.com");

                done();
            });

            var messageStream = fs.createReadStream("./test/expected.msg");
            bus.emit('messageFetched',"any",messageStream);


        });
    });
});
