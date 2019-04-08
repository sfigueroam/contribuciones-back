'use strict';
const requestElastic = require('../util').elastic;

module.exports.handler =  (event, context, callback) => {

    console.log("Obteniendo Localidad");

    const body = {
        size: 400,
        from: 0
    };
    let options = {
        host: process.env.elasticsearchUrl,
        path: '/localidad/_search',
        method: 'POST',
        port: 443,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    requestElastic(options, body, callback)

}
