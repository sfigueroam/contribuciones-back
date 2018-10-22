'use strict';
const util = require('./util');
const https = require('https');

module.exports.handler = (event, context, callback) => {


    let request = [];

    console.log('event.body->', JSON.stringify(event));
    console.log('context->', JSON.stringify(context));

    let method = event.httpMethod;
    request['method'] = method;
    if(method === 'POST'){
        let bodyEvent = JSON.parse(event.body);
        request['clientId'] = bodyEvent.clientId;
        request['path'] = bodyEvent.path;
        if(bodyEvent.body !== undefined) request['body'] = bodyEvent.body;
    }else if (method === 'GET'){
        let queryParametes = JSON.parse(event.queryStringParameters);
        request['clientId'] =queryParametes.clientId;
        request['path'] = queryParametes.path;
    }

    util.getTokenByKey(request['clientId'], function (err, data) {
        obtenerDatos(data, request);
    });

    let obtenerDatos = function (token, request) {
        console.info('toke->', token);
        let responseChunks = [];
        let options = {
            hostname: process.env.wsHostname,
            port: process.env.wsPort,
            path: request['path'],
            method: request['method'],
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var req = https.request(options, (res) => {
            res.on('data', (d) => {
                responseChunks.push(d);
            });
        });

        req.on('close', () => {
            util.responseOk(JSON.parse(responseChunks.join()), callback);
        });

        if(request['body'] !== undefined) {
            req.write(JSON.stringify(request['body']));
        }
        req.end();
    }
};
