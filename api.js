'use strict';
const util = require('./util');


module.exports.handler = (event, context, callback) => {


    let bucket = process.env.bucket;
    let path = event.path.replace('/api' , '');
    let clientId = process.env.clienteId;

    console.log('path para pillar la tontera: ' + path);

    util.getTokenByKey(bucket, clientId, function (err, data) {
        util.obtenerDatos(data, event,path, callback)
    });

};
