'use strict';
const util = require('./util');
const https = require('https');

module.exports.handler = (event, context, callback) => {

    util.getList(function (err, data) {

        let body = data;
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: JSON.stringify({
                message: 'Go Serverless v1.1! Your function executed successfully!',
                output: body
            }),
        };
        callback(null, response);

    });
}


