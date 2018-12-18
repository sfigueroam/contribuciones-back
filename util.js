'use strict';

const AWS = require('aws-sdk');
let s3 = new AWS.S3();

module.exports.getTokenByKey = (bucket, key, callback) => {

    const params = {
        Bucket: bucket,
        Key: key + ".response"
    };


    s3.getObject(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err.stack, null);
        } else {
            let token =  JSON.parse(data.Body.toString('utf-8')).access_token;
            callback(null, token);
        }
    });
}


module.exports.getConfigParse = (bucket, key,id,  callback) =>{

    const params = {
        Bucket: bucket,
        Key: key
    };

    s3.getObject(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err.stack, null);
        } else {
            let parse = JSON.parse(data.Body.toString('utf-8'));
            callback(null,  parse[id]);
        }
    });

};

module.exports.responseOk = (output, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify(output),
    };
    callback(null, response);
};

module.exports.obtenerDatos = (token, event, callback) => {

    let method = event.httpMethod;
    let queryParametes = event.queryStringParameters;
    let path  = queryParametes.path;

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
        if (event.body !== undefined && event.body !== null) {
            req.write(event.body);
        }else{
            req.write();
        }
    }
    req.end();
}
/*
module.exports.responseOptions = (callback) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        }
    };
    callback(null, response);
};
*/