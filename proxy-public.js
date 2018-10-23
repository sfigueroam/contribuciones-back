'use strict';
const util = require('./util');
const https = require('https');

module.exports.handler = (event, context, callback) => {


    /*
    console.log('event.body->', JSON.stringify(event));
    console.log('context->', JSON.stringify(context));
     */

    let bucket = process.env.bucket;
    let bucketParse = process.env.bucketParse;
    let keyParse = process.env.keyParse;
    let method = event.httpMethod;
    let queryParametes = event.queryStringParameters;
    let path  = queryParametes.path;
    let idParse = path.split('\/')[1];

    util.getConfigParse(bucketParse, keyParse, idParse,  function(err, clientId){
        obtenetToken(bucket, clientId)
    });

    let obtenetToken = function (bucket, clientId){
        util.getTokenByKey(bucket, clientId, function (err, data) {
            obtenerDatos(data);
        });
    };
    let obtenerDatos = function (token) {
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
            });
        });

        req.on('close', () => {
            util.responseOk(JSON.parse(responseChunks.join()), callback);
        });

        if(method === "POST" ) {
            req.write(event.body);
        }
        req.end();
    }
};
