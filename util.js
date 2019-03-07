'use strict';
const https = require('https');
const AWS = require('aws-sdk');
let s3 = new AWS.S3();

function obtenerHeaders (){
    const accessControlAllowOrigin = process.env.accessControlAllowOrigin;
    if (accessControlAllowOrigin) {
        return {
            'Access-Control-Allow-Origin': accessControlAllowOrigin, // Required for CORS support to work
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        }
    } else {
        return undefined;
    }

}


module.exports.getTokenByKey = (bucket, key, callback) => {

    const params = {
        Bucket: bucket,
        Key: key + ".response"
    };

    console.log("Obteniendo Token de acceso: ", key);
    s3.getObject(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err.stack, null);
        } else {
            let token = JSON.parse(data.Body.toString('utf-8')).access_token;
            callback(null, token);
        }
    });
}


module.exports.getConfigParse = (bucket, key, id, callback) => {

    const params = {
        Bucket: bucket,
        Key: key
    };
    console.log('Obteniendo archivo de configuración');
    s3.getObject(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err.stack, null);
        } else {
            let parse = JSON.parse(data.Body.toString('utf-8'));
            callback(null, parse[id]);
        }
    });

};

module.exports.responseOk = (output, callback) => {
    const response = {
        statusCode: 200,
        headers: obtenerHeaders(),
        body: JSON.stringify(output),
    };
    callback(null, response);
};


module.exports.validaToken = (hostname, path, token, idApp, callback) =>{

    let body = 'secret=' + idApp  +
        '&response=' + token;

    let response = {
        statusCode: 200,
        headers: obtenerHeaders(),
        body: null,
    };

    let options = {
        hostname: hostname,
        port: '443',
        path: path,
        method: 'POST',
        headers: {"Content-Type":"application/x-www-form-urlencoded; charset=utf-8"}
    };

    let responseChunks = [];
    let req = https.request(options, (res) => {
        res.on('data', (d) => {
            responseChunks.push(d);
        });
    });

    req.on('close', () => {
        response.body = responseChunks.join('');
        console.log('Response: ', response.body, response.statusCode);
        callback(null, response);
    });

    req.on('abort', () => {
        response.statusCode = 500;
        console.error('Response: ', response.statusCode);
        callback(response, null);
    });

    req.on('error', () => {
        response.statusCode = 503;
        console.error('Response: ', response.statusCode);
        callback(response, null);
    });
    req.write(body);
    req.end();
};



module.exports.obtenerDatos = (token, event, callback) => {

    let method = event.httpMethod;
    let queryParametes = event.queryStringParameters;
    let path = queryParametes.path;

    console.log('Obteniendo los datos');
    let response = {
        statusCode: 200,
        headers: obtenerHeaders(),
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

    console.log("Realizando llamada request: ", options.hostname + options.path, options.method);
    let req = https.request(options, (res) => {
        res.on('data', (d) => {
            responseChunks.push(d);
        });
    });

    req.on('close', () => {
        response.body = responseChunks.join('');
        console.log('Response: ', response.body, response.statusCode);
        callback(null, response);
    });

    req.on('abort', () => {
        response.statusCode = 500;
        console.error('Response: ', response.statusCode);
        callback(response, null);
    });

    req.on('error', () => {
        response.statusCode = 503;
        console.error('Response: ', response.statusCode);
        callback(response, null);
    });

    if (method === "POST") {
        if (event.body !== undefined && event.body !== null) {
            console.log("Body: ", event.body);
            req.write(event.body);
        } else {
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




