/*
 * message-parser
 * https://github.com/parroit/message-parser
 *
 * Copyright (c) 2013 parroit
 * Licensed under the MIT license.
 */

'use strict';

var bus = require("corriera");


function MessageParser(){}

exports.MessageParser = MessageParser;

MessageParser.prototype.stop = function(){
    bus.removeListener(this.event, this.listener);
};

MessageParser.prototype.run = function(event, selector) {
    var eventError = "Please provide a non-empty string event name";
    if (typeof (event) !== 'string') {
        throw new Error(eventError);
    }

    if (event == '') {
        throw new Error(eventError);
    }

    if (!(selector instanceof RegExp)) {
        throw new Error("Please provide a regex selector");
    }

    var MailParser = require("mailparser").MailParser;
    var mp = new MailParser({
        streamAttachments: true
    });



    mp.on("attachment", function(attachment){
        //console.dir(attachment);
        bus.emit(
            'attachmentParsing',
            'any',
            attachment.stream,
            attachment.generatedFileName,
            attachment.length,
            attachment.checksum
        );
    });


    mp.on("end", function(mailObject){
        bus.emit('messageParsed','any',mailObject);
    });

    this.event = event;

    this.listener = function (messageStream) {
        messageStream.pipe(mp);
    };
    bus.on(event,selector, this.listener);


};

