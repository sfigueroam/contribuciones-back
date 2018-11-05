'use strict';
const util = require('./util');
const https = require('https');

module.exports.handler = (event, context, callback) => {



    /*
    console.log('event.body->', JSON.stringify(event));
    console.log('context->', JSON.stringify(context));
     */
    let method = event.httpMethod;
    let bucket = process.env.bucket;
    let bucketParse = process.env.bucketParse;
    let keyParse = process.env.keyParse;
    let queryParametes = event.queryStringParameters;
    let path  = queryParametes.path;
    let idParse = path.split('\/')[1];



    util.getConfigParse(bucketParse, keyParse, idParse,  function(err, clientId){
        obtenetToken(bucket, clientId)
    });

    let obtenetToken = function (bucket, clientId){
        util.getTokenByKey(bucket, clientId, function (err, data) {
            obtenerDatos(data)
        });
    };



    let obtenerDatos = function (token) {

        let response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: null,
        };

        let responseChunks = [];
        let options = {
            hostname: process.env.wsHostname,
            port: process.env.wsPort,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        let req = https.request(options, (res) => {
            res.on('data', (d) => {
                responseChunks.push(d);
                //console.log('responseChunks.join()->', responseChunks.join());
            });
        });

        req.on('close', () => {
            response.body =  responseChunks.join('');
            callback(null, response);
        });

        req.on('abort', () => {
            response.statusCode = 500;
            callback(response, null);
        });

        req.on('error', () => {
            response.statusCode = 503;
            callback(response, null);
        });

        if(method === "POST" ) {
            req.write(event.body);
        }
        req.end();
    }
};
