'use strict';
const proxyPublic = require('./proxy-public');

module.exports.handler = (event, context, callback) => {


    let bucket = process.env.bucket;
    let bucketParse = process.env.bucketParse;
    let keyParse = process.env.keyParse;
    let queryParametes = event.queryStringParameters;
    let path  = queryParametes.path;
    let idParse = path.split('\/')[1];

    util.getConfigParse(bucketParse, keyParse, idParse,  function(err, data){
        obtenetToken(bucket, data.clientId)
    });

    let obtenetToken = function (bucket, clientId){
        util.getTokenByKey(bucket, clientId, function (err, data) {
            util.obtenerDatos(data, event, callback)
        });
    };


};

