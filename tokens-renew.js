'use strict';
const https = require('https');
const querystring = require('querystring');
const AWS = require('aws-sdk');
let s3 = new AWS.S3();

module.exports.handler = (event, context, callback) => {

    console.log('Renovando token Contribución');
    let grantType =  process.env.tokenGrantType;

    let contTokenClientId = process.env.contTokenClienteId;
    let contTokenScope = process.env.contTokenScope;
    let contTokenClientSecret =  process.env.contTokenClienteSecret;

    renew(contTokenClientId, contTokenClientSecret, contTokenScope, grantType);

    let cuentTokenClientId = process.env.cuentTokenClienteId;
    let cuentTokenScope = process.env.cuentTokenScope;
    let cuentTokenClientSecret =  process.env.cuentTokenClienteSecret;

    renew(cuentTokenClientId, cuentTokenClientSecret, cuentTokenScope, grantType);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


function renew(clienteId, clientSecret, scope, grantType){
    let bucket = process.env.bucket;
    let count = 0;

    console.log("Renovando token: ", clienteId);
    let options = {
        hostname: process.env.wsHostname,
        port: process.env.wsPort,
        path: '/TokenRest/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    };
    let data = {
        "grant_type": grantType,
        "client_secret": clientSecret,
        "client_id": clienteId,
        "scope": scope
    };

    let postData = querystring.stringify(data);
    options.headers['Content-Length'] = Buffer.byteLength(postData);
    let responseChunks = [];

    console.log('Obtiendo token: ', options, data)
    let req = https.request(options, (res) => {
        res.on('data', (d) => {
            responseChunks.push(d);
            console.log('Token Obtenido', responseChunks.join('').toString())
        });
    });

    req.write(postData);
    req.on('error', (e) => {
        console.error(e);
    });
    req.on('close', () => {
        var params = {
            Body: responseChunks.join('').toString(),
            Bucket: bucket,
            Key: clienteId + ".response"
        };

        console.log('Actualizando s3,  parametros: ', params);
        s3.putObject(params, function (err, data) {
            if (err)
                console.log(err, err.stack); // an error occurred
            else {
                console.log("Token actualizado con exito en s3, archivo: ", params.Key);
                //callback(null, responseChunks.join('').toString());
            }
        });
    });
    req.end();
}
