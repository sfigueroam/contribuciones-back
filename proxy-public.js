'use strict';
const util = require('./util');



module.exports.handler = (event, context, callback) => {



    /*
    console.log('event.body->', JSON.stringify(event));
    console.log('context->', JSON.stringify(context));
     */

    let bucket = process.env.bucket;
    let bucketParse = process.env.bucketParse;
    let keyParse = process.env.keyParse;
    let queryParametes = event.queryStringParameters;
    let path  = queryParametes.path;
    let idParse = path.split('\/')[1];



    util.getConfigParse(bucketParse, keyParse, idParse,  function(err, data){
        console.log('Respuesta del parse', data);
        if(data.type === 'public') {
            obtenetToken(bucket, data.clientId)
        }else{
            callback("El endpoint es privado")
        }
    });

    let obtenetToken = function (bucket, clientId){
        util.getTokenByKey(bucket, clientId, function (err, data) {
            util.obtenerDatos(data, event, callback)
        });
    };




};
