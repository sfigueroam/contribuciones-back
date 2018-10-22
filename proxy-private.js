'use strict';
const util = require('./util');
const https = require('https');

module.exports.handler = (event, context, callback) => {


    console.log('event.body', JSON.stringify(event));

    console.log('context', JSON.stringify(context));


    let clienteId = 'OauthBienRaizRolinClient';


    util.getTokenByKey(clienteId + '.response', function (err, data) {
        let body = JSON.parse(data.Body.toString('utf-8'));
        obtenerDatos(body.access_token, clienteId);
    });

    let obtenerDatos = function (token, clienteId) {
        token='AAEYT2F1dGhCaWVuUmFpelJvbGluQ2xpZW50ITMlIOKRvu58WnYUGp51iZOFVl42uM9cDkazUlgOlLAlaEupDpGumuVPXyt_a9au1p1kJu266QeBpeDZvRcjHih2JpqTkaoA569Rhv7_PFNciXzLGUIgw-QGjthqPHKsrZZ58PlkmJbeFlnjOg81Lg';
        console.log(token)

        let responseChunks = [];
        let options = {
            hostname: 'wstest.tesoreria.cl',
            port: 443,
            path: '/ClienteBienRaizWS/api/BienRaiz/asociado/obtener/96597810',
            method: 'GET',
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
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify({
                    message: 'Go Serverless v1.1! Your function executed successfully!',
                    output: responseChunks.join()
                }),
            };
            callback(null, response);
        });
        req.end();
    }
};

