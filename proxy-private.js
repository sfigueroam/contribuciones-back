'use strict';
const proxyPublic = require('./proxy-public');

module.exports.handler = (event, context, callback) => {

    proxyPublic.handler(event, context,callback);

};

