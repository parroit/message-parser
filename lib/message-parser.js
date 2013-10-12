/*
 * message-parser
 * https://github.com/parroit/message-parser
 *
 * Copyright (c) 2013 parroit
 * Licensed under the MIT license.
 */

'use strict';

exports.run = function(event, selector) {
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


    var bus = require("corriera");

    mp.on("attachment", function(attachment){
        bus.emit(
            'attachmentParsing',
            'any',
            attachment,
            attachment.generatedFileName,
            attachment.length,
            attachment.checksum
        );
    });


    mp.on("end", function(mailObject){
        bus.emit('messageParsed','any',mailObject);
    });

    bus.on(event,selector,function(messageStream){
        messageStream.pipe(mp);
    });

    return 'awesome';
};
