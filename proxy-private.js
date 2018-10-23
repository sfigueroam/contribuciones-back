'use strict';
const proxyPublic = require('./proxy-public');

module.exports.handler = (event, context, callback) => {

    // Incorporar
    proxyPublic.handler(event, context,callback);

};

