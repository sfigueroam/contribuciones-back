'use strict';
const proxyPublic = require('./proxy-public');

module.exports.handler = (event, context, callback) => {

    console.log("llamada Privada");
    // Incorporar
    proxyPublic.handler(event, context,callback);

};

