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

        var fs = require("fs");

        var messageStream = fs.createReadStream("./test/expected.msg");
        var attachments = fs.createReadStream("./test/attachments.msg");

        it("should listen to stream messages emitted ala fetchmail - and emit parsed objects",function(done){
            messageParser.run('messageFetched',/(.*)/);


            var bus = require("corriera");

            bus.once('messageParsed', /(.*)/, function(messageObject){
                expect(messageObject.from[0].address).to.be.equal("imaptest73@gmail.com");

                done();
            });


            bus.emit('messageFetched',"any",messageStream);


        });

        it("should emit streams for attachments",function(done){
            messageParser.run('messageFetched',/(.*)/);


            var bus = require("corriera");

            bus.once('attachmentParsing', /(.*)/, function(attachment,generatedFileName,length,checksum){
                expect(generatedFileName).to.be.equal("test.txt");
                //expect(length).to.be.equal(14);
                //expect(checksum).to.be.equal("");

                var concat = require('concat-stream')
                var fs = require('fs')

                var write = concat(function(data) {
                    expect(data.toString('utf8')).to.be.equal("this is a test");
                    done();
                });

                attachment.pipe(write);

            });


            bus.emit('messageFetched',"any",attachments);


        });


       /* it("should allow to unlisten messages",function(done){
            messageParser.run('messageFetched',/(.*)/);
            messageParser.stop();


            var bus = require("corriera");

            bus.once('messageParsed', /(.*)/, function(messageObject){
                expect(messageObject).to.be.null;
            });

            setTimeout(function(){
                done();
            },1000);



            bus.emit('messageFetched',"any",messageStream);


        });*/

        it("should listen to stream messages emitted ala fetchmail",function(done){
            messageParser.run('messageFetched',/(.*)/);


            var bus = require("corriera");

            bus.once('messageParsed', /(.*)/, function(messageObject){
                expect(messageObject.from[0].address).to.be.equal("imaptest73@gmail.com");

                done();
            });


            bus.emit('messageFetched',"any",messageStream);


        });
    });
});
