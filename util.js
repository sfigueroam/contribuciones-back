'use strict';

const AWS = require('aws-sdk');
let s3 = new AWS.S3();

module.exports.getTokenByKey = (key, callback) => {

    var params = {
        Bucket: "tgr-tokens-proxies-poc",
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


module.exports.getList = (callback) => {
    var params = {
        Bucket: "tgr-tokens-proxies-poc"
    };
    s3.listObjects(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err.stack, null);
        } else {
            console.log('s3.listObjects', data);
            callback(null, data);
        }
    });
}

module.exports.responseOk = (output, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify({
            message: 'Go Serverless v1.1! Your function executed successfully!',
            output: output
        }),
    };
    callback(null, response);
};

module.exports.responseNOk = (output, callback) => {
    const response = {
        statusCode: 500,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify({
            message: 'error interno',
        }),
    };
    callback(null, response);
};